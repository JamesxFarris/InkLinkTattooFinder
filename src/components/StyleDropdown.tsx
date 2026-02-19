"use client";

import { useRouter } from "next/navigation";

type Style = { slug: string; name: string; count: number };

export function StyleDropdown({
  styles,
  basePath,
}: {
  styles: Style[];
  basePath: string;
}) {
  const router = useRouter();

  if (styles.length === 0) return null;

  return (
    <select
      onChange={(e) => {
        if (e.target.value) router.push(e.target.value);
      }}
      defaultValue=""
      className="rounded-lg border border-stone-700 bg-stone-800 px-4 py-2 text-sm text-stone-300 outline-none transition focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
    >
      <option value="" disabled>
        Filter by style
      </option>
      {styles.map((s) => (
        <option key={s.slug} value={`${basePath}/${s.slug}`}>
          {s.name} ({s.count})
        </option>
      ))}
    </select>
  );
}
