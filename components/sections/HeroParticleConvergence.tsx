"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

// ── Seeded PRNG (LCG) — deterministic layout every page load ──────────────────
function makePrng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

// ── Logo path data (fill="#010101" from pg-ventures.svg, viewBox 0 0 1254 1254)
// Compound path: outer border square + Z-shape interior
const DARK_PATH =
  `M1060 128.353c15.983.005 31.466.005 47.366.005v829.107H151.221V128.348` +
  `c302.762 0 605.52 0 908.779.005` +
  `M342.082 302.511v-12.53h440.993c-2.06 1.971-3.416 3.337-4.843 4.623` +
  `-70.68 63.693-141.382 127.365-212 191.128-2.683 2.422-5.296 3.372-8.858 3.364` +
  `-39-.097-78-.043-116.999-.03h-5.487v222.478` +
  `c192.885-171.56 384.72-342.188 577.539-513.688H232.038v688.742` +
  `c1.341-1.108 2.11-1.707 2.839-2.35 34.35-30.318 68.667-60.673 103.095-90.902` +
  `c3.004-2.637 4.241-5.278 4.238-9.345-.123-160.164-.118-320.328-.128-481.49` +
  `M575.5 767.845H434.886v107.887h586.865V489.024h-5.265` +
  `c-73.167.007-146.333.045-219.5-.066-3.947-.006-6.807 1.087-9.723 3.707` +
  `-33.461 30.075-67.034 60.026-100.568 90.02-3.128 2.798-6.194 5.664-10.221 9.354` +
  `h237.39v175.806z`;

// White cutout 1 (layered over dark, creates the Z interior)
const LIGHT_PATH_1 =
  `M342.081 303.01c.011 160.663.006 320.827.129 480.991` +
  `.003 4.067-1.234 6.708-4.238 9.345-34.428 30.23-68.745 60.584-103.095 90.902` +
  `-.73.643-1.498 1.242-2.839 2.35V197.856h780.389L434.888 711.544V489.066h5.487` +
  `c39-.013 78-.067 116.999.03 3.562.008 6.175-.942 8.858-3.364` +
  `c70.618-63.763 141.32-127.435 212-191.128 1.427-1.286 2.782-2.652 4.843-4.623H342.082z`;

// White cutout 2 (lower Z bar interior)
const LIGHT_PATH_2 =
  `M576 767.845h337.863V592.039h-237.39c4.028-3.69 7.094-6.556 10.222-9.354` +
  `c33.534-29.994 67.107-59.945 100.568-90.02 2.916-2.62 5.776-3.713 9.724-3.707` +
  `c73.166.11 146.332.073 219.499.066h5.265v386.708H434.886V767.845z`;

// ── Z-shape only — used for destination sampling (not the outer border)
// Concentrates particle destinations inside the mark rather than on the perimeter
const DEST_PATH =
  `M342.082 302.511v-12.53h440.993c-2.06 1.971-3.416 3.337-4.843 4.623` +
  `-70.68 63.693-141.382 127.365-212 191.128-2.683 2.422-5.296 3.372-8.858 3.364` +
  `-39-.097-78-.043-116.999-.03h-5.487v222.478` +
  `c192.885-171.56 384.72-342.188 577.539-513.688H232.038v688.742` +
  `c1.341-1.108 2.11-1.707 2.839-2.35 34.35-30.318 68.667-60.673 103.095-90.902` +
  `c3.004-2.637 4.241-5.278 4.238-9.345-.123-160.164-.118-320.328-.128-481.49` +
  `M575.5 767.845H434.886v107.887h586.865V489.024h-5.265` +
  `c-73.167.007-146.333.045-219.5-.066-3.947-.006-6.807 1.087-9.723 3.707` +
  `-33.461 30.075-67.034 60.026-100.568 90.02-3.128 2.798-6.194 5.664-10.221 9.354` +
  `h237.39v175.806z`;

// ── Visual frame ──────────────────────────────────────────────────────────────
const VW = 320;
const VH = 280;
const N = 40; // particles total (20 blue + 20 green)

// Logo content bounds in 1254×1254 space (outer border square)
const L_MIN_X = 151, L_MIN_Y = 128;
const L_MAX_X = 1108, L_MAX_Y = 957;

// Uniform scale to fit logo into visual frame with padding
const PAD = 42;
const S = Math.min(
  (VW - 2 * PAD) / (L_MAX_X - L_MIN_X),
  (VH - 2 * PAD) / (L_MAX_Y - L_MIN_Y)
);
const LOGO_W = (L_MAX_X - L_MIN_X) * S;
const LOGO_H = (L_MAX_Y - L_MIN_Y) * S;

// Center the logo in the frame
const TX = PAD + (VW - 2 * PAD - LOGO_W) / 2 - L_MIN_X * S;
const TY = PAD + (VH - 2 * PAD - LOGO_H) / 2 - L_MIN_Y * S;

const LOGO_TRANSFORM = `translate(${TX.toFixed(3)}, ${TY.toFixed(3)}) scale(${S.toFixed(4)})`;

function logoToFrame(lx: number, ly: number) {
  return { x: TX + lx * S, y: TY + ly * S };
}

// ── Sample N points along the logo path (browser only) ────────────────────────
function sampleLogoPath(n: number): { x: number; y: number }[] {
  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("viewBox", "0 0 1254 1254");
  svg.style.cssText =
    "position:fixed;left:-9999px;top:-9999px;width:1px;height:1px;visibility:hidden;pointer-events:none";
  const path = document.createElementNS(ns, "path");
  path.setAttribute("d", DEST_PATH);
  svg.appendChild(path);
  document.body.appendChild(svg);

  const total = path.getTotalLength();
  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i < n; i++) {
    const p = path.getPointAtLength((i / n) * total);
    pts.push(logoToFrame(p.x, p.y));
  }
  document.body.removeChild(svg);
  return pts;
}

// ── Types ─────────────────────────────────────────────────────────────────────
type Phase = "idle" | "drift" | "converge" | "pulse" | "resolved";

interface Particle {
  id: number;
  color: "tech" | "consulting";
  r: number;
  alpha: number;
  ex: number; ey: number; // entry (off-frame)
  mx: number; my: number; // drift target (center cluster)
  dx: number; dy: number; // logo destination
  p1d: number;            // phase-1 stagger delay (s)
  p2d: number;            // phase-2 stagger delay (s)
}

const EASE_OUT: [number, number, number, number] = [0.25, 0.1, 0.25, 1];
const EASE_INOUT: [number, number, number, number] = [0.4, 0, 0.2, 1];

// ── Component ─────────────────────────────────────────────────────────────────
interface Props { delay?: number }

export function HeroParticleConvergence({ delay = 0 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, margin: "-80px" });
  const prefersReducedMotion = useReducedMotion();

  const [phase, setPhase] = useState<Phase>("idle");
  const [destPts, setDestPts] = useState<{ x: number; y: number }[] | null>(null);

  // Sample logo path points on mount (client only)
  useEffect(() => {
    setDestPts(sampleLogoPath(N));
  }, []);

  // Build particle array — deterministic, seeded, stable
  const baseParticles = useMemo<Particle[]>(() => {
    const rng = makePrng(0xc0ffee42);
    return Array.from({ length: N }, (_, i) => {
      const isBlue = i < N / 2;
      // Size: 1.5–3.0 radius (3–6px diameter) with slight normal-ish spread
      const r = 1.5 + rng() * 1.5;
      // Opacity: 60–100%
      const alpha = 0.60 + rng() * 0.40;

      // Entry from edges: blue upper-left, green lower-right
      let ex: number, ey: number;
      if (isBlue) {
        ex = -r + rng() * VW * 0.45;
        ey = -r + rng() * VH * 0.40;
      } else {
        ex = VW * 0.55 + rng() * (VW * 0.45 + r);
        ey = VH * 0.60 + rng() * (VH * 0.40 + r);
      }

      // Drift target: tight cluster around the logo center (~160, 138 in frame coords)
      const mx = 120 + rng() * 80;
      const my = 90 + rng() * 90;

      // Stagger delays — wider p2d makes logo "fill in" more visibly
      const p1d = delay + rng() * 0.40;
      const p2d = rng() * 0.25;

      return { id: i, color: isBlue ? "tech" : "consulting", r, alpha, ex, ey, mx, my, dx: 0, dy: 0, p1d, p2d };
    });
  }, [delay]);

  // Merge destination points once sampled
  const particles = useMemo<Particle[]>(() => {
    if (!destPts) return baseParticles;
    return baseParticles.map((p, i) => ({
      ...p,
      dx: destPts[i]?.x ?? VW / 2,
      dy: destPts[i]?.y ?? VH / 2,
    }));
  }, [baseParticles, destPts]);

  // Phase state machine — starts when inView + destPts ready
  useEffect(() => {
    if (!inView || !destPts) return;

    if (prefersReducedMotion) {
      setPhase("resolved");
      return;
    }

    setPhase("drift");
    const t1 = setTimeout(() => setPhase("converge"), 1200);
    const t2 = setTimeout(() => setPhase("pulse"),    2900);
    const t3 = setTimeout(() => setPhase("resolved"), 3200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [inView, destPts, prefersReducedMotion]);

  const isResolved = phase === "resolved";

  return (
    <div ref={containerRef} className="relative w-full" style={{ aspectRatio: `${VW}/${VH}` }}>
      <svg
        viewBox={`0 0 ${VW} ${VH}`}
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
      >
        {/* ── Particles ── */}
        {particles.map((p) => {
          const isDrift    = phase === "drift";
          const isConverge = phase === "converge";
          const isPulse    = phase === "pulse";
          const visible    = phase !== "idle" && !isResolved;

          // Target position per phase
          const tx = isDrift ? p.mx : (isConverge || isPulse || isResolved) ? p.dx : p.ex;
          const ty = isDrift ? p.my : (isConverge || isPulse || isResolved) ? p.dy : p.ey;

          return (
            <motion.circle
              key={p.id}
              cx={0}
              cy={0}
              r={p.r}
              fill={`var(--color-${p.color})`}
              style={{ transformOrigin: "0px 0px" }}
              initial={{ x: p.ex, y: p.ey, opacity: 0, scale: 1 }}
              animate={
                visible
                  ? {
                      x: tx,
                      y: ty,
                      opacity: p.alpha,
                      scale: isPulse ? [1, 1.15, 1] : 1,
                    }
                  : { opacity: 0 }
              }
              transition={
                isDrift
                  ? {
                      x: { duration: 1.05, delay: p.p1d, ease: EASE_OUT },
                      y: { duration: 1.05, delay: p.p1d, ease: EASE_OUT },
                      opacity: { duration: 0.30, delay: p.p1d },
                      scale: { duration: 0 },
                    }
                  : isConverge
                  ? {
                      x: { duration: 1.50, delay: p.p2d, ease: EASE_INOUT },
                      y: { duration: 1.50, delay: p.p2d, ease: EASE_INOUT },
                      opacity: { duration: 0.01 },
                      scale: { duration: 0 },
                    }
                  : isPulse
                  ? {
                      scale: { duration: 0.22, ease: EASE_INOUT },
                      x: { duration: 0 },
                      y: { duration: 0 },
                      opacity: { duration: 0 },
                    }
                  : {
                      opacity: { duration: 0.5 },
                      x: { duration: 0 },
                      y: { duration: 0 },
                      scale: { duration: 0 },
                    }
              }
            />
          );
        })}

        {/* ── Logo (inline paths, fades in on resolve) ── */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: isResolved ? 1 : 0 }}
          transition={{ duration: prefersReducedMotion ? 0.6 : 0.40, ease: EASE_INOUT }}
        >
          <g transform={LOGO_TRANSFORM}>
            {/* Dark fill — the Z-within-square mark */}
            <path d={DARK_PATH} fill="var(--foreground)" />
            {/* Light cutouts layered on top */}
            <path d={LIGHT_PATH_1} fill="var(--background)" />
            <path d={LIGHT_PATH_2} fill="var(--background)" />
          </g>
        </motion.g>
      </svg>
    </div>
  );
}
