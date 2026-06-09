import Link from "next/link";
import { getTotalListingCount, formatApproxCount } from "@/lib/queries";
import type { Metadata } from "next";
import { fullMeta } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = fullMeta({
  title: "Claim & Manage Your Tattoo Shop Listing",
  description:
    "Claim your free listing on InkLink Tattoo Finder. Update your hours, photos, and services to reach thousands of people searching for tattoo artists.",
  url: "/for-shop-owners",
});

export default async function ForShopOwnersPage() {
  const totalCount = await getTotalListingCount();
  const shopCount = formatApproxCount(totalCount);

  return (
    <>
      {/* Hero */}
      <section className="bg-stone-900">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <h1 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Claim & Manage Your{" "}
            <span className="text-teal-400">Tattoo Shop</span> Listing
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-stone-300">
            Join {shopCount} shops already on InkLink. Keep your listing
            accurate, showcase your work, and get found by thousands of people
            searching for tattoo artists near them.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/register?callbackUrl=/dashboard/claim"
              className="inline-flex rounded-full bg-teal-500 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-teal-500/25 transition-all hover:bg-teal-600 hover:shadow-xl hover:shadow-teal-500/30"
            >
              Claim Your Shop — Free
            </Link>
            <Link
              href="/login?callbackUrl=/dashboard/claim"
              className="inline-flex rounded-full border border-stone-600 px-8 py-3.5 text-sm font-semibold text-stone-300 transition-all hover:border-stone-500 hover:text-white"
            >
              Already have an account? Log in
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="text-center font-display text-3xl font-bold text-stone-900 dark:text-stone-100">
          Why Claim Your Listing?
        </h2>
        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {[
            {
              icon: (
                <svg className="h-8 w-8 text-teal-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
              ),
              title: "Update Your Listing",
              desc: "Edit your hours, phone number, website, photos, tattoo styles, and walk-in availability so customers always see the right info.",
            },
            {
              icon: (
                <svg className="h-8 w-8 text-teal-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              ),
              title: "Reach More Customers",
              desc: "InkLink ranks in Google for thousands of tattoo-related searches. An accurate listing means more calls, DMs, and walk-ins.",
            },
            {
              icon: (
                <svg className="h-8 w-8 text-teal-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                </svg>
              ),
              title: "Free to Claim",
              desc: "Claiming and managing your basic listing is completely free. No credit card required, no hidden fees.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-stone-200/60 bg-white p-6 text-center dark:border-stone-700/50 dark:bg-stone-800/60"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-teal-500/10">
                {item.icon}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-stone-900 dark:text-stone-100">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-500 dark:text-stone-400">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="border-y border-stone-200/60 bg-stone-100/40 dark:border-stone-800/40 dark:bg-stone-900/30">
        <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
          <h2 className="text-center font-display text-3xl font-bold text-stone-900 dark:text-stone-100">
            How It Works
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {[
              { step: "1", title: "Search", desc: "Find your shop by name or location in our database." },
              { step: "2", title: "Register", desc: "Create a free account with your email address." },
              { step: "3", title: "Claim", desc: "Submit a claim request. We'll verify and approve it quickly." },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-500 text-lg font-bold text-white">
                  {item.step}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-stone-900 dark:text-stone-100">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Section */}
      <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="inline-block rounded-full bg-amber-100 px-4 py-1.5 text-sm font-semibold text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
            Premium
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold text-stone-900 dark:text-stone-100">
            Want Even More Visibility?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-stone-500 dark:text-stone-400">
            Premium shops get seen first. Stand out from the competition and turn more searchers into customers.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: (
                <svg className="h-7 w-7 text-amber-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 010 1.954l-7.108 4.061A1.125 1.125 0 013 16.811V8.69zM12.75 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 010 1.954l-7.108 4.061a1.125 1.125 0 01-1.683-.977V8.69z" />
                </svg>
              ),
              title: "Priority Placement",
              desc: "Your shop appears above free listings in search results and city pages.",
            },
            {
              icon: (
                <svg className="h-7 w-7 text-amber-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                </svg>
              ),
              title: "Featured Badge",
              desc: "A gold badge and border make your listing impossible to miss.",
            },
            {
              icon: (
                <svg className="h-7 w-7 text-amber-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                </svg>
              ),
              title: "24 Photos",
              desc: "Showcase twice as much of your work compared to free listings.",
            },
            {
              icon: (
                <svg className="h-7 w-7 text-amber-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
              ),
              title: "View Analytics",
              desc: "See how many people view your listing and click your contact info.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-amber-200/60 bg-gradient-to-b from-amber-50/50 to-white p-5 dark:border-amber-800/30 dark:from-amber-950/20 dark:to-stone-900"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/10">
                {item.icon}
              </div>
              <h3 className="mt-3 font-semibold text-stone-900 dark:text-stone-100">
                {item.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-stone-500 dark:text-stone-400">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-3xl font-bold text-stone-900 dark:text-stone-100">
            $14<span className="text-base font-normal text-stone-500">/mo</span>
          </p>
          <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
            or $9/mo billed yearly — save 36%
          </p>
          <Link
            href="/register?callbackUrl=/dashboard/upgrade"
            className="mt-6 inline-flex rounded-full bg-amber-500 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-amber-500/25 transition-all hover:bg-amber-600 hover:shadow-xl hover:shadow-amber-500/30"
          >
            Get Premium
          </Link>
          <p className="mt-3 text-xs text-stone-400 dark:text-stone-500">
            Cancel anytime. No long-term contracts.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="text-center font-display text-3xl font-bold text-stone-900 dark:text-stone-100">
          Frequently Asked Questions
        </h2>
        <div className="mt-10 space-y-6">
          {[
            {
              q: "Is it really free to claim my listing?",
              a: "Yes. Claiming and managing your basic listing is 100% free. We also offer a Premium plan with extra features like expanded photo uploads and priority placement, but it's entirely optional.",
            },
            {
              q: "How long does the claim process take?",
              a: "Most claims are reviewed and approved within 24 hours. You'll receive an email notification once your claim is approved.",
            },
            {
              q: "What if my shop isn't listed yet?",
              a: "No problem — you can add a brand-new listing for free through our \"Add a Listing\" page. Once it's created you'll automatically be the owner.",
            },
            {
              q: "What does Premium include?",
              a: "Premium ($14/mo or $9/mo billed yearly) gives you up to 24 photos, an \"Open Now\" badge, view-count analytics on your dashboard, and priority placement in search results.",
            },
          ].map((faq) => (
            <div key={faq.q}>
              <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                {faq.q}
              </h3>
              <p className="mt-2 leading-relaxed text-stone-600 dark:text-stone-400">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-stone-900">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
            Ready to take control of your listing?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-stone-400">
            It only takes a minute to create an account and claim your shop.
          </p>
          <Link
            href="/register?callbackUrl=/dashboard/claim"
            className="mt-8 inline-flex rounded-full bg-teal-500 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-teal-500/25 transition-all hover:bg-teal-600 hover:shadow-xl hover:shadow-teal-500/30"
          >
            Get Started — It&apos;s Free
          </Link>
        </div>
      </section>
    </>
  );
}
