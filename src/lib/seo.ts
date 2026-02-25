import type { Metadata } from "next";

const SITE_NAME = "InkLink Tattoo Finder";
const DEFAULT_OG_IMAGE = "/opengraph-image";

/** Max chars for the page-level title (before layout appends " | InkLink"). */
const MAX_TITLE_LEN = 50;

/**
 * Build a complete Metadata object with full Open Graph tags.
 * Every public page should use this to avoid incomplete OG warnings.
 */
export function fullMeta(opts: {
  title: string;
  description: string;
  url: string;
  image?: string;
  type?: "website" | "article" | "profile";
}): Metadata {
  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical: opts.url },
    openGraph: {
      title: opts.title,
      description: opts.description,
      url: opts.url,
      siteName: SITE_NAME,
      type: opts.type ?? "website",
      locale: "en_US",
      images: [
        {
          url: opts.image ?? DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: opts.title,
        },
      ],
    },
  };
}

export function homePageMeta() {
  return {
    title: "Find Tattoo Artists & Shops Near You",
    description:
      "Discover the best tattoo artists and tattoo shops in your area. Browse by style, read reviews, and find your next tattoo artist on InkLink.",
  };
}

export function statesIndexMeta() {
  return {
    title: "Browse Tattoo Shops by State",
    description:
      "Browse tattoo shops and artists in every US state. Find top-rated tattoo parlors near you organized by state and city on InkLink.",
  };
}

export function statePageMeta(stateName: string, listingCount?: number) {
  const countStr = listingCount ? `${listingCount} ` : "";
  return {
    title: `Best Tattoo Shops & Artists in ${stateName}`,
    description: `Discover ${countStr}top-rated tattoo shops and artists in ${stateName}. Browse by city, compare styles, read reviews, and find your perfect tattoo artist.`,
  };
}

export function cityPageMeta(cityName: string, stateAbbr: string, count?: number) {
  const countStr = count ? `${count} ` : "";
  return {
    title: `${countStr}Best Tattoo Shops in ${cityName}, ${stateAbbr}`,
    description: `Discover the ${countStr}best tattoo shops and artists in ${cityName}, ${stateAbbr}. View ratings, hours, walk-in availability, styles, and more.`,
  };
}

export function cityCategoryPageMeta(
  cityName: string,
  stateAbbr: string,
  categoryName: string
) {
  return {
    title: `${categoryName} Tattoo Artists in ${cityName}, ${stateAbbr}`,
    description: `Find the best ${categoryName.toLowerCase()} tattoo artists in ${cityName}, ${stateAbbr}. Browse portfolios, read reviews, and book your next tattoo.`,
  };
}

export function listingPageMeta(
  listingName: string,
  cityName: string,
  stateAbbr: string
) {
  const suffix = ` — ${cityName}, ${stateAbbr}`;
  const maxNameLen = MAX_TITLE_LEN - suffix.length;
  const name =
    listingName.length > maxNameLen
      ? listingName.slice(0, maxNameLen - 1).trimEnd() + "\u2026"
      : listingName;
  const desc = `${listingName} is a tattoo shop in ${cityName}, ${stateAbbr}. View portfolio, hours, pricing, walk-in availability, and contact information on InkLink.`;
  return {
    title: `${name}${suffix}`,
    description: desc.length > 160 ? desc.slice(0, 157) + "..." : desc,
  };
}

export function categoriesPageMeta() {
  return {
    title: "Tattoo Styles & Categories",
    description:
      "Browse all tattoo styles and categories. From traditional to realism, Japanese to watercolor — find artists who specialize in your preferred style.",
  };
}

export function categoryPageMeta(categoryName: string) {
  return {
    title: `${categoryName} Tattoo Artists Near You`,
    description: `Find ${categoryName.toLowerCase()} tattoo artists across the US. Browse shops by city, view portfolios, read reviews, and book your next tattoo on InkLink.`,
  };
}

export function searchPageMeta(query?: string) {
  if (query) {
    return {
      title: `Search Results for "${query}"`,
      description: `Search results for "${query}" — find tattoo shops and artists matching your criteria. Browse ratings, styles, and availability on InkLink.`,
    };
  }
  return {
    title: "Search Tattoo Shops & Artists",
    description:
      "Search for tattoo shops and artists by name, location, style, walk-in availability, and more. Compare ratings and reviews on InkLink.",
  };
}
