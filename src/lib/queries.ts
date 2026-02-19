import { prisma } from "./db";
import { ITEMS_PER_PAGE } from "./utils";
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

export async function getFeaturedListingsByState(stateId: number, limit = 6) {
  return prisma.listing.findMany({
    where: { stateId, status: "active", featured: true },
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
