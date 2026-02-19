import type { Metadata } from "next";
import { SignInForm } from "./SignInForm";

export const metadata: Metadata = {
  title: "Sign In",
};

export default function SignInPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-xl border border-stone-700 bg-stone-900 p-8 shadow-2xl">
        <h1 className="mb-2 text-center font-display text-2xl font-bold text-stone-100">
          Welcome Back
        </h1>
        <p className="mb-8 text-center text-sm text-stone-400">
          Sign in to manage your listings
        </p>
        <SignInForm />
      </div>
    </div>
  );
}
