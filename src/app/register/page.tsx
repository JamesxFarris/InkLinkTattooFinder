import Link from "next/link";
import { Suspense } from "react";
import { RegisterForm } from "@/components/auth/RegisterForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account",
};

export default function RegisterPage() {
  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="rounded-xl border border-stone-200 bg-white p-8 shadow-sm dark:border-stone-700 dark:bg-stone-900">
          <h1 className="text-center font-display text-2xl font-bold text-stone-900 dark:text-stone-100">
            Create Account
          </h1>
          <p className="mt-2 text-center text-sm text-stone-500 dark:text-stone-400">
            Claim and manage your tattoo shop listing
          </p>

          <div className="mt-6">
            <Suspense fallback={null}>
              <RegisterForm />
            </Suspense>
          </div>

          <p className="mt-6 text-center text-sm text-stone-500 dark:text-stone-400">
            Already have an account?{" "}
            <Link href="/login" className="text-teal-500 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
