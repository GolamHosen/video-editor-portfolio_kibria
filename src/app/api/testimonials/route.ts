import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Testimonial } from "@/models";
import { cacheQuery, publicCacheHeaders } from "@/lib/cache";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const loadTestimonials = cacheQuery(
      async () => {
        await connectToDatabase();
        const testimonialsData = await Testimonial.find({}).sort({ order: 1 }).lean();

        return testimonialsData.map((t) => ({
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
      },
      ["testimonials"]
    );

    const data = await loadTestimonials();

    return NextResponse.json({ data }, { headers: publicCacheHeaders() });
  } catch (error) {
    console.error("Testimonials API error:", error);
    return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 });
  }
}
