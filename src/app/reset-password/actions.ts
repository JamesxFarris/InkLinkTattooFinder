"use server";

import { headers } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { auditLog } from "@/lib/audit";
import { authLimiter } from "@/lib/rate-limit";
import { consumeAuthToken } from "@/lib/tokens";

type ResetResult = { success: boolean; message: string };

export async function resetPassword(
  _prev: ResetResult | null,
  formData: FormData
): Promise<ResetResult> {
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const { success: allowed } = authLimiter.check(ip);
  if (!allowed) {
    return { success: false, message: "Too many attempts. Please try again in a minute." };
  }

  const token = formData.get("token") as string | null;
  const password = formData.get("password") as string | null;
  const confirm = formData.get("confirm") as string | null;

  if (!password || password.length < 8) {
    return { success: false, message: "Password must be at least 8 characters." };
  }
  if (password !== confirm) {
    return { success: false, message: "Passwords don't match." };
  }

  try {
    const tokenRow = await consumeAuthToken(token ?? "", "password_reset");
    if (!tokenRow) {
      return {
        success: false,
        message: "This reset link is invalid or has expired. Please request a new one.",
      };
    }

    const passwordHash = await bcrypt.hash(password, 12);
    await prisma.user.update({
      where: { id: tokenRow.userId },
      data: {
        passwordHash,
        // Completing a reset proves control of the inbox
        emailVerifiedAt: new Date(),
      },
    });

    await auditLog({
      userId: tokenRow.userId,
      action: "user.password_reset",
      targetType: "user",
      targetId: tokenRow.userId,
    });

    return { success: true, message: "Your password has been reset. You can now sign in." };
  } catch (error) {
    console.error("Password reset error:", error);
    return { success: false, message: "Something went wrong. Please try again later." };
  }
}
