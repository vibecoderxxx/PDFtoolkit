import { Router, type IRouter } from "express";
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

const TOOL_CATALOG = [
  { id: "merge", name: "Merge PDF", keywords: "combine join multiple pdfs together" },
  { id: "split", name: "Split PDF", keywords: "separate divide break apart pages" },
  { id: "remove-pages", name: "Remove Pages", keywords: "delete pages remove unwanted" },
  { id: "extract-pages", name: "Extract Pages", keywords: "get specific pages extract selection" },
  { id: "organize", name: "Organize PDF", keywords: "reorder sort rearrange pages" },
  { id: "scan-to-pdf", name: "Scan to PDF", keywords: "scan images photos convert to pdf" },
  { id: "compress", name: "Compress PDF", keywords: "reduce size smaller optimize shrink" },
  { id: "repair", name: "Repair PDF", keywords: "fix broken corrupted damaged" },
  { id: "ocr", name: "OCR PDF", keywords: "text recognition searchable scanned" },
  { id: "images-to-pdf", name: "JPG to PDF", keywords: "image photo picture convert jpg png" },
  { id: "word-to-pdf", name: "Word to PDF", keywords: "docx word document convert" },
  { id: "powerpoint-to-pdf", name: "PowerPoint to PDF", keywords: "pptx presentation slides convert" },
  { id: "excel-to-pdf", name: "Excel to PDF", keywords: "xlsx spreadsheet table convert" },
  { id: "html-to-pdf", name: "HTML to PDF", keywords: "webpage html web convert" },
  { id: "pdf-to-images", name: "PDF to JPG", keywords: "convert images pictures jpg photos" },
  { id: "pdf-to-word", name: "PDF to Word", keywords: "convert docx editable word document" },
  { id: "pdf-to-powerpoint", name: "PDF to PowerPoint", keywords: "convert pptx slides presentation" },
  { id: "pdf-to-excel", name: "PDF to Excel", keywords: "convert xlsx spreadsheet data extract" },
  { id: "pdf-to-pdfa", name: "PDF to PDF/A", keywords: "archive long-term storage compliance" },
  { id: "rotate", name: "Rotate PDF", keywords: "turn flip orientation landscape portrait" },
  { id: "page-numbers", name: "Add Page Numbers", keywords: "numbering pagination footer header" },
  { id: "watermark", name: "Add Watermark", keywords: "stamp text overlay branding confidential" },
  { id: "crop", name: "Crop PDF", keywords: "trim margins resize cut borders" },
  { id: "edit-pdf", name: "Edit PDF", keywords: "annotate text add modify write" },
  { id: "unlock", name: "Unlock PDF", keywords: "remove password decrypt open protected" },
  { id: "protect", name: "Protect PDF", keywords: "password encrypt secure lock" },
  { id: "sign", name: "Sign PDF", keywords: "signature sign name autograph" },
  { id: "redact", name: "Redact PDF", keywords: "black out censor hide sensitive remove info" },
  { id: "compare", name: "Compare PDF", keywords: "diff differences compare two files" },
  { id: "ai-summarize", name: "AI Summarizer", keywords: "summary summarize overview key points tldr" },
  { id: "translate", name: "Translate PDF", keywords: "translate language spanish french german" },
];

router.post("/pdf/ai-search", async (req, res): Promise<void> => {
  try {
    const { query } = req.body;
    if (!query || typeof query !== "string" || query.trim().length < 2) {
      res.json({ results: [], message: "" });
      return;
    }
    const toolList = TOOL_CATALOG.map(t => `${t.id}: ${t.name} (${t.keywords})`).join("\n");
    const mistral = getMistralClient();
    const completion = await mistral.chat.completions.create({
      model: "mistral-large-latest",
      messages: [
        {
          role: "system",
          content: `You are a PDF tool recommendation assistant. Given a user's description of what they want to do, return the most relevant tool IDs from this list:\n\n${toolList}\n\nRespond with ONLY a JSON object in this exact format: {"ids":["tool-id-1","tool-id-2"],"message":"Brief helpful suggestion"}\nReturn 1-4 most relevant tools. The message should be a short, friendly one-liner explaining what to use. Do not include anything outside the JSON.`
        },
        { role: "user", content: query.trim() }
      ],
      max_tokens: 200,
    });
    const raw = completion.choices[0]?.message?.content || "";
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      const validIds = (parsed.ids || []).filter((id: string) => TOOL_CATALOG.some(t => t.id === id));
      res.json({ results: validIds, message: parsed.message || "" });
    } else {
      res.json({ results: [], message: "" });
    }
  } catch (err) {
    req.log.error({ err }, "Error in AI search");
    res.json({ results: [], message: "" });
  }
});

export default router;
