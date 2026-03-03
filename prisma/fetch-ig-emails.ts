/**
 * Scrape emails from Instagram bios for listings that have an Instagram URL
 * but no email address.
 *
 * Flow:
 * 1. Get listings with instagramUrl but no email
 * 2. Apify scrapes profile details (bio, external URL, etc.)
 * 3. Regex-extract emails from bio text
 * 4. Update listing email in DB
 *
 * Usage:
 *   npx tsx prisma/fetch-ig-emails.ts                    # dry-run
 *   npx tsx prisma/fetch-ig-emails.ts --apply            # write to DB
 *   npx tsx prisma/fetch-ig-emails.ts --apply --limit 50 # first 50 only
 */

import { PrismaClient } from "@prisma/client";
import { ApifyClient } from "apify-client";
import * as fs from "fs";
import * as path from "path";

// ── Config ──────────────────────────────────────────────────────────

const APIFY_TOKEN = process.env.APIFY_TOKEN!;
if (!APIFY_TOKEN) {
  console.error("Missing APIFY_TOKEN env var");
  process.exit(1);
}

const BATCH_SIZE = 100; // profiles per Apify run

const args = process.argv.slice(2);
const DRY_RUN = !args.includes("--apply");
const LIMIT = (() => {
  const idx = args.indexOf("--limit");
  return idx !== -1 && args[idx + 1] ? parseInt(args[idx + 1], 10) : 0;
})();

const prisma = new PrismaClient();
const apify = new ApifyClient({ token: APIFY_TOKEN });

// ── Helpers ─────────────────────────────────────────────────────────

function extractUsername(url: string): string | null {
  try {
    const cleaned = url.replace(/\/$/, "").toLowerCase();
    const match = cleaned.match(/instagram\.com\/([a-z0-9._]+)/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

function extractEmails(text: string): string[] {
  if (!text) return [];
  // Standard email regex, case-insensitive
  const matches = text.match(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g);
  if (!matches) return [];
  // Deduplicate and lowercase
  return [...new Set(matches.map((e) => e.toLowerCase()))];
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ── Apify: Scrape Instagram profile details ─────────────────────────

interface ProfileResult {
  username?: string;
  biography?: string;
  externalUrl?: string;
  externalUrlShimmed?: string;
  contactPhoneNumber?: string;
  publicEmail?: string;
  businessEmail?: string;
  [key: string]: unknown;
}

async function scrapeProfiles(
  usernames: string[]
): Promise<Map<string, { bio: string; externalUrl: string; publicEmail: string }>> {
  console.log(`\nStarting Apify scrape for ${usernames.length} profiles...`);

  const urls = usernames.map((u) => `https://www.instagram.com/${u}/`);

  const run = await apify.actor("apify/instagram-scraper").call({
    directUrls: urls,
    resultsType: "details",
    resultsLimit: 1,
    searchType: "user",
    searchLimit: 1,
  });

  const { items } = await apify.dataset(run.defaultDatasetId).listItems();
  console.log(`Apify returned ${items.length} profile results`);

  const result = new Map<string, { bio: string; externalUrl: string; publicEmail: string }>();

  for (const item of items as ProfileResult[]) {
    const username = (item.username || "").toLowerCase();
    if (!username) continue;

    result.set(username, {
      bio: item.biography || "",
      externalUrl: item.externalUrl || item.externalUrlShimmed || "",
      publicEmail: item.publicEmail || item.businessEmail || "",
    });
  }

  console.log(`Got details for ${result.size} profiles`);
  return result;
}

// ── Outreach-sent tracking ──────────────────────────────────────────

const SENT_FILE = path.join(__dirname, "outreach-sent.json");

function loadSentIds(): Set<number> {
  try {
    const data = fs.readFileSync(SENT_FILE, "utf-8");
    return new Set(JSON.parse(data) as number[]);
  } catch {
    return new Set();
  }
}

function saveSentIds(ids: Set<number>) {
  fs.writeFileSync(SENT_FILE, JSON.stringify([...ids].sort((a, b) => a - b), null, 2));
}

// ── Main ────────────────────────────────────────────────────────────

async function main() {
  console.log(`Mode: ${DRY_RUN ? "DRY RUN" : "APPLY (writing to DB)"}`);

  // 1. Get listings with Instagram but no email
  const listings = await prisma.listing.findMany({
    where: {
      status: "active",
      instagramUrl: { not: null },
      OR: [{ email: null }, { email: "" }],
    },
    select: {
      id: true,
      name: true,
      instagramUrl: true,
    },
    orderBy: { id: "asc" },
    ...(LIMIT > 0 ? { take: LIMIT } : {}),
  });

  console.log(`Found ${listings.length} listings with Instagram but no email`);

  // 2. Build username → listing map
  const usernameToListings = new Map<string, { id: number; name: string }[]>();
  for (const listing of listings) {
    const username = extractUsername(listing.instagramUrl!);
    if (!username) {
      console.log(`  Skipping listing ${listing.id} — bad IG URL: ${listing.instagramUrl}`);
      continue;
    }
    if (!usernameToListings.has(username)) usernameToListings.set(username, []);
    usernameToListings.get(username)!.push({ id: listing.id, name: listing.name });
  }

  const allUsernames = [...usernameToListings.keys()];
  console.log(`\n${allUsernames.length} unique Instagram usernames to scrape`);

  // 3. Load outreach-sent tracking (so we mark new emails as "already reached")
  const sentIds = DRY_RUN ? new Set<number>() : loadSentIds();
  console.log(`Outreach-sent tracking: ${sentIds.size} listings already tracked`);

  // 4. Process in batches
  let totalFound = 0;
  let totalUpdated = 0;

  for (let i = 0; i < allUsernames.length; i += BATCH_SIZE) {
    const batch = allUsernames.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(allUsernames.length / BATCH_SIZE);
    console.log(`\n── Batch ${batchNum}/${totalBatches} (${batch.length} profiles) ──`);

    const profiles = await scrapeProfiles(batch);

    for (const [username, data] of profiles) {
      const associatedListings = usernameToListings.get(username);
      if (!associatedListings) continue;

      // Try to find email from multiple sources
      let email: string | null = null;

      // Source 1: publicEmail / businessEmail field from IG
      if (data.publicEmail && data.publicEmail.includes("@")) {
        email = data.publicEmail.toLowerCase();
      }

      // Source 2: Extract from bio text
      if (!email) {
        const bioEmails = extractEmails(data.bio);
        if (bioEmails.length > 0) {
          email = bioEmails[0];
        }
      }

      // Source 3: Extract from external URL (some link to mailto: or have email in URL)
      if (!email && data.externalUrl) {
        const urlEmails = extractEmails(data.externalUrl);
        if (urlEmails.length > 0) {
          email = urlEmails[0];
        }
      }

      if (email) {
        totalFound++;
        for (const listing of associatedListings) {
          console.log(`  ✓ ${listing.name} (@${username}) → ${email}`);
          if (!DRY_RUN) {
            await prisma.listing.update({
              where: { id: listing.id },
              data: { email },
            });
            // Mark as "already outreached" so send-claim-emails.ts won't auto-email them
            sentIds.add(listing.id);
            saveSentIds(sentIds);
            totalUpdated++;
          }
        }
      }
    }

    // Brief pause between batches to be nice to Apify
    if (i + BATCH_SIZE < allUsernames.length) {
      console.log("Waiting 5s before next batch...");
      await sleep(5000);
    }
  }

  console.log(`\n── Summary ──`);
  console.log(`Profiles scraped: ${allUsernames.length}`);
  console.log(`Emails found: ${totalFound}`);
  if (DRY_RUN) {
    console.log(`Listings would be updated: ${totalFound} (dry run — use --apply to write)`);
  } else {
    console.log(`Listings updated: ${totalUpdated}`);
  }

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  prisma.$disconnect();
  process.exit(1);
});
