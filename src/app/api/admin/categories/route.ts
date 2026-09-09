import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Category } from "@/models";
import { verifyToken } from "@/lib/auth";
import { z } from "zod";
import { invalidateCache, CACHE_KEYS } from "@/lib/redis";
import { isDatabaseOnline } from "@/lib/dbHealth";

export const dynamic = "force-dynamic";

const categorySchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
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
    const parsed = categorySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data", details: parsed.error.flatten() }, { status: 400 });
    }

    await connectToDatabase();

    const maxCat = await Category.findOne({}).sort({ id: -1 }).lean();
    const nextId = maxCat && maxCat.id ? maxCat.id + 1 : 1;

    const cat = await Category.create({
      ...parsed.data,
      id: nextId,
    });

    await invalidateCache(CACHE_KEYS.CATEGORIES);

    return NextResponse.json({ data: cat }, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/categories error:", error);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}
