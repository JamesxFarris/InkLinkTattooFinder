export const dynamic = "force-dynamic";

import { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

const baseUrl = "https://inklinktattoofinder.com";
const URLS_PER_SITEMAP = 2000;

// id 0 = static + states + cities + categories
// id 1..2 = listing chunks (2000 each, covers ~3500 listings)
// id 3..6 = city+category combo chunks (covers ~8000 combos)
// Empty sitemaps are harmless — Google just ignores them.
// Increase these if listings grow past 4000 or combos past 8000.
export async function generateSitemaps() {
  return [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }];
}

export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
  const listingCount = await prisma.listing.count({ where: { status: "active" } });
  const listingChunks = Math.ceil(listingCount / URLS_PER_SITEMAP);

  // ID 0: static pages + states + cities + categories
  if (id === 0) {
    const staticPages: MetadataRoute.Sitemap = [
      { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
      { url: `${baseUrl}/tattoo-shops`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
      { url: `${baseUrl}/categories`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
      { url: `${baseUrl}/search`, lastModified: new Date(), changeFrequency: "daily", priority: 0.7 },
      { url: `${baseUrl}/styles`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
      { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
      { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
      { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.2 },
      { url: `${baseUrl}/list-your-shop`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
      { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.2 },
      { url: `${baseUrl}/dmca`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.2 },
    ];

    const states = await prisma.state.findMany({ select: { slug: true } });
    const statePages: MetadataRoute.Sitemap = states.map((s) => ({
      url: `${baseUrl}/tattoo-shops/${s.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    const cities = await prisma.city.findMany({
      select: { slug: true, state: { select: { slug: true } } },
    });
    const cityPages: MetadataRoute.Sitemap = cities.map((c) => ({
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

    return [...staticPages, ...statePages, ...cityPages, ...categoryPages];
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

  // Remaining IDs: city+category combo pages
  const comboChunkIndex = id - listingChunks - 1;
  const cityCategoryCombos = await prisma.listingCategory.findMany({
    where: { listing: { status: "active" } },
    select: {
      category: { select: { slug: true } },
      listing: {
        select: {
          city: { select: { slug: true, state: { select: { slug: true } } } },
        },
      },
    },
  });

  // Deduplicate by city+state+category combo
  const comboSet = new Set<string>();
  const allCombos: MetadataRoute.Sitemap = [];
  for (const combo of cityCategoryCombos) {
    const key = `${combo.listing.city.state.slug}/${combo.listing.city.slug}/style/${combo.category.slug}`;
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
