import { Layout } from "@/components/Layout";
import { Mail, MapPin, Clock, MessageSquare, Phone, HelpCircle } from "lucide-react";
import { Link } from "wouter";

const contactMethods = [
  { icon: Mail, title: "Email Support", description: "Get a response within 24 hours for general inquiries.", detail: "support@pdftoolkit.com" },
  { icon: MessageSquare, title: "Live Chat", description: "Available Monday to Friday, 9am to 6pm CET.", detail: "Start a conversation" },
  { icon: Phone, title: "Phone Support", description: "Premium and business customers only.", detail: "+1 (555) 123-4567" },
];

export default function Contact() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have a question, suggestion, or need help? We'd love to hear from you. Choose the best way to reach us below.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {contactMethods.map((m) => {
            const Icon = m.icon;
            return (
              <div key={m.title} className="p-6 bg-card rounded-xl border text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold mb-1">{m.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{m.description}</p>
                <p className="text-sm font-medium text-primary">{m.detail}</p>
              </div>
            );
          })}
        </div>

        <div className="bg-card rounded-xl border p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input type="text" className="w-full px-3 py-2 rounded-lg border bg-background text-sm" placeholder="Your name" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input type="email" className="w-full px-3 py-2 rounded-lg border bg-background text-sm" placeholder="you@example.com" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Subject</label>
              <input type="text" className="w-full px-3 py-2 rounded-lg border bg-background text-sm" placeholder="How can we help?" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea className="w-full px-3 py-2 rounded-lg border bg-background text-sm min-h-[120px]" placeholder="Tell us more..." />
            </div>
            <button type="submit" className="px-6 py-2.5 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors text-sm">
              Send Message
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-muted/50 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Office</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              PDF Toolkit Inc.<br />
              123 Document Drive<br />
              San Francisco, CA 94102<br />
              United States
            </p>
          </div>
          <div className="p-6 bg-muted/50 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Business Hours</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Monday – Friday: 9:00 AM – 6:00 PM CET<br />
              Saturday – Sunday: Closed<br /><br />
              <Link href="/faq" className="text-primary hover:underline inline-flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5" /> Check our FAQ for quick answers
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
