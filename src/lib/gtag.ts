export const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "";
export const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID ?? "";

// https://developers.google.com/analytics/devguides/collection/ga4/reference/events
export function gtagEvent(action: string, params?: Record<string, string | number | boolean>) {
  if (typeof window === "undefined" || !GA_ID) return;
  (window as any).gtag?.("event", action, params);
}

/**
 * Fire a Google Ads conversion event.
 * `conversionLabel` is the label from the Google Ads conversion action (e.g. "AbCdEfGh").
 */
export function gtagConversion(conversionLabel: string, params?: Record<string, string | number>) {
  if (typeof window === "undefined" || !GOOGLE_ADS_ID) return;
  (window as any).gtag?.("event", "conversion", {
    send_to: `${GOOGLE_ADS_ID}/${conversionLabel}`,
    ...params,
  });
}
