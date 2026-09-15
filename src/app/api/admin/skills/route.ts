import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Skill } from "@/models";
import { verifyToken } from "@/lib/auth";
import { z } from "zod";
import { isDatabaseOnline } from "@/lib/dbHealth";
import { revalidatePublicContent } from "@/lib/revalidate";

export const dynamic = "force-dynamic";

const skillSchema = z.object({
  category: z.string().min(1),
  items: z.array(z.string().min(1)).min(1),
  order: z.number().default(0),
});

export async function POST(request: NextRequest) {
  const token = request.cookies.get("admin_token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = await verifyToken(token);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const online = await isDatabaseOnline();
  if (!online) {
    return NextResponse.json(
      { error: "Database unavailable", message: "MongoDB database is unreachable." },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const parsed = skillSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data", details: parsed.error.flatten() }, { status: 400 });
    }

    await connectToDatabase();

    const maxSkill = await Skill.findOne({}).sort({ id: -1 }).lean();
    const nextId = maxSkill && maxSkill.id ? maxSkill.id + 1 : 1;

    const skill = await Skill.create({
      ...parsed.data,
      id: nextId,
    });

    revalidatePublicContent();
    return NextResponse.json({ data: skill }, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/skills error:", error);
    return NextResponse.json({ error: "Failed to create skill group" }, { status: 500 });
  }
}
