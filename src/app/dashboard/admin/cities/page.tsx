import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { AdminCityRow } from "./AdminCityRow";
import { BulkFetchImagesButton } from "./BulkFetchImagesButton";

export const metadata: Metadata = {
  title: "Manage Cities",
};

export default async function AdminCitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ state?: string }>;
}) {
  const session = await auth();
  if (!session || session.user.role !== "admin") redirect("/dashboard");

  const params = await searchParams;
  const stateFilter = params.state || "all";

  const states = await prisma.state.findMany({ orderBy: { name: "asc" } });

  const where = stateFilter === "all" ? {} : { state: { slug: stateFilter } };

  const cities = await prisma.city.findMany({
    where,
    include: {
      state: true,
      _count: { select: { listings: true } },
    },
    orderBy: [{ state: { name: "asc" } }, { name: "asc" }],
  });

  const allCityIds = cities.map((c) => c.id);
  const missingImageIds = cities.filter((c) => !c.imageUrl).map((c) => c.id);

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-stone-900 dark:text-stone-100">
        Manage Cities
      </h1>

      {/* State Filter */}
      <div className="mb-6 flex flex-wrap gap-2">
        <a
          href="/dashboard/admin/cities"
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            stateFilter === "all"
              ? "bg-teal-600 text-white"
              : "bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-800 dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-stone-700 dark:hover:text-stone-200"
          }`}
        >
          All States
          <span className="ml-1.5 text-xs opacity-70">({cities.length})</span>
        </a>
        {states
          .filter((s) => cities.some((c) => c.stateId === s.id) || stateFilter === s.slug)
          .map((state) => {
            const count = cities.filter((c) => c.stateId === state.id).length;
            return (
              <a
                key={state.id}
                href={`/dashboard/admin/cities?state=${state.slug}`}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  stateFilter === state.slug
                    ? "bg-teal-600 text-white"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-800 dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-stone-700 dark:hover:text-stone-200"
                }`}
              >
                {state.abbreviation}
                {stateFilter === "all" && (
                  <span className="ml-1.5 text-xs opacity-70">({count})</span>
                )}
              </a>
            );
          })}
      </div>

      <BulkFetchImagesButton missingIds={missingImageIds} allIds={allCityIds} />

      {cities.length === 0 ? (
        <div className="rounded-xl border border-stone-200 bg-stone-50 p-12 text-center dark:border-stone-800 dark:bg-stone-900">
          <p className="text-stone-500 dark:text-stone-400">No cities found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {cities.map((city) => (
            <AdminCityRow
              key={city.id}
              city={{
                id: city.id,
                name: city.name,
                slug: city.slug,
                state: {
                  name: city.state.name,
                  abbreviation: city.state.abbreviation,
                  slug: city.state.slug,
                },
                listingCount: city._count.listings,
                population: city.population,
                imageUrl: city.imageUrl,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
