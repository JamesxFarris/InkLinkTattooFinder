type ListingFaqInput = {
  name: string;
  city: string;
  stateAbbr: string;
  categories: string[];
  acceptsWalkIns: boolean;
  piercingServices: boolean;
  tattooRemoval: boolean;
  hourlyRateMin: number | null;
  hourlyRateMax: number | null;
  googleRating: number | null;
  googleReviewCount: number | null;
  hours: Record<string, string> | null;
};

export function getListingFaqData(input: ListingFaqInput) {
  const {
    name,
    city,
    stateAbbr,
    categories,
    acceptsWalkIns,
    piercingServices,
    tattooRemoval,
    hourlyRateMin,
    hourlyRateMax,
    googleRating,
    googleReviewCount,
    hours,
  } = input;

  const faqs: { question: string; answer: string }[] = [];
  const loc = `${city}, ${stateAbbr}`;

  // Walk-ins
  if (acceptsWalkIns) {
    faqs.push({
      question: `Does ${name} accept walk-ins?`,
      answer: `Yes, ${name} in ${loc} accepts walk-in clients. However, it's always a good idea to call ahead or check their website to confirm availability.`,
    });
  }

  // Styles / specialties
  if (categories.length > 0) {
    const styles = categories.slice(0, 5).join(", ");
    faqs.push({
      question: `What tattoo styles does ${name} specialize in?`,
      answer: `${name} specializes in ${styles}. Visit their profile on InkLink for photos and more details about each style they offer.`,
    });
  }

  // Pricing
  if (hourlyRateMin || hourlyRateMax) {
    const rate =
      hourlyRateMin && hourlyRateMax
        ? `$${hourlyRateMin}–$${hourlyRateMax} per hour`
        : hourlyRateMin
          ? `from $${hourlyRateMin} per hour`
          : `up to $${hourlyRateMax} per hour`;
    faqs.push({
      question: `How much does a tattoo cost at ${name}?`,
      answer: `Hourly rates at ${name} range ${rate}. Final pricing depends on the size, detail, and placement of the tattoo. Contact them directly for a custom quote.`,
    });
  }

  // Rating
  if (googleRating && googleReviewCount) {
    faqs.push({
      question: `What are the reviews like for ${name}?`,
      answer: `${name} has a ${googleRating}-star rating based on ${googleReviewCount} Google reviews. Check their Google listing for detailed customer feedback.`,
    });
  }

  // Additional services
  const extras: string[] = [];
  if (piercingServices) extras.push("piercing services");
  if (tattooRemoval) extras.push("tattoo removal");
  if (extras.length > 0) {
    faqs.push({
      question: `Does ${name} offer services besides tattooing?`,
      answer: `Yes, ${name} also offers ${extras.join(" and ")} in addition to custom tattoo work.`,
    });
  }

  // Hours
  if (hours) {
    const openDays = Object.entries(hours)
      .filter(([, v]) => v && v.toLowerCase() !== "closed")
      .map(([day]) => day.charAt(0).toUpperCase() + day.slice(1));
    if (openDays.length > 0) {
      faqs.push({
        question: `What are the hours for ${name}?`,
        answer: `${name} is open ${openDays.join(", ")}. Check the hours section on this page for exact opening and closing times.`,
      });
    }
  }

  // Location — always include
  faqs.push({
    question: `Where is ${name} located?`,
    answer: `${name} is a tattoo shop located in ${loc}. Visit this page for their full address, phone number, and directions.`,
  });

  return faqs;
}

export function ListingFaq({ faqs }: { faqs: { question: string; answer: string }[] }) {
  if (faqs.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="mb-4 text-xl font-bold text-stone-900 dark:text-stone-100">
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        {faqs.map((faq) => (
          <div key={faq.question}>
            <h3 className="text-base font-semibold text-stone-900 dark:text-stone-100">
              {faq.question}
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-stone-600 dark:text-stone-400">
              {faq.answer}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
