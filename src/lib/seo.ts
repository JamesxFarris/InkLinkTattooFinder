import { SITE_NAME } from "./utils";

export function homePageMeta() {
  return {
    title: `Find Tattoo Artists & Shops Near You | ${SITE_NAME}`,
    description:
      "Discover the best tattoo artists and tattoo shops in your area. Browse by style, read reviews, and find your next tattoo artist.",
  };
}

export function statePageMeta(stateName: string) {
  return {
    title: `Tattoo Shops & Artists in ${stateName} | ${SITE_NAME}`,
    description: `Find the best tattoo shops and artists in ${stateName}. Browse by city, style, and read reviews to find your perfect tattoo artist.`,
  };
}

export function cityPageMeta(cityName: string, stateAbbr: string) {
  return {
    title: `Best Tattoo Shops in ${cityName}, ${stateAbbr} | ${SITE_NAME}`,
    description: `Discover top-rated tattoo shops and artists in ${cityName}, ${stateAbbr}. Browse portfolios, compare styles, and find your perfect tattoo artist.`,
  };
}

export function cityCategoryPageMeta(
  cityName: string,
  stateAbbr: string,
  categoryName: string
) {
  return {
    title: `${categoryName} Tattoo Artists in ${cityName}, ${stateAbbr} | ${SITE_NAME}`,
    description: `Find the best ${categoryName.toLowerCase()} tattoo artists in ${cityName}, ${stateAbbr}. Browse portfolios, read reviews, and book your next tattoo.`,
  };
}

export function listingPageMeta(
  listingName: string,
  cityName: string,
  stateAbbr: string
) {
  return {
    title: `${listingName} — Tattoo Shop in ${cityName}, ${stateAbbr} | ${SITE_NAME}`,
    description: `${listingName} is a tattoo shop in ${cityName}, ${stateAbbr}. View portfolio, hours, pricing, and contact information.`,
  };
}

export function categoriesPageMeta() {
  return {
    title: `Tattoo Styles & Categories | ${SITE_NAME}`,
    description:
      "Browse all tattoo styles and categories. From traditional to realism, Japanese to watercolor — find artists who specialize in your preferred style.",
  };
}

export function categoryPageMeta(categoryName: string) {
  return {
    title: `${categoryName} Tattoo Artists Near You | ${SITE_NAME}`,
    description: `Find ${categoryName.toLowerCase()} tattoo artists across the US. Browse shops by city, view portfolios, and book your next tattoo.`,
  };
}

export function searchPageMeta(query?: string) {
  if (query) {
    return {
      title: `Search Results for "${query}" | ${SITE_NAME}`,
      description: `Search results for "${query}" — find tattoo shops and artists matching your criteria.`,
    };
  }
  return {
    title: `Search Tattoo Shops & Artists | ${SITE_NAME}`,
    description:
      "Search for tattoo shops and artists by name, location, style, and more.",
  };
}
