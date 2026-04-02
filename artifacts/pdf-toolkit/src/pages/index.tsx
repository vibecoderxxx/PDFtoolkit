import { Layout } from "@/components/Layout";
import { Link } from "wouter";
import { 
  FilePlus2, SplitSquareHorizontal, Trash2, FileOutput, Minimize2, Droplet, 
  ListOrdered, Lock, Unlock, RotateCw, Image, ImageDown, Wrench, Search,
  GripVertical, ScanLine, Eye, FileText, Presentation, Sheet, Code,
  FileDown, FileUp, ShieldCheck, Crop, Pencil, PenTool, EyeOff,
  GitCompare, Sparkles, Languages
} from "lucide-react";
import { useState } from "react";

const categories = ["All", "Organize", "Optimize", "Convert to PDF", "Convert from PDF", "Edit", "Security", "AI"] as const;
type Category = typeof categories[number];

const allTools = [
  { id: "merge", name: "Merge PDF", description: "Combine multiple PDFs into one unified document.", icon: FilePlus2, path: "/merge", color: "text-blue-500", bg: "bg-blue-50", category: "Organize" as Category },
  { id: "split", name: "Split PDF", description: "Separate one page or a whole set for easy conversion into independent PDF files.", icon: SplitSquareHorizontal, path: "/split", color: "text-orange-500", bg: "bg-orange-50", category: "Organize" as Category },
  { id: "remove-pages", name: "Remove pages", description: "Remove pages from a PDF document.", icon: Trash2, path: "/remove-pages", color: "text-red-500", bg: "bg-red-50", category: "Organize" as Category },
  { id: "extract-pages", name: "Extract pages", description: "Get a new document containing only the desired pages.", icon: FileOutput, path: "/extract-pages", color: "text-purple-500", bg: "bg-purple-50", category: "Organize" as Category },
  { id: "organize", name: "Organize PDF", description: "Sort, reorder, and organize the pages of your PDF.", icon: GripVertical, path: "/organize", color: "text-violet-500", bg: "bg-violet-50", category: "Organize" as Category },
  { id: "scan-to-pdf", name: "Scan to PDF", description: "Upload scanned images and convert them into a PDF.", icon: ScanLine, path: "/scan-to-pdf", color: "text-sky-500", bg: "bg-sky-50", category: "Organize" as Category },

  { id: "compress", name: "Compress PDF", description: "Reduce file size while optimizing for maximal PDF quality.", icon: Minimize2, path: "/compress", color: "text-green-500", bg: "bg-green-50", category: "Optimize" as Category },
  { id: "repair", name: "Repair PDF", description: "Repair a damaged or corrupted PDF document.", icon: Wrench, path: "/repair", color: "text-slate-500", bg: "bg-slate-50", category: "Optimize" as Category },
  { id: "ocr", name: "OCR PDF", description: "Apply OCR to make scanned PDFs searchable.", icon: Eye, path: "/ocr", color: "text-pink-500", bg: "bg-pink-50", category: "Optimize" as Category },

  { id: "images-to-pdf", name: "JPG to PDF", description: "Convert JPG images to PDF in seconds.", icon: Image, path: "/images-to-pdf", color: "text-yellow-500", bg: "bg-yellow-50", category: "Convert to PDF" as Category },
  { id: "word-to-pdf", name: "WORD to PDF", description: "Convert Word documents to PDF format.", icon: FileText, path: "/word-to-pdf", color: "text-blue-600", bg: "bg-blue-50", category: "Convert to PDF" as Category },
  { id: "powerpoint-to-pdf", name: "POWERPOINT to PDF", description: "Convert PowerPoint presentations to PDF.", icon: Presentation, path: "/powerpoint-to-pdf", color: "text-orange-600", bg: "bg-orange-50", category: "Convert to PDF" as Category },
  { id: "excel-to-pdf", name: "EXCEL to PDF", description: "Convert Excel spreadsheets to PDF.", icon: Sheet, path: "/excel-to-pdf", color: "text-green-600", bg: "bg-green-50", category: "Convert to PDF" as Category },
  { id: "html-to-pdf", name: "HTML to PDF", description: "Convert HTML files to PDF documents.", icon: Code, path: "/html-to-pdf", color: "text-indigo-500", bg: "bg-indigo-50", category: "Convert to PDF" as Category },

  { id: "pdf-to-images", name: "PDF to JPG", description: "Convert each PDF page into a JPG image.", icon: ImageDown, path: "/pdf-to-images", color: "text-amber-500", bg: "bg-amber-50", category: "Convert from PDF" as Category },
  { id: "pdf-to-word", name: "PDF to WORD", description: "Convert PDF files to editable Word documents.", icon: FileDown, path: "/pdf-to-word", color: "text-blue-600", bg: "bg-blue-50", category: "Convert from PDF" as Category },
  { id: "pdf-to-powerpoint", name: "PDF to POWERPOINT", description: "Convert PDF to editable PowerPoint presentations.", icon: FileUp, path: "/pdf-to-powerpoint", color: "text-orange-600", bg: "bg-orange-50", category: "Convert from PDF" as Category },
  { id: "pdf-to-excel", name: "PDF to EXCEL", description: "Extract data from PDF into Excel spreadsheets.", icon: Sheet, path: "/pdf-to-excel", color: "text-green-600", bg: "bg-green-50", category: "Convert from PDF" as Category },
  { id: "pdf-to-pdfa", name: "PDF to PDF/A", description: "Convert PDF to PDF/A for long-term archiving.", icon: ShieldCheck, path: "/pdf-to-pdfa", color: "text-teal-600", bg: "bg-teal-50", category: "Convert from PDF" as Category },

  { id: "rotate", name: "Rotate PDF", description: "Rotate your PDFs the way you need them.", icon: RotateCw, path: "/rotate", color: "text-indigo-500", bg: "bg-indigo-50", category: "Edit" as Category },
  { id: "page-numbers", name: "Add page numbers", description: "Add page numbers into PDFs with ease.", icon: ListOrdered, path: "/page-numbers", color: "text-teal-500", bg: "bg-teal-50", category: "Edit" as Category },
  { id: "watermark", name: "Add watermark", description: "Stamp an image or text over your PDF.", icon: Droplet, path: "/watermark", color: "text-cyan-500", bg: "bg-cyan-50", category: "Edit" as Category },
  { id: "crop", name: "Crop PDF", description: "Trim the margins of your PDF pages.", icon: Crop, path: "/crop", color: "text-lime-600", bg: "bg-lime-50", category: "Edit" as Category },
  { id: "edit-pdf", name: "Edit PDF", description: "Add text annotations to your PDF.", icon: Pencil, path: "/edit-pdf", color: "text-fuchsia-500", bg: "bg-fuchsia-50", category: "Edit" as Category },

  { id: "unlock", name: "Unlock PDF", description: "Remove PDF password security.", icon: Unlock, path: "/unlock", color: "text-emerald-500", bg: "bg-emerald-50", category: "Security" as Category },
  { id: "protect", name: "Protect PDF", description: "Encrypt your PDF with a password.", icon: Lock, path: "/protect", color: "text-rose-500", bg: "bg-rose-50", category: "Security" as Category },
  { id: "sign", name: "Sign PDF", description: "Add your signature to any PDF document.", icon: PenTool, path: "/sign", color: "text-violet-600", bg: "bg-violet-50", category: "Security" as Category },
  { id: "redact", name: "Redact PDF", description: "Black out sensitive information.", icon: EyeOff, path: "/redact", color: "text-red-600", bg: "bg-red-50", category: "Security" as Category },
  { id: "compare", name: "Compare PDF", description: "Compare two PDFs and find differences.", icon: GitCompare, path: "/compare", color: "text-amber-600", bg: "bg-amber-50", category: "Security" as Category },

  { id: "ai-summarize", name: "AI Summarizer", description: "Get an AI-powered summary of your PDF.", icon: Sparkles, path: "/ai-summarize", color: "text-purple-600", bg: "bg-purple-50", category: "AI" as Category },
  { id: "translate", name: "Translate PDF", description: "Translate your PDF to any language using AI.", icon: Languages, path: "/translate", color: "text-sky-600", bg: "bg-sky-50", category: "AI" as Category },
];

export default function Home() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category>("All");

  const filteredTools = allTools.filter(tool => {
    const matchesCategory = activeCategory === "All" || tool.category === activeCategory;
    const matchesSearch = !search || 
      tool.name.toLowerCase().includes(search.toLowerCase()) || 
      tool.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <Layout search={search} onSearchChange={setSearch}>
      <div className="container mx-auto px-4 pt-10 pb-4">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-8" data-testid="heading-home">
          Every tool you need to work with PDFs
        </h1>

        <div className="flex flex-wrap gap-2 mb-8" data-testid="category-filters">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
              data-testid={`filter-${cat}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 pb-12">
        {filteredTools.length === 0 ? (
          <div className="text-center py-12" data-testid="empty-search">
            <h3 className="text-xl font-medium text-foreground">No tools found</h3>
            <p className="text-muted-foreground mt-2">Try adjusting your search or filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" data-testid="tools-grid">
            {filteredTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link 
                  key={tool.id} 
                  href={tool.path}
                  className="group flex items-start gap-4 p-5 bg-card rounded-xl border hover:border-primary/50 hover:shadow-md transition-all duration-200"
                  data-testid={`link-tool-${tool.id}`}
                >
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${tool.bg} ${tool.color} group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                      {tool.name}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {tool.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
