const DAY_NAMES = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

// Primary IANA time zone for each US state (+ DC, PR, etc.)
const STATE_TIMEZONE: Record<string, string> = {
  AL: "America/Chicago",
  AK: "America/Anchorage",
  AZ: "America/Phoenix",
  AR: "America/Chicago",
  CA: "America/Los_Angeles",
  CO: "America/Denver",
  CT: "America/New_York",
  DE: "America/New_York",
  DC: "America/New_York",
  FL: "America/New_York",
  GA: "America/New_York",
  HI: "Pacific/Honolulu",
  ID: "America/Boise",
  IL: "America/Chicago",
  IN: "America/Indiana/Indianapolis",
  IA: "America/Chicago",
  KS: "America/Chicago",
  KY: "America/New_York",
  LA: "America/Chicago",
  ME: "America/New_York",
  MD: "America/New_York",
  MA: "America/New_York",
  MI: "America/Detroit",
  MN: "America/Chicago",
  MS: "America/Chicago",
  MO: "America/Chicago",
  MT: "America/Denver",
  NE: "America/Chicago",
  NV: "America/Los_Angeles",
  NH: "America/New_York",
  NJ: "America/New_York",
  NM: "America/Denver",
  NY: "America/New_York",
  NC: "America/New_York",
  ND: "America/Chicago",
  OH: "America/New_York",
  OK: "America/Chicago",
  OR: "America/Los_Angeles",
  PA: "America/New_York",
  PR: "America/Puerto_Rico",
  RI: "America/New_York",
  SC: "America/New_York",
  SD: "America/Chicago",
  TN: "America/Chicago",
  TX: "America/Chicago",
  UT: "America/Denver",
  VT: "America/New_York",
  VA: "America/New_York",
  WA: "America/Los_Angeles",
  WV: "America/New_York",
  WI: "America/Chicago",
  WY: "America/Denver",
};

function getLocalTime(timeZone: string): { day: number; hours: number; minutes: number } {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "numeric",
    minute: "numeric",
    weekday: "short",
    hour12: false,
  }).formatToParts(now);

  let hours = 0;
  let minutes = 0;
  let weekday = "";
  for (const p of parts) {
    if (p.type === "hour") hours = parseInt(p.value);
    if (p.type === "minute") minutes = parseInt(p.value);
    if (p.type === "weekday") weekday = p.value;
  }

  const dayMap: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  return { day: dayMap[weekday] ?? 0, hours, minutes };
}

function parseTime(str: string): { hours: number; minutes: number } | null {
  // Matches "9:00 AM", "10:30 PM", "9AM", etc.
  const match = str.trim().match(/^(\d{1,2}):?(\d{2})?\s*(am|pm)$/i);
  if (!match) return null;
  let hours = parseInt(match[1]);
  const minutes = match[2] ? parseInt(match[2]) : 0;
  const period = match[3].toLowerCase();
  if (period === "pm" && hours !== 12) hours += 12;
  if (period === "am" && hours === 12) hours = 0;
  return { hours, minutes };
}

export function isOpenNow(
  hours: Record<string, string> | null | undefined,
  stateAbbreviation?: string
): { open: boolean; label: string } {
  if (!hours) return { open: false, label: "" };

  const timeZone = stateAbbreviation
    ? STATE_TIMEZONE[stateAbbreviation.toUpperCase()] ?? "America/New_York"
    : "America/New_York";

  const local = getLocalTime(timeZone);
  const dayName = DAY_NAMES[local.day];
  const todayHours = hours[dayName];

  if (!todayHours || todayHours.toLowerCase() === "closed") {
    return { open: false, label: "Closed" };
  }

  // Parse "9:00 AM - 5:00 PM" format
  const parts = todayHours.split(/\s*[-–]\s*/);
  if (parts.length !== 2) return { open: false, label: "" };

  const open = parseTime(parts[0]);
  const close = parseTime(parts[1]);
  if (!open || !close) return { open: false, label: "" };

  const nowMinutes = local.hours * 60 + local.minutes;
  const openMinutes = open.hours * 60 + open.minutes;
  const closeMinutes = close.hours * 60 + close.minutes;

  // Handle overnight hours (e.g. 10 PM - 2 AM)
  const isOpen =
    closeMinutes > openMinutes
      ? nowMinutes >= openMinutes && nowMinutes < closeMinutes
      : nowMinutes >= openMinutes || nowMinutes < closeMinutes;

  return { open: isOpen, label: isOpen ? "Open Now" : "Closed" };
}
