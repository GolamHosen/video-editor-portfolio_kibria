import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Testimonial } from "@/models";
import { getCached, setCache, CACHE_KEYS, CACHE_TTL } from "@/lib/redis";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const cached = await getCached(CACHE_KEYS.TESTIMONIALS);
    if (cached) {
      return NextResponse.json({ data: cached });
    }

    await connectToDatabase();
    const testimonialsData = await Testimonial.find({}).sort({ order: 1 }).lean();

    const data = testimonialsData.map((t) => ({
      id: t.id,
      name: t.name,
      company: t.company || null,
      role: t.role || null,
      message: t.message,
      imageUrl: t.imageUrl || null,
      imagePublicId: t.imagePublicId || null,
      rating: t.rating || 5,
      featured: t.featured || false,
      order: t.order || 0,
      createdAt: t.createdAt,
    }));

    await setCache(CACHE_KEYS.TESTIMONIALS, data, CACHE_TTL.LONG);
    return NextResponse.json({ data });
  } catch (error) {
    console.error("Testimonials API error:", error);
    return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 });
  }
}
