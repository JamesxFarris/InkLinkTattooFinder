import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { trackLimiter } from "@/lib/rate-limit";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!trackLimiter.check(ip).success) {
    return NextResponse.json({ ok: true }); // silently drop, don't error the client
  }

  const { id } = await params;
  const listingId = parseInt(id, 10);
  if (isNaN(listingId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  // Fire-and-forget increment
  prisma.listing
    .update({
      where: { id: listingId },
      data: { viewCount: { increment: 1 } },
    })
    .catch(() => {});

  return NextResponse.json({ ok: true });
}
