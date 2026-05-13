"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

// Block dimensions
const BW = 36; // block width
const BH = 20; // block height
const CX = 130; // horizontal center of the 260-wide viewBox

// Block layout in build order (bottom → up → lateral)
// Each entry: [x, y, opacity]
const BLOCKS: [number, number, number][] = [
  // Foundation — center-bottom
  [CX - BW / 2, 192, 1.00],
  // Row 1 (3 wide) — just above foundation
  [CX - BW / 2, 162, 0.90],
  [CX - BW / 2 - BW - 10, 162, 0.85],
  [CX - BW / 2 + BW + 10, 162, 0.85],
  // Row 2 (3 wide) — next level
  [CX - BW / 2, 132, 0.75],
  [CX - BW / 2 - BW - 10, 132, 0.70],
  [CX - BW / 2 + BW + 10, 132, 0.70],
  // Row 3 (2 wide) — narrower
  [CX - BW / 2 - 23, 102, 0.58],
  [CX - BW / 2 + 23, 102, 0.58],
  // Top (1) — cap
  [CX - BW / 2, 72, 0.42],
  // Lateral side extensions
  [CX - BW / 2 - 2 * BW - 22, 162, 0.65],
  [CX - BW / 2 + 2 * BW + 22, 162, 0.65],
];

// Connecting lines: [x1, y1, x2, y2]
const LINES: [number, number, number, number][] = [
  // Left side extension → row 1 left block (horizontal connector)
  [CX - BW / 2 - BW - 10, 172, CX - BW / 2 - 2 * BW - 22 + BW, 172],
  // Right side extension → row 1 right block
  [CX - BW / 2 + BW + 10 + BW, 172, CX - BW / 2 + 2 * BW + 22, 172],
  // Row 2 center → Row 3 left (vertical hint)
  [CX, 132, CX - BW / 2 - 23 + BW / 2, 102 + BH],
  // Row 2 center → Row 3 right
  [CX, 132, CX - BW / 2 + 23 + BW / 2, 102 + BH],
];

const EASE_OUT: [number, number, number, number] = [0, 0, 0.2, 1];

interface Props {
  delay?: number;
}

export function TechnologiesHeroVisual({ delay = 0 }: Props) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px" });
  const shouldReduceMotion = useReducedMotion();

  const blockDelay = (i: number) =>
    shouldReduceMotion ? 0 : delay + i * 0.1;
  const lineDur = shouldReduceMotion ? 0.01 : 0.3;
  const lineDelay = (i: number) =>
    shouldReduceMotion ? 0 : delay + BLOCKS.length * 0.1 + 0.1 + i * 0.1;

  return (
    <svg
      ref={ref}
      viewBox="0 0 260 230"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full"
      aria-hidden="true"
    >
      {/* Blocks — scale in from 0 one by one, bottom up */}
      {BLOCKS.map(([x, y, opacity], i) => (
        <motion.rect
          key={i}
          x={x}
          y={y}
          width={BW}
          height={BH}
          rx={2}
          fill="var(--color-tech)"
          style={{ transformOrigin: "50% 50%", transformBox: "fill-box" }}
          initial={{ scale: 0, opacity: 0 }}
          animate={
            inView
              ? {
                  scale: 1,
                  opacity: shouldReduceMotion ? opacity : opacity,
                }
              : {}
          }
          transition={
            shouldReduceMotion
              ? { duration: 0.1, delay: 0 }
              : {
                  scale: {
                    type: "spring",
                    stiffness: 320,
                    damping: 22,
                    delay: blockDelay(i),
                  },
                  opacity: {
                    duration: 0.01,
                    delay: blockDelay(i),
                  },
                }
          }
        />
      ))}

      {/* Connecting lines — draw in after blocks settle */}
      {LINES.map(([x1, y1, x2, y2], i) => (
        <motion.line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="var(--color-tech)"
          strokeWidth="1"
          strokeOpacity={0.35}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={inView ? { pathLength: 1, opacity: 1 } : {}}
          transition={{
            pathLength: { duration: lineDur, delay: lineDelay(i), ease: EASE_OUT },
            opacity: { duration: 0.01, delay: lineDelay(i) },
          }}
        />
      ))}
    </svg>
  );
}
