import { Breadcrumbs } from "@/components/Breadcrumbs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with InkLink Tattoo Finder. Reach out about listing your shop, updating information, or general inquiries.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Contact" }]} />

      <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">
        Contact Us
      </h1>

      <div className="mt-6 space-y-6 text-stone-600 dark:text-stone-400">
        <p>
          Have a question, want to list your shop, or need to update your
          information? We&apos;d love to hear from you.
        </p>

        <div className="rounded-2xl border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900">
          <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
            Get in Touch
          </h2>
          <div className="mt-4 space-y-4">
            <div>
              <h3 className="font-medium text-stone-900 dark:text-stone-100">
                General Inquiries
              </h3>
              <p className="mt-1 text-sm">
                Email us at{" "}
                <a
                  href="mailto:inklinktattoofinder@gmail.com"
                  className="text-teal-500 hover:underline"
                >
                  inklinktattoofinder@gmail.com
                </a>
              </p>
            </div>
            <div>
              <h3 className="font-medium text-stone-900 dark:text-stone-100">
                List Your Shop
              </h3>
              <p className="mt-1 text-sm">
                Want to add or claim your tattoo shop listing? Email{" "}
                <a
                  href="mailto:inklinktattoofinder@gmail.com"
                  className="text-teal-500 hover:underline"
                >
                  inklinktattoofinder@gmail.com
                </a>
              </p>
            </div>
            <div>
              <h3 className="font-medium text-stone-900 dark:text-stone-100">
                Report an Issue
              </h3>
              <p className="mt-1 text-sm">
                Found incorrect information? Let us know at{" "}
                <a
                  href="mailto:inklinktattoofinder@gmail.com"
                  className="text-teal-500 hover:underline"
                >
                  inklinktattoofinder@gmail.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
