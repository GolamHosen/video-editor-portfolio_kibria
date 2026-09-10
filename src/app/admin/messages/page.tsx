import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { ContactSubmission } from "@/models";
import { AdminMessages } from "@/components/admin/AdminMessages";

export const dynamic = "force-dynamic";

async function requireAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token) redirect("/admin/login");
  const user = await verifyToken(token);
  if (!user) redirect("/admin/login");
  return user;
}

export default async function MessagesPage() {
  await requireAuth();

  let messages: any[] = [];
  try {
    await connectToDatabase();
    const data = await ContactSubmission.find({}).sort({ createdAt: -1 }).select("id name email subject message projectType budget read createdAt").lean();
    messages = data.map((m) => ({
      id: m.id,
      name: m.name,
      email: m.email,
      subject: m.subject || null,
      message: m.message,
      projectType: m.projectType || null,
      budget: m.budget || null,
      read: m.read || false,
      createdAt: m.createdAt,
    }));
  } catch {
    messages = [];
  }

  return <AdminMessages messages={messages} />;
}
