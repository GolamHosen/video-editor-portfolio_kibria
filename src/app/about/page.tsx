import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageTransition, SlideUp, Reveal, FadeIn, StaggerContainer, StaggerItem } from "@/components/animation";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about the creative vision, process, and experience behind VisualCraft — a Video Editor, Motion Designer, and Visual Artist.",
};

const skills = [
  { category: "Video Editing", items: ["Premiere Pro", "DaVinci Resolve", "Final Cut Pro", "Color Grading", "Sound Design"] },
  { category: "Motion Graphics", items: ["After Effects", "Cinema 4D", "Lottie", "Motion Bro", "Cavalry"] },
  { category: "Design", items: ["Photoshop", "Illustrator", "Figma", "InDesign", "Procreate"] },
  { category: "Production", items: ["Direction", "Storyboarding", "Cinematography", "Location Scouting", "Script Writing"] },
];

const timeline = [
  { year: "2024", title: "International Campaigns", desc: "Delivered video and motion projects for clients across 12 countries." },
  { year: "2023", title: "Studio Partnership", desc: "Established ongoing partnerships with major creative agencies in London and NYC." },
  { year: "2022", title: "Award Recognition", desc: "Recognized for excellence in visual storytelling at regional creative awards." },
  { year: "2020", title: "Freelance Launch", desc: "Launched as an independent creative, focusing on cinematic brand storytelling." },
  { year: "2016", title: "Creative Journey Begins", desc: "Started as a motion designer at a boutique production studio." },
];

export default function AboutPage() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0a0a0a]">
        {/* Hero */}
        <div className="pt-32 pb-24 max-w-7xl mx-auto px-6">
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
                    Crafting Stories Through Motion
                  </span>
                </h1>
              </SlideUp>
              <SlideUp delay={0.2}>
                <p className="text-neutral-400 text-base leading-relaxed mt-6 max-w-lg">
                  I&apos;m a creative visual artist with 8+ years of experience crafting compelling
                  stories through video, motion graphics, and design. I work at the intersection
                  of art and strategy — creating content that moves people and drives results.
                </p>
              </SlideUp>
              <SlideUp delay={0.3}>
                <p className="text-neutral-500 text-sm leading-relaxed mt-4 max-w-lg">
                  Based globally, working internationally. I partner with brands, agencies, and
                  independent creators to develop visual content that stands out in an increasingly
                  crowded world.
                </p>
              </SlideUp>
              <SlideUp delay={0.4}>
                <div className="flex items-center gap-4 mt-8">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 bg-white text-black font-bold text-sm px-6 py-3.5 rounded-full hover:bg-neutral-100 transition-all duration-200 hover:scale-105"
                    data-cursor="link"
                  >
                    Work Together
                    <ArrowUpRight size={16} />
                  </Link>
                  <Link
                    href="/work"
                    className="text-neutral-400 hover:text-white text-sm font-medium transition-colors duration-200"
                    data-cursor="link"
                  >
                    See my work →
                  </Link>
                </div>
              </SlideUp>
            </div>

            {/* Profile image placeholder */}
            <FadeIn delay={0.3}>
              <div className="relative">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-900 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-950 flex items-center justify-center">
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
                      <p className="text-neutral-500 text-xs">Freelance & Collab</p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-neutral-950 border-y border-white/5 py-12">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: "8+", label: "Years of Experience" },
                { value: "120+", label: "Projects Completed" },
                { value: "50+", label: "Happy Clients" },
                { value: "12", label: "Countries Served" },
              ].map(({ value, label }) => (
                <SlideUp key={label}>
                  <div className="text-center">
                    <div className="text-4xl md:text-5xl font-black text-white tracking-tight">{value}</div>
                    <div className="text-neutral-600 text-xs tracking-wide mt-2">{label}</div>
                  </div>
                </SlideUp>
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
              Tools & Skills
            </h2>
          </SlideUp>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {skills.map((skillGroup) => (
              <StaggerItem key={skillGroup.category}>
                <div className="bg-neutral-900 rounded-xl p-6 border border-white/5 h-full">
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
        <div className="py-12 pb-24 max-w-7xl mx-auto px-6">
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
            <div className="absolute left-[5.5rem] top-0 bottom-0 w-px bg-white/5 hidden md:block" />

            <div className="space-y-8">
              {timeline.map((item, index) => (
                <SlideUp key={item.year} delay={index * 0.1}>
                  <div className="flex flex-col md:flex-row gap-6 md:gap-12">
                    <div className="w-20 flex-shrink-0">
                      <span className="text-neutral-600 text-sm font-mono">{item.year}</span>
                    </div>
                    <div className="flex-1 pb-8 border-b border-white/5 last:border-0">
                      <h3 className="text-white font-bold text-lg tracking-tight mb-2">{item.title}</h3>
                      <p className="text-neutral-500 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </SlideUp>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
