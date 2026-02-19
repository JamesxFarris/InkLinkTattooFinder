import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd, breadcrumbJsonLd, webPageJsonLd } from "@/components/JsonLd";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "InkLink Tattoo Finder privacy policy — how we collect, use, and protect your information.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd data={breadcrumbJsonLd([{ label: "Privacy Policy" }])} />
      <JsonLd data={webPageJsonLd({
        name: "Privacy Policy",
        description: "InkLink Tattoo Finder privacy policy — how we collect, use, and protect your information.",
        url: "/privacy",
        type: "WebPage",
      })} />
      <Breadcrumbs items={[{ label: "Privacy Policy" }]} />

      <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">
        Privacy Policy
      </h1>

      <div className="mt-6 space-y-6 leading-relaxed text-stone-600 dark:text-stone-400">
        <p>Last updated: February 2026</p>

        <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
          Information We Collect
        </h2>
        <p>
          InkLink Tattoo Finder collects minimal information to provide our directory
          service. We may collect anonymous usage data such as pages visited and
          search queries to improve our service.
        </p>

        <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
          How We Use Information
        </h2>
        <p>
          Any information collected is used solely to improve the InkLink Tattoo Finder
          directory experience. We do not sell personal information to third
          parties.
        </p>

        <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
          Business Listings
        </h2>
        <p>
          Business information displayed on InkLink Tattoo Finder (names, addresses, phone
          numbers, hours, ratings) is sourced from publicly available data.
          Business owners may request updates or removal by contacting us.
        </p>

        <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
          Cookies
        </h2>
        <p>
          We may use cookies and similar technologies to analyze site usage and
          improve performance. You can control cookie preferences through your
          browser settings.
        </p>

        <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
          Contact
        </h2>
        <p>
          For privacy-related questions, please contact us at{" "}
          <a
            href="mailto:inklinktattoofinder@gmail.com"
            className="text-teal-500 hover:underline"
          >
            inklinktattoofinder@gmail.com
          </a>
          .
        </p>
      </div>
    </div>
  );
}
