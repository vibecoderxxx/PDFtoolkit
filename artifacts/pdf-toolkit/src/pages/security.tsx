import { Layout } from "@/components/Layout";
import { Shield, Lock, Server, Eye, Trash2, Award } from "lucide-react";

const practices = [
  { icon: Lock, title: "Encryption in Transit", description: "All file transfers use TLS 1.3 encryption, ensuring your documents are protected during upload and download. We enforce HTTPS across all endpoints." },
  { icon: Server, title: "Secure Infrastructure", description: "Our servers are hosted in ISO 27001 certified data centers with 24/7 physical security, redundant power, and network monitoring." },
  { icon: Eye, title: "Browser-Based Processing", description: "Many of our tools process files entirely in your browser using WebAssembly technology. Your files never leave your device for these operations." },
  { icon: Trash2, title: "Automatic File Deletion", description: "Files uploaded for server-side processing are automatically and permanently deleted within one hour. No copies are retained." },
  { icon: Award, title: "Compliance Standards", description: "Our security practices align with GDPR, SOC 2, and CCPA requirements. We undergo regular third-party security audits." },
  { icon: Shield, title: "No Data Mining", description: "We never access, analyze, or sell your document content. Your files are processed solely to provide the service you requested." },
];

export default function Security() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <div className="w-16 h-16 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Security at PDF Toolkit
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your documents contain sensitive information. We take every measure to ensure your files remain private and secure throughout the processing pipeline.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {practices.map((p) => {
            const Icon = p.icon;
            return (
              <div key={p.title} className="p-6 bg-card rounded-xl border">
                <div className="w-10 h-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold mb-2">{p.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.description}</p>
              </div>
            );
          })}
        </div>

        <div className="prose prose-sm max-w-none text-muted-foreground">
          <h2 className="text-xl font-bold text-foreground">Our Security Commitment</h2>
          <p>
            At PDF Toolkit, security is not an afterthought — it's foundational to everything we build. We continuously invest in security infrastructure, conduct regular penetration testing, and maintain a responsible disclosure program for security researchers.
          </p>
          <p>
            If you discover a security vulnerability, please report it to our security team. We appreciate the efforts of security researchers and will acknowledge your contribution.
          </p>
        </div>
      </div>
    </Layout>
  );
}
