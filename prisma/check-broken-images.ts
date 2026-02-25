import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Check all listing photo URLs and remove broken ones (403/404/406/410/429/5xx).
 * Uses HEAD requests with concurrency control to avoid hammering servers.
 *
 * Usage:
 *   npx tsx prisma/check-broken-images.ts --dry-run   # preview changes
 *   npx tsx prisma/check-broken-images.ts              # apply changes
 */

const CONCURRENCY = 20;
const TIMEOUT_MS = 10_000;
const BROKEN_STATUSES = new Set([403, 404, 405, 406, 410, 429, 500, 502, 503]);

async function checkUrl(url: string): Promise<{ ok: boolean; status: number | string }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: "HEAD",
      signal: controller.signal,
      redirect: "follow",
      headers: { "User-Agent": "InkLink-ImageChecker/1.0" },
    });
    clearTimeout(timer);
    return { ok: !BROKEN_STATUSES.has(res.status), status: res.status };
  } catch (e) {
    clearTimeout(timer);
    const msg = e instanceof Error ? e.message : "unknown";
    // Timeouts and network errors count as broken
    if (msg.includes("abort") || msg.includes("timeout")) {
      return { ok: false, status: "timeout" };
    }
    return { ok: false, status: msg.slice(0, 30) };
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
    const batchResults = await Promise.all(batch.map(fn));
    results.push(...batchResults);
  }
  return results;
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  if (dryRun) console.log("=== DRY RUN MODE ===\n");

  const listings = await prisma.listing.findMany({
    where: { status: "active", photos: { not: { equals: null } } },
    select: { id: true, name: true, photos: true },
  });

  console.log(`Checking images for ${listings.length} listings...\n`);

  // Collect all unique URLs
  const urlToListings = new Map<string, number[]>();
  for (const listing of listings) {
    const photos = listing.photos as string[];
    if (!Array.isArray(photos)) continue;
    for (const url of photos) {
      if (!urlToListings.has(url)) urlToListings.set(url, []);
      urlToListings.get(url)!.push(listing.id);
    }
  }

  const allUrls = [...urlToListings.keys()];
  console.log(`Unique image URLs to check: ${allUrls.length}\n`);

  // Check all URLs
  const brokenUrls = new Set<string>();
  let checked = 0;

  await processInBatches(allUrls, CONCURRENCY, async (url) => {
    const result = await checkUrl(url);
    checked++;
    if (checked % 100 === 0) {
      process.stdout.write(`  Checked ${checked}/${allUrls.length} (${brokenUrls.size} broken)\r`);
    }
    if (!result.ok) {
      brokenUrls.add(url);
      const listingIds = urlToListings.get(url) ?? [];
      console.log(`  BROKEN [${result.status}] ${url} (affects ${listingIds.length} listing(s))`);
    }
    return result;
  });

  console.log(`\n\nBroken URLs found: ${brokenUrls.size}\n`);

  if (brokenUrls.size === 0) {
    console.log("No broken images found!");
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

    if (!dryRun) {
      await prisma.listing.update({
        where: { id: listing.id },
        data: { photos: cleaned.length > 0 ? cleaned : undefined },
      });
    }
  }

  console.log("\n=== Summary ===");
  console.log(`Unique broken URLs:  ${brokenUrls.size}`);
  console.log(`Listings updated:    ${updated}`);
  console.log(`Image refs removed:  ${urlsRemoved}`);
  if (dryRun) console.log("\n(DRY RUN — no changes written)");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
