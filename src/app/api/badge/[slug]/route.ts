import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const listing = await prisma.listing.findUnique({
    where: { slug },
    select: {
      name: true,
      googleRating: true,
      ownerId: true,
    },
  });

  if (!listing || !listing.ownerId) {
    return new NextResponse("Not found", { status: 404 });
  }

  const ratingText = listing.googleRating
    ? `${listing.googleRating} ★`
    : "";

  const badgeWidth = 240;
  const badgeHeight = ratingText ? 52 : 40;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${badgeWidth}" height="${badgeHeight}" viewBox="0 0 ${badgeWidth} ${badgeHeight}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#0d9488"/>
      <stop offset="100%" stop-color="#14b8a6"/>
    </linearGradient>
  </defs>
  <rect width="${badgeWidth}" height="${badgeHeight}" rx="8" fill="url(#bg)"/>
  <rect x="1" y="1" width="${badgeWidth - 2}" height="${badgeHeight - 2}" rx="7" fill="#1c1917" fill-opacity="0.85"/>
  <text x="12" y="${ratingText ? 22 : 25}" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="600" fill="#14b8a6">
    Find us on InkLink
  </text>
  <text x="${badgeWidth - 12}" y="${ratingText ? 22 : 25}" font-family="system-ui, -apple-system, sans-serif" font-size="10" fill="#a8a29e" text-anchor="end">
    Tattoo Finder
  </text>${ratingText ? `
  <text x="12" y="40" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#fbbf24">
    ${ratingText}
  </text>
  <text x="55" y="40" font-family="system-ui, -apple-system, sans-serif" font-size="10" fill="#78716c">
    Google Rating
  </text>` : ""}
</svg>`;

  return new NextResponse(svg, {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
