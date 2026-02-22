import { PrismaClient, ListingType, ListingStatus } from "@prisma/client";
import { parse } from "csv-parse";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

// ── Helpers ─────────────────────────────────────────────────────────

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

/** Map CSV style names → our category slugs */
const STYLE_TO_SLUG: Record<string, string> = {
  "Traditional": "traditional",
  "Neo-Traditional": "neo-traditional",
  "Realism": "realism",
  "Japanese": "japanese",
  "Blackwork": "blackwork",
  "Watercolor": "watercolor",
  "Fine Line": "fine-line",
  "Tribal": "tribal",
  "Geometric": "geometric",
  "Minimalist": "minimalist",
  "Dotwork": "dotwork",
  "Chicano": "chicano",
  "Illustrative": "illustrative",
  "Script & Lettering": "script-lettering",
  "Trash Polka": "trash-polka",
  "New School": "new-school",
  "Surrealism": "surrealism",
  "Cover-Up": "cover-up",
  "Portrait": "portrait",
  "Biomechanical": "biomechanical",
  "Flash Tattoos": "flash-tattoos",
  "Black & Grey": "blackwork",
};

const SKIP_STYLES = new Set(["Custom Design"]);

/**
 * Parse working_hours string into a JSON hours object.
 *
 * Format: "Day,Open,Close" pipe-separated for multiple days.
 * Examples:
 *   "Wednesday,12,8PM"         → { wednesday: "12:00 PM - 8:00 PM" }
 *   "Monday,11AM,5PM|Tuesday,11AM,5PM" → { monday: "11:00 AM - 5:00 PM", tuesday: "11:00 AM - 5:00 PM" }
 */
function parseHours(raw: string): Record<string, string> | null {
  if (!raw || !raw.trim()) return null;

  const result: Record<string, string> = {};
  const entries = raw.split("|");

  for (const entry of entries) {
    const parts = entry.split(",").map((p) => p.trim());
    if (parts.length < 3) continue;

    const day = parts[0].toLowerCase();
    const open = normalizeTime(parts[1]);
    const close = normalizeTime(parts[2]);

    if (open && close) {
      result[day] = `${open} - ${close}`;
    }
  }

  return Object.keys(result).length > 0 ? result : null;
}

/**
 * Normalize time strings:
 *   "12"     → "12:00 PM"
 *   "5"      → "5:00 PM"
 *   "11AM"   → "11:00 AM"
 *   "5PM"    → "5:00 PM"
 *   "6:30PM" → "6:30 PM"
 *   "8:30PM" → "8:30 PM"
 */
function normalizeTime(raw: string): string | null {
  if (!raw) return null;
  raw = raw.trim();

  // Match: optional digits:digits, then optional AM/PM
  const match = raw.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?$/i);
  if (!match) return null;

  const hour = parseInt(match[1], 10);
  const minutes = match[2] || "00";
  let period = match[3]?.toUpperCase() || "";

  // If no AM/PM provided, infer: hours <= 6 or == 12 → PM, else AM-ish
  // But for tattoo shops, most open afternoon, so default to PM for ambiguous times
  if (!period) {
    period = "PM";
  }

  return `${hour}:${minutes} ${period}`;
}

// ── CSV Parsing ─────────────────────────────────────────────────────

interface ShopRow {
  name: string;
  website: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  state_code: string;
  postal_code: string;
  rating: string;
  reviews: string;
  working_hours: string;
  style_categories: string;
  services: string;
  artists: string;
  artist_styles: string;
  shop_description: string;
  has_piercings: string;
  has_tattoo_removal: string;
  has_flash_tattoos: string;
}

interface ImageRow {
  website: string;
  image_url: string;
  alt_text: string;
  source_score: string;
  image_rank: string;
}

function parseCSV<T>(filePath: string): Promise<T[]> {
  return new Promise((resolve, reject) => {
    const rows: T[] = [];
    fs.createReadStream(filePath)
      .pipe(parse({ columns: true, skip_empty_lines: true, relax_column_count: true }))
      .on("data", (row: T) => rows.push(row))
      .on("end", () => resolve(rows))
      .on("error", reject);
  });
}

// ── Main Import ─────────────────────────────────────────────────────

async function main() {
  const dataDir = path.join(__dirname, "data");

  console.log("Parsing CSV files...");
  const [shops, images] = await Promise.all([
    parseCSV<ShopRow>(path.join(dataDir, "enriched_tattoo_shops.csv")),
    parseCSV<ImageRow>(path.join(dataDir, "shop_images.csv")),
  ]);
  console.log(`Parsed ${shops.length} shops and ${images.length} images`);

  // ── Step 1: Build image lookup ──────────────────────────────────
  const imageMap = new Map<string, string[]>();
  // Sort images by rank first
  images.sort((a, b) => parseInt(a.image_rank) - parseInt(b.image_rank));
  for (const img of images) {
    const key = img.website?.trim();
    if (!key || !img.image_url?.trim()) continue;
    if (!imageMap.has(key)) imageMap.set(key, []);
    imageMap.get(key)!.push(img.image_url.trim());
  }
  console.log(`Built image map for ${imageMap.size} websites`);

  // ── Step 2: Ensure DC state exists ──────────────────────────────
  await prisma.state.upsert({
    where: { abbreviation: "DC" },
    update: {},
    create: { name: "District of Columbia", abbreviation: "DC", slug: "district-of-columbia" },
  });
  console.log("Ensured DC state exists");

  // ── Step 3: Build lookups ───────────────────────────────────────
  const allStates = await prisma.state.findMany();
  const stateMap = new Map<string, { id: number; slug: string }>();
  for (const s of allStates) {
    stateMap.set(s.abbreviation, { id: s.id, slug: s.slug });
  }

  const allCities = await prisma.city.findMany();
  const cityMap = new Map<string, number>();
  for (const c of allCities) {
    cityMap.set(`${c.slug}:${c.stateId}`, c.id);
  }

  const allCategories = await prisma.category.findMany();
  const categoryMap = new Map<string, number>();
  for (const cat of allCategories) {
    categoryMap.set(cat.slug, cat.id);
  }
  console.log(`Lookups: ${stateMap.size} states, ${cityMap.size} cities, ${categoryMap.size} categories`);

  // ── Step 4: Find unique cities to create ────────────────────────
  const citiesToCreate = new Map<string, { name: string; slug: string; stateId: number }>();
  for (const shop of shops) {
    const stateInfo = stateMap.get(shop.state_code?.trim());
    if (!stateInfo || !shop.city?.trim()) continue;
    const citySlug = slugify(shop.city.trim());
    const key = `${citySlug}:${stateInfo.id}`;
    if (!cityMap.has(key) && !citiesToCreate.has(key)) {
      citiesToCreate.set(key, {
        name: shop.city.trim(),
        slug: citySlug,
        stateId: stateInfo.id,
      });
    }
  }

  if (citiesToCreate.size > 0) {
    console.log(`Creating ${citiesToCreate.size} new cities...`);
    for (const [key, city] of citiesToCreate) {
      const created = await prisma.city.create({ data: city });
      cityMap.set(key, created.id);
    }
    console.log(`Created ${citiesToCreate.size} cities`);
  }

  // ── Step 5: Import listings in batches ──────────────────────────
  const BATCH_SIZE = 50;
  const usedSlugs = new Set<string>();

  // Pre-load existing slugs to avoid collisions
  const existingSlugs = await prisma.listing.findMany({ select: { slug: true } });
  for (const l of existingSlugs) usedSlugs.add(l.slug);

  let created = 0;
  let skipped = 0;

  for (let i = 0; i < shops.length; i += BATCH_SIZE) {
    const batch = shops.slice(i, i + BATCH_SIZE);
    const promises = batch.map(async (shop) => {
      try {
        // Resolve state
        const stateInfo = stateMap.get(shop.state_code?.trim());
        if (!stateInfo) {
          skipped++;
          return;
        }

        // Resolve city
        const citySlug = slugify(shop.city?.trim() || "");
        const cityKey = `${citySlug}:${stateInfo.id}`;
        const cityId = cityMap.get(cityKey);
        if (!cityId) {
          skipped++;
          return;
        }

        // Generate unique slug
        let slug = slugify(shop.name?.trim() || "shop");
        if (!slug) slug = "shop";
        if (usedSlugs.has(slug)) {
          slug = `${slug}-${citySlug}`;
        }
        if (usedSlugs.has(slug)) {
          let counter = 2;
          while (usedSlugs.has(`${slug}-${counter}`)) counter++;
          slug = `${slug}-${counter}`;
        }
        usedSlugs.add(slug);

        // Parse fields
        const rating = shop.rating ? parseFloat(shop.rating) : null;
        const reviewCount = shop.reviews ? parseInt(shop.reviews, 10) : null;
        const hours = parseHours(shop.working_hours);
        const piercingServices = shop.has_piercings?.trim().toUpperCase() === "TRUE";

        // Artists: split by semicolons
        const artists = shop.artists?.trim()
          ? shop.artists.split(";").map((a) => a.trim()).filter(Boolean)
          : null;

        // Services: split by semicolons
        const services = shop.services?.trim()
          ? shop.services.split(";").map((s) => s.trim()).filter(Boolean)
          : null;

        // Photos from image map
        const website = shop.website?.trim() || "";
        const photos = imageMap.get(website) || null;

        // Create listing
        const listing = await prisma.listing.create({
          data: {
            name: shop.name?.trim() || "Unknown Shop",
            slug,
            description: shop.shop_description?.trim() || null,
            type: "shop" as ListingType,
            phone: shop.phone?.trim() || null,
            website: website || null,
            address: shop.address?.trim() || null,
            cityId,
            stateId: stateInfo.id,
            zipCode: shop.postal_code?.trim() || null,
            googleRating: rating && !isNaN(rating) ? rating : null,
            googleReviewCount: reviewCount && !isNaN(reviewCount) ? reviewCount : null,
            piercingServices,
            hours: hours || undefined,
            artists: artists || undefined,
            services: services || undefined,
            photos: photos || undefined,
            status: "active" as ListingStatus,
          },
        });

        // ── Categories ──────────────────────────────────────────
        const categoryIds = new Set<number>();

        // Style categories from CSV
        if (shop.style_categories?.trim()) {
          const styles = shop.style_categories.split(";").map((s) => s.trim());
          for (const style of styles) {
            if (SKIP_STYLES.has(style)) continue;
            const catSlug = STYLE_TO_SLUG[style];
            if (catSlug) {
              const catId = categoryMap.get(catSlug);
              if (catId) categoryIds.add(catId);
            }
          }
        }

        // Boolean-based categories
        if (piercingServices) {
          const catId = categoryMap.get("piercing-studio");
          if (catId) categoryIds.add(catId);
        }
        if (shop.has_tattoo_removal?.trim().toUpperCase() === "TRUE") {
          const catId = categoryMap.get("tattoo-removal");
          if (catId) categoryIds.add(catId);
        }
        if (shop.has_flash_tattoos?.trim().toUpperCase() === "TRUE") {
          const catId = categoryMap.get("flash-tattoos");
          if (catId) categoryIds.add(catId);
        }

        // Create junction records
        if (categoryIds.size > 0) {
          await prisma.listingCategory.createMany({
            data: Array.from(categoryIds).map((categoryId) => ({
              listingId: listing.id,
              categoryId,
            })),
          });
        }

        created++;
      } catch (err) {
        console.error(`Error importing shop "${shop.name}":`, err);
        skipped++;
      }
    });

    await Promise.all(promises);

    if ((i + BATCH_SIZE) % 100 < BATCH_SIZE) {
      console.log(`Progress: ${Math.min(i + BATCH_SIZE, shops.length)}/${shops.length} (${created} created, ${skipped} skipped)`);
    }
  }

  console.log(`\nImport complete!`);
  console.log(`  Created: ${created} listings`);
  console.log(`  Skipped: ${skipped} listings`);
  console.log(`  Total images mapped: ${images.length}`);

  // Summary stats
  const totalListings = await prisma.listing.count();
  const totalCities = await prisma.city.count();
  const totalCategoryLinks = await prisma.listingCategory.count();
  console.log(`\nDatabase totals:`);
  console.log(`  Listings: ${totalListings}`);
  console.log(`  Cities: ${totalCities}`);
  console.log(`  Category links: ${totalCategoryLinks}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Import failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
