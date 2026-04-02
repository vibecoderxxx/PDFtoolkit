import { Layout } from "@/components/Layout";
import { Heart, Globe, Users, Target, Lightbulb, Award } from "lucide-react";

const values = [
  { icon: Heart, title: "User First", description: "Every feature we build starts with the user in mind. We obsess over making PDF processing simple, fast, and accessible to everyone." },
  { icon: Globe, title: "Global Reach", description: "PDF Toolkit serves millions of users in over 190 countries. Our tools support 100+ languages and are available 24/7." },
  { icon: Users, title: "Community Driven", description: "We listen to our community. Many of our most popular features were suggested by users who rely on our tools every day." },
  { icon: Target, title: "Quality Focused", description: "We never compromise on quality. Our processing engines are optimized to deliver the best results while maintaining document fidelity." },
];

const milestones = [
  { year: "2020", event: "PDF Toolkit founded with a mission to make PDF tools accessible to everyone." },
  { year: "2021", event: "Launched core tools: merge, split, and compress. Reached 100,000 users." },
  { year: "2022", event: "Added conversion tools and OCR capabilities. Expanded to 1 million monthly users." },
  { year: "2023", event: "Introduced AI-powered features including summarization and translation." },
  { year: "2024", event: "Launched business and education plans. Passed 5 million monthly active users." },
  { year: "2025", event: "Released desktop and mobile apps. Expanded the team to 50+ members worldwide." },
];

export default function About() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            About PDF Toolkit
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We're on a mission to make PDF processing simple, fast, and accessible to everyone. No technical skills required — just upload, process, and download.
          </p>
        </div>

        <div className="max-w-3xl mx-auto mb-16">
          <div className="bg-muted/50 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <Lightbulb className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">Our Story</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-4">
              PDF Toolkit was born out of frustration with complicated, expensive PDF software. We believed there had to be a better way — tools that just work, right in your browser, without installing anything or creating an account.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Today, millions of people around the world use PDF Toolkit every month to merge documents, compress files, convert formats, and much more. We're proud to offer a comprehensive suite of PDF tools that are free for personal use, with premium options for professionals and businesses.
            </p>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">Our Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.title} className="p-6 bg-card rounded-xl border">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold mb-2">{v.title}</h3>
                  <p className="text-sm text-muted-foreground">{v.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Our Journey</h2>
          <div className="space-y-4">
            {milestones.map((m) => (
              <div key={m.year} className="flex gap-4 items-start">
                <div className="w-16 shrink-0 text-right">
                  <span className="font-bold text-primary">{m.year}</span>
                </div>
                <div className="w-px bg-border shrink-0 self-stretch" />
                <p className="text-sm text-muted-foreground pb-2">{m.event}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
