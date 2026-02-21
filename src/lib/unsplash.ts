const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

/**
 * Fetch a city image from the Unsplash search API.
 * Returns the `regular` size URL on success, or null on failure.
 */
export async function fetchCityImage(
  cityName: string,
  stateAbbr?: string
): Promise<string | null> {
  if (!UNSPLASH_ACCESS_KEY) return null;

  const query = stateAbbr
    ? `${cityName} ${stateAbbr} cityscape`
    : `${cityName} cityscape`;

  try {
    const url = new URL("https://api.unsplash.com/search/photos");
    url.searchParams.set("query", query);
    url.searchParams.set("per_page", "1");
    url.searchParams.set("orientation", "landscape");

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` },
    });

    if (!res.ok) {
      console.warn(`Unsplash API error for "${query}": ${res.status}`);
      return null;
    }

    const data = await res.json();
    const photo = data?.results?.[0];
    return photo?.urls?.regular ?? null;
  } catch (err) {
    console.warn(`Unsplash fetch failed for "${query}":`, err);
    return null;
  }
}
