"use server";

import { getListingsByCategoryNational } from "@/lib/queries";
import type { ListingWithRelations } from "@/types";

export async function loadMoreListings(
  categoryId: number,
  page: number
): Promise<{ listings: ListingWithRelations[]; hasMore: boolean }> {
  const { listings, totalPages } = await getListingsByCategoryNational(
    categoryId,
    page
  );
  return {
    listings: JSON.parse(JSON.stringify(listings)),
    hasMore: page < totalPages,
  };
}
