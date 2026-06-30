"use client";

import { useGsap, gsap } from "../lib/gsap";
import { SectionLabel, GradientText, MaskLine, Reveal } from "./primitives";

type Line = { text: string; tone?: "head" | "good" | "warn" | "bad" | "muted" };

const REVIEW_LINES: Line[] = [
  { text: "## 🔍 AI Code Review", tone: "head" },
  { text: "Solid change overall — one blocking issue to address.", tone: "muted" },
  { text: "", tone: "muted" },
  { text: "### ✅ What looks good", tone: "good" },
  { text: "• Parameterized query removes the injection risk.", tone: "good" },
  { text: "• Error path now returns a typed result.", tone: "good" },
  { text: "", tone: "muted" },
  { text: "### ⚠️ Suggestions", tone: "warn" },
  { text: "• Cache the prepared statement to avoid re-parsing.", tone: "warn" },
  { text: "", tone: "muted" },
  { text: "### 🚨 Issues", tone: "bad" },
  { text: "• getUser() can return undefined — guard the caller.", tone: "bad" },
];

const TONE_CLASS: Record<NonNullable<Line["tone"]>, string> = {
  head: "text-white font-semibold",
  good: "text-emerald-300",
  warn: "text-amber-300",
  bad: "text-rose-300",
  muted: "text-zinc-500",
};

export function ReviewShowcase() {
  const scope = useGsap((el) => {
    const lines = gsap.utils.toArray<HTMLElement>("[data-line]", el);
    gsap.set(lines, { opacity: 0, x: -10 });

    gsap.to(lines, {
      opacity: 1,
      x: 0,
      stagger: 0.12,
      ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 65%" },
    });

    // blinking cursor
    gsap.to("[data-cursor]", {
      opacity: 0,
      repeat: -1,
      yoyo: true,
      duration: 0.5,
      ease: "steps(1)",
    });
  });

  return (
    <section id="showcase" className="relative mx-auto max-w-6xl px-6 py-28">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <Reveal>
            <SectionLabel index="03">The output</SectionLabel>
          </Reveal>
          <h2 className="mt-6 font-sans text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl">
            <MaskLine>A review you'd</MaskLine>
            <MaskLine index={1}>
              <GradientText>actually read.</GradientText>
            </MaskLine>
          </h2>
          <Reveal index={2}>
            <p className="mt-5 max-w-md text-base leading-relaxed text-[#9a9aa3]">
              Structured, proportional, and specific. CodeAudit leads with a
              one-line verdict, calls out what's good, separates non-blocking
              suggestions from real issues, and never invents problems on a clean
              diff.
            </p>
          </Reveal>
          <Reveal index={3}>
            <ul className="mt-7 space-y-3 text-sm text-[#c9c9d0]">
              {[
                "Posted as a single PR comment, updated in place",
                "Mirrored to a GitHub Checks run",
                "Grounded in retrieved repository context",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="size-1.5 rounded-full bg-[#ff4d00]" />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <div ref={scope}>
          <div className="card overflow-hidden p-2 sm:p-3">
            <div className="overflow-hidden rounded-[12px] bg-[#0e0f12] ring-1 ring-white/5">
              <div className="flex items-center gap-2 border-b border-white/5 px-4 py-3">
                <span className="size-3 rounded-full bg-red-500/80" />
                <span className="size-3 rounded-full bg-amber-500/80" />
                <span className="size-3 rounded-full bg-emerald-500/80" />
                <span className="ml-3 font-mono text-xs text-[#75757e]">review.md</span>
              </div>
              <div className="px-5 py-5 font-mono text-[13px] leading-relaxed">
                {REVIEW_LINES.map((line, i) => (
                  <p
                    key={i}
                    data-line
                    className={`min-h-[1.2em] ${TONE_CLASS[line.tone ?? "muted"]}`}
                  >
                    {line.text}
                  </p>
                ))}
                <span data-cursor className="inline-block h-4 w-2 bg-accent align-middle" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
