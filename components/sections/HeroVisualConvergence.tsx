"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

// Convergence point — golden-ratio sweet spot within the 320×280 frame
const CX = 198;
const CY = 112;

// Tech (blue) path: upper-left → convergence
const TECH_PATH = `M 14 26 C 72 10 152 68 ${CX} ${CY}`;
// Consulting (green) path: lower-right → convergence
const CONSULT_PATH = `M 306 254 C 268 272 238 196 ${CX} ${CY}`;

const EASE_OUT: [number, number, number, number] = [0, 0, 0.2, 1];

interface Props {
  /** Extra delay in seconds (used for the mobile-stacked version) */
  delay?: number;
}

export function HeroVisualConvergence({ delay = 0 }: Props) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px" });
  const shouldReduceMotion = useReducedMotion();

  // Reduced-motion: everything appears instantly via opacity only
  if (shouldReduceMotion) {
    return (
      <svg
        ref={ref}
        viewBox="0 0 320 280"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full"
        aria-hidden="true"
      >
        <path d={TECH_PATH} stroke="var(--color-tech)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d={CONSULT_PATH} stroke="var(--color-consulting)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <rect
          x={CX - 5} y={CY - 5} width={10} height={10}
          fill="var(--foreground)"
        />
      </svg>
    );
  }

  const pathDur = 1.0;
  const squareDelay = delay + 0.88; // arrives as paths finish

  return (
    <svg
      ref={ref}
      viewBox="0 0 320 280"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full"
      aria-hidden="true"
    >
      {/* Tech path: upper-left → convergence */}
      <motion.path
        d={TECH_PATH}
        stroke="var(--color-tech)"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={inView ? { pathLength: 1, opacity: 1 } : {}}
        transition={{
          pathLength: { duration: pathDur, delay, ease: EASE_OUT },
          opacity: { duration: 0.01, delay },
        }}
      />

      {/* Consulting path: lower-right → convergence */}
      <motion.path
        d={CONSULT_PATH}
        stroke="var(--color-consulting)"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={inView ? { pathLength: 1, opacity: 1 } : {}}
        transition={{
          pathLength: { duration: pathDur, delay, ease: EASE_OUT },
          opacity: { duration: 0.01, delay },
        }}
      />

      {/* Convergence square — scale-in with overshoot as paths land */}
      <motion.rect
        x={CX - 5}
        y={CY - 5}
        width={10}
        height={10}
        fill="var(--foreground)"
        style={{ transformOrigin: "50% 50%", transformBox: "fill-box" }}
        initial={{ scale: 0, opacity: 0 }}
        animate={inView ? { scale: [0, 1.2, 1], opacity: 1 } : {}}
        transition={{
          scale: {
            duration: 0.45,
            delay: squareDelay,
            times: [0, 0.6, 1],
            ease: ["easeOut", "easeIn"],
          },
          opacity: { duration: 0.05, delay: squareDelay },
        }}
      />
    </svg>
  );
}
