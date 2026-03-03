/**
 * Reddit Monitor for InkLink Tattoo Finder
 *
 * Scans Reddit for posts where people ask about tattoo shops in cities
 * that InkLink covers. Generates draft responses using real InkLink data.
 *
 * Usage:
 *   npx tsx scripts/reddit-monitor.ts              # Run once (default: last 24h)
 *   npx tsx scripts/reddit-monitor.ts --hours 48   # Scan last 48 hours
 *   npx tsx scripts/reddit-monitor.ts --sub austin  # Scan specific subreddit
 *
 * This uses Reddit's PUBLIC JSON API (no auth required, no API key needed).
 * Rate limited to 1 request/second to respect Reddit's limits.
 *
 * IMPORTANT: This tool finds opportunities and drafts responses.
 * YOU must review and post them manually. Automated posting violates Reddit TOS.
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ── Configuration ──────────────────────────────────────────────────────────

const SITE_URL = "inklinktattoofinder.com";

/** Subreddits to monitor — tattoo-focused + top city subs */
const SUBREDDITS = {
  tattoo: [
    "tattoo",
    "tattoos",
    "tattooadvice",
    "TattooDesigns",
    "traditionaltattoos",
    "neotraditional",
    "irezumi",
    "tattooremoval",
    "sticknpokes",
  ],
  cities: [
    "austin",
    "nyc",
    "losangeles",
    "chicago",
    "houston",
    "phoenix",
    "philadelphia",
    "sanantonio",
    "sandiego",
    "dallas",
    "denver",
    "portland",
    "seattle",
    "nashville",
    "atlanta",
    "miami",
    "tampa",
    "orlando",
    "minneapolis",
    "stlouis",
    "lasvegas",
    "sanfrancisco",
    "detroit",
    "pittsburgh",
    "newjersey",
    "raleigh",
    "charlotte",
    "columbus",
    "indianapolis",
    "jacksonville",
    "memphis",
    "neworleans",
    "saltlakecity",
    "kansascity",
    "oklahomacity",
    "tucson",
    "albuquerque",
    "sacramento",
    "honolulu",
    "anchorage",
  ],
};

/** Keywords that indicate someone is looking for a tattoo shop/artist */
const SEARCH_KEYWORDS = [
  "tattoo shop",
  "tattoo artist",
  "tattoo parlor",
  "tattoo studio",
  "tattoo place",
  "tattoo recommendation",
  "recommend tattoo",
  "looking for tattoo",
  "need a tattoo",
  "best tattoo",
  "good tattoo",
  "where to get tattoo",
  "getting a tattoo",
  "first tattoo",
  "walk in tattoo",
  "walk-in tattoo",
  "fine line tattoo",
  "traditional tattoo",
  "realism tattoo",
  "japanese tattoo",
  "blackwork tattoo",
  "watercolor tattoo",
  "tattoo near me",
  "tattoo suggestions",
];

// ── Types ──────────────────────────────────────────────────────────────────

interface RedditPost {
  title: string;
  selftext: string;
  subreddit: string;
  author: string;
  permalink: string;
  created_utc: number;
  num_comments: number;
  score: number;
  url: string;
}

interface MatchedPost {
  post: RedditPost;
  matchedCity: string | null;
  matchedState: string | null;
  matchedStyles: string[];
  relevanceScore: number;
  draftResponse: string;
}

interface ShopResult {
  name: string;
  slug: string;
  googleRating: number | null;
  googleReviewCount: number | null;
  styles: string[];
  acceptsWalkIns: boolean;
  cityName: string;
  stateName: string;
}

// ── Reddit API (Public JSON, no auth needed) ───────────────────────────────

const USER_AGENT = "InkLinkMonitor/1.0 (tattoo shop directory)";

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchSubredditPosts(
  subreddit: string,
  maxAgeHours: number
): Promise<RedditPost[]> {
  const url = `https://www.reddit.com/r/${subreddit}/new.json?limit=50`;

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": USER_AGENT },
    });

    if (res.status === 429) {
      console.log(`  ⏳ Rate limited on r/${subreddit}, waiting 5s...`);
      await sleep(5000);
      const retry = await fetch(url, {
        headers: { "User-Agent": USER_AGENT },
      });
      if (!retry.ok) return [];
      const retryData = await retry.json();
      return filterByAge(retryData.data?.children || [], maxAgeHours);
    }

    if (!res.ok) {
      console.log(
        `  ⚠ Could not fetch r/${subreddit} (${res.status}), skipping`
      );
      return [];
    }

    const data = await res.json();
    return filterByAge(data.data?.children || [], maxAgeHours);
  } catch (err) {
    console.log(`  ⚠ Error fetching r/${subreddit}: ${(err as Error).message}`);
    return [];
  }
}

function filterByAge(
  children: Array<{ data: RedditPost }>,
  maxAgeHours: number
): RedditPost[] {
  const cutoff = Date.now() / 1000 - maxAgeHours * 3600;
  return children
    .map((c) => c.data)
    .filter((post) => post.created_utc > cutoff);
}

// ── Matching Engine ────────────────────────────────────────────────────────

/** All city names and state names from the database */
let cityNames: string[] = [];
let stateNames: string[] = [];
let cityStateMap: Map<string, string> = new Map(); // city -> state

async function loadLocations() {
  const cities = await prisma.city.findMany({
    include: { state: true },
  });
  cityNames = cities.map((c) => c.name.toLowerCase());
  stateNames = [
    ...new Set(cities.map((c) => c.state.name.toLowerCase())),
  ];

  for (const city of cities) {
    cityStateMap.set(city.name.toLowerCase(), city.state.name.toLowerCase());
  }
}

const TATTOO_STYLES = [
  "traditional",
  "neo-traditional",
  "neotraditional",
  "japanese",
  "irezumi",
  "realism",
  "realistic",
  "portrait",
  "fine line",
  "fineline",
  "blackwork",
  "dotwork",
  "geometric",
  "watercolor",
  "tribal",
  "minimalist",
  "lettering",
  "script",
  "new school",
  "old school",
  "chicano",
  "abstract",
  "surrealism",
  "biomechanical",
  "celtic",
  "polynesian",
  "american traditional",
  "trash polka",
  "illustrative",
  "ornamental",
  "micro realism",
];

function matchPost(post: RedditPost, subreddit: string): MatchedPost | null {
  const text = `${post.title} ${post.selftext}`.toLowerCase();

  // Check if it mentions tattoo-related keywords
  const hasKeyword = SEARCH_KEYWORDS.some((kw) => text.includes(kw));

  // For city subs, the subreddit name itself implies location
  const isCitySub = SUBREDDITS.cities.includes(subreddit.toLowerCase());

  // Must have a tattoo keyword to be relevant
  if (!hasKeyword && !isCitySub) return null;
  if (isCitySub && !text.includes("tattoo")) return null;

  // Extract city mention
  let matchedCity: string | null = null;
  let matchedState: string | null = null;

  // First check if subreddit is a city we cover
  if (isCitySub) {
    const subLower = subreddit.toLowerCase();
    for (const [city, state] of cityStateMap.entries()) {
      if (city.replace(/\s+/g, "").includes(subLower) || subLower.includes(city.replace(/\s+/g, ""))) {
        matchedCity = city;
        matchedState = state;
        break;
      }
    }
  }

  // Also check post text for city mentions
  if (!matchedCity) {
    for (const city of cityNames) {
      if (city.length >= 4 && text.includes(city)) {
        matchedCity = city;
        matchedState = cityStateMap.get(city) || null;
        break;
      }
    }
  }

  // Check for state mentions
  if (!matchedState) {
    for (const state of stateNames) {
      if (state.length >= 4 && text.includes(state)) {
        matchedState = state;
        break;
      }
    }
  }

  // Extract tattoo styles mentioned
  const matchedStyles = TATTOO_STYLES.filter((style) =>
    text.includes(style)
  );

  // Calculate relevance score
  let relevanceScore = 0;
  if (hasKeyword) relevanceScore += 3;
  if (matchedCity) relevanceScore += 5;
  if (matchedState) relevanceScore += 2;
  if (matchedStyles.length > 0) relevanceScore += 2;
  if (text.includes("recommend")) relevanceScore += 2;
  if (text.includes("looking for")) relevanceScore += 2;
  if (text.includes("where")) relevanceScore += 1;
  if (text.includes("help")) relevanceScore += 1;
  if (text.includes("walk in") || text.includes("walk-in")) relevanceScore += 2;
  if (text.includes("first tattoo")) relevanceScore += 2;

  // Must have minimum relevance
  if (relevanceScore < 3) return null;

  return {
    post,
    matchedCity,
    matchedState,
    matchedStyles,
    relevanceScore,
    draftResponse: "", // filled in later
  };
}

// ── Draft Response Generator ───────────────────────────────────────────────

async function getTopShops(
  cityName: string | null,
  stateName: string | null,
  styles: string[],
  limit = 3
): Promise<ShopResult[]> {
  const where: Record<string, unknown> = { status: "active" };

  if (cityName) {
    where.city = { name: { equals: cityName, mode: "insensitive" } };
  } else if (stateName) {
    where.state = { name: { equals: stateName, mode: "insensitive" } };
  } else {
    return [];
  }

  const shops = await prisma.listing.findMany({
    where,
    include: {
      city: true,
      state: true,
    },
    orderBy: [
      { googleRating: "desc" },
      { googleReviewCount: "desc" },
    ],
    take: 20,
  });

  // If styles were mentioned, prefer shops matching those styles
  let filtered = shops;
  if (styles.length > 0) {
    const styleMatches = shops.filter((s) => {
      const shopStyles = Array.isArray(s.styles) ? s.styles : [];
      return shopStyles.some((ss: unknown) =>
        styles.some(
          (ms) =>
            String(ss).toLowerCase().includes(ms) ||
            ms.includes(String(ss).toLowerCase())
        )
      );
    });
    if (styleMatches.length >= 2) filtered = styleMatches;
  }

  return filtered.slice(0, limit).map((s) => ({
    name: s.name,
    slug: s.slug,
    googleRating: s.googleRating,
    googleReviewCount: s.googleReviewCount,
    styles: Array.isArray(s.styles) ? (s.styles as string[]).slice(0, 3) : [],
    acceptsWalkIns: s.acceptsWalkIns,
    cityName: s.city.name,
    stateName: s.state.name,
  }));
}

function generateDraftResponse(match: MatchedPost, shops: ShopResult[]): string {
  const { matchedCity, matchedState, matchedStyles, post } = match;
  const location = matchedCity
    ? `${matchedCity.charAt(0).toUpperCase() + matchedCity.slice(1)}`
    : matchedState
      ? `${matchedState.charAt(0).toUpperCase() + matchedState.slice(1)}`
      : "your area";

  const text = `${post.title} ${post.selftext}`.toLowerCase();
  const isFirstTattoo = text.includes("first tattoo");
  const isWalkIn = text.includes("walk in") || text.includes("walk-in");
  const isStyleSpecific = matchedStyles.length > 0;

  let response = "";

  // Opening — address what they asked about
  if (isFirstTattoo) {
    response += `Congrats on your first tattoo! Finding the right artist makes all the difference. `;
  } else if (isWalkIn) {
    response += `For walk-ins in ${location}, here are a few well-reviewed spots: `;
  } else if (isStyleSpecific) {
    const styleName = matchedStyles[0].charAt(0).toUpperCase() + matchedStyles[0].slice(1);
    response += `For ${styleName.toLowerCase()} work in ${location}, check out: `;
  } else {
    response += `Here are some well-reviewed shops in ${location}: `;
  }

  response += "\n\n";

  // List shops with real data
  if (shops.length > 0) {
    for (const shop of shops) {
      response += `- **${shop.name}**`;
      if (shop.googleRating) {
        response += ` — ${shop.googleRating}⭐`;
        if (shop.googleReviewCount) {
          response += ` (${shop.googleReviewCount} reviews)`;
        }
      }
      if (shop.styles.length > 0) {
        response += ` — Known for: ${shop.styles.join(", ")}`;
      }
      if (isWalkIn && shop.acceptsWalkIns) {
        response += ` — Accepts walk-ins`;
      }
      response += "\n";
    }
    response += "\n";
  }

  // Natural mention of InkLink
  if (shops.length > 0) {
    response += `I found these on [InkLink](https://${SITE_URL}), which is a free directory with ${matchedCity ? "shops in " + location : "3,000+ shops across the US"}. You can filter by style, ratings, and see who's open right now. Might help narrow things down!`;
  } else {
    response += `You might want to check [InkLink](https://${SITE_URL}) — it's a free directory with 3,000+ tattoo shops across the US. You can filter by city, style, ratings, and walk-in availability.`;
  }

  return response;
}

// ── Main ───────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  let maxAgeHours = 24;
  let specificSub: string | null = null;

  // Parse args
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--hours" && args[i + 1]) {
      maxAgeHours = parseInt(args[i + 1], 10);
      i++;
    }
    if (args[i] === "--sub" && args[i + 1]) {
      specificSub = args[i + 1];
      i++;
    }
  }

  console.log("╔══════════════════════════════════════════════════════════╗");
  console.log("║        InkLink Reddit Opportunity Monitor               ║");
  console.log("╚══════════════════════════════════════════════════════════╝");
  console.log();
  console.log(`  Scanning:    ${specificSub ? `r/${specificSub}` : "All tracked subreddits"}`);
  console.log(`  Time range:  Last ${maxAgeHours} hours`);
  console.log(`  Date:        ${new Date().toLocaleDateString()}`);
  console.log();

  // Load city/state data from database
  console.log("📍 Loading InkLink location data...");
  await loadLocations();
  console.log(`   Found ${cityNames.length} cities across ${stateNames.length} states\n`);

  // Build subreddit list
  const subsToScan = specificSub
    ? [specificSub]
    : [...SUBREDDITS.tattoo, ...SUBREDDITS.cities];

  const allMatches: MatchedPost[] = [];

  console.log(`🔍 Scanning ${subsToScan.length} subreddits...\n`);

  for (const sub of subsToScan) {
    process.stdout.write(`  r/${sub}...`);
    const posts = await fetchSubredditPosts(sub, maxAgeHours);

    let matchCount = 0;
    for (const post of posts) {
      const match = matchPost(post, sub);
      if (match) {
        allMatches.push(match);
        matchCount++;
      }
    }

    console.log(
      ` ${posts.length} posts scanned, ${matchCount} opportunities found`
    );

    // Rate limit: 1 request/second
    await sleep(1100);
  }

  // Sort by relevance
  allMatches.sort((a, b) => b.relevanceScore - a.relevanceScore);

  // Deduplicate by permalink
  const seen = new Set<string>();
  const uniqueMatches = allMatches.filter((m) => {
    if (seen.has(m.post.permalink)) return false;
    seen.add(m.post.permalink);
    return true;
  });

  console.log(`\n═══════════════════════════════════════════════════════════`);
  console.log(`  Found ${uniqueMatches.length} opportunities`);
  console.log(`═══════════════════════════════════════════════════════════\n`);

  if (uniqueMatches.length === 0) {
    console.log("  No matching posts found. Try increasing --hours or running later.\n");
    await prisma.$disconnect();
    return;
  }

  // Generate draft responses with real shop data
  console.log("✍️  Generating draft responses with InkLink data...\n");

  const results: Array<{
    match: MatchedPost;
    shops: ShopResult[];
  }> = [];

  for (const match of uniqueMatches) {
    const shops = await getTopShops(
      match.matchedCity,
      match.matchedState,
      match.matchedStyles
    );
    match.draftResponse = generateDraftResponse(match, shops);
    results.push({ match, shops });
  }

  // Output results
  for (let i = 0; i < results.length; i++) {
    const { match } = results[i];
    const post = match.post;
    const age = Math.round((Date.now() / 1000 - post.created_utc) / 3600);

    console.log(`┌─── Opportunity #${i + 1} ─── Relevance: ${"★".repeat(Math.min(match.relevanceScore, 10))}${"☆".repeat(Math.max(0, 10 - match.relevanceScore))} ───`);
    console.log(`│`);
    console.log(`│  Subreddit:  r/${post.subreddit}`);
    console.log(`│  Title:      ${post.title.substring(0, 80)}`);
    console.log(`│  Author:     u/${post.author}`);
    console.log(`│  Posted:     ${age}h ago  |  Score: ${post.score}  |  Comments: ${post.num_comments}`);
    console.log(`│  Link:       https://reddit.com${post.permalink}`);
    console.log(`│`);

    if (match.matchedCity || match.matchedState) {
      console.log(`│  📍 Location: ${match.matchedCity || ""} ${match.matchedState || ""}`);
    }
    if (match.matchedStyles.length > 0) {
      console.log(`│  🎨 Styles:   ${match.matchedStyles.join(", ")}`);
    }
    console.log(`│`);
    console.log(`│  ── Draft Response ──────────────────────────────────`);
    console.log(`│`);

    for (const line of match.draftResponse.split("\n")) {
      console.log(`│  ${line}`);
    }

    console.log(`│`);
    console.log(`└──────────────────────────────────────────────────────────\n`);
  }

  // Summary
  console.log("═══════════════════════════════════════════════════════════");
  console.log("  SUMMARY");
  console.log("═══════════════════════════════════════════════════════════");
  console.log(`  Total opportunities: ${uniqueMatches.length}`);
  console.log(`  High relevance (7+): ${uniqueMatches.filter((m) => m.relevanceScore >= 7).length}`);
  console.log(`  With city match:     ${uniqueMatches.filter((m) => m.matchedCity).length}`);
  console.log(`  With style match:    ${uniqueMatches.filter((m) => m.matchedStyles.length > 0).length}`);
  console.log();
  console.log("  ⚠️  REMINDER: Review and post responses manually.");
  console.log("     Automated posting violates Reddit TOS and");
  console.log("     risks getting inklinktattoofinder.com domain-banned.");
  console.log("═══════════════════════════════════════════════════════════\n");

  // Save results to a file for easy reference
  const outputPath = `scripts/reddit-opportunities-${new Date().toISOString().split("T")[0]}.json`;
  const output = uniqueMatches.map((m) => ({
    url: `https://reddit.com${m.post.permalink}`,
    subreddit: m.post.subreddit,
    title: m.post.title,
    score: m.post.score,
    comments: m.post.num_comments,
    relevanceScore: m.relevanceScore,
    matchedCity: m.matchedCity,
    matchedState: m.matchedState,
    matchedStyles: m.matchedStyles,
    draftResponse: m.draftResponse,
  }));

  const { writeFile } = await import("fs/promises");
  await writeFile(outputPath, JSON.stringify(output, null, 2));
  console.log(`  📁 Results saved to: ${outputPath}\n`);

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error("Fatal error:", err);
  prisma.$disconnect();
  process.exit(1);
});
