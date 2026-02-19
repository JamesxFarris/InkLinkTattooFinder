import { cn } from "@/lib/utils";

type BadgeProps = {
  children: React.ReactNode;
  variant?: "default" | "primary" | "secondary" | "outline";
  className?: string;
};

export function Badge({
  children,
  variant = "default",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium",
        variant === "default" && "bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300",
        variant === "primary" && "bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-300",
        variant === "secondary" && "bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900",
        variant === "outline" && "ring-1 ring-stone-200 text-stone-600 dark:ring-stone-700 dark:text-stone-400",
        className
      )}
    >
      {children}
    </span>
  );
}
