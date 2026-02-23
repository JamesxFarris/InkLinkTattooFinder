"use client";

import { useActionState } from "react";
import { changePassword } from "./actions";
import { Button } from "@/components/ui/Button";
import { inputClass, labelClass } from "@/lib/formClasses";

export function ChangePasswordForm() {
  const [result, formAction, isPending] = useActionState(changePassword, null);

  return (
    <form action={formAction} className="space-y-4">
      {result && (
        <div
          className={`rounded-lg border px-4 py-3 text-sm ${
            result.success
              ? "border-teal-300 bg-teal-50 text-teal-700 dark:border-teal-700 dark:bg-teal-900/20 dark:text-teal-400"
              : "border-red-300 bg-red-50 text-red-700 dark:border-red-700 dark:bg-red-900/20 dark:text-red-400"
          }`}
        >
          {result.message}
        </div>
      )}

      <div>
        <label htmlFor="currentPassword" className={labelClass}>
          Current Password
        </label>
        <input
          type="password"
          id="currentPassword"
          name="currentPassword"
          required
          className={`mt-1 ${inputClass}`}
        />
      </div>

      <div>
        <label htmlFor="newPassword" className={labelClass}>
          New Password
        </label>
        <input
          type="password"
          id="newPassword"
          name="newPassword"
          required
          minLength={8}
          className={`mt-1 ${inputClass}`}
        />
      </div>

      <div>
        <label htmlFor="confirmPassword" className={labelClass}>
          Confirm New Password
        </label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          required
          minLength={8}
          className={`mt-1 ${inputClass}`}
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        disabled={isPending}
      >
        {isPending ? "Changing..." : "Change Password"}
      </Button>
    </form>
  );
}
