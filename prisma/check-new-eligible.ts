import { PrismaClient } from "@prisma/client";
import * as fs from "fs";

const p = new PrismaClient();

async function main() {
  const sentData: number[] = JSON.parse(fs.readFileSync("prisma/outreach-sent.json", "utf-8"));
  const sentSet = new Set(sentData);
  console.log("Current outreach-sent count:", sentData.length);

  // claimed listing IDs to exclude
  const claims = await p.claim.findMany({
    where: { status: { in: ["pending", "approved"] } },
    select: { listingId: true },
    distinct: ["listingId"],
  });
  const claimedSet = new Set(claims.map((c) => c.listingId));

  // eligible: active, has email, unclaimed, not already sent
  const eligible = await p.listing.findMany({
    where: { status: "active", email: { not: null }, ownerId: null },
    select: { id: true, name: true, email: true },
    orderBy: { id: "asc" },
  });

  const notSent = eligible.filter((l) => !sentSet.has(l.id) && !claimedSet.has(l.id) && l.email && l.email.length > 0);
  console.log("New eligible (not yet sent, unclaimed):", notSent.length);
  for (const l of notSent) {
    console.log(`  #${l.id} ${l.name} → ${l.email}`);
  }

  // Remove these IDs from outreach-sent so the send script can pick them up
  const idsToRemove = new Set(notSent.map((l) => l.id));
  const cleaned = sentData.filter((id) => !idsToRemove.has(id));
  fs.writeFileSync("prisma/outreach-sent.json", JSON.stringify(cleaned, null, 2));
  console.log("\nRemoved", sentData.length - cleaned.length, "IDs from outreach-sent.json");
  console.log("outreach-sent.json now has", cleaned.length, "entries");

  await p.$disconnect();
}
main();
