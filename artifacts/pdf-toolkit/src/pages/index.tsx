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
  Wrench,
  Search
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const tools = [
  {
    category: "Organize",
    items: [
      { id: "merge", name: "Merge PDF", description: "Combine multiple PDFs into one unified document.", icon: FilePlus2, path: "/merge", color: "text-blue-500", bg: "bg-blue-50" },
      { id: "split", name: "Split PDF", description: "Separate one page or a whole set for easy conversion into independent PDF files.", icon: SplitSquareHorizontal, path: "/split", color: "text-orange-500", bg: "bg-orange-50" },
      { id: "remove-pages", name: "Remove pages", description: "Remove pages from a PDF document.", icon: Trash2, path: "/remove-pages", color: "text-red-500", bg: "bg-red-50" },
      { id: "extract-pages", name: "Extract pages", description: "Get a new document containing only the desired pages.", icon: FileOutput, path: "/extract-pages", color: "text-purple-500", bg: "bg-purple-50" },
      { id: "rotate", name: "Rotate PDF", description: "Rotate your PDFs the way you need them.", icon: RotateCw, path: "/rotate", color: "text-indigo-500", bg: "bg-indigo-50" },
    ]
  },
  {
    category: "Optimize",
    items: [
      { id: "compress", name: "Compress PDF", description: "Reduce file size while optimizing for maximal PDF quality.", icon: Minimize2, path: "/compress", color: "text-green-500", bg: "bg-green-50" },
      { id: "repair", name: "Repair PDF", description: "Repair a damaged or corrupted PDF document.", icon: Wrench, path: "/repair", color: "text-slate-500", bg: "bg-slate-50" },
    ]
  },
  {
    category: "Convert",
    items: [
      { id: "images-to-pdf", name: "JPG to PDF", description: "Convert JPG images to PDF in seconds.", icon: Image, path: "/images-to-pdf", color: "text-yellow-500", bg: "bg-yellow-50" },
      { id: "pdf-to-images", name: "PDF to JPG", description: "Convert each PDF page into a JPG or extract all images.", icon: ImageDown, path: "/pdf-to-images", color: "text-amber-500", bg: "bg-amber-50" },
    ]
  },
  {
    category: "Security & Edit",
    items: [
      { id: "protect", name: "Protect PDF", description: "Encrypt your PDF with a password.", icon: Lock, path: "/protect", color: "text-rose-500", bg: "bg-rose-50" },
      { id: "unlock", name: "Unlock PDF", description: "Remove PDF password security, giving you the freedom to use your PDFs.", icon: Unlock, path: "/unlock", color: "text-emerald-500", bg: "bg-emerald-50" },
      { id: "watermark", name: "Add watermark", description: "Stamp an image or text over your PDF in seconds.", icon: Droplet, path: "/watermark", color: "text-cyan-500", bg: "bg-cyan-50" },
      { id: "page-numbers", name: "Add page numbers", description: "Add page numbers into PDFs with ease.", icon: ListOrdered, path: "/page-numbers", color: "text-teal-500", bg: "bg-teal-50" },
    ]
  }
];

export default function Home() {
  const [search, setSearch] = useState("");

  const filteredTools = search ? tools.map(category => ({
    ...category,
    items: category.items.filter(item => 
      item.name.toLowerCase().includes(search.toLowerCase()) || 
      item.description.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(category => category.items.length > 0) : tools;

  return (
    <Layout>
      <div className="bg-primary/5 py-16 md:py-24 border-b">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6" data-testid="heading-home">
            Every tool you need to work with PDFs
          </h1>
          <p className="text-xl text-muted-foreground mb-10">
            A free, professional online PDF toolkit to merge, compress, create, edit and convert PDFs. Fast and secure.
          </p>
          
          <div className="relative max-w-xl mx-auto shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>
            <Input
              type="search"
              placeholder="Search for a tool..."
              className="pl-11 py-6 text-lg rounded-2xl bg-background border-muted"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-testid="input-search-tools"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {filteredTools.length === 0 ? (
          <div className="text-center py-12" data-testid="empty-search">
            <h3 className="text-xl font-medium text-foreground">No tools found</h3>
            <p className="text-muted-foreground mt-2">Try adjusting your search.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {filteredTools.map((category) => (
              <div key={category.category} data-testid={`category-${category.category}`}>
                <h2 className="text-2xl font-bold mb-6 text-foreground">{category.category}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {category.items.map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <Link 
                        key={tool.id} 
                        href={tool.path}
                        className="group flex flex-col p-6 bg-card rounded-2xl border hover:border-primary/50 hover:shadow-md transition-all duration-200"
                        data-testid={`link-tool-${tool.id}`}
                      >
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${tool.bg} ${tool.color} group-hover:scale-110 transition-transform duration-200`}>
                          <Icon className="w-7 h-7" />
                        </div>
                        <h3 className="font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                          {tool.name}
                        </h3>
                        <p className="text-sm text-muted-foreground flex-1 leading-relaxed">
                          {tool.description}
                        </p>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
