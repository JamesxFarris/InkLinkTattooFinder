import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const PER_PAGE = 20;

function formatListing(l: {
  id: number;
  name: string;
  slug: string;
  address: string | null;
  phone: string | null;
  website: string | null;
  instagramUrl: string | null;
  facebookUrl: string | null;
  googleRating: number | null;
  googleReviewCount: number | null;
  latitude: number | null;
  longitude: number | null;
  styles: unknown;
  acceptsWalkIns: boolean;
  priceRange: string | null;
  featured: boolean;
  ownerId: number | null;
  photos: unknown;
  city: { name: string; slug: string; state: { name: string; abbreviation: string; slug: string } };
  categories: { category: { name: string; slug: string } }[];
}) {
  const isClaimed = l.ownerId !== null;
  return {
    id: l.id,
    name: l.name,
    slug: l.slug,
    address: l.address,
    phone: l.phone,
    website: l.website,
    instagramUrl: l.instagramUrl,
    facebookUrl: l.facebookUrl,
    googleRating: l.googleRating,
    googleReviewCount: l.googleReviewCount,
    latitude: l.latitude,
    longitude: l.longitude,
    styles: l.styles,
    acceptsWalkIns: l.acceptsWalkIns,
    priceRange: l.priceRange,
    featured: l.featured,
    isClaimed,
    // Only expose photos for claimed listings
    photos: isClaimed ? (l.photos as string[] | null) : null,
    city: l.city.name,
    citySlug: l.city.slug,
    state: l.city.state.abbreviation,
    stateName: l.city.state.name,
    stateSlug: l.city.state.slug,
    categories: l.categories.map((c) => ({ name: c.category.name, slug: c.category.slug })),
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const q = searchParams.get("q")?.trim().slice(0, 100);
  const city = searchParams.get("city")?.trim();
  const state = searchParams.get("state")?.trim();
  const style = searchParams.get("style")?.trim();
  const walkIns = searchParams.get("walkIns") === "true";
  const claimedOnly = searchParams.get("claimedOnly") === "true";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));

  const where: Record<string, unknown> = { status: "active" };

  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { city: { name: { contains: q, mode: "insensitive" } } },
      { state: { name: { contains: q, mode: "insensitive" } } },
    ];
  }

  if (city) {
    where.city = { slug: city };
  }

  if (state) {
    where.state = { slug: state };
  }

  if (style) {
    const category = await prisma.category.findUnique({ where: { slug: style } });
    if (category) {
      where.categories = { some: { categoryId: category.id } };
    }
  }

  if (walkIns) {
    where.acceptsWalkIns = true;
  }

  if (claimedOnly) {
    where.ownerId = { not: null };
  }

  const [listings, total] = await Promise.all([
    prisma.listing.findMany({
      where,
      select: {
        id: true,
        name: true,
        slug: true,
        address: true,
        phone: true,
        website: true,
        instagramUrl: true,
        facebookUrl: true,
        googleRating: true,
        googleReviewCount: true,
        latitude: true,
        longitude: true,
        styles: true,
        acceptsWalkIns: true,
        priceRange: true,
        featured: true,
        ownerId: true,
        photos: true,
        city: {
          select: {
            name: true,
            slug: true,
            state: { select: { name: true, abbreviation: true, slug: true } },
          },
        },
        categories: {
          select: { category: { select: { name: true, slug: true } } },
        },
      },
      orderBy: [{ featured: "desc" }, { googleRating: "desc" }, { id: "asc" }],
      skip: (page - 1) * PER_PAGE,
      take: PER_PAGE,
    }),
    prisma.listing.count({ where }),
  ]);

  return NextResponse.json({
    listings: listings.map(formatListing),
    total,
    page,
    totalPages: Math.ceil(total / PER_PAGE),
    perPage: PER_PAGE,
  });
}
