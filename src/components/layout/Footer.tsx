"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, Mail, Play, Star, Globe } from "lucide-react";
import { getLenis } from "@/components/providers/LenisProvider";

const footerNavLinks = [
  { id: "hero", label: "Home" },
  { id: "videos", label: "Videos" },
  { id: "photos", label: "Photos" },
  { id: "about", label: "About" },
  { id: "services", label: "Services" },
  { id: "contact", label: "Contact" },
];

const serviceLinks = [
  "Video Editing",
  "Motion Graphics",
  "Graphic Design",
  "Branding",
  "Social Media",
];

const socialLinks = [
  { href: "https://instagram.com", icon: Globe, label: "Instagram" },
  { href: "https://youtube.com", icon: Play, label: "YouTube" },
  { href: "https://twitter.com", icon: ExternalLink, label: "Twitter" },
  { href: "https://linkedin.com", icon: Star, label: "LinkedIn" },
  { href: "mailto:hello@visualcraft.com", icon: Mail, label: "Email" },
];

export function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const isHomePage = pathname === "/";

  const scrollToSection = (sectionId: string) => {
    if (!isHomePage) {
      // If not on homepage, navigate there
      window.location.assign(`/#${sectionId}`);
      return;
    }
    const lenis = getLenis();
    const target = document.getElementById(sectionId);
    if (lenis && target) {
      lenis.scrollTo(target, { duration: 1.5 });
    }
  };

  return (
    <footer className="bg-neutral-950 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        {/* Top section */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="text-white font-bold text-2xl tracking-tight mb-4">
              <span className="text-white">VISUAL</span>
              <span className="text-neutral-500">CRAFT</span>
            </div>
            <p className="text-neutral-400 text-sm leading-relaxed max-w-xs">
              Video Editor · Motion Graphics Designer · Creative Visual Artist.
              Crafting stories through the art of visual storytelling.
            </p>
            <div className="flex items-center gap-4 mt-6">
              {socialLinks.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  aria-label={label}
                  className="text-neutral-500 hover:text-white transition-colors duration-200"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-widest uppercase mb-4">
              Navigation
            </h4>
            <ul className="space-y-3">
              {footerNavLinks.map(({ id, label }) => (
                <li key={id}>
                  <button
                    onClick={() => scrollToSection(id)}
                    className="text-neutral-400 hover:text-white text-sm transition-colors duration-200"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-widest uppercase mb-4">
              Services
            </h4>
            <ul className="space-y-3">
              {serviceLinks.map((label) => (
                <li key={label}>
                  <button
                    onClick={() => scrollToSection("services")}
                    className="text-neutral-400 hover:text-white text-sm transition-colors duration-200"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-neutral-600 text-xs">
            © {new Date().getFullYear()} VisualCraft. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-neutral-600 text-xs">
              Built with Next.js
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
