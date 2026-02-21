"use server";

import { isEmailConfigured, sendContactEmail } from "@/lib/email";

type ContactResult = { success: boolean; message: string };

export async function submitContact(
  _prev: ContactResult | null,
  formData: FormData
): Promise<ContactResult> {
  const name = (formData.get("name") as string | null)?.trim();
  const email = (formData.get("email") as string | null)?.trim();
  const subject = (formData.get("subject") as string | null)?.trim();
  const message = (formData.get("message") as string | null)?.trim();

  if (!name || !email || !subject || !message) {
    return { success: false, message: "Please fill in all required fields." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
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
