import { Prisma, PrismaClient } from "@prisma/client";
import { GoogleGenerativeAI } from "@google/generative-ai";

const prisma = new PrismaClient();

const GOOGLE_AI_API_KEY = process.env.GOOGLE_AI_API_KEY;
if (!GOOGLE_AI_API_KEY) {
  console.error("Missing GOOGLE_AI_API_KEY env var");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(GOOGLE_AI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const PROMPT = `Look at this image. Classify it as either "keep" or "remove".

KEEP if: tattoo artwork, tattoo shop interior/exterior, artist working, shop signage photo, portfolio piece, or real photograph related to a tattoo business.

REMOVE if: logo/icon/favicon, email or contact icon, payment badge (visa/mastercard/paypal), social media graphic, avatar/profile placeholder, stock photo, blank/white/transparent image, website UI element or screenshot, navigation element, badge/certificate graphic, or any non-photographic image that isn't a real tattoo shop photo.

Respond with exactly one line in the format:
KEEP|reason
or
REMOVE|reason

Examples:
KEEP|tattoo artwork photo
REMOVE|website logo icon`;

type Classification = { action: "keep" | "remove"; reason: string };

// ── Classify a single image URL ──────────────────────────────────────

async function fetchImageAsBase64(url: string): Promise<{ data: string; mime: string } | null> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10000);
    const res = await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      headers: { "User-Agent": "Mozilla/5.0 (compatible; ImageAudit/1.0)" },
    });
    clearTimeout(timer);
    if (!res.ok) return null;

    const contentType = res.headers.get("content-type") ?? "image/jpeg";
    const mime = contentType.split(";")[0].trim();
    const buffer = await res.arrayBuffer();
    const data = Buffer.from(buffer).toString("base64");
    return { data, mime };
  } catch {
    return null;
  }
}

async function classifyImage(url: string): Promise<Classification> {
  try {
    const image = await fetchImageAsBase64(url);
    if (!image) return { action: "keep", reason: "error: could not fetch image" };

    const result = await model.generateContent([
      PROMPT,
      {
        inlineData: {
          mimeType: image.mime,
          data: image.data,
        },
      },
    ]);

    const text = result.response.text().trim();
    const pipeIdx = text.indexOf("|");

    if (pipeIdx === -1) {
      const upper = text.toUpperCase();
      if (upper.startsWith("KEEP")) return { action: "keep", reason: text };
      if (upper.startsWith("REMOVE")) return { action: "remove", reason: text };
      return { action: "keep", reason: `ambiguous response: ${text}` };
    }

    const action = text.slice(0, pipeIdx).trim().toUpperCase();
    const reason = text.slice(pipeIdx + 1).trim();

    if (action === "KEEP") return { action: "keep", reason };
    if (action === "REMOVE") return { action: "remove", reason };
    return { action: "keep", reason: `ambiguous: ${text}` };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { action: "keep", reason: `error: ${message}` };
  }
}

// ── Concurrency-limited worker pool ──────────────────────────────────

async function classifyAll(
  urls: string[],
  concurrency: number
): Promise<Map<string, Classification>> {
  const results = new Map<string, Classification>();
  const queue = [...urls];
  let completed = 0;
  const total = urls.length;

  async function worker() {
    while (queue.length > 0) {
      const url = queue.shift()!;
      results.set(url, await classifyImage(url));
      completed++;
      if (completed % 50 === 0 || completed === total) {
        console.log(`  Classified ${completed}/${total} images...`);
      }
    }
  }

  const workers = Array.from({ length: concurrency }, () => worker());
  await Promise.all(workers);
  return results;
}

// ── Main ─────────────────────────────────────────────────────────────

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const concurrency = parseInt(
    process.argv.find((a) => a.startsWith("--concurrency="))?.split("=")[1] ?? "10",
    10
  );

  if (dryRun) console.log("=== DRY RUN MODE ===\n");

  // Step 1: Load listings with photos
  console.log("Loading listings with photos...");
  const listings = await prisma.listing.findMany({
    where: { photos: { not: { equals: null } } },
    select: { id: true, name: true, photos: true },
  });
  console.log(`Found ${listings.length} listings with photos`);

  // Collect all unique image URLs
  const urlToListings = new Map<string, number[]>();
  for (const listing of listings) {
    const photos = listing.photos as string[];
    if (!Array.isArray(photos)) continue;
    for (const url of photos) {
      const existing = urlToListings.get(url);
      if (existing) existing.push(listing.id);
      else urlToListings.set(url, [listing.id]);
    }
  }
  console.log(`Found ${urlToListings.size} unique image URLs\n`);

  // Step 2: Classify each URL with Gemini Flash
  const sampleLimit = parseInt(
    process.argv.find((a) => a.startsWith("--limit="))?.split("=")[1] ?? "0",
    10
  );
  const allUrls = [...urlToListings.keys()];
  const urlsToClassify = sampleLimit > 0 ? allUrls.slice(0, sampleLimit) : allUrls;
  if (sampleLimit > 0) console.log(`Limiting to first ${sampleLimit} URLs for testing\n`);

  console.log(`Classifying ${urlsToClassify.length} images (concurrency=${concurrency})...`);
  const classifications = await classifyAll(urlsToClassify, concurrency);

  // Stats
  const kept = [...classifications.values()].filter((c) => c.action === "keep");
  const removed = [...classifications.values()].filter((c) => c.action === "remove");

  console.log(`\nClassification results:`);
  console.log(`  Keep:   ${kept.length}`);
  console.log(`  Remove: ${removed.length}`);

  // Breakdown of keep reasons (to check for errors)
  const keepReasonCounts = new Map<string, number>();
  for (const c of kept) {
    const key = c.reason.startsWith("error:") ? c.reason : c.reason.toLowerCase().slice(0, 50);
    keepReasonCounts.set(key, (keepReasonCounts.get(key) ?? 0) + 1);
  }
  console.log(`\nKeep reasons (top 15):`);
  const sortedKeep = [...keepReasonCounts.entries()].sort((a, b) => b[1] - a[1]);
  for (const [reason, count] of sortedKeep.slice(0, 15)) {
    console.log(`  ${count}× ${reason}`);
  }

  // Breakdown by removal reason
  const reasonCounts = new Map<string, number>();
  for (const c of removed) {
    const key = c.reason.toLowerCase();
    reasonCounts.set(key, (reasonCounts.get(key) ?? 0) + 1);
  }
  if (reasonCounts.size > 0) {
    console.log(`\nRemoval reasons:`);
    const sorted = [...reasonCounts.entries()].sort((a, b) => b[1] - a[1]);
    for (const [reason, count] of sorted.slice(0, 20)) {
      console.log(`  ${count}× ${reason}`);
    }
  }

  // Show sample removals
  const removeSamples = [...classifications.entries()]
    .filter(([, c]) => c.action === "remove")
    .slice(0, 10);
  if (removeSamples.length > 0) {
    console.log(`\nSample removals:`);
    for (const [url, c] of removeSamples) {
      console.log(`  [${c.reason}] ${url}`);
    }
  }

  // Step 3: Build removal map and update DB
  const removeSet = new Set(
    [...classifications.entries()]
      .filter(([, c]) => c.action === "remove")
      .map(([url]) => url)
  );

  console.log(`\nApplying updates to listings...`);
  let totalUpdated = 0;
  let totalCleared = 0;
  let totalUrlsRemoved = 0;

  for (const listing of listings) {
    const original = listing.photos as string[];
    if (!Array.isArray(original)) continue;

    // Filter out removed URLs and deduplicate
    const seen = new Set<string>();
    const filtered: string[] = [];
    for (const url of original) {
      if (removeSet.has(url)) continue;
      if (seen.has(url)) continue;
      seen.add(url);
      filtered.push(url);
    }

    const urlsRemoved = original.length - filtered.length;
    if (urlsRemoved === 0) continue;

    totalUrlsRemoved += urlsRemoved;
    totalUpdated++;

    const newPhotos = filtered.length > 0 ? filtered : null;
    if (newPhotos === null) totalCleared++;

    if (dryRun) {
      console.log(
        `  [DRY RUN] "${listing.name}" (id=${listing.id}): ${original.length} → ${filtered.length} photos (-${urlsRemoved})`
      );
    } else {
      await prisma.listing.update({
        where: { id: listing.id },
        data: { photos: newPhotos ?? Prisma.JsonNull },
      });
    }
  }

  // Summary
  console.log("\n=== Summary ===");
  console.log(`Unique URLs classified: ${classifications.size}`);
  console.log(`  Kept:                 ${kept.length}`);
  console.log(`  Removed:              ${removed.length}`);
  console.log(`Listings updated:       ${totalUpdated}`);
  console.log(`Listings cleared (0):   ${totalCleared}`);
  console.log(`Total URL refs removed: ${totalUrlsRemoved}`);

  if (dryRun) console.log("\n=== DRY RUN — no changes written ===");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Audit failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
