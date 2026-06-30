import type { Metadata } from "next";
import { LandingPage } from "@/features/landing/components/landing-page";

export const metadata: Metadata = {
  title: "CodeAudit — AI pull-request reviews that read your codebase",
  description:
    "CodeAudit embeds every diff, retrieves surrounding repository context, and posts a precise, security-aware review on your pull request within seconds.",
};

export default function Home() {
  return <LandingPage />;
}
