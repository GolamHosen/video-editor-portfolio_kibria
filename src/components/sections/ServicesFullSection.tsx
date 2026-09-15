"use client";

import { useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SlideUp, Reveal, FadeIn } from "@/components/animation";
import { getLenis } from "@/components/providers/LenisProvider";
import type { Service } from "@/types";

gsap.registerPlugin(ScrollTrigger);

interface ServicesFullSectionProps {
  services: Service[];
}

const iconMap: Record<string, string> = {
  film: "🎬",
  zap: "⚡",
  "pen-tool": "✏️",
  layers: "🎨",
  "share-2": "📱",
};

const processSteps = [
  {
    step: "01",
    title: "Discovery",
    description:
      "We start with a deep dive into your brand, goals, and audience. Understanding your vision allows me to craft content that truly resonates.",
  },
  {
    step: "02",
    title: "Concept & Strategy",
    description:
      "I develop creative concepts and a production strategy that aligns with your objectives. Clear planning ensures smooth execution.",
  },
  {
    step: "03",
    title: "Production",
    description:
      "With everything planned, I move into production — editing, animating, and designing with precision and attention to detail.",
  },
  {
    step: "04",
    title: "Refinement",
    description:
      "You receive drafts for review. I incorporate feedback with care, ensuring the final product exceeds your expectations.",
  },
  {
    step: "05",
    title: "Delivery",
    description:
      "Final files are delivered in all required formats, optimized for their intended platforms, ready to launch.",
  },
];

export function ServicesFullSection({ services }: ServicesFullSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const servicesListRef = useRef<HTMLDivElement>(null);
  const processRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Stagger service items
      if (servicesListRef.current) {
        const items = servicesListRef.current.querySelectorAll(".service-item");
        items.forEach((item, i) => {
          gsap.fromTo(
            item,
            { y: 40, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              delay: i * 0.08,
              ease: "power3.out",
              scrollTrigger: {
                trigger: item,
                start: "top 88%",
                toggleActions: "play none none reverse",
              },
            }
          );
        });
      }

      // Process steps animation with connecting line
      if (processRef.current) {
        const steps = processRef.current.querySelectorAll(".process-step");
        steps.forEach((step, i) => {
          gsap.fromTo(
            step,
            { y: 30, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.7,
              ease: "power3.out",
              scrollTrigger: {
                trigger: step,
                start: "top 85%",
                toggleActions: "play none none reverse",
              },
            }
          );
        });

        // Connecting line draw
        const connectors = processRef.current.querySelectorAll(".process-connector");
        connectors.forEach((connector) => {
          gsap.fromTo(
            connector,
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 0.6,
              ease: "power2.out",
              transformOrigin: "left center",
              scrollTrigger: {
                trigger: connector,
                start: "top 80%",
                toggleActions: "play none none reverse",
              },
            }
          );
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [services]);

  const scrollToContact = () => {
    const lenis = getLenis();
    const target = document.getElementById("contact");
    if (lenis && target) {
      lenis.scrollTo(target, { duration: 1.5 });
    }
  };

  return (
    <section id="services" data-section="services" ref={sectionRef} className="relative bg-[#0a0a0a]">
      {/* Header */}
      <div className="pt-24 md:pt-32 pb-16 max-w-7xl mx-auto px-6">
        <FadeIn>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400/90 text-xs tracking-[0.25em] uppercase font-semibold font-mono">
              WHAT I OFFER
            </span>
          </div>
        </FadeIn>
        <SlideUp delay={0.1}>
          <h1 className="text-5xl md:text-8xl font-black tracking-tight text-white mt-1 leading-[0.95]">
            My Services
            <span className="block text-2xl md:text-4xl font-normal text-neutral-400 mt-3 font-sans">
              What I Create &amp; Produce
            </span>
          </h1>
        </SlideUp>
        <SlideUp delay={0.2}>
          <p className="text-neutral-500 text-base leading-relaxed mt-6 max-w-xl">
            Tailored creative services designed to elevate your brand and tell your story
            with impact. Every project is approached with strategy and craft.
          </p>
        </SlideUp>
      </div>

      {/* Services list */}
      <div ref={servicesListRef} className="py-8 pb-24 max-w-7xl mx-auto px-6">
        <div className="space-y-1">
          {services.map((service, index) => (
            <div
              key={service.id}
              className="service-item group border-b border-white/5 py-8 grid grid-cols-1 md:grid-cols-12 gap-6 hover:bg-neutral-900/30 transition-colors duration-300 -mx-6 px-6 rounded-xl"
            >
              <div className="md:col-span-1 text-neutral-700 text-sm font-mono pt-1">
                {String(index + 1).padStart(2, "0")}
              </div>
              <div className="md:col-span-3">
                <div className="text-2xl mb-2">{iconMap[service.icon || ""] || "✦"}</div>
                <h3 className="text-white font-black text-2xl tracking-tight group-hover:text-neutral-100 transition-colors">
                  {service.title}
                </h3>
              </div>
              <div className="md:col-span-5">
                <p className="text-neutral-500 text-sm leading-relaxed">{service.description}</p>
              </div>
              <div className="md:col-span-3">
                {service.features && service.features.length > 0 && (
                  <ul className="space-y-1.5">
                    {service.features.map((feature: string) => (
                      <li
                        key={feature}
                        className="flex items-center gap-2 text-neutral-600 text-xs"
                      >
                        <span className="w-1 h-1 rounded-full bg-neutral-600 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Process */}
      <div ref={processRef} className="py-24 bg-neutral-950 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <span className="text-neutral-600 text-xs tracking-[0.3em] uppercase font-medium">
              How I Work
            </span>
          </Reveal>
          <SlideUp delay={0.1}>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mt-3 mb-16">
              My Process
            </h2>
          </SlideUp>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {processSteps.map((step, index) => (
              <div key={step.step} className="process-step relative">
                <div className="text-neutral-800 text-4xl font-black font-mono mb-4">
                  {step.step}
                </div>
                <h3 className="text-white font-bold text-lg mb-3">{step.title}</h3>
                <p className="text-neutral-600 text-sm leading-relaxed">{step.description}</p>
                {index < processSteps.length - 1 && (
                  <div className="process-connector hidden md:block absolute top-6 -right-4 w-8 h-px bg-white/10" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-24 max-w-7xl mx-auto px-6 text-center">
        <SlideUp>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-6">
            Ready to get started?
          </h2>
        </SlideUp>
        <SlideUp delay={0.1}>
          <p className="text-neutral-500 text-base mb-8 max-w-md mx-auto">
            Tell me about your project and let&apos;s discuss how I can help.
          </p>
        </SlideUp>
        <SlideUp delay={0.2}>
          <button
            onClick={scrollToContact}
            className="inline-flex items-center gap-2 bg-white text-black font-bold text-sm px-8 py-5 rounded-full hover:bg-neutral-100 transition-all duration-200 hover:scale-105"
          >
            Start a Project
            <ArrowUpRight size={18} />
          </button>
        </SlideUp>
      </div>
    </section>
  );
}
