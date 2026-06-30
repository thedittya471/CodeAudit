import type { Metadata } from "next";
import Link from "next/link";

import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";

import { DASHBOARD_ROUTES } from "@/features/dashboard/lib/routes";
import { getInstallationStatus } from "@/features/github/server/installation";

import { Button } from "@/components/ui/button";
import { requireAuth } from "@/features/auth/actions";
import { RepoList } from "@/features/dashboard/components/repo-list";

export const metadata: Metadata = {
  title: "Repositories · Dashboard",
};


function ReposNotConnected() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="border border-border">
        <div className="flex items-center gap-2 border-b border-border px-5 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          <span className="size-1.5 rounded-full bg-[#ff4d00]" />
          Repositories
        </div>
        <div className="flex flex-col items-center gap-4 px-6 py-14 text-center">
          <p className="max-w-sm text-sm text-muted-foreground">
            Install the GitHub App first to see your repositories.
          </p>
          <Button nativeButton={false} render={<Link href={DASHBOARD_ROUTES.settings} />}>
            Go to Settings
          </Button>
        </div>
      </div>
    </div>
  );
}

/**
 * Repositories list page with GitHub connection guard.
 *
 * @returns Header plus either connect prompt or interactive repo table.
 */
export default async function DashboardReposPage() {
  const session = await requireAuth();
  const installation = await getInstallationStatus(session.user.id);

  const header = (
    <DashboardHeader
      title="Repositories"
      description="All public and private repositories available to the GitHub App."
    />
  );

  if (!installation.connected) {
    return (
      <>
        {header}
        <ReposNotConnected />
      </>
    );
  }

  return (
    <>
      {header}
      <RepoList />
    </>
  );
}