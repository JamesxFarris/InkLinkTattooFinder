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
        variant === "default" && "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300",
        variant === "primary" && "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
        variant === "secondary" && "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900",
        variant === "outline" && "ring-1 ring-neutral-200 text-neutral-600 dark:ring-neutral-700 dark:text-neutral-400",
        className
      )}
    >
      {children}
    </span>
  );
}
