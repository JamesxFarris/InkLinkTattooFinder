export const dynamic = "force-dynamic";

import Link from "next/link";
import { SearchBar } from "@/components/SearchBar";
import { CategoryCard } from "@/components/CategoryCard";
import { CityCard } from "@/components/CityCard";
import { CityFaq } from "@/components/CityFaq";
import { JsonLd, websiteJsonLd, organizationJsonLd, faqJsonLd } from "@/components/JsonLd";
import { HERO_IMAGE } from "@/lib/images";
import { getAllCategories, getTopCities, getAllStates } from "@/lib/queries";
import type { FaqItem } from "@/lib/faq";

const homepageFaq: FaqItem[] = [
  {
    question: "How do I find a good tattoo artist near me?",
    answer: "Use InkLink Tattoo Finder to search by your zip code or city. You can filter by tattoo style, read reviews, check ratings, and view artist portfolios. Look for artists with consistent quality in the style you want, positive reviews, and proper licensing.",
  },
  {
    question: "How much does a tattoo cost?",
    answer: "Tattoo pricing varies widely depending on size, detail, color, placement, and the artist's experience. Small simple designs may start around $50\u2013$100, while larger or more detailed pieces can range from $200 to several thousand dollars. Most artists charge by the hour ($100\u2013$300/hr) or offer flat rates for specific designs. Always discuss pricing during a consultation before committing.",
  },
  {
    question: "What should I look for when choosing a tattoo shop?",
    answer: "Look for a clean, licensed shop that follows health department regulations. Check that artists use single-use needles, sterile equipment, and proper sanitation practices. Read online reviews, view portfolios of their work, and visit the shop in person if possible. A reputable shop will be happy to answer questions about their sterilization process.",
  },
  {
    question: "Does getting a tattoo hurt?",
    answer: "Pain levels vary by placement, size, and personal tolerance. Areas with more bone or nerve endings (ribs, spine, inner arm, feet) tend to be more painful, while fleshier areas (outer arm, thigh, calf) are generally more tolerable. Most people describe the sensation as a scratching or burning feeling. Your artist can advise on what to expect for your specific placement.",
  },
  {
    question: "How do I take care of a new tattoo?",
    answer: "Follow your artist's aftercare instructions carefully. Generally, keep the tattoo clean and moisturized, avoid soaking it in water (no pools or baths) for 2\u20134 weeks, stay out of direct sunlight, and don't pick or scratch at peeling skin. Use a fragrance-free moisturizer and wash gently with mild soap. Proper aftercare is essential for vibrant, long-lasting results.",
  },
  {
    question: "What tattoo styles are most popular?",
    answer: "The most popular tattoo styles include Traditional (bold lines, classic imagery), Realism (photorealistic portraits and nature), Japanese (large-scale with dragons, koi, waves), Fine Line (delicate minimal designs), Blackwork (bold black ink patterns), and Watercolor (painterly color blends). Browse our style categories to find artists who specialize in each.",
  },
  {
    question: "Do I need an appointment or can I walk in?",
    answer: "It depends on the shop. Many tattoo shops accept walk-ins for smaller, simpler pieces, while custom or larger work typically requires an appointment booked in advance. Popular artists may have wait times of weeks or months. Check individual shop listings on InkLink to see their walk-in policy, or contact them directly to book a consultation.",
  },
  {
    question: "How old do you have to be to get a tattoo?",
    answer: "In most US states, you must be 18 years old to get a tattoo. Some states allow minors (typically 16+) to get tattooed with written parental consent and a parent present. Regulations vary by state, so check your local laws. Reputable shops will always verify age with a valid photo ID before tattooing.",
  },
];

export default async function HomePage() {
  const [categories, cities, states] = await Promise.all([
    getAllCategories(),
    getTopCities(12),
    getAllStates(),
  ]);

  return (
    <>
      <JsonLd data={websiteJsonLd()} />
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={faqJsonLd(homepageFaq)} />

      {/* Hero — immersive background image with search */}
      <section className="relative min-h-[480px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-[center_25%]"
          style={{ backgroundImage: `url(${HERO_IMAGE})` }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-stone-900/65" aria-hidden="true" />

        <div className="relative mx-auto max-w-4xl px-4 pb-20 pt-16 text-center sm:pb-28 sm:pt-24">
          <h1 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Find the Best{" "}
            <span className="text-teal-400">Tattoo Artists</span>{" "}
            Near You
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-stone-300">
            Search thousands of shops and artists by style, city, and ratings.
          </p>
          <div className="mt-8 flex justify-center">
            <SearchBar size="large" />
          </div>

          {/* Trust indicators */}
          <div className="mx-auto mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-stone-300">
            <span className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Free to use
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Real reviews
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-teal-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              Nationwide
            </span>
          </div>

          {/* Quick browse links */}
          <div className="mx-auto mt-6 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-stone-400">Popular:</span>
            {[
              { label: "Traditional", href: "/categories/traditional" },
              { label: "Realism", href: "/categories/realism" },
              { label: "Japanese", href: "/categories/japanese" },
              { label: "Fine Line", href: "/categories/fine-line" },
              { label: "Blackwork", href: "/categories/blackwork" },
            ].map((style) => (
              <Link
                key={style.href}
                href={style.href}
                className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur-sm transition-colors hover:bg-white/20 hover:text-white"
              >
                {style.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Styles */}
      <section className="border-y border-stone-200/60 bg-stone-100/40 dark:border-stone-800/40 dark:bg-stone-900/30">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h2 className="section-heading font-display text-3xl font-bold text-stone-900 dark:text-stone-100">
              Browse by Style
            </h2>
            <p className="mt-4 text-stone-500 dark:text-stone-400">
              Find artists who specialize in your preferred tattoo style.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.slice(0, 12).map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                href={`/categories/${category.slug}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Top Cities */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h2 className="section-heading font-display text-3xl font-bold text-stone-900 dark:text-stone-100">
            Top Cities
          </h2>
          <p className="mt-4 text-stone-500 dark:text-stone-400">
            Explore the best tattoo scenes in major cities across the US.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cities.map((city) => (
            <CityCard key={city.id} city={city} />
          ))}
        </div>
      </section>

      {/* Browse by State */}
      <section className="border-t border-stone-200/60 bg-stone-100/40 dark:border-stone-800/40 dark:bg-stone-900/30">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h2 className="section-heading font-display text-3xl font-bold text-stone-900 dark:text-stone-100">
              Browse by State
            </h2>
            <p className="mt-4 text-stone-500 dark:text-stone-400">
              Find tattoo shops and artists in every state across the US.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {states.map((state) => (
              <Link
                key={state.id}
                href={`/${state.slug}`}
                className="group flex h-24 w-[calc(50%-0.375rem)] flex-col items-center justify-center rounded-xl border border-stone-200/60 bg-white text-center transition-all hover:-translate-y-0.5 hover:border-teal-500/50 hover:shadow-lg sm:w-[calc(33.333%-0.5rem)] md:w-[calc(25%-0.5625rem)] lg:w-[calc(20%-0.6rem)] xl:w-[calc(16.666%-0.625rem)] dark:border-stone-700/50 dark:bg-stone-800/60 dark:hover:border-teal-500/40"
              >
                <span className="text-xs font-bold tracking-widest text-teal-500 dark:text-teal-400">
                  {state.abbreviation}
                </span>
                <span className="mt-1 block text-sm font-semibold text-stone-800 transition-colors group-hover:text-teal-600 dark:text-stone-200 dark:group-hover:text-teal-400">
                  {state.name}
                </span>
                <span className="mt-0.5 text-xs text-stone-400 dark:text-stone-500">
                  {state._count.listings} {state._count.listings === 1 ? "shop" : "shops"}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="font-display text-3xl font-bold text-stone-900 dark:text-stone-100">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-stone-500 dark:text-stone-400">
            Everything you need to know about finding and getting tattoos.
          </p>
        </div>
        <CityFaq items={homepageFaq} />
      </section>

      {/* CTA Section */}
      <section className="bg-stone-900">
        <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold text-white">
            Own a tattoo shop?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-stone-400">
            Get listed on InkLink Tattoo Finder and reach thousands of people
            looking for their next tattoo artist.
          </p>
          <a
            href="/contact"
            className="mt-8 inline-flex rounded-full bg-teal-500 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-teal-500/25 transition-all hover:bg-teal-600 hover:shadow-xl hover:shadow-teal-500/30"
          >
            List Your Shop
          </a>
        </div>
      </section>
    </>
  );
}
