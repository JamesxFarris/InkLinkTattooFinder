import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const DRY_RUN = !process.argv.includes("--apply");

async function dedup() {
  if (DRY_RUN) {
    console.log("=== DRY RUN (pass --apply to delete duplicates) ===\n");
  }

  // Find all duplicate groups (same name + city)
  const dupeGroups: { name: string; cityId: number }[] =
    await prisma.$queryRawUnsafe(
      `SELECT name, "cityId" FROM "Listing" WHERE status = 'active' GROUP BY name, "cityId" HAVING COUNT(*) > 1`
    );

  console.log(`Found ${dupeGroups.length} duplicate groups\n`);

  let deletedCount = 0;
  let skippedCount = 0;

  for (const g of dupeGroups) {
    const listings = await prisma.listing.findMany({
      where: { name: g.name, cityId: g.cityId, status: "active" },
      select: {
        id: true,
        name: true,
        slug: true,
        address: true,
        ownerId: true,
        googleRating: true,
        googleReviewCount: true,
        instagramUrl: true,
        _count: { select: { categories: true, claims: true } },
      },
      orderBy: { id: "asc" },
    });

    // Group by address to find true duplicates vs multi-location
    const byAddress = new Map<string, typeof listings>();
    for (const l of listings) {
      const addr = l.address || "no-address";
      if (!byAddress.has(addr)) byAddress.set(addr, []);
      byAddress.get(addr)!.push(l);
    }

    for (const [addr, group] of byAddress) {
      if (group.length < 2) continue;

      // Pick the best one to keep: prefer one with owner, then most categories, then lowest id
      const sorted = [...group].sort((a, b) => {
        // Prefer claimed listings
        if (a.ownerId && !b.ownerId) return -1;
        if (!a.ownerId && b.ownerId) return 1;
        // Prefer more categories
        if (a._count.categories !== b._count.categories)
          return b._count.categories - a._count.categories;
        // Prefer lower id (original)
        return a.id - b.id;
      });

      const keep = sorted[0];
      const toDelete = sorted.slice(1);

      console.log(
        `${g.name} (${addr}): keeping id=${keep.id} slug=${keep.slug}, deleting ${toDelete.map((d) => `id=${d.id} slug=${d.slug}`).join(", ")}`
      );

      if (!DRY_RUN) {
        for (const d of toDelete) {
          // Delete related records first
          await prisma.listing.update({
            where: { id: d.id },
            data: { status: "inactive" },
          });
          deletedCount++;
        }
      } else {
        deletedCount += toDelete.length;
      }
    }

    // Check for different-address entries in same group
    if (byAddress.size > 1) {
      const singles = [...byAddress.entries()].filter(
        ([, g]) => g.length === 1
      );
      if (singles.length > 0) {
        skippedCount += singles.length;
        console.log(
          `  ^ Multi-location: kept separate entries at different addresses`
        );
      }
    }
  }

  console.log(`\n=== Summary ===`);
  console.log(`${DRY_RUN ? "Would mark" : "Marked"} ${deletedCount} listings as inactive`);
  console.log(`Skipped ${skippedCount} multi-location entries`);

  const remaining = await prisma.listing.count({
    where: { status: "active" },
  });
  console.log(`Active listings ${DRY_RUN ? "would be" : "now"}: ${remaining}${DRY_RUN ? ` - ${deletedCount} = ${remaining - deletedCount}` : ""}`);
}

dedup().then(() => prisma.$disconnect());
