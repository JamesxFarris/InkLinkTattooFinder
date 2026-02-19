import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd, breadcrumbJsonLd, webPageJsonLd } from "@/components/JsonLd";
import { getAllStates } from "@/lib/queries";
import { SubmissionForm } from "./SubmissionForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "List Your Shop | InkLink Tattoo Finder",
  description:
    "Submit your tattoo shop to be listed on InkLink Tattoo Finder. Reach thousands of people searching for tattoo artists in your area.",
  alternates: { canonical: "/list-your-shop" },
};

type StateOption = { id: number; name: string };

export default async function ListYourShopPage() {
  let states: StateOption[] = [];
  try {
    const allStates = await getAllStates();
    states = allStates.map((s) => ({ id: s.id, name: s.name }));
  } catch {
    // DB unavailable
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd
        data={breadcrumbJsonLd([{ label: "List Your Shop" }])}
      />
      <JsonLd
        data={webPageJsonLd({
          name: "List Your Shop",
          description:
            "Submit your tattoo shop to be listed on InkLink Tattoo Finder.",
          url: "/list-your-shop",
        })}
      />
      <Breadcrumbs items={[{ label: "List Your Shop" }]} />

      <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">
        List Your Shop
      </h1>
      <p className="mt-2 text-stone-600 dark:text-stone-400">
        Submit your tattoo shop to InkLink and reach thousands of people
        searching for artists in your area. All submissions are reviewed before
        going live.
      </p>

      <div className="mt-8 rounded-xl border border-stone-200 bg-white p-6 shadow-sm dark:border-stone-700 dark:bg-stone-900">
        <SubmissionForm states={states} />
      </div>
    </div>
  );
}
