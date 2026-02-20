"use client";

import { useState } from "react";

export function ExpandableHours({ hours }: { hours: Record<string, string> }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-sm font-medium text-teal-500 hover:text-teal-600 dark:text-teal-400 dark:hover:text-teal-300"
      >
        <svg
          className={`h-4 w-4 transition-transform ${open ? "rotate-90" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        {open ? "Hide Hours" : "Show Hours"}
      </button>
      {open && (
        <div className="mt-2 space-y-1">
          {Object.entries(hours).map(([day, time]) => (
            <div key={day} className="flex justify-between text-sm">
              <span className="capitalize text-stone-600 dark:text-stone-400">{day}</span>
              <span
                className={
                  time === "closed"
                    ? "text-red-500"
                    : "font-medium text-stone-900 dark:text-stone-100"
                }
              >
                {time === "closed" ? "Closed" : time}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
