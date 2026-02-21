"use client";

import { useActionState } from "react";
import { submitContact } from "./actions";
import { Button } from "@/components/ui/Button";

const inputClass =
  "w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 dark:placeholder-stone-500";

const labelClass = "block text-sm font-medium text-stone-700 dark:text-stone-300";

export function ContactForm() {
  const [result, formAction, isPending] = useActionState(submitContact, null);

  if (result?.success) {
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-500/10">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="h-8 w-8 text-teal-500"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-lg font-semibold text-stone-900 dark:text-stone-100">
          Message Sent
        </p>
        <p className="max-w-md text-sm text-stone-600 dark:text-stone-400">
          {result.message}
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-6">
      {result && !result.success && (
        <div className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-700 dark:bg-red-900/20 dark:text-red-400">
          {result.message}
        </div>
      )}

      {/* Name */}
      <div>
        <label htmlFor="name" className={labelClass}>
          Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          className={`mt-1 ${inputClass}`}
          placeholder="Your name"
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className={labelClass}>
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className={`mt-1 ${inputClass}`}
          placeholder="you@example.com"
        />
      </div>

      {/* Subject */}
      <div>
        <label htmlFor="subject" className={labelClass}>
          Subject <span className="text-red-500">*</span>
        </label>
        <select id="subject" name="subject" required className={`mt-1 ${inputClass}`}>
          <option value="General Inquiry">General Inquiry</option>
          <option value="List My Shop">List My Shop</option>
          <option value="Report an Issue">Report an Issue</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className={labelClass}>
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className={`mt-1 ${inputClass}`}
          placeholder="How can we help you?"
        />
      </div>

      {/* Submit */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
        disabled={isPending}
      >
        {isPending ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
