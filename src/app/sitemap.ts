export const dynamic = "force-dynamic";

import { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://inklinktattoofinder.com";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/tattoo-shops`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/categories`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/search`, lastModified: new Date(), changeFrequency: "daily", priority: 0.7 },
    { url: `${baseUrl}/styles`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.2 },
  ];

  // State pages
  const states = await prisma.state.findMany({ select: { slug: true } });
  const statePages: MetadataRoute.Sitemap = states.map((s) => ({
    url: `${baseUrl}/tattoo-shops/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // City pages
  const cities = await prisma.city.findMany({
    select: { slug: true, state: { select: { slug: true } } },
  });
  const cityPages: MetadataRoute.Sitemap = cities.map((c) => ({
    url: `${baseUrl}/tattoo-shops/${c.state.slug}/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  // Category pages
  const categories = await prisma.category.findMany({ select: { slug: true } });
  const categoryPages: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${baseUrl}/categories/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Listing pages
  const listings = await prisma.listing.findMany({
    where: { status: "active" },
    select: {
      slug: true,
      updatedAt: true,
      city: { select: { slug: true, state: { select: { slug: true } } } },
    },
  });
  const listingPages: MetadataRoute.Sitemap = listings.map((l) => ({
    url: `${baseUrl}/tattoo-shops/${l.city.state.slug}/${l.city.slug}/${l.slug}`,
    lastModified: l.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  // City + Category combo pages (long-tail SEO)
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
  const cityCategoryPages: MetadataRoute.Sitemap = [];
  for (const combo of cityCategoryCombos) {
    const key = `${combo.listing.city.state.slug}/${combo.listing.city.slug}/style/${combo.category.slug}`;
    if (!comboSet.has(key)) {
      comboSet.add(key);
      cityCategoryPages.push({
        url: `${baseUrl}/tattoo-shops/${key}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      });
    }
  }

  return [
    ...staticPages,
    ...statePages,
    ...cityPages,
    ...categoryPages,
    ...listingPages,
    ...cityCategoryPages,
  ];
}
