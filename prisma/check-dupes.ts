import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function check() {
  const dupeGroups: { name: string; cityId: number }[] = await prisma.$queryRawUnsafe(
    `SELECT name, "cityId" FROM "Listing" WHERE status = 'active' GROUP BY name, "cityId" HAVING COUNT(*) > 1 LIMIT 10`
  );

  for (const g of dupeGroups) {
    const listings = await prisma.listing.findMany({
      where: { name: g.name, cityId: g.cityId, status: "active" },
      select: {
        id: true,
        name: true,
        slug: true,
        createdAt: true,
        googleRating: true,
        googleReviewCount: true,
        phone: true,
        website: true,
        instagramUrl: true,
        ownerId: true,
        address: true,
      },
    });
    console.log("\n--- " + g.name + " ---");
    for (const l of listings) {
      console.log(
        `  id=${l.id} slug=${l.slug} created=${l.createdAt.toISOString().slice(0, 10)} rating=${l.googleRating} reviews=${l.googleReviewCount} owner=${l.ownerId || "none"} address=${l.address}`
      );
    }
  }

  // Also check: do dupes have the same address?
  const addressDupes: { count: bigint }[] = await prisma.$queryRawUnsafe(
    `SELECT COUNT(*)::int as count FROM (
      SELECT name, "cityId" FROM "Listing" WHERE status = 'active' GROUP BY name, "cityId" HAVING COUNT(*) > 1
    ) sub`
  );
  console.log("\nTotal duplicate groups:", addressDupes[0]?.count);

  // Check if dupes share same address
  const sameAddress: { count: bigint }[] = await prisma.$queryRawUnsafe(
    `SELECT COUNT(*)::int as count FROM (
      SELECT name, "cityId", address FROM "Listing" WHERE status = 'active' GROUP BY name, "cityId", address HAVING COUNT(*) > 1
    ) sub`
  );
  console.log("Duplicate groups with same address:", sameAddress[0]?.count);
}

check().then(() => prisma.$disconnect());
