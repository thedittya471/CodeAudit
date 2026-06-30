"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PlusIcon } from "lucide-react";
import { SectionTag, MaskLine } from "./primitives";

const FAQS = [
  {
    q: "Do I need to set anything up?",
    a: "No. Install the GitHub App, pick your repositories, and CodeAudit starts reviewing pull requests automatically. There's nothing to configure or maintain.",
  },
  {
    q: "How does it understand my codebase?",
    a: "Each pull request diff is embedded and matched against your synced repository, so reviews are grounded in the surrounding code — not just the changed lines.",
  },
  {
    q: "Where do the reviews show up?",
    a: "Directly on the pull request as a single comment that updates in place, plus a GitHub Checks run that turns green when the review completes.",
  },
  {
    q: "Which languages are supported?",
    a: "TypeScript, Python, Go, Rust, Java, Kotlin, Swift, C/C++, Ruby, PHP, SQL, and more — anything that appears in your diffs.",
  },
  {
    q: "Is my code safe?",
    a: "Each pull request is isolated in its own vector namespace, and nothing about your diff is shared across repositories. Reviews run on your behalf via your own installation.",
  },
];

function Item({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`px-6 sm:px-8 ${index < FAQS.length - 1 ? "border-b border-white/10" : ""}`}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
      >
        <span className="flex items-center gap-4">
          <span className="font-mono text-xs text-[#ff4d00]">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="text-base font-medium text-white">{q}</span>
        </span>
        <PlusIcon
          className={`size-4 shrink-0 text-[#ff7a3d] transition-transform duration-300 ${open ? "rotate-45" : ""}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="max-w-2xl pb-5 pl-9 text-sm leading-relaxed text-[#9a9aa3]">{a}</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export function Faq() {
  return (
    <section id="faq" className="border-b border-white/10">
      <SectionTag>FAQ</SectionTag>
      <div className="border-t border-white/10 px-6 py-12 sm:px-8">
        <h2 className="font-sans text-3xl font-medium leading-[1.1] tracking-tight text-white sm:text-4xl">
          <MaskLine>Questions,</MaskLine>
          <MaskLine index={1}>
            <span className="text-[#75757e]">answered.</span>
          </MaskLine>
        </h2>
      </div>
      <div className="border-t border-white/10">
        {FAQS.map((f, i) => (
          <Item key={f.q} q={f.q} a={f.a} index={i} />
        ))}
      </div>
    </section>
  );
}
