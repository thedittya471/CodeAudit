"use client";

import { useEffect, useRef } from "react";
import { useInView } from "motion/react";
import { animate } from "animejs";
import { STATS, type Stat } from "../lib/content";
import { SectionTag } from "./primitives";

function Counter({ stat, className }: { stat: Stat; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wrapRef, { once: true, margin: "-60px" });

  useEffect(() => {
    if (!inView || !ref.current) return;
    const node = ref.current;
    const obj = { v: 0 };
    animate(obj, {
      v: stat.value,
      duration: 1700,
      ease: "outExpo",
      onUpdate: () => {
        node.textContent = String(Math.round(obj.v));
      },
    });
  }, [inView, stat.value]);

  return (
    <div ref={wrapRef} className={`px-6 py-10 sm:px-8 ${className ?? ""}`}>
      <div className="text-4xl font-semibold tracking-tight text-white tabular-nums sm:text-5xl">
        <span ref={ref}>0</span>
        <span className="text-[#ff4d00]">{stat.suffix}</span>
      </div>
      <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.15em] text-[#75757e]">
        {stat.label}
      </div>
    </div>
  );
}

export function Stats() {
  return (
    <section className="border-b border-white/10">
      <SectionTag fig="FIG.06">By the numbers</SectionTag>
      <div className="grid grid-cols-2 border-t border-white/10 lg:grid-cols-4">
        {STATS.map((stat, i) => (
          <Counter
            key={stat.label}
            stat={stat}
            className={`border-white/10 ${i % 2 === 0 ? "border-r" : ""} ${i < 3 ? "lg:border-r" : ""} ${i < 2 ? "border-b lg:border-b-0" : ""}`}
          />
        ))}
      </div>
    </section>
  );
}
