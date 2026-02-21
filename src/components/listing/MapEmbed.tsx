"use client";

export function MapEmbed({
  latitude,
  longitude,
  name,
}: {
  latitude: number;
  longitude: number;
  name: string;
}) {
  const src = `https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`;
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

  return (
    <div className="overflow-hidden rounded-xl border border-stone-200 dark:border-stone-700">
      <iframe
        title={`Map showing location of ${name}`}
        src={src}
        className="h-56 w-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer"
        allowFullScreen
      />
      <a
        href={mapLink}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-1.5 bg-stone-50 px-4 py-2 text-xs font-medium text-teal-600 transition-colors hover:text-teal-700 dark:bg-stone-800 dark:text-teal-400 dark:hover:text-teal-300"
      >
        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
        </svg>
        View on Google Maps
      </a>
    </div>
  );
}
