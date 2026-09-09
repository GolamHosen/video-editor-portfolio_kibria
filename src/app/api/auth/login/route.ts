import { NextRequest, NextResponse } from "next/server";
import { authenticateAdmin, createToken } from "@/lib/auth";
import { z } from "zod";

export const dynamic = "force-dynamic";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Please enter a valid email address and password." },
        { status: 400 }
      );
    }

    const result = await authenticateAdmin(parsed.data.email, parsed.data.password);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 401 });
    }

    const { user } = result;
    const token = await createToken({ id: user.id, email: user.email });

    const response = NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.name },
    });

    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login route error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during authentication. Please try again." },
      { status: 500 }
    );
  }
}
