type ListingForCompleteness = {
  description?: string | null;
  photos?: unknown | null;
  phone?: string | null;
  website?: string | null;
  address?: string | null;
  categories?: { category: unknown }[];
  hourlyRateMin?: number | null;
  hourlyRateMax?: number | null;
  artists?: unknown | null;
  hours?: unknown | null;
};

type CompletenessResult = {
  score: number;
  missing: string[];
};

const FIELDS: {
  label: string;
  weight: number;
  check: (l: ListingForCompleteness) => boolean;
}[] = [
  {
    label: "Add a description",
    weight: 20,
    check: (l) => !!l.description && l.description.trim().length > 0,
  },
  {
    label: "Upload at least one photo",
    weight: 20,
    check: (l) => {
      if (!l.photos) return false;
      if (Array.isArray(l.photos)) return l.photos.length > 0;
      return false;
    },
  },
  {
    label: "Add a phone number",
    weight: 10,
    check: (l) => !!l.phone && l.phone.trim().length > 0,
  },
  {
    label: "Add your website",
    weight: 10,
    check: (l) => !!l.website && l.website.trim().length > 0,
  },
  {
    label: "Add your address",
    weight: 10,
    check: (l) => !!l.address && l.address.trim().length > 0,
  },
  {
    label: "Select at least one style/category",
    weight: 10,
    check: (l) => !!l.categories && l.categories.length > 0,
  },
  {
    label: "Set your hourly rate",
    weight: 10,
    check: (l) => l.hourlyRateMin != null || l.hourlyRateMax != null,
  },
  {
    label: "Add at least one artist",
    weight: 5,
    check: (l) => {
      if (!l.artists) return false;
      if (Array.isArray(l.artists)) return l.artists.length > 0;
      return false;
    },
  },
  {
    label: "Set your business hours",
    weight: 5,
    check: (l) => {
      if (!l.hours) return false;
      if (typeof l.hours === "object" && l.hours !== null) {
        return Object.keys(l.hours as Record<string, unknown>).length > 0;
      }
      return false;
    },
  },
];

export function getProfileCompleteness(
  listing: ListingForCompleteness
): CompletenessResult {
  let score = 0;
  const missing: string[] = [];

  for (const field of FIELDS) {
    if (field.check(listing)) {
      score += field.weight;
    } else {
      missing.push(field.label);
    }
  }

  return { score, missing };
}
