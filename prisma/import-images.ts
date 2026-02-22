import { PrismaClient } from "@prisma/client";
import { parse } from "csv-parse";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

// ── Helpers ─────────────────────────────────────────────────────────

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

const BLOCKED_DOMAINS = new Set([
  "businessesusa.com",
  "locmaps.com",
  "cdn.website.thryv.com",
]);

const BLOCKED_SUBSTRINGS = [
  "og-image",
  "placeholder",
  "transparent_placeholder",
  "favicon",
  "=s100",
  "=s50",
  "maps.googleapis.com/maps/api/staticmap",
];

function isValidImageUrl(url: string): boolean {
  const trimmed = url.trim();

  // Must start with http(s)
  if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
    return false;
  }

  // Reject short fragments
  if (trimmed.length < 30) {
    return false;
  }

  // Check blocked domains
  try {
    const hostname = new URL(trimmed).hostname.toLowerCase();
    for (const blocked of BLOCKED_DOMAINS) {
      if (hostname === blocked || hostname.endsWith(`.${blocked}`)) {
        return false;
      }
    }
  } catch {
    return false; // Invalid URL
  }

  // Check blocked substrings
  const lower = trimmed.toLowerCase();
  for (const sub of BLOCKED_SUBSTRINGS) {
    if (lower.includes(sub)) {
      return false;
    }
  }

  return true;
}

// ── CSV Parsing ─────────────────────────────────────────────────────

interface CsvRow {
  name: string;
  city: string;
  state_code: string;
  image_url_1?: string;
  image_url_2?: string;
  image_url_3?: string;
  image_url_4?: string;
  image_url_5?: string;
}

function parseCSV(filePath: string): Promise<CsvRow[]> {
  return new Promise((resolve, reject) => {
    const rows: CsvRow[] = [];
    fs.createReadStream(filePath)
      .pipe(parse({ columns: true, skip_empty_lines: true, relax_column_count: true }))
      .on("data", (row: CsvRow) => rows.push(row))
      .on("end", () => resolve(rows))
      .on("error", reject);
  });
}

// ── Main ────────────────────────────────────────────────────────────

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  if (dryRun) console.log("=== DRY RUN MODE (no writes) ===\n");

  // Step 1: Load all listings from DB
  console.log("Loading listings from database...");
  const listings = await prisma.listing.findMany({
    select: {
      id: true,
      name: true,
      photos: true,
      city: { select: { name: true, slug: true } },
      state: { select: { abbreviation: true } },
    },
  });
  console.log(`Loaded ${listings.length} listings`);

  // Build lookup map: normalize(name)|normalize(city)|stateCode → listing
  const listingMap = new Map<
    string,
    { id: number; name: string; photos: unknown; cityName: string; stateCode: string }
  >();
  for (const l of listings) {
    const key = `${normalize(l.name)}|${normalize(l.city.name)}|${l.state.abbreviation.toLowerCase()}`;
    listingMap.set(key, {
      id: l.id,
      name: l.name,
      photos: l.photos,
      cityName: l.city.name,
      stateCode: l.state.abbreviation,
    });
  }
  console.log(`Built lookup map with ${listingMap.size} entries\n`);

  // Step 2: Parse CSV
  const csvPath = path.join(__dirname, "data", "final_shops_with_images.csv");
  console.log("Parsing CSV...");
  const rows = await parseCSV(csvPath);
  console.log(`Parsed ${rows.length} CSV rows\n`);

  // Step 3: Match & update
  let matched = 0;
  let updated = 0;
  let skippedHasPhotos = 0;
  let skippedNoImages = 0;
  let noMatch = 0;
  let totalUrlsFiltered = 0;
  let totalUrlsKept = 0;

  const noMatchSamples: string[] = [];

  for (const row of rows) {
    const name = row.name?.trim() || "";
    const city = row.city?.trim() || "";
    const stateCode = row.state_code?.trim() || "";

    if (!name || !city || !stateCode) {
      noMatch++;
      continue;
    }

    // Collect image URLs
    const rawUrls = [
      row.image_url_1,
      row.image_url_2,
      row.image_url_3,
      row.image_url_4,
      row.image_url_5,
    ]
      .map((u) => u?.trim() || "")
      .filter(Boolean);

    const validUrls = rawUrls.filter(isValidImageUrl);
    totalUrlsFiltered += rawUrls.length - validUrls.length;
    totalUrlsKept += validUrls.length;

    if (validUrls.length === 0) {
      skippedNoImages++;
      continue;
    }

    // Look up listing
    const key = `${normalize(name)}|${normalize(city)}|${stateCode.toLowerCase()}`;
    const listing = listingMap.get(key);

    if (!listing) {
      noMatch++;
      if (noMatchSamples.length < 10) {
        noMatchSamples.push(`  "${name}" in ${city}, ${stateCode}`);
      }
      continue;
    }

    matched++;

    // Only update if no existing photos
    const existingPhotos = listing.photos as string[] | null;
    if (existingPhotos && Array.isArray(existingPhotos) && existingPhotos.length > 0) {
      skippedHasPhotos++;
      continue;
    }

    if (dryRun) {
      console.log(`[DRY RUN] Would update "${listing.name}" (id=${listing.id}) with ${validUrls.length} photos`);
      if (validUrls.length > 0) {
        console.log(`          Sample: ${validUrls[0]}`);
      }
    } else {
      await prisma.listing.update({
        where: { id: listing.id },
        data: { photos: validUrls },
      });
    }

    updated++;
  }

  // Summary
  console.log("\n=== Summary ===");
  console.log(`CSV rows:             ${rows.length}`);
  console.log(`Matched to listings:  ${matched}`);
  console.log(`Updated (new photos): ${updated}`);
  console.log(`Skipped (has photos): ${skippedHasPhotos}`);
  console.log(`Skipped (no images):  ${skippedNoImages}`);
  console.log(`No match in DB:       ${noMatch}`);
  console.log(`URLs filtered out:    ${totalUrlsFiltered}`);
  console.log(`URLs kept:            ${totalUrlsKept}`);

  if (noMatchSamples.length > 0) {
    console.log(`\nSample no-match rows:`);
    for (const s of noMatchSamples) console.log(s);
  }

  if (dryRun) {
    console.log("\n=== DRY RUN — no changes written ===");
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Import failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
