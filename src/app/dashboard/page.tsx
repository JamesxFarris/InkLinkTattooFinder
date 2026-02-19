import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

const statusStyles: Record<string, string> = {
  active: "bg-green-500/10 text-green-400 border-green-500/30",
  pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  inactive: "bg-red-500/10 text-red-400 border-red-500/30",
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/sign-in");

  const listings = await prisma.listing.findMany({
    where: { userId: parseInt(session.user.id) },
    include: { city: true, state: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-stone-100">
            My Listings
          </h1>
          <p className="mt-1 text-sm text-stone-400">
            {listings.length} listing{listings.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/list-your-shop"
          className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-500"
        >
          Add Listing
        </Link>
      </div>

      {listings.length === 0 ? (
        <div className="rounded-xl border border-stone-800 bg-stone-900 p-12 text-center">
          <p className="text-stone-400">You haven&apos;t submitted any listings yet.</p>
          <Link
            href="/list-your-shop"
            className="mt-4 inline-block text-sm font-medium text-teal-400 hover:text-teal-300"
          >
            Submit your first shop &rarr;
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {listings.map((listing) => (
            <div
              key={listing.id}
              className="rounded-xl border border-stone-800 bg-stone-900 p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-semibold text-stone-100">{listing.name}</h2>
                  <p className="mt-1 text-sm text-stone-400">
                    {listing.city.name}, {listing.state.abbreviation}
                  </p>
                </div>
                <span
                  className={`rounded-full border px-3 py-0.5 text-xs font-medium capitalize ${statusStyles[listing.status] ?? ""}`}
                >
                  {listing.status}
                </span>
              </div>
              {listing.description && (
                <p className="mt-3 line-clamp-2 text-sm text-stone-400">
                  {listing.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
