import { PrismaClient } from "@prisma/client";
import { GoogleGenerativeAI } from "@google/generative-ai";

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY!;
if (!GOOGLE_API_KEY) {
  console.error("Missing GOOGLE_API_KEY env var");
  process.exit(1);
}

const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const STYLE_KEYWORDS = [
  "traditional", "realism", "realistic", "japanese", "neo-traditional",
  "neo traditional", "blackwork", "fine line", "fineline", "watercolor",
  "tribal", "new school", "old school", "chicano", "geometric", "minimalist",
  "dotwork", "trash polka", "illustrative", "biomechanical", "surrealism",
  "portrait", "lettering", "calligraphy", "american traditional", "irezumi",
  "anime", "black and grey", "black and gray", "color realism",
];

const BATCH_SIZE = 10;
const DELAY_MS = 2000;
const DRY_RUN = !process.argv.includes("--apply");

function mentionsStyles(desc: string): boolean {
  const lower = desc.toLowerCase();
  return STYLE_KEYWORDS.some((k) => lower.includes(k));
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function cleanBatch(
  listings: { id: number; name: string; description: string }[]
): Promise<Map<number, string>> {
  const prompt = `You are editing tattoo shop descriptions for a directory website. For each description below, remove any mentions of specific tattoo styles, techniques, or specializations (e.g. "realism", "traditional", "Japanese", "fine line", "geometric", "black and grey", "anime", "illustrative", "color realism", etc.). Keep everything else intact — the shop's story, location details, services, atmosphere, experience, hours, etc. The result should still read naturally as a complete sentence/paragraph. If removing style mentions leaves an awkward or empty sentence, rewrite minimally to keep it flowing. Do NOT add any new information.

Return ONLY a JSON object mapping the listing ID to the cleaned description. No markdown fences, no extra text.

${listings.map((l) => `ID ${l.id} | ${l.name}:\n${l.description}`).join("\n\n")}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();

  // Parse JSON - strip markdown fences if present
  const jsonStr = text.replace(/^```json?\n?/, "").replace(/\n?```$/, "");
  const parsed = JSON.parse(jsonStr) as Record<string, string>;

  const map = new Map<number, string>();
  for (const [idStr, desc] of Object.entries(parsed)) {
    map.set(Number(idStr), desc);
  }
  return map;
}

async function main() {
  console.log(DRY_RUN ? "DRY RUN (use --apply to write changes)" : "APPLYING CHANGES");

  const listings = await prisma.listing.findMany({
    where: { ownerId: null, description: { not: null } },
    select: { id: true, name: true, description: true },
  });

  const affected = listings.filter(
    (l) => l.description && mentionsStyles(l.description)
  ) as { id: number; name: string; description: string }[];

  console.log(`Found ${affected.length} unclaimed listings with style mentions\n`);

  let updated = 0;
  let errors = 0;

  for (let i = 0; i < affected.length; i += BATCH_SIZE) {
    const batch = affected.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(affected.length / BATCH_SIZE);

    console.log(`Batch ${batchNum}/${totalBatches} (${batch.length} listings)...`);

    try {
      const cleaned = await cleanBatch(batch);

      for (const listing of batch) {
        const newDesc = cleaned.get(listing.id);
        if (!newDesc) {
          console.log(`  [SKIP] ID ${listing.id} — no result from AI`);
          continue;
        }

        if (newDesc === listing.description) {
          console.log(`  [SAME] ID ${listing.id} — no change needed`);
          continue;
        }

        if (DRY_RUN) {
          console.log(`  [WOULD UPDATE] ID ${listing.id} | ${listing.name}`);
          console.log(`    OLD: ${listing.description.slice(0, 120)}...`);
          console.log(`    NEW: ${newDesc.slice(0, 120)}...`);
        } else {
          await prisma.listing.update({
            where: { id: listing.id },
            data: { description: newDesc },
          });
          console.log(`  [UPDATED] ID ${listing.id} | ${listing.name}`);
        }
        updated++;
      }
    } catch (err) {
      errors++;
      console.error(`  [ERROR] Batch ${batchNum}:`, (err as Error).message);
    }

    if (i + BATCH_SIZE < affected.length) {
      await sleep(DELAY_MS);
    }
  }

  console.log(`\nDone! ${updated} updated, ${errors} batch errors`);
  await prisma.$disconnect();
}

main();
