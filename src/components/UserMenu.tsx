"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

export function UserMenu() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (status === "loading") {
    return (
      <div className="h-9 w-20 animate-pulse rounded-full bg-stone-800" />
    );
  }

  if (!session) {
    return (
      <Link
        href="/sign-in"
        className="hidden rounded-full border border-stone-700 px-5 py-2 text-sm font-semibold text-stone-300 transition-all hover:border-teal-500 hover:text-white sm:inline-flex"
      >
        Log In
      </Link>
    );
  }

  const initial = (session.user.name?.[0] ?? session.user.email?.[0] ?? "U").toUpperCase();
  const isAdmin = session.user.role === "admin";

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-full border border-stone-700 px-3 py-1.5 text-sm font-medium text-stone-300 transition-all hover:border-teal-500 hover:text-white"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-600 text-xs font-bold text-white">
          {initial}
        </span>
        <span className="hidden sm:inline">{session.user.name ?? "Account"}</span>
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 rounded-lg border border-stone-700 bg-stone-900 py-1 shadow-xl">
          <Link
            href="/dashboard"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 text-sm text-stone-300 hover:bg-stone-800 hover:text-white"
          >
            Dashboard
          </Link>
          {isAdmin && (
            <Link
              href="/dashboard/admin"
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm text-stone-300 hover:bg-stone-800 hover:text-white"
            >
              Admin Panel
            </Link>
          )}
          <hr className="my-1 border-stone-700" />
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="block w-full px-4 py-2 text-left text-sm text-stone-400 hover:bg-stone-800 hover:text-red-400"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
