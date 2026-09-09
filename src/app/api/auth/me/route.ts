import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { AdminUser } from "@/models";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("admin_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    try {
      await connectToDatabase();
      const user = await AdminUser.findOne({ id: payload.id }).lean();
      if (user) {
        return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name || "Admin" } });
      }
    } catch {
      // Fallback
    }

    return NextResponse.json({ user: { id: payload.id, email: payload.email, name: "Admin User" } });
  } catch {
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}
