import { generateSitemaps } from "../../sitemap";

export const dynamic = "force-dynamic";

export async function GET() {
  const sitemaps = await generateSitemaps();
  const base = "https://inklinktattoofinder.com";
  const now = new Date().toISOString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.map((s) => `  <sitemap>\n    <loc>${base}/sitemap/${s.id}.xml</loc>\n    <lastmod>${now}</lastmod>\n  </sitemap>`).join("\n")}
</sitemapindex>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
