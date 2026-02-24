import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { searchLimiter } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ matches: [] }, { status: 401 });
  }

  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const { success: allowed } = searchLimiter.check(ip);
  if (!allowed) {
    return NextResponse.json({ matches: [] }, { status: 429 });
  }

  const name = request.nextUrl.searchParams.get("name")?.trim().slice(0, 200);
  const stateId = request.nextUrl.searchParams.get("stateId");
  const cityName = request.nextUrl.searchParams.get("cityName")?.trim();

  if (!name || name.length < 3 || !stateId) {
    return NextResponse.json({ matches: [] });
  }

  const parsedStateId = parseInt(stateId, 10);
  if (isNaN(parsedStateId)) {
    return NextResponse.json({ matches: [] });
  }

  // Find city in this state (if provided)
  let cityId: number | undefined;
  if (cityName) {
    const city = await prisma.city.findFirst({
      where: {
        stateId: parsedStateId,
        name: { equals: cityName, mode: "insensitive" },
      },
      select: { id: true },
    });
    if (city) cityId = city.id;
  }

  // Search for similar listings
  const matches = await prisma.listing.findMany({
    where: {
      name: { contains: name, mode: "insensitive" },
      stateId: parsedStateId,
      ...(cityId ? { cityId } : {}),
    },
    select: {
      id: true,
      name: true,
      slug: true,
      ownerId: true,
      city: { select: { name: true, slug: true } },
      state: { select: { slug: true, abbreviation: true } },
    },
    take: 5,
  });

  return NextResponse.json({
    matches: matches.map((m) => ({
      id: m.id,
      name: m.name,
      slug: m.slug,
      city: m.city.name,
      citySlug: m.city.slug,
      stateSlug: m.state.slug,
      stateAbbr: m.state.abbreviation,
      ownerId: m.ownerId,
      url: `/${m.state.slug}/${m.city.slug}/${m.slug}`,
    })),
  });
}
