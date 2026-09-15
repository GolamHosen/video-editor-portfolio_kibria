import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Stat } from "@/models";
import { verifyToken } from "@/lib/auth";
import { z } from "zod";
import { isDatabaseOnline } from "@/lib/dbHealth";

export const dynamic = "force-dynamic";

const statSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
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
    const parsed = statSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data", details: parsed.error.flatten() }, { status: 400 });
    }

    await connectToDatabase();

    const maxStat = await Stat.findOne({}).sort({ id: -1 }).lean();
    const nextId = maxStat && maxStat.id ? maxStat.id + 1 : 1;

    const stat = await Stat.create({
      ...parsed.data,
      id: nextId,
    });

    return NextResponse.json({ data: stat }, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/stats error:", error);
    return NextResponse.json({ error: "Failed to create stat" }, { status: 500 });
  }
}
