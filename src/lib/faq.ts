type FaqInput = {
  cityName: string;
  stateName: string;
  stateAbbreviation: string;
  listingCount: number;
  categoryNames: string[];
};

export type FaqItem = { question: string; answer: string };

export function generateCityFaqItems(input: FaqInput): FaqItem[] {
  const { cityName, stateName, stateAbbreviation, listingCount, categoryNames } = input;

  const stylesText =
    categoryNames.length > 0
      ? `Popular tattoo styles in ${cityName} include ${categoryNames.join(", ")}. Browse our listings to see portfolios and find an artist who specializes in the style you want.`
      : `${cityName} tattoo shops offer a wide range of styles. Browse individual shop pages to view portfolios and find the right artist for your desired style.`;

  return [
    {
      question: `How many tattoo shops are in ${cityName}, ${stateAbbreviation}?`,
      answer: `We currently have ${listingCount} tattoo ${listingCount === 1 ? "shop" : "shops"} listed in ${cityName}, ${stateAbbreviation}. New shops are added regularly, so check back often for the latest listings.`,
    },
    {
      question: `What tattoo styles are popular in ${cityName}?`,
      answer: stylesText,
    },
    {
      question: `Do tattoo shops in ${cityName} accept walk-ins?`,
      answer: `Walk-in policies vary by shop. Many tattoo shops in ${cityName} accept walk-ins for smaller pieces, while larger or more detailed work typically requires an appointment. Check individual shop listings for their specific walk-in policy.`,
    },
    {
      question: `What should I know about tattoo regulations in ${stateName}?`,
      answer: `${stateName} requires tattoo artists to follow strict health and safety regulations, including proper licensing, age verification (typically 18+, or 16+ with parental consent), and adherence to health department codes for sterilization and sanitation. Always choose a licensed shop that follows these guidelines.`,
    },
    {
      question: `How do I choose the right tattoo artist in ${cityName}?`,
      answer: `Start by reviewing artist portfolios to find someone whose style matches your vision. Read customer reviews, check their ratings, and look for consistent quality in their work. Many artists in ${cityName} offer free consultations — take advantage of these to discuss your ideas and ensure a good fit before committing.`,
    },
  ];
}
