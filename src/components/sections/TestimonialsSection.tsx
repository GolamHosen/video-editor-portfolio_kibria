"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { SlideUp, Reveal, FadeIn } from "@/components/animation";
import type { Testimonial } from "@/types";
import { fallbackTestimonials } from "@/lib/fallbackData";

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const [current, setCurrent] = useState(0);

  const displayTestimonials =
    testimonials && testimonials.length > 0 ? testimonials : fallbackTestimonials;

  const prev = () =>
    setCurrent((c) => (c - 1 + displayTestimonials.length) % displayTestimonials.length);
  const next = () =>
    setCurrent((c) => (c + 1) % displayTestimonials.length);

  const testimonial = displayTestimonials[current];

  return (
    <section className="py-24 md:py-32 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <FadeIn>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 mb-3">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                <span className="text-purple-400/90 text-xs tracking-[0.25em] uppercase font-semibold font-mono">
                  CLIENT REVIEWS
                </span>
              </div>
            </FadeIn>
            <SlideUp delay={0.1}>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mt-1">
                Testimonials
                <span className="block text-lg md:text-xl font-normal text-neutral-400 mt-2">
                  What Clients Say
                </span>
              </h1>
            </SlideUp>
            <SlideUp delay={0.2}>
              <p className="text-neutral-500 text-sm leading-relaxed mt-4 max-w-sm">
                Building long-term partnerships through exceptional creative work and reliable delivery.
              </p>
            </SlideUp>

            {/* Navigation */}
            <div className="flex items-center gap-4 mt-10">
              <button
                onClick={prev}
                className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white hover:border-white/30 transition-all duration-200"
                aria-label="Previous testimonial"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={next}
                className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white hover:border-white/30 transition-all duration-200"
                aria-label="Next testimonial"
              >
                <ChevronRight size={18} />
              </button>
              <span className="text-neutral-700 text-sm font-mono ml-2">
                {String(current + 1).padStart(2, "0")} / {String(displayTestimonials.length).padStart(2, "0")}
              </span>
            </div>
          </div>

          {/* Right - Testimonial card */}
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="bg-neutral-900 rounded-2xl p-8 border border-white/5"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: testimonial.rating || 5 }).map((_, i) => (
                    <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-white text-lg leading-relaxed font-medium mb-8">
                  &ldquo;{testimonial.message}&rdquo;
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center text-white font-bold text-sm">
                    {testimonial.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{testimonial.name}</p>
                    <p className="text-neutral-500 text-xs">
                      {testimonial.role}{testimonial.company ? ` · ${testimonial.company}` : ""}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Dots */}
            <div className="flex gap-2 mt-4 justify-center">
              {displayTestimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    i === current ? "bg-white w-6" : "bg-neutral-700 hover:bg-neutral-500"
                  }`}
                  aria-label={`Testimonial ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
