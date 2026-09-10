import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { SiteSetting } from "@/models";
import { verifyToken } from "@/lib/auth";
import { z } from "zod";

export const dynamic = "force-dynamic";

async function requireAdmin(request: NextRequest) {
  const token = request.cookies.get("admin_token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function GET(request: NextRequest) {
  const user = await requireAdmin(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectToDatabase();
    const settings = await SiteSetting.find({}).sort({ id: 1 }).select("id key value type updatedAt").lean();
    const data = settings.map((s) => ({
      id: s.id,
      key: s.key,
      value: s.value || "",
      type: s.type || "text",
      updatedAt: s.updatedAt,
    }));

    return NextResponse.json({ data });
  } catch (error) {
    console.error("GET /api/admin/settings error:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

const putSchema = z.object({
  settings: z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()])).optional(),
});

export async function PUT(request: NextRequest) {
  const user = await requireAdmin(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const parsed = putSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data", details: parsed.error.flatten() }, { status: 400 });
    }

    const entries = parsed.data.settings ?? {};
    if (Object.keys(entries).length === 0) {
      return NextResponse.json({ error: "No settings provided" }, { status: 400 });
    }

    await connectToDatabase();

    for (const [key, value] of Object.entries(entries)) {
      // Only allow known, safe settings keys.
      const knownKeys = [
        "hero_title",
        "hero_subtitle",
        "hero_cta",
        "about_title",
        "about_bio",
        "contact_email",
        "availability",
      ];
      if (!knownKeys.includes(key)) continue;

      const normalized = value === null || value === undefined ? "" : String(value);
      const existing = await SiteSetting.findOne({ key }).lean();
      if (existing) {
        await SiteSetting.updateOne(
          { key },
          { $set: { value: normalized, updatedAt: new Date() } }
        );
      } else {
        const maxSetting = await SiteSetting.findOne({}).sort({ id: -1 }).lean();
        const nextId = maxSetting && maxSetting.id ? maxSetting.id + 1 : 1;
        await SiteSetting.create({ id: nextId, key, value: normalized, type: "text" });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT /api/admin/settings error:", error);
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}