"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SlideUp, StaggerContainer, StaggerItem, Reveal } from "@/components/animation";
import type { Service } from "@/types";

interface ServicesSectionProps {
  services: Service[];
}

const iconMap: Record<string, string> = {
  film: "🎬",
  zap: "⚡",
  "pen-tool": "✏️",
  layers: "🎨",
  "share-2": "📱",
};

export function ServicesSection({ services }: ServicesSectionProps) {
  return (
    <section className="py-24 md:py-32 bg-neutral-950">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 mb-16">
          <div>
            <Reveal>
              <span className="text-neutral-600 text-xs tracking-[0.3em] uppercase font-medium">
                What I Do
              </span>
            </Reveal>
            <SlideUp delay={0.1}>
              <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white mt-3">
                Services
              </h2>
            </SlideUp>
          </div>
          <SlideUp delay={0.2}>
            <Link
              href="/services"
              className="group inline-flex items-center gap-2 text-neutral-400 hover:text-white text-sm font-medium transition-colors duration-200"
              data-cursor="link"
            >
              All services
              <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
            </Link>
          </SlideUp>
        </div>

        {/* Services grid */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5 rounded-2xl overflow-hidden">
          {services.map((service, index) => (
            <StaggerItem key={service.id}>
              <div
                className="group relative bg-neutral-950 p-8 hover:bg-neutral-900 transition-colors duration-300"
              >
                {/* Number */}
                <div className="absolute top-6 right-6 text-neutral-800 text-xs font-bold font-mono">
                  {String(index + 1).padStart(2, "0")}
                </div>

                {/* Icon */}
                <div className="text-3xl mb-6">
                  {iconMap[service.icon || ""] || "✦"}
                </div>

                <h3 className="text-white font-bold text-xl mb-3 tracking-tight">
                  {service.title}
                </h3>
                <p className="text-neutral-500 text-sm leading-relaxed mb-6 line-clamp-3">
                  {service.description}
                </p>

                {/* Features */}
                {service.features && service.features.length > 0 && (
                  <ul className="space-y-1.5">
                    {service.features.slice(0, 3).map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-neutral-600 text-xs">
                        <span className="w-1 h-1 rounded-full bg-neutral-600 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                )}

                {/* Hover indicator */}
                <div className="absolute bottom-0 left-0 w-full h-px bg-white/0 group-hover:bg-white/10 transition-colors duration-300" />
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
