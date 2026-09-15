import type { Metadata } from "next";
import { Suspense } from "react";
import { HeroSection } from "@/components/hero/HeroSection";
import { WorkSection } from "@/components/sections/WorkSection";
import { PhotoSection } from "@/components/sections/PhotoSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { ServicesFullSection } from "@/components/sections/ServicesFullSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { SectionNav } from "@/components/layout/SectionNav";
import { connectToDatabase } from "@/lib/mongodb";
import { Project, Category, Service, Testimonial, Stat, SiteSetting } from "@/models";

export const metadata: Metadata = {
  title: "VisualCraft — Video Editor & Motion Designer",
  description:
    "Premium creative portfolio of a Video Editor, Motion Graphics Designer, and Visual Artist. Cinematic storytelling through creative visuals.",
};

// ISR: re-render every 60s so the public homepage stays fast without touching MongoDB on every hit.
export const revalidate = 60;

import {
  fallbackServices,
  fallbackTestimonials,
  fallbackStats,
  fallbackSkills,
  fallbackExperience,
  fallbackAboutTitle,
  fallbackBio1,
  fallbackBio2,
} from "@/lib/fallbackData";

async function getHomepageData() {
  try {
    await connectToDatabase();

    const [projectsData, categoriesData, servicesData, testimonialsData, statsData, settingsData] =
      await Promise.all([
        Project.find({ status: "published" }).sort({ featured: -1, order: 1, createdAt: -1 }).limit(24).lean(),
        Category.find({}).lean(),
        Service.find({}).sort({ order: 1 }).lean(),
        Testimonial.find({ featured: true }).sort({ order: 1 }).limit(6).lean(),
        Stat.find({}).sort({ order: 1 }).lean(),
        SiteSetting.find({ key: { $in: ["about_title", "about_bio", "about_bio_2"] } }).lean(),
      ]);

    const settingsMap = new Map(settingsData.map((s) => [s.key, s.value || ""]));

    const about = {
      stats: statsData.length
        ? statsData.map((s) => ({ value: s.value, label: s.label }))
        : fallbackStats,
      skills: fallbackSkills,
      timeline: fallbackExperience,
      aboutTitle: settingsMap.get("about_title") || fallbackAboutTitle,
      bio1: settingsMap.get("about_bio") || fallbackBio1,
      bio2: settingsMap.get("about_bio_2") || fallbackBio2,
    };

    const catMap = new Map(categoriesData.map((c) => [c.id, c]));

    const formattedProjects = projectsData.map((p) => {
      const cat = p.categoryId ? catMap.get(p.categoryId) : null;
      return {
        id: p.id,
        title: p.title,
        slug: p.slug,
        shortDescription: p.shortDescription || null,
        client: p.client || null,
        year: p.year || null,
        thumbnailUrl: p.thumbnailUrl || null,
        videoPosterUrl: p.videoPosterUrl || null,
        videoUrl: p.videoUrl || null,
        tags: p.tags || [],
        featured: p.featured || false,
        order: p.order || 0,
        categoryName: cat?.name || null,
        categorySlug: cat?.slug || null,
      };
    });

    // Category-wise separation
    const isVideo = (p: typeof formattedProjects[0]) => {
      const slug = (p.categorySlug || "").toLowerCase().trim();
      const name = (p.categoryName || "").toLowerCase().trim();
      if (slug === "video" || name === "video" || name === "videos") return true;
      if (slug === "photo" || name === "photo" || name === "photos" || name === "photography") return false;
      return Boolean(p.videoUrl);
    };

    const isPhoto = (p: typeof formattedProjects[0]) => {
      const slug = (p.categorySlug || "").toLowerCase().trim();
      const name = (p.categoryName || "").toLowerCase().trim();
      if (slug === "photo" || name === "photo" || name === "photos" || name === "photography") return true;
      if (slug === "video" || name === "video" || name === "videos") return false;
      return Boolean(p.thumbnailUrl) && !p.videoUrl;
    };

    const videoProjects = formattedProjects.filter(isVideo);
    const photoProjects = formattedProjects.filter(isPhoto);

    return {
      videoProjects,
      photoProjects,
      allServices:
        servicesData.length > 0
          ? servicesData.map((s) => ({
              id: s.id,
              title: s.title,
              description: s.description || null,
              icon: s.icon || null,
              features: s.features || [],
              order: s.order || 0,
              createdAt: s.createdAt,
            }))
          : fallbackServices,
      allTestimonials:
        testimonialsData.length > 0
          ? testimonialsData.map((t) => ({
              id: t.id,
              name: t.name,
              company: t.company || null,
              role: t.role || null,
              message: t.message,
              imageUrl: t.imageUrl || null,
              imagePublicId: t.imagePublicId || null,
              rating: t.rating || 5,
              featured: t.featured || false,
              order: t.order || 0,
              createdAt: t.createdAt,
            }))
          : fallbackTestimonials,
      about,
    };
  } catch {
    // Database offline — return empty projects
    return {
      videoProjects: [],
      photoProjects: [],
      allServices: fallbackServices,
      allTestimonials: fallbackTestimonials,
      about: {
        stats: fallbackStats,
        skills: fallbackSkills,
        timeline: fallbackExperience,
        aboutTitle: fallbackAboutTitle,
        bio1: fallbackBio1,
        bio2: fallbackBio2,
      },
    };
  }
}

export default async function HomePage() {
  const { videoProjects, photoProjects, allServices, allTestimonials, about } =
    await getHomepageData();

  return (
    <>
      <HeroSection />

      {/* Video Category Section */}
      <Suspense fallback={null}>
        <WorkSection projects={videoProjects} />
      </Suspense>

      {/* Photo Category Section */}
      <Suspense fallback={null}>
        <PhotoSection projects={photoProjects} />
      </Suspense>

      <AboutSection
        stats={about.stats}
        skills={about.skills}
        timeline={about.timeline}
        aboutTitle={about.aboutTitle}
        bio1={about.bio1}
        bio2={about.bio2}
      />

      <ServicesFullSection services={allServices} />

      <div id="testimonials" data-section="testimonials">
        <TestimonialsSection testimonials={allTestimonials} />
      </div>

      <ContactSection />

      <SectionNav />
    </>
  );
}
