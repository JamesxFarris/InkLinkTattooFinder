import { prisma } from "./db";
import { ITEMS_PER_PAGE } from "./utils";
import { haversineDistance } from "./geo";
import type { ListingStatus, ListingType, PriceRange } from "@prisma/client";

// ── States ──────────────────────────────────────────────

export async function getAllStates() {
  return prisma.state.findMany({
    include: {
      _count: { select: { cities: true, listings: true } },
    },
    orderBy: { name: "asc" },
  });
}

export async function getStateBySlug(slug: string) {
  return prisma.state.findUnique({
    where: { slug },
    include: {
      _count: { select: { cities: true, listings: true } },
    },
  });
}

// ── Cities ──────────────────────────────────────────────

export async function getCitiesByState(stateId: number) {
  return prisma.city.findMany({
    where: { stateId },
    include: {
      state: true,
      _count: {
        select: {
          listings: { where: { status: "active" } },
        },
      },
    },
    orderBy: { population: "desc" },
  });
}

export async function getCityBySlug(citySlug: string, stateSlug: string) {
  const state = await prisma.state.findUnique({ where: { slug: stateSlug } });
  if (!state) return null;
  return prisma.city.findFirst({
    where: { slug: citySlug, stateId: state.id },
    include: {
      state: true,
      _count: {
        select: {
          listings: { where: { status: "active" } },
        },
      },
    },
  });
}

export async function getTopCities(limit = 20) {
  return prisma.city.findMany({
    include: {
      state: true,
      _count: {
        select: {
          listings: { where: { status: "active" } },
        },
      },
    },
    orderBy: { population: "desc" },
    take: limit,
  });
}

// ── Categories ──────────────────────────────────────────

export async function getAllCategories() {
  return prisma.category.findMany({
    include: {
      _count: { select: { listings: true } },
    },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({
    where: { slug },
    include: {
      _count: { select: { listings: true } },
    },
  });
}

export async function getCategoriesForCity(cityId: number) {
  return prisma.category.findMany({
    where: {
      listings: {
        some: {
          listing: { cityId, status: "active" },
        },
      },
    },
    include: {
      _count: {
        select: {
          listings: {
            where: {
              listing: { cityId, status: "active" },
            },
          },
        },
      },
    },
    orderBy: { sortOrder: "asc" },
  });
}

// ── Listings ────────────────────────────────────────────

export async function getListingBySlug(slug: string) {
  return prisma.listing.findUnique({
    where: { slug },
    include: {
      city: { include: { state: true } },
      state: true,
      categories: { include: { category: true } },
    },
  });
}

export async function getListingsByCity(
  cityId: number,
  page = 1,
  perPage = ITEMS_PER_PAGE
) {
  const [listings, total] = await Promise.all([
    prisma.listing.findMany({
      where: { cityId, status: "active" },
      include: {
        city: { include: { state: true } },
        state: true,
        categories: { include: { category: true } },
      },
      orderBy: [{ featured: "desc" }, { googleRating: "desc" }],
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.listing.count({ where: { cityId, status: "active" } }),
  ]);
  return { listings, total, totalPages: Math.ceil(total / perPage) };
}

export async function getListingsByCityAndCategory(
  cityId: number,
  categoryId: number,
  page = 1,
  perPage = ITEMS_PER_PAGE
) {
  const where = {
    cityId,
    status: "active" as ListingStatus,
    categories: { some: { categoryId } },
  };
  const [listings, total] = await Promise.all([
    prisma.listing.findMany({
      where,
      include: {
        city: { include: { state: true } },
        state: true,
        categories: { include: { category: true } },
      },
      orderBy: [{ featured: "desc" }, { googleRating: "desc" }],
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.listing.count({ where }),
  ]);
  return { listings, total, totalPages: Math.ceil(total / perPage) };
}

export async function getFeaturedListings(limit = 6) {
  return prisma.listing.findMany({
    where: { status: "active", featured: true },
    include: {
      city: { include: { state: true } },
      state: true,
      categories: { include: { category: true } },
    },
    orderBy: { googleRating: "desc" },
    take: limit,
  });
}

export async function getRecentListings(limit = 6) {
  return prisma.listing.findMany({
    where: { status: "active" },
    include: {
      city: { include: { state: true } },
      state: true,
      categories: { include: { category: true } },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function searchListings(params: {
  q?: string;
  citySlug?: string;
  categorySlug?: string;
  price?: string;
  walkIns?: string;
  sort?: string;
  page?: number;
  perPage?: number;
}) {
  const { q, citySlug, categorySlug, price, walkIns, sort, page = 1, perPage = ITEMS_PER_PAGE } = params;

  const where: Record<string, unknown> = { status: "active" as ListingStatus };

  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
      { city: { name: { contains: q, mode: "insensitive" } } },
      { state: { name: { contains: q, mode: "insensitive" } } },
      { zipCode: { contains: q, mode: "insensitive" } },
    ];
  }

  if (citySlug) {
    const city = await prisma.city.findFirst({ where: { slug: citySlug } });
    if (city) where.cityId = city.id;
  }

  if (categorySlug) {
    const category = await prisma.category.findUnique({ where: { slug: categorySlug } });
    if (category) {
      where.categories = { some: { categoryId: category.id } };
    }
  }

  if (price) {
    where.priceRange = price as PriceRange;
  }

  if (walkIns === "true") {
    where.acceptsWalkIns = true;
  }

  let orderBy: Record<string, string>[] = [{ featured: "desc" }, { googleRating: "desc" }];
  if (sort === "name") orderBy = [{ name: "asc" }];
  if (sort === "rating") orderBy = [{ googleRating: "desc" }];
  if (sort === "newest") orderBy = [{ createdAt: "desc" }];

  const [listings, total] = await Promise.all([
    prisma.listing.findMany({
      where,
      include: {
        city: { include: { state: true } },
        state: true,
        categories: { include: { category: true } },
      },
      orderBy,
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.listing.count({ where }),
  ]);

  return { listings, total, totalPages: Math.ceil(total / perPage) };
}

// ── Claims & Ownership ─────────────────────────────────

export async function getClaimsByUser(userId: number) {
  return prisma.claim.findMany({
    where: { userId },
    include: {
      user: { select: { id: true, name: true, email: true } },
      listing: {
        include: {
          city: { include: { state: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getOwnedListings(userId: number) {
  return prisma.listing.findMany({
    where: { ownerId: userId, status: "active" },
    include: {
      city: { include: { state: true } },
      state: true,
      categories: { include: { category: true } },
    },
    orderBy: { name: "asc" },
  });
}

export async function getPendingClaims() {
  return prisma.claim.findMany({
    where: { status: "pending" },
    include: {
      user: { select: { id: true, name: true, email: true } },
      listing: {
        include: {
          city: { include: { state: true } },
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });
}

export async function getAllClaims() {
  return prisma.claim.findMany({
    include: {
      user: { select: { id: true, name: true, email: true } },
      listing: {
        include: {
          city: { include: { state: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

// ── Pillar Page Queries ────────────────────────────────

export async function getAllListingsByCity(cityId: number) {
  return prisma.listing.findMany({
    where: { cityId, status: "active" },
    include: {
      city: { include: { state: true } },
      state: true,
      categories: { include: { category: true } },
    },
    orderBy: [{ featured: "desc" }, { googleRating: "desc" }],
  });
}

export async function getStateStats(stateId: number) {
  const [listingCount, cityCount, avgRating] = await Promise.all([
    prisma.listing.count({ where: { stateId, status: "active" } }),
    prisma.city.count({ where: { stateId } }),
    prisma.listing.aggregate({
      where: { stateId, status: "active", googleRating: { not: null } },
      _avg: { googleRating: true },
    }),
  ]);
  return {
    listingCount,
    cityCount,
    avgRating: avgRating._avg.googleRating
      ? Math.round(avgRating._avg.googleRating * 10) / 10
      : null,
  };
}

export async function getCityStats(cityId: number) {
  const [listingCount, walkInCount, avgRating] = await Promise.all([
    prisma.listing.count({ where: { cityId, status: "active" } }),
    prisma.listing.count({ where: { cityId, status: "active", acceptsWalkIns: true } }),
    prisma.listing.aggregate({
      where: { cityId, status: "active", googleRating: { not: null } },
      _avg: { googleRating: true },
    }),
  ]);
  return {
    listingCount,
    walkInCount,
    avgRating: avgRating._avg.googleRating
      ? Math.round(avgRating._avg.googleRating * 10) / 10
      : null,
  };
}

// ── For static params ───────────────────────────────────

export async function getAllStateSlugs() {
  const states = await prisma.state.findMany({ select: { slug: true } });
  return states.map((s) => s.slug);
}

export async function getAllCitySlugs() {
  const cities = await prisma.city.findMany({
    select: { slug: true, state: { select: { slug: true } } },
  });
  return cities.map((c) => ({ city: c.slug, state: c.state.slug }));
}

export async function getAllListingSlugs() {
  const listings = await prisma.listing.findMany({
    where: { status: "active" },
    select: { slug: true },
  });
  return listings.map((l) => l.slug);
}

export async function getListingsByCategoryNational(
  categoryId: number,
  page = 1,
  perPage = ITEMS_PER_PAGE
) {
  const where = {
    status: "active" as ListingStatus,
    categories: { some: { categoryId } },
  };
  const [listings, total] = await Promise.all([
    prisma.listing.findMany({
      where,
      include: {
        city: { include: { state: true } },
        state: true,
        categories: { include: { category: true } },
      },
      orderBy: [{ featured: "desc" }, { googleRating: "desc" }],
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.listing.count({ where }),
  ]);
  return { listings, total, totalPages: Math.ceil(total / perPage) };
}

// ── Proximity / Zip Code Search ──────────────────────────

/**
 * Find active listings near a lat/lng point within a radius.
 * Uses city coordinates (since all listings are tied to a city with lat/lng).
 * Returns listings sorted by distance from the search point.
 */
export async function searchListingsNearby(params: {
  latitude: number;
  longitude: number;
  radiusMiles?: number;
  categorySlug?: string;
  price?: string;
  walkIns?: string;
  page?: number;
  perPage?: number;
}) {
  const {
    latitude,
    longitude,
    radiusMiles = 50,
    categorySlug,
    price,
    walkIns,
    page = 1,
    perPage = ITEMS_PER_PAGE,
  } = params;

  // First find all cities within the radius
  const allCities = await prisma.city.findMany({
    where: {
      latitude: { not: null },
      longitude: { not: null },
    },
    select: { id: true, name: true, latitude: true, longitude: true },
  });

  const citiesWithDistance = allCities
    .map((city) => ({
      ...city,
      distance: haversineDistance(
        latitude,
        longitude,
        city.latitude!,
        city.longitude!
      ),
    }))
    .filter((city) => city.distance <= radiusMiles)
    .sort((a, b) => a.distance - b.distance);

  if (citiesWithDistance.length === 0) {
    return { listings: [], total: 0, totalPages: 0, nearestCities: [] };
  }

  const cityIds = citiesWithDistance.map((c) => c.id);
  const cityDistanceMap = new Map(citiesWithDistance.map((c) => [c.id, c.distance]));

  // Build listing filter
  const where: Record<string, unknown> = {
    status: "active" as ListingStatus,
    cityId: { in: cityIds },
  };

  if (categorySlug) {
    const category = await prisma.category.findUnique({ where: { slug: categorySlug } });
    if (category) {
      where.categories = { some: { categoryId: category.id } };
    }
  }

  if (price) {
    where.priceRange = price as PriceRange;
  }

  if (walkIns === "true") {
    where.acceptsWalkIns = true;
  }

  const [allListings, total] = await Promise.all([
    prisma.listing.findMany({
      where,
      include: {
        city: { include: { state: true } },
        state: true,
        categories: { include: { category: true } },
      },
    }),
    prisma.listing.count({ where }),
  ]);

  // Sort by distance from search point, then by rating
  const listingsWithDistance = allListings
    .map((listing) => ({
      ...listing,
      distance: cityDistanceMap.get(listing.cityId) ?? 999,
    }))
    .sort((a, b) => {
      if (a.distance !== b.distance) return a.distance - b.distance;
      return (b.googleRating ?? 0) - (a.googleRating ?? 0);
    });

  // Paginate
  const start = (page - 1) * perPage;
  const paginatedListings = listingsWithDistance.slice(start, start + perPage);

  return {
    listings: paginatedListings,
    total,
    totalPages: Math.ceil(total / perPage),
    nearestCities: citiesWithDistance.slice(0, 5).map((c) => ({
      id: c.id,
      name: c.name,
      distance: Math.round(c.distance * 10) / 10,
    })),
  };
}
