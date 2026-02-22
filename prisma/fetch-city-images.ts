import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
const RATE_LIMIT_MS = 1500; // ~40 req/min to stay under 50/hr limit

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchCityImage(cityName: string, stateAbbr: string): Promise<string | null> {
  const query = `${cityName} ${stateAbbr} city`;
  try {
    const url = new URL("https://api.unsplash.com/search/photos");
    url.searchParams.set("query", query);
    url.searchParams.set("per_page", "1");
    url.searchParams.set("orientation", "landscape");

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` },
    });

    if (res.status === 403 || res.status === 429) {
      console.warn(`  Rate limited — pausing 60s...`);
      await sleep(60000);
      return null;
    }

    if (!res.ok) {
      console.warn(`  Unsplash ${res.status} for "${query}"`);
      return null;
    }

    const data = await res.json();
    const photo = data?.results?.[0];
    return photo?.urls?.regular ?? null;
  } catch (err) {
    console.warn(`  Fetch failed for "${query}":`, err);
    return null;
  }
}

async function main() {
  if (!UNSPLASH_ACCESS_KEY) {
    console.error("UNSPLASH_ACCESS_KEY env var required");
    process.exit(1);
  }

  // Fetch cities without images, ordered by listing count (most shops first)
  const cities = await prisma.city.findMany({
    where: { imageUrl: null },
    include: {
      state: { select: { abbreviation: true } },
      _count: { select: { listings: { where: { status: "active" } } } },
    },
    orderBy: { listings: { _count: "desc" } },
  });

  console.log(`Found ${cities.length} cities without images`);

  // Limit per run to stay within Unsplash free tier (50/hr)
  const limit = parseInt(process.env.LIMIT || "45", 10);
  const batch = cities.slice(0, limit);
  console.log(`Processing top ${batch.length} cities (by shop count)\n`);

  let success = 0;
  let failed = 0;

  for (let i = 0; i < batch.length; i++) {
    const city = batch[i];
    const imageUrl = await fetchCityImage(city.name, city.state.abbreviation);

    if (imageUrl) {
      await prisma.city.update({
        where: { id: city.id },
        data: { imageUrl },
      });
      success++;
      console.log(`  [${i + 1}/${batch.length}] ${city.name}, ${city.state.abbreviation} (${city._count.listings} shops) — OK`);
    } else {
      failed++;
      console.log(`  [${i + 1}/${batch.length}] ${city.name}, ${city.state.abbreviation} — no image found`);
    }

    if (i < batch.length - 1) await sleep(RATE_LIMIT_MS);
  }

  console.log(`\nDone! ${success} images saved, ${failed} failed`);

  const totalWithImages = await prisma.city.count({ where: { imageUrl: { not: null } } });
  const totalCities = await prisma.city.count();
  console.log(`Cities with images: ${totalWithImages}/${totalCities}`);
  console.log(`\nRun again to fetch the next batch (resets hourly).`);
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
