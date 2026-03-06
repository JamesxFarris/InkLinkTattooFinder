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
  listingSlug,
  listingId,
  editUrl,
}: {
  userEmail: string;
  userName: string;
  listingName: string;
  listingSlug: string;
  listingId: number;
  editUrl: string;
}) {
  if (!resend) {
    console.log(`[email skip] Claim approved email for ${listingName} — Resend not configured`);
    return { success: false as const, error: "Email service not configured" };
  }

  const badgeUrl = `https://inklinktattoofinder.com/api/badge/${listingSlug}`;
  const embedCode = `&lt;a href=&quot;https://inklinktattoofinder.com&quot; target=&quot;_blank&quot; rel=&quot;noopener&quot;&gt;&lt;img src=&quot;${badgeUrl}&quot; alt=&quot;Find ${listingName} on InkLink Tattoo Finder&quot; width=&quot;240&quot; height=&quot;52&quot; /&gt;&lt;/a&gt;`;

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

        <!-- Badge Section -->
        <div style="margin:24px 0 0;padding:20px;background:#f0fdfa;border:1px solid #ccfbf1;border-radius:8px;">
          <p style="color:#0f766e;font-size:14px;font-weight:600;margin:0 0 8px;">
            Show off your listing on your website
          </p>
          <p style="color:#374151;font-size:14px;line-height:1.5;margin:0 0 12px;">
            Add this badge to your website to display your Google rating and link customers to your InkLink profile.
          </p>
          <p style="margin:0 0 12px;">
            <img src="${badgeUrl}" alt="InkLink badge" width="240" height="52" style="border-radius:6px;" />
          </p>
          <p style="color:#6b7280;font-size:12px;margin:0 0 4px;">Copy and paste this code into your website:</p>
          <div style="background:#1c1917;border-radius:6px;padding:12px;overflow-x:auto;">
            <code style="color:#a8a29e;font-size:12px;line-height:1.4;word-break:break-all;">${embedCode}</code>
          </div>
          <p style="color:#6b7280;font-size:12px;margin:8px 0 0;">
            You can also find this in your <a href="https://inklinktattoofinder.com/dashboard" style="color:#14b8a6;text-decoration:underline;">dashboard</a> anytime.
          </p>
        </div>

        <p style="color:#6b7280;font-size:14px;line-height:1.5;margin:24px 0 0;">
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

export async function sendPasswordResetEmail({
  userEmail,
  userName,
  resetUrl,
}: {
  userEmail: string;
  userName: string;
  resetUrl: string;
}) {
  if (!resend) {
    console.log(`[email skip] Password reset email for ${userEmail} — Resend not configured`);
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
        <h2 style="margin:0 0 16px;color:#1a1a2e;font-size:20px;">Reset Your Password</h2>
        <p style="color:#374151;font-size:16px;line-height:1.6;margin:0 0 16px;">
          Hey ${userName}, we received a request to reset your password. Click the button below to choose a new one.
        </p>
        <table cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
          <tr>
            <td style="background:#14b8a6;border-radius:6px;">
              <a href="${resetUrl}" style="display:inline-block;padding:14px 28px;color:#ffffff;text-decoration:none;font-size:16px;font-weight:600;">
                Reset Password
              </a>
            </td>
          </tr>
        </table>
        <p style="color:#6b7280;font-size:14px;line-height:1.5;margin:0 0 8px;">
          This link expires in 1 hour. If you didn't request this, you can safely ignore this email.
        </p>
        <p style="color:#9ca3af;font-size:12px;line-height:1.5;margin:16px 0 0;">
          If the button doesn't work, copy and paste this URL into your browser:<br/>
          <a href="${resetUrl}" style="color:#14b8a6;word-break:break-all;">${resetUrl}</a>
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
    subject: "Reset your InkLink password",
    html,
  });

  if (error) {
    console.error(`[email error] Password reset email for ${userEmail}: ${error.message}`);
    return { success: false as const, error: error.message };
  }

  return { success: true as const };
}

const ADMIN_EMAIL = "inklinktattoofinder@gmail.com";

export async function notifyAdmin(subject: string, body: string) {
  if (!resend) return;
  resend.emails.send({
    from: "InkLink Alerts <hello@inklinktattoofinder.com>",
    to: ADMIN_EMAIL,
    subject: `[InkLink] ${subject}`,
    text: body,
  }).catch((err) => console.error("[email error] Admin notification:", err));
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
