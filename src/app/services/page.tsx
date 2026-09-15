import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { connectToDatabase } from "@/lib/mongodb";
import { Service } from "@/models";
import { PageTransition, SlideUp, Reveal, StaggerContainer, StaggerItem, FadeIn } from "@/components/animation";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Professional video editing, motion graphics, graphic design, and branding services. Premium creative solutions for brands worldwide.",
};

// ISR: re-render every 60s so the services page stays fast.
export const revalidate = 60;

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

export default async function ServicesPage() {
  let allServices: any[] = [];
  try {
    await connectToDatabase();
    const servicesData = await Service.find({}).sort({ order: 1 }).lean();
    if (servicesData.length > 0) {
      allServices = servicesData.map((s) => ({
        id: s.id,
        title: s.title,
        description: s.description || "",
        icon: s.icon || "",
        features: s.features || [],
      }));
    }
  } catch {
    // Database offline — show empty services
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0a0a0a]">
        {/* Hero */}
        <div className="pt-32 pb-16 max-w-7xl mx-auto px-6">
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
        <div className="py-8 pb-24 max-w-7xl mx-auto px-6">
          <StaggerContainer className="space-y-1">
            {allServices.map((service, index) => (
              <StaggerItem key={service.id}>
                <div className="group border-b border-white/5 py-8 grid grid-cols-1 md:grid-cols-12 gap-6 hover:bg-neutral-900/30 transition-colors duration-300 -mx-6 px-6 rounded-xl">
                  <div className="md:col-span-1 text-neutral-700 text-sm font-mono pt-1">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div className="md:col-span-3">
                    <div className="text-2xl mb-2">{iconMap[service.icon || ""] || "✦"}</div>
                    <h2 className="text-white font-black text-2xl tracking-tight group-hover:text-neutral-100 transition-colors">
                      {service.title}
                    </h2>
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
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>

        {/* Process */}
        <div className="py-24 bg-neutral-950 border-y border-white/5">
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
                <FadeIn key={step.step} delay={index * 0.1}>
                  <div className="relative">
                    <div className="text-neutral-800 text-4xl font-black font-mono mb-4">
                      {step.step}
                    </div>
                    <h3 className="text-white font-bold text-lg mb-3">{step.title}</h3>
                    <p className="text-neutral-600 text-sm leading-relaxed">{step.description}</p>
                    {index < processSteps.length - 1 && (
                      <div className="hidden md:block absolute top-6 -right-4 w-8 h-px bg-white/10" />
                    )}
                  </div>
                </FadeIn>
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
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-white text-black font-bold text-sm px-8 py-5 rounded-full hover:bg-neutral-100 transition-all duration-200 hover:scale-105"
              data-cursor="explore"
            >
              Start a Project
              <ArrowUpRight size={18} />
            </Link>
          </SlideUp>
        </div>
      </div>
    </PageTransition>
  );
}
