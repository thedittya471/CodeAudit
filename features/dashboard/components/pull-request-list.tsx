"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronDownIcon,
  ExternalLinkIcon,
  GitPullRequestIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { statusBadge } from "@/features/dashboard/lib/status-style";
import { ReviewMarkdown } from "@/features/reviews/components/review-markdown";
import type {
  DashboardPullRequest,
  PullRequestStats,
} from "@/features/reviews/server/pull-requests";

type StatusMeta = { tone: Parameters<typeof statusBadge>[0]; label: string; dot: string };

function prStatusMeta(status: string): StatusMeta {
  switch (status) {
    case "reviewed":
      return { tone: "success", label: "Reviewed", dot: "bg-emerald-500" };
    case "processing":
      return { tone: "info", label: "Reviewing", dot: "bg-blue-500 animate-pulse" };
    case "pending":
      return { tone: "warning", label: "Pending", dot: "bg-amber-500 animate-pulse" };
    case "rate_limited":
      return { tone: "danger", label: "Rate limited", dot: "bg-red-500" };
    default:
      return { tone: "neutral", label: status, dot: "bg-muted-foreground" };
  }
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground", className)}>
      {children}
    </span>
  );
}

function StatCell({ value, label, accent }: { value: number; label: string; accent?: boolean }) {
  return (
    <div className="flex flex-col justify-center px-5 py-4">
      <span className={cn("text-2xl font-semibold tabular-nums sm:text-3xl", accent && "text-[#ff4d00]")}>
        {value}
      </span>
      <Label className="mt-1">{label}</Label>
    </div>
  );
}

function PullRequestRow({ pr }: { pr: DashboardPullRequest }) {
  const [open, setOpen] = useState(false);
  const meta = prStatusMeta(pr.status);
  const href = `https://github.com/${pr.repoFullName}/pull/${pr.prNumber}`;
  const hasReview = Boolean(pr.reviewComment);

  return (
    <div className="group">
      <div
        className={cn(
          "relative flex items-center gap-3 px-5 py-4 transition-colors",
          hasReview && "cursor-pointer hover:bg-muted/30"
        )}
        onClick={hasReview ? () => setOpen((v) => !v) : undefined}
      >
        <span className="absolute inset-y-0 left-0 w-0.5 origin-top scale-y-0 bg-[#ff4d00] transition-transform duration-300 group-hover:scale-y-100" />

        <span className={cn("size-2 shrink-0 rounded-full", meta.dot)} />

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <GitPullRequestIcon className="size-4 shrink-0 text-muted-foreground" />
            <span className="truncate text-sm font-medium">{pr.title}</span>
          </div>
          <p className="mt-0.5 truncate font-mono text-xs text-muted-foreground">
            {pr.repoFullName}#{pr.prNumber}
            {pr.authorLogin ? ` · @${pr.authorLogin}` : ""}
            {" · "}
            {pr.baseBranch}
          </p>
        </div>

        <span className={statusBadge(meta.tone)}>{meta.label}</span>

        <span className="hidden w-24 shrink-0 text-right text-xs text-muted-foreground sm:block">
          {formatDistanceToNow(new Date(pr.updatedAt), { addSuffix: true })}
        </span>

        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="flex size-7 shrink-0 items-center justify-center border border-border text-muted-foreground transition-colors hover:border-[#ff4d00]/40 hover:text-[#ff4d00]"
          aria-label="Open on GitHub"
        >
          <ExternalLinkIcon className="size-3.5" />
        </a>

        {hasReview ? (
          <ChevronDownIcon
            className={cn(
              "size-4 shrink-0 text-muted-foreground transition-transform duration-300",
              open && "rotate-180"
            )}
          />
        ) : (
          <span className="w-4 shrink-0" />
        )}
      </div>

      <AnimatePresence initial={false}>
        {open && hasReview ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-border bg-muted/20"
          >
            <div className="max-h-96 overflow-auto px-5 py-4">
              <ReviewMarkdown content={pr.reviewComment ?? ""} />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export function PullRequestList({
  pullRequests,
  stats,
}: {
  pullRequests: DashboardPullRequest[];
  stats: PullRequestStats;
}) {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* stats band */}
      <div className="grid grid-cols-3 border border-border divide-x divide-border">
        <StatCell value={stats.total} label="Total PRs" />
        <StatCell value={stats.reviewed} label="Reviewed" accent />
        <StatCell value={stats.active} label="In progress" />
      </div>

      {/* list */}
      <div className="border border-border">
        <div className="flex items-center gap-2 border-b border-border px-5 py-3">
          <span className="size-1.5 rounded-full bg-[#ff4d00]" />
          <Label>Pull requests</Label>
          <Label className="ml-auto">Tap a reviewed PR to read its review</Label>
        </div>

        {pullRequests.length === 0 ? (
          <p className="py-14 text-center text-sm text-muted-foreground">
            No pull requests yet. Open a PR on a connected repository and CodeAudit
            will review it automatically.
          </p>
        ) : (
          <div className="divide-y divide-border">
            {pullRequests.map((pr) => (
              <PullRequestRow key={pr.id} pr={pr} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
