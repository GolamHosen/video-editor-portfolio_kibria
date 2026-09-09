import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ContactSubmission } from "@/models";
import { verifyToken } from "@/lib/auth";
import { isDatabaseOnline } from "@/lib/dbHealth";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = request.cookies.get("admin_token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const payload = await verifyToken(token);
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const online = await isDatabaseOnline();
  if (!online) {
    return NextResponse.json(
      { error: "Database unavailable", message: "MongoDB database is unreachable." },
      { status: 503 }
    );
  }

  try {
    const { id } = await params;
    const msgId = parseInt(id);
    if (isNaN(msgId)) {
      return NextResponse.json({ error: "Invalid message ID" }, { status: 400 });
    }

    await connectToDatabase();
    await ContactSubmission.updateOne({ id: msgId }, { $set: { read: true } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/admin/messages/[id] error:", error);
    return NextResponse.json({ error: "Failed to mark message as read" }, { status: 500 });
  }
}
