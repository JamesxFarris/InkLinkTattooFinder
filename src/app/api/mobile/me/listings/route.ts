import { NextRequest, NextResponse } from "next/server";
import { getMobileUser } from "@/lib/mobile-jwt";
import { getOwnedListings } from "@/lib/queries";

export async function GET(request: NextRequest) {
  const tokenUser = await getMobileUser(request);
  if (!tokenUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const listings = await getOwnedListings(parseInt(tokenUser.sub, 10));

  return NextResponse.json({
    listings: listings.map((l) => ({
      id: l.id,
      name: l.name,
      slug: l.slug,
      address: l.address,
      phone: l.phone,
      googleRating: l.googleRating,
      photos: l.photos as string[] | null,
      isClaimed: true,
      city: l.city.name,
      state: l.city.state.abbreviation,
      categories: l.categories.map((c) => ({
        name: c.category.name,
        slug: c.category.slug,
      })),
    })),
  });
}
