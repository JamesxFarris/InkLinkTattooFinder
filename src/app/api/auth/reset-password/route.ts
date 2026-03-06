import { NextResponse } from "next/server";
import { headers } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { authLimiter } from "@/lib/rate-limit";
import { auditLog } from "@/lib/audit";

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

  const { token, password } = await request.json();

  if (!token || typeof token !== "string") {
    return NextResponse.json({ error: "Invalid reset link." }, { status: 400 });
  }

  if (!password || typeof password !== "string" || password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters." },
      { status: 400 }
    );
  }

  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { token },
    include: { user: { select: { id: true, email: true } } },
  });

  if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) {
    return NextResponse.json(
      { error: "This reset link has expired or already been used. Please request a new one." },
      { status: 400 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: resetToken.userId },
      data: { passwordHash },
    }),
    prisma.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { usedAt: new Date() },
    }),
  ]);

  await auditLog({
    userId: resetToken.userId,
    action: "user.passwordReset",
    targetType: "user",
    targetId: resetToken.userId,
    details: { email: resetToken.user.email },
  });

  return NextResponse.json({ message: "Password reset successfully. You can now sign in." });
}
