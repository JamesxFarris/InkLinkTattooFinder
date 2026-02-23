"use client";

import { useState } from "react";

const MONTHLY_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY || "";
const YEARLY_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_PRICE_YEARLY || "";

const features = [
  { name: "Photos per listing", free: "6", premium: "12" },
  { name: "Featured placement", free: false, premium: true },
  { name: "Artist Instagram handles", free: false, premium: true },
  { name: "Priority in search results", free: false, premium: true },
  { name: "Listing analytics", free: false, premium: true },
  { name: "Open Now badge", free: false, premium: true },
];

export function UpgradePage() {
  const [yearly, setYearly] = useState(true);
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId: yearly ? YEARLY_PRICE_ID : MONTHLY_PRICE_ID,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setLoading(false);
      }
    } catch {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="text-center">
        <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">
          Upgrade to Premium
        </h1>
        <p className="mt-2 text-stone-600 dark:text-stone-400">
          Get more out of your InkLink listing with premium features.
        </p>
      </div>

      {/* Billing Toggle */}
      <div className="mt-8 flex items-center justify-center gap-3">
        <span
          className={`text-sm font-medium ${!yearly ? "text-stone-900 dark:text-stone-100" : "text-stone-500 dark:text-stone-400"}`}
        >
          Monthly
        </span>
        <button
          onClick={() => setYearly(!yearly)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            yearly ? "bg-amber-500" : "bg-stone-300 dark:bg-stone-600"
          }`}
          aria-label="Toggle yearly billing"
        >
          <span
            className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
              yearly ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
        <span
          className={`text-sm font-medium ${yearly ? "text-stone-900 dark:text-stone-100" : "text-stone-500 dark:text-stone-400"}`}
        >
          Yearly
          <span className="ml-1.5 rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700 dark:bg-green-900/40 dark:text-green-400">
            Save 34%
          </span>
        </span>
      </div>

      {/* Pricing Cards */}
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Free Plan */}
        <div className="rounded-2xl border border-stone-200 bg-white p-6 dark:border-stone-700 dark:bg-stone-900">
          <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
            Free
          </h2>
          <p className="mt-1 text-3xl font-bold text-stone-900 dark:text-stone-100">
            $0
            <span className="text-base font-normal text-stone-500">/mo</span>
          </p>
          <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
            Basic listing on InkLink
          </p>
          <div className="mt-6 rounded-lg bg-stone-100 px-4 py-2.5 text-center text-sm font-medium text-stone-500 dark:bg-stone-800 dark:text-stone-400">
            Current Plan
          </div>
          <ul className="mt-6 space-y-3">
            {features.map((f) => (
              <li key={f.name} className="flex items-center gap-3 text-sm">
                {f.free === false ? (
                  <svg className="h-4 w-4 shrink-0 text-stone-300 dark:text-stone-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4 shrink-0 text-green-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                )}
                <span className="text-stone-600 dark:text-stone-400">
                  {f.name}
                  {typeof f.free === "string" && (
                    <span className="ml-1 font-medium text-stone-900 dark:text-stone-200">
                      ({f.free})
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Premium Plan */}
        <div className="relative rounded-2xl border-2 border-amber-400 bg-gradient-to-br from-amber-50 via-white to-amber-50/30 p-6 shadow-lg dark:from-amber-950/20 dark:via-stone-900 dark:to-amber-950/10 dark:border-amber-600">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-amber-500 px-3 py-0.5 text-xs font-semibold text-white">
            Recommended
          </div>
          <h2 className="flex items-center gap-2 text-lg font-semibold text-stone-900 dark:text-stone-100">
            <span className="text-amber-500">&#9733;</span>
            Premium
          </h2>
          <p className="mt-1 text-3xl font-bold text-stone-900 dark:text-stone-100">
            ${yearly ? "19" : "29"}
            <span className="text-base font-normal text-stone-500">/mo</span>
          </p>
          {yearly && (
            <p className="mt-0.5 text-sm text-stone-500 dark:text-stone-400">
              $228 billed yearly
            </p>
          )}
          <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
            Maximize your visibility and attract more clients.
          </p>
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="mt-6 w-full rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-amber-600 disabled:opacity-50"
          >
            {loading ? "Redirecting..." : "Upgrade to Premium"}
          </button>
          <ul className="mt-6 space-y-3">
            {features.map((f) => (
              <li key={f.name} className="flex items-center gap-3 text-sm">
                <svg className="h-4 w-4 shrink-0 text-amber-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <span className="text-stone-700 dark:text-stone-300">
                  {f.name}
                  {typeof f.premium === "string" && (
                    <span className="ml-1 font-semibold text-amber-600 dark:text-amber-400">
                      ({f.premium})
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
