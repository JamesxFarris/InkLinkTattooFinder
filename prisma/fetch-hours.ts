/**
 * Fetch real business hours from Google Places API for all listings.
 *
 * Strategy:
 * 1. Listings WITH googlePlaceId → Place Details (cheapest)
 * 2. Listings WITHOUT googlePlaceId → Find Place by name+city, then Details
 *
 * Also backfills: googlePlaceId, googleRating, googleReviewCount
 *
 * Usage:
 *   npx tsx prisma/fetch-hours.ts              # dry-run (preview only)
 *   npx tsx prisma/fetch-hours.ts --apply      # write to database
 *   npx tsx prisma/fetch-hours.ts --apply --skip-search  # only use existing Place IDs
 */

import { PrismaClient } from "@prisma/client";

const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY || "AIzaSyCqd3yqLOTM2BiuDoUno4LojWenn-pZS-U";
const BATCH_DELAY_MS = 100; // delay between API calls to avoid rate limits
const CONCURRENCY = 5;

const prisma = new PrismaClient();

const args = process.argv.slice(2);
const DRY_RUN = !args.includes("--apply");
const SKIP_SEARCH = args.includes("--skip-search");
const LIMIT = (() => {
  const idx = args.indexOf("--limit");
  return idx !== -1 && args[idx + 1] ? parseInt(args[idx + 1], 10) : 0;
})();

// ── Google Places API helpers ───────────────────────────────────────

const DAY_NAMES = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

interface PlaceDetailsResult {
  placeId: string | null;
  hours: Record<string, string> | null;
  rating: number | null;
  reviewCount: number | null;
}

async function getPlaceDetails(placeId: string): Promise<PlaceDetailsResult> {
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(placeId)}&fields=opening_hours,rating,user_ratings_total&key=${GOOGLE_API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();

  if (data.status !== "OK" || !data.result) {
    return { placeId, hours: null, rating: null, reviewCount: null };
  }

  const result = data.result;
  const hours = parseGoogleHours(result.opening_hours);
  return {
    placeId,
    hours,
    rating: result.rating ?? null,
    reviewCount: result.user_ratings_total ?? null,
  };
}

async function findPlaceAndGetDetails(name: string, city: string, state: string): Promise<PlaceDetailsResult> {
  // Step 1: Find the place
  const query = `${name} tattoo ${city} ${state}`;
  const findUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(query)}&inputtype=textquery&fields=place_id&key=${GOOGLE_API_KEY}`;
  const findRes = await fetch(findUrl);
  const findData = await findRes.json();

  if (findData.status !== "OK" || !findData.candidates?.length) {
    return { placeId: null, hours: null, rating: null, reviewCount: null };
  }

  const placeId = findData.candidates[0].place_id;

  // Step 2: Get details
  await sleep(BATCH_DELAY_MS);
  return getPlaceDetails(placeId);
}

function parseGoogleHours(openingHours: any): Record<string, string> | null {
  if (!openingHours?.periods) return null;

  const result: Record<string, string> = {};

  // Check if it's 24/7 (single period with no close)
  if (openingHours.periods.length === 1 && !openingHours.periods[0].close) {
    for (const day of DAY_NAMES) {
      result[day] = "Open 24 hours";
    }
    return result;
  }

  for (const period of openingHours.periods) {
    const dayIndex = period.open?.day;
    if (dayIndex === undefined || dayIndex === null) continue;

    const dayName = DAY_NAMES[dayIndex];
    if (!dayName) continue;

    const openTime = formatGoogleTime(period.open?.time);
    const closeTime = formatGoogleTime(period.close?.time);

    if (openTime && closeTime) {
      // Some shops have multiple periods per day (e.g., lunch break)
      if (result[dayName]) {
        result[dayName] += `, ${openTime} - ${closeTime}`;
      } else {
        result[dayName] = `${openTime} - ${closeTime}`;
      }
    }
  }

  return Object.keys(result).length > 0 ? result : null;
}

function formatGoogleTime(time: string | undefined): string | null {
  if (!time || time.length !== 4) return null;
  const hour = parseInt(time.slice(0, 2), 10);
  const min = time.slice(2);
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${displayHour}:${min} ${period}`;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ── Main ────────────────────────────────────────────────────────────

async function main() {
  console.log(`Mode: ${DRY_RUN ? "DRY RUN (use --apply to write)" : "APPLYING CHANGES"}`);
  console.log(`Skip search: ${SKIP_SEARCH ? "yes (only existing Place IDs)" : "no (will search for missing)"}\n`);

  const listings = await prisma.listing.findMany({
    select: {
      id: true,
      name: true,
      googlePlaceId: true,
      city: { select: { name: true } },
      state: { select: { name: true, abbreviation: true } },
    },
    where: { status: "active" },
    orderBy: { id: "asc" },
    ...(LIMIT > 0 ? { take: LIMIT } : {}),
  });

  console.log(`Total active listings: ${listings.length}`);

  const withPlaceId = listings.filter((l) => l.googlePlaceId);
  const withoutPlaceId = listings.filter((l) => !l.googlePlaceId);
  console.log(`With Google Place ID: ${withPlaceId.length}`);
  console.log(`Without Google Place ID: ${withoutPlaceId.length}\n`);

  let updated = 0;
  let hoursFound = 0;
  let placeIdsBackfilled = 0;
  let failed = 0;
  let apiCalls = 0;

  // Process in batches with concurrency
  async function processBatch(batch: typeof listings, useFindPlace: boolean) {
    const chunks: (typeof listings)[] = [];
    for (let i = 0; i < batch.length; i += CONCURRENCY) {
      chunks.push(batch.slice(i, i + CONCURRENCY));
    }

    for (const chunk of chunks) {
      const results = await Promise.all(
        chunk.map(async (listing) => {
          try {
            let details: PlaceDetailsResult;
            if (useFindPlace) {
              details = await findPlaceAndGetDetails(
                listing.name,
                listing.city.name,
                listing.state.abbreviation
              );
              apiCalls += 2; // find + details
            } else {
              details = await getPlaceDetails(listing.googlePlaceId!);
              apiCalls++;
            }
            return { listing, details };
          } catch (err) {
            failed++;
            console.error(`  FAIL: ${listing.name} — ${err}`);
            return null;
          }
        })
      );

      for (const r of results) {
        if (!r) continue;
        const { listing, details } = r;

        if (details.hours) {
          hoursFound++;
          const dayCount = Object.keys(details.hours).length;
          console.log(`  ✓ ${listing.name} — ${dayCount} days`);
        } else {
          console.log(`  · ${listing.name} — no hours found`);
        }

        if (details.placeId && !listing.googlePlaceId) {
          placeIdsBackfilled++;
        }

        if (!DRY_RUN && (details.hours || details.placeId || details.rating !== null)) {
          const updateData: Record<string, any> = {};
          if (details.hours) updateData.hours = details.hours;
          if (details.placeId && !listing.googlePlaceId) updateData.googlePlaceId = details.placeId;
          if (details.rating !== null) updateData.googleRating = details.rating;
          if (details.reviewCount !== null) updateData.googleReviewCount = details.reviewCount;

          await prisma.listing.update({
            where: { id: listing.id },
            data: updateData,
          });
          updated++;
        }
      }

      await sleep(BATCH_DELAY_MS);
    }
  }

  // Phase 1: Listings with existing Place IDs
  if (withPlaceId.length > 0) {
    console.log("── Phase 1: Fetching hours for listings with Place IDs ──");
    await processBatch(withPlaceId, false);
  }

  // Phase 2: Listings without Place IDs (search first)
  if (!SKIP_SEARCH && withoutPlaceId.length > 0) {
    console.log("\n── Phase 2: Searching & fetching hours for remaining listings ──");
    await processBatch(withoutPlaceId, true);
  }

  console.log("\n═══ Summary ═══");
  console.log(`API calls made: ${apiCalls}`);
  console.log(`Hours found: ${hoursFound}/${listings.length}`);
  console.log(`Place IDs backfilled: ${placeIdsBackfilled}`);
  console.log(`Failed: ${failed}`);
  if (DRY_RUN) {
    console.log(`\nDRY RUN — no changes written. Use --apply to save.`);
  } else {
    console.log(`Database records updated: ${updated}`);
  }

  const estimatedCost = (apiCalls / 1000) * 17;
  console.log(`Estimated API cost: ~$${estimatedCost.toFixed(2)}`);

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
