import { prisma } from "@/lib/db";

const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY || "";

const DAY_NAMES = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

interface PlaceResult {
  placeId: string | null;
  rating: number | null;
  reviewCount: number | null;
  hours: Record<string, string> | null;
}

function formatGoogleTime(time: string | undefined): string | null {
  if (!time || time.length !== 4) return null;
  const hour = parseInt(time.slice(0, 2), 10);
  const min = time.slice(2);
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${displayHour}:${min} ${period}`;
}

function parseGoogleHours(
  openingHours: { periods?: Array<{ open?: { day: number; time: string }; close?: { time: string } }> } | undefined
): Record<string, string> | null {
  if (!openingHours?.periods) return null;

  const result: Record<string, string> = {};

  if (openingHours.periods.length === 1 && !openingHours.periods[0].close) {
    for (const day of DAY_NAMES) {
      result[day] = "Open 24 hours";
    }
    return result;
  }

  for (const period of openingHours.periods) {
    const dayIndex = period.open?.day;
    if (dayIndex === undefined || dayIndex === null) continue;

    const dayName = DAY_NAMES[dayIndex];
    if (!dayName) continue;

    const openTime = formatGoogleTime(period.open?.time);
    const closeTime = formatGoogleTime(period.close?.time);

    if (openTime && closeTime) {
      if (result[dayName]) {
        result[dayName] += `, ${openTime} - ${closeTime}`;
      } else {
        result[dayName] = `${openTime} - ${closeTime}`;
      }
    }
  }

  return Object.keys(result).length > 0 ? result : null;
}

/**
 * Find a Google Place by business name + location and return details.
 */
export async function findGooglePlace(
  name: string,
  city: string,
  stateAbbr: string
): Promise<PlaceResult> {
  const empty: PlaceResult = { placeId: null, rating: null, reviewCount: null, hours: null };

  // Step 1: Find Place
  const query = `${name} tattoo ${city} ${stateAbbr}`;
  const findUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(query)}&inputtype=textquery&fields=place_id&key=${GOOGLE_API_KEY}`;
  const findRes = await fetch(findUrl);
  const findData = await findRes.json();

  if (findData.status !== "OK" || !findData.candidates?.length) {
    return empty;
  }

  const placeId = findData.candidates[0].place_id as string;

  // Step 2: Place Details
  const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(placeId)}&fields=opening_hours,rating,user_ratings_total&key=${GOOGLE_API_KEY}`;
  const detailsRes = await fetch(detailsUrl);
  const detailsData = await detailsRes.json();

  if (detailsData.status !== "OK" || !detailsData.result) {
    return { placeId, rating: null, reviewCount: null, hours: null };
  }

  const result = detailsData.result;
  return {
    placeId,
    rating: result.rating ?? null,
    reviewCount: result.user_ratings_total ?? null,
    hours: parseGoogleHours(result.opening_hours),
  };
}

/**
 * Fire-and-forget enrichment: looks up a listing on Google Places and saves
 * the placeId, rating, reviewCount, and hours. Never throws.
 */
export async function enrichListingFromGoogle(
  listingId: number,
  name: string,
  city: string,
  stateAbbr: string
): Promise<void> {
  if (!GOOGLE_API_KEY) return;

  try {
    const place = await findGooglePlace(name, city, stateAbbr);
    if (!place.placeId) return;

    const updateData: Record<string, unknown> = {
      googlePlaceId: place.placeId,
    };
    if (place.rating !== null) updateData.googleRating = place.rating;
    if (place.reviewCount !== null) updateData.googleReviewCount = place.reviewCount;
    if (place.hours) updateData.hours = place.hours;

    await prisma.listing.update({
      where: { id: listingId },
      data: updateData,
    });
  } catch (err) {
    console.error(`[google-places] Failed to enrich listing ${listingId}:`, err);
  }
}
