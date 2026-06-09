export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/db";
import { consumeAuthToken } from "@/lib/tokens";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify Email",
  robots: { index: false, follow: false },
};

export default async function VerifyEmailPage(props: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await props.searchParams;

  let verified = false;
  if (token) {
    const tokenRow = await consumeAuthToken(token, "email_verify");
    if (tokenRow) {
      await prisma.user.update({
        where: { id: tokenRow.userId },
        data: { emailVerifiedAt: new Date() },
      });
      verified = true;
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="rounded-xl border border-stone-200 bg-white p-8 shadow-sm dark:border-stone-700 dark:bg-stone-900">
          <h1 className="text-center font-display text-2xl font-bold text-stone-900 dark:text-stone-100">
            {verified ? "Email Verified" : "Verification Failed"}
          </h1>

          {verified ? (
            <>
              <div className="mt-6 rounded-lg bg-teal-50 p-4 text-sm text-teal-700 dark:bg-teal-500/10 dark:text-teal-400">
                Thanks — your email address is confirmed.
              </div>
              <Link
                href="/login"
                className="mt-6 block w-full rounded-lg bg-teal-500 px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-teal-600"
              >
                Sign In
              </Link>
            </>
          ) : (
            <>
              <div className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
                This verification link is invalid, expired, or already used. If you&apos;ve
                already verified your email, you can simply sign in.
              </div>
              <p className="mt-6 text-center text-sm text-stone-500 dark:text-stone-400">
                <Link href="/login" className="text-teal-500 hover:underline">
                  Go to sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
