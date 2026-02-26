"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  href: string;
  label: string;
  exact?: boolean;
};

export function DashboardNav({ isAdmin, isPremium = false }: { isAdmin: boolean; isPremium?: boolean }) {
  const pathname = usePathname();

  const ownerLinks: NavItem[] = [
    { href: "/dashboard", label: "My Listings", exact: true },
    { href: "/dashboard/claim", label: "Claim a Shop" },
    { href: "/list-your-shop", label: "Add New Listing" },
    { href: "/dashboard/upgrade", label: isPremium ? "Premium" : "Upgrade" },
  ];

  const adminLinks: NavItem[] = [
    { href: "/dashboard/admin", label: "Review Listings", exact: true },
    { href: "/dashboard/admin/cities", label: "Manage Cities" },
    { href: "/dashboard/admin/claims", label: "Review Claims" },
    { href: "/dashboard/admin/users", label: "Manage Users" },
    { href: "/dashboard/admin/blog", label: "Manage Blog" },
    { href: "/dashboard/admin/audit", label: "Audit Log" },
  ];

  function isActive(item: NavItem) {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  }

  const baseLinkClass =
    "block rounded-lg px-4 py-2.5 text-sm font-medium transition";
  const ownerActiveClass =
    "bg-stone-100 text-stone-900 dark:bg-stone-800 dark:text-white";
  const ownerInactiveClass =
    "text-stone-600 hover:bg-stone-100 hover:text-stone-900 dark:text-stone-300 dark:hover:bg-stone-800 dark:hover:text-white";
  const adminActiveClass =
    "bg-teal-500/10 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300";
  const adminInactiveClass =
    "text-teal-600 hover:bg-stone-100 hover:text-teal-700 dark:text-teal-400 dark:hover:bg-stone-800 dark:hover:text-teal-300";

  const upgradeActiveClass =
    "bg-amber-500/10 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300";
  const upgradeInactiveClass =
    "text-amber-600 hover:bg-amber-50 hover:text-amber-700 dark:text-amber-400 dark:hover:bg-amber-500/10 dark:hover:text-amber-300";

  // Mobile: horizontal scrollable
  const mobileLinkClass =
    "shrink-0 rounded-lg px-3 py-2 text-sm font-medium transition whitespace-nowrap";

  function getLinkClasses(item: NavItem, mobile: boolean) {
    const isUpgrade = item.href === "/dashboard/upgrade";
    const base = mobile ? mobileLinkClass : baseLinkClass;
    if (isUpgrade) {
      return `${base} ${isActive(item) ? upgradeActiveClass : upgradeInactiveClass}`;
    }
    return `${base} ${isActive(item) ? ownerActiveClass : ownerInactiveClass}`;
  }

  return (
    <>
      {/* Mobile nav */}
      <nav className="flex gap-1 overflow-x-auto pb-2 md:hidden" aria-label="Dashboard navigation">
        {ownerLinks.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={getLinkClasses(item, true)}
          >
            {item.href === "/dashboard/upgrade" && !isPremium && <span className="mr-1 text-amber-500">&#9733;</span>}
            {item.label}
          </Link>
        ))}
        {isAdmin && (
          <>
            <div className="mx-1 shrink-0 self-stretch border-l border-stone-200 dark:border-stone-700" />
            {adminLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${mobileLinkClass} ${
                  isActive(item) ? adminActiveClass : adminInactiveClass
                }`}
              >
                {item.label}
              </Link>
            ))}
          </>
        )}
      </nav>

      {/* Desktop sidebar */}
      <aside className="hidden w-56 shrink-0 md:block">
        <nav className="sticky top-24 space-y-1">
          {ownerLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={getLinkClasses(item, false)}
            >
              {item.href === "/dashboard/upgrade" && !isPremium && <span className="mr-1 text-amber-500">&#9733;</span>}
              {item.label}
            </Link>
          ))}
          {isAdmin && (
            <>
              <hr className="my-3 border-stone-200 dark:border-stone-800" />
              {adminLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${baseLinkClass} ${
                    isActive(item) ? adminActiveClass : adminInactiveClass
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </>
          )}
        </nav>
      </aside>
    </>
  );
}
