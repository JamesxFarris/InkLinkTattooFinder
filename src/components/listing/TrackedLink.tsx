"use client";

export function TrackedLink({
  listingId,
  clickType,
  href,
  children,
  ...props
}: {
  listingId: number;
  clickType: string;
  href: string;
  children: React.ReactNode;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  function handleClick() {
    fetch(`/api/listings/${listingId}/click`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: clickType }),
    }).catch(() => {});
  }

  return (
    <a href={href} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}
