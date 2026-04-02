import { Layout } from "@/components/Layout";
import { Smartphone, Camera, Share2, Bell, Fingerprint, CloudOff } from "lucide-react";

const features = [
  { icon: Camera, title: "Scan Documents", description: "Use your phone's camera to scan paper documents and convert them to PDFs instantly." },
  { icon: Share2, title: "Easy Sharing", description: "Share processed PDFs directly via email, messaging apps, or cloud storage from your device." },
  { icon: Bell, title: "Smart Notifications", description: "Get notified when batch processing is complete so you can multitask freely." },
  { icon: Fingerprint, title: "Biometric Security", description: "Protect your documents with fingerprint or face recognition on supported devices." },
  { icon: CloudOff, title: "Offline Mode", description: "Core tools work without an internet connection. Process PDFs on the go, anywhere." },
  { icon: Smartphone, title: "Native Experience", description: "Built natively for iOS and Android with intuitive gestures and smooth animations." },
];

export default function MobileApp() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-6">
            <Smartphone className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            PDF Toolkit Mobile
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Take your PDF tools everywhere. Scan, edit, convert, and share documents from your phone or tablet.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="p-6 bg-card rounded-xl border text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.description}</p>
              </div>
            );
          })}
        </div>

        <div className="text-center bg-muted/50 rounded-2xl p-8 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-3">Download the App</h2>
          <p className="text-muted-foreground mb-6">
            Available on iOS and Android. Get started with PDF processing on the go.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button className="px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors">
              App Store
            </button>
            <button className="px-6 py-3 bg-secondary text-secondary-foreground font-medium rounded-lg hover:bg-secondary/80 transition-colors">
              Google Play
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-4">Coming soon. Join the waitlist to be notified.</p>
        </div>
      </div>
    </Layout>
  );
}
