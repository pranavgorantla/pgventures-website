"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/Button";

const EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

export function HomeHero() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 pt-16 pb-24"
      aria-label="Hero"
    >
      {/* Grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage:
            "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(ellipse 80% 70% at 50% 50%, black 40%, transparent 100%)",
          opacity: 0.4,
        }}
      />

      {/* Content — all elements fade in together */}
      <motion.div
        className="relative z-10 max-w-5xl mx-auto w-full flex flex-col items-center text-center"
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.7, ease: EASE }}
      >
        <h1 className="font-semibold tracking-tight leading-none mb-8 text-5xl sm:text-6xl md:text-7xl lg:text-8xl">
          <span className="inline-flex flex-wrap gap-x-[0.2em] justify-center items-baseline">
            <AccentWord word="Build." color="tech"       shouldReduceMotion={!!shouldReduceMotion} />
            <AccentWord word="Deliver." color="consulting" shouldReduceMotion={!!shouldReduceMotion} />
            <span>Scale.</span>
          </span>
        </h1>

        <p className="text-xl sm:text-2xl text-[var(--muted-fg)] font-normal mb-5 tracking-tight">
          Two specialized arms. One integrated approach.
        </p>

        <p className="text-base sm:text-lg text-[var(--muted-fg)] max-w-xl mb-12 leading-relaxed">
          We design, build, and implement systems that help businesses operate
          smarter, faster, and at scale.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button href="#divisions" size="lg" variant="primary">
            Explore the Venture
          </Button>
          <Button href="/contact" size="lg" variant="secondary">
            Work With Us
          </Button>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: shouldReduceMotion ? 0 : 0.8, duration: 0.6 }}
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
    </section>
  );
}

// Underline draws left-to-right after the global fade settles (~750ms)
function AccentWord({
  word,
  color,
  shouldReduceMotion,
}: {
  word: string;
  color: "tech" | "consulting";
  shouldReduceMotion: boolean;
}) {
  return (
    <span className="relative inline-block">
      {word}
      <motion.span
        className={`absolute left-0 right-0 -bottom-1 h-[3px] rounded-full ${
          color === "tech" ? "bg-tech" : "bg-consulting"
        }`}
        initial={shouldReduceMotion ? { scaleX: 0.6, opacity: 0.5 } : { scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{
          duration: shouldReduceMotion ? 0.1 : 0.45,
          delay:    shouldReduceMotion ? 0 : 0.75,
          ease: EASE,
        }}
        style={{ originX: 0 }}
        aria-hidden="true"
      />
    </span>
  );
}
