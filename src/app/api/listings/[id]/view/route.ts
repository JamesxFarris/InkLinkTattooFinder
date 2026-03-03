import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";

// 10 views per listing per IP per 5 minutes
const viewLimiter = rateLimit("view", 10, 5 * 60_000);

export async function POST(
  _req: NextRequest,
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
  const { success } = viewLimiter.check(`${ip}:${listingId}`);
  if (!success) {
    return NextResponse.json({ ok: true });
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
