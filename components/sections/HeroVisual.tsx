"use client";

import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence, useAnimation, useInView, useReducedMotion } from "framer-motion";

// All path draws start 400ms after page load, parallel with the text reveal
const VISUAL_OFFSET = 0.4;

// ---------------------------------------------------------------------------
// Data-flow dot paths — each dot travels along one of these wireframe segments
// ---------------------------------------------------------------------------
type FlowPath = {
  cx: number[];
  cy: number[];
  posTimes: number[];
  opacity: number[];
  opTimes: number[];
  color: string;
  duration: number;
  r: number;
};

const FLOW_PATHS: FlowPath[] = [
  {
    // Tech blue branch: corner of loop square → right end (follows the blue line)
    cx: [250, 250, 300],
    cy: [100, 250, 250],
    posTimes: [0, 0.75, 1],
    opacity: [0, 0.6, 0.6, 0],
    opTimes: [0, 0.07, 0.87, 1],
    color: "var(--color-tech)",
    duration: 1.8,
    r: 2.5,
  },
  {
    // Consulting green branch: data-flow node → junction point (follows the green line)
    cx: [150, 150, 200],
    cy: [300, 250, 250],
    posTimes: [0, 0.5, 1],
    opacity: [0, 0.6, 0.6, 0],
    opTimes: [0, 0.1, 0.9, 1],
    color: "var(--color-consulting)",
    duration: 1.4,
    r: 2.5,
  },
  {
    // Loop top edge: left corner → right corner (muted tech tint)
    cx: [100, 250],
    cy: [100, 100],
    posTimes: [0, 1],
    opacity: [0, 0.45, 0.45, 0],
    opTimes: [0, 0.07, 0.9, 1],
    color: "var(--color-tech)",
    duration: 1.4,
    r: 2,
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function HeroVisual() {
  const ref = useRef<SVGSVGElement>(null);

  // Two separate inView hooks: entrance fires once, ambient pauses when off-screen
  const entranceInView = useInView(ref, { once: true, margin: "0px" });
  const ambientInView = useInView(ref, { once: false, margin: "0px" });

  const shouldReduceMotion = useReducedMotion();
  const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];
  const dur = (n: number) => (shouldReduceMotion ? 0.1 : n);
  const del = (n: number) => (shouldReduceMotion ? 0 : n + VISUAL_OFFSET);

  // Animation controls for accent dots: bounce entrance → infinite scale pulse
  const techDotControls = useAnimation();
  const consultingDotControls = useAnimation();

  useEffect(() => {
    if (!entranceInView || shouldReduceMotion) return;

    const techDelay = VISUAL_OFFSET + 1.0;
    const consultDelay = VISUAL_OFFSET + 1.1;

    async function runTech() {
      await techDotControls.start({
        opacity: 1,
        scale: 1,
        transition: { delay: techDelay, type: "spring", stiffness: 300, damping: 12, mass: 0.6 },
      });
      techDotControls.start({
        scale: [1, 1.08, 1],
        opacity: [1, 0.85, 1],
        transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
      });
    }

    async function runConsulting() {
      await consultingDotControls.start({
        opacity: 1,
        scale: 1,
        transition: { delay: consultDelay, type: "spring", stiffness: 300, damping: 12, mass: 0.6 },
      });
      consultingDotControls.start({
        scale: [1, 1.08, 1],
        opacity: [1, 0.85, 1],
        transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.4 },
      });
    }

    runTech();
    runConsulting();
  }, [entranceInView, shouldReduceMotion]); // eslint-disable-line react-hooks/exhaustive-deps

  // Data-flow dot scheduling — pauses automatically when hero leaves viewport
  const dotKeyRef = useRef(0);
  const [activeDot, setActiveDot] = useState<{ pathIndex: number; key: number } | null>(null);

  useEffect(() => {
    if (!ambientInView || shouldReduceMotion) {
      setActiveDot(null);
      return;
    }

    let timeout: ReturnType<typeof setTimeout>;

    function scheduleNext(delay: number) {
      timeout = setTimeout(() => {
        const pathIndex = Math.floor(Math.random() * FLOW_PATHS.length);
        dotKeyRef.current += 1;
        setActiveDot({ pathIndex, key: dotKeyRef.current });
        // Next dot fires after travel time + random 4–6s gap
        scheduleNext(FLOW_PATHS[pathIndex].duration * 1000 + 4000 + Math.random() * 2000);
      }, delay);
    }

    // First dot appears after entrance settles (3.5s)
    scheduleNext(3500);
    return () => {
      clearTimeout(timeout);
      setActiveDot(null);
    };
  }, [ambientInView, shouldReduceMotion]);

  return (
    <svg
      ref={ref}
      viewBox="0 0 400 500"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-sm opacity-80"
      aria-hidden="true"
    >
      {/* Subtle background grid */}
      <path
        d="M0 50h400M0 100h400M0 150h400M0 200h400M0 250h400M0 300h400M0 350h400M0 400h400M0 450h400M50 0v500M100 0v500M150 0v500M200 0v500M250 0v500M300 0v500M350 0v500"
        stroke="var(--border)"
        strokeWidth="0.5"
        fill="none"
        opacity="0.4"
      />

      {/* Gray structural path 1: The Loop square */}
      <motion.path
        d="M100 100h150v150h-150z"
        stroke="var(--border)"
        strokeWidth="1"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={entranceInView ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: dur(1.0), delay: del(0.15), ease }}
      />

      {/* Tech blue branch line */}
      <motion.path
        d="M250 100v150h50"
        stroke="var(--color-tech)"
        strokeWidth="1.5"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={entranceInView ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: dur(0.5), delay: del(0.9), ease }}
      />

      {/* Gray structural path 2: Data flow */}
      <motion.path
        d="M50 350h100v-50h150v100"
        stroke="var(--border)"
        strokeWidth="1"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={entranceInView ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: dur(1.0), delay: del(0.45), ease }}
      />

      {/* Consulting green branch line */}
      <motion.path
        d="M150 300v-50h50"
        stroke="var(--color-consulting)"
        strokeWidth="1.5"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={entranceInView ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: dur(0.5), delay: del(1.05), ease }}
      />

      {/* Dashed accent: vertical */}
      <motion.line
        x1="350" y1="50" x2="350" y2="150"
        stroke="var(--border)"
        strokeWidth="1"
        strokeDasharray="4 4"
        initial={{ opacity: 0 }}
        animate={entranceInView ? { opacity: 0.5 } : {}}
        transition={{ duration: dur(0.4), delay: del(1.3) }}
      />

      {/* Dashed accent: horizontal */}
      <motion.line
        x1="50" y1="450" x2="150" y2="450"
        stroke="var(--border)"
        strokeWidth="1"
        strokeDasharray="4 4"
        initial={{ opacity: 0 }}
        animate={entranceInView ? { opacity: 0.5 } : {}}
        transition={{ duration: dur(0.4), delay: del(1.4) }}
      />

      {/* Structural node: top-left corner of loop */}
      <motion.rect
        x="90" y="90" width="20" height="20" rx="2"
        fill="var(--background)"
        stroke="var(--border)"
        strokeWidth="1"
        initial={{ opacity: 0 }}
        animate={entranceInView ? { opacity: 1 } : {}}
        transition={{ duration: dur(0.3), delay: del(0.25) }}
      />

      {/* Structural node: bottom-right corner of loop */}
      <motion.rect
        x="240" y="240" width="20" height="20" rx="2"
        fill="var(--background)"
        stroke="var(--border)"
        strokeWidth="1"
        initial={{ opacity: 0 }}
        animate={entranceInView ? { opacity: 1 } : {}}
        transition={{ duration: dur(0.3), delay: del(0.65) }}
      />

      {/* Structural node: data flow origin */}
      <motion.circle
        cx="50" cy="350" r="3"
        fill="var(--background)"
        stroke="var(--border)"
        strokeWidth="1"
        initial={{ opacity: 0 }}
        animate={entranceInView ? { opacity: 1 } : {}}
        transition={{ duration: dur(0.3), delay: del(0.55) }}
      />

      {/* Structural node: data flow terminus */}
      <motion.circle
        cx="300" cy="400" r="3"
        fill="var(--background)"
        stroke="var(--border)"
        strokeWidth="1"
        initial={{ opacity: 0 }}
        animate={entranceInView ? { opacity: 1 } : {}}
        transition={{ duration: dur(0.3), delay: del(0.85) }}
      />

      {/* Tech blue accent dot — spring bounce entrance, then gentle scale pulse */}
      <motion.circle
        cx="300" cy="250" r="4"
        fill="var(--color-tech)"
        style={{ transformOrigin: "300px 250px", transformBox: "fill-box" }}
        initial={{ opacity: 0, scale: 0 }}
        animate={shouldReduceMotion && entranceInView ? { opacity: 1, scale: 1 } : techDotControls}
      />

      {/* Tech pulse ring — expands outward after entrance */}
      {!shouldReduceMotion && (
        <motion.circle
          cx="300" cy="250" r="4"
          fill="none"
          stroke="var(--color-tech)"
          strokeWidth="0.8"
          style={{ transformOrigin: "300px 250px", transformBox: "fill-box" }}
          initial={{ opacity: 0, scale: 1 }}
          animate={entranceInView ? { opacity: [0, 0.6, 0], scale: [1, 2.8, 2.8] } : {}}
          transition={{
            duration: 2,
            delay: del(1.6) + 0.5,
            repeat: Infinity,
            repeatDelay: 1.5,
            ease: "easeOut",
          }}
        />
      )}

      {/* Consulting green accent dot — spring bounce entrance, then gentle scale pulse */}
      <motion.rect
        x="196" y="246" width="8" height="8" rx="1"
        fill="var(--color-consulting)"
        style={{ transformOrigin: "200px 250px", transformBox: "fill-box" }}
        initial={{ opacity: 0, scale: 0 }}
        animate={shouldReduceMotion && entranceInView ? { opacity: 1, scale: 1 } : consultingDotControls}
      />

      {/* Consulting pulse ring */}
      {!shouldReduceMotion && (
        <motion.circle
          cx="200" cy="250" r="4"
          fill="none"
          stroke="var(--color-consulting)"
          strokeWidth="0.8"
          style={{ transformOrigin: "200px 250px", transformBox: "fill-box" }}
          initial={{ opacity: 0, scale: 1 }}
          animate={entranceInView ? { opacity: [0, 0.6, 0], scale: [1, 2.8, 2.8] } : {}}
          transition={{
            duration: 2,
            delay: del(1.9) + 0.5,
            repeat: Infinity,
            repeatDelay: 1.5,
            ease: "easeOut",
          }}
        />
      )}

      {/* Data-flow dots — rendered on top of all structural paths */}
      <AnimatePresence>
        {activeDot && (
          <FlowDot key={activeDot.key} path={FLOW_PATHS[activeDot.pathIndex]} />
        )}
      </AnimatePresence>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// FlowDot — a single dot that travels one path segment then unmounts
// ---------------------------------------------------------------------------
function FlowDot({ path }: { path: FlowPath }) {
  return (
    <motion.circle
      r={path.r}
      fill={path.color}
      initial={{ opacity: 0, cx: path.cx[0], cy: path.cy[0] }}
      animate={{
        cx: path.cx,
        cy: path.cy,
        opacity: path.opacity,
      }}
      exit={{ opacity: 0 }}
      transition={{
        duration: path.duration,
        cx: { times: path.posTimes, ease: "linear", duration: path.duration },
        cy: { times: path.posTimes, ease: "linear", duration: path.duration },
        opacity: { times: path.opTimes, ease: "linear", duration: path.duration },
      }}
    />
  );
}
