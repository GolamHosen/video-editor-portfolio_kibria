import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { Category } from "@/models";
import { AdminCategories } from "@/components/admin/AdminCategories";

export const dynamic = "force-dynamic";

async function requireAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token) redirect("/admin/login");
  const user = await verifyToken(token);
  if (!user) redirect("/admin/login");
  return user;
}

export default async function CategoriesPage() {
  await requireAuth();
  let allCategories: any[] = [];
  try {
    await connectToDatabase();
    const categoriesData = await Category.find({}).sort({ order: 1 }).lean();
    allCategories = categoriesData.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description || null,
      order: c.order || 0,
      createdAt: c.createdAt,
    }));
  } catch {
    // Database offline — show empty categories
  }
  return <AdminCategories categories={allCategories} />;
}
