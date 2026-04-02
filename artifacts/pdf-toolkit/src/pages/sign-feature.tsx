import { Layout } from "@/components/Layout";
import { Link } from "wouter";
import { PenTool, FileCheck, Users, Clock, ShieldCheck, Smartphone } from "lucide-react";

const features = [
  { icon: PenTool, title: "Draw Your Signature", description: "Create your signature by drawing it with your mouse, trackpad, or touchscreen. Save it for future use." },
  { icon: FileCheck, title: "Request Signatures", description: "Send documents to others for signing. Track the status of each signature request in real time." },
  { icon: Users, title: "Multiple Signers", description: "Add multiple signature fields for different signers. Set the signing order and notify each party." },
  { icon: Clock, title: "Audit Trail", description: "Every signature includes a detailed audit trail with timestamps, IP addresses, and verification data." },
  { icon: ShieldCheck, title: "Legally Binding", description: "Our electronic signatures comply with eIDAS, ESIGN Act, and UETA regulations worldwide." },
  { icon: Smartphone, title: "Sign Anywhere", description: "Sign documents from any device — desktop, tablet, or phone. No app installation required." },
];

export default function SignFeature() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="w-16 h-16 rounded-2xl bg-violet-100 text-violet-600 flex items-center justify-center mx-auto mb-6">
            <PenTool className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            PDF Toolkit Sign
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Sign documents electronically with legally binding e-signatures. Request signatures from others and track everything in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="p-6 bg-card rounded-xl border">
                <div className="w-10 h-10 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.description}</p>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold mb-3">Start Signing Today</h2>
          <p className="text-muted-foreground mb-6">Try our e-signature tools for free. No credit card required.</p>
          <Link href="/sign" className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors">
            Sign a PDF Now
          </Link>
        </div>
      </div>
    </Layout>
  );
}
