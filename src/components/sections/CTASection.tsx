"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SlideUp, Reveal } from "@/components/animation";

export function CTASection() {
  return (
    <section className="py-24 md:py-32 bg-neutral-950 overflow-hidden relative">
      {/* Background text */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        aria-hidden="true"
      >
        <span className="text-[20vw] font-black text-white/[0.02] tracking-tighter leading-none">
          WORK
        </span>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <Reveal>
          <span className="text-neutral-600 text-xs tracking-[0.3em] uppercase font-medium">
            Ready to create?
          </span>
        </Reveal>

        <SlideUp delay={0.1}>
          <h2 className="text-4xl md:text-7xl font-black tracking-tight text-white mt-4 mb-6">
            Let&apos;s build
            <br />
            <span className="text-transparent" style={{ WebkitTextStroke: "1px rgba(255,255,255,0.3)" }}>
              something great
            </span>
          </h2>
        </SlideUp>

        <SlideUp delay={0.2}>
          <p className="text-neutral-500 text-base md:text-lg leading-relaxed mb-10 max-w-xl mx-auto">
            Whether you have a brief or just an idea, I&apos;d love to hear about your project.
            Let&apos;s create something you&apos;ll be proud of.
          </p>
        </SlideUp>

        <SlideUp delay={0.3}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="group inline-flex items-center gap-3 bg-white text-black font-bold text-sm px-8 py-5 rounded-full hover:bg-neutral-100 transition-all duration-300 hover:scale-105"
              data-cursor="explore"
            >
              Start a Project
              <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
            </Link>
            <Link
              href="/work"
              className="inline-flex items-center gap-2 text-neutral-400 hover:text-white text-sm font-medium transition-colors duration-200 border border-white/10 px-8 py-5 rounded-full hover:border-white/30"
              data-cursor="link"
            >
              Browse my work
            </Link>
          </div>
        </SlideUp>

        {/* Contact details */}
        <motion.div
          className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-neutral-600"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <a
            href="mailto:hello@visualcraft.com"
            className="hover:text-white transition-colors duration-200"
          >
            hello@visualcraft.com
          </a>
          <span className="hidden sm:block text-neutral-800">·</span>
          <span>Available for freelance projects</span>
          <span className="hidden sm:block text-neutral-800">·</span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Open to work
          </span>
        </motion.div>
      </div>
    </section>
  );
}
