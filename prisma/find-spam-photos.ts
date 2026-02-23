import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function find() {
  const listings = await prisma.listing.findMany({
    where: { status: "active", photos: { not: undefined } },
    select: { id: true, name: true, photos: true },
  });

  // Count how many listings each photo URL appears on
  const urlToListings = new Map<string, { id: number; name: string }[]>();

  for (const l of listings) {
    if (!Array.isArray(l.photos)) continue;
    for (const p of l.photos) {
      if (typeof p !== "string") continue;
      if (!urlToListings.has(p)) urlToListings.set(p, []);
      urlToListings.get(p)!.push({ id: l.id, name: l.name });
    }
  }

  // Show URLs that appear on more than 1 listing
  const dupes = [...urlToListings.entries()]
    .filter(([, shops]) => shops.length > 1)
    .sort((a, b) => b[1].length - a[1].length);

  console.log("=== Photos appearing on multiple listings ===");
  for (const [url, shops] of dupes.slice(0, 20)) {
    console.log(`\n${shops.length}x: ${url}`);
    for (const s of shops.slice(0, 5)) {
      console.log(`  - ${s.name} (id=${s.id})`);
    }
    if (shops.length > 5) console.log(`  ... and ${shops.length - 5} more`);
  }
  console.log(`\nTotal URLs on multiple listings: ${dupes.length}`);

  // Also find listings where ALL photos are the same URL (single spam image)
  const singlePhotoListings = listings.filter(
    (l) => Array.isArray(l.photos) && l.photos.length === 1
  );
  console.log(`\nListings with exactly 1 photo: ${singlePhotoListings.length}`);
}

find().then(() => prisma.$disconnect());
