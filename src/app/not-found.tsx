import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-bold text-teal-500">404</h1>
      <h2 className="mt-4 text-2xl font-semibold text-stone-900 dark:text-stone-100">
        Page Not Found
      </h2>
      <p className="mt-2 text-stone-600 dark:text-stone-400">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="mt-6 flex gap-3">
        <Link
          href="/"
          className="rounded-lg bg-teal-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-teal-600 transition-colors"
        >
          Go Home
        </Link>
        <Link
          href="/search"
          className="rounded-lg border border-stone-300 px-5 py-2.5 text-sm font-medium hover:bg-stone-100 dark:border-stone-700 dark:hover:bg-stone-800 transition-colors"
        >
          Search Shops
        </Link>
      </div>
    </div>
  );
}
