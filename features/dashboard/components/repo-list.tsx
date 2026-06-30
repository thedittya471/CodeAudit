"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { motion } from "motion/react";
import { memo, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import {
  LockIcon,
  LockOpenIcon,
  SearchIcon,
  StarIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { githubReposInfiniteQuery } from "@/features/github/lib/repos-query";
import { repoSyncStatusesQuery } from "@/features/github/lib/repo-sync-status-query";
import { DashboardRepo } from "../lib/types";
import { RepoSyncStatus } from "@/features/repo-sync/types";
import SyncRepoButton from "@/features/repo-sync/components/sync-repo-button";

type Filter = "all" | "public" | "private";
const FILTERS: Filter[] = ["all", "public", "private"];

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground", className)}>
      {children}
    </span>
  );
}

function StatCell({ value, label, className }: { value: React.ReactNode; label: string; className?: string }) {
  return (
    <div className={cn("flex flex-col justify-center px-5 py-4", className)}>
      <span className="text-2xl font-semibold tabular-nums sm:text-3xl">{value}</span>
      <Label className="mt-1">{label}</Label>
    </div>
  );
}

export function RepoList() {
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending, isError } =
    useInfiniteQuery(githubReposInfiniteQuery);

  // Live, DB-only sync statuses (override the value baked into the repo list).
  const { data: syncData } = useQuery(repoSyncStatusesQuery);
  const liveStatuses = useMemo(() => syncData?.statuses ?? {}, [syncData]);

  const loading = isPending && !data;

  const repos = useMemo(() => {
    if (!data) return [];
    const loaded = data.pages.flatMap((page) => page.repos);
    return [...loaded].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }, [data]);

  const statusFor = (repo: DashboardRepo): RepoSyncStatus | null =>
    (liveStatuses[repo.fullName] as RepoSyncStatus | undefined) ??
    repo.syncStatus ??
    null;

  const totalCount = data?.pages[0]?.totalCount ?? 0;

  const counts = useMemo(
    () => ({
      all: totalCount,
      public: repos.filter((r) => r.visibility === "public").length,
      private: repos.filter((r) => r.visibility === "private").length,
      synced: repos.filter(
        (r) => (liveStatuses[r.fullName] ?? r.syncStatus) === "synced"
      ).length,
    }),
    [repos, totalCount, liveStatuses]
  );

  const visibleRepos = useMemo(() => {
    const query = deferredSearch.trim().toLowerCase();
    return repos.filter((repo) => {
      if (filter !== "all" && repo.visibility !== filter) return false;
      if (query && !repo.fullName.toLowerCase().includes(query)) return false;
      return true;
    });
  }, [repos, filter, deferredSearch]);

  useEffect(() => {
    const element = loadMoreRef.current;
    if (!element || !hasNextPage || isFetchingNextPage) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) fetchNextPage();
      },
      { rootMargin: "300px" }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  let footer: string | null = null;
  if (isFetchingNextPage) footer = "Loading more…";
  else if (hasNextPage) footer = `Showing ${repos.length} of ${totalCount}`;
  else if (repos.length > 0) footer = `All ${repos.length} repositories loaded`;

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* data header band */}
      <div className="grid grid-cols-1 border border-border lg:grid-cols-[1.4fr_1fr]">
        <div className="flex flex-col justify-center gap-2 border-b border-border px-6 py-7 lg:border-b-0 lg:border-r">
          <Label>Connected repositories</Label>
          <div className="flex items-end gap-3">
            <span className="font-mono text-5xl font-semibold leading-none tabular-nums sm:text-6xl">
              {String(totalCount).padStart(2, "0")}
            </span>
            <span className="pb-1.5 text-sm text-muted-foreground">
              available to the
              <br />
              GitHub App
            </span>
          </div>
        </div>
        <div className="grid grid-cols-3 divide-x divide-border">
          <StatCell value={counts.public} label="Public" />
          <StatCell value={counts.private} label="Private" />
          <StatCell value={<span className="text-[#ff4d00]">{counts.synced}</span>} label="Synced" />
        </div>
      </div>

      {/* toolbar */}
      <div className="flex flex-col border border-border sm:flex-row sm:items-center sm:justify-between">
        <div className="flex divide-x divide-border border-b border-border sm:border-b-0 sm:border-r">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={cn(
                "flex items-center gap-1.5 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.15em] transition-colors",
                filter === f
                  ? "bg-[#ff4d00]/10 text-[#ff4d00]"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {f}
              <span className="opacity-60">({counts[f]})</span>
            </button>
          ))}
        </div>
        <div className="flex flex-1 items-center gap-2 px-5 py-3 sm:max-w-xs">
          <SearchIcon className="size-4 shrink-0 text-muted-foreground" />
          <input
            placeholder="Search repositories…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* list */}
      <div className="border border-border">
        {/* column header (desktop) */}
        <div className="hidden items-center gap-5 border-b border-border px-5 py-3 md:flex">
          <span className="w-8" />
          <Label className="flex-1">Repository</Label>
          <Label className="w-28">Language</Label>
          <Label className="w-20 text-right">Stars</Label>
          <Label className="w-28 text-right">Updated</Label>
          <Label className="w-24 text-right">Codebase</Label>
        </div>

        {loading ? (
          <StateBlock>Loading repositories…</StateBlock>
        ) : isError ? (
          <StateBlock>Failed to load repositories.</StateBlock>
        ) : visibleRepos.length === 0 ? (
          <StateBlock>No repositories found.</StateBlock>
        ) : (
          <div className="divide-y divide-border">
            {visibleRepos.map((repo, i) => (
              <RepoRow key={repo.id} repo={repo} index={i} syncStatus={statusFor(repo)} />
            ))}
          </div>
        )}
      </div>

      <div
        ref={loadMoreRef}
        className="py-2 text-center font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground"
      >
        {footer}
      </div>
    </div>
  );
}

function StateBlock({ children }: { children: React.ReactNode }) {
  return <p className="py-14 text-center text-sm text-muted-foreground">{children}</p>;
}

const RepoRow = memo(function RepoRow({
  repo,
  index,
  syncStatus,
}: {
  repo: DashboardRepo;
  index: number;
  syncStatus: RepoSyncStatus | null;
}) {
  const isPrivate = repo.visibility === "private";

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col gap-3 px-5 py-4 transition-colors hover:bg-muted/30 md:flex-row md:items-center md:gap-5"
    >
      {/* hover accent bar */}
      <span className="absolute inset-y-0 left-0 w-0.5 origin-top scale-y-0 bg-[#ff4d00] transition-transform duration-300 group-hover:scale-y-100" />

      {/* index */}
      <span className="hidden w-8 font-mono text-xs text-muted-foreground md:block">
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* name */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-base font-medium transition-transform duration-300 group-hover:translate-x-0.5">
            {repo.name}
          </span>
          <span
            className={cn(
              "inline-flex items-center gap-1 border px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wide",
              isPrivate
                ? "border-amber-500/40 text-amber-600 dark:text-amber-400"
                : "border-border text-muted-foreground"
            )}
          >
            {isPrivate ? <LockIcon className="size-2.5" /> : <LockOpenIcon className="size-2.5" />}
            {repo.visibility}
          </span>
        </div>
        <span className="truncate font-mono text-xs text-muted-foreground">{repo.fullName}</span>
      </div>

      {/* language */}
      <div className="w-28 md:shrink-0">
        {repo.language ? (
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="size-1.5 rounded-full bg-[#ff4d00]" />
            {repo.language}
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        )}
      </div>

      {/* stars */}
      <div className="w-20 text-left text-xs text-muted-foreground md:text-right">
        <span className="inline-flex items-center gap-1">
          <StarIcon className="size-3 text-amber-500" />
          {repo.stars}
        </span>
      </div>

      {/* updated */}
      <div className="hidden w-28 text-right font-mono text-xs text-muted-foreground md:block">
        {formatDistanceToNow(new Date(repo.updatedAt), { addSuffix: true })}
      </div>

      {/* action */}
      <div className="flex w-24 items-center justify-end gap-2 md:shrink-0">
        <SyncRepoButton
          repoFullName={repo.fullName}
          branch={repo.defaultBranch}
          syncStatus={syncStatus}
        />
      </div>
    </motion.div>
  );
});
