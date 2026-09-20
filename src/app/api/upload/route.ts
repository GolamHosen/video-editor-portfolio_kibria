import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { cloudinary } from "@/lib/cloudinary";

export const dynamic = "force-dynamic";

/**
 * Server-side upload proxy for Cloudinary.
 *
 * Strategy:
 * - Files ≤ 4MB are proxied through this route (no CORS, fully server-side).
 * - Files > 4MB get a signed upload params response so the client can upload
 *   directly to Cloudinary (Cloudinary allows signed uploads from browsers
 *   when the signature is generated server-side).
 */
export async function POST(request: NextRequest) {
  try {
    // ── Auth ──
    const token = request.cookies.get("admin_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ── Parse form data ──
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "portfolio";
    const resourceType = (formData.get("resource_type") as string) || "auto";
    const mode = (formData.get("mode") as string) || "proxy"; // "proxy" | "sign"

    if (!file && mode !== "sign") {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // ── Mode: "sign" — return signed params for direct client upload ──
    if (mode === "sign") {
      const timestamp = Math.round(Date.now() / 1000);
      const paramsToSign: Record<string, string | number> = { timestamp, folder };

      const signature = cloudinary.utils.api_sign_request(
        paramsToSign,
        process.env.CLOUDINARY_API_SECRET!
      );

      return NextResponse.json({
        mode: "sign",
        signature,
        timestamp,
        cloudName: process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY!,
        folder,
      });
    }

    // ── Mode: "proxy" — upload through server ──
    // Validate file size (max 4MB for server proxy due to Vercel limits)
    const MAX_PROXY_SIZE = 4 * 1024 * 1024;
    if (file!.size > MAX_PROXY_SIZE) {
      return NextResponse.json(
        { error: "File too large for server upload. Use signed mode for files over 4MB." },
        { status: 413 }
      );
    }

    const bytes = await file!.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise<Record<string, unknown>>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: resourceType as "image" | "video" | "raw" | "auto",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result as Record<string, unknown>);
        }
      );
      uploadStream.end(buffer);
    });

    return NextResponse.json({
      mode: "proxy",
      secure_url: result.secure_url,
      public_id: result.public_id,
      resource_type: result.resource_type,
      format: result.format,
      width: result.width,
      height: result.height,
      bytes: result.bytes,
      duration: result.duration,
    });
  } catch (error: unknown) {
    console.error("Upload error:", error);
    const message = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
