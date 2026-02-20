/**
 * Geographic utilities for proximity-based search.
 * Uses the haversine formula for distance calculations and
 * zippopotam.us (free, no-auth) for zip code geocoding.
 */

const EARTH_RADIUS_MILES = 3958.8;

/** Haversine distance between two lat/lng points in miles */
export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return EARTH_RADIUS_MILES * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export type GeoResult = { latitude: number; longitude: number; place?: string; state?: string };

/** Detect if a string looks like a US zip code (5 digits) */
export function isZipCode(query: string): boolean {
  return /^\d{5}$/.test(query.trim());
}

/** Geocode a US zip code to lat/lng using zippopotam.us (free, no key needed) */
export async function geocodeZip(zip: string): Promise<GeoResult | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(`https://api.zippopotam.us/us/${zip}`, {
      signal: controller.signal,
      cache: "force-cache",
    });
    clearTimeout(timeout);
    if (!res.ok) return null;
    const data = await res.json();
    const place = data.places?.[0];
    if (!place) return null;
    return {
      latitude: parseFloat(place.latitude),
      longitude: parseFloat(place.longitude),
      place: place["place name"],
      state: place["state abbreviation"],
    };
  } catch {
    return null;
  }
}
