"use client";

import Link from "next/link";
import { motion, type Variants } from "motion/react";
import { ArrowRightIcon } from "lucide-react";
import { Magnetic } from "./magnetic";
import { ReviewCalendar } from "./review-calendar";

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const lineVariant: Variants = {
  hidden: { y: "120%" },
  visible: { y: "0%", transition: { duration: 0.95, ease: [0.16, 1, 0.3, 1] } },
};

const fade: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

function Line({ children }: { children: React.ReactNode }) {
  return (
    <span className="line-mask">
      <motion.span variants={lineVariant} className="block">
        {children}
      </motion.span>
    </span>
  );
}

export function Hero() {
  return (
    <section className="border-b border-white/10">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* left: copy */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={container}
          className="flex flex-col justify-center border-b border-white/10 px-6 py-12 sm:px-10 lg:border-b-0 lg:border-r lg:py-16"
        >
          {/* eyebrow badge */}
          <motion.div variants={fade} className="flex items-center gap-2.5">
            <span className="flex size-5 items-center justify-center bg-[#ff4d00] text-[10px] font-bold text-[#1a0a00]">
              CA
            </span>
            <span className="font-mono text-xs uppercase tracking-[0.15em] text-[#9a9aa3]">
              AI code review, on autopilot
            </span>
          </motion.div>

          <motion.h1
            variants={container}
            className="mt-6 font-sans text-[2.6rem] font-semibold leading-[0.98] tracking-tight text-white sm:text-6xl"
          >
            <Line>Pull requests</Line>
            <Line>reviewed in seconds.</Line>
            <Line>
              <span className="text-[#75757e]">Done for you.</span>
            </Line>
          </motion.h1>

          <motion.p
            variants={fade}
            className="mt-6 max-w-md text-[15px] leading-relaxed text-[#9a9aa3]"
          >
            Most review bots only see the diff. CodeAudit reads your whole
            repository, then posts a precise, security-aware review on every pull
            request — automatically, the moment it opens.
          </motion.p>

          {/* split CTA button */}
          <motion.div variants={fade} className="mt-9">
            <Magnetic strength={0.25}>
              <Link
                href="/sign-in"
                className="group flex w-full max-w-sm items-stretch border border-[#ff4d00]/40 bg-[#ff4d00]/10 transition-colors hover:bg-[#ff4d00]/20"
              >
                <span className="flex w-14 shrink-0 items-center justify-center border-r border-[#ff4d00]/30 text-[#ff7a3d]">
                  <ArrowRightIcon className="size-5 transition-transform group-hover:translate-x-0.5" />
                </span>
                <span className="flex flex-1 items-center px-5 py-4 text-sm font-medium text-white">
                  Connect GitHub &amp; start reviewing
                </span>
              </Link>
            </Magnetic>
          </motion.div>
        </motion.div>

        {/* right: review calendar mockup */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="flex flex-col justify-center bg-[radial-gradient(circle_at_70%_0%,rgba(255,77,0,0.07),transparent_55%)] px-6 py-12 sm:px-10 lg:py-16"
        >
          <div className="mb-3 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.2em] text-[#75757e]">
            <span>Review activity</span>
            <span className="flex items-center gap-1.5">
              <span className="size-1.5 animate-pulse rounded-full bg-[#ff4d00]" />
              This month
            </span>
          </div>
          <ReviewCalendar />
        </motion.div>
      </div>
    </section>
  );
}
