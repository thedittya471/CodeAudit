import { prisma } from "@/lib/db";
import { getInstallationStatus, getUserInstallationId } from "@/features/github/server/installation";

export type OverviewPullRequest = {
  id: string;
  repoFullName: string;
  prNumber: number;
  title: string;
  authorLogin: string | null;
  status: string;
  updatedAt: string;
};

export type DashboardOverview = {
  connected: boolean;
  accountLogin: string | null;
  installedAt: string | null;
  stats: {
    reposSynced: number;
    reposTracked: number;
    totalPullRequests: number;
    reviewedPullRequests: number;
    activePullRequests: number;
  };
  recentPullRequests: OverviewPullRequest[];
};

/**
 * Aggregates the signed-in user's GitHub connection, repo-sync, and
 * pull-request activity for the dashboard overview page.
 */
export async function getDashboardOverview(userId: string): Promise<DashboardOverview> {
  const installation = await getInstallationStatus(userId);
  const installationId = await getUserInstallationId(userId);

  if (!installationId) {
    return {
      connected: installation.connected,
      accountLogin: installation.accountLogin,
      installedAt: installation.installedAt,
      stats: {
        reposSynced: 0,
        reposTracked: 0,
        totalPullRequests: 0,
        reviewedPullRequests: 0,
        activePullRequests: 0,
      },
      recentPullRequests: [],
    };
  }

  const [
    reposSynced,
    reposTracked,
    totalPullRequests,
    reviewedPullRequests,
    activePullRequests,
    recent,
  ] = await Promise.all([
    prisma.repoSync.count({ where: { installationId, status: "synced" } }),
    prisma.repoSync.count({ where: { installationId } }),
    prisma.pullRequest.count({ where: { installationId } }),
    prisma.pullRequest.count({ where: { installationId, status: "reviewed" } }),
    prisma.pullRequest.count({
      where: { installationId, status: { in: ["pending", "processing"] } },
    }),
    prisma.pullRequest.findMany({
      where: { installationId },
      orderBy: { updatedAt: "desc" },
      take: 6,
    }),
  ]);

  return {
    connected: installation.connected,
    accountLogin: installation.accountLogin,
    installedAt: installation.installedAt,
    stats: {
      reposSynced,
      reposTracked,
      totalPullRequests,
      reviewedPullRequests,
      activePullRequests,
    },
    recentPullRequests: recent.map((pr) => ({
      id: pr.id,
      repoFullName: pr.repoFullName,
      prNumber: pr.prNumber,
      title: pr.title,
      authorLogin: pr.authorLogin,
      status: pr.status,
      updatedAt: pr.updatedAt.toISOString(),
    })),
  };
}
