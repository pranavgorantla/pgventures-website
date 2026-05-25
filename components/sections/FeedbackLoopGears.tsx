"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { FadeIn } from "@/components/motion/FadeIn";

// ── Gear geometry ──────────────────────────────────────────────────────────────
// Module m=10: pitch_r = N*m/2, addendum=10, dedendum=10
// G1 (consulting, 12 teeth): pitch=60, outer=70, root=50
// G2 (tech, 8 teeth):        pitch=40, outer=50, root=30
// Center distance: 60+40=100 → correctly meshing
const G1 = { cx: 90,  cy: 112, N: 12, rOuter: 70, rRoot: 50, rHub: 14, rRing: 57 };
const G2 = { cx: 190, cy: 112, N: 8,  rOuter: 50, rRoot: 30, rHub: 10, rRing: 40 };

const G1_OFFSET = Math.PI / G1.N;
const G2_OFFSET = Math.PI / G2.N;

/** Spur-gear SVG path with bold 0.48-ratio teeth */
function gearPath(
  cx: number, cy: number,
  N: number, rOuter: number, rRoot: number,
  offset: number,
): string {
  const pts: string[] = [];
  const pitch     = (2 * Math.PI) / N;
  const toothHalf = pitch * 0.48;

  for (let i = 0; i < N; i++) {
    const tc        = (i / N) * 2 * Math.PI + offset;
    const gapStart  = tc - pitch / 2;
    const rootLeft  = tc - toothHalf;
    const rootRight = tc + toothHalf;
    const p = (r: number, a: number) =>
      `${(cx + r * Math.cos(a)).toFixed(2)} ${(cy + r * Math.sin(a)).toFixed(2)}`;

    pts.push(i === 0 ? `M ${p(rRoot, gapStart)}` : `L ${p(rRoot, gapStart)}`);
    pts.push(`L ${p(rRoot, rootLeft)} L ${p(rOuter, rootLeft)}`);
    pts.push(`L ${p(rOuter, rootRight)} L ${p(rRoot, rootRight)}`);
  }
  pts.push("Z");
  return pts.join(" ");
}

/** 4 spoke endpoints */
function spokeLines(cx: number, cy: number, rHub: number, rRing: number) {
  return Array.from({ length: 4 }, (_, i) => {
    const a = (i / 4) * Math.PI * 2;
    return { x1: cx + rHub * Math.cos(a), y1: cy + rHub * Math.sin(a),
             x2: cx + rRing * Math.cos(a), y2: cy + rRing * Math.sin(a) };
  });
}

// ── Animation phases ───────────────────────────────────────────────────────────
type Phase = "idle" | "enter" | "rotate" | "labels";
const EASE_OUT:   [number, number, number, number] = [0, 0, 0.2, 1];
const EASE_INOUT: [number, number, number, number] = [0.4, 0, 0.2, 1];

// ── Component ──────────────────────────────────────────────────────────────────
export function FeedbackLoopGears() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const shouldReduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("idle");

  useEffect(() => {
    if (!inView) return;
    if (shouldReduceMotion) { setPhase("labels"); return; }
    setPhase("enter");
    const t1 = setTimeout(() => setPhase("rotate"), 800);
    const t2 = setTimeout(() => setPhase("labels"), 2900);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [inView, shouldReduceMotion]);

  const gear1Path   = useMemo(() => gearPath(G1.cx, G1.cy, G1.N, G1.rOuter, G1.rRoot, G1_OFFSET), []);
  const gear2Path   = useMemo(() => gearPath(G2.cx, G2.cy, G2.N, G2.rOuter, G2.rRoot, G2_OFFSET), []);
  const gear1Spokes = useMemo(() => spokeLines(G1.cx, G1.cy, G1.rHub, G1.rRing), []);
  const gear2Spokes = useMemo(() => spokeLines(G2.cx, G2.cy, G2.rHub, G2.rRing), []);

  const isEntered  = phase !== "idle";
  const isRotating = phase === "rotate" || phase === "labels";
  const showLabels = phase === "labels";

  return (
    <section
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32"
      aria-label="The feedback loop"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        <FadeIn>
          <p className="text-xs font-medium uppercase tracking-widest text-[var(--muted-fg)] mb-4">
            The difference
          </p>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-6">
            One venture.{" "}
            <span className="text-[var(--muted-fg)]">One feedback loop.</span>
          </h2>
          <p className="text-[var(--muted-fg)] leading-relaxed text-lg mb-6">
            Consulting work surfaces real business problems. Those problems inform
            what Technologies builds. Those products feed back into better
            Consulting outcomes.
          </p>
          <p className="text-[var(--muted-fg)] leading-relaxed">
            The two arms aren&apos;t separate businesses — they&apos;re a feedback loop.
            What we learn in the field shapes what we build. What we build makes
            us better in the field.
          </p>
        </FadeIn>

        <FadeIn delay={0.15}>
          <div ref={ref} className="flex flex-col items-center gap-5">
            <svg
              viewBox="0 0 280 210"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full max-w-xs"
              aria-hidden="true"
            >
              {/* ── Gear 1: Consulting (green) ── */}
              <motion.g
                initial={shouldReduceMotion ? { opacity: 1 } : { x: -36, opacity: 0 }}
                animate={isEntered ? { x: 0, opacity: 1 } : {}}
                transition={{ duration: 0.55, ease: EASE_OUT }}
              >
                <motion.g
                  style={{ transformOrigin: `${G1.cx}px ${G1.cy}px` }}
                  animate={isRotating ? { rotate: 360 } : { rotate: 0 }}
                  transition={isRotating ? { duration: 2.0, ease: EASE_INOUT } : { duration: 0 }}
                >
                  {/* Gear body — filled at 9% + 2.5px stroke */}
                  <path
                    d={gear1Path}
                    stroke="var(--color-consulting)"
                    strokeWidth={2.5}
                    fill="var(--color-consulting)"
                    fillOpacity={0.09}
                    strokeLinejoin="round"
                  />
                  {/* Deliberate inner structural ring */}
                  <circle
                    cx={G1.cx} cy={G1.cy} r={G1.rRing}
                    stroke="var(--color-consulting)"
                    strokeWidth={1.5}
                    fill="none"
                    opacity={0.55}
                  />
                  {/* Spokes — background-colored to read as cutouts through fill */}
                  {gear1Spokes.map((s, i) => (
                    <line
                      key={i}
                      x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2}
                      stroke="var(--background)"
                      strokeWidth={1.8}
                      strokeLinecap="round"
                    />
                  ))}
                  {/* Hub — solid fill */}
                  <circle cx={G1.cx} cy={G1.cy} r={G1.rHub} fill="var(--color-consulting)" />
                </motion.g>
              </motion.g>

              {/* ── Gear 2: Technologies (blue) ── */}
              <motion.g
                initial={shouldReduceMotion ? { opacity: 1 } : { x: 36, opacity: 0 }}
                animate={isEntered ? { x: 0, opacity: 1 } : {}}
                transition={{ duration: 0.55, delay: shouldReduceMotion ? 0 : 0.18, ease: EASE_OUT }}
              >
                <motion.g
                  style={{ transformOrigin: `${G2.cx}px ${G2.cy}px` }}
                  animate={isRotating ? { rotate: -540 } : { rotate: 0 }}
                  transition={isRotating ? { duration: 2.0, ease: EASE_INOUT } : { duration: 0 }}
                >
                  <path
                    d={gear2Path}
                    stroke="var(--color-tech)"
                    strokeWidth={2.5}
                    fill="var(--color-tech)"
                    fillOpacity={0.09}
                    strokeLinejoin="round"
                  />
                  <circle
                    cx={G2.cx} cy={G2.cy} r={G2.rRing}
                    stroke="var(--color-tech)"
                    strokeWidth={1.5}
                    fill="none"
                    opacity={0.55}
                  />
                  {gear2Spokes.map((s, i) => (
                    <line
                      key={i}
                      x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2}
                      stroke="var(--background)"
                      strokeWidth={1.8}
                      strokeLinecap="round"
                    />
                  ))}
                  <circle cx={G2.cx} cy={G2.cy} r={G2.rHub} fill="var(--color-tech)" />
                </motion.g>
              </motion.g>
            </svg>

            <div className="flex gap-24 sm:gap-32">
              <motion.p
                className="text-xs font-medium uppercase tracking-widest text-consulting text-center"
                initial={{ opacity: 0 }}
                animate={showLabels ? { opacity: 1 } : {}}
                transition={{ duration: 0.3 }}
              >
                Consulting
              </motion.p>
              <motion.p
                className="text-xs font-medium uppercase tracking-widest text-tech text-center"
                initial={{ opacity: 0 }}
                animate={showLabels ? { opacity: 1 } : {}}
                transition={{ duration: 0.3, delay: shouldReduceMotion ? 0 : 0.12 }}
              >
                Technologies
              </motion.p>
            </div>

            <motion.p
              className="text-xs text-[var(--muted-fg)] text-center"
              initial={{ opacity: 0 }}
              animate={showLabels ? { opacity: 1 } : {}}
              transition={{ duration: 0.3, delay: shouldReduceMotion ? 0 : 0.25 }}
            >
              Each turn of one drives the other.
            </motion.p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
