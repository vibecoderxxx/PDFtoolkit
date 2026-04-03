import { Link } from "wouter";
import { FileText } from "lucide-react";

const footerSections = [
  {
    title: "PRODUCT",
    links: [
      { label: "Home", href: "/" },
      { label: "Features", href: "/features" },
      { label: "Pricing", href: "/pricing" },
      { label: "Tools", href: "/tools" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "SOLUTIONS",
    links: [
      { label: "Business", href: "/business" },
      { label: "Education", href: "/education" },
    ],
  },
  {
    title: "LEGAL",
    links: [
      { label: "Security", href: "/security" },
      { label: "Privacy policy", href: "/privacy" },
      { label: "Terms & conditions", href: "/terms" },
      { label: "Cookies", href: "/cookies" },
    ],
  },
  {
    title: "COMPANY",
    links: [
      { label: "About us", href: "/about" },
      { label: "Contact us", href: "/contact" },
      { label: "Blog", href: "/blog" },
      { label: "Press", href: "/press" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-[hsl(230,55%,5%)] text-gray-400 mt-0 border-t border-white/5">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-white/90 font-semibold text-sm tracking-wider mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-500 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 mt-10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
              <FileText className="w-4 h-4" />
            </div>
            <span className="text-white font-semibold text-sm">PDF Toolkit</span>
          </div>
          <p className="text-xs text-gray-600">
            &copy; {new Date().getFullYear()} PDF Toolkit. All rights reserved. Professional PDF processing tools.
          </p>
        </div>
      </div>
    </footer>
  );
}
