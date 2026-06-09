export const dynamic = "force-dynamic";

import Link from "next/link";
import { findValidAuthToken } from "@/lib/tokens";
import { ResetPasswordForm } from "./ResetPasswordForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password",
  robots: { index: false, follow: false },
};

export default async function ResetPasswordPage(props: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await props.searchParams;
  // Validate without consuming — the token is only marked used when the form submits
  const valid = token ? await findValidAuthToken(token, "password_reset") : null;

  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="rounded-xl border border-stone-200 bg-white p-8 shadow-sm dark:border-stone-700 dark:bg-stone-900">
          <h1 className="text-center font-display text-2xl font-bold text-stone-900 dark:text-stone-100">
            Reset Password
          </h1>

          {valid && token ? (
            <>
              <p className="mt-2 text-center text-sm text-stone-500 dark:text-stone-400">
                Choose a new password for your account
              </p>
              <div className="mt-6">
                <ResetPasswordForm token={token} />
              </div>
            </>
          ) : (
            <>
              <div className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
                This password reset link is invalid or has expired.
              </div>
              <p className="mt-6 text-center text-sm text-stone-500 dark:text-stone-400">
                <Link href="/forgot-password" className="text-teal-500 hover:underline">
                  Request a new reset link
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
