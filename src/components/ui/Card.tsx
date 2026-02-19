import { cn } from "@/lib/utils";

type CardProps = {
  children: React.ReactNode;
  className?: string;
  href?: string;
};

export function Card({ children, className, href }: CardProps) {
  const classes = cn(
    "rounded-xl border border-stone-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-stone-700 dark:bg-stone-900",
    className
  );

  if (href) {
    return (
      <a href={href} className={cn(classes, "block")}>
        {children}
      </a>
    );
  }

  return <div className={classes}>{children}</div>;
}

export function CardHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("p-4 pb-2", className)}>{children}</div>;
}

export function CardContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("p-4 pt-0", className)}>{children}</div>;
}

export function CardFooter({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("border-t border-stone-200 p-4 dark:border-stone-700", className)}>
      {children}
    </div>
  );
}
