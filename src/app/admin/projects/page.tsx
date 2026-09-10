import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { Project, Category } from "@/models";
import { AdminProjectsList } from "@/components/admin/AdminProjectsList";

export const dynamic = "force-dynamic";

async function requireAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token) redirect("/admin/login");
  const user = await verifyToken(token);
  if (!user) redirect("/admin/login");
  return user;
}

export default async function AdminProjectsPage() {
  await requireAuth();

  let allProjects: any[] = [];
  try {
    await connectToDatabase();
    const [projectsData, categoriesData] = await Promise.all([
      Project.find({}).sort({ order: 1, createdAt: -1 }).select("id title slug status featured order thumbnailUrl videoPosterUrl videoUrl createdAt categoryId").lean(),
      Category.find({}).select("id name").lean(),
    ]);

    const catMap = new Map(categoriesData.map((c) => [c.id, c.name]));

    allProjects = projectsData.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      status: p.status,
      featured: p.featured || false,
      order: p.order || 0,
      thumbnailUrl: p.thumbnailUrl || null,
      videoPosterUrl: p.videoPosterUrl || null,
      videoUrl: p.videoUrl || null,
      createdAt: p.createdAt,
      categoryName: p.categoryId ? catMap.get(p.categoryId) || null : null,
    }));
  } catch {
    // Database offline — show empty projects list
  }

  return <AdminProjectsList projects={allProjects} />;
}
