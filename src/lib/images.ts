// Curated stock images from Unsplash for tattoo-related content.
// These are permanent CDN URLs that serve optimized images.

export const HERO_IMAGE =
  "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&w=1920&q=80";

export const TATTOO_STOCK_IMAGES = [
  "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1598371839696-5c5bb1c12e38?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1565058379802-bbe93b2f703a?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1590246814883-57c511e76a3b?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1562962230-16e4623d36e6?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1604431696980-07e518647bec?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1542856204-00101eb6def4?auto=format&fit=crop&w=800&q=80",
];

// City-specific stock images (skylines / landmarks)
export const CITY_IMAGES: Record<string, string> = {
  "new-york":
    "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80",
  "los-angeles":
    "https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?auto=format&fit=crop&w=800&q=80",
  chicago:
    "https://images.unsplash.com/photo-1494522855154-9297ac14b55f?auto=format&fit=crop&w=800&q=80",
  houston:
    "https://images.unsplash.com/photo-1530089711124-9ca31fb9e863?auto=format&fit=crop&w=800&q=80",
  miami:
    "https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?auto=format&fit=crop&w=800&q=80",
  phoenix:
    "https://images.unsplash.com/photo-1558645836-e44122a743ee?auto=format&fit=crop&w=800&q=80",
  philadelphia:
    "https://images.unsplash.com/photo-1569761316261-9a8696fa2ca3?auto=format&fit=crop&w=800&q=80",
  "san-antonio":
    "https://images.unsplash.com/photo-1531218150217-54595bc2b934?auto=format&fit=crop&w=800&q=80",
  "san-diego":
    "https://images.unsplash.com/photo-1538097304804-2a1b932b78eb?auto=format&fit=crop&w=800&q=80",
  dallas:
    "https://images.unsplash.com/photo-1545194445-dddb8f4487c6?auto=format&fit=crop&w=800&q=80",
  austin:
    "https://images.unsplash.com/photo-1531218150217-54595bc2b934?auto=format&fit=crop&w=800&q=80",
  denver:
    "https://images.unsplash.com/photo-1619856699906-09e1f4ef34b0?auto=format&fit=crop&w=800&q=80",
};

// Generic fallback city image
export const CITY_FALLBACK =
  "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=800&q=80";

/**
 * Get a deterministic stock image for a given string (listing name, slug, etc).
 * Always returns the same image for the same input.
 */
export function getStockImage(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % TATTOO_STOCK_IMAGES.length;
  return TATTOO_STOCK_IMAGES[index];
}

/**
 * Get a city-specific stock image, or fall back to a generic cityscape.
 */
export function getCityImage(citySlug: string): string {
  return CITY_IMAGES[citySlug] || CITY_FALLBACK;
}
