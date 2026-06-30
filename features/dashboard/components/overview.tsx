import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
  ArrowRightIcon,
  CheckCircle2Icon,
  FolderGit2Icon,
  GitPullRequestIcon,
  LoaderIcon,
  PlugZapIcon,
  type LucideIcon,
} from "lucide-react";
import { HugeiconsIcon } from "@hugeicons/react";
import { GithubIcon } from "@hugeicons/core-free-icons";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { statusBadge } from "@/features/dashboard/lib/status-style";
import { DASHBOARD_ROUTES } from "@/features/dashboard/lib/routes";
import type { DashboardOverview, OverviewPullRequest } from "@/features/dashboard/server/overview";

const ACCENT = "#ff4d00";

type StatusMeta = { tone: Parameters<typeof statusBadge>[0]; label: string; dot: string };

function prStatusMeta(status: string): StatusMeta {
  switch (status) {
    case "reviewed":
      return { tone: "success", label: "Reviewed", dot: "bg-emerald-500" };
    case "processing":
      return { tone: "info", label: "Reviewing", dot: "bg-blue-500 animate-pulse" };
    case "pending":
      return { tone: "warning", label: "Pending", dot: "bg-amber-500" };
    case "rate_limited":
      return { tone: "danger", label: "Rate limited", dot: "bg-red-500" };
    default:
      return { tone: "neutral", label: status, dot: "bg-muted-foreground" };
  }
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
      {children}
    </span>
  );
}

function CoverageRing({ value }: { value: number }) {
  return (
    <div
      className="relative flex size-20 items-center justify-center"
      style={{ background: `conic-gradient(${ACCENT} ${value * 3.6}deg, var(--muted) 0deg)` }}
    >
      <div className="flex size-15 items-center justify-center bg-card">
        <span className="text-lg font-semibold tabular-nums">{value}%</span>
      </div>
    </div>
  );
}

function StatCell({
  icon: Icon,
  value,
  label,
  hint,
  featured,
  className,
}: {
  icon: LucideIcon;
  value: number | string;
  label: string;
  hint?: string;
  featured?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("relative flex flex-col gap-4 p-6", className)}>
      {featured ? <span className="absolute inset-x-0 top-0 h-0.5 bg-[#ff4d00]" /> : null}
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "flex size-9 items-center justify-center border",
            featured ? "border-[#ff4d00]/40 text-[#ff4d00]" : "border-border text-muted-foreground"
          )}
        >
          <Icon className="size-4" />
        </span>
        <Label>{label}</Label>
      </div>
      <div>
        <div className="text-3xl font-semibold leading-none tabular-nums">{value}</div>
        {hint ? <p className="mt-2 text-xs text-muted-foreground">{hint}</p> : null}
      </div>
    </div>
  );
}

function PullRequestRow({ pr }: { pr: OverviewPullRequest }) {
  const meta = prStatusMeta(pr.status);
  return (
    <div className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-muted/40">
      <span className={cn("size-2 shrink-0 rounded-full", meta.dot)} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{pr.title}</p>
        <p className="truncate font-mono text-xs text-muted-foreground">
          {pr.repoFullName}#{pr.prNumber}
          {pr.authorLogin ? ` · @${pr.authorLogin}` : ""}
        </p>
      </div>
      <span className={statusBadge(meta.tone)}>{meta.label}</span>
      <span className="hidden w-24 shrink-0 text-right text-xs text-muted-foreground sm:block">
        {formatDistanceToNow(new Date(pr.updatedAt), { addSuffix: true })}
      </span>
    </div>
  );
}

function NotConnected({ name }: { name: string }) {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="border border-border">
        <div className="flex items-center gap-2 border-b border-border px-5 py-3">
          <span className="size-1.5 rounded-full bg-[#ff4d00]" />
          <Label>Welcome, {name}</Label>
        </div>
        <div className="flex flex-col items-center gap-4 px-6 py-14 text-center">
          <span className="flex size-12 items-center justify-center border border-[#ff4d00]/40 text-[#ff4d00]">
            <HugeiconsIcon icon={GithubIcon} className="size-6" />
          </span>
          <div className="space-y-1">
            <h3 className="text-base font-medium">Connect the GitHub App to get started</h3>
            <p className="mx-auto max-w-md text-sm text-muted-foreground">
              Install CodeAudit on your account or organization to start receiving
              AI reviews on every pull request.
            </p>
          </div>
          <Button nativeButton={false} render={<Link href={DASHBOARD_ROUTES.settings} />}>
            <HugeiconsIcon icon={GithubIcon} className="size-4" />
            Install GitHub App
          </Button>
        </div>
      </div>
    </div>
  );
}

export function DashboardOverviewView({
  overview,
  name,
}: {
  overview: DashboardOverview;
  name: string;
}) {
  if (!overview.connected) {
    return <NotConnected name={name} />;
  }

  const { stats, recentPullRequests } = overview;
  const rate =
    stats.totalPullRequests > 0
      ? Math.round((stats.reviewedPullRequests / stats.totalPullRequests) * 100)
      : 0;

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* greeting band */}
      <div className="border border-border">
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <span className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-[#ff4d00]" />
            <Label>Overview</Label>
          </span>
          <Label>Review coverage</Label>
        </div>
        <div className="flex flex-col gap-5 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1.5">
            <h2 className="text-2xl font-semibold tracking-tight">Welcome back, {name}</h2>
            <p className="text-sm text-muted-foreground">
              Connected as{" "}
              <span className="font-medium text-foreground">@{overview.accountLogin}</span> ·
              your reviewer is on duty.
            </p>
          </div>
          <CoverageRing value={rate} />
        </div>
      </div>

      {/* stat grid */}
      <div className="grid grid-cols-2 border border-border lg:grid-cols-4">
        <StatCell
          icon={CheckCircle2Icon}
          value={stats.reviewedPullRequests}
          label="Reviewed"
          hint={`${stats.totalPullRequests} total seen`}
          featured
          className="border-b border-r border-border lg:border-b-0"
        />
        <StatCell
          icon={LoaderIcon}
          value={stats.activePullRequests}
          label="In progress"
          hint="Pending or reviewing"
          className="border-b border-border lg:border-b-0 lg:border-r"
        />
        <StatCell
          icon={FolderGit2Icon}
          value={stats.reposSynced}
          label="Repos synced"
          hint={`${stats.reposTracked} tracked`}
          className="border-r border-border"
        />
        <StatCell
          icon={GitPullRequestIcon}
          value={stats.totalPullRequests}
          label="Pull requests"
          hint="Across all repos"
        />
      </div>

      {/* recent + side */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="border border-border lg:col-span-2">
          <div className="flex items-center justify-between border-b border-border px-5 py-3">
            <Label>Recent pull requests</Label>
            <Button
              variant="ghost"
              size="sm"
              nativeButton={false}
              render={<Link href={DASHBOARD_ROUTES.repos} />}
            >
              View all
              <ArrowRightIcon className="size-4" />
            </Button>
          </div>
          {recentPullRequests.length === 0 ? (
            <p className="px-5 py-12 text-center text-sm text-muted-foreground">
              No pull requests yet. Open a PR on a connected repo to see it here.
            </p>
          ) : (
            <div className="divide-y divide-border">
              {recentPullRequests.map((pr) => (
                <PullRequestRow key={pr.id} pr={pr} />
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <div className="border border-border">
            <div className="border-b border-border px-5 py-3">
              <Label>Connection</Label>
            </div>
            <div className="space-y-3 p-5">
              <div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center border border-border">
                  <HugeiconsIcon icon={GithubIcon} className="size-4" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">@{overview.accountLogin}</p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400">Active</p>
                </div>
              </div>
              {overview.installedAt ? (
                <p className="text-xs text-muted-foreground">
                  Installed{" "}
                  {formatDistanceToNow(new Date(overview.installedAt), { addSuffix: true })}
                </p>
              ) : null}
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                nativeButton={false}
                render={<Link href={DASHBOARD_ROUTES.settings} />}
              >
                <PlugZapIcon className="size-4" />
                Manage GitHub App
                <ArrowRightIcon className="ml-auto size-4" />
              </Button>
            </div>
          </div>

          <div className="border border-border">
            <div className="border-b border-border px-5 py-3">
              <Label>Quick actions</Label>
            </div>
            <div className="p-5">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                nativeButton={false}
                render={<Link href={DASHBOARD_ROUTES.repos} />}
              >
                <FolderGit2Icon className="size-4" />
                Sync a repository
                <ArrowRightIcon className="ml-auto size-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
