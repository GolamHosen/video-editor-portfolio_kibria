import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Category } from "@/models";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
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

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Categories API error:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}
