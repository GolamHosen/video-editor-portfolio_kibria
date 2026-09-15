import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Skill } from "@/models";
import { verifyToken } from "@/lib/auth";
import { z } from "zod";
import { isDatabaseOnline } from "@/lib/dbHealth";

export const dynamic = "force-dynamic";

async function requireAdmin(request: NextRequest) {
  const token = request.cookies.get("admin_token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

const skillUpdateSchema = z.object({
  category: z.string().min(1).optional(),
  items: z.array(z.string().min(1)).min(1).optional(),
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
    const skillId = parseInt(id);
    if (isNaN(skillId)) {
      return NextResponse.json({ error: "Invalid skill ID" }, { status: 400 });
    }

    const body = await request.json();
    const parsed = skillUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data", details: parsed.error.flatten() }, { status: 400 });
    }

    await connectToDatabase();

    const skill = await Skill.findOneAndUpdate(
      { id: skillId },
      { $set: parsed.data },
      { new: true }
    );

    if (!skill) {
      return NextResponse.json({ error: "Skill group not found" }, { status: 404 });
    }

    return NextResponse.json({ data: skill });
  } catch (error) {
    console.error("PATCH /api/admin/skills/[id] error:", error);
    return NextResponse.json({ error: "Failed to update skill group" }, { status: 500 });
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
    const skillId = parseInt(id);

    if (isNaN(skillId)) {
      return NextResponse.json({ error: "Invalid skill ID" }, { status: 400 });
    }

    await connectToDatabase();

    await Skill.deleteOne({ id: skillId });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/admin/skills/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete skill group" }, { status: 500 });
  }
}
