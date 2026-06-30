"use client";

import Link from "next/link";
import { FileCodeIcon, ArrowRightIcon } from "lucide-react";
import { Reveal, SectionTag, StatCell, MaskLine } from "./primitives";

const RETRIEVED = [
  { path: "auth/get-user.ts", score: "0.94" },
  { path: "db/client.ts", score: "0.89" },
  { path: "lib/validate.ts", score: "0.81" },
  { path: "auth/session.ts", score: "0.76" },
];

const STATS = [
  { value: "6", caption: "Review dimensions per diff" },
  { value: "≈10s", caption: "To first comment" },
  { value: "100%", caption: "Diffs matched to repo context" },
  { value: "0", caption: "Lines that leave your namespace" },
];

export function FeatureContext() {
  return (
    <section className="border-b border-white/10">
      <SectionTag fig="FIG.02">Context-aware</SectionTag>

      <div className="grid grid-cols-1 border-t border-white/10 lg:grid-cols-2">
        {/* copy */}
        <div className="flex flex-col justify-center border-b border-white/10 px-6 py-12 sm:px-8 lg:border-b-0 lg:border-r">
          <h2 className="font-sans text-3xl font-medium leading-[1.1] tracking-tight text-white sm:text-4xl">
            <MaskLine>It reads the code</MaskLine>
            <MaskLine index={1}>
              <span className="text-[#75757e]">around your change.</span>
            </MaskLine>
          </h2>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-[#9a9aa3]">
            Every diff is embedded and matched against your whole codebase, so
            feedback understands how your project actually works — not just the
            lines you touched.
          </p>
          <Link
            href="/sign-in"
            className="mt-7 inline-flex w-fit items-center gap-2 text-sm font-medium text-[#ff7a3d] transition-colors hover:text-[#ff4d00]"
          >
            Connect a repository
            <ArrowRightIcon className="size-4" />
          </Link>
        </div>

        {/* retrieval mockup */}
        <div className="flex items-center bg-[radial-gradient(circle_at_80%_20%,rgba(255,77,0,0.06),transparent_55%)] px-6 py-12 sm:px-8">
          <div className="w-full">
            <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-[#75757e]">
              Retrieved context
            </div>
            <ul className="divide-y divide-white/10 border border-white/10">
              {RETRIEVED.map((row) => (
                <li key={row.path} className="flex items-center gap-3 px-4 py-3">
                  <FileCodeIcon className="size-4 shrink-0 text-[#75757e]" />
                  <span className="flex-1 truncate font-mono text-sm text-[#c9c9d0]">
                    {row.path}
                  </span>
                  <span className="font-mono text-xs text-[#ff7a3d]">{row.score}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* stat cells */}
      <div className="grid grid-cols-2 border-t border-white/10 lg:grid-cols-4">
        {STATS.map((s, i) => (
          <Reveal
            key={s.caption}
            index={i}
            className={`border-white/10 ${i < 3 ? "lg:border-r" : ""} ${i % 2 === 0 ? "border-r lg:border-r" : ""} ${i < 2 ? "border-b lg:border-b-0" : ""}`}
          >
            <StatCell value={s.value} caption={s.caption} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
