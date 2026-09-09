import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { Project, Category } from "@/models";
import { ProjectForm } from "@/components/admin/ProjectForm";

export const dynamic = "force-dynamic";

async function requireAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token) redirect("/admin/login");
  const user = await verifyToken(token);
  if (!user) redirect("/admin/login");
  return user;
}

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAuth();
  const { id } = await params;
  const numId = parseInt(id);

  let project: any = null;
  let allCategories: any[] = [];

  try {
    await connectToDatabase();

    const [dbProject, categoriesData] = await Promise.all([
      Project.findOne({ id: numId }).lean(),
      Category.find({}).sort({ order: 1 }).lean(),
    ]);

    if (dbProject) {
      project = {
        id: dbProject.id,
        title: dbProject.title,
        slug: dbProject.slug,
        description: dbProject.description || "",
        shortDescription: dbProject.shortDescription || "",
        categoryId: dbProject.categoryId || null,
        client: dbProject.client || "",
        year: dbProject.year || new Date().getFullYear(),
        role: dbProject.role || "",
        tools: dbProject.tools || [],
        featured: dbProject.featured || false,
        order: dbProject.order || 0,
        status: dbProject.status || "published",
        thumbnailUrl: dbProject.thumbnailUrl || "",
        thumbnailPublicId: dbProject.thumbnailPublicId || "",
        videoUrl: dbProject.videoUrl || "",
        videoPublicId: dbProject.videoPublicId || "",
        videoPosterUrl: dbProject.videoPosterUrl || "",
        tags: dbProject.tags || [],
        liveUrl: dbProject.liveUrl || "",
      };
    }

    allCategories = categoriesData.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description || null,
      order: c.order || 0,
    }));
  } catch {
    // Database offline
  }

  if (!project) {
    redirect("/admin/projects");
  }

  return <ProjectForm project={project} categories={allCategories} />;
}
