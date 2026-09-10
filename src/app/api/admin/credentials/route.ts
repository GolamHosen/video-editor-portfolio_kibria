import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { AdminUser } from "@/models";
import { verifyToken, verifyPassword, hashPassword } from "@/lib/auth";
import { rateLimit, rateLimitedResponse } from "@/lib/rateLimit";
import { z } from "zod";

export const dynamic = "force-dynamic";

const credentialsSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    email: z.string().email("Enter a valid email address").optional(),
    name: z.string().max(100).optional(),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters")
      .max(200)
      .optional(),
  })
  .refine((d) => d.email !== undefined || d.name !== undefined || d.newPassword !== undefined, {
    message: "Provide at least one field to update (email, name, or new password).",
  });

export async function POST(request: NextRequest) {
  // Defense in depth: even this admin endpoint is per-IP throttled.
  const limited = rateLimit(request, "credentials", 10, 60);
  if (!limited.success) {
    return rateLimitedResponse(limited.retryAfterSeconds);
  }

  const token = request.cookies.get("admin_token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const payload = await verifyToken(token);
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const parsed = credentialsSchema.safeParse(body);
    if (!parsed.success) {
      const flat = parsed.error.flatten();
      const messages = Object.values(flat.fieldErrors || {})
        .flat()
        .filter(Boolean)
        .map(String);
      return NextResponse.json(
        { error: messages[0] || "Invalid data", details: flat },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const user = await AdminUser.findOne({ id: payload.id });
    if (!user) {
      return NextResponse.json({ error: "Admin account not found" }, { status: 404 });
    }

    // Verify the current password before allowing ANY credential change.
    const valid = await verifyPassword(parsed.data.currentPassword, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Current password is incorrect." }, { status: 403 });
    }

    const updates: Record<string, unknown> = { updatedAt: new Date() };

    if (parsed.data.email) {
      const newEmail = parsed.data.email.toLowerCase().trim();
      if (newEmail !== user.email.toLowerCase().trim()) {
        const conflict = await AdminUser.findOne({ email: newEmail });
        if (conflict && conflict.id !== user.id) {
          return NextResponse.json({ error: "That email is already in use." }, { status: 409 });
        }
        updates.email = newEmail;
      }
    }

    if (parsed.data.name && parsed.data.name.trim()) {
      updates.name = parsed.data.name.trim();
    }

    if (parsed.data.newPassword) {
      updates.passwordHash = await hashPassword(parsed.data.newPassword);
    }

    await AdminUser.updateOne({ id: user.id }, { $set: updates });

    return NextResponse.json({
      success: true,
      message: "Admin credentials updated. Use the new credentials on your next login.",
      emailChanged: updates.email !== undefined,
      passwordChanged: updates.passwordHash !== undefined,
    });
  } catch (error) {
    console.error("POST /api/admin/credentials error:", error);
    return NextResponse.json({ error: "Failed to update credentials" }, { status: 500 });
  }
}