"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  ArrowRightIcon,
  CheckCircle2Icon,
  ExternalLinkIcon,
  LogOutIcon,
  MonitorIcon,
  MoonIcon,
  SunIcon,
  UnplugIcon,
  type LucideIcon,
} from "lucide-react";
import { HugeiconsIcon } from "@hugeicons/react";
import { GithubIcon } from "@hugeicons/core-free-icons";

import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { SIGN_IN_PATH } from "@/features/auth/utils";
import { DASHBOARD_ROUTES } from "@/features/dashboard/lib/routes";
import { disconnectGithubApp } from "@/features/github/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type SettingsUser = { name?: string | null; email?: string | null; image?: string | null };
type SettingsInstallation = {
  connected: boolean;
  accountLogin: string | null;
  installedAt: string | null;
};

const PERMISSIONS = [
  "Access public and private repositories you select",
  "Receive webhooks for pull request events",
  "Post AI-generated review comments on PRs",
];

function Panel({
  label,
  children,
  tone = "default",
}: {
  label: string;
  children: React.ReactNode;
  tone?: "default" | "danger";
}) {
  return (
    <div className={cn("border", tone === "danger" ? "border-red-500/30" : "border-border")}>
      <div
        className={cn(
          "flex items-center gap-2 border-b px-5 py-3 font-mono text-[10px] uppercase tracking-[0.18em]",
          tone === "danger" ? "border-red-500/30 text-red-500/80" : "border-border text-muted-foreground"
        )}
      >
        <span className={cn("size-1.5 rounded-full", tone === "danger" ? "bg-red-500" : "bg-[#ff4d00]")} />
        {label}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

const THEMES: { value: string; label: string; icon: LucideIcon }[] = [
  { value: "light", label: "Light", icon: SunIcon },
  { value: "dark", label: "Dark", icon: MoonIcon },
  { value: "system", label: "System", icon: MonitorIcon },
];

function initials(user: SettingsUser) {
  const source = user.name?.trim() || user.email || "U";
  return source.slice(0, 2).toUpperCase();
}

export function SettingsView({
  user,
  installation,
  installUrl,
}: {
  user: SettingsUser;
  installation: SettingsInstallation;
  installUrl: string;
}) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => setMounted(true), []);

  const installedLabel = installation.installedAt
    ? new Date(installation.installedAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "—";

  async function handleSignOut() {
    setSigningOut(true);
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push(SIGN_IN_PATH);
          router.refresh();
        },
      },
    });
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* account */}
        <Panel label="Account">
          <div className="flex items-center gap-4">
            <Avatar size="lg">
              {user.image ? <AvatarImage src={user.image} alt={user.name ?? "User"} /> : null}
              <AvatarFallback>{initials(user)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-base font-medium">{user.name ?? "User"}</p>
              {user.email ? (
                <p className="truncate text-sm text-muted-foreground">{user.email}</p>
              ) : null}
            </div>
          </div>
        </Panel>

        {/* appearance */}
        <Panel label="Appearance">
          <p className="mb-3 text-sm text-muted-foreground">Theme</p>
          <div className="flex divide-x divide-border border border-border">
            {THEMES.map((t) => {
              const Icon = t.icon;
              const active = mounted && theme === t.value;
              return (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setTheme(t.value)}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-2 px-3 py-2.5 text-sm transition-colors",
                    active
                      ? "bg-[#ff4d00]/10 text-[#ff4d00]"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="size-4" />
                  {t.label}
                </button>
              );
            })}
          </div>
        </Panel>
      </div>

      {/* github connection */}
      <Panel label="GitHub connection">
        {installation.connected ? (
          <div className="space-y-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center border border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <HugeiconsIcon icon={GithubIcon} className="size-5" />
                </span>
                <div>
                  <p className="text-sm font-medium">@{installation.accountLogin}</p>
                  <p className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2Icon className="size-3" />
                    Connected · installed {installedLabel}
                  </p>
                </div>
              </div>
              <form action={disconnectGithubApp}>
                <button
                  type="submit"
                  className="flex items-center gap-2 border border-red-500/40 bg-red-500/5 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-500/15 dark:text-red-400"
                >
                  <UnplugIcon className="size-4" />
                  Disconnect
                </button>
              </form>
            </div>

            <div className="grid grid-cols-2 divide-x divide-border border border-border">
              <Link
                href={DASHBOARD_ROUTES.repos}
                className="flex items-center justify-between px-4 py-3 text-sm transition-colors hover:bg-muted/40"
              >
                Repositories
                <ArrowRightIcon className="size-4 text-muted-foreground" />
              </Link>
              <Link
                href={DASHBOARD_ROUTES.pullRequest}
                className="flex items-center justify-between px-4 py-3 text-sm transition-colors hover:bg-muted/40"
              >
                Pull requests
                <ArrowRightIcon className="size-4 text-muted-foreground" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Install the CodeAudit reviewer app on your GitHub account or
              organization to start receiving AI reviews on every pull request.
            </p>
            <ul className="space-y-1.5">
              {PERMISSIONS.map((p) => (
                <li key={p} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="mt-1.5 size-1 shrink-0 rounded-full bg-[#ff4d00]" />
                  {p}
                </li>
              ))}
            </ul>
            <a
              href={installUrl}
              className="inline-flex items-center gap-2 bg-[#ff4d00] px-4 py-2 text-sm font-semibold text-[#1a0a00] transition-colors hover:bg-[#ff6a2b]"
            >
              <HugeiconsIcon icon={GithubIcon} className="size-4" />
              Install GitHub App
              <ExternalLinkIcon className="size-3 opacity-80" />
            </a>
          </div>
        )}
      </Panel>

      {/* danger zone */}
      <Panel label="Danger zone" tone="danger">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium">Sign out</p>
            <p className="text-xs text-muted-foreground">
              End your session on this device. Your reviews keep running.
            </p>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            disabled={signingOut}
            className="flex items-center justify-center gap-2 border border-red-500/40 bg-red-500/5 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-500/15 disabled:opacity-60 dark:text-red-400"
          >
            <LogOutIcon className="size-4" />
            {signingOut ? "Signing out…" : "Sign out"}
          </button>
        </div>
      </Panel>
    </div>
  );
}
