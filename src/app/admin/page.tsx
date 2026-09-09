import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { Project, Category, ContactSubmission } from "@/models";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export const dynamic = "force-dynamic";

async function requireAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token) redirect("/admin/login");
  const user = await verifyToken(token);
  if (!user) redirect("/admin/login");
  return user;
}

export default async function AdminPage() {
  const user = await requireAuth();

  let stats = {
    totalProjects: 0,
    publishedProjects: 0,
    totalMessages: 0,
    unreadMessages: 0,
    totalCategories: 0,
  };
  let recentProjects: any[] = [];
  let recentMessages: any[] = [];

  try {
    await connectToDatabase();

    const [
      totalProjects,
      publishedProjects,
      totalMessages,
      unreadMessages,
      totalCategories,
      projectsData,
      messagesData,
    ] = await Promise.all([
      Project.countDocuments({}),
      Project.countDocuments({ status: "published" }),
      ContactSubmission.countDocuments({}),
      ContactSubmission.countDocuments({ read: false }),
      Category.countDocuments({}),
      Project.find({}).sort({ createdAt: -1 }).limit(5).lean(),
      ContactSubmission.find({}).sort({ createdAt: -1 }).limit(5).lean(),
    ]);

    stats = {
      totalProjects,
      publishedProjects,
      totalMessages,
      unreadMessages,
      totalCategories,
    };

    recentProjects = projectsData.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      status: p.status,
      featured: p.featured || false,
      createdAt: p.createdAt,
    }));

    recentMessages = messagesData.map((m) => ({
      id: m.id,
      name: m.name,
      email: m.email,
      subject: m.subject || null,
      message: m.message,
      read: m.read || false,
      createdAt: m.createdAt,
    }));
  } catch {
    // Database offline — stats remain zeroed
  }

  return (
    <AdminDashboard
      user={{ id: user.id, email: user.email }}
      stats={stats}
      recentProjects={recentProjects}
      recentMessages={recentMessages}
    />
  );
}
