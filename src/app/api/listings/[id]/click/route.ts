import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const VALID_TYPES = ["phone", "website", "instagram", "facebook", "cta"] as const;
type ClickType = (typeof VALID_TYPES)[number];

const FIELD_MAP: Record<ClickType, string> = {
  phone: "phoneClicks",
  website: "websiteClicks",
  instagram: "instagramClicks",
  facebook: "facebookClicks",
  cta: "ctaClicks",
};

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const listingId = parseInt(id, 10);
  if (isNaN(listingId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
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
