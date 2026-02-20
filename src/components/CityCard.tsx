import Link from "next/link";
import { StockImage } from "./StockImage";
import { getCityImage } from "@/lib/images";
import type { CityWithCount } from "@/types";

export function CityCard({ city }: { city: CityWithCount }) {
  const imageSrc = getCityImage(city.slug);

  return (
    <Link
      href={`/tattoo-shops/${city.state.slug}/${city.slug}`}
      className="group relative block h-48 overflow-hidden rounded-2xl shadow-[var(--card-shadow)] ring-1 ring-stone-900/[0.04] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--card-shadow-hover)] dark:ring-stone-700"
    >
      {/* Background image */}
      <StockImage
        src={imageSrc}
        alt={`${city.name}, ${city.state.name} cityscape`}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />

      {/* Warm gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/25 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-5">
        <h3 className="text-xl font-bold text-white">
          {city.name}
        </h3>
        <p className="mt-1 text-sm text-white/80">
          {city.state.name} &middot; {city._count.listings}{" "}
          {city._count.listings === 1 ? "shop" : "shops"}
        </p>
      </div>

      {/* Hover arrow */}
      <div className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100">
        <svg
          className="h-4 w-4 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </Link>
  );
}
