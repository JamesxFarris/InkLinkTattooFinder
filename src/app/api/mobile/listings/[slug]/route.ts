import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const listing = await prisma.listing.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      type: true,
      address: true,
      phone: true,
      email: true,
      website: true,
      instagramUrl: true,
      facebookUrl: true,
      googleRating: true,
      googleReviewCount: true,
      latitude: true,
      longitude: true,
      zipCode: true,
      styles: true,
      acceptsWalkIns: true,
      minimumAge: true,
      piercingServices: true,
      tattooRemoval: true,
      priceRange: true,
      hourlyRateMin: true,
      hourlyRateMax: true,
      amenities: true,
      hours: true,
      photos: true,
      artists: true,
      services: true,
      portfolioUrl: true,
      featured: true,
      viewCount: true,
      ownerId: true,
      status: true,
      city: {
        select: {
          name: true,
          slug: true,
          latitude: true,
          longitude: true,
          state: { select: { name: true, abbreviation: true, slug: true } },
        },
      },
      categories: {
        select: { category: { select: { name: true, slug: true } } },
      },
      createdAt: true,
    },
  });

  if (!listing || listing.status !== "active") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const isClaimed = listing.ownerId !== null;

  // Increment view count (fire and forget)
  prisma.listing
    .update({ where: { slug }, data: { viewCount: { increment: 1 } } })
    .catch(() => {});

  return NextResponse.json({
    listing: {
      id: listing.id,
      name: listing.name,
      slug: listing.slug,
      description: listing.description,
      type: listing.type,
      address: listing.address,
      phone: listing.phone,
      email: listing.email,
      website: listing.website,
      instagramUrl: listing.instagramUrl,
      facebookUrl: listing.facebookUrl,
      googleRating: listing.googleRating,
      googleReviewCount: listing.googleReviewCount,
      latitude: listing.latitude,
      longitude: listing.longitude,
      zipCode: listing.zipCode,
      styles: listing.styles,
      acceptsWalkIns: listing.acceptsWalkIns,
      minimumAge: listing.minimumAge,
      piercingServices: listing.piercingServices,
      tattooRemoval: listing.tattooRemoval,
      priceRange: listing.priceRange,
      hourlyRateMin: listing.hourlyRateMin,
      hourlyRateMax: listing.hourlyRateMax,
      amenities: listing.amenities,
      hours: listing.hours,
      artists: listing.artists,
      services: listing.services,
      portfolioUrl: listing.portfolioUrl,
      featured: listing.featured,
      isClaimed,
      // Only expose photos if the listing has been claimed by its owner
      photos: isClaimed ? (listing.photos as string[] | null) : null,
      city: listing.city.name,
      citySlug: listing.city.slug,
      state: listing.city.state.abbreviation,
      stateName: listing.city.state.name,
      stateSlug: listing.city.state.slug,
      categories: listing.categories.map((c) => ({
        name: c.category.name,
        slug: c.category.slug,
      })),
    },
  });
}
