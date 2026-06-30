"use client";

import { motion, type Variants } from "motion/react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

const revealVariants: Variants = {
  hidden: { opacity: 0, y: 28, filter: "blur(6px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Stagger index for sequential reveals. */
  index?: number;
  as?: "div" | "section" | "li" | "span" | "h2" | "p";
};

/** Fades + lifts content into view once, using Framer Motion's viewport detection. */
export function Reveal({ children, className, index = 0, as = "div" }: RevealProps) {
  const MotionTag = motion[as];
  return (
    <MotionTag
      className={className}
      variants={revealVariants}
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
    >
      {children}
    </MotionTag>
  );
}

/** Accent gradient emphasis text. */
export function GradientText({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <span className={cn("grad-accent", className)}>{children}</span>;
}

/** Rounded announcement / eyebrow pill above section titles. */
export function Eyebrow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "pill inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium text-[#9a9aa3]",
        className
      )}
    >
      <span className="size-1.5 rounded-full bg-[#ff4d00]" />
      {children}
    </span>
  );
}

const maskVariants: Variants = {
  hidden: { y: "110%" },
  visible: (i: number) => ({
    y: "0%",
    transition: { duration: 0.9, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] },
  }),
};

/**
 * Clip-mask line reveal: the child rises from behind a hidden parent edge.
 * Each instance reveals once when scrolled into view (the Awwwards staple).
 */
export function MaskLine({
  children,
  className,
  index = 0,
}: {
  children: ReactNode;
  className?: string;
  index?: number;
}) {
  return (
    <span className="line-mask">
      <motion.span
        className={cn("block", className)}
        variants={maskVariants}
        custom={index}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/** Editorial section label: monospaced index + title, e.g. "(02) — Pipeline". */
export function SectionLabel({
  index,
  children,
  className,
}: {
  index: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 font-mono text-xs font-medium uppercase tracking-[0.25em] text-[#9a9aa3]",
        className
      )}
    >
      <span className="text-[#ff4d00]">{index}</span>
      <span className="h-px w-8 bg-[#ff4d00]/40" />
      <span>{children}</span>
    </div>
  );
}

/** Throxy/Aqora-style label bar atop a bordered section, with optional FIG no. */
export function SectionTag({
  children,
  fig,
  className,
}: {
  children: ReactNode;
  fig?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-2 px-6 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-[#75757e] sm:px-8",
        className
      )}
    >
      <span className="flex items-center gap-2">
        <span className="size-1.5 rounded-full bg-[#ff4d00]" />
        {children}
      </span>
      {fig ? <span className="text-[#5d5d66]">{fig}</span> : null}
    </div>
  );
}

/** Big stat cell: large number + uppercase caption (throxy data cells). */
export function StatCell({
  value,
  caption,
  className,
}: {
  value: ReactNode;
  caption: string;
  className?: string;
}) {
  return (
    <div className={cn("px-6 py-8 sm:px-8", className)}>
      <div className="text-3xl font-semibold tracking-tight text-white tabular-nums sm:text-4xl">
        {value}
      </div>
      <div className="mt-2 font-mono text-[11px] uppercase leading-relaxed tracking-[0.15em] text-[#75757e]">
        {caption}
      </div>
    </div>
  );
}
