import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Category, Project } from "@/models";
import { verifyToken } from "@/lib/auth";
import { invalidateCache, CACHE_KEYS } from "@/lib/redis";
import { isDatabaseOnline } from "@/lib/dbHealth";

export const dynamic = "force-dynamic";

async function requireAdmin(request: NextRequest) {
  const token = request.cookies.get("admin_token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireAdmin(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const online = await isDatabaseOnline();
  if (!online) {
    return NextResponse.json(
      { error: "Database unavailable", message: "MongoDB database is unreachable." },
      { status: 503 }
    );
  }

  try {
    const { id } = await params;
    const catId = parseInt(id);

    if (isNaN(catId)) {
      return NextResponse.json({ error: "Invalid category ID" }, { status: 400 });
    }

    await connectToDatabase();

    // Unlink any projects assigned to this category
    try {
      await Project.updateMany({ categoryId: catId }, { $unset: { categoryId: "" } });
    } catch {
      // Safe skip
    }

    await Category.deleteOne({ id: catId });
    await invalidateCache(CACHE_KEYS.CATEGORIES);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/admin/categories/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}
