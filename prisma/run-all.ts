/**
 * Master script: scrape all remaining emails, then send claim outreach emails.
 * Designed to run unattended overnight.
 */

import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

const DB_URL = process.env.DATABASE_URL!;
const RESEND_KEY = process.env.RESEND_API_KEY!;

if (!DB_URL) { console.error("Missing DATABASE_URL"); process.exit(1); }
if (!RESEND_KEY) { console.error("Missing RESEND_API_KEY"); process.exit(1); }

function run(cmd: string) {
  console.log(`\n>>> ${cmd}\n`);
  try {
    execSync(cmd, { stdio: "inherit", env: { ...process.env, DATABASE_URL: DB_URL, RESEND_API_KEY: RESEND_KEY }, timeout: 1800_000 });
  } catch (err: any) {
    console.error(`Command failed: ${err.message}`);
  }
}

async function main() {
  const startTime = Date.now();
  console.log("=== MASTER RUN: Scrape Emails + Send Outreach ===");
  console.log(`Started: ${new Date().toISOString()}\n`);

  // Phase 1: Scrape all remaining emails in batches of 500
  const BATCH_SIZE = 500;
  const MAX_BATCHES = 10; // safety cap: 10 * 500 = 5000

  for (let i = 0; i < MAX_BATCHES; i++) {
    console.log(`\n========== SCRAPE BATCH ${i + 1} ==========`);

    // Check progress file to see how many we've done
    const progressFile = path.join(__dirname, "scrape-progress.json");
    let attempted = 0;
    try {
      const data = fs.readFileSync(progressFile, "utf-8");
      attempted = JSON.parse(data).length;
    } catch {}

    console.log(`Previously attempted: ${attempted}`);

    // Run scraper batch
    run(`npx tsx prisma/scrape-emails.ts --apply --limit ${BATCH_SIZE} --delay 600`);

    // Check if we got through fewer than BATCH_SIZE (meaning we're done)
    let newAttempted = 0;
    try {
      const data = fs.readFileSync(progressFile, "utf-8");
      newAttempted = JSON.parse(data).length;
    } catch {}

    const processed = newAttempted - attempted;
    console.log(`Batch processed: ${processed} listings`);

    if (processed < BATCH_SIZE) {
      console.log("All listings processed — moving to email phase.");
      break;
    }
  }

  // Phase 2: Send claim emails
  console.log("\n\n========== SENDING CLAIM EMAILS ==========");
  // Send in batches of 100 with 500ms delay between each
  run("npx tsx prisma/send-claim-emails.ts --send --limit 5000 --delay 500");

  const elapsed = ((Date.now() - startTime) / 1000 / 60).toFixed(1);
  console.log(`\n=== COMPLETE === (${elapsed} minutes)`);
  console.log(`Finished: ${new Date().toISOString()}`);
}

main();
