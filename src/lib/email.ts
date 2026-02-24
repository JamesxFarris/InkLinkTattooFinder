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

export async function sendClaimApprovedEmail({
  userEmail,
  userName,
  listingName,
  listingId,
  editUrl,
}: {
  userEmail: string;
  userName: string;
  listingName: string;
  listingId: number;
  editUrl: string;
}) {
  if (!resend) {
    console.log(`[email skip] Claim approved email for ${listingName} — Resend not configured`);
    return { success: false as const, error: "Email service not configured" };
  }

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f9fafb;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:8px;overflow:hidden;margin-top:20px;margin-bottom:20px;">
    <tr>
      <td style="background:#1a1a2e;padding:24px 32px;">
        <h1 style="margin:0;color:#ffffff;font-size:22px;">InkLink Tattoo Finder</h1>
      </td>
    </tr>
    <tr>
      <td style="padding:32px;">
        <h2 style="margin:0 0 16px;color:#1a1a2e;font-size:20px;">Your claim has been approved!</h2>
        <p style="color:#374151;font-size:16px;line-height:1.6;margin:0 0 16px;">
          Hey ${userName}, great news — you now own the listing for <strong>${listingName}</strong> on InkLink Tattoo Finder.
        </p>
        <p style="color:#374151;font-size:16px;line-height:1.6;margin:0 0 8px;">
          <strong>Here's what to do next:</strong>
        </p>
        <ul style="color:#374151;font-size:16px;line-height:1.8;margin:0 0 24px;padding-left:20px;">
          <li>Add photos of your best work</li>
          <li>Update your hours and contact info</li>
          <li>Write a description that shows off what makes your shop unique</li>
          <li>Add your artists and their Instagram handles</li>
        </ul>
        <table cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
          <tr>
            <td style="background:#14b8a6;border-radius:6px;">
              <a href="${editUrl}" style="display:inline-block;padding:14px 28px;color:#ffffff;text-decoration:none;font-size:16px;font-weight:600;">
                Edit Your Listing
              </a>
            </td>
          </tr>
        </table>
        <p style="color:#6b7280;font-size:14px;line-height:1.5;margin:0;">
          A complete profile with photos and hours gets significantly more views. Questions? Just reply to this email.
        </p>
      </td>
    </tr>
    <tr>
      <td style="background:#f3f4f6;padding:16px 32px;text-align:center;">
        <p style="color:#9ca3af;font-size:12px;margin:0;">
          <a href="https://inklinktattoofinder.com" style="color:#9ca3af;">inklinktattoofinder.com</a>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const { error } = await resend.emails.send({
    from: "InkLink Tattoo Finder <hello@inklinktattoofinder.com>",
    to: userEmail,
    subject: `Your claim for ${listingName} has been approved!`,
    html,
  });

  if (error) {
    console.error(`[email error] Claim approved email for ${listingName}: ${error.message}`);
    return { success: false as const, error: error.message };
  }

  return { success: true as const };
}

export async function sendDmcaEmail({
  name,
  email,
  businessName,
  listingId,
  requestType,
  details,
}: {
  name: string;
  email: string;
  businessName: string;
  listingId: string | null;
  requestType: string;
  details: string;
}) {
  if (!resend) {
    return { success: false as const, error: "Email service not configured" };
  }

  const { error } = await resend.emails.send({
    from: "InkLink DMCA <onboarding@resend.dev>",
    to: "inklinktattoofinder@gmail.com",
    replyTo: email,
    subject: `[InkLink DMCA] ${businessName}`,
    text: `Name: ${name}\nEmail: ${email}\nBusiness Name: ${businessName}\nListing ID: ${listingId ?? "N/A"}\nRequest Type: ${requestType}\n\nDetails:\n${details}\n\nSworn statement: Confirmed`,
  });

  if (error) {
    return { success: false as const, error: error.message };
  }

  return { success: true as const };
}
