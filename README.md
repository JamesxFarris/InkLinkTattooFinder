# InkLink Tattoo Finder

A production SEO-driven directory of 3,000+ U.S. tattoo shops. Built solo with Next.js, TypeScript, and Prisma. Live, indexed, monetized.

🔗 **[inklinktattoofinder.com](https://inklinktattoofinder.com)**

---

## Why this exists

Finding a tattoo shop is annoying. Google Maps shows you the closest one, not the best one. Instagram is a firehose. Yelp is paywalled noise. I wanted a directory that loaded fast, ranked organically, and let shop owners claim and upgrade their listings without a sales call.

So I built one.

## What's actually interesting under the hood

This is a real product with real users, so most of the work isn't in the obvious places. A few things worth calling out:

**SEO as a system, not a sprinkle.** Every shop and city has a server-rendered page with schema.org `LocalBusiness` markup, dynamic Open Graph images, and a generated sitemap. Canonical URLs are normalized at the middleware layer because `www` vs non-`www` was splitting domain authority before I caught it. Pages are statically generated where possible and revalidated on write.

**"Open now" without lying to the user.** Each shop stores its hours in its local timezone, so the "Open Now" badge is computed per-request against the shop's tz, not the visitor's. Sounds small until you realize a shop in Hawaii showing as closed at 2pm EST is a bug that kills trust.

**Dedupe on submission.** When a shop owner submits a new listing, I run a fuzzy match (normalized name + geocoded address proximity) before letting it through. Stops the directory from filling up with "Bob's Tattoos" / "Bobs Tattoos LLC" / "Bob's Tattoo Shop" as three separate entries.

**Stripe + claim flow.** Owners can claim a listing for free, then upgrade to Premium for featured placement. The claim flow has to handle verification, prevent claim-jacking, and gracefully recover from Stripe webhook failures. Premium status is derived from subscription state, not a manually-set boolean, so cancellations roll back placement automatically.

**Embeddable badge.** Shops can drop a `<script>` snippet on their own site that renders their live InkLink rating. Cached aggressively, served from the edge.

## Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js (App Router) | SSR + static generation for SEO, file-based routing, image optimization |
| Language | TypeScript | Catches the bugs you'd otherwise find in production |
| DB | PostgreSQL + Prisma | Relational data (shops → artists → claims), Prisma keeps migrations honest |
| Payments | Stripe | Subscriptions, webhooks, customer portal |
| Email | Resend | Transactional email for claims & notifications |
| Media | Cloudinary | On-the-fly image transforms, signed uploads |
| External data | Google Places API | Ratings, reviews, hours sync |
| Hosting | Railway | Postgres + Node deploys, no infra yak-shaving |

## What I learned

**A leaked secret is two incidents, not one.** A one-off seed script with a pasted database URL got committed, and GitGuardian flagged it in a public repo. Rotating the password took two minutes — and immediately took the site down, because the app's `DATABASE_URL` was a pasted literal instead of a platform reference variable, so the rotation never propagated. Credentials now flow only through env vars, a pre-push hook plus gitleaks CI scan every commit, and rotation propagates automatically. The guardrails cost an afternoon; I just bought them after the incident instead of before.

**HTTP 200 doesn't mean the page works.** With streaming SSR, a server component that throws after the shell is sent still returns 200 — the browser swaps in the error boundary afterwards. My health checks were green while every database-backed page showed "Something went wrong." I verify rendered content now, not status codes.

**Google doesn't owe you an index.** 6,600 URLs submitted, ~1,800 indexed. Programmatic pages get judged one by one, and a "1 watercolor artist in Austin" page is thin content no matter how clean the schema markup is. The counterintuitive fix was to noindex thousands of my own pages and shrink the sitemap, so crawl budget concentrates on pages that deserve to rank. URL count is vanity; authority is the dial.

**Catch-all routes tax every future feature.** A wildcard `/:state` redirect for legacy URLs silently swallowed each new top-level page I shipped — first `/blog`, then the password-reset pages, where emailed links dead-ended on a 404. Any pattern that matches "everything except a list" needs that list to live in exactly one place.

**For a directory, distribution beats code.** The hardest problem isn't technical — it's that page 5,000 looks like page 4,999 to both Google and users. The features worth building are growth loops inside the product: claimable listings, embeddable rating badges that earn backlinks from shop websites, and owner dashboards that get shops to enrich their own pages for you.

## What I'd do differently next time

- **Pick the DB schema more carefully up front.** The shop/artist/claim relationship grew organically. There are migrations in this repo I'm not proud of.
- **Add observability earlier.** I had to bolt on logging after a Stripe webhook silently failed. Lesson learned: instrument the boring stuff before you need it.
- **Start with an admin panel, not a database GUI.** I spent too many evenings running raw SQL against prod to approve claims. The admin dashboard I built later took two days and would have saved twenty.

## Status

Live with organic traffic and paying users. Active development — claims flow, premium tier, and SEO surface area are the current focus.

## Running locally

```bash
git clone https://github.com/JamesxFarris/InkLinkTattooFinder.git
cd InkLinkTattooFinder
npm install
cp .env.example .env  # fill in Stripe, Resend, Cloudinary, Google Places, DB
npx prisma migrate deploy
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## License

All rights reserved. Code is public for portfolio purposes — please don't fork to clone the product.

---

Built by [James Farris](https://github.com/JamesxFarris) · [J2 Solutions](https://github.com/JamesxFarris)
