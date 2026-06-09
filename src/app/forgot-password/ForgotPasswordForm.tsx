"use client";

import { useActionState } from "react";
import { requestPasswordReset } from "./actions";
import { inputClass, labelClass } from "@/lib/formClasses";

export function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(requestPasswordReset, null);

  if (state?.success) {
    return (
      <div className="rounded-lg bg-teal-50 p-4 text-sm text-teal-700 dark:bg-teal-500/10 dark:text-teal-400">
        {state.message}
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      {state && !state.success && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
          {state.message}
        </div>
      )}

      <div>
        <label htmlFor="email" className={labelClass}>
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className={`mt-1 ${inputClass}`}
          placeholder="you@example.com"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-teal-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-600 disabled:opacity-50"
      >
        {pending ? "Sending..." : "Send Reset Link"}
      </button>
    </form>
  );
}
