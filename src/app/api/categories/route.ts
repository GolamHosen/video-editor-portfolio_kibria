import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Category } from "@/models";
import { cacheQuery, publicCacheHeaders } from "@/lib/cache";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const loadCategories = cacheQuery(
      async () => {
        await connectToDatabase();
        const categoriesData = await Category.find({}).sort({ order: 1 }).lean();

        return categoriesData.map((c) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          description: c.description || null,
          order: c.order || 0,
          createdAt: c.createdAt,
        }));
      },
      ["categories"]
    );

    const data = await loadCategories();

    return NextResponse.json({ data }, { headers: publicCacheHeaders() });
  } catch (error) {
    console.error("Categories API error:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}
