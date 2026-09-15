import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Stat } from "@/models";
import { verifyToken } from "@/lib/auth";
import { z } from "zod";
import { isDatabaseOnline } from "@/lib/dbHealth";

export const dynamic = "force-dynamic";

async function requireAdmin(request: NextRequest) {
  const token = request.cookies.get("admin_token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

const statUpdateSchema = z.object({
  label: z.string().min(1).optional(),
  value: z.string().min(1).optional(),
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
    const statId = parseInt(id);
    if (isNaN(statId)) {
      return NextResponse.json({ error: "Invalid stat ID" }, { status: 400 });
    }

    const body = await request.json();
    const parsed = statUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data", details: parsed.error.flatten() }, { status: 400 });
    }

    await connectToDatabase();

    const stat = await Stat.findOneAndUpdate(
      { id: statId },
      { $set: parsed.data },
      { new: true }
    );

    if (!stat) {
      return NextResponse.json({ error: "Stat not found" }, { status: 404 });
    }

    return NextResponse.json({ data: stat });
  } catch (error) {
    console.error("PATCH /api/admin/stats/[id] error:", error);
    return NextResponse.json({ error: "Failed to update stat" }, { status: 500 });
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
    const statId = parseInt(id);

    if (isNaN(statId)) {
      return NextResponse.json({ error: "Invalid stat ID" }, { status: 400 });
    }

    await connectToDatabase();

    await Stat.deleteOne({ id: statId });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/admin/stats/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete stat" }, { status: 500 });
  }
}
