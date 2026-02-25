const INDEXNOW_KEY = "4c89765533f94c8595bd49aacd370769";
const HOST = "inklinktattoofinder.com";
const KEY_LOCATION = `https://${HOST}/${INDEXNOW_KEY}.txt`;

/**
 * Notify search engines (Bing, Yandex, etc.) about changed URLs via IndexNow.
 * Fire-and-forget — never throws, never blocks the caller.
 */
export function notifyIndexNow(urls: string | string[]) {
  const urlList = (Array.isArray(urls) ? urls : [urls]).map((u) =>
    u.startsWith("http") ? u : `https://${HOST}${u}`
  );

  if (urlList.length === 0) return;

  // Single URL — simple GET
  if (urlList.length === 1) {
    const params = new URLSearchParams({
      url: urlList[0],
      key: INDEXNOW_KEY,
      keyLocation: KEY_LOCATION,
    });
    fetch(`https://api.indexnow.org/indexnow?${params}`, { method: "GET" }).catch(
      () => {}
    );
    return;
  }

  // Multiple URLs — batch POST
  fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: HOST,
      key: INDEXNOW_KEY,
      keyLocation: KEY_LOCATION,
      urlList,
    }),
  }).catch(() => {});
}

/** Helper: build the set of URLs affected when a listing changes. */
export function listingChangedUrls(listing: {
  slug: string;
  city: { slug: string; state: { slug: string } };
}): string[] {
  const { slug, city } = listing;
  return [
    `/tattoo-shops/${city.state.slug}/${city.slug}/${slug}`,
    `/tattoo-shops/${city.state.slug}/${city.slug}`,
    `/tattoo-shops/${city.state.slug}`,
  ];
}
