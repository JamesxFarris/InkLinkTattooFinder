"use client";

import dynamic from "next/dynamic";

const MapEmbedInner = dynamic(() => import("./MapEmbedInner"), {
  ssr: false,
  loading: () => (
    <div className="mt-6 overflow-hidden rounded-xl border border-stone-200 dark:border-stone-700">
      <div className="flex h-56 w-full items-center justify-center bg-stone-100 dark:bg-stone-800">
        <span className="text-sm text-stone-400">Loading map...</span>
      </div>
    </div>
  ),
});

export function MapEmbed({
  latitude,
  longitude,
  name,
}: {
  latitude: number;
  longitude: number;
  name: string;
}) {
  return <MapEmbedInner latitude={latitude} longitude={longitude} name={name} />;
}
