"use client";

import { FEATURES } from "../lib/content";
import { Reveal, SectionTag, MaskLine } from "./primitives";

const TAGS = [
  "Correctness",
  "Security",
  "Performance",
  "Reliability",
  "Readability",
  "Maintainability",
];

export function FeaturesBento() {
  return (
    <section id="features" className="border-b border-white/10">
      <SectionTag fig="FIG.05">Capabilities</SectionTag>

      <div className="border-t border-white/10 px-6 py-12 sm:px-8">
        <h2 className="max-w-2xl font-sans text-3xl font-medium leading-[1.1] tracking-tight text-white sm:text-4xl">
          <MaskLine>Everything a senior reviewer checks —</MaskLine>
          <MaskLine index={1}>
            <span className="text-[#75757e]">on every pull request.</span>
          </MaskLine>
        </h2>
      </div>

      {/* feature tiles */}
      <div className="grid grid-cols-1 border-t border-white/10 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature, i) => {
          const Icon = feature.icon;
          return (
            <Reveal
              key={feature.title}
              index={i}
              className="group border-b border-white/10 sm:odd:border-r lg:not-nth-[3n]:border-r"
            >
              <div className="flex h-full flex-col px-6 py-8 transition-colors hover:bg-white/2 sm:px-8">
                <div className="flex items-center justify-between">
                  <span className="flex size-10 items-center justify-center border border-white/10 text-[#9a9aa3] transition-colors group-hover:border-[#ff4d00]/40 group-hover:text-[#ff4d00]">
                    <Icon className="size-5" />
                  </span>
                  <span className="font-mono text-xs text-[#5d5d66]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-6 font-sans text-lg font-medium tracking-tight text-white">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#9a9aa3]">
                  {feature.description}
                </p>
              </div>
            </Reveal>
          );
        })}
      </div>

      {/* dimension tag strip */}
      <div className="flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-white/10 px-6 py-5 sm:px-8">
        {TAGS.map((tag) => (
          <span
            key={tag}
            className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#75757e]"
          >
            <span className="mr-2 text-[#ff4d00]">/</span>
            {tag}
          </span>
        ))}
      </div>
    </section>
  );
}
