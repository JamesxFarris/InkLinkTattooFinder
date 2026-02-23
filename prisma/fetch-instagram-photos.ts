/**
 * Fetch tattoo photos from Instagram for listings, filter with Gemini Vision,
 * upload to Cloudinary, and append to listing photos.
 *
 * Flow:
 * 1. Get listings with Instagram URLs
 * 2. Apify scrapes latest posts per profile
 * 3. Gemini Vision classifies images (tattoo art vs headshot/logo/meme)
 * 4. Upload approved photos to Cloudinary
 * 5. APPEND to existing photos (never removes existing)
 *
 * Usage:
 *   npx tsx prisma/fetch-instagram-photos.ts                    # dry-run, no-photos-only
 *   npx tsx prisma/fetch-instagram-photos.ts --apply            # write to DB
 *   npx tsx prisma/fetch-instagram-photos.ts --apply --all      # all listings with IG
 *   npx tsx prisma/fetch-instagram-photos.ts --apply --limit 50 # first 50 only
 */

import { PrismaClient, Prisma } from "@prisma/client";
import { ApifyClient } from "apify-client";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { v2 as cloudinary } from "cloudinary";

// ── Config ──────────────────────────────────────────────────────────

const APIFY_TOKEN = process.env.APIFY_TOKEN!;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY!;
if (!APIFY_TOKEN || !GOOGLE_API_KEY) {
  console.error("Missing APIFY_TOKEN or GOOGLE_API_KEY env vars");
  process.exit(1);
}
const POSTS_PER_PROFILE = 12;
const MAX_PHOTOS_TO_ADD = 6; // max new photos per listing
const GEMINI_BATCH_SIZE = 5; // images per Gemini request
const GEMINI_DELAY_MS = 1500; // delay between Gemini calls (rate limit: 60/min)

const args = process.argv.slice(2);
const DRY_RUN = !args.includes("--apply");
const ALL_LISTINGS = args.includes("--all");
const LIMIT = (() => {
  const idx = args.indexOf("--limit");
  return idx !== -1 && args[idx + 1] ? parseInt(args[idx + 1], 10) : 0;
})();

const prisma = new PrismaClient();
const apify = new ApifyClient({ token: APIFY_TOKEN });
const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ── Apify: Scrape Instagram posts ───────────────────────────────────

interface ScrapedPost {
  displayUrl?: string;
  url?: string;
  type?: string;
  imageUrl?: string;
  // Different actors return different field names
  [key: string]: unknown;
}

async function scrapeInstagramProfiles(usernames: string[]): Promise<Map<string, string[]>> {
  console.log(`\nStarting Apify scrape for ${usernames.length} profiles...`);

  const urls = usernames.map((u) => `https://www.instagram.com/${u}/`);

  // Use apify/instagram-scraper actor
  const run = await apify.actor("apify/instagram-scraper").call({
    directUrls: urls,
    resultsType: "posts",
    resultsLimit: POSTS_PER_PROFILE,
    searchType: "user",
    searchLimit: 1,
  });

  // Fetch results
  const { items } = await apify.dataset(run.defaultDatasetId).listItems();
  console.log(`Apify returned ${items.length} total posts`);

  // Group image URLs by username
  const result = new Map<string, string[]>();

  for (const item of items as ScrapedPost[]) {
    // Extract image URL (different fields depending on actor version)
    const imageUrl = item.displayUrl || item.imageUrl || item.url;
    if (!imageUrl || typeof imageUrl !== "string") continue;
    if (!imageUrl.startsWith("http")) continue;

    // Extract username from the post's owner or URL
    let username: string | null = null;
    if (typeof item.ownerUsername === "string") {
      username = item.ownerUsername;
    } else if (typeof item.profileUrl === "string") {
      username = extractUsername(item.profileUrl);
    }
    if (!username) continue;

    const lowerUser = username.toLowerCase();
    if (!result.has(lowerUser)) result.set(lowerUser, []);
    result.get(lowerUser)!.push(imageUrl);
  }

  console.log(`Found images for ${result.size} profiles`);
  return result;
}

// ── Gemini: Filter for tattoo photos ────────────────────────────────

async function filterTattooPhotos(imageUrls: string[]): Promise<string[]> {
  if (imageUrls.length === 0) return [];

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const approved: string[] = [];

  // Process in batches
  for (let i = 0; i < imageUrls.length; i += GEMINI_BATCH_SIZE) {
    const batch = imageUrls.slice(i, i + GEMINI_BATCH_SIZE);

    try {
      // Fetch images and convert to base64
      const imageParts = await Promise.all(
        batch.map(async (url) => {
          try {
            const res = await fetch(url);
            if (!res.ok) return null;
            const buffer = Buffer.from(await res.arrayBuffer());
            const mimeType = res.headers.get("content-type") || "image/jpeg";
            return {
              url,
              part: {
                inlineData: {
                  data: buffer.toString("base64"),
                  mimeType,
                },
              },
            };
          } catch {
            return null;
          }
        })
      );

      const validParts = imageParts.filter((p) => p !== null);
      if (validParts.length === 0) continue;

      const prompt = `You are filtering images for a tattoo shop's photo gallery on a business listing website.

For each image, classify it as TATTOO or REJECT.

TATTOO = photos of actual tattoo artwork on skin, tattoo designs/flash sheets, artists tattooing clients, close-ups of tattoo work, healed tattoos, tattoo portfolios
REJECT = headshots, selfies, group photos, logos, icons, memes, screenshots, text posts, promotional graphics, shop exterior/interior without tattoos visible, food, pets, random non-tattoo content

Respond with ONLY a JSON array of results, one per image, in order:
[{"index": 0, "verdict": "TATTOO"}, {"index": 1, "verdict": "REJECT"}, ...]`;

      const content = [
        prompt,
        ...validParts.map((p) => p.part),
      ];

      const result = await model.generateContent(content);
      const text = result.response.text();

      // Parse JSON from response
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const verdicts = JSON.parse(jsonMatch[0]);
        for (const v of verdicts) {
          if (v.verdict === "TATTOO" && validParts[v.index]) {
            approved.push(validParts[v.index].url);
          }
        }
      }
    } catch (err) {
      console.error(`  Gemini error on batch: ${err}`);
    }

    if (i + GEMINI_BATCH_SIZE < imageUrls.length) {
      await sleep(GEMINI_DELAY_MS);
    }
  }

  return approved;
}

// ── Cloudinary: Upload approved photos ──────────────────────────────

async function uploadToCloudinary(imageUrl: string): Promise<string | null> {
  try {
    const result = await cloudinary.uploader.upload(imageUrl, {
      folder: "inklink/listings",
      transformation: [
        { width: 1200, height: 1200, crop: "limit", quality: "auto", fetch_format: "auto" },
      ],
    });
    return result.secure_url;
  } catch (err) {
    console.error(`  Cloudinary upload failed: ${err}`);
    return null;
  }
}

// ── Main ────────────────────────────────────────────────────────────

async function main() {
  console.log(`Mode: ${DRY_RUN ? "DRY RUN (use --apply to write)" : "APPLYING CHANGES"}`);
  console.log(`Scope: ${ALL_LISTINGS ? "all listings with Instagram" : "listings with no photos + Instagram"}`);
  if (LIMIT) console.log(`Limit: ${LIMIT}`);

  // Get listings
  const where: Record<string, unknown> = {
    status: "active",
    instagramUrl: { not: null },
  };
  if (!ALL_LISTINGS) {
    where.photos = { equals: Prisma.JsonNull };
  }

  const listings = await prisma.listing.findMany({
    where,
    select: {
      id: true,
      name: true,
      instagramUrl: true,
      photos: true,
    },
    orderBy: { id: "asc" },
    ...(LIMIT > 0 ? { take: LIMIT } : {}),
  });

  console.log(`Found ${listings.length} listings to process\n`);

  // Extract usernames
  const usernameToListings = new Map<string, typeof listings>();
  for (const listing of listings) {
    const username = extractUsername(listing.instagramUrl!);
    if (!username) {
      console.log(`  SKIP: ${listing.name} — can't parse IG URL: ${listing.instagramUrl}`);
      continue;
    }
    const lower = username.toLowerCase();
    if (!usernameToListings.has(lower)) usernameToListings.set(lower, []);
    usernameToListings.get(lower)!.push(listing);
  }

  const usernames = Array.from(usernameToListings.keys());
  console.log(`Unique Instagram usernames: ${usernames.length}`);

  if (usernames.length === 0) {
    console.log("Nothing to do.");
    await prisma.$disconnect();
    return;
  }

  // Phase 1: Scrape Instagram via Apify (batch all usernames)
  // Apify can handle batches, but very large batches should be chunked
  const APIFY_BATCH = 100;
  const allScrapedImages = new Map<string, string[]>();

  for (let i = 0; i < usernames.length; i += APIFY_BATCH) {
    const batch = usernames.slice(i, i + APIFY_BATCH);
    console.log(`\n── Apify batch ${Math.floor(i / APIFY_BATCH) + 1}/${Math.ceil(usernames.length / APIFY_BATCH)} (${batch.length} profiles) ──`);

    try {
      const scraped = await scrapeInstagramProfiles(batch);
      for (const [user, urls] of scraped) {
        allScrapedImages.set(user, urls);
      }
    } catch (err) {
      console.error(`\n  Apify batch failed: ${err}`);
      console.log("  Continuing with images already scraped...\n");
      break;
    }
  }

  // Phase 2 & 3: Gemini filter + Cloudinary upload per listing
  let totalApproved = 0;
  let totalUploaded = 0;
  let listingsUpdated = 0;

  for (const [username, listingsForUser] of usernameToListings) {
    const imageUrls = allScrapedImages.get(username);
    if (!imageUrls || imageUrls.length === 0) {
      for (const l of listingsForUser) {
        console.log(`  · ${l.name} (@${username}) — no posts found`);
      }
      continue;
    }

    // Filter with Gemini
    console.log(`  Filtering ${imageUrls.length} images for @${username}...`);
    const approved = await filterTattooPhotos(imageUrls);
    totalApproved += approved.length;
    console.log(`    → ${approved.length}/${imageUrls.length} are tattoo photos`);

    if (approved.length === 0) {
      for (const l of listingsForUser) {
        console.log(`  · ${l.name} — no tattoo photos found`);
      }
      continue;
    }

    // Upload to Cloudinary and update each listing
    for (const listing of listingsForUser) {
      const existingPhotos: string[] = Array.isArray(listing.photos) ? (listing.photos as string[]) : [];
      const spotsAvailable = Math.max(0, MAX_PHOTOS_TO_ADD - 0); // add up to MAX new
      const toUpload = approved.slice(0, spotsAvailable);

      if (toUpload.length === 0) continue;

      if (DRY_RUN) {
        console.log(`  ✓ ${listing.name} — would add ${toUpload.length} photos (has ${existingPhotos.length} existing)`);
        listingsUpdated++;
        continue;
      }

      // Upload to Cloudinary
      const uploaded: string[] = [];
      for (const url of toUpload) {
        const cloudinaryUrl = await uploadToCloudinary(url);
        if (cloudinaryUrl) {
          uploaded.push(cloudinaryUrl);
          totalUploaded++;
        }
      }

      if (uploaded.length > 0) {
        const newPhotos = [...existingPhotos, ...uploaded];
        await prisma.listing.update({
          where: { id: listing.id },
          data: { photos: newPhotos },
        });
        listingsUpdated++;
        console.log(`  ✓ ${listing.name} — added ${uploaded.length} photos (total: ${newPhotos.length})`);
      }
    }
  }

  console.log("\n═══ Summary ═══");
  console.log(`Profiles scraped: ${allScrapedImages.size}/${usernames.length}`);
  console.log(`Tattoo photos approved (Gemini): ${totalApproved}`);
  console.log(`Photos uploaded (Cloudinary): ${totalUploaded}`);
  console.log(`Listings updated: ${listingsUpdated}`);

  if (DRY_RUN) {
    console.log(`\nDRY RUN — no changes written. Use --apply to save.`);
  }

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
