import { NextResponse } from "next/server";
import { headers } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { auditLog } from "@/lib/audit";
import { authLimiter } from "@/lib/rate-limit";
import { sanitizeString, isValidEmail, MAX_NAME, MAX_EMAIL } from "@/lib/validation";
import { createAuthToken } from "@/lib/tokens";
import { sendVerificationEmail, getBaseUrl } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const { success: allowed } = authLimiter.check(ip);
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many attempts. Please try again in a minute." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const name = sanitizeString(body.name, MAX_NAME);
    const email = sanitizeString(body.email, MAX_EMAIL)?.toLowerCase();
    const password = body.password as string | undefined;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    // Note: never assign admin here — emails are unverified at registration.
    // Admin promotion happens at login (see lib/auth.ts) and requires a verified email.
    const user = await prisma.user.create({
      data: { name, email, passwordHash },
      select: { id: true, email: true, name: true, role: true },
    });

    try {
      const token = await createAuthToken(user.id, "email_verify");
      await sendVerificationEmail({
        userEmail: user.email,
        userName: user.name,
        verifyUrl: `${getBaseUrl()}/verify-email?token=${token}`,
      });
    } catch (err) {
      // Verification email failure shouldn't block registration
      console.error("Failed to send verification email:", err);
    }

    await auditLog({
      userId: user.id,
      action: "user.register",
      targetType: "user",
      targetId: user.id,
      details: { email: user.email },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
