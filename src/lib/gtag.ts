export const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "";

// https://developers.google.com/analytics/devguides/collection/ga4/reference/events
export function gtagEvent(action: string, params?: Record<string, string | number | boolean>) {
  if (typeof window === "undefined" || !GA_ID) return;
  (window as any).gtag?.("event", action, params);
}
