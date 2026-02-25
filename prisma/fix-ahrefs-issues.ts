import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Fix Ahrefs-reported issues:
 *   Phase 1 — Remove broken image URLs from listing photos
 *   Phase 2 — Null out broken website URLs on listings
 *   Phase 3 — Report orphan city pages
 *
 * SKIPS all verified/claimed listings (ownerId != null).
 *
 * Usage:
 *   npx tsx prisma/fix-ahrefs-issues.ts --dry-run   # preview
 *   npx tsx prisma/fix-ahrefs-issues.ts              # apply
 */

const DRY_RUN = process.argv.includes("--dry-run");

// ── Broken image URLs from Ahrefs crawl (404/403/406/429) ──────────────
const BROKEN_IMAGE_URLS = new Set([
  "https://www.galleryoftattoosnow.com/phippstattoo.com/images/large_thumbs/IMG_1165.jpeg",
  "https://resilienttattoopiercing.com/wp-content/uploads/2025/04/portfolio-sleeve-1920x1080-1-753x1024.jpg",
  "https://www.dragontattoohawaii.com/images/lance_uc.jpg",
  "https://www.inkoclock.com/images/bagallery/gallery-1/thumbnail/category-1/01.jpg?1770978051",
  "https://www.inkoclock.com/images/bagallery/gallery-1/thumbnail/category-1/05.jpg?1770978051",
  "https://burntheboatstattoo.com/wp-content/uploads/2024/07/IMG_5113-218x300.jpg",
  "https://invisibleselfbodyart.com/wp-content/uploads/2025/05/1000019340-829x1024.jpg",
  "https://www.kustomtattooclub.com/wp-content/uploads/2015/01/96c1e6de63f4f6161206a8d695441133_PbYJdrpW_l-400x400.jpg",
  "https://onthegrindtattoo.com/images/branden.jpg",
  "https://www.tranquilsoulink.com/__static/production-webdotcom-5/405/1957405/M4sseNKE/4230254e7791433b8ab831bc3f0bf926",
  "https://highresolutiontattoo.com/wp-content/uploads/2025/07/IMG_0452.jpeg",
  "https://victoryblvdtattoo.com/wp-content/themes/yootheme/cache/85/team-steve-85f79e52.jpeg",
  "https://talismantattoo.com/wp-content/uploads/2020/11/DBE14D98-D8C3-4B36-8AB5-8EF6FFE55361-768x768.jpeg",
  "https://adrenalizedink.com/wp-content/uploads/2022/10/Adrenalized-Ink-Homepage-Work-4.png",
  "https://new.tattoosbyj.com/wp-content/uploads/2019/01/3-475x475.jpg",
  "https://bluefintattoos.com/wp-content/uploads/2026/01/AI-Search-Fotolia_54453666_X.png",
  "https://livingartstattoo.net/wp-content/uploads/2015/12/hesstattooryanmahoney.jpg",
  "https://www.faithfultattoostudio.com/__static/production-webdotcom-5/315/1850315/RPVhwiFE/36cbbf9a49e7470f81ac2ebeabfbb818",
]);

// We'll also HEAD-check all external (non-Cloudinary) photos to catch
// anything Ahrefs found that isn't in the hardcoded list above.
// This is the safest approach — verify every URL ourselves.
const CHECK_ALL_EXTERNAL = true;
const CONCURRENCY = 25;
const TIMEOUT_MS = 8_000;
const BROKEN_STATUSES = new Set([403, 404, 405, 406, 410, 429, 500, 502, 503]);

// ── Broken website URLs from Ahrefs (11 listings) ─────────────────────
const BROKEN_WEBSITE_SLUGS = [
  "art-immortal-tattoo-and-piercing",
  "dying-art-tattoo",
  "uplift-tattoo-and-piercing-nyc",
  "vision-quest-body-art-and-gallery",
  "skin-gallery-tattoo-body-piercing",
  "redemption-tattoo",
  "stag-and-castle",
  "underground-art-collective-llc",
  "get-right-studios",
  "daddy-jacks-tattoos",
  "the-new-american-tattoo-company-aka-tattoomoney-baltimore",
];

async function checkUrl(url: string): Promise<{ ok: boolean; status: number | string }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: "HEAD",
      signal: controller.signal,
      redirect: "follow",
      headers: { "User-Agent": "Mozilla/5.0 (compatible; InkLink-ImageChecker/1.0)" },
    });
    clearTimeout(timer);
    return { ok: !BROKEN_STATUSES.has(res.status), status: res.status };
  } catch {
    clearTimeout(timer);
    return { ok: false, status: "error" };
  }
}

async function processInBatches<T, R>(
  items: T[],
  concurrency: number,
  fn: (item: T) => Promise<R>
): Promise<R[]> {
  const results: R[] = [];
  for (let i = 0; i < items.length; i += concurrency) {
    const batch = items.slice(i, i + concurrency);
    results.push(...(await Promise.all(batch.map(fn))));
  }
  return results;
}

async function phase1_brokenImages() {
  console.log("═══ PHASE 1: BROKEN IMAGES ═══\n");

  const listings = await prisma.listing.findMany({
    where: { status: "active", ownerId: null, photos: { not: { equals: null } } },
    select: { id: true, name: true, photos: true },
  });

  console.log(`Loaded ${listings.length} unverified listings with photos.`);

  // Collect all unique external (non-Cloudinary) image URLs
  const urlToListingIds = new Map<string, number[]>();
  for (const listing of listings) {
    const photos = listing.photos as string[];
    if (!Array.isArray(photos)) continue;
    for (const url of photos) {
      // Skip Cloudinary — those are ours and fine
      if (url.includes("cloudinary.com")) continue;
      if (!urlToListingIds.has(url)) urlToListingIds.set(url, []);
      urlToListingIds.get(url)!.push(listing.id);
    }
  }

  const allExternalUrls = [...urlToListingIds.keys()];
  console.log(`External image URLs to check: ${allExternalUrls.length}\n`);

  // HEAD-check every external URL
  const brokenUrls = new Set<string>();
  let checked = 0;

  await processInBatches(allExternalUrls, CONCURRENCY, async (url) => {
    // Known broken from Ahrefs — skip the network call
    if (BROKEN_IMAGE_URLS.has(url)) {
      brokenUrls.add(url);
      checked++;
      return;
    }

    if (CHECK_ALL_EXTERNAL) {
      const result = await checkUrl(url);
      checked++;
      if (checked % 100 === 0) {
        process.stdout.write(`  Checked ${checked}/${allExternalUrls.length} (${brokenUrls.size} broken)\r`);
      }
      if (!result.ok) {
        brokenUrls.add(url);
        console.log(`  BROKEN [${result.status}] ${url}`);
      }
    }
  });

  console.log(`\nBroken external image URLs: ${brokenUrls.size}\n`);

  if (brokenUrls.size === 0) {
    console.log("No broken images found!\n");
    return;
  }

  // Remove broken URLs from listings
  let updated = 0;
  let urlsRemoved = 0;

  for (const listing of listings) {
    const photos = listing.photos as string[];
    if (!Array.isArray(photos) || photos.length === 0) continue;

    const cleaned = photos.filter((url) => !brokenUrls.has(url));
    const removed = photos.length - cleaned.length;
    if (removed === 0) continue;

    urlsRemoved += removed;
    updated++;

    console.log(
      `  "${listing.name}" (id=${listing.id}): ${photos.length} → ${cleaned.length} photos (-${removed})`
    );

    if (!DRY_RUN) {
      await prisma.listing.update({
        where: { id: listing.id },
        data: { photos: cleaned.length > 0 ? cleaned : undefined },
      });
    }
  }

  console.log(`\n  Listings updated:   ${updated}`);
  console.log(`  Image refs removed: ${urlsRemoved}\n`);
}

async function phase2_brokenWebsites() {
  console.log("═══ PHASE 2: BROKEN WEBSITE LINKS ═══\n");

  const listings = await prisma.listing.findMany({
    where: {
      slug: { in: BROKEN_WEBSITE_SLUGS },
      ownerId: null,
      status: "active",
    },
    select: { id: true, name: true, slug: true, website: true },
  });

  console.log(`Found ${listings.length} unverified listings with broken websites.\n`);

  for (const listing of listings) {
    console.log(`  "${listing.name}" (${listing.slug}): ${listing.website} → null`);
    if (!DRY_RUN) {
      await prisma.listing.update({
        where: { id: listing.id },
        data: { website: null },
      });
    }
  }

  // Report any that were skipped (verified)
  const verified = await prisma.listing.findMany({
    where: {
      slug: { in: BROKEN_WEBSITE_SLUGS },
      ownerId: { not: null },
    },
    select: { name: true, slug: true },
  });
  if (verified.length > 0) {
    console.log(`\n  Skipped ${verified.length} verified listing(s):`);
    for (const v of verified) {
      console.log(`    "${v.name}" (${v.slug}) — verified, not touched`);
    }
  }
  console.log();
}

async function phase3_orphanPages() {
  console.log("═══ PHASE 3: ORPHAN PAGES ═══\n");

  const orphanSlugs = [
    { city: "hitchcock", state: "texas" },
    { city: "conmay", state: "south-carolina" },
  ];

  for (const { city: citySlug, state: stateSlug } of orphanSlugs) {
    const state = await prisma.state.findUnique({ where: { slug: stateSlug } });
    if (!state) {
      console.log(`  State "${stateSlug}" not found!`);
      continue;
    }

    const city = await prisma.city.findFirst({
      where: { slug: citySlug, stateId: state.id },
      include: {
        _count: { select: { listings: { where: { status: "active" } } } },
      },
    });

    if (!city) {
      console.log(`  City "${citySlug}" in ${stateSlug} not found in DB!`);
      continue;
    }

    console.log(
      `  ${city.name}, ${state.abbreviation}: ${city._count.listings} active listings (threshold=${10})`
    );

    if (city._count.listings === 0) {
      console.log(`    → No active listings. This city page should 404 or be removed from sitemap.`);
    } else if (city._count.listings < 10) {
      console.log(`    → Below threshold. Should appear on state page in "More Tattoo Shops" section.`);
      // Check if listings exist
      const listings = await prisma.listing.findMany({
        where: { cityId: city.id, status: "active" },
        select: { id: true, name: true },
      });
      console.log(`    → Active listings: ${listings.map((l) => l.name).join(", ")}`);
    } else {
      console.log(`    → Above threshold. Should have its own city page.`);
    }
  }
  console.log();
}

async function main() {
  if (DRY_RUN) console.log("══════ DRY RUN MODE ══════\n");
  else console.log("══════ APPLYING CHANGES ══════\n");

  await phase1_brokenImages();
  await phase2_brokenWebsites();
  await phase3_orphanPages();

  console.log("═══ DONE ═══");
  if (DRY_RUN) console.log("(No changes written — run without --dry-run to apply)");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error("Failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
