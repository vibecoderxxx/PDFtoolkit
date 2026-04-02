import { Layout } from "@/components/Layout";
import { Link } from "wouter";
import { Monitor, Zap, WifiOff, HardDrive, Shield, Download } from "lucide-react";

const features = [
  { icon: Zap, title: "Blazing Fast", description: "Process files locally without upload delays. Handle large PDFs and batch operations at full speed." },
  { icon: WifiOff, title: "Works Offline", description: "No internet connection required. Process your PDFs anywhere, anytime — even on a plane." },
  { icon: HardDrive, title: "Unlimited Processing", description: "No file size limits or daily caps. Process as many PDFs as your machine can handle." },
  { icon: Shield, title: "Maximum Privacy", description: "Your files never leave your computer. Everything is processed locally on your device." },
];

export default function Desktop() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-6">
            <Monitor className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            PDF Toolkit Desktop
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            All the power of PDF Toolkit, right on your desktop. Work faster with local processing, offline access, and no file size limits.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-4xl mx-auto">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="p-6 bg-card rounded-xl border">
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.description}</p>
              </div>
            );
          })}
        </div>

        <div className="text-center bg-muted/50 rounded-2xl p-8 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-3">Available for Windows and macOS</h2>
          <p className="text-muted-foreground mb-6">
            Download PDF Toolkit Desktop and start processing PDFs locally. Free to try, with premium plans for power users.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors">
              <Download className="w-4 h-4" /> Download for Windows
            </button>
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground font-medium rounded-lg hover:bg-secondary/80 transition-colors">
              <Download className="w-4 h-4" /> Download for macOS
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-4">Coming soon. Join the waitlist to be notified when it launches.</p>
        </div>
      </div>
    </Layout>
  );
}
