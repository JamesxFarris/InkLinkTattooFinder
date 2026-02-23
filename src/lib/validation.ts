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
