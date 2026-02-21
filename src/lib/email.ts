import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export function isEmailConfigured() {
  return resend !== null;
}

export async function sendContactEmail({
  name,
  email,
  subject,
  message,
}: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  if (!resend) {
    return { success: false as const, error: "Email service not configured" };
  }

  const { error } = await resend.emails.send({
    from: "InkLink Contact <onboarding@resend.dev>",
    to: "inklinktattoofinder@gmail.com",
    replyTo: email,
    subject: `[InkLink Contact] ${subject}`,
    text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${message}`,
  });

  if (error) {
    return { success: false as const, error: error.message };
  }

  return { success: true as const };
}
