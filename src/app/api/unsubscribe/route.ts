import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const token = searchParams.get("token");

  if (!id || !token) {
    return new NextResponse("Missing parameters.", { status: 400 });
  }

  // Verify simple token
  const expected = Buffer.from(id + ":unsub").toString("base64");
  if (token !== expected) {
    return new NextResponse("Invalid unsubscribe link.", { status: 400 });
  }

  const listingId = parseInt(id, 10);
  if (isNaN(listingId)) {
    return new NextResponse("Invalid listing ID.", { status: 400 });
  }

  // Clear the email so they won't be emailed again
  try {
    await prisma.listing.update({
      where: { id: listingId },
      data: { email: null },
    });
  } catch {
    // Listing may not exist — that's fine
  }

  // Return a simple HTML confirmation page
  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Unsubscribed</title></head>
<body style="margin:0;padding:40px 20px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f9fafb;text-align:center;">
  <div style="max-width:480px;margin:0 auto;background:#fff;border-radius:8px;padding:40px;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
    <h1 style="font-size:24px;color:#1a1a2e;margin:0 0 16px;">Unsubscribed</h1>
    <p style="color:#374151;font-size:16px;line-height:1.6;margin:0 0 24px;">
      You have been unsubscribed and will not receive further emails from InkLink Tattoo Finder.
    </p>
    <a href="https://inklinktattoofinder.com" style="color:#6366f1;text-decoration:underline;font-size:14px;">Visit InkLink Tattoo Finder</a>
  </div>
</body>
</html>`;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html" },
  });
}

export async function POST(request: NextRequest) {
  // Support one-click unsubscribe (List-Unsubscribe-Post)
  return GET(request);
}
