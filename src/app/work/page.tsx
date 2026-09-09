import type { Metadata } from "next";
import { Suspense } from "react";
import { connectToDatabase } from "@/lib/mongodb";
import { Project, Category } from "@/models";
import { WorkGrid } from "@/components/portfolio/WorkGrid";
import { PageTransition } from "@/components/animation";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Explore the portfolio — video editing, motion graphics, graphic design, and branding projects for clients worldwide.",
};

export const dynamic = "force-dynamic";

async function getWorkData() {
  try {
    await connectToDatabase();

    const [projectsData, categoriesData] = await Promise.all([
      Project.find({ status: "published" }).sort({ order: 1, createdAt: -1 }).lean(),
      Category.find({}).sort({ order: 1 }).lean(),
    ]);

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
        categoryId: p.categoryId || null,
        categoryName: cat?.name || null,
        categorySlug: cat?.slug || null,
      };
    });

    const formattedCategories = categoriesData.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description || null,
      order: c.order || 0,
      createdAt: c.createdAt || new Date(),
    }));

    return {
      allProjects: formattedProjects,
      allCategories: formattedCategories,
    };
  } catch {
    return { allProjects: [], allCategories: [] };
  }
}

export default async function WorkPage() {
  const { allProjects, allCategories } = await getWorkData();

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0a0a0a] pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          {/* Page header */}
          <div className="mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 mb-4">
              <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
              <span className="text-yellow-400/90 text-xs tracking-[0.25em] uppercase font-semibold font-mono">
                PORTFOLIO
              </span>
            </div>
            <h1 className="text-5xl md:text-8xl font-black tracking-tight text-white">
              My Work
              <span className="block text-2xl md:text-4xl font-normal text-neutral-400 mt-3 font-sans">
                Selected Videos &amp; Projects
              </span>
            </h1>
            <p className="text-neutral-500 text-sm md:text-base leading-relaxed mt-6 max-w-lg">
              A curated selection of projects spanning video editing, motion graphics,
              graphic design, and brand identity work.
            </p>
          </div>

          {/* Work Grid with filters */}
          <Suspense fallback={null}>
            <WorkGrid projects={allProjects} categories={allCategories} />
          </Suspense>
        </div>
      </div>
    </PageTransition>
  );
}
