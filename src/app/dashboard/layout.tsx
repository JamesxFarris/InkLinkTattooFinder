import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { getUserPlanInfo } from "@/lib/premium";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  const isAdmin = session.user.role === "admin";
  const planInfo = await getUserPlanInfo(parseInt(session.user.id));

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Mobile nav — horizontal scrollable, hidden on desktop */}
      <div className="md:hidden">
        <DashboardNav isAdmin={isAdmin} isPremium={planInfo.isPremium} />
      </div>
      {/* Desktop layout — sidebar + content */}
      <div className="flex w-full gap-8">
        <div className="hidden md:block">
          <DashboardNav isAdmin={isAdmin} isPremium={planInfo.isPremium} />
        </div>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
