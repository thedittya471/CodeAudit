"use client";

import { useRef, type ReactNode } from "react";
import { gsap } from "../lib/gsap";

type MagneticProps = {
  children: ReactNode;
  className?: string;
  /** How far the element is pulled toward the cursor (0–1). */
  strength?: number;
};

/**
 * Pulls its child toward the cursor while hovered (the classic Awwwards
 * "magnetic" button), easing back to center on leave. No-ops on touch.
 */
export function Magnetic({ children, className, strength = 0.4 }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const xTo = useRef<((v: number) => void) | null>(null);
  const yTo = useRef<((v: number) => void) | null>(null);

  function ensureQuickTo() {
    if (!ref.current) return;
    if (!xTo.current) {
      xTo.current = gsap.quickTo(ref.current, "x", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
      yTo.current = gsap.quickTo(ref.current, "y", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
    }
  }

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    ensureQuickTo();
    const el = ref.current;
    if (!el || !xTo.current || !yTo.current) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    xTo.current(relX * strength);
    yTo.current(relY * strength);
  }

  function handleLeave() {
    xTo.current?.(0);
    yTo.current?.(0);
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={className}
    >
      {children}
    </div>
  );
}
