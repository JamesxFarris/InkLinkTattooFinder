export const dynamic = "force-dynamic";

import { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { CITY_PAGE_MIN_LISTINGS } from "@/lib/utils";

const baseUrl = "https://inklinktattoofinder.com";
const URLS_PER_SITEMAP = 2000;

// id 0 = static + states + cities (above threshold) + categories + blog
// id 1..N = listing chunks (2000 each)
// id N+1..M = city+category combo chunks (only for cities above threshold)
// Sitemaps are calculated dynamically — no manual adjustment needed.
export async function generateSitemaps() {
  const listingCount = await prisma.listing.count({ where: { status: "active" } });
  const listingChunks = Math.ceil(listingCount / URLS_PER_SITEMAP) || 1;

  // Estimate combo count to determine chunk count without fetching all combos
  const comboCount = await prisma.$queryRaw<[{ count: bigint }]>`
    SELECT COUNT(DISTINCT CONCAT(l."cityId", '-', lc."categoryId")) AS count
    FROM "ListingCategory" lc
    JOIN "Listing" l ON l.id = lc."listingId"
    JOIN "City" c ON c.id = l."cityId"
    WHERE l.status = 'active'
      AND (SELECT COUNT(*) FROM "Listing" l2 WHERE l2."cityId" = c.id AND l2.status = 'active') >= ${CITY_PAGE_MIN_LISTINGS}
  `;
  const totalCombos = Number(comboCount[0]?.count ?? 0);
  const comboChunks = Math.ceil(totalCombos / URLS_PER_SITEMAP) || 1;

  const totalSitemaps = 1 + listingChunks + comboChunks; // 1 for id 0
  return Array.from({ length: totalSitemaps }, (_, i) => ({ id: i }));
}

export default async function sitemap(props: { id: Promise<string> }): Promise<MetadataRoute.Sitemap> {
  const id = Number(await props.id);
  const listingCount = await prisma.listing.count({ where: { status: "active" } });
  const listingChunks = Math.ceil(listingCount / URLS_PER_SITEMAP) || 1;

  // ID 0: static pages + states + qualifying cities + categories
  if (id === 0) {
    const staticPages: MetadataRoute.Sitemap = [
      { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
      { url: `${baseUrl}/tattoo-shops`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
      { url: `${baseUrl}/categories`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
      { url: `${baseUrl}/styles`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
      { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
      { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
      { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.2 },
      { url: `${baseUrl}/list-your-shop`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
      { url: `${baseUrl}/for-shop-owners`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
      { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.2 },
      { url: `${baseUrl}/dmca`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.2 },
      { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.7 },
    ];

    // Blog posts
    const blogPosts = await prisma.blogPost.findMany({
      where: { status: "published", publishedAt: { not: null } },
      select: { slug: true, updatedAt: true },
    });
    const blogPages: MetadataRoute.Sitemap = blogPosts.map((p) => ({
      url: `${baseUrl}/blog/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

    const states = await prisma.state.findMany({ select: { slug: true } });
    const statePages: MetadataRoute.Sitemap = states.map((s) => ({
      url: `${baseUrl}/tattoo-shops/${s.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    // Only include cities that meet the minimum listing threshold
    const cities = await prisma.city.findMany({
      where: {
        listings: { some: { status: "active" } },
      },
      select: {
        slug: true,
        state: { select: { slug: true } },
        _count: { select: { listings: { where: { status: "active" } } } },
      },
    });
    const cityPages: MetadataRoute.Sitemap = cities
      .filter((c) => c._count.listings >= CITY_PAGE_MIN_LISTINGS)
      .map((c) => ({
        url: `${baseUrl}/tattoo-shops/${c.state.slug}/${c.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.9,
      }));

    const categories = await prisma.category.findMany({ select: { slug: true } });
    const categoryPages: MetadataRoute.Sitemap = categories.map((c) => ({
      url: `${baseUrl}/categories/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    return [...staticPages, ...blogPages, ...statePages, ...cityPages, ...categoryPages];
  }

  // IDs 1..listingChunks: listing pages
  if (id <= listingChunks) {
    const chunkIndex = id - 1;
    const listings = await prisma.listing.findMany({
      where: { status: "active" },
      select: {
        slug: true,
        updatedAt: true,
        city: { select: { slug: true, state: { select: { slug: true } } } },
      },
      orderBy: { id: "asc" },
      skip: chunkIndex * URLS_PER_SITEMAP,
      take: URLS_PER_SITEMAP,
    });

    return listings.map((l) => ({
      url: `${baseUrl}/tattoo-shops/${l.city.state.slug}/${l.city.slug}/${l.slug}`,
      lastModified: l.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));
  }

  // Remaining IDs: city+category combo pages (only for cities above threshold)
  const comboChunkIndex = id - listingChunks - 1;

  // Get city IDs that meet the threshold
  const qualifyingCities = await prisma.city.findMany({
    where: {
      listings: { some: { status: "active" } },
    },
    select: {
      id: true,
      slug: true,
      state: { select: { slug: true } },
      _count: { select: { listings: { where: { status: "active" } } } },
    },
  });
  const qualifyingCityIds = new Set(
    qualifyingCities
      .filter((c) => c._count.listings >= CITY_PAGE_MIN_LISTINGS)
      .map((c) => c.id)
  );
  const cityLookup = new Map(
    qualifyingCities.map((c) => [c.id, { slug: c.slug, stateSlug: c.state.slug }])
  );

  const cityCategoryCombos = await prisma.listingCategory.findMany({
    where: { listing: { status: "active" } },
    select: {
      category: { select: { slug: true } },
      listing: {
        select: {
          cityId: true,
        },
      },
    },
  });

  // Deduplicate by city+category combo, only for qualifying cities
  const comboSet = new Set<string>();
  const allCombos: MetadataRoute.Sitemap = [];
  for (const combo of cityCategoryCombos) {
    if (!qualifyingCityIds.has(combo.listing.cityId)) continue;
    const cityInfo = cityLookup.get(combo.listing.cityId);
    if (!cityInfo) continue;
    const key = `${cityInfo.stateSlug}/${cityInfo.slug}/style/${combo.category.slug}`;
    if (!comboSet.has(key)) {
      comboSet.add(key);
      allCombos.push({
        url: `${baseUrl}/tattoo-shops/${key}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      });
    }
  }

  const start = comboChunkIndex * URLS_PER_SITEMAP;
  return allCombos.slice(start, start + URLS_PER_SITEMAP);
}
