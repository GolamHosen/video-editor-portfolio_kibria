import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Project, Category, Media } from "@/models";
import { getCached, setCache, CACHE_KEYS, CACHE_TTL } from "@/lib/redis";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const cacheKey = CACHE_KEYS.PROJECT(slug);

    const cached = await getCached(cacheKey);
    if (cached) {
      return NextResponse.json({ data: cached, cached: true });
    }

    await connectToDatabase();
    const proj = await Project.findOne({ slug, status: "published" }).lean();

    if (!proj) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    let categoryName: string | null = null;
    let categorySlug: string | null = null;

    if (proj.categoryId) {
      const cat = await Category.findOne({ id: proj.categoryId }).lean();
      if (cat) {
        categoryName = cat.name;
        categorySlug = cat.slug;
      }
    }

    const projectMedia = await Media.find({ projectId: proj.id }).sort({ order: 1 }).lean();

    const fullProject = {
      id: proj.id,
      title: proj.title,
      slug: proj.slug,
      description: proj.description || null,
      shortDescription: proj.shortDescription || null,
      client: proj.client || null,
      year: proj.year || null,
      role: proj.role || null,
      tools: proj.tools || [],
      featured: proj.featured || false,
      thumbnailUrl: proj.thumbnailUrl || null,
      videoUrl: proj.videoUrl || null,
      videoPosterUrl: proj.videoPosterUrl || null,
      videoPublicId: proj.videoPublicId || null,
      liveUrl: proj.liveUrl || null,
      tags: proj.tags || [],
      createdAt: proj.createdAt,
      updatedAt: proj.updatedAt,
      categoryId: proj.categoryId || null,
      categoryName,
      categorySlug,
      media: projectMedia.map((m) => ({
        id: m.id,
        type: m.type,
        url: m.url,
        thumbnailUrl: m.thumbnailUrl || null,
        altText: m.altText || null,
        width: m.width || null,
        height: m.height || null,
      })),
    };

    await setCache(cacheKey, fullProject, CACHE_TTL.LONG);

    return NextResponse.json({ data: fullProject });
  } catch (error) {
    console.error("Project detail API error:", error);
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
  }
}
