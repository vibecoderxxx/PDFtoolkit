import { Layout } from "@/components/Layout";
import { Code, Zap, Server, Lock, BarChart3, BookOpen } from "lucide-react";

const features = [
  { icon: Zap, title: "High Performance", description: "Process thousands of PDFs per hour with our optimized API endpoints. Auto-scaling infrastructure handles any volume." },
  { icon: Server, title: "RESTful API", description: "Clean, well-documented REST endpoints. Integrate PDF processing into any application in minutes." },
  { icon: Lock, title: "Secure by Default", description: "API key authentication, HTTPS encryption, and automatic file deletion ensure your data stays safe." },
  { icon: BarChart3, title: "Usage Analytics", description: "Monitor your API usage with real-time dashboards. Set alerts and manage quotas from your developer console." },
  { icon: BookOpen, title: "Comprehensive Docs", description: "Detailed documentation with code examples in Python, JavaScript, PHP, Java, Ruby, and more." },
  { icon: Code, title: "SDKs & Libraries", description: "Official client libraries for all major programming languages. Get started with just a few lines of code." },
];

const endpoints = [
  { method: "POST", path: "/api/v1/merge", description: "Merge multiple PDFs" },
  { method: "POST", path: "/api/v1/split", description: "Split a PDF into parts" },
  { method: "POST", path: "/api/v1/compress", description: "Compress a PDF file" },
  { method: "POST", path: "/api/v1/convert", description: "Convert between formats" },
  { method: "POST", path: "/api/v1/ocr", description: "Apply OCR to a PDF" },
  { method: "POST", path: "/api/v1/watermark", description: "Add watermark to PDF" },
];

export default function DeveloperApi() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-6">
            <Code className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            PDF Toolkit API
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Integrate powerful PDF processing into your applications with our developer-friendly REST API. Process documents at scale with enterprise-grade reliability.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="p-6 bg-card rounded-xl border">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.description}</p>
              </div>
            );
          })}
        </div>

        <div className="max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">API Endpoints</h2>
          <div className="bg-card rounded-xl border overflow-hidden">
            {endpoints.map((ep, i) => (
              <div key={ep.path} className={`flex items-center gap-4 p-4 ${i !== endpoints.length - 1 ? "border-b" : ""}`}>
                <span className="text-xs font-mono font-bold text-green-600 bg-green-50 px-2 py-1 rounded">{ep.method}</span>
                <code className="text-sm font-mono text-foreground">{ep.path}</code>
                <span className="text-sm text-muted-foreground ml-auto hidden sm:inline">{ep.description}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center bg-muted/50 rounded-2xl p-8 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-3">Get Your API Key</h2>
          <p className="text-muted-foreground mb-6">
            Start with 100 free API calls per month. Scale up with flexible pricing as your needs grow.
          </p>
          <button className="px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors">
            Request API Access
          </button>
          <p className="text-xs text-muted-foreground mt-4">API access is currently in beta. Sign up for early access.</p>
        </div>
      </div>
    </Layout>
  );
}
