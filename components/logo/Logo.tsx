"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { type LogoVariant } from "@/lib/constants";

const LOGOS: Record<LogoVariant, { src: string; alt: string; aspectRatio: string }> = {
  ventures: {
    src: "/logos/pg-ventures.svg",
    alt: "PG Ventures",
    aspectRatio: "997 / 869",
  },
  technologies: {
    src: "/logos/pg-technologies.svg",
    alt: "PG Technologies",
    aspectRatio: "567 / 530",
  },
  consulting: {
    src: "/logos/pg-consulting.svg",
    alt: "PG Consulting",
    aspectRatio: "569 / 511",
  },
};

const WORDMARKS: Record<LogoVariant, string> = {
  ventures: "PG VENTURES",
  technologies: "PG TECHNOLOGIES",
  consulting: "PG CONSULTING",
};

interface LogoProps {
  variant: LogoVariant;
  className?: string;
  /** Numeric height in px — used when you need a fixed size (e.g. footer).
   *  Omit and use `className` (e.g. "h-9 md:h-11") for responsive sizing. */
  height?: number;
}

export function Logo({ variant, className, height }: LogoProps) {
  const logo = LOGOS[variant];
  const wordmark = WORDMARKS[variant];

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={variant}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className={cn("flex items-center gap-2.5 md:gap-3", className)}
        style={height !== undefined ? { height } : undefined}
      >
        {/* Icon mark */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logo.src}
          alt={logo.alt}
          className="h-full w-auto flex-shrink-0 dark:invert"
          style={{ aspectRatio: logo.aspectRatio }}
        />
        {/* Division wordmark — visually coupled to icon, part of accessible link name */}
        <span
          className="text-[11px] sm:text-[13px] font-medium uppercase tracking-[0.09em] text-[var(--foreground)] leading-none whitespace-nowrap select-none"
          aria-hidden="true"
        >
          {wordmark}
        </span>
      </motion.div>
    </AnimatePresence>
  );
}
