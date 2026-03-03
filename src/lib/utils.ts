export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
}

export function capitalize(text: string): string {
  return text
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function unslugify(slug: string): string {
  return slug
    .replace(/-/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function listingUrl(listing: { slug: string; city: { slug: string; state: { slug: string } } }) {
  return `/tattoo-shops/${listing.city.state.slug}/${listing.city.slug}/${listing.slug}`;
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trimEnd() + "...";
}

export function ensureHttps(url: string): string {
  if (url.startsWith("http://")) return url.replace("http://", "https://");
  return url;
}

/** Domains that Next.js Image can optimize (must match next.config.ts remotePatterns). */
const OPTIMIZABLE_HOSTS = [
  "res.cloudinary.com",
  "lh3.googleusercontent.com",
  "lh5.googleusercontent.com",
  "streetviewpixels-pa.googleapis.com",
  "maps.googleapis.com",
  "images.unsplash.com",
  "images.pexels.com",
];

/** Returns true if the URL is on a domain listed in next.config.ts remotePatterns. */
export function isOptimizableImage(url: string): boolean {
  try {
    const hostname = new URL(url).hostname;
    return OPTIMIZABLE_HOSTS.some((h) => hostname === h);
  } catch {
    return false;
  }
}

export const SITE_NAME = "InkLink Tattoo Finder";
export const SITE_DESCRIPTION =
  "Find the best tattoo artists and shops near you. Browse by style, city, and read reviews.";
export const ITEMS_PER_PAGE = 12;

/** Minimum active listings for a city to get its own dedicated page.
 *  Cities below this threshold have their shops shown inline on the state page. */
export const CITY_PAGE_MIN_LISTINGS = 10;
