"use client";

import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";
import { useGsap, gsap } from "../lib/gsap";
import { BotIcon, CheckCircle2Icon, AlertTriangleIcon } from "lucide-react";

const DIFF_LINES: { type: "ctx" | "add" | "del"; text: string }[] = [
  { type: "ctx", text: "  export async function getUser(id) {" },
  { type: "del", text: "-   const q = `SELECT * FROM users WHERE id = ${id}`" },
  { type: "add", text: "+   const q = 'SELECT * FROM users WHERE id = $1'" },
  { type: "add", text: "+   return db.query(q, [id])" },
  { type: "ctx", text: "  }" },
];

const FINDINGS = [
  {
    icon: AlertTriangleIcon,
    tone: "text-amber-400",
    label: "SQL injection via template literal — parameterize the query.",
  },
  {
    icon: CheckCircle2Icon,
    tone: "text-emerald-400",
    label: "Good: parameterized query closes the injection vector.",
  },
  {
    icon: CheckCircle2Icon,
    tone: "text-emerald-400",
    label: "No further correctness or performance concerns.",
  },
];

export function ReviewCard() {
  const findingsRef = useRef<HTMLUListElement>(null);

  // GSAP: a scanning beam that sweeps the diff on a loop.
  const scope = useGsap((el) => {
    const beam = el.querySelector("[data-beam]");
    gsap.fromTo(
      beam,
      { yPercent: -20, opacity: 0 },
      {
        yPercent: 320,
        opacity: 1,
        duration: 2.2,
        repeat: -1,
        repeatDelay: 1.4,
        ease: "power1.inOut",
      }
    );
  });

  // anime.js: findings type/fade in sequentially, then repeat.
  useEffect(() => {
    if (!findingsRef.current) return;
    const items = findingsRef.current.querySelectorAll("li");
    const anim = animate(items, {
      opacity: [0, 1],
      translateX: [-12, 0],
      duration: 600,
      delay: stagger(450, { start: 1200 }),
      ease: "outQuad",
      loop: true,
      loopDelay: 2600,
      alternate: false,
    });
    return () => {
      anim.pause();
    };
  }, []);

  return (
    <div
      ref={scope}
      className="group relative overflow-hidden rounded-[12px] bg-[#0e0f12] ring-1 ring-white/5"
    >
      {/* window chrome */}
      <div className="flex items-center gap-2 border-b border-white/5 px-4 py-3">
        <span className="size-3 rounded-full bg-red-500/80" />
        <span className="size-3 rounded-full bg-amber-500/80" />
        <span className="size-3 rounded-full bg-emerald-500/80" />
        <span className="ml-3 font-mono text-xs text-zinc-500">
          pull/142 · auth/get-user.ts
        </span>
        <span className="ml-auto flex items-center gap-1.5 border border-[#ff4d00]/30 bg-[#ff4d00]/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-[#ff4d00]">
          <span className="size-1.5 animate-pulse rounded-full bg-[#ff4d00]" />
          reviewing
        </span>
      </div>

      {/* diff with scanning beam */}
      <div className="relative overflow-hidden px-4 py-3 font-mono text-[12px] leading-relaxed sm:text-[13px]">
        <div
          data-beam
          className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-linear-to-b from-transparent via-[#ff4d00]/25 to-transparent"
        />
        {DIFF_LINES.map((line, i) => (
          <div
            key={i}
            className={
              line.type === "add"
                ? "bg-emerald-500/10 text-emerald-300"
                : line.type === "del"
                  ? "bg-red-500/10 text-red-300"
                  : "text-zinc-500"
            }
          >
            <span className="select-none pr-3 text-zinc-600">{i + 1}</span>
            {line.text}
          </div>
        ))}
      </div>

      {/* AI review block */}
      <div className="border-t border-white/10 bg-white/2 px-4 py-4">
        <div className="flex items-center gap-2 pb-3">
          <span className="flex size-6 items-center justify-center bg-[#ff4d00]">
            <BotIcon className="size-3.5 text-black" />
          </span>
          <span className="text-xs font-medium text-neutral-300">CodeAudit Review</span>
        </div>
        <ul ref={findingsRef} className="space-y-2">
          {FINDINGS.map((finding, i) => {
            const Icon = finding.icon;
            return (
              <li key={i} className="flex items-start gap-2 text-[13px] text-zinc-300 opacity-0">
                <Icon className={`mt-0.5 size-4 shrink-0 ${finding.tone}`} />
                <span>{finding.label}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
