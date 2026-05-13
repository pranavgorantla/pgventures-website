/**
 * Motion design tokens
 *
 * Single source of truth for animation timing, easing, and springs.
 * Import from here instead of hardcoding values in components.
 *
 * Paired with the framer-motion skill at ~/.claude/skills/framer-motion/
 */

import type { Transition, Variants } from "framer-motion"

// ---------------------------------------------------------------------------
// Durations (seconds)
// ---------------------------------------------------------------------------

export const duration = {
  /** 150ms — micro-interactions: hover, tap, focus rings */
  micro: 0.15,
  /** 300ms — standard UI transitions: fades, slides, reveals */
  standard: 0.3,
  /** 500ms — emphasis: hero entrances, page transitions */
  emphasis: 0.5,
  /** 800ms — long-form: onboarding, celebratory moments */
  long: 0.8,
} as const

// ---------------------------------------------------------------------------
// Easing curves (cubic-bezier)
// ---------------------------------------------------------------------------

export const easing = {
  /** Default soft ease — use for most UI motion */
  standard: [0.16, 1, 0.3, 1] as const,
  /** Sharp deceleration — for entrances */
  decelerate: [0, 0, 0.2, 1] as const,
  /** Sharp acceleration — for exits */
  accelerate: [0.4, 0, 1, 1] as const,
  /** Symmetric — for elements that move in both directions */
  inOut: [0.4, 0, 0.2, 1] as const,
  /** Linear — only for continuous motion (spinners, marquees) */
  linear: [0, 0, 1, 1] as const,
} as const

// ---------------------------------------------------------------------------
// Springs (physics-based, no duration)
// ---------------------------------------------------------------------------

export const spring = {
  /** Snappy, no overshoot — buttons, toggles */
  snappy: { type: "spring", stiffness: 400, damping: 30 } satisfies Transition,
  /** Gentle bounce — modals, popovers */
  gentle: { type: "spring", stiffness: 260, damping: 22 } satisfies Transition,
  /** Bouncy — playful elements, success states */
  bouncy: { type: "spring", stiffness: 300, damping: 15 } satisfies Transition,
  /** Stiff — drag-and-drop, follow-cursor */
  stiff: { type: "spring", stiffness: 700, damping: 40 } satisfies Transition,
} as const

// ---------------------------------------------------------------------------
// Stagger timings (seconds between children)
// ---------------------------------------------------------------------------

export const stagger = {
  /** Tight — cards in a grid */
  tight: 0.03,
  /** Default — list items */
  standard: 0.05,
  /** Loose — emphasis on individual items */
  loose: 0.08,
} as const

// ---------------------------------------------------------------------------
// Composed transitions (use these directly in components)
// ---------------------------------------------------------------------------

export const transition = {
  micro: { duration: duration.micro, ease: easing.standard },
  standard: { duration: duration.standard, ease: easing.standard },
  emphasis: { duration: duration.emphasis, ease: easing.standard },
  enter: { duration: duration.standard, ease: easing.decelerate },
  exit: { duration: duration.micro, ease: easing.accelerate },
} as const satisfies Record<string, Transition>

// ---------------------------------------------------------------------------
// Reusable variants
// ---------------------------------------------------------------------------

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: transition.standard },
  exit: { opacity: 0, transition: transition.exit },
}

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: transition.enter },
  exit: { opacity: 0, y: -8, transition: transition.exit },
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  show: { opacity: 1, scale: 1, transition: spring.gentle },
  exit: { opacity: 0, scale: 0.96, transition: transition.exit },
}

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: stagger.standard, delayChildren: 0.05 },
  },
}

// ---------------------------------------------------------------------------
// Reduced motion fallback
// ---------------------------------------------------------------------------

/**
 * Drop-in replacement for any variants object when useReducedMotion() is true.
 * Removes all transforms; keeps opacity only.
 */
export const reducedMotionVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.01 } },
  exit: { opacity: 0, transition: { duration: 0.01 } },
}