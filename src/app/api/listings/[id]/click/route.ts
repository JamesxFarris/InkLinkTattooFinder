import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";

const VALID_TYPES = ["phone", "website", "instagram", "facebook", "cta"] as const;
type ClickType = (typeof VALID_TYPES)[number];

const FIELD_MAP: Record<ClickType, string> = {
  phone: "phoneClicks",
  website: "websiteClicks",
  instagram: "instagramClicks",
  facebook: "facebookClicks",
  cta: "ctaClicks",
};

// 5 clicks per listing per IP per 5 minutes
const clickLimiter = rateLimit("click", 5, 5 * 60_000);

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const listingId = parseInt(id, 10);
  if (isNaN(listingId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const { success } = clickLimiter.check(`${ip}:${listingId}`);
  if (!success) {
    return NextResponse.json({ ok: true });
  }

  let type: ClickType = "website";
  try {
    const body = await req.json();
    if (VALID_TYPES.includes(body.type)) {
      type = body.type;
    }
  } catch {
    // default to website
  }

  const field = FIELD_MAP[type];

  // Fire-and-forget increment
  prisma.listing
    .update({
      where: { id: listingId },
      data: { [field]: { increment: 1 } },
    })
    .catch(() => {});

  return NextResponse.json({ ok: true });
}
