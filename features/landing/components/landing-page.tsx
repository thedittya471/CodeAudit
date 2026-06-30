"use client";

import { motion, useScroll, useSpring } from "motion/react";
import { AnimatedBackground } from "./animated-background";
import { GrainOverlay } from "./grain-overlay";
import { SmoothScroll } from "./smooth-scroll";
import { SiteNav } from "./site-nav";
import { Hero } from "./hero";
import { StackMarquee } from "./stack-marquee";
import { Comparison } from "./comparison";
import { FeatureContext } from "./feature-context";
import { PipelinePanels } from "./pipeline-panels";
import { FeaturesBento } from "./features-bento";
import { HowItWorks } from "./how-it-works";
import { Stats } from "./stats";
import { Faq } from "./faq";
import { CallToAction, SiteFooter } from "./cta";

/** Thin accent bar at the very top that tracks page scroll progress. */
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-60 h-0.5 origin-left bg-[#ff4d00]"
    />
  );
}

export function LandingPage() {
  return (
    <div className="landing-root relative min-h-screen w-full overflow-x-clip bg-[#0a0a0c] px-3 pt-14 pb-3 text-[#e9e9ec] antialiased sm:px-4 sm:pb-4">
      <SmoothScroll />
      <AnimatedBackground />
      <GrainOverlay />
      <ScrollProgress />
      <SiteNav />

      {/* full-bleed bordered blueprint frame */}
      <main className="w-full border border-white/10">
        <Hero />
        <StackMarquee />
        <Comparison />
        <FeatureContext />
        <PipelinePanels />
        <HowItWorks />
        <FeaturesBento />
        <Stats />
        <Faq />
        <CallToAction />
        <SiteFooter />
      </main>
    </div>
  );
}
