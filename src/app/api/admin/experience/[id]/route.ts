import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Experience } from "@/models";
import { verifyToken } from "@/lib/auth";
import { z } from "zod";
import { isDatabaseOnline } from "@/lib/dbHealth";

export const dynamic = "force-dynamic";

async function requireAdmin(request: NextRequest) {
  const token = request.cookies.get("admin_token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

const experienceUpdateSchema = z.object({
  year: z.string().min(1).optional(),
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  order: z.number().optional(),
});

export async function PATCH(
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
    const expId = parseInt(id);
    if (isNaN(expId)) {
      return NextResponse.json({ error: "Invalid experience ID" }, { status: 400 });
    }

    const body = await request.json();
    const parsed = experienceUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data", details: parsed.error.flatten() }, { status: 400 });
    }

    await connectToDatabase();

    const experience = await Experience.findOneAndUpdate(
      { id: expId },
      { $set: parsed.data },
      { new: true }
    );

    if (!experience) {
      return NextResponse.json({ error: "Experience entry not found" }, { status: 404 });
    }

    return NextResponse.json({ data: experience });
  } catch (error) {
    console.error("PATCH /api/admin/experience/[id] error:", error);
    return NextResponse.json({ error: "Failed to update experience entry" }, { status: 500 });
  }
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
    const expId = parseInt(id);

    if (isNaN(expId)) {
      return NextResponse.json({ error: "Invalid experience ID" }, { status: 400 });
    }

    await connectToDatabase();

    await Experience.deleteOne({ id: expId });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/admin/experience/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete experience entry" }, { status: 500 });
  }
}
