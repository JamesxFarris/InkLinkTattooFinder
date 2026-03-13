/**
 * Outreach script — sends claim emails to unclaimed shop owners.
 *
 * Usage:
 *   npx tsx scripts/outreach.ts                 # dry run, first 25
 *   npx tsx scripts/outreach.ts --send           # actually send, first 25
 *   npx tsx scripts/outreach.ts --send --limit 50
 *   npx tsx scripts/outreach.ts --send --state TX
 *   npx tsx scripts/outreach.ts --send --state TX --limit 10
 *
 * Skips listings that:
 *   - Have no email address
 *   - Are already claimed (ownerId is set)
 *   - Have already been emailed (outreachSentAt is set)
 *   - Have opted out (outreachOptOut is true)
 */

import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { sendOutreachEmail } from "../src/lib/email";

const prisma = new PrismaClient();

const args = process.argv.slice(2);
const dryRun = !args.includes("--send");
const limit = (() => {
  const i = args.indexOf("--limit");
  return i !== -1 ? parseInt(args[i + 1], 10) : 25;
})();
const stateFilter = (() => {
  const i = args.indexOf("--state");
  return i !== -1 ? args[i + 1].toUpperCase() : null;
})();

async function main() {
  const where = {
    ownerId: null,
    status: "active" as const,
    email: { not: null },
    outreachSentAt: null,
    outreachOptOut: false,
    ...(stateFilter
      ? { city: { state: { abbreviation: stateFilter } } }
      : {}),
  };

  const total = await prisma.listing.count({ where });
  console.log(`\nEligible listings: ${total}`);
  console.log(`Batch size:        ${limit}`);
  console.log(`State filter:      ${stateFilter ?? "none"}`);
  console.log(`Mode:              ${dryRun ? "DRY RUN (pass --send to actually send)" : "LIVE"}\n`);

  const listings = await prisma.listing.findMany({
    where,
    take: limit,
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      email: true,
      city: {
        select: {
          name: true,
          slug: true,
          state: { select: { slug: true, abbreviation: true } },
        },
      },
    },
  });

  if (listings.length === 0) {
    console.log("No eligible listings found.");
    return;
  }

  let sent = 0;
  let failed = 0;

  for (const listing of listings) {
    const shopEmail = listing.email!;
    const cityName = listing.city.name;
    const citySlug = listing.city.slug;
    const stateSlug = listing.city.state.slug;

    if (dryRun) {
      console.log(`[dry run] Would email: ${listing.name} <${shopEmail}> (${cityName}, ${listing.city.state.abbreviation})`);
      continue;
    }

    const result = await sendOutreachEmail({
      listingId: listing.id,
      listingName: listing.name,
      listingSlug: listing.slug,
      cityName,
      stateSlug,
      citySlug,
      shopEmail,
    });

    if (result.success) {
      await prisma.listing.update({
        where: { id: listing.id },
        data: { outreachSentAt: new Date() },
      });
      console.log(`  sent: ${listing.name} <${shopEmail}>`);
      sent++;
    } else {
      console.error(`  FAILED: ${listing.name} <${shopEmail}> — ${result.error}`);
      failed++;
    }

    // Pace sends to stay well within Resend rate limits
    await new Promise((r) => setTimeout(r, 350));
  }

  if (!dryRun) {
    console.log(`\nDone. Sent: ${sent}  Failed: ${failed}  Remaining eligible: ${total - listings.length}`);
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
