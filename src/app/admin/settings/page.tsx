import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { SiteSetting } from "@/models";
import { AdminSettings } from "@/components/admin/AdminSettings";

export const dynamic = "force-dynamic";

async function requireAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token) redirect("/admin/login");
  const user = await verifyToken(token);
  if (!user) redirect("/admin/login");
  return user;
}

export default async function SettingsPage() {
  await requireAuth();
  let settings: any[] = [];
  try {
    await connectToDatabase();
    const data = await SiteSetting.find({}).lean();
    settings = data.map((s) => ({
      id: s.id,
      key: s.key,
      value: s.value || "",
      type: s.type || "text",
      updatedAt: s.updatedAt,
    }));
  } catch {
    // Database offline — show empty settings
  }
  return <AdminSettings settings={settings} />;
}
