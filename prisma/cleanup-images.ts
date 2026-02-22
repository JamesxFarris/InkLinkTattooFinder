import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ── Junk URL filters (removed without HEAD check) ──────────────────

const JUNK_DOMAINS = new Set([
  "tattoshopsnearme.com",     // generic directory stock photos
  "bestprosintown.com",       // badge images
  "poplme.co",                // default profile placeholders
  "streetviewpixels-pa.googleapis.com", // Google Street View thumbs
]);

const JUNK_SUBSTRINGS = [
  "defaultProfileImage",
  "defaultprofileimage",
  "spacer.png",
  "spacer.gif",
  "PayPalDepositButton",
  "transparent_placeholder",
];

/**
 * Detect Wix/resize-param fragments created by CSV comma-splitting.
 * These look like: http://shopsite.com/h_600  or  http://shopsite.com/al_c
 * The path is a single bare resize parameter that isn't a real page.
 */
const CSV_FRAGMENT_PATH = /^\/(?:[a-z]{1,4}_[a-z0-9]+|enc_[a-z]+|quality_[a-z]+|usm_[\d._]+)$/i;

function isJunkUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.toLowerCase();

    // Blocked domains
    for (const d of JUNK_DOMAINS) {
      if (hostname === d || hostname.endsWith(`.${d}`)) return true;
    }

    // Blocked substrings
    const lower = url.toLowerCase();
    for (const s of JUNK_SUBSTRINGS) {
      if (lower.includes(s.toLowerCase())) return true;
    }

    // CSV comma-split fragments: path is a single resize param like /h_600, /al_c, /q_80
    if (CSV_FRAGMENT_PATH.test(parsed.pathname)) return true;

    return false;
  } catch {
    return true; // unparseable URL = junk
  }
}

// ── HEAD check with concurrency control ─────────────────────────────

async function isUrlAlive(url: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(url, {
      method: "HEAD",
      signal: controller.signal,
      redirect: "follow",
      headers: { "User-Agent": "Mozilla/5.0 (compatible; LinkChecker/1.0)" },
    });
    clearTimeout(timer);
    return res.ok;
  } catch {
    return false;
  }
}

async function checkUrlsBatch(
  urls: string[],
  concurrency: number
): Promise<Map<string, boolean>> {
  const results = new Map<string, boolean>();
  const queue = [...urls];

  async function worker() {
    while (queue.length > 0) {
      const url = queue.shift()!;
      results.set(url, await isUrlAlive(url));
    }
  }

  const workers = Array.from({ length: concurrency }, () => worker());
  await Promise.all(workers);
  return results;
}

// ── Main ────────────────────────────────────────────────────────────

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const skipHeadCheck = process.argv.includes("--skip-head-check");

  if (dryRun) console.log("=== DRY RUN MODE ===\n");
  if (skipHeadCheck) console.log("=== SKIPPING HEAD CHECKS ===\n");

  // Load all listings with photos
  console.log("Loading listings with photos...");
  const listings = await prisma.listing.findMany({
    where: { photos: { not: { equals: null } } },
    select: { id: true, name: true, photos: true },
  });
  console.log(`Found ${listings.length} listings with photos\n`);

  let totalJunkRemoved = 0;
  let totalDupesRemoved = 0;
  let totalDeadRemoved = 0;
  let totalCleared = 0; // listings that end up with 0 photos
  let totalUpdated = 0;
  let totalUnchanged = 0;

  // Phase 1: Filter junk patterns + deduplicate
  console.log("Phase 1: Filtering junk patterns and deduplicating...");
  type CleanedListing = {
    id: number;
    name: string;
    original: string[];
    afterJunkFilter: string[];
    junkRemoved: number;
    dupesRemoved: number;
  };
  const cleaned: CleanedListing[] = [];

  for (const listing of listings) {
    const original = listing.photos as string[];
    if (!Array.isArray(original) || original.length === 0) continue;

    // Remove junk
    const afterJunk = original.filter((u) => !isJunkUrl(u));
    const junkCount = original.length - afterJunk.length;

    // Deduplicate (preserve order)
    const seen = new Set<string>();
    const deduped: string[] = [];
    for (const u of afterJunk) {
      if (!seen.has(u)) {
        seen.add(u);
        deduped.push(u);
      }
    }
    const dupeCount = afterJunk.length - deduped.length;

    totalJunkRemoved += junkCount;
    totalDupesRemoved += dupeCount;

    cleaned.push({
      id: listing.id,
      name: listing.name,
      original,
      afterJunkFilter: deduped,
      junkRemoved: junkCount,
      dupesRemoved: dupeCount,
    });
  }

  console.log(`  Junk URLs removed: ${totalJunkRemoved}`);
  console.log(`  Duplicate URLs removed: ${totalDupesRemoved}`);

  // Phase 2: HEAD check remaining URLs
  if (!skipHeadCheck) {
    // Collect unique URLs to check (avoid checking the same URL twice)
    const uniqueUrls = new Set<string>();
    for (const c of cleaned) {
      for (const u of c.afterJunkFilter) uniqueUrls.add(u);
    }
    console.log(`\nPhase 2: HEAD checking ${uniqueUrls.size} unique URLs (concurrency=20)...`);

    const aliveMap = await checkUrlsBatch([...uniqueUrls], 20);
    const deadCount = [...aliveMap.values()].filter((v) => !v).length;
    console.log(`  Alive: ${aliveMap.size - deadCount}, Dead: ${deadCount}`);

    // Show sample dead URLs
    const deadSamples = [...aliveMap.entries()].filter(([, v]) => !v).slice(0, 15);
    if (deadSamples.length > 0) {
      console.log("  Sample dead URLs:");
      for (const [u] of deadSamples) console.log(`    ${u}`);
    }

    // Remove dead URLs from each listing
    for (const c of cleaned) {
      const before = c.afterJunkFilter.length;
      c.afterJunkFilter = c.afterJunkFilter.filter((u) => aliveMap.get(u) !== false);
      totalDeadRemoved += before - c.afterJunkFilter.length;
    }
    console.log(`  Dead URLs removed from listings: ${totalDeadRemoved}`);
  }

  // Phase 3: Apply updates
  console.log(`\nPhase 3: Applying updates...`);
  for (const c of cleaned) {
    const changed =
      c.afterJunkFilter.length !== c.original.length ||
      c.afterJunkFilter.some((u, i) => u !== c.original[i]);

    if (!changed) {
      totalUnchanged++;
      continue;
    }

    const newPhotos = c.afterJunkFilter.length > 0 ? c.afterJunkFilter : null;
    if (newPhotos === null) totalCleared++;

    if (dryRun) {
      if (c.junkRemoved > 0 || c.dupesRemoved > 0 || c.original.length !== c.afterJunkFilter.length) {
        console.log(
          `  [DRY RUN] "${c.name}" (id=${c.id}): ${c.original.length} → ${c.afterJunkFilter.length} photos` +
            (c.junkRemoved > 0 ? ` (${c.junkRemoved} junk)` : "") +
            (c.dupesRemoved > 0 ? ` (${c.dupesRemoved} dupes)` : "")
        );
      }
    } else {
      await prisma.listing.update({
        where: { id: c.id },
        data: { photos: newPhotos ?? undefined },
      });
    }
    totalUpdated++;
  }

  // Summary
  console.log("\n=== Summary ===");
  console.log(`Listings processed:    ${cleaned.length}`);
  console.log(`Listings updated:      ${totalUpdated}`);
  console.log(`Listings unchanged:    ${totalUnchanged}`);
  console.log(`Listings cleared (0):  ${totalCleared}`);
  console.log(`Junk URLs removed:     ${totalJunkRemoved}`);
  console.log(`Duplicate URLs removed:${totalDupesRemoved}`);
  console.log(`Dead URLs removed:     ${totalDeadRemoved}`);
  console.log(`Total URLs removed:    ${totalJunkRemoved + totalDupesRemoved + totalDeadRemoved}`);

  if (dryRun) console.log("\n=== DRY RUN — no changes written ===");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Cleanup failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
