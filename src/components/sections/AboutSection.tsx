"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SlideUp, Reveal, FadeIn, StaggerContainer, StaggerItem } from "@/components/animation";
import { getLenis } from "@/components/providers/LenisProvider";
import {
  fallbackStats,
  fallbackSkills,
  fallbackExperience,
  fallbackAboutTitle,
  fallbackBio1,
  fallbackBio2,
} from "@/lib/fallbackData";

gsap.registerPlugin(ScrollTrigger);

interface AboutSectionProps {
  stats?: Array<{ value: string; label: string }>;
  skills?: Array<{ category: string; items: string[] }>;
  timeline?: Array<{ year: string; title: string; desc: string }>;
  aboutTitle?: string;
  bio1?: string;
  bio2?: string;
}

export function AboutSection({
  stats = fallbackStats,
  skills = fallbackSkills,
  timeline = fallbackExperience,
  aboutTitle = fallbackAboutTitle,
  bio1 = fallbackBio1,
  bio2 = fallbackBio2,
}: AboutSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Animate stats counter area with parallax
      if (statsRef.current) {
        gsap.fromTo(
          statsRef.current,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: statsRef.current,
              start: "top 85%",
              end: "top 50%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Animate timeline items sequentially
      if (timelineRef.current) {
        const items = timelineRef.current.querySelectorAll(".timeline-item");
        items.forEach((item, i) => {
          gsap.fromTo(
            item,
            { x: -40, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: 0.8,
              delay: i * 0.1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: item,
                start: "top 85%",
                toggleActions: "play none none reverse",
              },
            }
          );
        });

        // Animate the timeline line drawing
        const line = timelineRef.current.querySelector(".timeline-line");
        if (line) {
          gsap.fromTo(
            line,
            { scaleY: 0 },
            {
              scaleY: 1,
              duration: 1.5,
              ease: "power2.out",
              transformOrigin: "top center",
              scrollTrigger: {
                trigger: timelineRef.current,
                start: "top 80%",
                end: "bottom 60%",
                scrub: 1,
              },
            }
          );
        }
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const scrollToContact = () => {
    const lenis = getLenis();
    const target = document.getElementById("contact");
    if (lenis && target) {
      lenis.scrollTo(target, { duration: 1.5 });
    }
  };

  const scrollToWork = () => {
    const lenis = getLenis();
    const target = document.getElementById("work");
    if (lenis && target) {
      lenis.scrollTo(target, { duration: 1.5 });
    }
  };

  return (
    <section id="about" data-section="about" ref={sectionRef} className="relative bg-[#0a0a0a]">
      {/* Hero area */}
      <div className="py-24 md:py-32 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <FadeIn>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 mb-3">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                <span className="text-blue-400/90 text-xs tracking-[0.25em] uppercase font-semibold font-mono">
                  BIOGRAPHY
                </span>
              </div>
            </FadeIn>
            <SlideUp delay={0.1}>
              <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white mt-1 leading-[0.95]">
                About Me
                <span className="block text-xl md:text-3xl font-normal text-neutral-400 mt-3 font-sans">
                  {aboutTitle}
                </span>
              </h1>
            </SlideUp>
            <SlideUp delay={0.2}>
              <p className="text-neutral-400 text-base leading-relaxed mt-6 max-w-lg">
                {bio1}
              </p>
            </SlideUp>
            <SlideUp delay={0.3}>
              <p className="text-neutral-500 text-sm leading-relaxed mt-4 max-w-lg">
                {bio2}
              </p>
            </SlideUp>
            <SlideUp delay={0.4}>
              <div className="flex items-center gap-4 mt-8">
                <button
                  onClick={scrollToContact}
                  className="inline-flex items-center gap-2 bg-white text-black font-bold text-sm px-6 py-3.5 rounded-full hover:bg-neutral-100 transition-all duration-200 hover:scale-105"
                >
                  Work Together
                  <ArrowUpRight size={16} />
                </button>
                <button
                  onClick={scrollToWork}
                  className="text-neutral-400 hover:text-white text-sm font-medium transition-colors duration-200"
                >
                  See my work →
                </button>
              </div>
            </SlideUp>
          </div>

          {/* Profile image placeholder */}
          <FadeIn delay={0.3}>
            <div className="relative">
              <div className="aspect-3/4 rounded-2xl overflow-hidden bg-neutral-900 relative">
                <div className="absolute inset-0 bg-linear-to-br from-neutral-800 to-neutral-950 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-8xl mb-4">✦</div>
                    <p className="text-neutral-600 text-sm">Profile Image</p>
                  </div>
                </div>
              </div>
              {/* Availability badge */}
              <div className="absolute -bottom-4 -right-4 bg-neutral-900 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                  <div>
                    <p className="text-white text-xs font-bold">Available for Work</p>
                    <p className="text-neutral-500 text-xs">Freelance &amp; Collab</p>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Stats */}
      <div ref={statsRef} className="bg-neutral-950 border-y border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-4xl md:text-5xl font-black text-white tracking-tight">{value}</div>
                <div className="text-neutral-600 text-xs tracking-wide mt-2">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="py-24 max-w-7xl mx-auto px-6">
        <Reveal>
          <span className="text-neutral-600 text-xs tracking-[0.3em] uppercase font-medium">
            Expertise
          </span>
        </Reveal>
        <SlideUp delay={0.1}>
          <h2 className="text-4xl font-black tracking-tight text-white mt-3 mb-12">
            Tools &amp; Skills
          </h2>
        </SlideUp>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {skills.map((skillGroup) => (
            <StaggerItem key={skillGroup.category}>
              <div className="bg-neutral-900 rounded-xl p-6 border border-white/5 h-full hover:border-white/10 transition-colors duration-300">
                <h3 className="text-white font-bold text-sm tracking-widest uppercase mb-4">
                  {skillGroup.category}
                </h3>
                <ul className="space-y-2">
                  {skillGroup.items.map((skill) => (
                    <li key={skill} className="flex items-center gap-2 text-neutral-400 text-sm">
                      <span className="w-1 h-1 rounded-full bg-neutral-600" />
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>

      {/* Timeline */}
      <div ref={timelineRef} className="py-12 pb-24 max-w-7xl mx-auto px-6">
        <Reveal>
          <span className="text-neutral-600 text-xs tracking-[0.3em] uppercase font-medium">
            Journey
          </span>
        </Reveal>
        <SlideUp delay={0.1}>
          <h2 className="text-4xl font-black tracking-tight text-white mt-3 mb-12">
            Experience
          </h2>
        </SlideUp>

        <div className="relative">
          {/* Timeline line */}
          <div className="timeline-line absolute left-22 top-0 bottom-0 w-px bg-white/10 hidden md:block" />

          <div className="space-y-8">
            {timeline.map((item) => (
              <div key={`${item.year}-${item.title}`} className="timeline-item flex flex-col md:flex-row gap-6 md:gap-12">
                <div className="w-20 shrink-0">
                  <span className="text-neutral-600 text-sm font-mono">{item.year}</span>
                </div>
                <div className="flex-1 pb-8 border-b border-white/5 last:border-0">
                  <h3 className="text-white font-bold text-lg tracking-tight mb-2">{item.title}</h3>
                  <p className="text-neutral-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
