import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Category } from "@/models";
import { getCached, setCache, CACHE_KEYS, CACHE_TTL } from "@/lib/redis";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const cached = await getCached(CACHE_KEYS.CATEGORIES);
    if (cached) {
      return NextResponse.json({ data: cached });
    }

    await connectToDatabase();
    const categoriesData = await Category.find({}).sort({ order: 1 }).lean();

    const data = categoriesData.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description || null,
      order: c.order || 0,
      createdAt: c.createdAt,
    }));

    await setCache(CACHE_KEYS.CATEGORIES, data, CACHE_TTL.LONG);
    return NextResponse.json({ data });
  } catch (error) {
    console.error("Categories API error:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}
