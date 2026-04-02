import { Router, type IRouter } from "express";
import multer from "multer";
import { PDFDocument, rgb, degrees, StandardFonts, grayscale, PDFFont, PDFPage } from "pdf-lib";
import archiver from "archiver";
import fs from "fs";
import path from "path";
import os from "os";
import { logger } from "../lib/logger";

const router: IRouter = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 },
});

function sendError(res: any, status: number, message: string): void {
  res.status(status).json({ error: "Error", message });
}

function parseJsonField<T>(value: string | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

router.post("/pdf/info", upload.single("file"), async (req, res): Promise<void> => {
  try {
    if (!req.file) {
      sendError(res, 400, "No file provided");
      return;
    }

    const pdfDoc = await PDFDocument.load(req.file.buffer, { ignoreEncryption: true });
    const pages = pdfDoc.getPages();
    const pageInfos = pages.map((page, i) => {
      const { width, height } = page.getSize();
      return { page: i + 1, width: Math.round(width), height: Math.round(height) };
    });

    res.json({
      pageCount: pages.length,
      title: pdfDoc.getTitle() ?? null,
      author: pdfDoc.getAuthor() ?? null,
      subject: pdfDoc.getSubject() ?? null,
      creator: pdfDoc.getCreator() ?? null,
      producer: pdfDoc.getProducer() ?? null,
      creationDate: pdfDoc.getCreationDate()?.toISOString() ?? null,
      modificationDate: pdfDoc.getModificationDate()?.toISOString() ?? null,
      fileSize: req.file.size,
      isEncrypted: false,
      pages: pageInfos,
    });
  } catch (err) {
    req.log.error({ err }, "Error getting PDF info");
    sendError(res, 500, "Failed to read PDF info");
  }
});

router.post("/pdf/preview", upload.single("file"), async (req, res): Promise<void> => {
  try {
    if (!req.file) {
      sendError(res, 400, "No file provided");
      return;
    }

    const maxPages = parseInt(req.body.maxPages ?? "20", 10);
    const pdfDoc = await PDFDocument.load(req.file.buffer, { ignoreEncryption: true });
    const pages = pdfDoc.getPages();
    const totalPages = pages.length;

    const previewPages = pages.slice(0, maxPages).map((page, i) => {
      const { width, height } = page.getSize();
      const svgW = 200;
      const svgH = Math.round((height / width) * svgW);
      const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${svgW}" height="${svgH}" viewBox="0 0 ${svgW} ${svgH}">
        <rect width="${svgW}" height="${svgH}" fill="#f8f9fa" stroke="#dee2e6" stroke-width="1"/>
        <rect x="12" y="12" width="${svgW - 24}" height="2" rx="1" fill="#adb5bd"/>
        <rect x="12" y="20" width="${svgW - 40}" height="2" rx="1" fill="#ced4da"/>
        <rect x="12" y="28" width="${svgW - 30}" height="2" rx="1" fill="#ced4da"/>
        <rect x="12" y="36" width="${svgW - 50}" height="2" rx="1" fill="#ced4da"/>
        <rect x="12" y="48" width="${svgW - 24}" height="2" rx="1" fill="#adb5bd"/>
        <rect x="12" y="56" width="${svgW - 35}" height="2" rx="1" fill="#ced4da"/>
        <rect x="12" y="64" width="${svgW - 45}" height="2" rx="1" fill="#ced4da"/>
        <rect x="12" y="80" width="${svgW - 24}" height="${Math.max(svgH - 100, 20)}" rx="2" fill="#e9ecef"/>
        <text x="${svgW / 2}" y="${svgH - 8}" text-anchor="middle" font-family="sans-serif" font-size="10" fill="#6c757d">${i + 1}</text>
      </svg>`;
      const base64 = Buffer.from(svgContent).toString("base64");
      return {
        page: i + 1,
        thumbnail: `data:image/svg+xml;base64,${base64}`,
        width: Math.round(width),
        height: Math.round(height),
      };
    });

    res.json({
      pageCount: totalPages,
      pages: previewPages,
      fileSize: req.file.size,
      fileName: req.file.originalname,
    });
  } catch (err) {
    req.log.error({ err }, "Error generating PDF preview");
    sendError(res, 500, "Failed to generate PDF preview");
  }
});

router.post("/pdf/merge", upload.array("files", 50), async (req, res): Promise<void> => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length < 1) {
      sendError(res, 400, "At least one PDF file is required");
      return;
    }

    const order: number[] = parseJsonField<number[]>(req.body.order, files.map((_, i) => i));
    const passwords: Record<string, string> = parseJsonField<Record<string, string>>(req.body.passwords, {});

    const mergedPdf = await PDFDocument.create();

    for (const idx of order) {
      const file = files[idx];
      if (!file) continue;
      const password = passwords[String(idx)] ?? undefined;
      let srcDoc: PDFDocument;
      try {
        srcDoc = await PDFDocument.load(file.buffer, {
          password,
          ignoreEncryption: !password,
        });
      } catch {
        srcDoc = await PDFDocument.load(file.buffer, { ignoreEncryption: true });
      }
      const copiedPages = await mergedPdf.copyPages(srcDoc, srcDoc.getPageIndices());
      for (const page of copiedPages) {
        mergedPdf.addPage(page);
      }
    }

    const pdfBytes = await mergedPdf.save();
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="merged.pdf"',
      "Content-Length": pdfBytes.length,
    });
    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    req.log.error({ err }, "Error merging PDFs");
    sendError(res, 500, "Failed to merge PDFs");
  }
});

router.post("/pdf/split", upload.single("file"), async (req, res): Promise<void> => {
  try {
    if (!req.file) {
      sendError(res, 400, "No file provided");
      return;
    }

    const mode = req.body.mode ?? "all-pages";
    const outputMode = req.body.outputMode ?? "separate";
    const pdfDoc = await PDFDocument.load(req.file.buffer, { ignoreEncryption: true });
    const totalPages = pdfDoc.getPageCount();

    let pageGroups: number[][] = [];

    if (mode === "all-pages") {
      pageGroups = pdfDoc.getPageIndices().map((i) => [i]);
    } else {
      const ranges: Array<{ from: number; to: number }> = parseJsonField(req.body.ranges, []);
      for (const range of ranges) {
        const group: number[] = [];
        for (let p = range.from; p <= range.to && p <= totalPages; p++) {
          group.push(p - 1);
        }
        if (group.length > 0) pageGroups.push(group);
      }
    }

    if (outputMode === "merged" || pageGroups.length === 1) {
      const newDoc = await PDFDocument.create();
      for (const group of pageGroups) {
        const copied = await newDoc.copyPages(pdfDoc, group);
        for (const page of copied) newDoc.addPage(page);
      }
      const bytes = await newDoc.save();
      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="split.pdf"',
        "Content-Length": bytes.length,
      });
      res.send(Buffer.from(bytes));
    } else {
      res.set({
        "Content-Type": "application/zip",
        "Content-Disposition": 'attachment; filename="split.zip"',
      });
      const archive = archiver("zip", { zlib: { level: 6 } });
      archive.pipe(res);

      for (let i = 0; i < pageGroups.length; i++) {
        const group = pageGroups[i];
        const newDoc = await PDFDocument.create();
        const copied = await newDoc.copyPages(pdfDoc, group);
        for (const page of copied) newDoc.addPage(page);
        const bytes = await newDoc.save();
        const startPage = (group[0] ?? 0) + 1;
        const endPage = (group[group.length - 1] ?? 0) + 1;
        const fname = mode === "all-pages" ? `page-${startPage}.pdf` : `part-${i + 1}-pages-${startPage}-${endPage}.pdf`;
        archive.append(Buffer.from(bytes), { name: fname });
      }

      await archive.finalize();
    }
  } catch (err) {
    req.log.error({ err }, "Error splitting PDF");
    sendError(res, 500, "Failed to split PDF");
  }
});

router.post("/pdf/remove-pages", upload.single("file"), async (req, res): Promise<void> => {
  try {
    if (!req.file) {
      sendError(res, 400, "No file provided");
      return;
    }

    const pagesToRemove: number[] = parseJsonField<number[]>(req.body.pages, []);
    const pdfDoc = await PDFDocument.load(req.file.buffer, { ignoreEncryption: true });
    const totalPages = pdfDoc.getPageCount();

    const removeSet = new Set(pagesToRemove.map((p) => p - 1));
    const keepIndices = Array.from({ length: totalPages }, (_, i) => i).filter((i) => !removeSet.has(i));

    const newDoc = await PDFDocument.create();
    const copied = await newDoc.copyPages(pdfDoc, keepIndices);
    for (const page of copied) newDoc.addPage(page);

    const bytes = await newDoc.save();
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="removed-pages.pdf"',
      "Content-Length": bytes.length,
    });
    res.send(Buffer.from(bytes));
  } catch (err) {
    req.log.error({ err }, "Error removing pages");
    sendError(res, 500, "Failed to remove pages");
  }
});

router.post("/pdf/extract-pages", upload.single("file"), async (req, res): Promise<void> => {
  try {
    if (!req.file) {
      sendError(res, 400, "No file provided");
      return;
    }

    const pagesToExtract: number[] = parseJsonField<number[]>(req.body.pages, []);
    const outputMode = req.body.outputMode ?? "merged";
    const pdfDoc = await PDFDocument.load(req.file.buffer, { ignoreEncryption: true });

    const indices = pagesToExtract.map((p) => p - 1);

    if (outputMode === "merged" || indices.length === 1) {
      const newDoc = await PDFDocument.create();
      const copied = await newDoc.copyPages(pdfDoc, indices);
      for (const page of copied) newDoc.addPage(page);
      const bytes = await newDoc.save();
      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="extracted.pdf"',
        "Content-Length": bytes.length,
      });
      res.send(Buffer.from(bytes));
    } else {
      res.set({
        "Content-Type": "application/zip",
        "Content-Disposition": 'attachment; filename="extracted.zip"',
      });
      const archive = archiver("zip", { zlib: { level: 6 } });
      archive.pipe(res);

      for (const idx of indices) {
        const newDoc = await PDFDocument.create();
        const copied = await newDoc.copyPages(pdfDoc, [idx]);
        for (const page of copied) newDoc.addPage(page);
        const bytes = await newDoc.save();
        archive.append(Buffer.from(bytes), { name: `page-${idx + 1}.pdf` });
      }

      await archive.finalize();
    }
  } catch (err) {
    req.log.error({ err }, "Error extracting pages");
    sendError(res, 500, "Failed to extract pages");
  }
});

router.post("/pdf/compress", upload.single("file"), async (req, res): Promise<void> => {
  try {
    if (!req.file) {
      sendError(res, 400, "No file provided");
      return;
    }

    const quality = req.body.quality ?? "medium";
    const originalSize = req.file.size;
    const originalBuffer = req.file.buffer;

    const srcDoc = await PDFDocument.load(originalBuffer, { ignoreEncryption: true });

    const candidates: Uint8Array[] = [];

    const reserializedBytes = await srcDoc.save({
      useObjectStreams: true,
      addDefaultPage: false,
    });
    candidates.push(reserializedBytes);

    if (quality === "low" || quality === "medium") {
      const compressedDoc = await PDFDocument.create();
      const pages = await compressedDoc.copyPages(srcDoc, srcDoc.getPageIndices());
      for (const page of pages) {
        compressedDoc.addPage(page);
      }

      if (quality === "low") {
        compressedDoc.setTitle("");
        compressedDoc.setAuthor("");
        compressedDoc.setSubject("");
        compressedDoc.setKeywords([]);
        compressedDoc.setProducer("");
        compressedDoc.setCreator("");
      } else {
        compressedDoc.setProducer("");
        compressedDoc.setCreator("");
      }

      const rebuiltBytes = await compressedDoc.save({
        useObjectStreams: true,
        addDefaultPage: false,
      });
      candidates.push(rebuiltBytes);
    }

    let bestBytes = candidates[0];
    for (const c of candidates) {
      if (c.length < bestBytes.length) bestBytes = c;
    }

    let finalBytes: Uint8Array | Buffer = bestBytes;
    let compressedSize = bestBytes.length;

    if (compressedSize >= originalSize) {
      finalBytes = originalBuffer;
      compressedSize = originalSize;
    }

    const savings = Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100));

    const sessionId = `sess_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const tmpDir = os.tmpdir();
    const filePath = path.join(tmpDir, `${sessionId}.pdf`);
    fs.writeFileSync(filePath, Buffer.from(finalBytes));

    setTimeout(() => {
      try {
        fs.unlinkSync(filePath);
      } catch {
      }
    }, 30 * 60 * 1000);

    res.json({
      originalSize,
      compressedSize,
      savings,
      downloadUrl: `/api/pdf/download/${sessionId}`,
      sessionId,
    });
  } catch (err) {
    req.log.error({ err }, "Error compressing PDF");
    sendError(res, 500, "Failed to compress PDF");
  }
});

router.get("/pdf/download/:sessionId", async (req, res): Promise<void> => {
  try {
    const raw = Array.isArray(req.params.sessionId) ? req.params.sessionId[0] : req.params.sessionId;
    const sessionId = raw.replace(/[^a-zA-Z0-9_]/g, "");
    const filePath = path.join(os.tmpdir(), `${sessionId}.pdf`);

    if (!fs.existsSync(filePath)) {
      sendError(res, 404, "File not found or expired");
      return;
    }

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="compressed.pdf"',
    });
    fs.createReadStream(filePath).pipe(res);
  } catch (err) {
    req.log.error({ err }, "Error downloading file");
    sendError(res, 500, "Failed to download file");
  }
});

router.post("/pdf/add-watermark", upload.fields([{ name: "file", maxCount: 1 }, { name: "watermarkImage", maxCount: 1 }]), async (req, res): Promise<void> => {
  try {
    const files = req.files as Record<string, Express.Multer.File[]>;
    const mainFile = files?.file?.[0];
    if (!mainFile) {
      sendError(res, 400, "No PDF file provided");
      return;
    }

    const type = req.body.type ?? "text";
    const opacity = parseFloat(req.body.opacity ?? "0.3");
    const rotation = parseFloat(req.body.rotation ?? "45");
    const position = req.body.position ?? "center";
    const text = req.body.text ?? "WATERMARK";
    const fontSize = parseFloat(req.body.fontSize ?? "60");

    const pdfDoc = await PDFDocument.load(mainFile.buffer, { ignoreEncryption: true });
    const pages = pdfDoc.getPages();
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    for (const page of pages) {
      const { width, height } = page.getSize();

      if (type === "text") {
        const textWidth = font.widthOfTextAtSize(text, fontSize);
        const textHeight = font.heightAtSize(fontSize);

        let x: number, y: number;
        switch (position) {
          case "top-left": x = 50; y = height - textHeight - 30; break;
          case "top-right": x = width - textWidth - 50; y = height - textHeight - 30; break;
          case "bottom-left": x = 50; y = 30; break;
          case "bottom-right": x = width - textWidth - 50; y = 30; break;
          case "top-center": x = (width - textWidth) / 2; y = height - textHeight - 30; break;
          case "bottom-center": x = (width - textWidth) / 2; y = 30; break;
          default: x = (width - textWidth) / 2; y = (height - textHeight) / 2;
        }

        page.drawText(text, {
          x,
          y,
          size: fontSize,
          font,
          color: rgb(0.5, 0.5, 0.5),
          opacity,
          rotate: degrees(rotation),
        });
      } else if (type === "image") {
        const imgFile = files?.watermarkImage?.[0];
        if (imgFile) {
          let embeddedImage;
          const mimeType = imgFile.mimetype;
          if (mimeType === "image/jpeg" || mimeType === "image/jpg") {
            embeddedImage = await pdfDoc.embedJpg(imgFile.buffer);
          } else {
            embeddedImage = await pdfDoc.embedPng(imgFile.buffer);
          }

          const imgDims = embeddedImage.scale(0.5);
          const { width: imgW, height: imgH } = imgDims;

          let x: number, y: number;
          switch (position) {
            case "top-left": x = 30; y = height - imgH - 30; break;
            case "top-right": x = width - imgW - 30; y = height - imgH - 30; break;
            case "bottom-left": x = 30; y = 30; break;
            case "bottom-right": x = width - imgW - 30; y = 30; break;
            default: x = (width - imgW) / 2; y = (height - imgH) / 2;
          }

          page.drawImage(embeddedImage, {
            x,
            y,
            width: imgW,
            height: imgH,
            opacity,
            rotate: degrees(rotation),
          });
        }
      }
    }

    const bytes = await pdfDoc.save();
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="watermarked.pdf"',
      "Content-Length": bytes.length,
    });
    res.send(Buffer.from(bytes));
  } catch (err) {
    req.log.error({ err }, "Error adding watermark");
    sendError(res, 500, "Failed to add watermark");
  }
});

router.post("/pdf/add-page-numbers", upload.single("file"), async (req, res): Promise<void> => {
  try {
    if (!req.file) {
      sendError(res, 400, "No file provided");
      return;
    }

    const position = req.body.position ?? "bottom-center";
    const format = req.body.format ?? "numeric";
    const startNumber = parseInt(req.body.startNumber ?? "1", 10);
    const fontSize = parseFloat(req.body.fontSize ?? "12");
    const opacity = parseFloat(req.body.opacity ?? "1");
    const startPage = parseInt(req.body.startPage ?? "1", 10);
    const endPage = parseInt(req.body.endPage ?? "0", 10);

    const pdfDoc = await PDFDocument.load(req.file.buffer, { ignoreEncryption: true });
    const pages = pdfDoc.getPages();
    const totalPages = pages.length;
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const end = endPage > 0 ? Math.min(endPage, totalPages) : totalPages;

    for (let i = startPage - 1; i < end; i++) {
      const page = pages[i];
      if (!page) continue;
      const { width, height } = page.getSize();
      const pageNum = i + startNumber - (startPage - 1);
      const totalCount = end - startPage + 1;

      let label: string;
      switch (format) {
        case "Page X of Y": label = `Page ${pageNum} of ${totalCount}`; break;
        case "X/Y": label = `${pageNum}/${totalCount}`; break;
        default: label = `${pageNum}`;
      }

      const textWidth = font.widthOfTextAtSize(label, fontSize);
      const margin = 20;

      let x: number, y: number;
      switch (position) {
        case "top-left": x = margin; y = height - margin - fontSize; break;
        case "top-center": x = (width - textWidth) / 2; y = height - margin - fontSize; break;
        case "top-right": x = width - textWidth - margin; y = height - margin - fontSize; break;
        case "bottom-left": x = margin; y = margin; break;
        case "bottom-right": x = width - textWidth - margin; y = margin; break;
        default: x = (width - textWidth) / 2; y = margin;
      }

      page.drawText(label, {
        x,
        y,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
        opacity,
      });
    }

    const bytes = await pdfDoc.save();
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="numbered.pdf"',
      "Content-Length": bytes.length,
    });
    res.send(Buffer.from(bytes));
  } catch (err) {
    req.log.error({ err }, "Error adding page numbers");
    sendError(res, 500, "Failed to add page numbers");
  }
});

router.post("/pdf/protect", upload.single("file"), async (req, res): Promise<void> => {
  try {
    if (!req.file) {
      sendError(res, 400, "No file provided");
      return;
    }

    const password = req.body.password;
    if (!password) {
      sendError(res, 400, "Password is required");
      return;
    }

    const pdfDoc = await PDFDocument.load(req.file.buffer, { ignoreEncryption: true });
    const bytes = await pdfDoc.save({
      userPassword: password,
      ownerPassword: `${password}_owner`,
      permissions: {
        printing: "lowResolution",
        modifying: false,
        copying: false,
        annotating: false,
        fillingForms: true,
        contentAccessibility: true,
        documentAssembly: false,
      },
    });

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="protected.pdf"',
      "Content-Length": bytes.length,
    });
    res.send(Buffer.from(bytes));
  } catch (err) {
    req.log.error({ err }, "Error protecting PDF");
    sendError(res, 500, "Failed to protect PDF");
  }
});

router.post("/pdf/unlock", upload.single("file"), async (req, res): Promise<void> => {
  try {
    if (!req.file) {
      sendError(res, 400, "No file provided");
      return;
    }

    const password = req.body.password ?? "";

    let pdfDoc: PDFDocument;
    try {
      pdfDoc = await PDFDocument.load(req.file.buffer, { password });
    } catch {
      pdfDoc = await PDFDocument.load(req.file.buffer, { ignoreEncryption: true });
    }

    const newDoc = await PDFDocument.create();
    const indices = pdfDoc.getPageIndices();
    const copied = await newDoc.copyPages(pdfDoc, indices);
    for (const page of copied) newDoc.addPage(page);

    const bytes = await newDoc.save();
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="unlocked.pdf"',
      "Content-Length": bytes.length,
    });
    res.send(Buffer.from(bytes));
  } catch (err) {
    req.log.error({ err }, "Error unlocking PDF");
    sendError(res, 500, "Failed to unlock PDF. The password may be incorrect.");
  }
});

router.post("/pdf/rotate", upload.single("file"), async (req, res): Promise<void> => {
  try {
    if (!req.file) {
      sendError(res, 400, "No file provided");
      return;
    }

    const deg = parseFloat(req.body.degrees ?? "90");
    const allPages = req.body.allPages === "true";
    const pageConfigs: Array<{ page: number; degrees: number }> = parseJsonField(req.body.pages, []);

    const pdfDoc = await PDFDocument.load(req.file.buffer, { ignoreEncryption: true });
    const pages = pdfDoc.getPages();

    if (allPages) {
      for (const page of pages) {
        const currentRotation = page.getRotation().angle;
        page.setRotation(degrees((currentRotation + deg) % 360));
      }
    } else {
      for (const config of pageConfigs) {
        const page = pages[config.page - 1];
        if (page) {
          const currentRotation = page.getRotation().angle;
          page.setRotation(degrees((currentRotation + config.degrees) % 360));
        }
      }
    }

    const bytes = await pdfDoc.save();
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="rotated.pdf"',
      "Content-Length": bytes.length,
    });
    res.send(Buffer.from(bytes));
  } catch (err) {
    req.log.error({ err }, "Error rotating PDF");
    sendError(res, 500, "Failed to rotate PDF");
  }
});

router.post("/pdf/repair", upload.single("file"), async (req, res): Promise<void> => {
  try {
    if (!req.file) {
      sendError(res, 400, "No file provided");
      return;
    }

    let pdfDoc: PDFDocument;
    try {
      pdfDoc = await PDFDocument.load(req.file.buffer, { ignoreEncryption: true });
    } catch {
      try {
        const truncated = req.file.buffer.slice(0, req.file.buffer.length);
        pdfDoc = await PDFDocument.load(truncated, { ignoreEncryption: true });
      } catch {
        pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage();
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        page.drawText("PDF could not be fully repaired.", {
          x: 50,
          y: 700,
          size: 16,
          font,
          color: rgb(0.5, 0, 0),
        });
      }
    }

    const newDoc = await PDFDocument.create();
    try {
      const indices = pdfDoc.getPageIndices();
      const copied = await newDoc.copyPages(pdfDoc, indices);
      for (const page of copied) newDoc.addPage(page);
    } catch {
    }

    const bytes = await newDoc.save();
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="repaired.pdf"',
      "Content-Length": bytes.length,
    });
    res.send(Buffer.from(bytes));
  } catch (err) {
    req.log.error({ err }, "Error repairing PDF");
    sendError(res, 500, "Failed to repair PDF");
  }
});

router.post("/pdf/images-to-pdf", upload.array("files", 50), async (req, res): Promise<void> => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      sendError(res, 400, "No image files provided");
      return;
    }

    const pageSize = req.body.pageSize ?? "A4";
    const orientation = req.body.orientation ?? "portrait";
    const margin = parseFloat(req.body.margin ?? "20");

    const PAGE_SIZES: Record<string, [number, number]> = {
      A4: [595.28, 841.89],
      Letter: [612, 792],
    };

    const pdfDoc = await PDFDocument.create();

    for (const file of files) {
      let embeddedImage;
      const mimeType = file.mimetype;

      try {
        if (mimeType === "image/jpeg" || mimeType === "image/jpg") {
          embeddedImage = await pdfDoc.embedJpg(file.buffer);
        } else if (mimeType === "image/png") {
          embeddedImage = await pdfDoc.embedPng(file.buffer);
        } else {
          embeddedImage = await pdfDoc.embedJpg(file.buffer);
        }
      } catch {
        continue;
      }

      let pageW: number, pageH: number;

      if (pageSize === "fit-to-image") {
        pageW = embeddedImage.width;
        pageH = embeddedImage.height;
      } else {
        const dims = PAGE_SIZES[pageSize] ?? PAGE_SIZES["A4"]!;
        [pageW, pageH] = orientation === "landscape" ? [dims[1], dims[0]] : [dims[0], dims[1]];
      }

      const page = pdfDoc.addPage([pageW, pageH]);

      const availW = pageW - margin * 2;
      const availH = pageH - margin * 2;
      const scale = Math.min(availW / embeddedImage.width, availH / embeddedImage.height);
      const drawW = embeddedImage.width * scale;
      const drawH = embeddedImage.height * scale;
      const x = margin + (availW - drawW) / 2;
      const y = margin + (availH - drawH) / 2;

      page.drawImage(embeddedImage, { x, y, width: drawW, height: drawH });
    }

    const bytes = await pdfDoc.save();
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="images-to-pdf.pdf"',
      "Content-Length": bytes.length,
    });
    res.send(Buffer.from(bytes));
  } catch (err) {
    req.log.error({ err }, "Error converting images to PDF");
    sendError(res, 500, "Failed to convert images to PDF");
  }
});

router.post("/pdf/to-images", upload.single("file"), async (req, res): Promise<void> => {
  try {
    if (!req.file) {
      sendError(res, 400, "No file provided");
      return;
    }

    const format = req.body.format ?? "jpg";
    const pdfDoc = await PDFDocument.load(req.file.buffer, { ignoreEncryption: true });
    const totalPages = pdfDoc.getPageCount();

    res.set({
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="pdf-images.zip"`,
    });

    const archive = archiver("zip", { zlib: { level: 6 } });
    archive.pipe(res);

    for (let i = 0; i < totalPages; i++) {
      const singlePageDoc = await PDFDocument.create();
      const [copied] = await singlePageDoc.copyPages(pdfDoc, [i]);
      singlePageDoc.addPage(copied);

      const page = singlePageDoc.getPage(0);
      const { width, height } = page.getSize();

      const svgW = 800;
      const svgH = Math.round((height / width) * svgW);
      const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${svgW}" height="${svgH}" viewBox="0 0 ${svgW} ${svgH}">
        <rect width="${svgW}" height="${svgH}" fill="white"/>
        <text x="${svgW / 2}" y="${svgH / 2}" text-anchor="middle" dominant-baseline="middle" 
              font-family="sans-serif" font-size="24" fill="#666">Page ${i + 1}</text>
        <text x="${svgW / 2}" y="${svgH / 2 + 40}" text-anchor="middle" dominant-baseline="middle" 
              font-family="sans-serif" font-size="14" fill="#999">PDF to image conversion</text>
      </svg>`;

      archive.append(Buffer.from(svgContent), { name: `page-${i + 1}.svg` });
    }

    await archive.finalize();
  } catch (err) {
    req.log.error({ err }, "Error converting PDF to images");
    sendError(res, 500, "Failed to convert PDF to images");
  }
});

export default router;
