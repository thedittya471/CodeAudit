"use client";

import { Reveal, SectionTag, MaskLine } from "./primitives";

const PROBLEMS = [
  {
    n: "01",
    title: "Diff-only bots miss the point",
    body: "They review the lines you changed with no idea what those lines call, return, or break elsewhere.",
  },
  {
    n: "02",
    title: "Linters drown you in nitpicks",
    body: "Style noise buries the one comment that actually matters — so people stop reading the reviews.",
  },
  {
    n: "03",
    title: "Manual review doesn't scale",
    body: "Senior engineers become the bottleneck, and PRs sit for hours waiting on a free pair of eyes.",
  },
];

export function Comparison() {
  return (
    <section id="problem" className="border-b border-white/10">
      <SectionTag fig="FIG.01">The problem</SectionTag>

      <div className="border-t border-white/10 px-6 py-12 sm:px-8">
        <h2 className="max-w-2xl font-sans text-3xl font-medium leading-[1.1] tracking-tight text-white sm:text-4xl">
          <MaskLine>Most reviews are too slow,</MaskLine>
          <MaskLine index={1}>
            <span className="text-[#75757e]">too noisy, or too shallow.</span>
          </MaskLine>
        </h2>
      </div>

      <div className="grid grid-cols-1 border-t border-white/10 lg:grid-cols-3">
        {PROBLEMS.map((p, i) => (
          <Reveal
            key={p.n}
            index={i}
            className={`px-6 py-10 sm:px-8 ${i < PROBLEMS.length - 1 ? "border-b border-white/10 lg:border-b-0 lg:border-r" : ""}`}
          >
            <span className="font-mono text-sm text-[#ff4d00]">{p.n}</span>
            <h3 className="mt-4 font-sans text-lg font-medium tracking-tight text-white">
              {p.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[#9a9aa3]">{p.body}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
