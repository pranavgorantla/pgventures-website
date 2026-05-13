"use client";

import { motion, AnimatePresence } from "framer-motion";
import { type LogoVariant } from "@/lib/constants";

const LOGOS: Record<LogoVariant, { src: string; alt: string; aspectRatio: string }> = {
  ventures: {
    src: "/logos/pg-ventures.svg",
    alt: "PG Ventures",
    aspectRatio: "1 / 1",
  },
  technologies: {
    src: "/logos/pg-technologies.svg",
    alt: "PG Technologies",
    aspectRatio: "2 / 3",
  },
  consulting: {
    src: "/logos/pg-consulting.svg",
    alt: "PG Consulting",
    aspectRatio: "2 / 3",
  },
};

interface LogoProps {
  variant: LogoVariant;
  className?: string;
  /** Numeric height in px — used when you need a fixed size (e.g. footer).
   *  Omit and use `className` (e.g. "h-9 md:h-10") for responsive sizing. */
  height?: number;
}

export function Logo({ variant, className, height }: LogoProps) {
  const logo = LOGOS[variant];

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={variant}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className={className}
        style={height !== undefined ? { height } : undefined}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logo.src}
          alt={logo.alt}
          height={height}
          className="h-full w-auto dark:invert"
          style={{ aspectRatio: logo.aspectRatio }}
        />
      </motion.div>
    </AnimatePresence>
  );
}
