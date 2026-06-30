import type { Metadata } from "next";
import { requireAuth } from "@/features/auth/actions";
import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";
import { DashboardOverviewView } from "@/features/dashboard/components/overview";
import { getDashboardOverview } from "@/features/dashboard/server/overview";

export const metadata: Metadata = {
  title: "Overview · Dashboard",
};

export default async function DashboardPage() {
  const session = await requireAuth();
  const overview = await getDashboardOverview(session.user.id);
  const name = session.user.name?.split(" ")[0] || "there";

  return (
    <>
      <DashboardHeader
        title="Overview"
        description="Your code review activity at a glance."
      />
      <DashboardOverviewView overview={overview} name={name} />
    </>
  );
}
