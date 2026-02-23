/**
 * Scrape contact emails from tattoo shop websites and populate listing.email.
 *
 * For each listing with a website but no email:
 * 1. Fetch the homepage HTML
 * 2. Try common contact pages (/contact, /about, /contact-us, /about-us)
 * 3. Extract emails via regex + mailto link parsing
 * 4. Filter junk/platform emails, pick the best match
 * 5. Optionally write to DB
 *
 * Usage:
 *   npx tsx prisma/scrape-emails.ts                          # dry run, 50 listings
 *   npx tsx prisma/scrape-emails.ts --apply                  # write to DB
 *   npx tsx prisma/scrape-emails.ts --apply --limit 200      # first 200
 *   npx tsx prisma/scrape-emails.ts --limit 10 --delay 2000  # slow crawl
 *   npx tsx prisma/scrape-emails.ts --offset 100 --limit 50  # resume from 100
 */

import { PrismaClient } from "@prisma/client";
import * as cheerio from "cheerio";
import * as fs from "fs";
import * as path from "path";

// ── Config ──────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const DRY_RUN = !args.includes("--apply");

function getArgValue(flag: string, fallback: number): number {
  const idx = args.indexOf(flag);
  return idx !== -1 && args[idx + 1] ? parseInt(args[idx + 1], 10) : fallback;
}

const LIMIT = getArgValue("--limit", 50);
const DELAY_MS = getArgValue("--delay", 1000);
const OFFSET = getArgValue("--offset", 0);
const FETCH_TIMEOUT = 5000;

const PROGRESS_FILE = path.join(__dirname, "scrape-progress.json");

const CONTACT_PATHS = ["/contact", "/contact-us", "/about", "/about-us"];

// ── Blocklists ──────────────────────────────────────────────────────

const BLOCKED_DOMAINS = new Set([
  "wix.com",
  "squarespace.com",
  "sentry.io",
  "googleapis.com",
  "wordpress.com",
  "wordpress.org",
  "example.com",
  "gravatar.com",
  "w3.org",
  "schema.org",
  "facebook.com",
  "instagram.com",
  "twitter.com",
  "google.com",
  "googlemail.com",
  "sentry-next.wixpress.com",
  "wixpress.com",
  "squarespace-mail.com",
  "mailchimp.com",
  "mailgun.org",
  "sendgrid.net",
  "cloudflare.com",
  "gstatic.com",
  "yourdomain.com",
  "yoursite.com",
  "test.com",
  "email.com",
  "domain.com",
  "sampledomain.com",
  // Website builder / template / font emails that appear in page source
  "eyebytes.com",
  "webador.com",
  "latinotype.com",
  "latofonts.com",
  "godaddy.com",
  "secureserver.net",
  "weebly.com",
  "wixsite.com",
  "jimdo.com",
  "hubspot.com",
  "constantcontact.com",
  "shopify.com",
  "bigcommerce.com",
  "duda.co",
  "ionos.com",
  "bluehost.com",
  "hostgator.com",
  "namecheap.com",
  "att.net",
  "ndiscovered.com",
  "mysite.com",
  "rfuenzalida.com",
  "sudtipos.com",
  "indiantypefoundry.com",
  "sansoxygen.com",
  "triadmarketingsolutions.com",
  "iginomarini.com",
  "astigmatic.com",
  "relativedigitalmarketing.com",
  "examle.com",
  "doe.com",
  "sheri.sterup.com",
  "demolink.org",
  "booksy.com",
  "stagheaddesigns.com",
  "typemade.mx",
  "fuulala.com",
  "yourbusiness.com",
]);

const BLOCKED_PREFIXES = [
  "noreply",
  "no-reply",
  "no_reply",
  "donotreply",
  "do-not-reply",
  "webmaster",
  "postmaster",
  "mailer-daemon",
  "root@",
  "hostmaster",
  "abuse@",
  "support@wix",
  "support@squarespace",
  "admin@wix",
  "admin@squarespace",
  "wordpress@",
  "daemon@",
];

const PREFERRED_PREFIXES = [
  "info@",
  "hello@",
  "contact@",
  "studio@",
  "shop@",
  "booking@",
  "bookings@",
  "appointments@",
  "tattoo@",
  "ink@",
];

// ── Email extraction ────────────────────────────────────────────────

const EMAIL_REGEX = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g;

function extractEmailsFromHtml(html: string): string[] {
  const emails = new Set<string>();

  // 1. Regex scan of raw HTML
  const regexMatches = html.match(EMAIL_REGEX) || [];
  for (const e of regexMatches) {
    emails.add(e.toLowerCase());
  }

  // 2. Parse mailto: links with cheerio
  try {
    const $ = cheerio.load(html);
    $('a[href^="mailto:"]').each((_, el) => {
      const href = $(el).attr("href") || "";
      const emailPart = href.replace(/^mailto:/i, "").split("?")[0].trim();
      if (emailPart && emailPart.includes("@")) {
        emails.add(emailPart.toLowerCase());
      }
    });
  } catch {
    // cheerio parse failure — regex results are still fine
  }

  return [...emails];
}

function isBlockedEmail(email: string): boolean {
  const domain = email.split("@")[1];
  if (!domain) return true;

  // Check blocked domains
  for (const blocked of BLOCKED_DOMAINS) {
    if (domain === blocked || domain.endsWith("." + blocked)) return true;
  }

  // Check blocked prefixes
  const lower = email.toLowerCase();
  for (const prefix of BLOCKED_PREFIXES) {
    if (lower.startsWith(prefix)) return true;
  }

  // Must have a valid-looking TLD (at least 2 chars after last dot)
  const tld = domain.split(".").pop() || "";
  if (tld.length < 2) return true;

  // Filter out emails that look like CSS/JS artifacts (contain unusual patterns)
  if (email.includes("..") || email.startsWith(".") || email.endsWith(".")) return true;

  // Filter out image filenames that match email regex (e.g. name@2x.png)
  if (/\.(png|jpg|jpeg|gif|svg|webp|ico|css|js)$/i.test(email)) return true;

  // Filter out emails with typical font/template author patterns
  const local = email.split("@")[0];
  if (local.length > 40) return true; // absurdly long local part = probably not real

  // Block common font foundry / template emails
  const blockedEmails = new Set([
    // Font foundry / template author emails embedded in page source
    "impallari@gmail.com",
    "typesetit@att.net",
    "luciano@latinotype.com",
    "filler@godaddy.com",
    "hello@rfuenzalida.com",
    "info@mysite.com",
    "sudtipos@sudtipos.com",
    "info@indiantypefoundry.com",
    "jonpinhorn.typedesign@gmail.com",
    "anapbm@gmail.com",
    "amkryukov@gmail.com",
    "contact@sansoxygen.com",
    "support@triadmarketingsolutions.com",
    "jeanmarie_elroy@sheri.sterup.com",
    "micah@micahrich.com",
    "mail@iginomarini.com",
    "email@examle.com",
    "john@doe.com",
    "chris@relativedigitalmarketing.com",
    "astigma@astigmatic.com",
    "nkarasart@gmail.com",
    "example@gmail.com",
    "email@yourbusiness.com",
    "hi@typemade.mx",
    "info@demolink.org",
    "info.us@booksy.com",
    "info@stagheaddesigns.com",
    "contact@fuulala.com",
  ]);
  if (blockedEmails.has(lower)) return true;

  return false;
}

function getDomainFromUrl(websiteUrl: string): string | null {
  try {
    const url = new URL(websiteUrl);
    return url.hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return null;
  }
}

function pickBestEmail(emails: string[], websiteDomain: string | null): string | null {
  const valid = emails.filter((e) => !isBlockedEmail(e));
  if (valid.length === 0) return null;

  // Priority 1: email domain matches the shop's website domain
  if (websiteDomain) {
    const domainMatches = valid.filter((e) => {
      const emailDomain = e.split("@")[1];
      return emailDomain === websiteDomain || emailDomain?.endsWith("." + websiteDomain);
    });

    if (domainMatches.length > 0) {
      // Among domain matches, prefer known good prefixes
      for (const prefix of PREFERRED_PREFIXES) {
        const match = domainMatches.find((e) => e.startsWith(prefix));
        if (match) return match;
      }
      return domainMatches[0];
    }
  }

  // Priority 2: preferred prefixes (info@, hello@, contact@, etc.)
  for (const prefix of PREFERRED_PREFIXES) {
    const match = valid.find((e) => e.startsWith(prefix));
    if (match) return match;
  }

  // Priority 3: any valid email
  return valid[0];
}

// ── HTTP fetching ───────────────────────────────────────────────────

function normalizeUrl(url: string): string {
  let normalized = url.trim();
  if (!normalized.startsWith("http://") && !normalized.startsWith("https://")) {
    normalized = "https://" + normalized;
  }
  // Remove trailing slash for consistent path joining
  return normalized.replace(/\/+$/, "");
}

async function fetchPage(url: string): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; InkLinkBot/1.0; +https://inklinktattoofinder.com)",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      redirect: "follow",
    });

    clearTimeout(timeout);

    if (!response.ok) return null;

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("text/html") && !contentType.includes("text/plain") && !contentType.includes("application/xhtml")) {
      return null;
    }

    const text = await response.text();
    // Cap at 500KB to avoid memory issues on huge pages
    return text.slice(0, 500_000);
  } catch {
    return null;
  }
}

// ── Progress tracking ───────────────────────────────────────────────

function loadProgress(): Set<number> {
  try {
    const data = fs.readFileSync(PROGRESS_FILE, "utf-8");
    const ids: number[] = JSON.parse(data);
    return new Set(ids);
  } catch {
    return new Set();
  }
}

function saveProgress(ids: Set<number>) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify([...ids], null, 2));
}

// ── Main ────────────────────────────────────────────────────────────

const prisma = new PrismaClient();

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  console.log("=== InkLink Email Scraper ===");
  console.log(`Mode: ${DRY_RUN ? "DRY RUN" : "APPLY (writing to DB)"}`);
  console.log(`Limit: ${LIMIT} | Delay: ${DELAY_MS}ms | Offset: ${OFFSET}\n`);

  const progress = loadProgress();
  console.log(`Previously attempted: ${progress.size} listings\n`);

  // Query eligible listings
  const listings = await prisma.listing.findMany({
    where: {
      status: "active",
      website: { not: null },
      email: null,
      ownerId: null,
    },
    select: {
      id: true,
      name: true,
      website: true,
    },
    orderBy: { id: "asc" },
  });

  // Filter out already-attempted
  const eligible = listings.filter((l) => !progress.has(l.id));

  console.log(`Total eligible (active, has website, no email, unclaimed): ${listings.length}`);
  console.log(`After filtering already-attempted: ${eligible.length}`);

  const batch = eligible.slice(OFFSET, OFFSET + LIMIT);
  console.log(`Will process: ${batch.length}\n`);

  if (batch.length === 0) {
    console.log("Nothing to process.");
    await prisma.$disconnect();
    return;
  }

  let found = 0;
  let notFound = 0;
  let errors = 0;

  for (let i = 0; i < batch.length; i++) {
    const listing = batch[i];
    const baseUrl = normalizeUrl(listing.website!);
    const websiteDomain = getDomainFromUrl(baseUrl);

    let allEmails: string[] = [];
    let pagesChecked = 0;

    // Fetch homepage
    const homepageHtml = await fetchPage(baseUrl);
    if (homepageHtml) {
      allEmails.push(...extractEmailsFromHtml(homepageHtml));
      pagesChecked++;
    }

    // If no good emails from homepage, try contact/about pages
    const validFromHomepage = allEmails.filter((e) => !isBlockedEmail(e));
    if (validFromHomepage.length === 0 && homepageHtml !== null) {
      for (const subpath of CONTACT_PATHS) {
        const subUrl = baseUrl + subpath;
        await sleep(300); // small delay between subpage requests
        const subHtml = await fetchPage(subUrl);
        if (subHtml) {
          allEmails.push(...extractEmailsFromHtml(subHtml));
          pagesChecked++;
        }
      }
    }

    const bestEmail = pickBestEmail(allEmails, websiteDomain);

    if (bestEmail) {
      const uniqueValid = [...new Set(allEmails.filter((e) => !isBlockedEmail(e)))];
      console.log(
        `[FOUND] #${listing.id} ${listing.name} → ${bestEmail}` +
          (uniqueValid.length > 1 ? ` (${uniqueValid.length} candidates)` : "") +
          ` [${pagesChecked} pages]`
      );

      if (!DRY_RUN) {
        await prisma.listing.update({
          where: { id: listing.id },
          data: { email: bestEmail },
        });
      }
      found++;
    } else if (homepageHtml === null) {
      console.log(`[ERROR] #${listing.id} ${listing.name} — could not fetch ${baseUrl}`);
      errors++;
    } else {
      const rawCount = allEmails.length;
      console.log(
        `[NONE]  #${listing.id} ${listing.name} — no valid emails` +
          (rawCount > 0 ? ` (${rawCount} filtered out)` : "") +
          ` [${pagesChecked} pages]`
      );
      notFound++;
    }

    // Track progress
    progress.add(listing.id);
    if (!DRY_RUN) {
      saveProgress(progress);
    }

    // Delay between listings (skip after last)
    if (i < batch.length - 1) {
      await sleep(DELAY_MS);
    }
  }

  // Save progress even in dry run (so re-runs skip attempted listings)
  saveProgress(progress);

  console.log("\n=== Summary ===");
  console.log(`Processed: ${batch.length}`);
  console.log(`Found:     ${found} (${((found / batch.length) * 100).toFixed(1)}%)`);
  console.log(`Not found: ${notFound}`);
  console.log(`Errors:    ${errors}`);
  console.log(`Total tracked: ${progress.size}`);

  if (DRY_RUN) {
    console.log("\nDry run — no DB writes. Use --apply to save emails.");
  } else {
    console.log(`\n${found} listings updated with emails.`);
  }

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error("Fatal error:", err);
  prisma.$disconnect();
  process.exit(1);
});
