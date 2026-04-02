import { Layout } from "@/components/Layout";
import { Link } from "wouter";
import { Image, Minimize2, RotateCw, Crop, Palette, FileImage } from "lucide-react";

const tools = [
  { icon: Minimize2, title: "Compress Images", description: "Reduce image file sizes without visible quality loss. Support for JPG, PNG, and WebP formats.", color: "text-green-500", bg: "bg-green-50" },
  { icon: RotateCw, title: "Rotate & Flip", description: "Rotate images by any angle or flip them horizontally and vertically.", color: "text-indigo-500", bg: "bg-indigo-50" },
  { icon: Crop, title: "Crop Images", description: "Trim and crop your images to the perfect dimensions. Supports custom aspect ratios.", color: "text-lime-600", bg: "bg-lime-50" },
  { icon: Palette, title: "Convert Formats", description: "Convert between JPG, PNG, WebP, GIF, BMP, and TIFF formats effortlessly.", color: "text-amber-500", bg: "bg-amber-50" },
  { icon: FileImage, title: "Resize Images", description: "Resize images by percentage or to exact pixel dimensions while maintaining aspect ratio.", color: "text-blue-500", bg: "bg-blue-50" },
  { icon: Image, title: "Image to PDF", description: "Convert one or multiple images into a PDF document. Arrange and organize before converting.", color: "text-yellow-500", bg: "bg-yellow-50" },
];

export default function ImageTools() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="w-16 h-16 rounded-2xl bg-yellow-100 text-yellow-600 flex items-center justify-center mx-auto mb-6">
            <Image className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Image Tools
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Beyond PDFs, PDF Toolkit also offers a suite of image processing tools. Compress, convert, resize, and edit your images with the same ease.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
          {tools.map((t) => {
            const Icon = t.icon;
            return (
              <div key={t.title} className="p-6 bg-card rounded-xl border hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${t.bg} ${t.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{t.title}</h3>
                <p className="text-sm text-muted-foreground">{t.description}</p>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <p className="text-muted-foreground mb-4">Need to convert images to PDF?</p>
          <Link href="/images-to-pdf" className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors">
            Try JPG to PDF Tool
          </Link>
        </div>
      </div>
    </Layout>
  );
}
