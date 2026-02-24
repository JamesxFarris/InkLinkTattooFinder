# InkLink Tattoo Finder

**Find the best tattoo shops near you.**

InkLink Tattoo Finder is a modern tattoo shop directory that helps customers discover top-rated shops in their area — and helps shop owners get found by more clients.

[Visit the live site](https://inklinktattoofinder.com)

<!-- Replace the placeholder below with an actual screenshot -->
![InkLink Homepage](docs/screenshot.png)

## What It Does

**For customers:**
- Browse 3,000+ tattoo shops across the United States
- Filter by city, state, ratings, and walk-in availability
- See real Google ratings, hours, photos, and contact info
- Know instantly if a shop is open right now

**For shop owners:**
- Claim your listing for free and keep your info up to date
- Upload photos of your best work
- Add your artists, hours, and social links
- Get a verified badge that builds trust with potential clients
- Embed an InkLink badge on your website to showcase your rating
- Upgrade to Premium for featured placement and priority in search results

## Features

- Real-time "Open Now" badges using each shop's local time zone
- Google Places integration for ratings, reviews, and hours
- Duplicate detection when submitting new listings
- Stripe-powered premium subscriptions
- SEO-optimized pages with structured data and schema markup
- Mobile-friendly responsive design
- Admin dashboard for managing claims and listings
- Email notifications for new claims and submissions

## Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL with Prisma ORM
- **Payments:** Stripe
- **Email:** Resend
- **Hosting:** Railway
- **Image Storage:** Cloudinary

## Getting Started

1. Clone the repo
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and fill in your environment variables
4. Set up the database:
   ```bash
   npx prisma migrate deploy
   ```
5. Run the dev server:
   ```bash
   npm run dev
   ```

## License

All rights reserved.
