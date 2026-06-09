"use client";

import Link from "next/link";
import { useActionState } from "react";
import { resetPassword } from "./actions";
import { inputClass, labelClass } from "@/lib/formClasses";

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, formAction, pending] = useActionState(resetPassword, null);

  if (state?.success) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg bg-teal-50 p-4 text-sm text-teal-700 dark:bg-teal-500/10 dark:text-teal-400">
          {state.message}
        </div>
        <Link
          href="/login"
          className="block w-full rounded-lg bg-teal-500 px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-teal-600"
        >
          Sign In
        </Link>
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

      <input type="hidden" name="token" value={token} />

      <div>
        <label htmlFor="password" className={labelClass}>
          New Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className={`mt-1 ${inputClass}`}
          placeholder="At least 8 characters"
        />
      </div>

      <div>
        <label htmlFor="confirm" className={labelClass}>
          Confirm New Password
        </label>
        <input
          id="confirm"
          name="confirm"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className={`mt-1 ${inputClass}`}
          placeholder="Repeat your new password"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-teal-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-600 disabled:opacity-50"
      >
        {pending ? "Resetting..." : "Reset Password"}
      </button>
    </form>
  );
}
