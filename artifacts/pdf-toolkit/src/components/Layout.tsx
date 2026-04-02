import { Link } from "wouter";
import { FileText, Search, Menu, X, LogOut, User } from "lucide-react";
import { useState } from "react";
import { useUser, useClerk, Show } from "@clerk/react";
import { Footer } from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
  search?: string;
  onSearchChange?: (value: string) => void;
}

const navLinks = [
  { href: "/merge", label: "Merge PDF" },
  { href: "/split", label: "Split PDF" },
  { href: "/compress", label: "Compress PDF" },
  { href: "/pdf-to-images", label: "Convert PDF" },
  { href: "/", label: "All PDF Tools" },
  { href: "/pricing", label: "Pricing" },
];

function UserMenu() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [open, setOpen] = useState(false);

  if (!user) return null;

  const initials = user.firstName && user.lastName
    ? `${user.firstName[0]}${user.lastName[0]}`
    : user.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase() ?? "U";

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-full hover:ring-2 hover:ring-primary/30 transition-all"
        data-testid="user-menu-button"
      >
        {user.imageUrl ? (
          <img
            src={user.imageUrl}
            alt="Avatar"
            className="w-8 h-8 rounded-full object-cover border"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
            {initials}
          </div>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-56 bg-card border rounded-lg shadow-lg z-50 py-1" data-testid="user-menu-dropdown">
            <div className="px-4 py-3 border-b">
              <p className="text-sm font-medium text-foreground truncate">
                {user.firstName ? `${user.firstName} ${user.lastName ?? ""}`.trim() : "User"}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user.emailAddresses?.[0]?.emailAddress}
              </p>
            </div>
            <button
              onClick={() => {
                setOpen(false);
                signOut({ redirectUrl: window.location.origin + import.meta.env.BASE_URL.replace(/\/$/, "") + "/" });
              }}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              data-testid="sign-out-button"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export function Layout({ children, search, onSearchChange }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/30">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center space-x-2 group shrink-0">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground shadow-sm group-hover:shadow-md transition-shadow">
              <FileText className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg tracking-tight hidden sm:inline">PDF Toolkit</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link key={link.href + link.label} href={link.href} className="text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted px-3 py-2 rounded-md transition-colors">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {onSearchChange && (
              <div className="relative w-full max-w-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-muted-foreground" />
                </div>
                <input
                  type="search"
                  placeholder="Search tools..."
                  className="flex h-9 w-full rounded-lg border border-input bg-muted/50 pl-9 pr-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={search ?? ""}
                  onChange={(e) => onSearchChange(e.target.value)}
                  data-testid="input-search-tools"
                />
              </div>
            )}

            <Show when="signed-in">
              <UserMenu />
            </Show>
            <Show when="signed-out">
              <Link
                href="/sign-in"
                className="text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 px-4 py-2 rounded-md transition-colors"
                data-testid="sign-in-link"
              >
                Sign in
              </Link>
            </Show>

            <button
              className="md:hidden p-2 rounded-md hover:bg-muted transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav className="md:hidden border-t bg-background px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href + link.label}
                href={link.href}
                className="block text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted px-3 py-2 rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </header>

      <main className="flex-1">
        {children}
      </main>

      <Footer />
    </div>
  );
}
