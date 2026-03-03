import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();
async function main() {
  const claimed = await p.listing.findMany({
    where: { ownerId: { not: null }, status: "active" },
    select: { slug: true, name: true, googleRating: true },
    take: 5,
  });
  for (const l of claimed) console.log(l.slug, "-", l.name, "- rating:", l.googleRating);
  await p.$disconnect();
}
main();
