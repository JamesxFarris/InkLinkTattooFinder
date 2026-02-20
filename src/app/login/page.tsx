import { Suspense } from "react";
import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="rounded-xl border border-stone-700 bg-stone-900 p-8">
          <h1 className="text-center font-display text-2xl font-bold text-stone-100">
            Sign In
          </h1>
          <p className="mt-2 text-center text-sm text-stone-400">
            Sign in to manage your listings
          </p>

          <div className="mt-6">
            <Suspense fallback={null}>
              <LoginForm />
            </Suspense>
          </div>

          <p className="mt-6 text-center text-sm text-stone-400">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-teal-500 hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
