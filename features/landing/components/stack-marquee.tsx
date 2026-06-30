"use client";

import { useGsap, gsap, ScrollTrigger } from "../lib/gsap";
import { STACK } from "../lib/content";

/**
 * Bordered "works with" strip: a labelled cell + an infinite language marquee
 * that skews and accelerates with scroll velocity.
 */
export function StackMarquee() {
  const scope = useGsap((el) => {
    const track = el.querySelector<HTMLElement>("[data-track]");
    if (!track) return;

    const tl = gsap.fromTo(
      track,
      { xPercent: 0 },
      { xPercent: -50, repeat: -1, ease: "none", duration: 26 }
    );
    const skewSetter = gsap.quickTo(track, "skewX", { duration: 0.5, ease: "power3" });
    let settle: gsap.core.Tween | undefined;

    const st = ScrollTrigger.create({
      onUpdate: (self) => {
        const v = self.getVelocity();
        skewSetter(gsap.utils.clamp(-12, 12, v / -100));
        tl.timeScale(gsap.utils.clamp(1, 5, 1 + Math.abs(v) / 300) * (v < 0 ? -1 : 1));
        settle?.kill();
        settle = gsap.delayedCall(0.4, () => {
          skewSetter(0);
          tl.timeScale(1);
        });
      },
    });

    return () => {
      settle?.kill();
      st.kill();
    };
  });

  const langs = [...STACK, ...STACK];

  return (
    <section ref={scope} className="grid grid-cols-1 border-b border-white/10 sm:grid-cols-[auto_1fr]">
      <div className="flex items-center border-b border-white/10 px-6 py-4 font-mono text-[11px] uppercase tracking-[0.2em] text-[#75757e] sm:border-b-0 sm:border-r sm:px-8">
        Reviews the languages you ship
      </div>
      <div className="overflow-hidden py-4 mask-[linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
        <div data-track className="flex w-max gap-3 whitespace-nowrap px-4">
          {langs.map((name, i) => (
            <span
              key={i}
              className="flex items-center gap-2 border border-white/10 px-4 py-1.5 font-mono text-xs text-[#9a9aa3]"
            >
              <span className="size-1.5 rounded-full bg-[#ff4d00]" />
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
