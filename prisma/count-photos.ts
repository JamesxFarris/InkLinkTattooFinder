import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const total = await prisma.listing.count({ where: { status: "active" } });

  // Listings with no photos at all
  const noPhotos = await prisma.listing.count({
    where: { status: "active", photos: { equals: Prisma.JsonNull } },
  });

  // Listings with Instagram but no photos
  const noPhotosWithInsta = await prisma.listing.count({
    where: {
      status: "active",
      instagramUrl: { not: null },
      photos: { equals: Prisma.JsonNull },
    },
  });

  // All listings with Instagram
  const withInstagram = await prisma.listing.count({
    where: { status: "active", instagramUrl: { not: null } },
  });

  // Listings with photos (non-null)
  const withPhotos = await prisma.listing.count({
    where: { status: "active", NOT: { photos: { equals: Prisma.JsonNull } } },
  });

  // Sample: how many photos do listings with photos typically have?
  const samplePhotos = await prisma.listing.findMany({
    where: { status: "active", NOT: { photos: { equals: Prisma.JsonNull } } },
    select: { name: true, photos: true },
    take: 5,
  });

  console.log("=== Photo Coverage ===");
  console.log(`Total active listings: ${total}`);
  console.log(`With photos: ${withPhotos}`);
  console.log(`No photos: ${noPhotos}`);
  console.log(`No photos BUT have Instagram: ${noPhotosWithInsta}`);
  console.log(`Total with Instagram: ${withInstagram}`);

  console.log("\n=== Sample Photo Counts ===");
  for (const l of samplePhotos) {
    const count = Array.isArray(l.photos) ? l.photos.length : 0;
    console.log(`  ${l.name}: ${count} photos`);
  }

  await prisma.$disconnect();
}

main();
