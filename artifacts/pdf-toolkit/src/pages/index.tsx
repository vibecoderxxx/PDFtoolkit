import { Layout } from "@/components/Layout";
import { Link } from "wouter";
import { 
  FilePlus2, 
  SplitSquareHorizontal, 
  Trash2, 
  FileOutput, 
  Minimize2, 
  Droplet, 
  ListOrdered, 
  Lock, 
  Unlock, 
  RotateCw, 
  Image, 
  ImageDown, 
  Wrench
} from "lucide-react";
import { useState } from "react";

const categories = ["All", "Organize", "Optimize", "Convert", "Security & Edit"] as const;
type Category = typeof categories[number];

const allTools = [
  { id: "merge", name: "Merge PDF", description: "Combine multiple PDFs into one unified document.", icon: FilePlus2, path: "/merge", color: "text-blue-500", bg: "bg-blue-50", category: "Organize" },
  { id: "split", name: "Split PDF", description: "Separate one page or a whole set for easy conversion into independent PDF files.", icon: SplitSquareHorizontal, path: "/split", color: "text-orange-500", bg: "bg-orange-50", category: "Organize" },
  { id: "remove-pages", name: "Remove pages", description: "Remove pages from a PDF document.", icon: Trash2, path: "/remove-pages", color: "text-red-500", bg: "bg-red-50", category: "Organize" },
  { id: "extract-pages", name: "Extract pages", description: "Get a new document containing only the desired pages.", icon: FileOutput, path: "/extract-pages", color: "text-purple-500", bg: "bg-purple-50", category: "Organize" },
  { id: "rotate", name: "Rotate PDF", description: "Rotate your PDFs the way you need them.", icon: RotateCw, path: "/rotate", color: "text-indigo-500", bg: "bg-indigo-50", category: "Organize" },
  { id: "compress", name: "Compress PDF", description: "Reduce file size while optimizing for maximal PDF quality.", icon: Minimize2, path: "/compress", color: "text-green-500", bg: "bg-green-50", category: "Optimize" },
  { id: "repair", name: "Repair PDF", description: "Repair a damaged or corrupted PDF document.", icon: Wrench, path: "/repair", color: "text-slate-500", bg: "bg-slate-50", category: "Optimize" },
  { id: "images-to-pdf", name: "JPG to PDF", description: "Convert JPG images to PDF in seconds.", icon: Image, path: "/images-to-pdf", color: "text-yellow-500", bg: "bg-yellow-50", category: "Convert" },
  { id: "pdf-to-images", name: "PDF to JPG", description: "Convert each PDF page into a JPG or extract all images.", icon: ImageDown, path: "/pdf-to-images", color: "text-amber-500", bg: "bg-amber-50", category: "Convert" },
  { id: "protect", name: "Protect PDF", description: "Encrypt your PDF with a password.", icon: Lock, path: "/protect", color: "text-rose-500", bg: "bg-rose-50", category: "Security & Edit" },
  { id: "unlock", name: "Unlock PDF", description: "Remove PDF password security, giving you the freedom to use your PDFs.", icon: Unlock, path: "/unlock", color: "text-emerald-500", bg: "bg-emerald-50", category: "Security & Edit" },
  { id: "watermark", name: "Add watermark", description: "Stamp an image or text over your PDF in seconds.", icon: Droplet, path: "/watermark", color: "text-cyan-500", bg: "bg-cyan-50", category: "Security & Edit" },
  { id: "page-numbers", name: "Add page numbers", description: "Add page numbers into PDFs with ease.", icon: ListOrdered, path: "/page-numbers", color: "text-teal-500", bg: "bg-teal-50", category: "Security & Edit" },
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
          Let's get started
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
