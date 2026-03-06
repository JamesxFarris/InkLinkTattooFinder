import { NextResponse } from "next/server";
import { headers } from "next/headers";
import crypto from "crypto";
import { prisma } from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/email";
import { authLimiter } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const { success: allowed } = authLimiter.check(ip);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many attempts. Please try again in a minute." },
      { status: 429 }
    );
  }

  const { email } = await request.json();
  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  // Always return success to prevent email enumeration
  const successResponse = NextResponse.json({
    message: "If an account with that email exists, we've sent a password reset link.",
  });

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
    select: { id: true, name: true, email: true },
  });

  if (!user) return successResponse;

  // Invalidate any existing unused tokens for this user
  await prisma.passwordResetToken.updateMany({
    where: { userId: user.id, usedAt: null },
    data: { expiresAt: new Date(0) },
  });

  const token = crypto.randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await prisma.passwordResetToken.create({
    data: { userId: user.id, token, expiresAt },
  });

  const baseUrl = process.env.NEXTAUTH_URL || "https://inklinktattoofinder.com";
  const resetUrl = `${baseUrl}/reset-password?token=${token}`;

  await sendPasswordResetEmail({
    userEmail: user.email,
    userName: user.name,
    resetUrl,
  });

  return successResponse;
}
