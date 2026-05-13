"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useAnimationFrame,
  useAnimation,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { FadeIn } from "@/components/motion/FadeIn";

// ---------------------------------------------------------------------------
// Path geometry
// ---------------------------------------------------------------------------
// Clockwise curved arrows, control points push outward from the centroid (~50,51)
const PATHS = {
  cToT: "M50,28 Q78,38 75,62",  // Consulting → Technologies
  tToO: "M75,62 Q50,74 25,62",  // Technologies → Better Outcomes
  oToC: "M25,62 Q14,38 50,28",  // Better Outcomes → Consulting
} as const;

// Arrowhead polygons — tip + two base corners, computed from tangent at t=1
const ARROWHEADS = {
  cToT: "75,62 73.88,58.83 76.86,59.21",
  tToO: "25,62 28.36,61.95 27.06,64.65",
  oToC: "50,28 47.51,30.25 46.71,27.35",
} as const;

// Bezier sampled at t=0,0.25,0.5,0.75,1 for each of the 3 arrows → 13 points.
// Framer Motion distributes 13 keyframes at times [0, 1/12, 2/12, ..., 1].
// Phase boundaries: arrow 1 ends at index 4 (4/12=0.333), arrow 2 at index 8 (0.667).
// Fill only needs 4 keyframes; default distribution [0,1/3,2/3,1] aligns exactly.
const DOT_CX = [50, 62.06, 70.25, 74.56, 75, 62.5, 50, 37.5, 25, 22.44, 25.75, 34.94, 50];
const DOT_CY = [28, 33.88, 41.5, 50.88, 62, 66.5, 68, 66.5, 62, 50.88, 41.5, 33.88, 28];

// ---------------------------------------------------------------------------
// Dark-mode detector — reads the class-based theme set by next-themes
// ---------------------------------------------------------------------------
function useDarkMode(): boolean {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const update = () => setDark(document.documentElement.classList.contains("dark"));
    update();
    const obs = new MutationObserver(update);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);
  return dark;
}

// ---------------------------------------------------------------------------
// Highlight types
// ---------------------------------------------------------------------------
type ActiveNode = "consulting" | "tech" | "outcomes" | null;

type HighlightKey =
  | "consulting-1"
  | "technologies-1"
  | "products"
  | "outcomes"
  | "feed-back"
  | "consulting-outcomes"
  | null;

// RGB triplets for glow colors (no CSS vars — Framer Motion can't interpolate them)
const HIGHLIGHT_RGB: Record<NonNullable<HighlightKey>, string> = {
  "consulting-1":        "16, 185, 129",   // green
  "technologies-1":      "59, 130, 246",   // blue
  "products":            "59, 130, 246",   // blue
  "outcomes":            "136, 136, 136",  // neutral
  "feed-back":           "136, 136, 136",  // neutral
  "consulting-outcomes": "16, 185, 129",   // green
};

// ---------------------------------------------------------------------------
// HL — a span that brightens and glows when its key is active
// ---------------------------------------------------------------------------
function HL({
  ids,
  k,
  children,
}: {
  ids: NonNullable<HighlightKey>[];
  k: HighlightKey;
  children: React.ReactNode;
}) {
  const matchedKey = k !== null && ids.includes(k) ? k : null;
  const isActive = matchedKey !== null;
  const glowKey = matchedKey ?? ids[0];
  const rgb = HIGHLIGHT_RGB[glowKey];
  return (
    <motion.span
      initial={{ opacity: 0.8, textShadow: `0 0 0px rgba(${rgb}, 0)` }}
      animate={{
        opacity: isActive ? 1 : 0.8,
        textShadow: isActive
          ? `0 0 8px rgba(${rgb}, 0.35)`
          : `0 0 0px rgba(${rgb}, 0)`,
      }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {children}
    </motion.span>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function TheLoop() {
  const ref = useRef<HTMLDivElement>(null);
  // Entrance fires once; ambient gate pauses when section leaves viewport
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const isOnScreen = useInView(ref, { once: false, margin: "0px" });
  const shouldReduceMotion = useReducedMotion();
  const isDark = useDarkMode();

  // neutral-fg hex differs by theme; used as the midpoint in the color cycle
  const neutralColor = isDark ? "#a3a3a3" : "#737373";

  // Dot appears 2 s after entrance (all three arrows are drawn by ~1.7 s)
  const [dotVisible, setDotVisible] = useState(false);
  useEffect(() => {
    if (!inView || shouldReduceMotion) return;
    const t = setTimeout(() => setDotVisible(true), 2200);
    return () => clearTimeout(t);
  }, [inView, shouldReduceMotion]);

  const dotActive = !shouldReduceMotion && dotVisible && isOnScreen;

  // -- Node lighting: which node is lit right now --------------------------
  const [activeNode, setActiveNode] = useState<ActiveNode>(null);
  const cycleStartRef = useRef<number | null>(null);
  const lastPhaseRef = useRef(-1);

  // -- Word highlights: which text span is lit right now ------------------
  const [highlightKey, setHighlightKey] = useState<HighlightKey>(null);
  const lastHighlightRef = useRef<HighlightKey>(null);

  // Clear state when dot stops
  useEffect(() => {
    if (!dotActive) {
      setHighlightKey(null);
      setActiveNode(null);
      lastHighlightRef.current = null;
    }
  }, [dotActive]);

  // Reset cycle when section leaves screen so it starts cleanly on return
  useEffect(() => {
    if (!isOnScreen) {
      cycleStartRef.current = null;
      lastPhaseRef.current = -1;
    }
  }, [isOnScreen]);

  useAnimationFrame((t) => {
    if (!dotActive) return;
    if (cycleStartRef.current === null) {
      cycleStartRef.current = t;
      lastPhaseRef.current = -1;
    }

    const elapsed = (t - cycleStartRef.current) / 1000;
    const cyclePos = (elapsed % 6) / 6;
    const phase = Math.floor(cyclePos * 3); // 0 = traveling to Tech, 1 = to Outcomes, 2 = to Consulting

    // -- Node lighting on phase transition --
    if (phase !== lastPhaseRef.current) {
      lastPhaseRef.current = phase;
      // Node lights up when dot ARRIVES (at the START of each outbound leg)
      const nodeByPhase: Record<number, ActiveNode> = {
        0: "consulting",   // cycle start: dot departs Consulting → briefly light it
        1: "tech",         // dot arrives at Tech
        2: "outcomes",     // dot arrives at Outcomes
      };
      setActiveNode(nodeByPhase[phase]);
      setTimeout(() => setActiveNode(null), 600);
    }

    // -- Word highlight sub-phase tracking --
    const secs = (elapsed % 6);           // position within full 6s cycle
    const phasePos = secs % 2;            // 0–2 within each 2s arrow leg

    let newHighlight: HighlightKey = null;
    if (phasePos < 0.6) {
      // First 0.6s of each leg: highlight departure concept
      if (phase === 0) newHighlight = "consulting-1";
      else if (phase === 1) newHighlight = "products";
      else newHighlight = "feed-back";
    } else if (phasePos < 1.2) {
      // Next 0.6s of each leg: highlight arrival concept
      if (phase === 0) newHighlight = "technologies-1";
      else if (phase === 1) newHighlight = "outcomes";
      else newHighlight = "consulting-outcomes";
    }

    if (newHighlight !== lastHighlightRef.current) {
      lastHighlightRef.current = newHighlight;
      setHighlightKey(newHighlight);
    }
  });

  const dur = (n: number) => (shouldReduceMotion ? 0.1 : n);
  const del = (n: number) => (shouldReduceMotion ? 0 : n);

  return (
    <section
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32"
      aria-label="The feedback loop"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Text */}
        <FadeIn>
          <p className="text-xs font-medium uppercase tracking-widest text-[var(--muted-fg)] mb-4">
            The difference
          </p>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-6">
            One venture.{" "}
            <span className="text-[var(--muted-fg)]">One feedback loop.</span>
          </h2>
          <p className="text-[var(--muted-fg)] leading-relaxed text-lg mb-6">
            <HL ids={["consulting-1"]} k={highlightKey}>Consulting</HL>
            {" work surfaces real business problems. Those problems inform what "}
            <HL ids={["technologies-1"]} k={highlightKey}>Technologies</HL>
            {" builds. Those "}
            <HL ids={["products"]} k={highlightKey}>products</HL>
            {" "}
            <HL ids={["feed-back"]} k={highlightKey}>feed back</HL>
            {" into better "}
            <HL ids={["consulting-outcomes"]} k={highlightKey}>Consulting</HL>
            {" "}
            <HL ids={["outcomes", "consulting-outcomes"]} k={highlightKey}>outcomes</HL>
            {"."}
          </p>
          <p className="text-[var(--muted-fg)] leading-relaxed">
            The two arms aren&apos;t separate businesses — they&apos;re a feedback loop.
            What we learn in the field shapes what we build. What we build makes
            us better in the field.
          </p>
        </FadeIn>

        {/* Diagram */}
        <FadeIn delay={0.15}>
          <div
            ref={ref}
            className="relative aspect-square w-full max-w-sm mx-auto"
            role="img"
            aria-label="Clockwise feedback loop: PG Consulting surfaces problems that PG Technologies builds solutions for, producing better outcomes that feed back into Consulting"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden="true">

              {/* Arrow paths — draw themselves in on scroll */}
              <motion.path
                d={PATHS.cToT}
                stroke="var(--border)"
                strokeWidth="0.8"
                fill="none"
                strokeDasharray="100"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={inView ? { pathLength: 1, opacity: 1 } : {}}
                transition={{ duration: dur(0.8), delay: del(0.4) }}
              />
              <motion.path
                d={PATHS.tToO}
                stroke="var(--border)"
                strokeWidth="0.8"
                fill="none"
                strokeDasharray="100"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={inView ? { pathLength: 1, opacity: 1 } : {}}
                transition={{ duration: dur(0.8), delay: del(0.7) }}
              />
              <motion.path
                d={PATHS.oToC}
                stroke="var(--border)"
                strokeWidth="0.8"
                fill="none"
                strokeDasharray="100"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={inView ? { pathLength: 1, opacity: 1 } : {}}
                transition={{ duration: dur(0.8), delay: del(1.0) }}
              />

              {/* Directional flow dashes — faint moving pattern on each arrow */}
              {!shouldReduceMotion && [PATHS.cToT, PATHS.tToO, PATHS.oToC].map((d, i) => (
                <motion.path
                  key={`flow-${i}`}
                  d={d}
                  stroke="var(--border)"
                  strokeWidth="0.8"
                  fill="none"
                  strokeDasharray="3 7"
                  initial={{ strokeDashoffset: 0, opacity: 0 }}
                  animate={inView ? { strokeDashoffset: [0, -10], opacity: 0.2 } : {}}
                  transition={{
                    strokeDashoffset: { duration: 2.5, repeat: Infinity, ease: "linear", repeatType: "loop" },
                    opacity: { duration: 0.4, delay: del(2.0 + i * 0.15) },
                  }}
                />
              ))}

              {/* Arrowheads — fade in after each path finishes drawing */}
              <motion.polygon
                points={ARROWHEADS.cToT}
                fill="var(--border)"
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ duration: 0.2, delay: del(1.2) }}
              />
              <motion.polygon
                points={ARROWHEADS.tToO}
                fill="var(--border)"
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ duration: 0.2, delay: del(1.5) }}
              />
              <motion.polygon
                points={ARROWHEADS.oToC}
                fill="var(--border)"
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ duration: 0.2, delay: del(1.8) }}
              />

              {/* Traveling dot — color transitions mirror the cycle's message:
                  consulting insights (green) → technology (blue) → outcomes (neutral) → repeat */}
              <motion.circle
                cx={50}
                cy={28}
                r={3}
                style={{ fill: "#10b981" }}
                animate={
                  dotActive
                    ? {
                        opacity: 1,
                        cx: DOT_CX,
                        cy: DOT_CY,
                        fill: ["#10b981", "#3b82f6", neutralColor, "#10b981"],
                      }
                    : { opacity: 0, cx: 50, cy: 28 }
                }
                transition={
                  dotActive
                    ? {
                        opacity: { duration: 0.4 },
                        cx: { duration: 6, repeat: Infinity, ease: "linear" },
                        cy: { duration: 6, repeat: Infinity, ease: "linear" },
                        fill: { duration: 6, repeat: Infinity, ease: "linear" },
                      }
                    : { opacity: { duration: 0.3 }, cx: { duration: 0.3 }, cy: { duration: 0.3 } }
                }
              />
            </svg>

            {/* Nodes */}
            <LoopNode
              label="PG Consulting"
              sublabel="Identifies real problems"
              color="consulting"
              position={{ top: "4%", left: "50%", transform: "translateX(-50%)" }}
              delay={0}
              inView={inView}
              isActive={activeNode === "consulting"}
            />
            <LoopNode
              label="PG Technologies"
              sublabel="Builds the solution"
              color="tech"
              position={{ bottom: "4%", right: "0%" }}
              delay={0.1}
              inView={inView}
              isActive={activeNode === "tech"}
            />
            <LoopNode
              label="Better Outcomes"
              sublabel="Improves delivery"
              color="muted"
              position={{ bottom: "4%", left: "0%" }}
              delay={0.2}
              inView={inView}
              isActive={activeNode === "outcomes"}
            />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// LoopNode
// ---------------------------------------------------------------------------
function LoopNode({
  label,
  sublabel,
  color,
  position,
  delay,
  inView,
  isActive,
}: {
  label: string;
  sublabel: string;
  color: "consulting" | "tech" | "muted";
  position: Record<string, string>;
  delay: number;
  inView: boolean;
  isActive: boolean;
}) {
  const shouldReduceMotion = useReducedMotion();
  const dotControls = useAnimation();
  const labelControls = useAnimation();

  // Dot briefly scales 1 → 1.25 → 1; label briefly brightens when the traveling dot arrives
  useEffect(() => {
    if (!isActive || shouldReduceMotion) return;
    dotControls.start({ scale: [1, 1.25, 1], transition: { duration: 0.4, ease: "easeOut" } });
    labelControls.start({ opacity: [0.8, 1, 0.8], transition: { duration: 0.6 } });
  }, [isActive, shouldReduceMotion]); // eslint-disable-line react-hooks/exhaustive-deps

  const dotColor =
    color === "consulting"
      ? "bg-consulting"
      : color === "tech"
      ? "bg-tech"
      : "bg-[var(--muted-fg)]";

  return (
    <motion.div
      className="absolute flex flex-col items-center text-center gap-1"
      style={position as React.CSSProperties}
      initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.8 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.4, delay: shouldReduceMotion ? 0 : delay }}
    >
      <motion.div
        className={`w-2.5 h-2.5 rounded-full ${dotColor} mb-1`}
        animate={dotControls}
        aria-hidden="true"
      />
      <motion.span
        className="text-xs font-medium text-[var(--foreground)] leading-tight whitespace-nowrap"
        initial={{ opacity: 0.8 }}
        animate={labelControls}
      >
        {label}
      </motion.span>
      <span className="text-[10px] text-[var(--muted-fg)] leading-tight whitespace-nowrap">
        {sublabel}
      </span>
    </motion.div>
  );
}
