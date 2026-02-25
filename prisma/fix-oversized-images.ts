import { PrismaClient } from "@prisma/client";
import { v2 as cloudinary } from "cloudinary";
import { readFileSync } from "fs";
import { execSync } from "child_process";
import { join } from "path";

const prisma = new PrismaClient();

/**
 * Re-upload Ahrefs-flagged oversized external images to Cloudinary.
 * Reads the 160 URLs from the Ahrefs CSV, finds matching listings,
 * uploads to Cloudinary with auto-optimization, and replaces the URL.
 *
 * SKIPS verified/claimed listings (ownerId != null).
 *
 * Usage:
 *   npx tsx prisma/fix-oversized-images.ts --dry-run   # preview
 *   npx tsx prisma/fix-oversized-images.ts              # apply
 */

const DRY_RUN = process.argv.includes("--dry-run");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function loadOversizedUrls(): Set<string> {
  const csvPath = join(__dirname, "data/ahrefs_issues/Error-Image_file_size_too_large.csv");
  try {
    // CSV is UTF-16LE encoded, convert and extract URL column
    const raw = execSync(
      `iconv -f UTF-16LE -t UTF-8 "${csvPath}" | tail -n +2 | awk -F'\\t' '{gsub(/"/, "", $2); print $2}'`,
      { encoding: "utf-8" }
    );
    const urls = raw
      .split("\n")
      .map((u) => u.trim())
      .filter((u) => u.startsWith("http"));
    console.log(`Loaded ${urls.length} oversized URLs from Ahrefs CSV.\n`);
    return new Set(urls);
  } catch {
    console.error("Could not read Ahrefs CSV. Using empty set.");
    return new Set();
  }
}

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
    const msg = err instanceof Error ? err.message : String(err);
    // Don't spam full error for common failures
    if (msg.includes("not found") || msg.includes("404") || msg.includes("403")) {
      return null;
    }
    console.error(`    Upload error: ${msg.slice(0, 100)}`);
    return null;
  }
}

async function main() {
  if (DRY_RUN) console.log("══════ DRY RUN MODE ══════\n");
  else console.log("══════ APPLYING CHANGES ══════\n");

  const oversizedUrls = loadOversizedUrls();
  if (oversizedUrls.size === 0) return;

  // Load unverified listings with photos
  const listings = await prisma.listing.findMany({
    where: { status: "active", ownerId: null, photos: { not: { equals: null } } },
    select: { id: true, name: true, photos: true },
  });
  console.log(`Loaded ${listings.length} unverified listings with photos.\n`);

  // Find listings that have any of the oversized URLs
  type ListingToFix = { id: number; name: string; photos: string[]; toReplace: string[] };
  const toFix: ListingToFix[] = [];

  for (const listing of listings) {
    const photos = listing.photos as string[];
    if (!Array.isArray(photos)) continue;
    const matches = photos.filter((url) => oversizedUrls.has(url));
    if (matches.length > 0) {
      toFix.push({ id: listing.id, name: listing.name, photos, toReplace: matches });
    }
  }

  console.log(`Listings with oversized images: ${toFix.length}`);
  const totalImages = toFix.reduce((sum, l) => sum + l.toReplace.length, 0);
  console.log(`Total images to re-upload: ${totalImages}\n`);

  if (toFix.length === 0) {
    console.log("No matching oversized images found in unverified listings.");
    return;
  }

  // Track unique URLs so we don't upload the same image twice
  const uploadCache = new Map<string, string | null>();
  let totalUploaded = 0;
  let totalFailed = 0;
  let listingsUpdated = 0;

  for (const listing of toFix) {
    console.log(`  "${listing.name}" (id=${listing.id}): ${listing.toReplace.length} oversized`);

    if (DRY_RUN) {
      for (const url of listing.toReplace) {
        console.log(`    Would re-upload: ${url.slice(0, 80)}...`);
      }
      continue;
    }

    let newPhotos = [...listing.photos];
    let changed = false;

    for (const url of listing.toReplace) {
      let cloudinaryUrl: string | null;

      if (uploadCache.has(url)) {
        cloudinaryUrl = uploadCache.get(url)!;
      } else {
        cloudinaryUrl = await uploadToCloudinary(url);
        uploadCache.set(url, cloudinaryUrl);
      }

      if (cloudinaryUrl) {
        const idx = newPhotos.indexOf(url);
        if (idx !== -1) {
          newPhotos[idx] = cloudinaryUrl;
          changed = true;
          totalUploaded++;
          console.log(`    OK: ...${url.slice(-50)} → Cloudinary`);
        }
      } else {
        totalFailed++;
        console.log(`    SKIP: ${url.slice(0, 80)}... (upload failed)`);
      }
    }

    if (changed) {
      await prisma.listing.update({
        where: { id: listing.id },
        data: { photos: newPhotos },
      });
      listingsUpdated++;
    }
  }

  console.log("\n═══ Summary ═══");
  console.log(`Oversized URLs from Ahrefs: ${oversizedUrls.size}`);
  console.log(`Matched in unverified:      ${totalImages}`);
  console.log(`Listings updated:           ${listingsUpdated}`);
  console.log(`Images re-uploaded:         ${totalUploaded}`);
  console.log(`Upload failures:            ${totalFailed}`);
  if (DRY_RUN) console.log("\n(DRY RUN — no changes written)");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error("Failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
