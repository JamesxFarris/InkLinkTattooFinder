import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
};

export function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
        variant === "primary" &&
          "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
        variant === "secondary" &&
          "bg-stone-900 text-white hover:bg-stone-800 focus:ring-stone-500 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200",
        variant === "outline" &&
          "border border-stone-300 bg-transparent hover:bg-stone-100 focus:ring-stone-500 dark:border-stone-700 dark:hover:bg-stone-800",
        variant === "ghost" &&
          "bg-transparent hover:bg-stone-100 focus:ring-stone-500 dark:hover:bg-stone-800",
        size === "sm" && "px-3 py-1.5 text-sm",
        size === "md" && "px-4 py-2 text-sm",
        size === "lg" && "px-6 py-3 text-base",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
