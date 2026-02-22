export function CityFaq({
  cityName,
  stateAbbr,
  listingCount,
  styles,
}: {
  cityName: string;
  stateAbbr: string;
  listingCount: number;
  styles: string[];
}) {
  const topStyles = styles.slice(0, 5).join(", ");

  const faqs = [
    {
      question: `How many tattoo shops are in ${cityName}, ${stateAbbr}?`,
      answer: `There are ${listingCount} tattoo shops listed in ${cityName}, ${stateAbbr} on InkLink Tattoo Finder. Browse all of them above to compare ratings, styles, and services.`,
    },
    {
      question: `What tattoo styles are popular in ${cityName}?`,
      answer: topStyles
        ? `Popular tattoo styles in ${cityName} include ${topStyles}. Use the style filter above to browse shops that specialize in your preferred style.`
        : `${cityName} tattoo shops offer a wide variety of styles. Browse individual shop profiles above to explore their specialties.`,
    },
    {
      question: `How do I choose a tattoo shop in ${cityName}?`,
      answer: `Consider factors like Google ratings, specialty styles, pricing, and location. Each listing above includes ratings, services offered, and a link to the shop's full profile with hours and contact information.`,
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
  styles,
}: {
  cityName: string;
  stateAbbr: string;
  listingCount: number;
  styles: string[];
}) {
  const topStyles = styles.slice(0, 5).join(", ");
  return [
    {
      question: `How many tattoo shops are in ${cityName}, ${stateAbbr}?`,
      answer: `There are ${listingCount} tattoo shops listed in ${cityName}, ${stateAbbr} on InkLink Tattoo Finder.`,
    },
    {
      question: `What tattoo styles are popular in ${cityName}?`,
      answer: topStyles
        ? `Popular tattoo styles in ${cityName} include ${topStyles}.`
        : `${cityName} tattoo shops offer a wide variety of styles.`,
    },
    {
      question: `How do I choose a tattoo shop in ${cityName}?`,
      answer: `Consider factors like Google ratings, specialty styles, pricing, and location.`,
    },
  ];
}
