import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Project, Category } from "@/models";
import { getCached, setCache, CACHE_KEYS, CACHE_TTL } from "@/lib/redis";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const limit = parseInt(searchParams.get("limit") || "50");

    const cacheKey = featured
      ? CACHE_KEYS.FEATURED_PROJECTS
      : category
      ? `portfolio:projects:${category}`
      : CACHE_KEYS.ALL_PROJECTS;

    const cached = await getCached(cacheKey);
    if (cached) {
      return NextResponse.json({ data: cached, cached: true });
    }

    await connectToDatabase();

    const filter: Record<string, unknown> = { status: "published" };
    if (featured === "true") filter.featured = true;

    const categoriesData = await Category.find({}).lean();
    const catMap = new Map(categoriesData.map((c) => [c.id, c]));

    if (category && category !== "all") {
      const catObj = categoriesData.find((c) => c.slug === category);
      if (catObj) filter.categoryId = catObj.id;
    }

    const projectsData = await Project.find(filter)
      .sort({ order: 1, createdAt: -1 })
      .limit(limit)
      .lean();

    const data = projectsData.map((p) => {
      const cat = p.categoryId ? catMap.get(p.categoryId) : null;
      return {
        id: p.id,
        title: p.title,
        slug: p.slug,
        shortDescription: p.shortDescription || null,
        client: p.client || null,
        year: p.year || null,
        featured: p.featured || false,
        thumbnailUrl: p.thumbnailUrl || null,
        videoPosterUrl: p.videoPosterUrl || null,
        videoUrl: p.videoUrl || null,
        tags: p.tags || [],
        order: p.order || 0,
        createdAt: p.createdAt,
        categoryId: p.categoryId || null,
        categoryName: cat?.name || null,
        categorySlug: cat?.slug || null,
      };
    });

    await setCache(cacheKey, data, CACHE_TTL.MEDIUM);

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Projects API error:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}
