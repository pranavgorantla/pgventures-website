"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { HeroParticleConvergence } from "@/components/sections/HeroParticleConvergence";

const EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

export function HomeHero() {
  const shouldReduceMotion = useReducedMotion();

  // Shared factory for entrance transitions — keeps timing in one place
  function enter(delay: number, duration = 0.6) {
    return {
      initial: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 14 },
      animate: { opacity: 1, y: 0 },
      transition: {
        duration: shouldReduceMotion ? 0.1 : duration,
        delay: shouldReduceMotion ? 0 : delay,
        ease: EASE,
      },
    };
  }

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 pt-16 pb-24"
      aria-label="Hero"
    >
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage:
            "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse 80% 70% at 50% 50%, black 40%, transparent 100%)",
          opacity: 0.4,
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div className="text-center md:text-left">
          {/* Headline — each word slides up independently */}
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-semibold tracking-tight leading-none mb-6">
            <span className="inline-flex flex-wrap gap-x-[0.25em] justify-center md:justify-start items-baseline">
              {/* "Build" — 0ms */}
              <motion.span className="inline-block" {...enter(0)}>
                <AccentWord word="Build" color="tech" underlineDelay={0.6} />
              </motion.span>
              {/* "Deliver" — 120ms */}
              <motion.span className="inline-block" {...enter(0.12)}>
                <AccentWord word="Deliver" color="consulting" underlineDelay={0.7} />
              </motion.span>
              {/* "Scale." — 240ms */}
              <motion.span className="inline-block" {...enter(0.24)}>
                Scale.
              </motion.span>
            </span>
          </h1>

          {/* Subtext — 900ms */}
          <motion.div {...enter(0.9, 0.5)}>
            <p className="text-xl sm:text-2xl text-[var(--muted-fg)] font-normal mb-4 tracking-tight">
              Two specialized arms. One integrated approach.
            </p>
            <p className="text-base sm:text-lg text-[var(--muted-fg)] max-w-2xl mx-auto lg:mx-0 mb-10 leading-relaxed">
              We design, build, and implement systems that help businesses operate
              smarter, faster, and at scale.
            </p>
          </motion.div>

          {/* CTAs — 1200ms */}
          <motion.div {...enter(1.2, 0.4)} className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
            <Button href="#divisions" size="lg" variant="primary">
              Explore the Venture
            </Button>
            <Button href="/contact" size="lg" variant="secondary">
              Work With Us
            </Button>
          </motion.div>

          {/* Mobile visual — stacks below CTAs, hidden on md+ */}
          <motion.div {...enter(1.4, 0.5)} className="md:hidden mt-12 flex justify-center">
            <div className="w-full max-w-[280px]">
              <HeroParticleConvergence delay={0.5} />
            </div>
          </motion.div>
        </div>

        {/* Desktop/tablet visual — hidden on mobile */}
        <div className="hidden md:flex items-center justify-center">
          <HeroParticleConvergence />
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          aria-hidden="true"
        >
          <motion.div
            animate={shouldReduceMotion ? {} : { y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="w-5 h-5 text-[var(--muted-fg)]"
          >
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 4v12m0 0l-4-4m4 4l4-4" />
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function AccentWord({
  word,
  color,
  underlineDelay,
}: {
  word: string;
  color: "tech" | "consulting";
  underlineDelay: number;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.span
      className="relative inline-block"
      whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
      transition={{ duration: 0.15 }}
    >
      {word}
      {/* Underline draws left-to-right after the word appears */}
      <motion.span
        className={`absolute left-0 right-0 bottom-0 h-[3px] rounded-full ${
          color === "tech" ? "bg-tech" : "bg-consulting"
        }`}
        initial={shouldReduceMotion ? { scaleX: 0.6, opacity: 0.5 } : { scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{
          duration: shouldReduceMotion ? 0.1 : 0.4,
          delay: shouldReduceMotion ? 0 : underlineDelay,
          ease: EASE,
        }}
        style={{ originX: 0 }}
        aria-hidden="true"
      />
    </motion.span>
  );
}
