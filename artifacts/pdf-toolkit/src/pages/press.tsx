import { Layout } from "@/components/Layout";
import { Newspaper, Download, Mail, ExternalLink } from "lucide-react";

const pressReleases = [
  { date: "March 15, 2026", title: "PDF Toolkit Surpasses 10 Million Monthly Active Users", excerpt: "The online PDF processing platform reaches a new milestone, serving users across 190+ countries." },
  { date: "February 1, 2026", title: "PDF Toolkit Launches AI-Powered Document Translation", excerpt: "New feature enables automatic translation of PDF documents into over 100 languages while preserving layout." },
  { date: "December 10, 2025", title: "PDF Toolkit Introduces Desktop Applications for Windows and macOS", excerpt: "Users can now process PDFs locally with offline support and no file size limitations." },
  { date: "October 5, 2025", title: "PDF Toolkit Expands Enterprise Offering with Team Management", excerpt: "New business features include centralized billing, admin dashboards, and SSO integration." },
  { date: "August 20, 2025", title: "PDF Toolkit Achieves SOC 2 Type II Compliance", excerpt: "Third-party audit confirms PDF Toolkit meets rigorous security and privacy standards." },
];

const mediaFeatures = [
  { outlet: "TechCrunch", quote: "PDF Toolkit has become the go-to solution for anyone who needs to work with PDFs without installing bulky software." },
  { outlet: "Product Hunt", quote: "A beautifully designed, comprehensive PDF toolkit that just works. No signup required." },
  { outlet: "The Verge", quote: "Finally, a free PDF tool that doesn't feel like it was designed in 2005." },
];

export default function Press() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <div className="w-16 h-16 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-6">
            <Newspaper className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Press & Media
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Latest news and media resources from PDF Toolkit. For press inquiries, please contact our media team.
          </p>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Press Releases</h2>
          <div className="space-y-4">
            {pressReleases.map((pr) => (
              <div key={pr.title} className="p-5 bg-card rounded-xl border hover:shadow-md transition-shadow">
                <p className="text-xs text-muted-foreground mb-1">{pr.date}</p>
                <h3 className="font-semibold text-lg mb-2">{pr.title}</h3>
                <p className="text-sm text-muted-foreground">{pr.excerpt}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">In the Media</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mediaFeatures.map((mf) => (
              <div key={mf.outlet} className="p-5 bg-muted/50 rounded-xl">
                <p className="text-sm text-muted-foreground italic mb-3">"{mf.quote}"</p>
                <p className="text-sm font-semibold text-foreground flex items-center gap-1">
                  — {mf.outlet} <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-xl border p-8">
          <h2 className="text-2xl font-bold mb-4">Media Resources</h2>
          <p className="text-muted-foreground mb-6">
            Download our brand assets, logos, and product screenshots for editorial use.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors text-sm">
              <Download className="w-4 h-4" /> Download Press Kit
            </button>
            <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-secondary text-secondary-foreground font-medium rounded-lg hover:bg-secondary/80 transition-colors text-sm">
              <Mail className="w-4 h-4" /> Contact Media Team
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
