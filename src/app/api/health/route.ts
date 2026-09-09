import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import mongoose from "mongoose";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectToDatabase();
    if (mongoose.connection.readyState === 1) {
      return NextResponse.json({ status: "ok", database: "connected", engine: "mongodb", timestamp: new Date().toISOString() });
    }
    return NextResponse.json({ status: "error", database: "connecting" }, { status: 500 });
  } catch {
    return NextResponse.json({ status: "error", database: "disconnected" }, { status: 500 });
  }
}
