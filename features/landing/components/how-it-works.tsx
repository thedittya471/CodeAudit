"use client";

import { STEPS } from "../lib/content";
import { Reveal, SectionTag, MaskLine } from "./primitives";

export function HowItWorks() {
  return (
    <section id="how" className="border-b border-white/10">
      <SectionTag fig="FIG.04">How it works</SectionTag>

      <div className="border-t border-white/10 px-6 py-12 sm:px-8">
        <h2 className="max-w-2xl font-sans text-3xl font-medium leading-[1.1] tracking-tight text-white sm:text-4xl">
          <MaskLine>Live in minutes.</MaskLine>
          <MaskLine index={1}>
            <span className="text-[#75757e]">Reviewing on the next push.</span>
          </MaskLine>
        </h2>
        <p className="mt-5 max-w-md text-[15px] leading-relaxed text-[#9a9aa3]">
          A durable background job runs every stage independently, so a hiccup
          never loses your review.
        </p>
      </div>

      <div className="grid grid-cols-1 border-t border-white/10 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          return (
            <Reveal
              key={step.id}
              index={i}
              className={`flex flex-col px-6 py-10 sm:px-8 ${i < STEPS.length - 1 ? "border-b border-white/10 sm:odd:border-r lg:border-b-0 lg:border-r" : ""} ${i === 2 ? "sm:border-b-0" : ""}`}
            >
              <div className="flex items-center justify-between">
                <span className="flex size-11 items-center justify-center border border-white/10 text-[#ff4d00]">
                  <Icon className="size-5" />
                </span>
                <span className="font-mono text-2xl font-semibold text-white/10">{step.id}</span>
              </div>
              <span className="mt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-[#ff4d00]">
                {step.label}
              </span>
              <h3 className="mt-2 font-sans text-lg font-medium tracking-tight text-white">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#9a9aa3]">{step.description}</p>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
