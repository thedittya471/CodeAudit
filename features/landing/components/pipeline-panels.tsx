"use client";

import { CheckCircle2Icon, TriangleAlertIcon, GitPullRequestIcon } from "lucide-react";
import { Reveal, SectionTag, MaskLine } from "./primitives";

function Panel({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-col px-6 py-8 sm:px-8 ${className ?? ""}`}>
      <div className="mb-5 font-mono text-[11px] uppercase tracking-[0.2em] text-[#75757e]">
        {label}
      </div>
      {children}
    </div>
  );
}

export function PipelinePanels() {
  return (
    <section id="pipeline" className="border-b border-white/10">
      <SectionTag fig="FIG.03">The work, done for you</SectionTag>

      <div className="border-t border-white/10 px-6 py-12 sm:px-8">
        <h2 className="max-w-2xl font-sans text-3xl font-medium leading-[1.1] tracking-tight text-white sm:text-4xl">
          <MaskLine>We do the review.</MaskLine>
          <MaskLine index={1}>
            <span className="text-[#75757e]">You just merge.</span>
          </MaskLine>
        </h2>
        <p className="mt-5 max-w-md text-[15px] leading-relaxed text-[#9a9aa3]">
          Three stages run automatically on every push — embedding the diff,
          reasoning over it, and posting the result where you already work.
        </p>
      </div>

      <div className="grid grid-cols-1 border-t border-white/10 lg:grid-cols-3">
        {/* embed */}
        <Reveal className="border-b border-white/10 lg:border-b-0 lg:border-r">
          <Panel label="01 — Embed">
            <div className="space-y-2 font-mono text-xs">
              {["auth/get-user.ts", "db/client.ts", "lib/validate.ts"].map((f) => (
                <div key={f} className="flex items-center justify-between border border-white/10 px-3 py-2">
                  <span className="text-[#c9c9d0]">{f}</span>
                  <span className="text-[#5d5d66]">chunked</span>
                </div>
              ))}
            </div>
            <p className="mt-5 text-sm text-[#9a9aa3]">
              The diff is split into chunks and embedded into an isolated vector
              namespace for this PR.
            </p>
          </Panel>
        </Reveal>

        {/* reason */}
        <Reveal index={1} className="border-b border-white/10 lg:border-b-0 lg:border-r">
          <Panel label="02 — Reason">
            <div className="mb-4 space-y-1 border border-white/10 p-3 font-mono text-[11px]">
              {[
                ["ANALYZING DIFF", "14ms"],
                ["RETRIEVING CONTEXT", "82ms"],
                ["SCORING FINDINGS", "45ms"],
              ].map(([step, ms]) => (
                <div key={step} className="flex items-center justify-between">
                  <span className="text-[#9a9aa3]">
                    <span className="mr-1.5 text-emerald-400">✓</span>
                    {step}
                  </span>
                  <span className="text-[#5d5d66]">{ms}</span>
                </div>
              ))}
            </div>
            <ul className="space-y-2.5 text-[13px]">
              <li className="flex items-start gap-2 text-rose-300">
                <TriangleAlertIcon className="mt-0.5 size-4 shrink-0" />
                SQL injection via template literal
              </li>
              <li className="flex items-start gap-2 text-emerald-300">
                <CheckCircle2Icon className="mt-0.5 size-4 shrink-0" />
                Error path returns a typed result
              </li>
              <li className="flex items-start gap-2 text-emerald-300">
                <CheckCircle2Icon className="mt-0.5 size-4 shrink-0" />
                No further correctness concerns
              </li>
            </ul>
            <p className="mt-5 text-sm text-[#9a9aa3]">
              An expert reviewer model weighs correctness, security, performance,
              and maintainability across the retrieved context.
            </p>
          </Panel>
        </Reveal>

        {/* deliver */}
        <Reveal index={2}>
          <Panel label="03 — Deliver">
            <div className="border border-white/10">
              <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2">
                <GitPullRequestIcon className="size-4 text-[#ff7a3d]" />
                <span className="font-mono text-xs text-[#c9c9d0]">pull/142</span>
                <span className="ml-auto border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-emerald-400">
                  passed
                </span>
              </div>
              <p className="px-3 py-3 text-[13px] text-[#9a9aa3]">
                Review posted as a single PR comment and mirrored to a Checks run —
                updated in place as analysis finishes.
              </p>
            </div>
            <p className="mt-5 text-sm text-[#9a9aa3]">
              Feedback lands where your team already reviews — no new dashboard to
              babysit.
            </p>
          </Panel>
        </Reveal>
      </div>
    </section>
  );
}
