import { Layout } from "@/components/Layout";
import { Link } from "wouter";
import {
  FilePlus2, SplitSquareHorizontal, Trash2, FileOutput, Minimize2, Droplet,
  ListOrdered, Lock, Unlock, RotateCw, Image, ImageDown, Wrench,
  GripVertical, ScanLine, Eye, FileText, Presentation, Sheet, Code,
  FileDown, FileUp, ShieldCheck, Crop, Pencil, PenTool, EyeOff,
  GitCompare, Sparkles, Languages
} from "lucide-react";

const toolGroups = [
  {
    category: "Organize",
    tools: [
      { name: "Merge PDF", description: "Combine multiple PDFs into one.", icon: FilePlus2, path: "/merge", color: "text-blue-500", bg: "bg-blue-50" },
      { name: "Split PDF", description: "Separate pages into individual PDFs.", icon: SplitSquareHorizontal, path: "/split", color: "text-orange-500", bg: "bg-orange-50" },
      { name: "Remove Pages", description: "Delete unwanted pages.", icon: Trash2, path: "/remove-pages", color: "text-red-500", bg: "bg-red-50" },
      { name: "Extract Pages", description: "Pull specific pages out.", icon: FileOutput, path: "/extract-pages", color: "text-purple-500", bg: "bg-purple-50" },
      { name: "Organize PDF", description: "Reorder and sort pages.", icon: GripVertical, path: "/organize", color: "text-violet-500", bg: "bg-violet-50" },
      { name: "Scan to PDF", description: "Convert scanned images to PDF.", icon: ScanLine, path: "/scan-to-pdf", color: "text-sky-500", bg: "bg-sky-50" },
    ],
  },
  {
    category: "Optimize",
    tools: [
      { name: "Compress PDF", description: "Reduce file size.", icon: Minimize2, path: "/compress", color: "text-green-500", bg: "bg-green-50" },
      { name: "Repair PDF", description: "Fix corrupted PDFs.", icon: Wrench, path: "/repair", color: "text-slate-500", bg: "bg-slate-50" },
      { name: "OCR PDF", description: "Make scanned PDFs searchable.", icon: Eye, path: "/ocr", color: "text-pink-500", bg: "bg-pink-50" },
    ],
  },
  {
    category: "Convert to PDF",
    tools: [
      { name: "JPG to PDF", description: "Convert images to PDF.", icon: Image, path: "/images-to-pdf", color: "text-yellow-500", bg: "bg-yellow-50" },
      { name: "Word to PDF", description: "Convert Word docs.", icon: FileText, path: "/word-to-pdf", color: "text-blue-600", bg: "bg-blue-50" },
      { name: "PowerPoint to PDF", description: "Convert presentations.", icon: Presentation, path: "/powerpoint-to-pdf", color: "text-orange-600", bg: "bg-orange-50" },
      { name: "Excel to PDF", description: "Convert spreadsheets.", icon: Sheet, path: "/excel-to-pdf", color: "text-green-600", bg: "bg-green-50" },
      { name: "HTML to PDF", description: "Convert web pages.", icon: Code, path: "/html-to-pdf", color: "text-indigo-500", bg: "bg-indigo-50" },
    ],
  },
  {
    category: "Convert from PDF",
    tools: [
      { name: "PDF to JPG", description: "Convert pages to images.", icon: ImageDown, path: "/pdf-to-images", color: "text-amber-500", bg: "bg-amber-50" },
      { name: "PDF to Word", description: "Convert to Word docs.", icon: FileDown, path: "/pdf-to-word", color: "text-blue-600", bg: "bg-blue-50" },
      { name: "PDF to PowerPoint", description: "Convert to presentations.", icon: FileUp, path: "/pdf-to-powerpoint", color: "text-orange-600", bg: "bg-orange-50" },
      { name: "PDF to Excel", description: "Extract data to Excel.", icon: Sheet, path: "/pdf-to-excel", color: "text-green-600", bg: "bg-green-50" },
      { name: "PDF to PDF/A", description: "Archive-ready conversion.", icon: ShieldCheck, path: "/pdf-to-pdfa", color: "text-teal-600", bg: "bg-teal-50" },
    ],
  },
  {
    category: "Edit",
    tools: [
      { name: "Rotate PDF", description: "Rotate pages to any angle.", icon: RotateCw, path: "/rotate", color: "text-indigo-500", bg: "bg-indigo-50" },
      { name: "Page Numbers", description: "Add page numbers.", icon: ListOrdered, path: "/page-numbers", color: "text-teal-500", bg: "bg-teal-50" },
      { name: "Watermark", description: "Stamp text or images.", icon: Droplet, path: "/watermark", color: "text-cyan-500", bg: "bg-cyan-50" },
      { name: "Crop PDF", description: "Trim page margins.", icon: Crop, path: "/crop", color: "text-lime-600", bg: "bg-lime-50" },
      { name: "Edit PDF", description: "Add text annotations.", icon: Pencil, path: "/edit-pdf", color: "text-fuchsia-500", bg: "bg-fuchsia-50" },
    ],
  },
  {
    category: "Security",
    tools: [
      { name: "Unlock PDF", description: "Remove password protection.", icon: Unlock, path: "/unlock", color: "text-emerald-500", bg: "bg-emerald-50" },
      { name: "Protect PDF", description: "Encrypt with a password.", icon: Lock, path: "/protect", color: "text-rose-500", bg: "bg-rose-50" },
      { name: "Sign PDF", description: "Add your signature.", icon: PenTool, path: "/sign", color: "text-violet-600", bg: "bg-violet-50" },
      { name: "Redact PDF", description: "Black out sensitive info.", icon: EyeOff, path: "/redact", color: "text-red-600", bg: "bg-red-50" },
      { name: "Compare PDF", description: "Find differences.", icon: GitCompare, path: "/compare", color: "text-amber-600", bg: "bg-amber-50" },
    ],
  },
  {
    category: "AI",
    tools: [
      { name: "AI Summarizer", description: "AI-powered summaries.", icon: Sparkles, path: "/ai-summarize", color: "text-purple-600", bg: "bg-purple-50" },
      { name: "Translate PDF", description: "Translate with AI.", icon: Languages, path: "/translate", color: "text-sky-600", bg: "bg-sky-50" },
    ],
  },
];

export default function Tools() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            All PDF Tools
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A complete directory of every tool available in PDF Toolkit. Click any tool to get started instantly.
          </p>
        </div>

        {toolGroups.map((group) => (
          <div key={group.category} className="mb-10">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">{group.category}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {group.tools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <Link
                    key={tool.path}
                    href={tool.path}
                    className="group flex items-center gap-3 p-4 bg-card rounded-xl border hover:border-primary/50 hover:shadow-md transition-all"
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${tool.bg} ${tool.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">{tool.name}</h3>
                      <p className="text-xs text-muted-foreground">{tool.description}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}
