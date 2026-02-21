import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { listingId, phone, message } = await request.json();

    if (!listingId) {
      return NextResponse.json(
        { error: "listingId is required" },
        { status: 400 }
      );
    }

    if (!phone || typeof phone !== "string" || !phone.trim()) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
    });
    if (!listing) {
      return NextResponse.json(
        { error: "Listing not found" },
        { status: 404 }
      );
    }

    const existing = await prisma.claim.findUnique({
      where: {
        userId_listingId: {
          userId: parseInt(session.user.id),
          listingId,
        },
      },
    });
    if (existing) {
      return NextResponse.json(
        { error: "You have already submitted a claim for this listing" },
        { status: 409 }
      );
    }

    const claim = await prisma.claim.create({
      data: {
        userId: parseInt(session.user.id),
        listingId,
        phone: phone.trim(),
        message: message || null,
      },
    });

    return NextResponse.json(claim, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
