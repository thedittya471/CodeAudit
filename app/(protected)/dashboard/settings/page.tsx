import type { Metadata } from "next";
import { requireAuth } from "@/features/auth/actions";
import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";
import { SettingsView } from "@/features/dashboard/components/settings-view";
import { getInstallationStatus } from "@/features/github/server/installation";
import { getGithubInstallUrl } from "@/features/github/utils/github-app";

export const metadata: Metadata = {
  title: "Settings · Dashboard",
};

export default async function DashboardSettingsPage() {
  const session = await requireAuth();
  const installation = await getInstallationStatus(session.user.id);
  // Computed on the server so the install URL doesn't rely on client env vars.
  const installUrl = getGithubInstallUrl(session.user.id);

  return (
    <>
      <DashboardHeader
        title="Settings"
        description="Manage your account, appearance, and GitHub connection."
      />
      <SettingsView
        user={session.user}
        installUrl={installUrl}
        installation={{
          connected: installation.connected,
          accountLogin: installation.accountLogin,
          installedAt: installation.installedAt,
        }}
      />
    </>
  );
}
