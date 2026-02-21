import { ClaimSearchResults } from "@/components/dashboard/ClaimSearchResults";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Claim a Shop",
};

export default function ClaimPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold text-stone-900 dark:text-stone-100">
        Claim a Shop
      </h1>
      <p className="mt-2 text-stone-600 dark:text-stone-400">
        Search for your tattoo shop and claim it to manage your listing.
      </p>
      <div className="mt-8">
        <ClaimSearchResults />
      </div>
    </div>
  );
}
