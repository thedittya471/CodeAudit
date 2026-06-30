import type { Metadata } from "next";
import Link from "next/link";

import { requireAuth } from "@/features/auth/actions";
import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";
import { PullRequestList } from "@/features/dashboard/components/pull-request-list";
import { getDashboardPullRequests } from "@/features/reviews/server/pull-requests";
import { DASHBOARD_ROUTES } from "@/features/dashboard/lib/routes";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Pull Requests · Dashboard",
};

function NotConnected() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="border border-border">
        <div className="flex items-center gap-2 border-b border-border px-5 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          <span className="size-1.5 rounded-full bg-[#ff4d00]" />
          Pull requests
        </div>
        <div className="flex flex-col items-center gap-4 px-6 py-14 text-center">
          <p className="max-w-sm text-sm text-muted-foreground">
            Connect the GitHub App to start receiving AI reviews on your pull
            requests.
          </p>
          <Button nativeButton={false} render={<Link href={DASHBOARD_ROUTES.settings} />}>
            Go to Settings
          </Button>
        </div>
      </div>
    </div>
  );
}

export default async function DashboardPullRequestPage() {
  const session = await requireAuth();
  const { connected, pullRequests, stats } = await getDashboardPullRequests(
    session.user.id
  );

  return (
    <>
      <DashboardHeader
        title="Pull Requests"
        description="Every pull request CodeAudit has reviewed across your repositories."
      />
      {connected ? (
        <PullRequestList pullRequests={pullRequests} stats={stats} />
      ) : (
        <NotConnected />
      )}
    </>
  );
}
