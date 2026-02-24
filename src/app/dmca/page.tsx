import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd, breadcrumbJsonLd, webPageJsonLd } from "@/components/JsonLd";
import { DmcaForm } from "./DmcaForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DMCA / Takedown Request",
  description:
    "Submit a DMCA or content takedown request to InkLink Tattoo Finder. Shop owners can request removal of photos or listings.",
  alternates: { canonical: "/dmca" },
  openGraph: {
    title: "DMCA / Takedown Request | InkLink Tattoo Finder",
    description:
      "Submit a DMCA or content takedown request to InkLink Tattoo Finder. Shop owners can request removal of photos or listings.",
    url: "/dmca",
  },
};

export default function DmcaPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd data={breadcrumbJsonLd([{ label: "DMCA / Takedown Request" }])} />
      <JsonLd
        data={webPageJsonLd({
          name: "DMCA / Takedown Request",
          description:
            "Submit a DMCA or content takedown request to InkLink Tattoo Finder. Shop owners can request removal of photos or listings.",
          url: "/dmca",
          type: "WebPage",
        })}
      />
      <Breadcrumbs items={[{ label: "DMCA / Takedown Request" }]} />

      <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">
        DMCA / Takedown Request
      </h1>

      <div className="mt-6 space-y-6 leading-relaxed text-stone-600 dark:text-stone-400">
        <div>
          <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
            What This Page Is For
          </h2>
          <p className="mt-2">
            InkLink Tattoo Finder respects the intellectual property rights of
            others and complies with the Digital Millennium Copyright Act (DMCA).
            If you believe your content has been displayed without
            authorization, you may submit a takedown request using the form
            below.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
            What Qualifies
          </h2>
          <ul className="mt-2 ml-6 list-disc space-y-2">
            <li>
              Photos or images displayed on your listing that you own the
              copyright to and did not authorize for use
            </li>
            <li>
              Trademark or branding material used without your permission
            </li>
            <li>
              Any other content associated with your business that you want
              removed
            </li>
            <li>
              Requests to remove your entire business listing from our directory
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
            What to Expect
          </h2>
          <p className="mt-2">
            We take all takedown requests seriously. Once you submit a request,
            our team will review it within 48 business hours. If your request is
            valid, the identified content will be removed promptly. You will
            receive an email confirmation when the request has been processed.
          </p>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-stone-200 bg-white p-6 dark:border-stone-700 dark:bg-stone-900">
        <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
          Submit a Takedown Request
        </h2>
        <div className="mt-4">
          <DmcaForm />
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-stone-600 dark:text-stone-400">
        Or email us directly at{" "}
        <a
          href="mailto:inklinktattoofinder@gmail.com"
          className="text-teal-500 hover:underline"
        >
          inklinktattoofinder@gmail.com
        </a>
      </p>
    </div>
  );
}
