"use client";

/**
 * Tactile animated film grain layered above the whole page at low opacity.
 * Purely decorative and non-interactive; respects reduced motion via CSS.
 */
export function GrainOverlay() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-80 overflow-hidden">
      <svg className="animate-grain absolute inset-[-50%] h-[200%] w-[200%] opacity-[0.06] mix-blend-screen">
        <filter id="grain-overlay-noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="4"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain-overlay-noise)" />
      </svg>
    </div>
  );
}
