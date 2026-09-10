import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { Comment } from "@/models";
import { AdminComments } from "@/components/admin/AdminComments";

export const dynamic = "force-dynamic";

async function requireAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token) redirect("/admin/login");
  const user = await verifyToken(token);
  if (!user) redirect("/admin/login");
  return user;
}

export default async function AdminCommentsPage() {
  await requireAuth();
  let allComments: any[] = [];
  try {
    await connectToDatabase();
    const commentsData = await Comment.find({}).sort({ createdAt: -1 }).select("id projectId projectSlug projectTitle name role email rating comment status createdAt").lean();
    allComments = commentsData.map((c) => ({
      id: c.id,
      projectId: c.projectId,
      projectSlug: c.projectSlug,
      projectTitle: c.projectTitle,
      name: c.name,
      role: c.role || null,
      email: c.email || null,
      rating: c.rating,
      comment: c.comment,
      status: c.status || "approved",
      createdAt: c.createdAt,
    }));
  } catch {
    // Database offline
  }
  return <AdminComments comments={allComments} />;
}
