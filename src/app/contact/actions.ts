"use server";

import { headers } from "next/headers";
import { isEmailConfigured, sendContactEmail } from "@/lib/email";
import { formLimiter } from "@/lib/rate-limit";
import { sanitizeString, isValidEmail, MAX_NAME, MAX_EMAIL, MAX_SUBJECT, MAX_MESSAGE } from "@/lib/validation";

type ContactResult = { success: boolean; message: string };

export async function submitContact(
  _prev: ContactResult | null,
  formData: FormData
): Promise<ContactResult> {
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const { success: allowed } = formLimiter.check(ip);
  if (!allowed) {
    return { success: false, message: "Too many submissions. Please try again in a minute." };
  }

  const name = sanitizeString(formData.get("name") as string | null, MAX_NAME);
  const email = sanitizeString(formData.get("email") as string | null, MAX_EMAIL);
  const subject = sanitizeString(formData.get("subject") as string | null, MAX_SUBJECT);
  const message = sanitizeString(formData.get("message") as string | null, MAX_MESSAGE);

  if (!name || !email || !subject || !message) {
    return { success: false, message: "Please fill in all required fields." };
  }

  if (!isValidEmail(email)) {
    return { success: false, message: "Please enter a valid email address." };
  }

  if (!isEmailConfigured()) {
    console.log("[Contact Form] Email not configured. Message:", {
      name,
      email,
      subject,
      message,
    });
    return {
      success: true,
      message:
        "Thank you for your message! We've received it and will get back to you soon. (Note: email delivery is not yet configured — your message was logged.)",
    };
  }

  const result = await sendContactEmail({ name, email, subject, message });

  if (!result.success) {
    return {
      success: false,
      message: "Failed to send your message. Please try again or email us directly.",
    };
  }

  return {
    success: true,
    message:
      "Thank you for your message! We've received it and will get back to you soon.",
  };
}
