import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Project, Category, Media } from "@/models";
import { cacheQuery, publicCacheHeaders } from "@/lib/cache";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const loadProject = cacheQuery(
      async () => {
        await connectToDatabase();
        const proj = await Project.findOne({ slug, status: "published" }).lean();

        if (!proj) return null;

        const [categoryRes, projectMedia] = await Promise.all([
          proj.categoryId ? Category.findOne({ id: proj.categoryId }).lean() : Promise.resolve(null),
          Media.find({ projectId: proj.id }).sort({ order: 1 }).lean(),
        ]);

        return {
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
          categoryName: categoryRes?.name || null,
          categorySlug: categoryRes?.slug || null,
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
      },
      ["project", slug]
    );

    const fullProject = await loadProject();

    if (!fullProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ data: fullProject }, { headers: publicCacheHeaders() });
  } catch (error) {
    console.error("Project detail API error:", error);
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
  }
}
