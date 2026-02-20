"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

export function UserMenu() {
  const { data: session } = useSession();
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

  if (!session) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-full border border-stone-700 bg-stone-800 px-3 py-1.5 text-sm font-medium text-stone-300 transition-colors hover:border-stone-600 hover:text-stone-100"
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-500/20 text-xs font-bold text-teal-400">
          {session.user.name?.[0]?.toUpperCase() || "U"}
        </span>
        <span className="hidden sm:inline">{session.user.name}</span>
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-48 rounded-lg border border-stone-700 bg-stone-800 py-1 shadow-xl">
          <Link
            href="/dashboard"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 text-sm text-stone-300 hover:bg-stone-700 hover:text-stone-100"
          >
            Dashboard
          </Link>
          {session.user.role === "admin" && (
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm text-stone-300 hover:bg-stone-700 hover:text-stone-100"
            >
              Admin Panel
            </Link>
          )}
          <hr className="my-1 border-stone-700" />
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="block w-full px-4 py-2 text-left text-sm text-stone-300 hover:bg-stone-700 hover:text-stone-100"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
