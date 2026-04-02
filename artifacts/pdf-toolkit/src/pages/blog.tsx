import { Layout } from "@/components/Layout";
import { Calendar, ArrowRight } from "lucide-react";

const posts = [
  {
    title: "How to Compress PDFs Without Losing Quality",
    excerpt: "Learn the best techniques for reducing PDF file sizes while maintaining visual quality. We cover compression levels, image optimization, and more.",
    date: "March 28, 2026",
    category: "Tips & Tricks",
    readTime: "5 min read",
  },
  {
    title: "The Complete Guide to PDF/A Archival Format",
    excerpt: "Everything you need to know about PDF/A, the ISO-standardized format for long-term document preservation. When to use it and how to convert.",
    date: "March 20, 2026",
    category: "Guides",
    readTime: "8 min read",
  },
  {
    title: "5 Ways to Secure Your PDF Documents",
    excerpt: "From password protection to redaction, discover the most effective methods to keep your sensitive PDF documents safe and secure.",
    date: "March 12, 2026",
    category: "Security",
    readTime: "6 min read",
  },
  {
    title: "Introducing AI-Powered PDF Translation",
    excerpt: "We're excited to announce our new AI translation feature that can translate entire PDF documents while preserving the original layout and formatting.",
    date: "March 5, 2026",
    category: "Product Updates",
    readTime: "3 min read",
  },
  {
    title: "OCR Technology: Making Scanned PDFs Searchable",
    excerpt: "Optical Character Recognition has come a long way. Learn how our OCR engine converts scanned documents into fully searchable and editable PDFs.",
    date: "February 25, 2026",
    category: "Technology",
    readTime: "7 min read",
  },
  {
    title: "PDF Toolkit for Teams: Collaboration Features",
    excerpt: "Discover how businesses can leverage PDF Toolkit's team features for streamlined document workflows, shared templates, and centralized management.",
    date: "February 18, 2026",
    category: "Product Updates",
    readTime: "4 min read",
  },
];

const categories = ["All", "Tips & Tricks", "Guides", "Security", "Product Updates", "Technology"];

export default function Blog() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            PDF Toolkit Blog
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tips, guides, and product updates from the PDF Toolkit team. Stay up to date with the latest in PDF processing.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                cat === "All"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {posts.map((post) => (
            <article key={post.title} className="bg-card rounded-xl border overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-40 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">{post.category}</span>
              </div>
              <div className="p-5">
                <h2 className="font-semibold text-lg mb-2 line-clamp-2">{post.title}</h2>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{post.excerpt}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{post.date}</span>
                  </div>
                  <span>{post.readTime}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </Layout>
  );
}
