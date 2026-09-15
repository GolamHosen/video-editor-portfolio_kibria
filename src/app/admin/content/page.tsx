import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { Stat, Skill, Experience, Service } from "@/models";
import { AdminContent } from "@/components/admin/AdminContent";

export const dynamic = "force-dynamic";

async function requireAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token) redirect("/admin/login");
  const user = await verifyToken(token);
  if (!user) redirect("/admin/login");
  return user;
}

export default async function ContentPage() {
  await requireAuth();
  let stats: any[] = [];
  let skills: any[] = [];
  let experience: any[] = [];
  let services: any[] = [];
  try {
    await connectToDatabase();
    const [statsData, skillsData, experienceData, servicesData] = await Promise.all([
      Stat.find({}).sort({ order: 1 }).lean(),
      Skill.find({}).sort({ order: 1 }).lean(),
      Experience.find({}).sort({ order: 1 }).lean(),
      Service.find({}).sort({ order: 1 }).lean(),
    ]);
    stats = statsData.map((s) => ({
      id: s.id,
      value: s.value,
      label: s.label,
      order: s.order,
    }));
    skills = skillsData.map((s) => ({
      id: s.id,
      category: s.category,
      items: s.items || [],
      order: s.order,
    }));
    experience = experienceData.map((e) => ({
      id: e.id,
      year: e.year,
      title: e.title,
      description: e.description || "",
      order: e.order,
    }));
    services = servicesData.map((s) => ({
      id: s.id,
      title: s.title,
      description: s.description || "",
      icon: s.icon || "",
      features: s.features || [],
      order: s.order,
    }));
  } catch {
    // Database offline — show empty lists
  }
  return <AdminContent stats={stats} skills={skills} experience={experience} services={services} />;
}
