import { Layout } from "@/components/Layout";
import { Link, useLocation } from "wouter";
import { 
  FilePlus2, SplitSquareHorizontal, Trash2, FileOutput, Minimize2, Droplet, 
  ListOrdered, Lock, Unlock, RotateCw, Image, ImageDown, Wrench, Search,
  GripVertical, ScanLine, Eye, FileText, Presentation, Sheet, Code,
  FileDown, FileUp, ShieldCheck, Crop, Pencil, PenTool, EyeOff,
  GitCompare, Sparkles, Languages, ArrowRight, Zap, Shield, Globe, Loader2, Send
} from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";

const categories = ["All", "Organize", "Optimize", "Convert to PDF", "Convert from PDF", "Edit", "Security", "AI"] as const;
type Category = typeof categories[number];

const categoryIcons: Record<Category, typeof Zap> = {
  "All": Zap,
  "Organize": GripVertical,
  "Optimize": Minimize2,
  "Convert to PDF": FileUp,
  "Convert from PDF": FileDown,
  "Edit": Pencil,
  "Security": Shield,
  "AI": Sparkles,
};

const allTools = [
  { id: "merge", name: "Merge PDF", description: "Combine multiple PDFs into one unified document.", icon: FilePlus2, path: "/merge", color: "text-blue-400", bg: "bg-blue-500/15", gradient: "from-blue-500/10 to-blue-600/5", category: "Organize" as Category },
  { id: "split", name: "Split PDF", description: "Separate one page or a whole set for easy conversion into independent PDF files.", icon: SplitSquareHorizontal, path: "/split", color: "text-orange-400", bg: "bg-orange-500/15", gradient: "from-orange-500/10 to-orange-600/5", category: "Organize" as Category },
  { id: "remove-pages", name: "Remove pages", description: "Remove pages from a PDF document.", icon: Trash2, path: "/remove-pages", color: "text-red-400", bg: "bg-red-500/15", gradient: "from-red-500/10 to-red-600/5", category: "Organize" as Category },
  { id: "extract-pages", name: "Extract pages", description: "Get a new document containing only the desired pages.", icon: FileOutput, path: "/extract-pages", color: "text-purple-400", bg: "bg-purple-500/15", gradient: "from-purple-500/10 to-purple-600/5", category: "Organize" as Category },
  { id: "organize", name: "Organize PDF", description: "Sort, reorder, and organize the pages of your PDF.", icon: GripVertical, path: "/organize", color: "text-violet-400", bg: "bg-violet-500/15", gradient: "from-violet-500/10 to-violet-600/5", category: "Organize" as Category },
  { id: "scan-to-pdf", name: "Scan to PDF", description: "Upload scanned images and convert them into a PDF.", icon: ScanLine, path: "/scan-to-pdf", color: "text-sky-400", bg: "bg-sky-500/15", gradient: "from-sky-500/10 to-sky-600/5", category: "Organize" as Category },

  { id: "compress", name: "Compress PDF", description: "Reduce file size while optimizing for maximal PDF quality.", icon: Minimize2, path: "/compress", color: "text-green-400", bg: "bg-green-500/15", gradient: "from-green-500/10 to-green-600/5", category: "Optimize" as Category },
  { id: "repair", name: "Repair PDF", description: "Repair a damaged or corrupted PDF document.", icon: Wrench, path: "/repair", color: "text-slate-400", bg: "bg-slate-500/15", gradient: "from-slate-500/10 to-slate-600/5", category: "Optimize" as Category },
  { id: "ocr", name: "OCR PDF", description: "Apply OCR to make scanned PDFs searchable.", icon: Eye, path: "/ocr", color: "text-pink-400", bg: "bg-pink-500/15", gradient: "from-pink-500/10 to-pink-600/5", category: "Optimize" as Category },

  { id: "images-to-pdf", name: "JPG to PDF", description: "Convert JPG images to PDF in seconds.", icon: Image, path: "/images-to-pdf", color: "text-yellow-400", bg: "bg-yellow-500/15", gradient: "from-yellow-500/10 to-yellow-600/5", category: "Convert to PDF" as Category },
  { id: "word-to-pdf", name: "WORD to PDF", description: "Convert Word documents to PDF format.", icon: FileText, path: "/word-to-pdf", color: "text-blue-400", bg: "bg-blue-500/15", gradient: "from-blue-600/10 to-blue-700/5", category: "Convert to PDF" as Category },
  { id: "powerpoint-to-pdf", name: "POWERPOINT to PDF", description: "Convert PowerPoint presentations to PDF.", icon: Presentation, path: "/powerpoint-to-pdf", color: "text-orange-400", bg: "bg-orange-500/15", gradient: "from-orange-600/10 to-orange-700/5", category: "Convert to PDF" as Category },
  { id: "excel-to-pdf", name: "EXCEL to PDF", description: "Convert Excel spreadsheets to PDF.", icon: Sheet, path: "/excel-to-pdf", color: "text-green-400", bg: "bg-green-500/15", gradient: "from-green-600/10 to-green-700/5", category: "Convert to PDF" as Category },
  { id: "html-to-pdf", name: "HTML to PDF", description: "Convert HTML files to PDF documents.", icon: Code, path: "/html-to-pdf", color: "text-indigo-400", bg: "bg-indigo-500/15", gradient: "from-indigo-500/10 to-indigo-600/5", category: "Convert to PDF" as Category },

  { id: "pdf-to-images", name: "PDF to JPG", description: "Convert each PDF page into a JPG image.", icon: ImageDown, path: "/pdf-to-images", color: "text-amber-400", bg: "bg-amber-500/15", gradient: "from-amber-500/10 to-amber-600/5", category: "Convert from PDF" as Category },
  { id: "pdf-to-word", name: "PDF to WORD", description: "Convert PDF files to editable Word documents.", icon: FileDown, path: "/pdf-to-word", color: "text-blue-400", bg: "bg-blue-500/15", gradient: "from-blue-600/10 to-blue-700/5", category: "Convert from PDF" as Category },
  { id: "pdf-to-powerpoint", name: "PDF to POWERPOINT", description: "Convert PDF to editable PowerPoint presentations.", icon: FileUp, path: "/pdf-to-powerpoint", color: "text-orange-400", bg: "bg-orange-500/15", gradient: "from-orange-600/10 to-orange-700/5", category: "Convert from PDF" as Category },
  { id: "pdf-to-excel", name: "PDF to EXCEL", description: "Extract data from PDF into Excel spreadsheets.", icon: Sheet, path: "/pdf-to-excel", color: "text-green-400", bg: "bg-green-500/15", gradient: "from-green-600/10 to-green-700/5", category: "Convert from PDF" as Category },
  { id: "pdf-to-pdfa", name: "PDF to PDF/A", description: "Convert PDF to PDF/A for long-term archiving.", icon: ShieldCheck, path: "/pdf-to-pdfa", color: "text-teal-400", bg: "bg-teal-500/15", gradient: "from-teal-600/10 to-teal-700/5", category: "Convert from PDF" as Category },

  { id: "rotate", name: "Rotate PDF", description: "Rotate your PDFs the way you need them.", icon: RotateCw, path: "/rotate", color: "text-indigo-400", bg: "bg-indigo-500/15", gradient: "from-indigo-500/10 to-indigo-600/5", category: "Edit" as Category },
  { id: "page-numbers", name: "Add page numbers", description: "Add page numbers into PDFs with ease.", icon: ListOrdered, path: "/page-numbers", color: "text-teal-400", bg: "bg-teal-500/15", gradient: "from-teal-500/10 to-teal-600/5", category: "Edit" as Category },
  { id: "watermark", name: "Add watermark", description: "Stamp an image or text over your PDF.", icon: Droplet, path: "/watermark", color: "text-cyan-400", bg: "bg-cyan-500/15", gradient: "from-cyan-500/10 to-cyan-600/5", category: "Edit" as Category },
  { id: "crop", name: "Crop PDF", description: "Trim the margins of your PDF pages.", icon: Crop, path: "/crop", color: "text-lime-400", bg: "bg-lime-500/15", gradient: "from-lime-600/10 to-lime-700/5", category: "Edit" as Category },
  { id: "edit-pdf", name: "Edit PDF", description: "Add text annotations to your PDF.", icon: Pencil, path: "/edit-pdf", color: "text-fuchsia-400", bg: "bg-fuchsia-500/15", gradient: "from-fuchsia-500/10 to-fuchsia-600/5", category: "Edit" as Category },

  { id: "unlock", name: "Unlock PDF", description: "Remove PDF password security.", icon: Unlock, path: "/unlock", color: "text-emerald-400", bg: "bg-emerald-500/15", gradient: "from-emerald-500/10 to-emerald-600/5", category: "Security" as Category },
  { id: "protect", name: "Protect PDF", description: "Encrypt your PDF with a password.", icon: Lock, path: "/protect", color: "text-rose-400", bg: "bg-rose-500/15", gradient: "from-rose-500/10 to-rose-600/5", category: "Security" as Category },
  { id: "sign", name: "Sign PDF", description: "Add your signature to any PDF document.", icon: PenTool, path: "/sign", color: "text-violet-400", bg: "bg-violet-500/15", gradient: "from-violet-600/10 to-violet-700/5", category: "Security" as Category },
  { id: "redact", name: "Redact PDF", description: "Black out sensitive information.", icon: EyeOff, path: "/redact", color: "text-red-400", bg: "bg-red-500/15", gradient: "from-red-600/10 to-red-700/5", category: "Security" as Category },
  { id: "compare", name: "Compare PDF", description: "Compare two PDFs and find differences.", icon: GitCompare, path: "/compare", color: "text-amber-400", bg: "bg-amber-500/15", gradient: "from-amber-600/10 to-amber-700/5", category: "Security" as Category },

  { id: "ai-summarize", name: "AI Summarizer", description: "Get an AI-powered summary of your PDF.", icon: Sparkles, path: "/ai-summarize", color: "text-purple-400", bg: "bg-purple-500/15", gradient: "from-purple-600/10 to-purple-700/5", category: "AI" as Category },
  { id: "translate", name: "Translate PDF", description: "Translate your PDF to any language using AI.", icon: Languages, path: "/translate", color: "text-sky-400", bg: "bg-sky-500/15", gradient: "from-sky-600/10 to-sky-700/5", category: "AI" as Category },
];

const popularToolIds = ["merge", "compress", "split", "ai-summarize", "translate", "pdf-to-word"];

const exampleQueries = [
  "I need to combine 3 PDFs into one",
  "Make my PDF file smaller",
  "Convert my Word doc to PDF",
  "I want to translate a PDF to Spanish",
  "Summarize this document for me",
  "Remove password from my PDF",
];

function AISearchBar() {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [aiResults, setAiResults] = useState<{ ids: string[]; message: string } | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [placeholder, setPlaceholder] = useState(exampleQueries[0]);
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const [, navigate] = useLocation();

  useEffect(() => {
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % exampleQueries.length;
      setPlaceholder(exampleQueries[idx]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const performSearch = useCallback(async (q: string) => {
    if (q.trim().length < 3) {
      setAiResults(null);
      setShowResults(false);
      return;
    }
    setIsSearching(true);
    setShowResults(true);
    try {
      const baseUrl = import.meta.env.BASE_URL || "/";
      const apiBase = `${window.location.origin}${baseUrl}`.replace(/\/$/, "");
      const res = await fetch(`${apiBase}/api/pdf/ai-search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q }),
      });
      const data = await res.json();
      setAiResults({ ids: data.results || [], message: data.message || "" });
    } catch {
      setAiResults(null);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleInputChange = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (value.trim().length < 3) {
      setAiResults(null);
      setShowResults(false);
      return;
    }
    debounceRef.current = setTimeout(() => performSearch(value), 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (debounceRef.current) clearTimeout(debounceRef.current);
    performSearch(query);
  };

  const matchedTools = aiResults?.ids
    ?.map(id => allTools.find(t => t.id === id))
    .filter(Boolean) || [];

  return (
    <div ref={searchRef} className="relative max-w-2xl mx-auto mb-8">
      <form onSubmit={handleSubmit} className="relative">
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
          {isSearching ? (
            <Loader2 className="h-5 w-5 text-primary animate-spin" />
          ) : (
            <Sparkles className="h-5 w-5 text-primary/60" />
          )}
        </div>
        <input
          type="text"
          placeholder={placeholder}
          className="flex h-14 w-full rounded-2xl border-2 border-input bg-card pl-13 pr-14 py-2 text-base shadow-lg shadow-black/5 transition-all placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary focus-visible:shadow-primary/10"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => { if (aiResults && aiResults.ids.length > 0) setShowResults(true); }}
          data-testid="input-search-tools"
        />
        <button
          type="submit"
          className="absolute inset-y-0 right-0 pr-4 flex items-center"
          disabled={isSearching || query.trim().length < 3}
        >
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
            query.trim().length >= 3
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "bg-muted text-muted-foreground"
          }`}>
            <Send className="w-4 h-4" />
          </div>
        </button>
      </form>

      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-2xl border border-border shadow-xl shadow-black/10 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {isSearching ? (
            <div className="flex items-center gap-3 p-5">
              <Loader2 className="w-5 h-5 text-primary animate-spin" />
              <span className="text-sm text-muted-foreground">AI is finding the best tools for you...</span>
            </div>
          ) : matchedTools.length > 0 ? (
            <div>
              {aiResults?.message && (
                <div className="px-5 pt-4 pb-2">
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <p className="text-sm text-foreground leading-relaxed">{aiResults.message}</p>
                  </div>
                </div>
              )}
              <div className="px-2 pb-2">
                {matchedTools.map((tool) => {
                  if (!tool) return null;
                  const Icon = tool.icon;
                  return (
                    <button
                      key={tool.id}
                      onClick={() => {
                        setShowResults(false);
                        navigate(tool.path);
                      }}
                      className="w-full flex items-center gap-4 px-3 py-3 rounded-xl hover:bg-muted/80 transition-colors text-left group"
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${tool.bg} ${tool.color} group-hover:scale-110 transition-transform`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">{tool.name}</h4>
                        <p className="text-xs text-muted-foreground truncate">{tool.description}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>
          ) : aiResults ? (
            <div className="p-5 text-center">
              <p className="text-sm text-muted-foreground">No matching tools found. Try describing what you want to do differently.</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");

  const filteredTools = allTools.filter(tool => {
    return activeCategory === "All" || tool.category === activeCategory;
  });

  const popularTools = allTools.filter(t => popularToolIds.includes(t.id));
  const showHero = activeCategory === "All";

  return (
    <Layout>
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-primary/8 to-transparent rounded-full blur-3xl opacity-50 pointer-events-none" />
        
        <div className="container mx-auto px-4 pt-12 pb-6 relative">
          {showHero && (
            <div className="text-center mb-10 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Now powered by AI</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground mb-4 leading-tight" data-testid="heading-home">
                Every tool you need to{" "}
                <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  work with PDFs
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Tell us what you need — our AI will find the perfect tool for you.
              </p>
            </div>
          )}

          <AISearchBar />

          {showHero && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-3xl mx-auto mb-8">
              {popularTools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <Link
                    key={tool.id}
                    href={tool.path}
                    className={`group flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r ${tool.gradient} border border-transparent hover:border-primary/30 transition-all duration-200 hover:shadow-md`}
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${tool.bg} ${tool.color} shrink-0 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    <span className="font-medium text-sm text-foreground group-hover:text-primary transition-colors truncate">
                      {tool.name}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity ml-auto shrink-0" />
                  </Link>
                );
              })}
            </div>
          )}

          {showHero && (
            <div className="flex items-center justify-center gap-8 md:gap-12 mb-10 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span>31 PDF Tools</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-500" />
                <span>Secure Processing</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-500" />
                <span>AI-Powered</span>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="container mx-auto px-4 pb-4">
        <div className="flex flex-wrap justify-center gap-2 mb-8" data-testid="category-filters">
          {categories.map((cat) => {
            const CatIcon = categoryIcons[cat];
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/25 scale-105"
                    : "bg-card text-muted-foreground border border-border hover:border-primary/30 hover:text-foreground hover:shadow-sm"
                }`}
                data-testid={`filter-${cat}`}
              >
                <CatIcon className="w-3.5 h-3.5" />
                {cat}
              </button>
            );
          })}
        </div>
      </div>
      <div className="container mx-auto px-4 pb-16">
        {filteredTools.length === 0 ? (
          <div className="text-center py-16" data-testid="empty-search">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
              <Search className="w-7 h-7 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No tools found</h3>
            <p className="text-muted-foreground">Try a different search term or category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" data-testid="tools-grid">
            {filteredTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link 
                  key={tool.id} 
                  href={tool.path}
                  className="group relative flex flex-col p-5 bg-card rounded-2xl border border-border/80 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-0.5"
                  data-testid={`link-tool-${tool.id}`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${tool.bg} ${tool.color} group-hover:scale-110 group-hover:shadow-md transition-all duration-300`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1.5 group-hover:text-primary transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                    {tool.description}
                  </p>
                  <div className="flex items-center gap-1 mt-3 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span>Use tool</span>
                    <ArrowRight className="w-3 h-3" />
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
