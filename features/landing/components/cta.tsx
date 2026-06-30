"use client";

import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { HugeiconsIcon } from "@hugeicons/react";
import { GithubIcon } from "@hugeicons/core-free-icons";
import { Magnetic } from "./magnetic";
import { MaskLine } from "./primitives";

export function CallToAction() {
  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_50%_120%,rgba(255,77,0,0.12),transparent_60%)]">
      <div className="flex flex-col items-center px-6 py-20 text-center sm:px-8">
        <h2 className="max-w-2xl font-sans text-4xl font-medium leading-[1.08] tracking-tight text-white sm:text-6xl">
          <MaskLine>Ship with a reviewer</MaskLine>
          <MaskLine index={1}>
            <span className="text-[#75757e]">that never sleeps.</span>
          </MaskLine>
        </h2>
        <p className="mt-6 max-w-md text-[15px] leading-relaxed text-[#9a9aa3]">
          Install the GitHub App, pick your repositories, and open a pull request.
          Your first review lands in seconds.
        </p>
        <Magnetic strength={0.4}>
          <Link
            href="/sign-in"
            className="group mt-9 flex items-center gap-2 bg-[#ff4d00] px-7 py-4 text-sm font-semibold text-[#1a0a00] transition-colors hover:bg-[#ff6a2b]"
          >
            <HugeiconsIcon icon={GithubIcon} className="size-4" />
            Get started free
            <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Magnetic>
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10">
      <div className="grid grid-cols-2 border-b border-white/10 sm:grid-cols-4">
        {[
          { h: "Directory", links: ["Features", "How it works", "Pipeline", "FAQ"] },
          { h: "Company", links: ["About", "Blog", "Careers"] },
          { h: "Protocol", links: ["Privacy", "Terms", "Security"] },
          { h: "Account", links: ["Sign in", "Get started"] },
        ].map((col, i) => (
          <div
            key={col.h}
            className={`px-6 py-8 sm:px-8 ${i % 2 === 0 ? "border-r border-white/10" : ""} ${i < 2 ? "border-b border-white/10 sm:border-b-0" : ""} ${i === 0 || i === 1 ? "sm:border-r" : ""}`}
          >
            <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#75757e]">
              {col.h}
            </h3>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((l) => (
                <li key={l}>
                  <a
                    href={l === "Sign in" || l === "Get started" ? "/sign-in" : "#"}
                    className="text-sm text-[#9a9aa3] transition-colors hover:text-white"
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* oversized wordmark band */}
      <div className="relative overflow-hidden border-b border-white/10 px-6 py-10 sm:px-8">
        <p className="select-none text-[18vw] font-semibold leading-none tracking-tighter text-white/4 lg:text-[12rem]">
          CODEAUDIT
        </p>
        <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.25em] text-[#5d5d66]">
          The AI code reviewer for teams who ship fast.
        </p>
      </div>

      <div className="flex flex-col items-center justify-between gap-3 px-6 py-6 sm:flex-row sm:px-8">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-semibold text-white">CodeAudit</span>
          <span className="text-[#5d5d66]">© 2026</span>
        </div>
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#5d5d66]">
          Created by CodeAudit Studio · 20—26
        </p>
      </div>
    </footer>
  );
}
