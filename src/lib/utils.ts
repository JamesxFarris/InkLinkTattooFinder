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

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trimEnd() + "...";
}

export const SITE_NAME = "InkLink Tattoo Finder";
export const SITE_DESCRIPTION =
  "Find the best tattoo artists and shops near you. Browse by style, city, and read reviews.";
export const ITEMS_PER_PAGE = 12;
