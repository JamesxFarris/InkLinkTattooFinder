"use client";

import { useState, useCallback } from "react";
import { inputClass, labelClass } from "@/lib/formClasses";

const DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

/** Generate 30-min time options from 12:00 AM to 11:30 PM */
function buildTimeOptions(): string[] {
  const opts: string[] = [];
  for (let h = 0; h < 24; h++) {
    for (const m of [0, 30]) {
      const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
      const suffix = h < 12 ? "AM" : "PM";
      const mm = m === 0 ? "00" : "30";
      opts.push(`${hour12}:${mm} ${suffix}`);
    }
  }
  return opts;
}

const TIME_OPTIONS = buildTimeOptions();

type DayState = {
  day: string;
  closed: boolean;
  open: string;
  close: string;
};

function parseHoursString(value: string): { closed: boolean; open: string; close: string } {
  if (!value || value.toLowerCase() === "closed") {
    return { closed: true, open: "9:00 AM", close: "5:00 PM" };
  }
  const parts = value.split(" - ");
  if (parts.length === 2) {
    const open = parts[0].trim();
    const close = parts[1].trim();
    // Only use parsed values if they exist in our options
    return {
      closed: false,
      open: TIME_OPTIONS.includes(open) ? open : "9:00 AM",
      close: TIME_OPTIONS.includes(close) ? close : "5:00 PM",
    };
  }
  return { closed: false, open: "9:00 AM", close: "5:00 PM" };
}

function buildInitialState(existing?: Record<string, string> | null): DayState[] {
  return DAYS.map((day) => {
    const value = existing?.[day];
    const parsed = parseHoursString(value ?? "");
    return {
      day,
      closed: value === undefined ? true : parsed.closed,
      open: parsed.open,
      close: parsed.close,
    };
  });
}

function serialize(days: DayState[]): string {
  const obj: Record<string, string> = {};
  for (const d of days) {
    obj[d.day] = d.closed ? "closed" : `${d.open} - ${d.close}`;
  }
  return JSON.stringify(obj);
}

export function HoursEditor({
  existingHours,
}: {
  existingHours?: Record<string, string> | null;
}) {
  const [days, setDays] = useState<DayState[]>(() => buildInitialState(existingHours));

  const update = useCallback((index: number, patch: Partial<DayState>) => {
    setDays((prev) => prev.map((d, i) => (i === index ? { ...d, ...patch } : d)));
  }, []);

  return (
    <div className="space-y-3">
      {days.map((d, i) => (
        <div
          key={d.day}
          className="flex flex-wrap items-center gap-3 rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 dark:border-stone-700 dark:bg-stone-800/50"
        >
          <span className="w-24 text-sm font-medium capitalize text-stone-700 dark:text-stone-300">
            {d.day}
          </span>

          <label className="flex items-center gap-1.5 text-sm text-stone-600 dark:text-stone-400">
            <input
              type="checkbox"
              checked={d.closed}
              onChange={(e) => update(i, { closed: e.target.checked })}
              className="rounded border-stone-300 text-red-500 focus:ring-red-500 dark:border-stone-600"
            />
            Closed
          </label>

          {!d.closed && (
            <>
              <select
                value={d.open}
                onChange={(e) => update(i, { open: e.target.value })}
                className={`${inputClass} w-auto py-1.5 text-sm`}
              >
                {TIME_OPTIONS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <span className="text-sm text-stone-400">to</span>
              <select
                value={d.close}
                onChange={(e) => update(i, { close: e.target.value })}
                className={`${inputClass} w-auto py-1.5 text-sm`}
              >
                {TIME_OPTIONS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </>
          )}
        </div>
      ))}

      <input type="hidden" name="hours" value={serialize(days)} />
    </div>
  );
}
