import {
  BotIcon,
  GitPullRequestIcon,
  ShieldCheckIcon,
  GaugeIcon,
  NetworkIcon,
  SparklesIcon,
  GitBranchIcon,
  MessageSquareCodeIcon,
  type LucideIcon,
} from "lucide-react";

export type Feature = {
  title: string;
  description: string;
  icon: LucideIcon;
  /** Grid span on large screens for the bento layout. */
  span: string;
};

export const FEATURES: Feature[] = [
  {
    title: "Context-aware reviews",
    description:
      "Every diff is embedded and matched against your whole codebase, so feedback understands the code around the change — not just the lines you touched.",
    icon: NetworkIcon,
    span: "lg:col-span-2 lg:row-span-2",
  },
  {
    title: "Security first",
    description:
      "Catches injection risks, leaked secrets, and unvalidated input before they reach main.",
    icon: ShieldCheckIcon,
    span: "lg:col-span-1",
  },
  {
    title: "Performance lens",
    description:
      "Flags N+1 queries, hot loops, and memory leaks with proportional, no-nitpick feedback.",
    icon: GaugeIcon,
    span: "lg:col-span-1",
  },
  {
    title: "Posts where you work",
    description:
      "Reviews land as a live PR comment and a Checks run — updating in place as analysis finishes.",
    icon: MessageSquareCodeIcon,
    span: "lg:col-span-1",
  },
  {
    title: "Runs on every push",
    description:
      "Opened, synchronized, reopened — a webhook kicks off a durable pipeline on each event.",
    icon: GitBranchIcon,
    span: "lg:col-span-1",
  },
];

export type Step = {
  id: string;
  label: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

export const STEPS: Step[] = [
  {
    id: "01",
    label: "Trigger",
    title: "A pull request opens",
    description:
      "GitHub fires a webhook. We verify the signature, persist the PR, and hand off to a durable background job.",
    icon: GitPullRequestIcon,
  },
  {
    id: "02",
    label: "Understand",
    title: "Diffs become vectors",
    description:
      "Each changed file is chunked and embedded into an isolated namespace, then matched against synced repo context.",
    icon: NetworkIcon,
  },
  {
    id: "03",
    label: "Reason",
    title: "The model reviews",
    description:
      "An expert reviewer prompt analyzes correctness, security, performance, and maintainability across the retrieved context.",
    icon: BotIcon,
  },
  {
    id: "04",
    label: "Deliver",
    title: "Feedback in the PR",
    description:
      "The in-progress comment updates in place with the final review and the Checks run turns green.",
    icon: SparklesIcon,
  },
];

export type Stat = {
  value: number;
  suffix: string;
  label: string;
};

export const STATS: Stat[] = [
  { value: 6, suffix: "", label: "Review dimensions per diff" },
  { value: 80, suffix: " lines", label: "Per embedded code chunk" },
  { value: 100, suffix: "%", label: "Diffs matched to repo context" },
  { value: 10, suffix: "s", label: "Median time to first comment" },
];

export const STACK = [
  "TypeScript",
  "Python",
  "Go",
  "Rust",
  "Java",
  "Kotlin",
  "Swift",
  "C++",
  "Ruby",
  "PHP",
  "SQL",
  "Prisma",
];
