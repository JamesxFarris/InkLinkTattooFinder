"use server";

import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { authLimiter } from "@/lib/rate-limit";
import { sanitizeString, isValidEmail, MAX_EMAIL } from "@/lib/validation";
import { createAuthToken } from "@/lib/tokens";
import { sendPasswordResetEmail, getBaseUrl } from "@/lib/email";

type ForgotResult = { success: boolean; message: string };

const GENERIC_SUCCESS =
  "If an account exists for that email, we've sent a password reset link. Check your inbox.";

export async function requestPasswordReset(
  _prev: ForgotResult | null,
  formData: FormData
): Promise<ForgotResult> {
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const { success: allowed } = authLimiter.check(ip);
  if (!allowed) {
    return { success: false, message: "Too many attempts. Please try again in a minute." };
  }

  const email = sanitizeString(formData.get("email") as string | null, MAX_EMAIL)?.toLowerCase();
  if (!email || !isValidEmail(email)) {
    return { success: false, message: "Please enter a valid email address." };
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    // Always return the same message whether or not the account exists,
    // so this form can't be used to probe for registered emails.
    if (user) {
      const token = await createAuthToken(user.id, "password_reset");
      await sendPasswordResetEmail({
        userEmail: user.email,
        userName: user.name,
        resetUrl: `${getBaseUrl()}/reset-password?token=${token}`,
      });
    }

    return { success: true, message: GENERIC_SUCCESS };
  } catch (error) {
    console.error("Password reset request error:", error);
    return { success: false, message: "Something went wrong. Please try again later." };
  }
}
