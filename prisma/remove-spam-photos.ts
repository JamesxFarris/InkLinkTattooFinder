import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const DRY_RUN = !process.argv.includes("--apply");

/**
 * Remove spam photos that appear on multiple unrelated listings.
 * Photos shared across different businesses (not chain locations) are spam.
 */
async function clean() {
  if (DRY_RUN) {
    console.log("=== DRY RUN (pass --apply to remove spam photos) ===\n");
  }

  const listings = await prisma.listing.findMany({
    where: { status: "active", photos: { not: undefined } },
    select: { id: true, name: true, photos: true },
  });

  // Build URL → listings map
  const urlToListings = new Map<string, { id: number; name: string }[]>();
  for (const l of listings) {
    if (!Array.isArray(l.photos)) continue;
    for (const p of l.photos) {
      if (typeof p !== "string") continue;
      if (!urlToListings.has(p)) urlToListings.set(p, []);
      urlToListings.get(p)!.push({ id: l.id, name: l.name });
    }
  }

  // Find spam: photos on 3+ unrelated listings
  // (Cleopatra Ink chain shares photos legitimately, but the fbcdn valentine ones are spam)
  const spamUrls = new Set<string>();
  for (const [url, shops] of urlToListings) {
    if (shops.length < 3) continue;

    // Check if all shops share a common name prefix (chain stores = OK)
    const names = shops.map((s) => s.name.toLowerCase());
    const firstWords = names[0].split(" ").slice(0, 2).join(" ");
    const isChain = names.every((n) => n.startsWith(firstWords));

    if (!isChain) {
      spamUrls.add(url);
      console.log(
        `SPAM: ${url.slice(0, 80)}... (on ${shops.length} unrelated shops)`
      );
    }
  }

  // Also flag: photos on 2 unrelated listings that are fbcdn URLs
  // (these are Facebook shared posts, not real shop photos)
  for (const [url, shops] of urlToListings) {
    if (shops.length !== 2) continue;
    if (!url.includes("fbcdn.net")) continue;

    const names = shops.map((s) => s.name.toLowerCase());
    const firstWords = names[0].split(" ").slice(0, 2).join(" ");
    const isChain = names.every((n) => n.startsWith(firstWords));

    if (!isChain) {
      spamUrls.add(url);
    }
  }

  console.log(`\nTotal spam URLs found: ${spamUrls.size}`);

  // Remove spam photos from listings
  let listingsUpdated = 0;
  let photosRemoved = 0;

  for (const l of listings) {
    if (!Array.isArray(l.photos)) continue;

    const cleanPhotos = (l.photos as string[]).filter(
      (p) => typeof p === "string" && !spamUrls.has(p)
    );
    const removed = (l.photos as string[]).length - cleanPhotos.length;

    if (removed === 0) continue;

    photosRemoved += removed;
    listingsUpdated++;

    console.log(
      `  ${l.name} (id=${l.id}): removing ${removed} spam photo(s), keeping ${cleanPhotos.length}`
    );

    if (!DRY_RUN) {
      await prisma.listing.update({
        where: { id: l.id },
        data: { photos: cleanPhotos.length > 0 ? cleanPhotos : undefined },
      });
    }
  }

  console.log(`\n=== Summary ===`);
  console.log(
    `${DRY_RUN ? "Would update" : "Updated"} ${listingsUpdated} listings`
  );
  console.log(
    `${DRY_RUN ? "Would remove" : "Removed"} ${photosRemoved} spam photos`
  );
}

clean().then(() => prisma.$disconnect());
