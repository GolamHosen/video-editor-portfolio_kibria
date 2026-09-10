import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ContactSubmission } from "@/models";
import { z } from "zod";
import { sendContactEmail } from "@/lib/email";
import { rateLimit, rateLimitedResponse } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

const contactSchema = z.object({
  name: z.string().min(2).max(255),
  email: z.string().email(),
  subject: z.string().max(500).optional(),
  message: z.string().min(10),
  projectType: z.string().max(100).optional(),
  budget: z.string().max(100).optional(),
});

export async function POST(request: NextRequest) {
  // Anti-spam: max 6 messages / IP / minute.
  const limited = rateLimit(request, "contact", 6, 60);
  if (!limited.success) {
    return rateLimitedResponse(limited.retryAfterSeconds);
  }

  try {
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Please fill in all required fields properly.", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    // 1. Try saving to MongoDB
    try {
      await connectToDatabase();
      const maxMsg = await ContactSubmission.findOne({}).sort({ id: -1 }).lean();
      const nextId = maxMsg && maxMsg.id ? maxMsg.id + 1 : 1;

      await ContactSubmission.create({
        id: nextId,
        name: parsed.data.name,
        email: parsed.data.email,
        subject: parsed.data.subject,
        message: parsed.data.message,
        projectType: parsed.data.projectType,
        budget: parsed.data.budget,
        read: false,
      });
    } catch (dbErr) {
      console.warn("MongoDB connection offline; message saving skipped:", dbErr);
    }

    // 2. Send email via Gmail SMTP
    try {
      await sendContactEmail(parsed.data);
    } catch (emailErr) {
      console.error("Failed to send Gmail SMTP email:", emailErr);
    }

    return NextResponse.json({
      success: true,
      message: "Message sent successfully!",
    });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
