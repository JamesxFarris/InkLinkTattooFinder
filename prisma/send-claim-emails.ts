import { PrismaClient } from "@prisma/client";
import { Resend } from "resend";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

const SENT_FILE = path.join(__dirname, "outreach-sent.json");
const BASE_URL = "https://inklinktattoofinder.com";

function loadSentIds(): Set<number> {
  try {
    const data = fs.readFileSync(SENT_FILE, "utf-8");
    const ids: number[] = JSON.parse(data);
    return new Set(ids);
  } catch {
    return new Set();
  }
}

function saveSentIds(ids: Set<number>) {
  fs.writeFileSync(SENT_FILE, JSON.stringify([...ids], null, 2));
}

function buildEmailHtml(name: string, city: string, state: string, listingUrl: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f9fafb;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:8px;overflow:hidden;margin-top:20px;margin-bottom:20px;">
    <tr>
      <td style="background:#1a1a2e;padding:24px 32px;">
        <h1 style="margin:0;color:#ffffff;font-size:22px;">InkLink Tattoo Finder</h1>
      </td>
    </tr>
    <tr>
      <td style="padding:32px;">
        <h2 style="margin:0 0 16px;color:#1a1a2e;font-size:20px;">Hey ${name} team!</h2>
        <p style="color:#374151;font-size:16px;line-height:1.6;margin:0 0 16px;">
          Your shop is already listed on <strong>InkLink Tattoo Finder</strong> — one of the fastest-growing tattoo shop directories. Customers in ${city}, ${state} are finding you here:
        </p>
        <p style="margin:0 0 24px;">
          <a href="${listingUrl}" style="color:#6366f1;font-size:16px;text-decoration:underline;">${listingUrl}</a>
        </p>
        <p style="color:#374151;font-size:16px;line-height:1.6;margin:0 0 8px;">
          <strong>Claim your free listing</strong> to:
        </p>
        <ul style="color:#374151;font-size:16px;line-height:1.8;margin:0 0 24px;padding-left:20px;">
          <li>Update your hours, contact info, and description</li>
          <li>Add photos of your best work</li>
          <li>Get found by more customers searching for tattoo shops near them</li>
        </ul>
        <table cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
          <tr>
            <td style="background:#6366f1;border-radius:6px;">
              <a href="${BASE_URL}/register" style="display:inline-block;padding:14px 28px;color:#ffffff;text-decoration:none;font-size:16px;font-weight:600;">
                Register &amp; Claim Your Listing
              </a>
            </td>
          </tr>
        </table>
        <p style="color:#6b7280;font-size:14px;line-height:1.5;margin:0;">
          It only takes a minute — create a free account, then claim your shop. Questions? Just reply to this email.
        </p>
      </td>
    </tr>
    <tr>
      <td style="background:#f3f4f6;padding:16px 32px;text-align:center;">
        <p style="color:#9ca3af;font-size:12px;margin:0;">
          InkLink Tattoo Finder &mdash; <a href="${BASE_URL}" style="color:#9ca3af;">inklinktattoofinder.com</a>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const args = process.argv.slice(2);
  const shouldSend = args.includes("--send");
  const limitIdx = args.indexOf("--limit");
  const limit = limitIdx !== -1 ? parseInt(args[limitIdx + 1], 10) : 50;
  const delayIdx = args.indexOf("--delay");
  const delay = delayIdx !== -1 ? parseInt(args[delayIdx + 1], 10) : 500;

  console.log(`Mode: ${shouldSend ? "SENDING" : "DRY RUN"}`);
  console.log(`Limit: ${limit} | Delay: ${delay}ms\n`);

  if (shouldSend && !process.env.RESEND_API_KEY) {
    console.error("ERROR: RESEND_API_KEY is required when using --send");
    process.exit(1);
  }

  const resend = shouldSend ? new Resend(process.env.RESEND_API_KEY!) : null;

  // Load already-sent listing IDs
  const sentIds = loadSentIds();
  console.log(`Already sent: ${sentIds.size} listings\n`);

  // Get listings that have pending or approved claims (to exclude)
  const claimedListingIds = await prisma.claim.findMany({
    where: { status: { in: ["pending", "approved"] } },
    select: { listingId: true },
    distinct: ["listingId"],
  });
  const claimedSet = new Set(claimedListingIds.map((c) => c.listingId));

  // Get unclaimed active listings with email
  const listings = await prisma.listing.findMany({
    where: {
      status: "active",
      email: { not: null },
      ownerId: null,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      email: true,
      city: {
        select: {
          name: true,
          slug: true,
          state: { select: { name: true, slug: true } },
        },
      },
    },
    orderBy: { id: "asc" },
  });

  // Filter out claimed and already-sent
  const eligible = listings.filter(
    (l) => !claimedSet.has(l.id) && !sentIds.has(l.id)
  );

  console.log(`Total unclaimed with email: ${listings.length}`);
  console.log(`After filtering claims & already-sent: ${eligible.length}`);
  console.log(`Will process: ${Math.min(limit, eligible.length)}\n`);

  const batch = eligible.slice(0, limit);
  let sent = 0;
  let failed = 0;

  for (const listing of batch) {
    const listingUrl = `${BASE_URL}/tattoo-shops/${listing.city.state.slug}/${listing.city.slug}/${listing.slug}`;
    const subject = `${listing.name} is on InkLink — claim your free listing`;

    if (!shouldSend) {
      console.log(`[DRY RUN] #${listing.id} ${listing.name}`);
      console.log(`  To: ${listing.email}`);
      console.log(`  Subject: ${subject}`);
      console.log(`  Link: ${listingUrl}\n`);
      continue;
    }

    const html = buildEmailHtml(
      listing.name,
      listing.city.name,
      listing.city.state.name,
      listingUrl
    );

    try {
      const { error } = await resend!.emails.send({
        from: "InkLink Tattoo Finder <hello@inklinktattoofinder.com>",
        to: listing.email!,
        subject,
        html,
      });

      if (error) {
        console.error(`[FAIL] #${listing.id} ${listing.name} — ${error.message}`);
        failed++;
      } else {
        sentIds.add(listing.id);
        saveSentIds(sentIds);
        sent++;
        console.log(`[SENT] #${listing.id} ${listing.name} → ${listing.email}`);
      }
    } catch (err: any) {
      console.error(`[ERROR] #${listing.id} ${listing.name} — ${err.message}`);
      failed++;
    }

    if (batch.indexOf(listing) < batch.length - 1) {
      await sleep(delay);
    }
  }

  if (shouldSend) {
    console.log(`\nDone! Sent: ${sent} | Failed: ${failed} | Total tracked: ${sentIds.size}`);
  } else {
    console.log(`Dry run complete. ${batch.length} emails would be sent.`);
    console.log(`Run with --send to actually send emails.`);
  }

  await prisma.$disconnect();
}

main();
