"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getLenis } from "@/components/providers/LenisProvider";

gsap.registerPlugin(ScrollTrigger);

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function HeroSection() {
  const containerRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Parallax on background grid
      const gridBg = containerRef.current!.querySelector("[data-parallax]");
      if (gridBg) {
        gsap.to(gridBg, {
          y: 150,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      // Parallax on gradient orbs
      const orbs = containerRef.current!.querySelectorAll("[data-orb]");
      orbs.forEach((orb, i) => {
        gsap.to(orb, {
          y: 80 + i * 40,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      // Fade out content as user scrolls away
      const content = containerRef.current!.querySelector("[data-hero-content]");
      if (content) {
        gsap.to(content, {
          y: -50,
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "60% top",
            scrub: true,
          },
        });
      }

      // Scroll indicator fade out
      const scrollIndicator = containerRef.current!.querySelector("[data-scroll-indicator]");
      if (scrollIndicator) {
        gsap.to(scrollIndicator, {
          opacity: 0,
          y: 20,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "10% top",
            end: "30% top",
            scrub: true,
          },
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const scrollToWork = () => {
    const lenis = getLenis();
    const target = document.getElementById("work");
    if (lenis && target) {
      lenis.scrollTo(target, { duration: 1.5 });
    }
  };

  const scrollToContact = () => {
    const lenis = getLenis();
    const target = document.getElementById("contact");
    if (lenis && target) {
      lenis.scrollTo(target, { duration: 1.5 });
    }
  };

  return (
    <section
      id="hero"
      data-section="hero"
      ref={containerRef}
      className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-[#0a0a0a]"
    >
      {/* Background noise grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        data-parallax
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Gradient orbs */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full"
        data-orb
        style={{
          background: "radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/3 left-1/4 w-80 h-80 rounded-full"
        data-orb
        style={{
          background: "radial-gradient(circle, rgba(255,255,255,0.02) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      {/* Main content */}
      <div data-hero-content className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20">
        {/* Label */}
        <motion.div
          className="flex items-center gap-3 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
        >
          <div className="w-8 h-px bg-neutral-600" />
          <span className="text-neutral-500 text-xs tracking-[0.3em] uppercase font-medium">
            Creative Portfolio
          </span>
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-neutral-600 text-xs">Available for work</span>
        </motion.div>

        {/* Main headline */}
        <div ref={headlineRef}>
          <div className="overflow-hidden">
            <motion.h1
              className="text-[clamp(3rem,9vw,9rem)] font-black leading-[0.9] tracking-[-0.04em] text-white mb-2"
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.4, ease: EASE }}
            >
              CREATIVE
            </motion.h1>
          </div>
          <div className="overflow-hidden">
            <motion.h1
              className="text-[clamp(3rem,9vw,9rem)] font-black leading-[0.9] tracking-[-0.04em] text-white mb-2"
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.5, ease: EASE }}
            >
              VISUAL
            </motion.h1>
          </div>
          <div className="overflow-hidden">
            <motion.h1
              className="text-[clamp(3rem,9vw,9rem)] font-black leading-[0.9] tracking-[-0.04em] text-transparent"
              style={{
                WebkitTextStroke: "1px rgba(255,255,255,0.3)",
              }}
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.6, ease: EASE }}
            >
              STORYTELLER
            </motion.h1>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-12 flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9, ease: EASE }}
          >
            <p className="text-neutral-400 text-sm tracking-[0.15em] uppercase mb-6">
              Video Editor&nbsp;·&nbsp;Motion Designer&nbsp;·&nbsp;Visual Artist
            </p>
            <div className="flex items-center gap-4">
              <button
                onClick={scrollToWork}
                className="group inline-flex items-center gap-3 bg-white text-black font-bold text-sm px-7 py-4 rounded-full hover:bg-neutral-100 transition-all duration-300 hover:scale-105"
              >
                View My Work
                <span className="w-5 h-5 rounded-full bg-black flex items-center justify-center group-hover:translate-x-1 transition-transform duration-300">
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                    <path d="M1 4h6M4 1l3 3-3 3" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </button>
              <button
                onClick={scrollToContact}
                className="inline-flex items-center gap-2 text-neutral-400 hover:text-white text-sm font-medium transition-colors duration-200 border border-white/10 px-6 py-4 rounded-full hover:border-white/30"
              >
                Get in touch
              </button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="flex items-center gap-8 lg:gap-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1, ease: EASE }}
          >
            {[
              { value: "8+", label: "Years Experience" },
              { value: "120+", label: "Projects Done" },
              { value: "50+", label: "Happy Clients" },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-white text-2xl font-black tracking-tight">{value}</div>
                <div className="text-neutral-600 text-xs tracking-wide mt-1">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        data-scroll-indicator
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown size={16} className="text-neutral-600" />
        </motion.div>
        <div className="w-px h-12 bg-gradient-to-b from-neutral-600 to-transparent" />
      </motion.div>

      {/* Side labels */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden xl:flex flex-col items-center gap-2">
        <div className="text-neutral-700 text-[10px] tracking-[0.3em] uppercase vertical-rl"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}>
          Scroll to explore
        </div>
        <div className="w-px h-16 bg-gradient-to-b from-transparent via-neutral-700 to-transparent" />
      </div>
    </section>
  );
}
