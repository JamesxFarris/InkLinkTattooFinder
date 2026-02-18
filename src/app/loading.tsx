export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="animate-pulse space-y-6">
        <div className="h-4 w-48 rounded bg-stone-200 dark:bg-stone-800" />
        <div className="h-8 w-96 rounded bg-stone-200 dark:bg-stone-800" />
        <div className="h-4 w-72 rounded bg-stone-200 dark:bg-stone-800" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-stone-200 dark:border-stone-800"
            >
              <div className="h-48 rounded-t-xl bg-stone-200 dark:bg-stone-800" />
              <div className="space-y-3 p-4">
                <div className="h-4 w-3/4 rounded bg-stone-200 dark:bg-stone-800" />
                <div className="h-3 w-1/2 rounded bg-stone-200 dark:bg-stone-800" />
                <div className="flex gap-2">
                  <div className="h-5 w-16 rounded-full bg-stone-200 dark:bg-stone-800" />
                  <div className="h-5 w-16 rounded-full bg-stone-200 dark:bg-stone-800" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
