"use client";

import { useEffect, useLayoutEffect, useRef, type DependencyList } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

/** Registers GSAP plugins exactly once, guarded for SSR. */
export function registerGsap() {
  if (!registered && typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }
}

/** useLayoutEffect on the client, useEffect on the server (avoids SSR warnings). */
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

type GsapSetup = (scope: HTMLElement) => void;

/**
 * Runs GSAP animations scoped to a container ref using `gsap.context`,
 * with automatic cleanup (revert) on unmount. Returns the ref to attach.
 */
export function useGsap<T extends HTMLElement = HTMLDivElement>(
  setup: GsapSetup,
  deps: DependencyList = []
) {
  const scopeRef = useRef<T>(null);

  useIsomorphicLayoutEffect(() => {
    registerGsap();
    const el = scopeRef.current;
    if (!el) return;

    const ctx = gsap.context(() => setup(el), el);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return scopeRef;
}

export { gsap, ScrollTrigger };
