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
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variant === "default" && "bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200",
        variant === "primary" && "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
        variant === "secondary" && "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900",
        variant === "outline" && "border border-neutral-300 text-neutral-700 dark:border-neutral-600 dark:text-neutral-300",
        className
      )}
    >
      {children}
    </span>
  );
}
