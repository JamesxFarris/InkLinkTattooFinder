import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
