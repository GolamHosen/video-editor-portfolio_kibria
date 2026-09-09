import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Project, Category } from "@/models";
import { verifyToken } from "@/lib/auth";
import { z } from "zod";
import { slugify } from "@/lib/utils";
import { invalidateCache, CACHE_KEYS } from "@/lib/redis";

export const dynamic = "force-dynamic";

async function requireAdmin(request: NextRequest) {
  const token = request.cookies.get("admin_token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

// Coerce empty strings to null for optional fields
const emptyToNull = z.preprocess(
  (val) => (typeof val === "string" && val.trim() === "" ? null : val),
  z.string().nullable().optional()
);

const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: emptyToNull,
  description: emptyToNull,
  shortDescription: z.preprocess(
    (val) => (typeof val === "string" && val.trim() === "" ? null : val),
    z.string().max(500).nullable().optional()
  ),
  categoryId: z.number().nullable().optional(),
  client: emptyToNull,
  year: z.number().nullable().optional(),
  role: emptyToNull,
  tools: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  order: z.number().default(0),
  status: z.enum(["draft", "published", "archived"]).default("published"),
  thumbnailUrl: emptyToNull,
  thumbnailPublicId: emptyToNull,
  videoUrl: emptyToNull,
  videoPublicId: emptyToNull,
  videoPosterUrl: emptyToNull,
  tags: z.array(z.string()).default([]),
  liveUrl: emptyToNull,
});

export async function GET(request: NextRequest) {
  const user = await requireAdmin(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectToDatabase();
    const [projectsData, categoriesData] = await Promise.all([
      Project.find({}).sort({ order: 1, createdAt: -1 }).lean(),
      Category.find({}).lean(),
    ]);

    const catMap = new Map(categoriesData.map((c) => [c.id, c.name]));

    const data = projectsData.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      status: p.status,
      featured: p.featured || false,
      order: p.order || 0,
      thumbnailUrl: p.thumbnailUrl || null,
      videoPosterUrl: p.videoPosterUrl || null,
      videoUrl: p.videoUrl || null,
      createdAt: p.createdAt,
      categoryName: p.categoryId ? catMap.get(p.categoryId) || null : null,
    }));

    return NextResponse.json({ data });
  } catch (error) {
    console.error("GET /api/admin/projects error:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const user = await requireAdmin(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const parsed = projectSchema.safeParse(body);
    if (!parsed.success) {
      const flat = parsed.error.flatten();
      console.error("POST /api/admin/projects validation error:", JSON.stringify(flat, null, 2));
      const fieldMessages = Object.entries(flat.fieldErrors)
        .map(([field, errs]) => `${field}: ${(errs as string[]).join(", ")}`)
        .join("; ");
      return NextResponse.json(
        { error: fieldMessages || "Invalid project data", details: flat },
        { status: 400 }
      );
    }

    const slug = parsed.data.slug || slugify(parsed.data.title);

    await connectToDatabase();

    // Auto-generate numeric ID
    const maxProject = await Project.findOne({}).sort({ id: -1 }).lean();
    const nextId = maxProject && maxProject.id ? maxProject.id + 1 : 1;

    const newProject = await Project.create({
      ...parsed.data,
      id: nextId,
      slug,
    });

    await invalidateCache([CACHE_KEYS.ALL_PROJECTS, CACHE_KEYS.FEATURED_PROJECTS]);

    return NextResponse.json({ data: newProject }, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/projects error:", error);
    const errorMessage =
      error instanceof Error && error.message.includes("Could not connect to any servers in your MongoDB Atlas cluster")
        ? "MongoDB Atlas connection failed: Your IP address is not whitelisted in MongoDB Atlas. Please add 0.0.0.0/0 to Network Access in Atlas."
        : error instanceof Error
        ? error.message
        : "Failed to create project";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

