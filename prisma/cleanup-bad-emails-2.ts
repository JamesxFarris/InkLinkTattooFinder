/**
 * Cleanup false positive emails from batch scraping.
 * Usage: DATABASE_URL="..." npx tsx prisma/cleanup-bad-emails-2.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const BAD_EMAILS = [
  "info@demolink.org",
  "info.us@booksy.com",
  "info@stagheaddesigns.com",
  "hi@typemade.mx",
  "contact@fuulala.com",
  "email@yourbusiness.com",
  "example@gmail.com",
];

async function main() {
  for (const email of BAD_EMAILS) {
    const result = await prisma.listing.updateMany({
      where: { email },
      data: { email: null },
    });
    if (result.count > 0) {
      console.log(`Cleared ${result.count} listings with email: ${email}`);
    }
  }
  console.log("Done.");
  await prisma.$disconnect();
}

main();
