/**
 * Fetch a city's lead image from Wikipedia's REST API.
 * No API key needed. Rate limit is ~200 req/s (extremely generous).
 */

export async function searchCityImage(
  cityName: string,
  stateName: string
): Promise<string | null> {
  // Wikipedia titles for US cities: "Austin,_Texas", "Los_Angeles,_California"
  const title = `${cityName}, ${stateName}`.replace(/ /g, "_");

  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
      { headers: { "User-Agent": "InkLinkTattooFinder/1.0 (admin city image tool)" } }
    );

    if (!res.ok) {
      console.warn(`Wikipedia API error for "${title}": ${res.status}`);
      return null;
    }

    const data = await res.json();

    // Use the original full-size image — next/image handles resizing
    return (data?.originalimage?.source as string) ?? null;
  } catch (err) {
    console.warn(`Wikipedia fetch failed for "${title}":`, err);
    return null;
  }
}
