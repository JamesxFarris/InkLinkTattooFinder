import { Breadcrumbs } from "@/components/Breadcrumbs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About InkLink Tattoo Finder",
  description:
    "InkLink Tattoo Finder helps you discover the best tattoo artists and shops near you. Learn about our mission to connect tattoo enthusiasts with talented artists.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "About" }]} />

      <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">
        About InkLink Tattoo Finder
      </h1>

      <div className="mt-6 space-y-6 leading-relaxed text-stone-600 dark:text-stone-400">
        <p>
          InkLink Tattoo Finder is the premier directory for finding tattoo artists and shops
          across the United States. Whether you&apos;re looking for a specific
          tattoo style, a walk-in friendly shop, or the highest-rated artists in
          your city, we make it easy to find the perfect match.
        </p>

        <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
          Our Mission
        </h2>
        <p>
          We believe everyone deserves amazing ink. Our mission is to connect
          tattoo enthusiasts with talented artists by providing comprehensive,
          up-to-date information about tattoo shops nationwide.
        </p>

        <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
          What We Offer
        </h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>Detailed listings for tattoo shops and artists across every major US city</li>
          <li>Browse by tattoo style — from traditional to fine line, Japanese to watercolor</li>
          <li>Real ratings and reviews to help you make informed decisions</li>
          <li>Up-to-date contact info, hours, and pricing details</li>
          <li>Filter by walk-in availability, piercing services, and price range</li>
        </ul>

        <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
          For Shop Owners
        </h2>
        <p>
          If you own a tattoo shop and want to update your listing or get
          featured on InkLink Tattoo Finder, reach out through our{" "}
          <a href="/contact" className="text-teal-500 hover:underline">
            contact page
          </a>
          .
        </p>
      </div>
    </div>
  );
}
