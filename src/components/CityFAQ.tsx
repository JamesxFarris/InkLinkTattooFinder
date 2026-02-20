export function CityFAQ({
  cityName,
  stateAbbr,
  listingCount,
  walkInCount,
  styles,
}: {
  cityName: string;
  stateAbbr: string;
  listingCount: number;
  walkInCount: number;
  styles: string[];
}) {
  const topStyles = styles.slice(0, 5).join(", ");

  const faqs = [
    {
      question: `How many tattoo shops are in ${cityName}, ${stateAbbr}?`,
      answer: `There are ${listingCount} tattoo shops listed in ${cityName}, ${stateAbbr} on InkLink Tattoo Finder. Browse all of them above to compare ratings, styles, and services.`,
    },
    {
      question: `Which tattoo shops in ${cityName} accept walk-ins?`,
      answer:
        walkInCount > 0
          ? `${walkInCount} tattoo shops in ${cityName} accept walk-in clients. Use the filters above to find walk-in friendly shops near you.`
          : `Walk-in availability varies. We recommend calling ahead to confirm availability at your preferred shop in ${cityName}.`,
    },
    {
      question: `What tattoo styles are popular in ${cityName}?`,
      answer: topStyles
        ? `Popular tattoo styles in ${cityName} include ${topStyles}. Use the style filter above to browse shops that specialize in your preferred style.`
        : `${cityName} tattoo shops offer a wide variety of styles. Browse individual shop profiles above to explore their specialties.`,
    },
    {
      question: `How do I choose a tattoo shop in ${cityName}?`,
      answer: `Consider factors like Google ratings, specialty styles, walk-in availability, pricing, and location. Each listing above includes ratings, services offered, and a link to the shop's full profile with hours and contact information.`,
    },
  ];

  return (
    <section>
      <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
        Frequently Asked Questions
      </h2>
      <div className="mt-6 space-y-6">
        {faqs.map((faq) => (
          <div key={faq.question}>
            <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
              {faq.question}
            </h3>
            <p className="mt-2 leading-relaxed text-stone-600 dark:text-stone-400">
              {faq.answer}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

/** Return FAQ data for JSON-LD */
export function getCityFaqData({
  cityName,
  stateAbbr,
  listingCount,
  walkInCount,
  styles,
}: {
  cityName: string;
  stateAbbr: string;
  listingCount: number;
  walkInCount: number;
  styles: string[];
}) {
  const topStyles = styles.slice(0, 5).join(", ");
  return [
    {
      question: `How many tattoo shops are in ${cityName}, ${stateAbbr}?`,
      answer: `There are ${listingCount} tattoo shops listed in ${cityName}, ${stateAbbr} on InkLink Tattoo Finder.`,
    },
    {
      question: `Which tattoo shops in ${cityName} accept walk-ins?`,
      answer:
        walkInCount > 0
          ? `${walkInCount} tattoo shops in ${cityName} accept walk-in clients.`
          : `Walk-in availability varies. We recommend calling ahead.`,
    },
    {
      question: `What tattoo styles are popular in ${cityName}?`,
      answer: topStyles
        ? `Popular tattoo styles in ${cityName} include ${topStyles}.`
        : `${cityName} tattoo shops offer a wide variety of styles.`,
    },
    {
      question: `How do I choose a tattoo shop in ${cityName}?`,
      answer: `Consider factors like Google ratings, specialty styles, walk-in availability, pricing, and location.`,
    },
  ];
}
