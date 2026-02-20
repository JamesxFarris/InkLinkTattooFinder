import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await context.params;
  const claimId = parseInt(id);

  try {
    const { status, adminNotes } = await request.json();

    if (!status || !["approved", "denied"].includes(status)) {
      return NextResponse.json(
        { error: "Status must be 'approved' or 'denied'" },
        { status: 400 }
      );
    }

    const claim = await prisma.claim.findUnique({
      where: { id: claimId },
    });
    if (!claim) {
      return NextResponse.json(
        { error: "Claim not found" },
        { status: 404 }
      );
    }

    if (status === "approved") {
      // Approve: update claim + set listing owner
      const [updatedClaim] = await prisma.$transaction([
        prisma.claim.update({
          where: { id: claimId },
          data: {
            status: "approved",
            adminNotes: adminNotes || null,
            reviewedAt: new Date(),
          },
        }),
        prisma.listing.update({
          where: { id: claim.listingId },
          data: { ownerId: claim.userId },
        }),
      ]);
      return NextResponse.json(updatedClaim);
    } else {
      // Deny
      const updatedClaim = await prisma.claim.update({
        where: { id: claimId },
        data: {
          status: "denied",
          adminNotes: adminNotes || null,
          reviewedAt: new Date(),
        },
      });
      return NextResponse.json(updatedClaim);
    }
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const claimId = parseInt(id);

  const claim = await prisma.claim.findUnique({
    where: { id: claimId },
  });

  if (!claim) {
    return NextResponse.json({ error: "Claim not found" }, { status: 404 });
  }

  if (claim.userId !== parseInt(session.user.id)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (claim.status !== "pending") {
    return NextResponse.json(
      { error: "Only pending claims can be withdrawn" },
      { status: 400 }
    );
  }

  await prisma.claim.delete({ where: { id: claimId } });

  return NextResponse.json({ success: true });
}
