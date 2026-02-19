import type { Metadata } from "next";
import { SignUpForm } from "./SignUpForm";

export const metadata: Metadata = {
  title: "Sign Up",
};

export default function SignUpPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-xl border border-stone-700 bg-stone-900 p-8 shadow-2xl">
        <h1 className="mb-2 text-center font-display text-2xl font-bold text-stone-100">
          Create Your Account
        </h1>
        <p className="mb-8 text-center text-sm text-stone-400">
          List and manage your tattoo shop
        </p>
        <SignUpForm />
      </div>
    </div>
  );
}
