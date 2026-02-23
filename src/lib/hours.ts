const DAY_NAMES = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

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
  hours: Record<string, string> | null | undefined
): { open: boolean; label: string } {
  if (!hours) return { open: false, label: "" };

  const now = new Date();
  const dayName = DAY_NAMES[now.getDay()];
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

  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const openMinutes = open.hours * 60 + open.minutes;
  const closeMinutes = close.hours * 60 + close.minutes;

  // Handle overnight hours (e.g. 10 PM - 2 AM)
  const isOpen =
    closeMinutes > openMinutes
      ? nowMinutes >= openMinutes && nowMinutes < closeMinutes
      : nowMinutes >= openMinutes || nowMinutes < closeMinutes;

  return { open: isOpen, label: isOpen ? "Open Now" : "Closed" };
}
