import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";
import { prisma } from "@/lib/db";

export function makeUnsubscribeToken(listingId: number): string {
  const secret = process.env.AUTH_SECRET ?? "";
  return createHmac("sha256", secret).update(String(listingId)).digest("hex");
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = parseInt(searchParams.get("id") ?? "", 10);
  const token = searchParams.get("token") ?? "";

  if (isNaN(id) || !token || token !== makeUnsubscribeToken(id)) {
    return new NextResponse("Invalid unsubscribe link.", { status: 400 });
  }

  await prisma.listing.update({
    where: { id },
    data: { outreachOptOut: true },
  }).catch(() => {
    // Listing may not exist — that's fine
  });

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Unsubscribed</title></head>
<body style="margin:0;padding:40px 20px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f9fafb;text-align:center;">
  <div style="max-width:480px;margin:0 auto;background:#fff;border-radius:8px;padding:40px;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
    <h1 style="font-size:24px;color:#1a1a2e;margin:0 0 16px;">Unsubscribed</h1>
    <p style="color:#374151;font-size:16px;line-height:1.6;margin:0 0 24px;">
      You won't receive outreach emails from InkLink for this listing again.
    </p>
    <a href="https://inklinktattoofinder.com" style="color:#14b8a6;text-decoration:underline;font-size:14px;">Visit InkLink Tattoo Finder</a>
  </div>
</body>
</html>`;

  return new NextResponse(html, { headers: { "Content-Type": "text/html" } });
}

// Support one-click unsubscribe (RFC 8058 List-Unsubscribe-Post)
export async function POST(request: NextRequest) {
  return GET(request);
}
