"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { inputClass, labelClass } from "@/lib/formClasses";

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!token) {
    return (
      <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700 dark:border-red-700 dark:bg-red-900/20 dark:text-red-400">
        <p className="font-medium">Invalid reset link</p>
        <p className="mt-1">
          This link is missing or invalid. Please{" "}
          <a href="/forgot-password" className="underline">
            request a new reset link
          </a>
          .
        </p>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
      } else {
        setSuccess(true);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-teal-300 bg-teal-50 p-4 text-sm text-teal-700 dark:border-teal-700 dark:bg-teal-900/20 dark:text-teal-400">
          <p className="font-medium">Password reset successfully!</p>
          <p className="mt-1">You can now sign in with your new password.</p>
        </div>
        <a
          href="/login"
          className="block w-full rounded-lg bg-teal-500 px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-teal-600"
        >
          Sign In
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="password" className={labelClass}>
          New Password
        </label>
        <input
          id="password"
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`mt-1 ${inputClass}`}
          placeholder="At least 8 characters"
        />
      </div>

      <div>
        <label htmlFor="confirmPassword" className={labelClass}>
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          required
          minLength={8}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={`mt-1 ${inputClass}`}
          placeholder="Confirm your new password"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-teal-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-600 disabled:opacity-50"
      >
        {loading ? "Resetting..." : "Reset Password"}
      </button>
    </form>
  );
}
