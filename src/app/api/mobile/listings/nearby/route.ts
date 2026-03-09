import { NextRequest, NextResponse } from "next/server";
import { searchListingsNearby } from "@/lib/queries";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const lat = parseFloat(searchParams.get("lat") || "");
  const lng = parseFloat(searchParams.get("lng") || "");

  if (isNaN(lat) || isNaN(lng)) {
    return NextResponse.json({ error: "lat and lng are required" }, { status: 400 });
  }

  const radiusMiles = Math.min(
    100,
    Math.max(1, parseFloat(searchParams.get("radius") || "25"))
  );
  const style = searchParams.get("style") || undefined;
  const walkIns = searchParams.get("walkIns") || undefined;
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));

  const result = await searchListingsNearby({
    latitude: lat,
    longitude: lng,
    radiusMiles,
    categorySlug: style,
    walkIns,
    page,
    perPage: 20,
  });

  const listings = result.listings.map((l) => {
    const isClaimed = l.ownerId !== null;
    return {
      id: l.id,
      name: l.name,
      slug: l.slug,
      address: l.address,
      phone: l.phone,
      website: l.website,
      instagramUrl: l.instagramUrl,
      googleRating: l.googleRating,
      googleReviewCount: l.googleReviewCount,
      latitude: l.latitude,
      longitude: l.longitude,
      acceptsWalkIns: l.acceptsWalkIns,
      priceRange: l.priceRange,
      featured: l.featured,
      isClaimed,
      photos: isClaimed ? (l.photos as string[] | null) : null,
      distanceMiles: result.distances[l.id] ?? null,
      city: l.city.name,
      citySlug: l.city.slug,
      state: l.city.state.abbreviation,
      stateSlug: l.city.state.slug,
      categories: l.categories.map((c) => ({
        name: c.category.name,
        slug: c.category.slug,
      })),
    };
  });

  return NextResponse.json({
    listings,
    total: result.total,
    page,
    totalPages: result.totalPages,
    nearestCities: result.nearestCities,
  });
}
