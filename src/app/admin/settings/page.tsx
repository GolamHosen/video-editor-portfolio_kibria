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
    const data = await SiteSetting.find({}).select("id key value type updatedAt").lean();
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

  // Ensure every editable key always shows a field, even before it exists in the DB.
  // Saving creates the missing rows server-side (PUT /api/admin/settings).
  const knownKeys = [
    "hero_title",
    "hero_subtitle",
    "hero_cta",
    "about_title",
    "about_bio",
    "about_bio_2",
    "contact_email",
    "availability",
  ];
  const present = new Set(settings.map((s) => s.key));
  for (const key of knownKeys) {
    if (!present.has(key)) {
      settings.push({ id: 0, key, value: "", type: "text", updatedAt: new Date() });
    }
  }
  settings.sort((a, b) => a.id - b.id || a.key.localeCompare(b.key));

  return <AdminSettings settings={settings} />;
}
