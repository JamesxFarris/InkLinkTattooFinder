import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const total = await prisma.listing.count();
  const withPlaceId = await prisma.listing.count({ where: { googlePlaceId: { not: null } } });
  const withWebsite = await prisma.listing.count({ where: { website: { not: null } } });
  const withFacebook = await prisma.listing.count({ where: { facebookUrl: { not: null } } });
  const withInstagram = await prisma.listing.count({ where: { instagramUrl: { not: null } } });
  const withHours = await prisma.listing.count({ where: { NOT: { hours: { equals: null } } } });
  const withRating = await prisma.listing.count({ where: { googleRating: { not: null } } });

  console.log("=== Listing Data Summary ===");
  console.log(`Total listings: ${total}`);
  console.log(`With Google Place ID: ${withPlaceId}`);
  console.log(`With Google Rating: ${withRating}`);
  console.log(`With website: ${withWebsite}`);
  console.log(`With Facebook: ${withFacebook}`);
  console.log(`With Instagram: ${withInstagram}`);
  console.log(`With hours data: ${withHours}`);

  // Sample some hours data
  const sampleHours = await prisma.listing.findMany({
    where: { NOT: { hours: { equals: null } } },
    select: { name: true, hours: true },
    take: 3,
  });
  console.log("\n=== Sample Hours Data ===");
  for (const l of sampleHours) {
    console.log(`${l.name}:`, JSON.stringify(l.hours));
  }

  await prisma.$disconnect();
}

main();
