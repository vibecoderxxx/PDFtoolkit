import { Layout } from "@/components/Layout";
import { Link } from "wouter";
import {
  FilePlus2, SplitSquareHorizontal, Minimize2, ImageDown, Lock, Pencil,
  Eye, Sparkles, Languages, Shield, Zap, CloudOff
} from "lucide-react";

const features = [
  {
    icon: FilePlus2,
    title: "Merge PDF",
    description: "Combine multiple PDF files into a single document with ease. Drag and drop your files, arrange them in any order, and merge them in seconds.",
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  {
    icon: SplitSquareHorizontal,
    title: "Split PDF",
    description: "Separate PDF pages into individual files or extract specific page ranges. Perfect for breaking down large documents into manageable sections.",
    color: "text-orange-500",
    bg: "bg-orange-50",
  },
  {
    icon: Minimize2,
    title: "Compress PDF",
    description: "Reduce PDF file size without compromising quality. Choose from multiple compression levels to find the perfect balance between size and clarity.",
    color: "text-green-500",
    bg: "bg-green-50",
  },
  {
    icon: ImageDown,
    title: "Convert PDF",
    description: "Transform PDFs to and from popular formats including Word, Excel, PowerPoint, JPG, and more. Maintain formatting and layout accuracy.",
    color: "text-amber-500",
    bg: "bg-amber-50",
  },
  {
    icon: Lock,
    title: "Protect & Unlock PDF",
    description: "Add password protection to secure your PDFs, or remove passwords from protected files when you have the right credentials.",
    color: "text-rose-500",
    bg: "bg-rose-50",
  },
  {
    icon: Pencil,
    title: "Edit PDF",
    description: "Add text, annotations, watermarks, and page numbers to your PDFs. Crop, rotate, and reorganize pages to get exactly the document you need.",
    color: "text-fuchsia-500",
    bg: "bg-fuchsia-50",
  },
  {
    icon: Eye,
    title: "OCR Recognition",
    description: "Convert scanned documents into searchable and editable PDFs using advanced optical character recognition technology.",
    color: "text-pink-500",
    bg: "bg-pink-50",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Tools",
    description: "Leverage artificial intelligence to summarize documents, translate PDFs into multiple languages, and extract key information automatically.",
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    icon: Languages,
    title: "PDF Translation",
    description: "Translate entire PDF documents while preserving the original layout and formatting. Support for dozens of languages worldwide.",
    color: "text-sky-600",
    bg: "bg-sky-50",
  },
];

const highlights = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Process your PDFs in seconds with our optimized engines. No waiting, no delays — just results.",
  },
  {
    icon: Shield,
    title: "Secure Processing",
    description: "Your files are encrypted during transfer and automatically deleted after processing. Your privacy is our priority.",
  },
  {
    icon: CloudOff,
    title: "Works Offline",
    description: "Many of our tools work directly in your browser without uploading files to any server. True privacy, zero compromise.",
  },
];

export default function Features() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Powerful PDF Features
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            PDF Toolkit gives you everything you need to work with PDF documents. From simple merges to AI-powered translations, we have you covered.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="p-6 bg-card rounded-xl border hover:shadow-md transition-shadow"
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${feature.bg} ${feature.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="bg-muted/50 rounded-2xl p-8 md:p-12 mb-12">
          <h2 className="text-2xl font-bold text-center mb-8">Why Choose PDF Toolkit?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {highlights.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="text-center">
                  <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-muted-foreground mb-6">
            Explore all our tools and start processing your PDFs today — no signup required.
          </p>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
          >
            View All Tools
          </Link>
        </div>
      </div>
    </Layout>
  );
}
