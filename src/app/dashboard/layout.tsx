import { auth } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/sign-in");

  const isAdmin = session.user.role === "admin";

  return (
    <div className="mx-auto flex w-full max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <aside className="hidden w-56 shrink-0 md:block">
        <nav className="sticky top-24 space-y-1">
          <Link
            href="/dashboard"
            className="block rounded-lg px-4 py-2.5 text-sm font-medium text-stone-300 transition hover:bg-stone-800 hover:text-white"
          >
            My Listings
          </Link>
          <Link
            href="/list-your-shop"
            className="block rounded-lg px-4 py-2.5 text-sm font-medium text-stone-300 transition hover:bg-stone-800 hover:text-white"
          >
            Add New Listing
          </Link>
          {isAdmin && (
            <>
              <hr className="my-3 border-stone-800" />
              <Link
                href="/dashboard/admin"
                className="block rounded-lg px-4 py-2.5 text-sm font-medium text-teal-400 transition hover:bg-stone-800 hover:text-teal-300"
              >
                All Listings
              </Link>
            </>
          )}
        </nav>
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
