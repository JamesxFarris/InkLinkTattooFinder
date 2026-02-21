"use client";

import { useState, useCallback, useRef } from "react";
import Image from "next/image";

export function ImageCarousel({
  images,
  alt,
  className = "",
}: {
  images: string[];
  alt: string;
  className?: string;
}) {
  const [current, setCurrent] = useState(0);
  const touchStart = useRef(0);
  const touchEnd = useRef(0);

  const prev = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setCurrent((c) => (c === 0 ? images.length - 1 : c - 1));
    },
    [images.length]
  );

  const next = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setCurrent((c) => (c === images.length - 1 ? 0 : c + 1));
    },
    [images.length]
  );

  function onTouchStart(e: React.TouchEvent) {
    touchStart.current = e.targetTouches[0].clientX;
  }

  function onTouchMove(e: React.TouchEvent) {
    touchEnd.current = e.targetTouches[0].clientX;
  }

  function onTouchEnd(e: React.TouchEvent) {
    const diff = touchStart.current - touchEnd.current;
    if (Math.abs(diff) > 50) {
      e.preventDefault();
      if (diff > 0) {
        setCurrent((c) => (c === images.length - 1 ? 0 : c + 1));
      } else {
        setCurrent((c) => (c === 0 ? images.length - 1 : c - 1));
      }
    }
  }

  if (images.length === 0) return null;

  return (
    <div
      className={`group/carousel relative ${className}`}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <Image
        src={images[current]}
        alt={`${alt} — photo ${current + 1}`}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />

      {/* Arrows — visible on hover (desktop) */}
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1 opacity-0 shadow transition-opacity group-hover/carousel:opacity-100 dark:bg-stone-800/80"
            aria-label="Previous photo"
          >
            <svg className="h-4 w-4 text-stone-700 dark:text-stone-200" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1 opacity-0 shadow transition-opacity group-hover/carousel:opacity-100 dark:bg-stone-800/80"
            aria-label="Next photo"
          >
            <svg className="h-4 w-4 text-stone-700 dark:text-stone-200" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>

          {/* Dot indicators */}
          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
            {images.map((_, i) => (
              <span
                key={i}
                className={`block h-1.5 w-1.5 rounded-full transition-colors ${
                  i === current
                    ? "bg-white"
                    : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
