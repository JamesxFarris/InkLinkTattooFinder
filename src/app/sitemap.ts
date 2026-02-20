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
    select: { slug: true, updatedAt: true },
  });
  const listingPages: MetadataRoute.Sitemap = listings.map((l) => ({
    url: `${baseUrl}/listing/${l.slug}`,
    lastModified: l.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [
    ...staticPages,
    ...statePages,
    ...cityPages,
    ...categoryPages,
    ...listingPages,
  ];
}
