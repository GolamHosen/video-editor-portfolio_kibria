"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getLenis } from "@/components/providers/LenisProvider";

gsap.registerPlugin(ScrollTrigger);

const sections = [
  { id: "hero", label: "Home" },
  { id: "videos", label: "Videos" },
  { id: "photos", label: "Photos" },
  { id: "about", label: "About" },
  { id: "services", label: "Services" },
  { id: "testimonials", label: "Testimonials" },
  { id: "contact", label: "Contact" },
];

export function SectionNav() {
  const [activeSection, setActiveSection] = useState("hero");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show nav after scrolling past hero
    const showTrigger = ScrollTrigger.create({
      trigger: "#hero",
      start: "bottom 80%",
      onEnterBack: () => setIsVisible(false),
      onLeave: () => setIsVisible(true),
    });

    // Track active section
    const triggers = sections.map((section) => {
      return ScrollTrigger.create({
        trigger: `#${section.id}`,
        start: "top center",
        end: "bottom center",
        onEnter: () => setActiveSection(section.id),
        onEnterBack: () => setActiveSection(section.id),
      });
    });

    return () => {
      showTrigger.kill();
      triggers.forEach((t) => t.kill());
    };
  }, []);

  const scrollToSection = useCallback((sectionId: string) => {
    const lenis = getLenis();
    const target = document.getElementById(sectionId);
    if (lenis && target) {
      lenis.scrollTo(target, { offset: 0, duration: 1.5 });
    }
  }, []);

  return (
    <motion.nav
      className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col items-center gap-3"
      initial={{ opacity: 0, x: 20 }}
      animate={{
        opacity: isVisible ? 1 : 0,
        x: isVisible ? 0 : 20,
        pointerEvents: isVisible ? "auto" as const : "none" as const,
      }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="bg-black/40 backdrop-blur-xl border border-white/[0.06] rounded-full py-4 px-2 flex flex-col items-center gap-3">
        {sections.map((section) => {
          const isActive = activeSection === section.id;
          return (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className="group relative flex items-center justify-center"
              aria-label={`Navigate to ${section.label}`}
            >
              {/* Dot */}
              <motion.div
                className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                  isActive
                    ? "bg-white"
                    : "bg-neutral-600 group-hover:bg-neutral-400"
                }`}
                animate={{
                  scale: isActive ? 1.4 : 1,
                }}
                transition={{ duration: 0.3 }}
              />

              {/* Label tooltip */}
              <div className="absolute right-7 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none translate-x-1 group-hover:translate-x-0">
                <span className="whitespace-nowrap text-[10px] tracking-[0.15em] uppercase font-medium text-neutral-300 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/[0.06]">
                  {section.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </motion.nav>
  );
}
