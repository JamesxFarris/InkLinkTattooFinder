import type { Metadata } from "next";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Forgot Password",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="rounded-xl border border-stone-200 bg-white p-8 shadow-sm dark:border-stone-700 dark:bg-stone-900">
          <h1 className="text-center font-display text-2xl font-bold text-stone-900 dark:text-stone-100">
            Forgot Password
          </h1>
          <p className="mt-2 text-center text-sm text-stone-500 dark:text-stone-400">
            Enter your email and we&apos;ll send you a reset link
          </p>

          <div className="mt-6">
            <ForgotPasswordForm />
          </div>

          <p className="mt-6 text-center text-sm text-stone-500 dark:text-stone-400">
            Remember your password?{" "}
            <a href="/login" className="text-teal-500 hover:underline">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
