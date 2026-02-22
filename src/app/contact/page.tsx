import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd, breadcrumbJsonLd, webPageJsonLd } from "@/components/JsonLd";
import { ContactForm } from "./ContactForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with InkLink Tattoo Finder. Reach out about listing your shop, updating information, or general inquiries.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact Us | InkLink Tattoo Finder",
    description:
      "Get in touch with InkLink Tattoo Finder. Reach out about listing your shop, updating information, or general inquiries.",
    url: "/contact",
  },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd data={breadcrumbJsonLd([{ label: "Contact" }])} />
      <JsonLd data={webPageJsonLd({
        name: "Contact Us",
        description: "Get in touch with InkLink Tattoo Finder. Reach out about listing your shop, updating information, or general inquiries.",
        url: "/contact",
        type: "ContactPage",
      })} />
      <Breadcrumbs items={[{ label: "Contact" }]} />

      <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">
        Contact Us
      </h1>

      <div className="mt-6 space-y-6 text-stone-600 dark:text-stone-400">
        <p>
          Have a question, want to list your shop, or need to update your
          information? We&apos;d love to hear from you.
        </p>

        <div className="rounded-2xl border border-stone-200 bg-white p-6 dark:border-stone-700 dark:bg-stone-900">
          <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
            Get in Touch
          </h2>
          <div className="mt-4">
            <ContactForm />
          </div>
        </div>

        <p className="text-center text-sm">
          Or email us directly at{" "}
          <a
            href="mailto:inklinktattoofinder@gmail.com"
            className="text-teal-500 hover:underline"
          >
            inklinktattoofinder@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
}
