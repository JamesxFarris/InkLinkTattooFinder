import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim();

  if (!q || q.length < 2) {
    return NextResponse.json({ listings: [] });
  }

  const listings = await prisma.listing.findMany({
    where: {
      status: "active",
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { city: { name: { contains: q, mode: "insensitive" } } },
        { state: { name: { contains: q, mode: "insensitive" } } },
      ],
    },
    select: {
      id: true,
      name: true,
      slug: true,
      ownerId: true,
      city: {
        select: {
          name: true,
          state: { select: { abbreviation: true } },
        },
      },
    },
    orderBy: { name: "asc" },
    take: 20,
  });

  return NextResponse.json({
    listings: listings.map((l) => ({
      id: l.id,
      name: l.name,
      slug: l.slug,
      city: l.city.name,
      state: l.city.state.abbreviation,
      ownerId: l.ownerId,
    })),
  });
}
