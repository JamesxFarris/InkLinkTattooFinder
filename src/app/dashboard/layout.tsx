import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardNav } from "@/components/dashboard/DashboardNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  const isAdmin = session.user.role === "admin";

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Mobile nav — horizontal scrollable, hidden on desktop */}
      <div className="md:hidden">
        <DashboardNav isAdmin={isAdmin} />
      </div>
      {/* Desktop layout — sidebar + content */}
      <div className="flex w-full gap-8">
        <div className="hidden md:block">
          <DashboardNav isAdmin={isAdmin} />
        </div>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
