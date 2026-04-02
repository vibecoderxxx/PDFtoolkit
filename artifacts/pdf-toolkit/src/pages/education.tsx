import { Layout } from "@/components/Layout";
import { GraduationCap, BookOpen, Users, DollarSign, Globe, Award } from "lucide-react";

const features = [
  { icon: BookOpen, title: "Academic Resources", description: "Convert lecture notes, research papers, and study materials between formats. OCR scanned textbooks for searchable text." },
  { icon: Users, title: "Classroom Tools", description: "Teachers can merge handouts, add watermarks to exams, and organize course materials efficiently." },
  { icon: DollarSign, title: "Education Pricing", description: "Special discounted pricing for students, teachers, and educational institutions. Up to 50% off standard plans." },
  { icon: Globe, title: "Multi-Language Support", description: "Translate academic documents into over 100 languages. Perfect for international students and research collaboration." },
  { icon: Award, title: "Institutional Licenses", description: "Campus-wide licenses for universities and schools. Manage access centrally with admin tools and usage reports." },
  { icon: GraduationCap, title: "Student-Friendly", description: "Free tier with generous limits for students. No credit card required to get started with essential PDF tools." },
];

export default function Education() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-6">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            PDF Toolkit for Education
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Empowering students, teachers, and institutions with accessible PDF tools. Special pricing and features designed for the academic community.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="p-6 bg-card rounded-xl border">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.description}</p>
              </div>
            );
          })}
        </div>

        <div className="bg-muted/50 rounded-2xl p-8 max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-3">Special Education Discount</h2>
          <p className="text-muted-foreground mb-6">
            Verify your academic status to unlock exclusive pricing for students, educators, and institutions.
          </p>
          <button className="px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors">
            Verify Academic Status
          </button>
        </div>
      </div>
    </Layout>
  );
}
