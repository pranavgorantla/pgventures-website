"use client";

import { useRef, useState, useMemo, useEffect } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

// ── Canvas ─────────────────────────────────────────────────────────────────────
const VW = 320;
const VH = 280;

// ── Seeded PRNG (LCG) — deterministic layout every page load ──────────────────
function makePrng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

// ── Logo anchor — true center ──────────────────────────────────────────────────
const LOGO_POS = { x: 160, y: 140 } as const;

// ── Phase timings (ms after inView fires) — slaved to headline reveals ─────────
// Build fully visible ~600ms / Deliver+underline ~1100ms / Subtext ~1400ms / CTAs ~1600ms
const T_COMPOSE  = 700;   // drift → compose  (after "Build" settles)
const T_DRAW     = 1500;  // compose → draw   (after "Deliver" underline + "Scale" settle)
const T_PULSE    = 2200;  // draw → pulse     (scale beat settled, single punctuation beat)
const T_RESOLVED = 2500;  // pulse → resolved (fully static)

// ── Particle positions ─────────────────────────────────────────────────────────
// Circular tendency around centered logo, density gradient (denser inner),
// rectilinear bias echoing Z-in-square logo geometry, intentional asymmetry.
interface ParticlePos {
  x: number;
  y: number;
  color: "tech" | "consulting";
  scalePhase?: boolean; // fades in during Scale beat only
}

const PARTICLE_POS: ReadonlyArray<ParticlePos> = [
  // ── Inner cluster (r ≈ 25–52px from center 160,140) ──────────────────────────
  { x: 125, y: 108, color: "tech" },
  { x: 158, y: 100, color: "tech" },
  { x: 196, y: 112, color: "tech" },        // crossover blue (upper-right)
  { x: 118, y: 142, color: "tech" },
  { x: 208, y: 144, color: "consulting" },
  { x: 132, y: 172, color: "consulting" },
  { x: 168, y: 180, color: "consulting" },
  { x: 202, y: 170, color: "consulting" },

  // ── Mid ring (r ≈ 60–90px) ────────────────────────────────────────────────────
  { x: 86,  y: 90,  color: "tech" },
  { x: 112, y: 78,  color: "tech" },        // added — upper-left density
  { x: 138, y: 65,  color: "tech" },
  { x: 188, y: 62,  color: "tech" },        // crossover blue
  { x: 215, y: 72,  color: "tech" },        // crossover blue
  { x: 72,  y: 150, color: "tech" },
  { x: 82,  y: 105, color: "tech" },
  { x: 244, y: 118, color: "consulting" },  // crossover green
  { x: 245, y: 160, color: "consulting" },
  { x: 228, y: 196, color: "consulting" },
  { x: 175, y: 224, color: "consulting" },
  { x: 125, y: 218, color: "consulting" },  // crossover green
  { x: 92,  y: 190, color: "consulting" },  // crossover green
  { x: 245, y: 148, color: "consulting" },
  { x: 140, y: 228, color: "consulting" },  // crossover green

  // ── Outer ring (r ≈ 95–125px) ─────────────────────────────────────────────────
  { x: 45,  y: 108, color: "tech" },
  { x: 105, y: 45,  color: "tech" },
  { x: 262, y: 78,  color: "tech" },        // crossover blue
  { x: 72,  y: 60,  color: "tech" },
  { x: 268, y: 195, color: "consulting" },
  { x: 185, y: 255, color: "consulting" },
  { x: 55,  y: 205, color: "consulting" },  // crossover green

  // ── Far outliers (r ≈ 130–160px) — prevent composition reading as closed shape
  { x: 35,  y: 55,  color: "tech" },        // added — upper-left density
  { x: 50,  y: 32,  color: "tech" },        // added — upper-left near top edge
  { x: 22,  y: 75,  color: "tech" },
  { x: 18,  y: 195, color: "consulting" },  // added — left-edge near lower-left (underrepresented)
  { x: 298, y: 215, color: "consulting" },
  { x: 172, y: 268, color: "consulting" },

  // ── Scale-phase additions — fade in during Scale beat, extend apparent boundary
  { x: 8,   y: 140, color: "tech",       scalePhase: true },
  { x: 312, y: 138, color: "consulting", scalePhase: true },
  { x: 165, y: 6,   color: "tech",       scalePhase: true },
];

const N = PARTICLE_POS.length; // 35

// ── Pre-compute network connections at module load ────────────────────────────
const MAX_CONN_DIST = 85;

interface Connection {
  x1: number; y1: number;
  x2: number; y2: number;
  isLogoConn: boolean;
  drawDelay: number;
}

function buildConnections(): Connection[] {
  const all = [...PARTICLE_POS.map(p => ({ x: p.x, y: p.y })), LOGO_POS];
  const logoIdx = N;
  const seen = new Set<string>();
  const raw: { a: number; b: number; isLogoConn: boolean }[] = [];

  for (let i = 0; i <= N; i++) {
    const ni = all[i];
    const neighbors: { j: number; dist: number }[] = [];
    for (let j = 0; j <= N; j++) {
      if (i === j) continue;
      const nj = all[j];
      const d = Math.hypot(ni.x - nj.x, ni.y - nj.y);
      if (d <= MAX_CONN_DIST) neighbors.push({ j, dist: d });
    }
    neighbors.sort((a, b) => a.dist - b.dist);
    // Logo gets 5 connections; other nodes max 2 — keeps network readable, not cluttered
    const maxK = i === logoIdx ? 5 : 2;
    for (let k = 0; k < Math.min(maxK, neighbors.length); k++) {
      const j = neighbors[k].j;
      const key = `${Math.min(i, j)}-${Math.max(i, j)}`;
      if (!seen.has(key)) {
        seen.add(key);
        raw.push({ a: i, b: j, isLogoConn: i === logoIdx || j === logoIdx });
      }
    }
  }

  // Logo connections draw first; others ordered by proximity to logo
  const logoConns = raw.filter(c => c.isLogoConn);
  const others = raw.filter(c => !c.isLogoConn).sort((ca, cb) => {
    const da = Math.min(
      Math.hypot(all[ca.a].x - LOGO_POS.x, all[ca.a].y - LOGO_POS.y),
      Math.hypot(all[ca.b].x - LOGO_POS.x, all[ca.b].y - LOGO_POS.y),
    );
    const db = Math.min(
      Math.hypot(all[cb.a].x - LOGO_POS.x, all[cb.a].y - LOGO_POS.y),
      Math.hypot(all[cb.b].x - LOGO_POS.x, all[cb.b].y - LOGO_POS.y),
    );
    return da - db;
  });

  return [...logoConns, ...others].map((c, idx) => ({
    x1: all[c.a].x, y1: all[c.a].y,
    x2: all[c.b].x, y2: all[c.b].y,
    isLogoConn: c.isLogoConn,
    drawDelay: idx * 0.040,
  }));
}

const CONNECTIONS = buildConnections();

// ── Logo node paths — scaled to 64px wide (viewBox units → ~115px at 1440px desktop)
// Original path space: mark bounds x=151–1108, y=128–957 (center 629.5, 542.5, width 957)
const S_LN   = 64 / 957;
const TX_LN  = LOGO_POS.x - 629.5 * S_LN;
const TY_LN  = LOGO_POS.y - 542.5 * S_LN;
const LOGO_NODE_TRANSFORM = `translate(${TX_LN.toFixed(3)},${TY_LN.toFixed(3)}) scale(${S_LN.toFixed(5)})`;

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

const LIGHT_PATH_1 =
  `M342.081 303.01c.011 160.663.006 320.827.129 480.991` +
  `.003 4.067-1.234 6.708-4.238 9.345-34.428 30.23-68.745 60.584-103.095 90.902` +
  `-.73.643-1.498 1.242-2.839 2.35V197.856h780.389L434.888 711.544V489.066h5.487` +
  `c39-.013 78-.067 116.999.03 3.562.008 6.175-.942 8.858-3.364` +
  `c70.618-63.763 141.32-127.435 212-191.128 1.427-1.286 2.782-2.652 4.843-4.623H342.082z`;

const LIGHT_PATH_2 =
  `M576 767.845h337.863V592.039h-237.39c4.028-3.69 7.094-6.556 10.222-9.354` +
  `c33.534-29.994 67.107-59.945 100.568-90.02 2.916-2.62 5.776-3.713 9.724-3.707` +
  `c73.166.11 146.332.073 219.499.066h5.265v386.708H434.886V767.845z`;

// ── Types ─────────────────────────────────────────────────────────────────────
type Phase = "idle" | "drift" | "compose" | "draw" | "pulse" | "resolved";

interface Particle {
  id: number;
  color: "tech" | "consulting";
  r: number;
  alpha: number;
  ex: number; ey: number;
  mx: number; my: number;
  nx: number; ny: number;
  p1d: number;
  p2d: number;
  scalePhase: boolean;
}

const EASE_OUT: [number, number, number, number]   = [0.25, 0.1, 0.25, 1];
const EASE_INOUT: [number, number, number, number] = [0.4, 0, 0.2, 1];

// ── Component ─────────────────────────────────────────────────────────────────
interface Props { delay?: number }

export function HeroParticleConvergence({ delay = 0 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, margin: "-80px" });
  const prefersReducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("idle");

  const particles = useMemo<Particle[]>(() => {
    const rng = makePrng(0xc0ffee42);
    return PARTICLE_POS.map((pos, i) => {
      const isBlue = pos.color === "tech";
      const dist = Math.hypot(pos.x - LOGO_POS.x, pos.y - LOGO_POS.y);

      // Visual hierarchy: inner particles larger, draws eye to logo
      let r: number;
      if (pos.scalePhase) {
        r = 1.5 + rng() * 1.0;
      } else if (dist < 50) {
        r = 3.0 + rng() * 2.0;  // 3–5px inner
      } else if (dist < 90) {
        r = 2.2 + rng() * 1.8;  // 2.2–4px mid
      } else {
        r = 1.5 + rng() * 1.5;  // 1.5–3px outer
      }

      const alpha = 0.55 + rng() * 0.45;

      // Entry: blue from upper-left zone, green from lower-right; scale-phase stay put
      let ex: number, ey: number;
      if (pos.scalePhase) {
        ex = pos.x; ey = pos.y;
      } else if (isBlue) {
        ex = -r + rng() * VW * 0.45;
        ey = -r + rng() * VH * 0.40;
      } else {
        ex = VW * 0.55 + rng() * (VW * 0.45 + r);
        ey = VH * 0.60 + rng() * (VH * 0.40 + r);
      }

      // Drift cluster: blue upper-center, green lower-center
      const mx = pos.scalePhase ? pos.x : isBlue ? (70 + rng() * 100) : (160 + rng() * 110);
      const my = pos.scalePhase ? pos.y : isBlue ? (50 + rng() * 100) : (140 + rng() * 100);

      const p1d = pos.scalePhase ? 0 : delay + rng() * 0.40;
      const p2d = pos.scalePhase ? 0 : rng() * 0.20;

      return { id: i, color: pos.color, r, alpha, ex, ey, mx, my, nx: pos.x, ny: pos.y, p1d, p2d, scalePhase: !!pos.scalePhase };
    });
  }, [delay]);

  useEffect(() => {
    if (!inView) return;
    if (prefersReducedMotion) { setPhase("resolved"); return; }

    setPhase("drift");
    const t1 = setTimeout(() => setPhase("compose"),  T_COMPOSE);
    const t2 = setTimeout(() => setPhase("draw"),     T_DRAW);
    const t3 = setTimeout(() => setPhase("pulse"),    T_PULSE);
    const t4 = setTimeout(() => setPhase("resolved"), T_RESOLVED);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [inView, prefersReducedMotion]);

  const isDrift    = phase === "drift";
  const isCompose  = phase === "compose";
  const showLines  = phase === "draw" || phase === "pulse" || phase === "resolved";
  const showLogo   = phase === "draw" || phase === "pulse" || phase === "resolved";
  const active     = phase !== "idle";

  // Scale beat: composition expands 1.0→1.06 on draw, pulses briefly on pulse, stays expanded
  const scaleGroupAnimate =
    phase === "draw"     ? { scale: 1.06 } :
    phase === "pulse"    ? { scale: [1.06, 1.155, 1.06] as number[] } :
    phase === "resolved" ? { scale: 1.06 } :
                           { scale: 1 };

  const scaleGroupTransition =
    phase === "draw"  ? { scale: { duration: 0.6, ease: "easeOut" as const } } :
    phase === "pulse" ? { scale: { duration: 0.25, ease: EASE_INOUT } } :
                        { scale: { duration: 0 } };

  return (
    <div ref={containerRef} className="relative w-full" style={{ aspectRatio: `${VW}/${VH}` }}>
      <svg
        viewBox={`0 0 ${VW} ${VH}`}
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
      >
        {/* Scale-beat + pulse group — wraps entire composition */}
        <motion.g
          style={{ transformOrigin: `${LOGO_POS.x}px ${LOGO_POS.y}px` }}
          animate={scaleGroupAnimate}
          transition={scaleGroupTransition}
        >
          {/* ── Connecting lines (Phase 3) ── */}
          {CONNECTIONS.map((conn, idx) => (
            <motion.path
              key={idx}
              d={`M ${conn.x1} ${conn.y1} L ${conn.x2} ${conn.y2}`}
              stroke="var(--muted-fg)"
              strokeWidth={conn.isLogoConn ? 1.25 : 1}
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={
                showLines
                  ? { pathLength: 1, opacity: conn.isLogoConn ? 0.35 : 0.25 }
                  : { pathLength: 0, opacity: 0 }
              }
              transition={
                prefersReducedMotion
                  ? { pathLength: { duration: 0 }, opacity: { duration: 0.4, delay: idx * 0.005 } }
                  : showLines
                  ? {
                      pathLength: { delay: conn.drawDelay, duration: 0.26, ease: "easeOut" },
                      opacity:    { delay: conn.drawDelay, duration: 0.18 },
                    }
                  : { duration: 0 }
              }
            />
          ))}

          {/* ── Particles ── */}
          {particles.map((p) => {
            // Scale-phase particles stay at network position throughout; only opacity changes
            const tx = p.scalePhase ? p.nx
              : isDrift           ? p.mx
              : isCompose || showLines ? p.nx
              : p.ex;
            const ty = p.scalePhase ? p.ny
              : isDrift           ? p.my
              : isCompose || showLines ? p.ny
              : p.ey;

            const targetOpacity = p.scalePhase
              ? (showLines ? p.alpha : 0)
              : p.alpha;

            return (
              <motion.circle
                key={p.id}
                cx={0} cy={0} r={p.r}
                fill={`var(--color-${p.color})`}
                style={{ transformOrigin: "0px 0px" }}
                initial={{
                  x: prefersReducedMotion ? p.nx : p.ex,
                  y: prefersReducedMotion ? p.ny : p.ey,
                  opacity: 0,
                }}
                animate={
                  active
                    ? { x: tx, y: ty, opacity: targetOpacity }
                    : { opacity: 0 }
                }
                transition={
                  prefersReducedMotion
                    ? {
                        x: { duration: 0 },
                        y: { duration: 0 },
                        opacity: { duration: 0.3, delay: p.id * 0.008 },
                      }
                    : p.scalePhase
                    ? {
                        x: { duration: 0 },
                        y: { duration: 0 },
                        opacity: { duration: 0.55, delay: showLines ? 0.25 : 0 },
                      }
                    : isDrift
                    ? {
                        x: { duration: 1.0, delay: p.p1d, ease: EASE_OUT },
                        y: { duration: 1.0, delay: p.p1d, ease: EASE_OUT },
                        opacity: { duration: 0.30, delay: p.p1d },
                      }
                    : isCompose
                    ? {
                        x: { duration: 1.40, delay: p.p2d, ease: EASE_INOUT },
                        y: { duration: 1.40, delay: p.p2d, ease: EASE_INOUT },
                        opacity: { duration: 0.01 },
                      }
                    : {
                        x: { duration: 0 },
                        y: { duration: 0 },
                        opacity: { duration: 0.4 },
                      }
                }
              />
            );
          })}

          {/* ── PG Ventures logo — structural anchor at true center ── */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: showLogo ? 1 : 0 }}
            transition={{
              duration: prefersReducedMotion ? 0.3 : 0.40,
              delay:    prefersReducedMotion ? 0   : (showLogo ? 0.10 : 0),
              ease: EASE_INOUT,
            }}
          >
            <g transform={LOGO_NODE_TRANSFORM}>
              <path d={DARK_PATH}    fill="var(--foreground)" />
              <path d={LIGHT_PATH_1} fill="var(--background)" />
              <path d={LIGHT_PATH_2} fill="var(--background)" />
            </g>
          </motion.g>
        </motion.g>
      </svg>
    </div>
  );
}
