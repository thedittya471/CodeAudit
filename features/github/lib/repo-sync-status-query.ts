import { queryOptions } from "@tanstack/react-query";

export type RepoSyncStatusMap = Record<string, string>;

export const repoSyncStatusKeys = {
  all: ["github", "repo-sync-status"] as const,
};

/**
 * Lightweight, DB-only poll of repo-sync statuses (no GitHub call).
 * Polls every 30s while any repo is pending/syncing, then stops until the
 * next mutation invalidates it. Cheap enough to run without rate-limit risk.
 */
export const repoSyncStatusesQuery = queryOptions({
  queryKey: [...repoSyncStatusKeys.all],
  queryFn: async () => {
    const response = await fetch("/api/github/repos/sync-status", {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to load sync statuses");
    }

    return response.json() as Promise<{ statuses: RepoSyncStatusMap }>;
  },
  staleTime: 0,
  refetchIntervalInBackground: true,
  refetchInterval: (query) => {
    const statuses = query.state.data?.statuses ?? {};
    const anyActive = Object.values(statuses).some(
      (s) => s === "pending" || s === "syncing"
    );
    return anyActive ? 30000 : false;
  },
});
