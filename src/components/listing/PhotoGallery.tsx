"use client";

import { useState, useCallback } from "react";
import Image from "next/image";

export function PhotoGallery({
  photos,
  featured = false,
}: {
  photos: string[] | null;
  featured?: boolean;
}) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [failedUrls, setFailedUrls] = useState<Set<string>>(new Set());

  const handleImageError = useCallback((src: string) => {
    setFailedUrls((prev) => new Set(prev).add(src));
  }, []);

  if (!photos || photos.length === 0) return null;

  const limit = featured ? 12 : 6;
  // Filter out broken images, then take up to `limit`
  const items = photos.filter((src) => !failedUrls.has(src)).slice(0, limit);

  if (items.length === 0) return null;

  // Clamp lightbox index after failed images are removed
  const safeLightboxIndex =
    lightboxIndex !== null
      ? Math.min(lightboxIndex, items.length - 1)
      : null;

  return (
    <>
      {/* Uniform grid — all photos same size */}
      <div className="mt-6 grid grid-cols-2 gap-1.5 overflow-hidden rounded-xl sm:grid-cols-3">
        {items.map((src, i) => (
          <div
            key={src}
            className="relative aspect-square cursor-pointer overflow-hidden"
            onClick={() => setLightboxIndex(i)}
          >
            <Image
              src={src}
              alt={`Photo ${i + 1}`}
              fill
              unoptimized
              className="object-cover transition-transform duration-300 hover:scale-105"
              sizes="(max-width: 640px) 50vw, 33vw"
              onError={() => handleImageError(src)}
            />
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {safeLightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-4 right-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
            aria-label="Close lightbox"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {items.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((prev) =>
                  prev === 0 ? items.length - 1 : (prev ?? 0) - 1
                );
              }}
              className="absolute left-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
              aria-label="Previous photo"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
          )}

          <div
            className="relative max-h-[85vh] max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={items[safeLightboxIndex]}
              alt={`Photo ${safeLightboxIndex + 1}`}
              width={1200}
              height={800}
              unoptimized
              className="max-h-[85vh] w-auto rounded-lg object-contain"
              onError={() => handleImageError(items[safeLightboxIndex])}
            />
            <div className="mt-2 text-center text-sm text-white/60">
              {safeLightboxIndex + 1} / {items.length}
            </div>
          </div>

          {items.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((prev) =>
                  prev === items.length - 1 ? 0 : (prev ?? 0) + 1
                );
              }}
              className="absolute right-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
              aria-label="Next photo"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          )}
        </div>
      )}
    </>
  );
}
