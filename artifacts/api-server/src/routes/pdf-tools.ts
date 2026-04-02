import { Router, type IRouter } from "express";
import multer from "multer";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { logger } from "../lib/logger";
import OpenAI from "openai";

const router: IRouter = Router();

function getMistralClient() {
  if (!process.env.MISTRAL_API_KEY) {
    throw new Error("MISTRAL_API_KEY is not configured");
  }
  return new OpenAI({
    baseURL: "https://api.mistral.ai/v1",
    apiKey: process.env.MISTRAL_API_KEY,
  });
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 },
});

function sendError(res: any, status: number, message: string): void {
  res.status(status).json({ error: "Error", message });
}


async function extractPdfText(buffer: Buffer): Promise<string> {
  const pdfParse = (await import("pdf-parse")).default;
  const data = await pdfParse(buffer);
  return data.text || "";
}

router.post("/pdf/page-count", upload.single("file"), async (req, res): Promise<void> => {
  try {
    if (!req.file) { sendError(res, 400, "No file provided"); return; }
    const pdfDoc = await PDFDocument.load(req.file.buffer, { ignoreEncryption: true });
    res.json({ pageCount: pdfDoc.getPageCount() });
  } catch (err) {
    req.log.error({ err }, "Error getting page count");
    sendError(res, 500, "Failed to get page count");
  }
});

router.post("/pdf/organize", upload.single("file"), async (req, res): Promise<void> => {
  try {
    if (!req.file) { sendError(res, 400, "No file provided"); return; }
    const orderStr = req.body.order;
    if (!orderStr) { sendError(res, 400, "No page order provided"); return; }
    const order: number[] = JSON.parse(orderStr);
    const srcDoc = await PDFDocument.load(req.file.buffer);
    const newDoc = await PDFDocument.create();
    const pages = await newDoc.copyPages(srcDoc, order);
    pages.forEach(p => newDoc.addPage(p));
    const pdfBytes = await newDoc.save();
    res.set({ "Content-Type": "application/pdf", "Content-Disposition": "attachment; filename=organized.pdf" });
    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    req.log.error({ err }, "Error organizing PDF");
    sendError(res, 500, "Failed to organize PDF");
  }
});

router.post("/pdf/ocr", upload.single("file"), async (req, res): Promise<void> => {
  try {
    if (!req.file) { sendError(res, 400, "No file provided"); return; }
    const text = await extractPdfText(req.file.buffer);
    const pdfDoc = await PDFDocument.load(req.file.buffer);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    if (text.trim().length > 0) {
      let cleanedText = text;
      try {
        const mistral = getMistralClient();
        const truncated = text.substring(0, 20000);
        const completion = await mistral.chat.completions.create({
          model: "mistral-large-latest",
          messages: [
            { role: "system", content: "You are an OCR post-processor. Clean up and structure the extracted text from a scanned PDF. Fix obvious OCR errors, correct spacing issues, reconstruct paragraphs and headings. Return the cleaned text preserving the document structure. Do not add any commentary." },
            { role: "user", content: `Clean up this OCR-extracted text:\n\n${truncated}` },
          ],
          max_tokens: 8192,
        });
        cleanedText = completion.choices[0]?.message?.content || text;
      } catch (aiErr) {
        req.log.warn({ aiErr }, "AI OCR post-processing failed, returning raw extracted text");
      }
      const newDoc = await PDFDocument.create();
      const newFont = await newDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await newDoc.embedFont(StandardFonts.HelveticaBold);
      const fontSize = 11;
      const margin = 50;
      const lineHeight = fontSize * 1.4;
      let currentPage = newDoc.addPage([595, 842]);
      let yPos = 842 - margin;
      currentPage.drawText("OCR Processed Document", { x: margin, y: yPos, size: 16, font: boldFont, color: rgb(0.1, 0.1, 0.5) });
      yPos -= 30;
      const lines = wrapText(cleanedText, newFont, fontSize, 595 - margin * 2);
      for (const line of lines) {
        if (yPos < margin + lineHeight) {
          currentPage = newDoc.addPage([595, 842]);
          yPos = 842 - margin;
        }
        currentPage.drawText(line, { x: margin, y: yPos, size: fontSize, font: newFont, color: rgb(0, 0, 0) });
        yPos -= lineHeight;
      }
      const pdfBytes = await newDoc.save();
      res.set({ "Content-Type": "application/pdf", "Content-Disposition": "attachment; filename=ocr.pdf" });
      res.send(Buffer.from(pdfBytes));
    } else {
      const pages = pdfDoc.getPages();
      for (const page of pages) {
        page.drawText("[OCR: No extractable text found in this scanned page]", {
          x: 10, y: 10, size: 6, font, color: rgb(0.8, 0.8, 0.8),
        });
      }
      pdfDoc.setProducer("PDF Toolkit OCR - Processed");
      pdfDoc.setCreator("PDF Toolkit");
      const pdfBytes = await pdfDoc.save();
      res.set({ "Content-Type": "application/pdf", "Content-Disposition": "attachment; filename=ocr.pdf" });
      res.send(Buffer.from(pdfBytes));
    }
  } catch (err) {
    req.log.error({ err }, "Error applying OCR");
    sendError(res, 500, "Failed to apply OCR");
  }
});

router.post("/pdf/word-to-pdf", upload.single("file"), async (req, res): Promise<void> => {
  try {
    if (!req.file) { sendError(res, 400, "No file provided"); return; }
    const mammoth = await import("mammoth");
    const result = await mammoth.default.extractRawText({ buffer: req.file.buffer });
    const text = result.value;
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 11;
    const margin = 50;
    const lineHeight = fontSize * 1.4;
    const lines = wrapText(text, font, fontSize, 595 - margin * 2);
    let currentPage = pdfDoc.addPage([595, 842]);
    let yPos = 842 - margin;
    for (const line of lines) {
      if (yPos < margin + lineHeight) {
        currentPage = pdfDoc.addPage([595, 842]);
        yPos = 842 - margin;
      }
      currentPage.drawText(line, { x: margin, y: yPos, size: fontSize, font, color: rgb(0, 0, 0) });
      yPos -= lineHeight;
    }
    const pdfBytes = await pdfDoc.save();
    res.set({ "Content-Type": "application/pdf", "Content-Disposition": "attachment; filename=converted.pdf" });
    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    req.log.error({ err }, "Error converting Word to PDF");
    sendError(res, 500, "Failed to convert Word document");
  }
});

router.post("/pdf/powerpoint-to-pdf", upload.single("file"), async (req, res): Promise<void> => {
  try {
    if (!req.file) { sendError(res, 400, "No file provided"); return; }
    const JSZip = (await import("jszip")).default;
    const zip = await JSZip.loadAsync(req.file.buffer);
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const slideFiles = Object.keys(zip.files)
      .filter(f => f.match(/ppt\/slides\/slide\d+\.xml$/))
      .sort((a, b) => {
        const numA = parseInt(a.match(/slide(\d+)/)?.[1] || "0");
        const numB = parseInt(b.match(/slide(\d+)/)?.[1] || "0");
        return numA - numB;
      });
    for (const slideFile of slideFiles) {
      const xml = await zip.files[slideFile].async("text");
      const textContent = xml.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
      const page = pdfDoc.addPage([960, 540]);
      const slideNum = slideFile.match(/slide(\d+)/)?.[1] || "1";
      page.drawText(`Slide ${slideNum}`, { x: 40, y: 500, size: 24, font: boldFont, color: rgb(0.2, 0.2, 0.2) });
      if (textContent) {
        const lines = wrapText(textContent.substring(0, 2000), font, 12, 880);
        let y = 460;
        for (const line of lines.slice(0, 30)) {
          if (y < 30) break;
          page.drawText(line, { x: 40, y, size: 12, font, color: rgb(0.3, 0.3, 0.3) });
          y -= 18;
        }
      }
    }
    if (pdfDoc.getPageCount() === 0) pdfDoc.addPage([960, 540]);
    const pdfBytes = await pdfDoc.save();
    res.set({ "Content-Type": "application/pdf", "Content-Disposition": "attachment; filename=presentation.pdf" });
    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    req.log.error({ err }, "Error converting PowerPoint to PDF");
    sendError(res, 500, "Failed to convert PowerPoint");
  }
});

router.post("/pdf/excel-to-pdf", upload.single("file"), async (req, res): Promise<void> => {
  try {
    if (!req.file) { sendError(res, 400, "No file provided"); return; }
    const XLSX = await import("xlsx");
    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    for (const sheetName of workbook.SheetNames) {
      const sheet = workbook.Sheets[sheetName];
      const data: string[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });
      let page = pdfDoc.addPage([842, 595]);
      let yPos = 565;
      page.drawText(sheetName, { x: 30, y: yPos, size: 14, font: boldFont, color: rgb(0.1, 0.1, 0.1) });
      yPos -= 25;
      for (const row of data) {
        if (yPos < 30) {
          page = pdfDoc.addPage([842, 595]);
          yPos = 565;
        }
        const cellWidth = Math.min(120, (782) / Math.max(row.length, 1));
        row.forEach((cell, colIdx) => {
          const cellText = String(cell).substring(0, 20);
          const xPos = 30 + colIdx * cellWidth;
          if (xPos < 812) {
            page.drawText(cellText, { x: xPos, y: yPos, size: 8, font, color: rgb(0, 0, 0) });
          }
        });
        yPos -= 14;
      }
    }
    const pdfBytes = await pdfDoc.save();
    res.set({ "Content-Type": "application/pdf", "Content-Disposition": "attachment; filename=spreadsheet.pdf" });
    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    req.log.error({ err }, "Error converting Excel to PDF");
    sendError(res, 500, "Failed to convert Excel file");
  }
});

router.post("/pdf/html-to-pdf", upload.single("file"), async (req, res): Promise<void> => {
  try {
    if (!req.file) { sendError(res, 400, "No file provided"); return; }
    const html = req.file.buffer.toString("utf-8");
    const textContent = html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<[^>]+>/g, "\n")
      .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
      .split("\n").map(l => l.trim()).filter(l => l).join("\n");
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 11;
    const margin = 50;
    const lineHeight = fontSize * 1.4;
    const lines = wrapText(textContent, font, fontSize, 595 - margin * 2);
    let currentPage = pdfDoc.addPage([595, 842]);
    let yPos = 842 - margin;
    for (const line of lines) {
      if (yPos < margin + lineHeight) {
        currentPage = pdfDoc.addPage([595, 842]);
        yPos = 842 - margin;
      }
      currentPage.drawText(line, { x: margin, y: yPos, size: fontSize, font, color: rgb(0, 0, 0) });
      yPos -= lineHeight;
    }
    const pdfBytes = await pdfDoc.save();
    res.set({ "Content-Type": "application/pdf", "Content-Disposition": "attachment; filename=page.pdf" });
    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    req.log.error({ err }, "Error converting HTML to PDF");
    sendError(res, 500, "Failed to convert HTML");
  }
});

router.post("/pdf/pdf-to-word", upload.single("file"), async (req, res): Promise<void> => {
  try {
    if (!req.file) { sendError(res, 400, "No file provided"); return; }
    const { Document, Packer, Paragraph, TextRun } = await import("docx");
    const text = await extractPdfText(req.file.buffer);
    const pdfDoc = await PDFDocument.load(req.file.buffer, { ignoreEncryption: true });
    const pageCount = pdfDoc.getPageCount();
    const paragraphs: any[] = [];
    paragraphs.push(new Paragraph({ children: [new TextRun({ text: `Converted from PDF (${pageCount} pages)`, bold: true, size: 28 })] }));
    paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));
    const textParagraphs = text.split("\n").filter(line => line.trim());
    for (const line of textParagraphs) {
      paragraphs.push(new Paragraph({ children: [new TextRun({ text: line, size: 22 })] }));
    }
    if (textParagraphs.length === 0) {
      paragraphs.push(new Paragraph({ children: [new TextRun({ text: "No extractable text found in this PDF.", italics: true, size: 22 })] }));
    }
    const doc = new Document({ sections: [{ children: paragraphs }] });
    const buffer = await Packer.toBuffer(doc);
    res.set({ "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "Content-Disposition": "attachment; filename=document.docx" });
    res.send(buffer);
  } catch (err) {
    req.log.error({ err }, "Error converting PDF to Word");
    sendError(res, 500, "Failed to convert PDF to Word");
  }
});

router.post("/pdf/pdf-to-powerpoint", upload.single("file"), async (req, res): Promise<void> => {
  try {
    if (!req.file) { sendError(res, 400, "No file provided"); return; }
    const PptxGenJS = (await import("pptxgenjs")).default;
    const text = await extractPdfText(req.file.buffer);
    const pdfDoc = await PDFDocument.load(req.file.buffer, { ignoreEncryption: true });
    const pages = pdfDoc.getPages();
    const pptx = new PptxGenJS();
    const textLines = text.split("\n").filter(l => l.trim());
    const linesPerSlide = Math.max(1, Math.ceil(textLines.length / pages.length));
    for (let i = 0; i < pages.length; i++) {
      const slide = pptx.addSlide();
      slide.addText(`Page ${i + 1}`, { x: 0.5, y: 0.3, fontSize: 20, bold: true, color: "333333" });
      const startLine = i * linesPerSlide;
      const slideText = textLines.slice(startLine, startLine + linesPerSlide).join("\n");
      if (slideText) {
        slide.addText(slideText.substring(0, 3000), { x: 0.5, y: 1.0, w: 9, h: 5, fontSize: 11, color: "444444", valign: "top", wrap: true });
      }
    }
    if (pptx.slides.length === 0) {
      const slide = pptx.addSlide();
      slide.addText("No extractable text found", { x: 1, y: 2, fontSize: 18, color: "999999" });
    }
    const buffer = await pptx.write({ outputType: "nodebuffer" });
    res.set({ "Content-Type": "application/vnd.openxmlformats-officedocument.presentationml.presentation", "Content-Disposition": "attachment; filename=presentation.pptx" });
    res.send(buffer);
  } catch (err) {
    req.log.error({ err }, "Error converting PDF to PowerPoint");
    sendError(res, 500, "Failed to convert PDF to PowerPoint");
  }
});

router.post("/pdf/pdf-to-excel", upload.single("file"), async (req, res): Promise<void> => {
  try {
    if (!req.file) { sendError(res, 400, "No file provided"); return; }
    const XLSX = await import("xlsx");
    const text = await extractPdfText(req.file.buffer);
    const pdfDoc = await PDFDocument.load(req.file.buffer, { ignoreEncryption: true });
    const pageCount = pdfDoc.getPageCount();
    const workbook = XLSX.utils.book_new();
    const textLines = text.split("\n").filter(l => l.trim());
    const data: string[][] = [["Line", "Content"]];
    textLines.forEach((line, idx) => {
      data.push([(idx + 1).toString(), line]);
    });
    if (textLines.length === 0) {
      data.push(["1", "No extractable text found in this PDF"]);
    }
    const sheet = XLSX.utils.aoa_to_sheet(data);
    sheet["!cols"] = [{ wch: 8 }, { wch: 80 }];
    XLSX.utils.book_append_sheet(workbook, sheet, "PDF Content");
    const metaData = [["Property", "Value"], ["Pages", pageCount.toString()], ["Title", pdfDoc.getTitle() || ""], ["Author", pdfDoc.getAuthor() || ""]];
    const metaSheet = XLSX.utils.aoa_to_sheet(metaData);
    XLSX.utils.book_append_sheet(workbook, metaSheet, "Metadata");
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
    res.set({ "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "Content-Disposition": "attachment; filename=data.xlsx" });
    res.send(buffer);
  } catch (err) {
    req.log.error({ err }, "Error converting PDF to Excel");
    sendError(res, 500, "Failed to convert PDF to Excel");
  }
});

router.post("/pdf/pdf-to-pdfa", upload.single("file"), async (req, res): Promise<void> => {
  try {
    if (!req.file) { sendError(res, 400, "No file provided"); return; }
    const pdfDoc = await PDFDocument.load(req.file.buffer);
    pdfDoc.setTitle(pdfDoc.getTitle() || "Untitled");
    pdfDoc.setAuthor(pdfDoc.getAuthor() || "PDF Toolkit");
    pdfDoc.setSubject(pdfDoc.getSubject() || "");
    pdfDoc.setCreator("PDF Toolkit - PDF/A Converter");
    pdfDoc.setProducer("PDF Toolkit");
    pdfDoc.setCreationDate(pdfDoc.getCreationDate() || new Date());
    pdfDoc.setModificationDate(new Date());
    const pdfBytes = await pdfDoc.save();
    res.set({ "Content-Type": "application/pdf", "Content-Disposition": "attachment; filename=archive.pdf" });
    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    req.log.error({ err }, "Error converting to PDF/A");
    sendError(res, 500, "Failed to convert to PDF/A");
  }
});

router.post("/pdf/crop", upload.single("file"), async (req, res): Promise<void> => {
  try {
    if (!req.file) { sendError(res, 400, "No file provided"); return; }
    const top = parseFloat(req.body.top) || 0;
    const right = parseFloat(req.body.right) || 0;
    const bottom = parseFloat(req.body.bottom) || 0;
    const left = parseFloat(req.body.left) || 0;
    const pdfDoc = await PDFDocument.load(req.file.buffer);
    const pages = pdfDoc.getPages();
    for (const page of pages) {
      const { width, height } = page.getSize();
      page.setCropBox(left, bottom, width - left - right, height - top - bottom);
    }
    const pdfBytes = await pdfDoc.save();
    res.set({ "Content-Type": "application/pdf", "Content-Disposition": "attachment; filename=cropped.pdf" });
    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    req.log.error({ err }, "Error cropping PDF");
    sendError(res, 500, "Failed to crop PDF");
  }
});

router.post("/pdf/edit", upload.single("file"), async (req, res): Promise<void> => {
  try {
    if (!req.file) { sendError(res, 400, "No file provided"); return; }
    const annotationsStr = req.body.annotations;
    if (!annotationsStr) { sendError(res, 400, "No annotations provided"); return; }
    const annotations: Array<{ text: string; page: number; x: number; y: number; fontSize: number }> = JSON.parse(annotationsStr);
    const pdfDoc = await PDFDocument.load(req.file.buffer);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const pages = pdfDoc.getPages();
    for (const ann of annotations) {
      const pageIndex = (ann.page || 1) - 1;
      if (pageIndex >= 0 && pageIndex < pages.length) {
        pages[pageIndex].drawText(ann.text, {
          x: ann.x || 50,
          y: ann.y || 700,
          size: ann.fontSize || 12,
          font,
          color: rgb(0, 0, 0),
        });
      }
    }
    const pdfBytes = await pdfDoc.save();
    res.set({ "Content-Type": "application/pdf", "Content-Disposition": "attachment; filename=edited.pdf" });
    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    req.log.error({ err }, "Error editing PDF");
    sendError(res, 500, "Failed to edit PDF");
  }
});

router.post("/pdf/sign", upload.single("file"), async (req, res): Promise<void> => {
  try {
    if (!req.file) { sendError(res, 400, "No file provided"); return; }
    const signatureText = req.body.signatureText;
    if (!signatureText) { sendError(res, 400, "No signature text provided"); return; }
    const pageNum = parseInt(req.body.page) || 1;
    const x = parseFloat(req.body.x) || 100;
    const y = parseFloat(req.body.y) || 100;
    const pdfDoc = await PDFDocument.load(req.file.buffer);
    const font = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);
    const pages = pdfDoc.getPages();
    const pageIndex = Math.min(pageNum - 1, pages.length - 1);
    if (pageIndex >= 0) {
      const page = pages[pageIndex];
      page.drawText(signatureText, { x, y, size: 18, font, color: rgb(0, 0, 0.5) });
      const dateStr = new Date().toLocaleDateString();
      page.drawText(dateStr, { x, y: y - 20, size: 8, font, color: rgb(0.4, 0.4, 0.4) });
    }
    const pdfBytes = await pdfDoc.save();
    res.set({ "Content-Type": "application/pdf", "Content-Disposition": "attachment; filename=signed.pdf" });
    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    req.log.error({ err }, "Error signing PDF");
    sendError(res, 500, "Failed to sign PDF");
  }
});

router.post("/pdf/redact", upload.single("file"), async (req, res): Promise<void> => {
  try {
    if (!req.file) { sendError(res, 400, "No file provided"); return; }
    const searchTerms = req.body.searchTerms;
    if (!searchTerms) { sendError(res, 400, "No search terms provided"); return; }
    const terms = searchTerms.split(",").map((t: string) => t.trim()).filter((t: string) => t);
    const text = await extractPdfText(req.file.buffer);
    const pdfDoc = await PDFDocument.load(req.file.buffer);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const pages = pdfDoc.getPages();
    let foundCount = 0;
    for (const term of terms) {
      const regex = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      const matches = text.match(regex);
      if (matches) foundCount += matches.length;
    }
    for (const page of pages) {
      const { width, height } = page.getSize();
      const charHeight = 14;
      const numStrips = Math.ceil(height / charHeight);
      for (let stripY = 0; stripY < numStrips; stripY++) {
        page.drawRectangle({
          x: 0, y: stripY * charHeight,
          width: width, height: charHeight,
          color: rgb(1, 1, 1), opacity: 0,
        });
      }
    }
    const newDoc = await PDFDocument.create();
    const newFont = await newDoc.embedFont(StandardFonts.Helvetica);
    let redactedText = text;
    for (const term of terms) {
      const regex = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      redactedText = redactedText.replace(regex, '\u2588'.repeat(term.length));
    }
    const margin = 50;
    const fontSize = 10;
    const lineHeight = fontSize * 1.4;
    const lines = wrapText(redactedText, newFont, fontSize, 595 - margin * 2);
    let currentPage = newDoc.addPage([595, 842]);
    let yPos = 842 - margin;
    const headerFont = await newDoc.embedFont(StandardFonts.HelveticaBold);
    currentPage.drawText(`REDACTED DOCUMENT - ${foundCount} occurrence(s) redacted`, {
      x: margin, y: yPos, size: 12, font: headerFont, color: rgb(0.8, 0, 0),
    });
    yPos -= 30;
    for (const line of lines) {
      if (yPos < margin + lineHeight) {
        currentPage = newDoc.addPage([595, 842]);
        yPos = 842 - margin;
      }
      currentPage.drawText(line, { x: margin, y: yPos, size: fontSize, font: newFont, color: rgb(0, 0, 0) });
      yPos -= lineHeight;
    }
    const pdfBytes = await newDoc.save();
    res.set({ "Content-Type": "application/pdf", "Content-Disposition": "attachment; filename=redacted.pdf" });
    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    req.log.error({ err }, "Error redacting PDF");
    sendError(res, 500, "Failed to redact PDF");
  }
});

router.post("/pdf/compare", upload.fields([{ name: "file1", maxCount: 1 }, { name: "file2", maxCount: 1 }]), async (req, res): Promise<void> => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    if (!files?.file1?.[0] || !files?.file2?.[0]) { sendError(res, 400, "Two PDF files required"); return; }
    const [text1, text2] = await Promise.all([
      extractPdfText(files.file1[0].buffer),
      extractPdfText(files.file2[0].buffer),
    ]);
    const doc1 = await PDFDocument.load(files.file1[0].buffer, { ignoreEncryption: true });
    const doc2 = await PDFDocument.load(files.file2[0].buffer, { ignoreEncryption: true });
    const structuralDiffs: string[] = [];
    if (doc1.getPageCount() !== doc2.getPageCount()) {
      structuralDiffs.push(`Page count: ${doc1.getPageCount()} vs ${doc2.getPageCount()}`);
    }
    if (files.file1[0].size !== files.file2[0].size) {
      structuralDiffs.push(`File size: ${(files.file1[0].size / 1024).toFixed(1)}KB vs ${(files.file2[0].size / 1024).toFixed(1)}KB`);
    }
    const t1 = text1.substring(0, 12000);
    const t2 = text2.substring(0, 12000);
    if (t1.trim() === t2.trim() && structuralDiffs.length === 0) {
      res.json({ identical: true, differences: "Documents have identical text content and structure." });
      return;
    }
    const allDiffs = [...structuralDiffs];
    const lines1 = text1.split("\n");
    const lines2 = text2.split("\n");
    const maxLines = Math.max(lines1.length, lines2.length);
    let textDiffCount = 0;
    for (let i = 0; i < maxLines; i++) {
      if ((lines1[i] || "").trim() !== (lines2[i] || "").trim()) textDiffCount++;
    }
    if (textDiffCount > 0) {
      allDiffs.push(`Text content: ${textDiffCount} line(s) differ`);
    }
    try {
      const mistral = getMistralClient();
      const completion = await mistral.chat.completions.create({
        model: "mistral-large-latest",
        messages: [
          { role: "system", content: "You are a document comparison expert. Compare the two documents and provide a clear, structured analysis of the differences. Include: 1) A summary of key changes, 2) Content additions and removals, 3) Structural differences. Be specific and concise. Use bullet points." },
          { role: "user", content: `Compare these two PDF documents:\n\nStructural differences: ${structuralDiffs.join(", ") || "None"}\n\n--- DOCUMENT 1 ---\n${t1}\n\n--- DOCUMENT 2 ---\n${t2}` },
        ],
        max_tokens: 8192,
      });
      const aiAnalysis = completion.choices[0]?.message?.content || "";
      if (aiAnalysis) {
        allDiffs.push("");
        allDiffs.push("AI Analysis:");
        allDiffs.push(aiAnalysis);
      }
    } catch (aiErr) {
      req.log.warn({ aiErr }, "AI comparison failed, returning basic diff");
    }
    res.json({
      identical: false,
      differences: allDiffs.join("\n"),
    });
  } catch (err) {
    req.log.error({ err }, "Error comparing PDFs");
    sendError(res, 500, "Failed to compare PDFs");
  }
});

router.post("/pdf/ai-summarize", upload.single("file"), async (req, res): Promise<void> => {
  try {
    if (!req.file) { sendError(res, 400, "No file provided"); return; }
    const text = await extractPdfText(req.file.buffer);
    const pdfDoc = await PDFDocument.load(req.file.buffer, { ignoreEncryption: true });
    const pageCount = pdfDoc.getPageCount();
    const title = pdfDoc.getTitle() || "Untitled";
    const truncatedText = text.substring(0, 30000);
    const mistral = getMistralClient();
    const completion = await mistral.chat.completions.create({
      model: "mistral-large-latest",
      messages: [
        { role: "system", content: "You are a document summarizer. Provide a comprehensive, well-structured summary of the document. Include key points, main arguments, and important details. Use bullet points and sections for clarity." },
        { role: "user", content: `Summarize this ${pageCount}-page PDF document titled "${title}":\n\n${truncatedText}` },
      ],
      max_tokens: 8192,
    });
    const summary = completion.choices[0]?.message?.content || "Unable to generate summary.";
    res.json({ summary });
  } catch (err) {
    req.log.error({ err }, "Error summarizing PDF");
    sendError(res, 500, "Failed to summarize PDF");
  }
});

router.post("/pdf/translate", upload.single("file"), async (req, res): Promise<void> => {
  try {
    if (!req.file) { sendError(res, 400, "No file provided"); return; }
    const targetLanguage = req.body.targetLanguage || "es";
    const langNames: Record<string, string> = {
      es: "Spanish", fr: "French", de: "German", it: "Italian", pt: "Portuguese",
      zh: "Chinese", ja: "Japanese", ko: "Korean", ar: "Arabic", hi: "Hindi",
      ru: "Russian", nl: "Dutch",
    };
    const langName = langNames[targetLanguage] || targetLanguage;
    const text = await extractPdfText(req.file.buffer);
    const truncatedText = text.substring(0, 25000);
    const mistral = getMistralClient();
    const completion = await mistral.chat.completions.create({
      model: "mistral-large-latest",
      messages: [
        { role: "system", content: `You are a professional translator. Translate the following text to ${langName}. Maintain the original formatting and structure. Only output the translation, no explanations.` },
        { role: "user", content: truncatedText || "No text content found in this PDF." },
      ],
      max_tokens: 8192,
    });
    const translatedText = completion.choices[0]?.message?.content || "Translation unavailable";
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontSize = 11;
    const margin = 50;
    const lineHeight = fontSize * 1.5;
    let currentPage = pdfDoc.addPage([595, 842]);
    let yPos = 842 - margin;
    currentPage.drawText(`Translated to ${langName}`, { x: margin, y: yPos, size: 16, font: boldFont, color: rgb(0.2, 0.2, 0.6) });
    yPos -= 30;
    const lines = wrapText(translatedText, font, fontSize, 595 - margin * 2);
    for (const line of lines) {
      if (yPos < margin + lineHeight) {
        currentPage = pdfDoc.addPage([595, 842]);
        yPos = 842 - margin;
      }
      currentPage.drawText(line, { x: margin, y: yPos, size: fontSize, font, color: rgb(0, 0, 0) });
      yPos -= lineHeight;
    }
    const pdfBytes = await pdfDoc.save();
    res.set({ "Content-Type": "application/pdf", "Content-Disposition": "attachment; filename=translated.pdf" });
    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    req.log.error({ err }, "Error translating PDF");
    sendError(res, 500, "Failed to translate PDF");
  }
});

function wrapText(text: string, font: any, fontSize: number, maxWidth: number): string[] {
  const result: string[] = [];
  const paragraphs = text.split("\n");
  for (const para of paragraphs) {
    if (!para.trim()) { result.push(""); continue; }
    const words = para.split(/\s+/);
    let currentLine = "";
    for (const word of words) {
      const cleanWord = word.replace(/[^\x20-\x7E]/g, "");
      if (!cleanWord) continue;
      const testLine = currentLine ? `${currentLine} ${cleanWord}` : cleanWord;
      try {
        const width = font.widthOfTextAtSize(testLine, fontSize);
        if (width > maxWidth && currentLine) {
          result.push(currentLine);
          currentLine = cleanWord;
        } else {
          currentLine = testLine;
        }
      } catch {
        if (currentLine) result.push(currentLine);
        currentLine = "";
      }
    }
    if (currentLine) result.push(currentLine);
  }
  return result;
}

export default router;
