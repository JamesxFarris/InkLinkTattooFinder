type Stat = {
  label: string;
  value: string | number;
};

export function StatsBar({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-xl bg-white p-4 text-center shadow-[var(--card-shadow)] ring-1 ring-stone-900/[0.04] dark:bg-stone-900 dark:ring-stone-700"
        >
          <p className="text-2xl font-bold text-teal-500">{stat.value}</p>
          <p className="mt-1 text-xs font-medium text-stone-500 dark:text-stone-400">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}
