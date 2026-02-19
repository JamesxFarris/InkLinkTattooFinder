import type { BreadcrumbItem } from "@/types";

const SITE_URL = "https://inklinktattoofinder.com";
const SITE_NAME = "InkLink Tattoo Finder";

type JsonLdProps = {
  data: Record<string, unknown>;
};

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// --- Helpers ---

const DAY_MAP: Record<string, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

function convertTo24Hr(time12h: string): string {
  const match = time12h.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return time12h;
  let hours = parseInt(match[1], 10);
  const minutes = match[2];
  const period = match[3].toUpperCase();
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  return `${hours.toString().padStart(2, "0")}:${minutes}`;
}

const PRICE_SYMBOL: Record<string, string> = {
  budget: "$",
  moderate: "$$",
  premium: "$$$",
  luxury: "$$$$",
};

// --- Schema generators ---

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    email: "inklinktattoofinder@gmail.com",
    description:
      "InkLink Tattoo Finder is the premier directory for finding tattoo artists and shops across the United States.",
  };
}

export function localBusinessJsonLd(listing: {
  name: string;
  slug: string;
  description?: string | null;
  address?: string | null;
  city: string;
  state: string;
  zipCode?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  googleRating?: number | null;
  googleReviewCount?: number | null;
  hours?: Record<string, string> | null;
  priceRange?: string | null;
  photos?: string[] | null;
  categories?: string[];
}) {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "TattooParlor",
    name: listing.name,
    description: listing.description,
    url: `${SITE_URL}/listing/${listing.slug}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: listing.address,
      addressLocality: listing.city,
      addressRegion: listing.state,
      postalCode: listing.zipCode,
      addressCountry: "US",
    },
  };

  if (listing.phone) data.telephone = listing.phone;
  if (listing.email) data.email = listing.email;
  if (listing.website) data.sameAs = listing.website;
  if (listing.priceRange) data.priceRange = PRICE_SYMBOL[listing.priceRange] || listing.priceRange;

  if (listing.latitude && listing.longitude) {
    data.geo = {
      "@type": "GeoCoordinates",
      latitude: listing.latitude,
      longitude: listing.longitude,
    };
  }

  if (listing.googleRating) {
    data.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: listing.googleRating,
      reviewCount: listing.googleReviewCount || 0,
      bestRating: 5,
      worstRating: 1,
    };
  }

  if (listing.photos && listing.photos.length > 0) {
    data.image = listing.photos;
  }

  if (listing.categories && listing.categories.length > 0) {
    data.keywords = listing.categories.join(", ");
  }

  // Opening hours
  if (listing.hours) {
    const specs: Record<string, unknown>[] = [];
    for (const [day, time] of Object.entries(listing.hours)) {
      const dayOfWeek = DAY_MAP[day.toLowerCase()];
      if (!dayOfWeek || time.toLowerCase() === "closed") continue;
      const parts = time.split(/\s*[-–]\s*/);
      if (parts.length === 2) {
        specs.push({
          "@type": "OpeningHoursSpecification",
          dayOfWeek,
          opens: convertTo24Hr(parts[0]),
          closes: convertTo24Hr(parts[1]),
        });
      }
    }
    if (specs.length > 0) data.openingHoursSpecification = specs;
  }

  return data;
}

export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  const allItems: { label: string; href?: string }[] = [
    { label: "Home", href: "/" },
    ...items,
  ];

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: allItems.map((item, i) => {
      const element: Record<string, unknown> = {
        "@type": "ListItem",
        position: i + 1,
        name: item.label,
      };
      if (item.href) {
        element.item = `${SITE_URL}${item.href}`;
      }
      return element;
    }),
  };
}

export function collectionPageJsonLd({
  name,
  description,
  url,
}: {
  name: string;
  description: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url: `${SITE_URL}${url}`,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

export function searchResultsPageJsonLd(query?: string) {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "SearchResultsPage",
    name: query ? `Search results for "${query}"` : "Search Tattoo Shops",
    url: `${SITE_URL}/search${query ? `?q=${encodeURIComponent(query)}` : ""}`,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
  return data;
}

export function webPageJsonLd({
  name,
  description,
  url,
  type = "WebPage",
}: {
  name: string;
  description: string;
  url: string;
  type?: "AboutPage" | "ContactPage" | "WebPage";
}) {
  return {
    "@context": "https://schema.org",
    "@type": type,
    name,
    description,
    url: `${SITE_URL}${url}`,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

export function itemListJsonLd(
  items: { name: string; url: string; position: number }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item) => ({
      "@type": "ListItem",
      position: item.position,
      name: item.name,
      url: item.url,
    })),
  };
}
