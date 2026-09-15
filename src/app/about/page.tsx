import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageTransition, SlideUp, Reveal, FadeIn, StaggerContainer, StaggerItem } from "@/components/animation";
import { connectToDatabase } from "@/lib/mongodb";
import { Stat, Skill, Experience, SiteSetting } from "@/models";
import {
  fallbackStats,
  fallbackSkills,
  fallbackExperience,
  fallbackAboutTitle,
  fallbackBio1,
  fallbackBio2,
} from "@/lib/fallbackData";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about the creative vision, process, and experience behind VisualCraft — a Video Editor, Motion Designer, and Visual Artist.",
};

// ISR: re-render every 60s so the about page stays fast.
export const revalidate = 60;

export default async function AboutPage() {
  let stats = fallbackStats;
  let skills = fallbackSkills;
  let timeline = fallbackExperience;
  let aboutTitle = fallbackAboutTitle;
  let bio1 = fallbackBio1;
  let bio2 = fallbackBio2;

  try {
    await connectToDatabase();
    const [statsData, skillsData, experienceData, settingsData] = await Promise.all([
      Stat.find({}).sort({ order: 1 }).lean(),
      Skill.find({}).sort({ order: 1 }).lean(),
      Experience.find({}).sort({ order: 1 }).lean(),
      SiteSetting.find({ key: { $in: ["about_title", "about_bio", "about_bio_2"] } }).lean(),
    ]);

    if (statsData.length > 0) {
      stats = statsData.map((s) => ({ value: s.value, label: s.label }));
    }
    if (skillsData.length > 0) {
      skills = skillsData.map((s) => ({ category: s.category, items: s.items || [] }));
    }
    if (experienceData.length > 0) {
      timeline = experienceData.map((e) => ({
        year: e.year,
        title: e.title,
        desc: e.description || "",
      }));
    }

    const settingsMap = new Map(settingsData.map((s) => [s.key, s.value || ""]));
    aboutTitle = settingsMap.get("about_title") || aboutTitle;
    bio1 = settingsMap.get("about_bio") || bio1;
    bio2 = settingsMap.get("about_bio_2") || bio2;
  } catch {
    // Database offline — fall back to hardcoded defaults
  }

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
              {stats.map(({ value, label }) => (
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
                <SlideUp key={`${item.year}-${item.title}`} delay={index * 0.1}>
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
