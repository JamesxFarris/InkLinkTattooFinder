import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Targeted removal of specific broken external image URLs (403/404/406/429).
 * These are hotlinked images whose source sites block external requests.
 *
 * Usage:
 *   npx tsx prisma/remove-broken-urls.ts --dry-run   # preview changes
 *   npx tsx prisma/remove-broken-urls.ts              # apply changes
 */

const BROKEN_URLS = new Set([
  // 406 errors
  "https://darwinenriquez.com/wp-content/uploads/2026/01/shot_from_behind_of_a_woman_with_an_elegant_geometric_tattoo_running_down_her_spine-300x167.jpg",
  "https://inkhaven.tattoo/wp-content/uploads/2025/06/Ink-Haven-Store-Hours.jpeg",
  "https://backbayink.com/wp-content/uploads/2025/07/about_m.jpg",
  "https://thirdeyebuffalo.com/wp-content/uploads/Mark-Wengewicz-Tattoo-Art-20240209.webp",
  "https://atomic-tattoo.com/wp-content/uploads/2025/01/atomic-tattoo-send-us-referral@1400px-1024x771.png",
  "https://vixenbodyart.com/wp-content/uploads/sb-instagram-feed-images/380827014_1055116785837208_5503125777018857424_nfull.jpg",
  "https://inknationstudio.com/wp-content/uploads/2025/04/darwin-enriquez-artist.webp",
  "https://sorrymamachicago.com/wp-content/uploads/2025/04/L.webp",
  "https://levgentattoo.com/wp-content/uploads/2022/07/IMG_1615-min-576x1024.jpg",
  "https://highvisiongallery.com/wp-content/uploads/2023/05/about-jesus-blones-04.jpg",
  "https://444tattooatx.com/wp-content/uploads/sb-instagram-feed-images/467948940_2313152249046597_1669011467761131933_nfull.jpg",
  "https://resilienttattoopiercing.com/wp-content/uploads/2020/03/h3-img-7.jpg",
  "https://ohr.ive.mybluehost.me/website_3c86cac5/wp-content/uploads/2025/04/sleeve01_VSCO.jpeg",
  "https://www.tattoofever.com/images/slide02.jpg",
  "https://www.exoticpleasurestattoo.net/wp-content/uploads/2015/11/tattoo-hand-man-tint.jpg",
  // 403 errors
  "https://highresolutiontattoo.com/wp-content/uploads/2025/04/sugar-skull-cloud.jpg",
  "https://blackmagictattoodsm.com/wp-content/smush-webp/2024/05/Hero-1-scaled.jpg.webp",
  "https://www.thetattoolady.com/images/homepage/animation-flash.jpg",
  "https://www.truearttattoos.com/wp-content/uploads/sb-instagram-feed-images/564056653_18390073555126760_9099192324470598585_nthumb.jpg",
  "https://www.triumphtattoocompany.com/wp-content/uploads/2025/05/Ish_unnamed3-370x493.jpg",
  "https://victoryblvdtattoo.com/wp-content/themes/yootheme/cache/71/team-wade-718e599d.jpeg",
  "https://www.yankeetattoo.net/__static/jdj5jdewjc9xvuvecunzsfrwl2y0utfd/499617294_10161396299416938_7192444653264727811_n.jpg",
  "https://www.venturetattoo.com/images/artist_gal/1.jpg",
  "https://www.madamelazongastattoo.com/wp-content/uploads/2020/10/masectomy-350-558.jpg",
  "https://www.infamousinkstudio.com/__static/photo-1604374376934-2df6fad6519b",
  "https://images.zoogletools.com/s:bzglfiles/u/244511/a3aaa7522abf7236caf7157a3560dcff175603df/original/agbggheader2.png/!!/b:W1sicmVzaXplIiwxODAwXSxbIm1heCJdLFsid2UiXV0=/meta:eyJzcmNCdWNrZXQiOiJiemdsZmlsZXMifQ==.png",
  // 404 errors
  "https://www.enchanteddragontattoos.com/e24.jpg",
  "https://villagetattoonyc.com/wp-content/uploads/2019/04/3-1-987x1024.jpg",
  // 429 errors
  "https://legacytattoolounge.com/wp-content/uploads/2023/03/sweetie-petey-black.jpg",
  "https://frequencytattoo.com/wp-content/uploads/2020/06/john-howie.jpg",
]);

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  if (dryRun) console.log("=== DRY RUN MODE ===\n");

  console.log(`Broken URLs to remove: ${BROKEN_URLS.size}\n`);

  const listings = await prisma.listing.findMany({
    where: { photos: { not: { equals: null } } },
    select: { id: true, name: true, photos: true },
  });

  let updated = 0;
  let urlsRemoved = 0;

  for (const listing of listings) {
    const photos = listing.photos as string[];
    if (!Array.isArray(photos) || photos.length === 0) continue;

    const cleaned = photos.filter((url) => !BROKEN_URLS.has(url));
    const removed = photos.length - cleaned.length;

    if (removed === 0) continue;

    urlsRemoved += removed;
    updated++;

    const newPhotos = cleaned.length > 0 ? cleaned : null;

    console.log(
      `  "${listing.name}" (id=${listing.id}): ${photos.length} → ${cleaned.length} photos (-${removed})`
    );

    if (!dryRun) {
      await prisma.listing.update({
        where: { id: listing.id },
        data: { photos: newPhotos ?? undefined },
      });
    }
  }

  console.log("\n=== Summary ===");
  console.log(`Listings updated:  ${updated}`);
  console.log(`URLs removed:      ${urlsRemoved}`);
  if (dryRun) console.log("\n=== DRY RUN — no changes written ===");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
