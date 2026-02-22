import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ── Phase 1: City-level geocoding via zippopotam.us ─────────────

async function geocodeZip(zip: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(`https://api.zippopotam.us/us/${zip}`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) return null;
    const data = await res.json();
    const place = data.places?.[0];
    if (!place) return null;
    const lat = parseFloat(place.latitude);
    const lng = parseFloat(place.longitude);
    if (isNaN(lat) || isNaN(lng)) return null;
    return { lat, lng };
  } catch {
    return null;
  }
}

async function geocodeCities() {
  const cities = await prisma.city.findMany({
    where: { latitude: null },
    select: {
      id: true,
      name: true,
      listings: {
        where: { zipCode: { not: null } },
        select: { zipCode: true },
        take: 1,
      },
    },
  });

  if (cities.length === 0) {
    console.log("All cities already have coordinates — skipping Phase 1\n");
    return;
  }

  console.log(`Phase 1: ${cities.length} cities without coordinates`);
  const geocodable = cities.filter((c) => c.listings.length > 0 && c.listings[0].zipCode);
  console.log(`  ${geocodable.length} geocodable (have zip codes)\n`);

  let success = 0;
  let failed = 0;

  for (let i = 0; i < geocodable.length; i++) {
    const city = geocodable[i];
    const zip = city.listings[0].zipCode!;
    const coords = await geocodeZip(zip);

    if (coords) {
      await prisma.city.update({
        where: { id: city.id },
        data: { latitude: coords.lat, longitude: coords.lng },
      });
      success++;
    } else {
      console.warn(`  Failed: ${city.name} (zip: ${zip})`);
      failed++;
    }

    if ((i + 1) % 100 === 0 || i === geocodable.length - 1) {
      console.log(`  [${i + 1}/${geocodable.length}] ${success} geocoded, ${failed} failed`);
    }
    if (i < geocodable.length - 1) await sleep(200);
  }

  console.log(`Phase 1 done: ${success} cities geocoded, ${failed} failed\n`);
}

// ── Phase 2: Listing-level geocoding via Census Bureau ──────────

interface CensusResult {
  result?: {
    addressMatches?: Array<{
      coordinates: { x: number; y: number };
      matchedAddress: string;
    }>;
  };
}

async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const params = new URLSearchParams({
      address: address,
      benchmark: "Public_AR_Current",
      format: "json",
    });
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const res = await fetch(
      `https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?${params}`,
      { signal: controller.signal }
    );
    clearTimeout(timeout);
    if (!res.ok) return null;
    const data: CensusResult = await res.json();
    const match = data.result?.addressMatches?.[0];
    if (!match) return null;
    return { lat: match.coordinates.y, lng: match.coordinates.x };
  } catch {
    return null;
  }
}

async function geocodeListings() {
  const listings = await prisma.listing.findMany({
    where: {
      latitude: null,
      address: { not: null },
    },
    select: {
      id: true,
      name: true,
      address: true,
    },
  });

  if (listings.length === 0) {
    console.log("All listings already have coordinates — skipping Phase 2\n");
    return;
  }

  console.log(`Phase 2: ${listings.length} listings without coordinates`);

  let success = 0;
  let failed = 0;

  for (let i = 0; i < listings.length; i++) {
    const listing = listings[i];
    const address = listing.address!;

    const coords = await geocodeAddress(address);

    if (coords) {
      await prisma.listing.update({
        where: { id: listing.id },
        data: { latitude: coords.lat, longitude: coords.lng },
      });
      success++;
    } else {
      failed++;
    }

    if ((i + 1) % 200 === 0 || i === listings.length - 1) {
      const pct = ((success / (i + 1)) * 100).toFixed(1);
      console.log(
        `  [${i + 1}/${listings.length}] ${success} geocoded (${pct}%), ${failed} failed`
      );
    }

    // Census geocoder can handle ~10 req/sec; 250ms is conservative and safe
    if (i < listings.length - 1) await sleep(250);
  }

  console.log(`Phase 2 done: ${success} listings geocoded, ${failed} failed\n`);
}

// ── Main ────────────────────────────────────────────────────────

async function main() {
  console.log("=== InkLink Geocoder ===\n");

  await geocodeCities();
  await geocodeListings();

  // Summary
  const citiesWithCoords = await prisma.city.count({ where: { latitude: { not: null } } });
  const totalCities = await prisma.city.count();
  const listingsWithCoords = await prisma.listing.count({ where: { latitude: { not: null } } });
  const totalListings = await prisma.listing.count();

  console.log("=== Summary ===");
  console.log(`  Cities:   ${citiesWithCoords}/${totalCities} have coordinates`);
  console.log(`  Listings: ${listingsWithCoords}/${totalListings} have coordinates`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Geocoding failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
