import { prisma } from "@/lib/db";
import { getUserInstallationId } from "@/features/github/server/installation";

export type DashboardPullRequest = {
  id: string;
  repoFullName: string;
  prNumber: number;
  title: string;
  authorLogin: string | null;
  baseBranch: string;
  status: string;
  reviewComment: string | null;
  reviewedAt: string | null;
  updatedAt: string;
};

export type PullRequestStats = {
  total: number;
  reviewed: number;
  active: number;
};

/**
 * The signed-in user's pull requests (most recent first) plus quick counts,
 * scoped to their GitHub installation. Returns empty data when not connected.
 */
export async function getDashboardPullRequests(userId: string): Promise<{
  connected: boolean;
  pullRequests: DashboardPullRequest[];
  stats: PullRequestStats;
}> {
  const installationId = await getUserInstallationId(userId);

  if (!installationId) {
    return {
      connected: false,
      pullRequests: [],
      stats: { total: 0, reviewed: 0, active: 0 },
    };
  }

  const [rows, total, reviewed, active] = await Promise.all([
    prisma.pullRequest.findMany({
      where: { installationId },
      orderBy: { updatedAt: "desc" },
      take: 50,
    }),
    prisma.pullRequest.count({ where: { installationId } }),
    prisma.pullRequest.count({ where: { installationId, status: "reviewed" } }),
    prisma.pullRequest.count({
      where: { installationId, status: { in: ["pending", "processing"] } },
    }),
  ]);

  return {
    connected: true,
    stats: { total, reviewed, active },
    pullRequests: rows.map((pr) => ({
      id: pr.id,
      repoFullName: pr.repoFullName,
      prNumber: pr.prNumber,
      title: pr.title,
      authorLogin: pr.authorLogin,
      baseBranch: pr.baseBranch,
      status: pr.status,
      reviewComment: pr.reviewComment,
      reviewedAt: pr.reviewedAt ? pr.reviewedAt.toISOString() : null,
      updatedAt: pr.updatedAt.toISOString(),
    })),
  };
}
