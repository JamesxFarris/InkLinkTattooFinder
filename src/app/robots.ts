import type { MetadataRoute } from "next";
import { generateSitemaps } from "./sitemap";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const sitemaps = await generateSitemaps();
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard/", "/api/", "/login", "/register"],
      },
    ],
    sitemap: sitemaps.map(
      (s) => `https://inklinktattoofinder.com/sitemap/${s.id}.xml`
    ),
  };
}
