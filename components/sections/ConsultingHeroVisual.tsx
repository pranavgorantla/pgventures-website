"use client";

import { useEffect, useRef } from "react";
import { motion, useAnimation, useInView, useReducedMotion } from "framer-motion";

// Final (aligned) state: x=0, width=220, consistent for all bars
const FINAL_W = 220;

// Bar data: initial chaotic x offset and width, plus opacity (top=60% → bottom=100%)
const BARS = [
  { initX: 42, initW: 148, opacity: 0.60 },
  { initX:  6, initW: 200, opacity: 0.68 },
  { initX: 52, initW: 132, opacity: 0.75 },
  { initX: 14, initW: 192, opacity: 0.82 },
  { initX: 38, initW: 168, opacity: 0.88 },
  { initX:  4, initW: 208, opacity: 0.94 },
  { initX: 30, initW: 156, opacity: 1.00 },
];

const BAR_H = 14;
const BAR_GAP = 16;
const START_Y = 14;

const EASE_OUT: [number, number, number, number] = [0, 0, 0.2, 1];

interface Props {
  delay?: number;
}

export function ConsultingHeroVisual({ delay = 0 }: Props) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px" });
  const shouldReduceMotion = useReducedMotion();
  const controls = useAnimation();

  useEffect(() => {
    if (!inView) return;

    if (shouldReduceMotion) {
      // Immediately show aligned state
      controls.start((i) => ({
        opacity: BARS[i].opacity,
        x: 0,
        width: FINAL_W,
        transition: { duration: 0.1 },
      }));
      return;
    }

    async function sequence() {
      // Phase 1: fade bars in at chaotic positions
      await controls.start((i) => ({
        opacity: BARS[i].opacity,
        transition: {
          duration: 0.4,
          delay: delay + i * 0.05,
          ease: EASE_OUT,
        },
      }));

      // Phase 2: pause ~300ms so chaos registers
      await new Promise<void>((r) => setTimeout(r, 300));

      // Phase 3: snap to aligned state, top-to-bottom stagger
      controls.start((i) => ({
        x: 0,
        width: FINAL_W,
        transition: {
          duration: 0.6,
          delay: i * 0.08,
          ease: EASE_OUT,
        },
      }));
    }

    sequence();
  }, [inView, shouldReduceMotion]); // eslint-disable-line react-hooks/exhaustive-deps

  const totalH = START_Y + BARS.length * BAR_H + (BARS.length - 1) * BAR_GAP + START_Y;

  return (
    <svg
      ref={ref}
      viewBox={`0 0 260 ${totalH}`}
      xmlns="http://www.w3.org/2000/svg"
      className="w-full"
      aria-hidden="true"
    >
      {BARS.map((bar, i) => {
        const y = START_Y + i * (BAR_H + BAR_GAP);
        return (
          <motion.rect
            key={i}
            custom={i}
            y={y}
            height={BAR_H}
            rx={2}
            fill="var(--color-consulting)"
            // Initial chaotic state
            initial={{
              opacity: 0,
              x: bar.initX,
              width: bar.initW,
            }}
            animate={controls}
          />
        );
      })}
    </svg>
  );
}
