import { Layout } from "@/components/Layout";
import { Building2, Users, Shield, BarChart3, Settings, HeadphonesIcon } from "lucide-react";

const features = [
  { icon: Users, title: "Team Collaboration", description: "Manage your team from a central dashboard. Set permissions, track usage, and share templates across your organization." },
  { icon: Shield, title: "Enterprise Security", description: "SOC 2 compliant infrastructure with SSO integration, audit logs, and data residency options for regulated industries." },
  { icon: BarChart3, title: "Usage Analytics", description: "Detailed reporting on document processing across your team. Track productivity and optimize your document workflows." },
  { icon: Settings, title: "Custom Workflows", description: "Create automated PDF processing pipelines tailored to your business. Integrate with your existing tools and systems." },
  { icon: HeadphonesIcon, title: "Priority Support", description: "Dedicated account manager and priority support channels. Get help when you need it, from people who understand your needs." },
  { icon: Building2, title: "Volume Licensing", description: "Flexible pricing that scales with your team. Save more as you grow with volume discounts and annual plans." },
];

export default function Business() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-6">
            <Building2 className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            PDF Toolkit for Business
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Empower your team with professional PDF tools designed for enterprise. Streamline document workflows, ensure compliance, and boost productivity.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="p-6 bg-card rounded-xl border">
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.description}</p>
              </div>
            );
          })}
        </div>

        <div className="bg-muted/50 rounded-2xl p-8 max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-3">Trusted by Over 10,000 Companies</h2>
          <p className="text-muted-foreground mb-6">
            From startups to Fortune 500 companies, businesses of all sizes rely on PDF Toolkit to handle their document processing needs.
          </p>
          <button className="px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors">
            Contact Sales
          </button>
        </div>
      </div>
    </Layout>
  );
}
