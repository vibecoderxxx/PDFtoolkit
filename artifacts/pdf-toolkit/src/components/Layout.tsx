import { Link } from "wouter";
import { FileText, Github } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/30">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground shadow-sm group-hover:shadow-md transition-shadow">
              <FileText className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg tracking-tight">PDF Toolkit</span>
          </Link>

          <nav className="flex items-center space-x-4">
            <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              All Tools
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="border-t py-8 mt-12 bg-card">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground flex flex-col md:flex-row items-center justify-between">
          <p>© {new Date().getFullYear()} PDF Toolkit. Professional PDF processing.</p>
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
             <span className="text-xs">Fast, Secure, Reliable</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
