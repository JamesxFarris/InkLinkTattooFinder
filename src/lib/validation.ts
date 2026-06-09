/**
 * Input validation utilities for server actions and API routes.
 */

/** Clamp a string to max length, returning trimmed result or null if empty. */
export function sanitizeString(
  value: string | null | undefined,
  maxLength: number
): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (trimmed.length === 0) return null;
  return trimmed.slice(0, maxLength);
}

/** Validate email format. */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Validate URL format (must start with http:// or https://). */
export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

/** Validate phone number (digits, spaces, dashes, parens, plus). */
export function isValidPhone(phone: string): boolean {
  return /^[0-9\s\-().+]{7,20}$/.test(phone);
}

/**
 * Hosts allowed for listing photo URLs. Must stay in sync with
 * images.remotePatterns in next.config.ts — next/image refuses (and errors on)
 * any host not configured there.
 */
const ALLOWED_IMAGE_HOSTS = [
  "res.cloudinary.com",
  "images.unsplash.com",
  "images.pexels.com",
  "lh3.googleusercontent.com",
  "maps.googleapis.com",
];

/** Validate that a URL is https and points at an allowed image host. */
export function isAllowedImageUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" && ALLOWED_IMAGE_HOSTS.includes(parsed.hostname);
  } catch {
    return false;
  }
}

export type ArtistEntry = { name: string; instagramUrl?: string };

/**
 * Parse the artistsJson form field into a clean artist list.
 * Names are trimmed and clamped; Instagram links must be valid http(s) URLs
 * (invalid ones are dropped so a bad link never reaches a public href).
 */
export function parseArtistsJson(raw: string | null): ArtistEntry[] {
  if (!raw) return [];
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!Array.isArray(parsed)) return [];
  const artists: ArtistEntry[] = [];
  for (const item of parsed) {
    if (typeof item !== "object" || item === null) continue;
    const name = (item as { name?: unknown }).name;
    if (typeof name !== "string" || name.trim().length === 0) continue;
    const instagramUrl = (item as { instagramUrl?: unknown }).instagramUrl;
    const cleanUrl =
      typeof instagramUrl === "string" ? instagramUrl.trim().slice(0, MAX_URL) : "";
    artists.push({
      name: name.trim().slice(0, MAX_NAME),
      ...(cleanUrl && isValidUrl(cleanUrl) ? { instagramUrl: cleanUrl } : {}),
    });
  }
  return artists;
}

// Field length limits
export const MAX_NAME = 100;
export const MAX_EMAIL = 254;
export const MAX_SUBJECT = 200;
export const MAX_MESSAGE = 5000;
export const MAX_BUSINESS_NAME = 200;
export const MAX_DETAILS = 10000;
export const MAX_DESCRIPTION = 5000;
export const MAX_ADDRESS = 300;
export const MAX_URL = 500;
export const MAX_PHONE = 30;
export const MAX_ZIP = 10;
