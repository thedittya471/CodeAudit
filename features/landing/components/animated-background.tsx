"use client";

import { useGsap, gsap } from "../lib/gsap";

/**
 * Fixed editorial backdrop on paper: a structural ink grid (thin rules) with a
 * soft radial fade, plus a single faint accent wash that drifts on scroll.
 * Flat — no glows or shadows. Decorative only (aria-hidden, pointer-events-none).
 */
export function AnimatedBackground() {
  const scope = useGsap((el) => {
    gsap.to("[data-wash]", {
      yPercent: 24,
      ease: "none",
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5,
      },
    });
  });

  return (
    <div
      ref={scope}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#0a0a0c]"
    >
      {/* structural grid */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.55]">
        <defs>
          <pattern id="rules" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M80 0H0V80" fill="none" stroke="rgb(255 255 255 / 0.04)" strokeWidth="1" />
          </pattern>
          <radialGradient id="rules-fade" cx="50%" cy="35%" r="75%">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0.08" />
          </radialGradient>
          <mask id="rules-mask">
            <rect width="100%" height="100%" fill="url(#rules-fade)" />
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="url(#rules)" mask="url(#rules-mask)" />
      </svg>

      {/* accent glows */}
      <div
        data-wash
        className="absolute left-1/2 top-[-18%] h-[44rem] w-[44rem] -translate-x-1/2 rounded-full bg-[#ff4d00]/14 blur-[170px]"
      />
      <div className="absolute right-[-10%] top-[30%] h-[30rem] w-[30rem] rounded-full bg-[#ff7a3d]/8 blur-[160px]" />

      {/* edge vignette */}
      <div className="absolute inset-x-0 bottom-0 h-56 bg-linear-to-t from-[#0a0a0c] to-transparent" />
    </div>
  );
}
