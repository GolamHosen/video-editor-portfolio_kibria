import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Project, Media } from "@/models";
import { verifyToken } from "@/lib/auth";
import { z } from "zod";
import { slugify } from "@/lib/utils";
import { invalidateCache, CACHE_KEYS } from "@/lib/redis";
import { isDatabaseOnline } from "@/lib/dbHealth";

export const dynamic = "force-dynamic";

async function requireAdmin(request: NextRequest) {
  const token = request.cookies.get("admin_token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

async function guardAdminAndDb(request: NextRequest) {
  const user = await requireAdmin(request);
  if (!user) {
    return { response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  const online = await isDatabaseOnline();
  if (!online) {
    return {
      response: NextResponse.json(
        {
          error: "Database unavailable",
          message: "MongoDB database is unreachable.",
        },
        { status: 503 }
      ),
    };
  }

  return { user };
}

// Coerce empty strings to null for optional fields
const emptyToNull = z.preprocess(
  (val) => (typeof val === "string" && val.trim() === "" ? null : val),
  z.string().nullable().optional()
);

const updateSchema = z.object({
  title: z.string().min(1).optional(),
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
  tools: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  order: z.number().optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
  thumbnailUrl: emptyToNull,
  thumbnailPublicId: emptyToNull,
  videoUrl: emptyToNull,
  videoPublicId: emptyToNull,
  videoPosterUrl: emptyToNull,
  tags: z.array(z.string()).optional(),
  liveUrl: emptyToNull,
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await guardAdminAndDb(request);
  if ("response" in guard) return guard.response;

  try {
    const { id } = await params;
    await connectToDatabase();
    const project = await Project.findOne({ id: parseInt(id) }).lean();

    if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ data: project });
  } catch (error) {
    console.error("GET /api/admin/projects/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await guardAdminAndDb(request);
  if ("response" in guard) return guard.response;

  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      const flat = parsed.error.flatten();
      console.error("PATCH /api/admin/projects/[id] validation error:", JSON.stringify(flat, null, 2));
      const fieldMessages = Object.entries(flat.fieldErrors)
        .map(([field, errs]) => `${field}: ${(errs as string[]).join(", ")}`)
        .join("; ");
      return NextResponse.json(
        { error: fieldMessages || "Invalid project data", details: flat },
        { status: 400 }
      );
    }

    const updateData: Record<string, unknown> = { ...parsed.data, updatedAt: new Date() };
    if (parsed.data.title && !parsed.data.slug) {
      updateData.slug = slugify(parsed.data.title);
    }

    await connectToDatabase();
    const project = await Project.findOneAndUpdate(
      { id: parseInt(id) },
      { $set: updateData },
      { new: true }
    ).lean();

    if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

    await invalidateCache([
      CACHE_KEYS.ALL_PROJECTS,
      CACHE_KEYS.FEATURED_PROJECTS,
      CACHE_KEYS.PROJECT(project.slug),
    ]);

    return NextResponse.json({ data: project });
  } catch (error) {
    console.error("PATCH /api/admin/projects/[id] error:", error);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await guardAdminAndDb(request);
  if ("response" in guard) return guard.response;

  try {
    const { id } = await params;
    const projectId = parseInt(id);

    if (isNaN(projectId)) {
      return NextResponse.json({ error: "Invalid project ID" }, { status: 400 });
    }

    await connectToDatabase();
    const project = await Project.findOne({ id: projectId }).lean();

    if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

    // Delete associated media in MongoDB
    try {
      await Media.deleteMany({ projectId });
    } catch {
      // Safe skip
    }

    // Delete Cloudinary assets (best effort)
    try {
      const publicIds: { id: string; type: "image" | "video" }[] = [];
      if (project.thumbnailPublicId) publicIds.push({ id: project.thumbnailPublicId, type: "image" });
      if (project.videoPublicId) publicIds.push({ id: project.videoPublicId, type: "video" });

      if (publicIds.length > 0) {
        const { deleteFromCloudinary } = await import("@/lib/cloudinary");
        await Promise.allSettled(
          publicIds.map((asset) => deleteFromCloudinary(asset.id, asset.type))
        );
      }
    } catch {
      // Non-fatal
    }

    await Project.deleteOne({ id: projectId });

    await invalidateCache([
      CACHE_KEYS.ALL_PROJECTS,
      CACHE_KEYS.FEATURED_PROJECTS,
      CACHE_KEYS.PROJECT(project.slug),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/admin/projects/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
