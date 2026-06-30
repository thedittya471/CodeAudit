"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MenuIcon, XIcon } from "lucide-react";
import { HugeiconsIcon } from "@hugeicons/react";
import { GithubIcon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";

const LINKS = [
  { label: "Problem", href: "#problem" },
  { label: "How it works", href: "#how" },
  { label: "Features", href: "#features" },
  { label: "Pipeline", href: "#pipeline" },
  { label: "FAQ", href: "#faq" },
];

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50"
    >
      {/* matches the landing frame's gutter so the nav lines up with it */}
      <div className="px-3 sm:px-4">
        <div
          className={cn(
            "flex h-14 items-center justify-between border-x border-white/10 px-6 transition-colors duration-300 sm:px-8",
            scrolled || open
              ? "border-b bg-[#0a0a0c]/85 backdrop-blur-xl"
              : "border-b border-b-transparent"
          )}
        >
          {/* logo */}
          <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
            <span className="flex size-7 items-center justify-center bg-[#ff4d00]/12 ring-1 ring-[#ff4d00]/25">
              <Image src="/logo.svg" alt="" width={15} height={15} />
            </span>
            <span className="text-sm font-semibold tracking-tight text-white">CodeAudit</span>
            <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-[#5d5d66] lg:block">
              / AI Review
            </span>
          </Link>

          {/* center links */}
          <ul className="hidden items-center gap-7 md:flex">
            {LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="font-mono text-[11px] uppercase tracking-[0.15em] text-[#9a9aa3] transition-colors hover:text-white"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* right actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/sign-in"
              className="hidden items-center gap-2 border border-[#ff4d00]/40 bg-[#ff4d00]/10 px-3.5 py-1.5 text-sm font-medium text-[#ff7a3d] transition-colors hover:bg-[#ff4d00]/20 sm:flex"
            >
              <HugeiconsIcon icon={GithubIcon} className="size-4" />
              Get started
            </Link>

            <button
              type="button"
              aria-label="Toggle menu"
              onClick={() => setOpen((v) => !v)}
              className="flex size-9 items-center justify-center border border-white/10 text-white md:hidden"
            >
              {open ? <XIcon className="size-4" /> : <MenuIcon className="size-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* mobile menu — also kept inside the frame gutter */}
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden px-3 sm:px-4 md:hidden"
          >
            <div className="border-x border-b border-white/10 bg-[#0a0a0c]/95 backdrop-blur-xl">
              <ul className="flex flex-col">
                {LINKS.map((link) => (
                  <li key={link.label} className="border-b border-white/10">
                    <a
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="block px-6 py-4 font-mono text-xs uppercase tracking-[0.15em] text-[#c9c9d0]"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
              <div className="flex flex-col gap-2 p-4">
                <Link
                  href="/sign-in"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 bg-[#ff4d00] px-4 py-3 text-sm font-semibold text-[#1a0a00]"
                >
                  <HugeiconsIcon icon={GithubIcon} className="size-4" />
                  Get started
                </Link>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.header>
  );
}
