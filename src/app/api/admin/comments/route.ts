import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Comment } from "@/models";
import { verifyToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("admin_token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = await verifyToken(token);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectToDatabase();

    const comments = await Comment.find({}).sort({ createdAt: -1 }).lean();

    const formatted = comments.map((c) => ({
      id: c.id,
      projectId: c.projectId,
      projectSlug: c.projectSlug,
      projectTitle: c.projectTitle,
      name: c.name,
      role: c.role || null,
      email: c.email || null,
      rating: c.rating,
      comment: c.comment,
      status: c.status || "approved",
      createdAt: c.createdAt,
    }));

    return NextResponse.json({ data: formatted });
  } catch (error) {
    console.error("GET /api/admin/comments error:", error);
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}
