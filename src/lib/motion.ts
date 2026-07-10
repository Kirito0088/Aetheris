/**
 * Aetheris Motion System
 *
 * Framer Motion variants and transition presets aligned with
 * DESIGN_LANGUAGE.md motion philosophy:
 *
 * "Every animation must answer one question: 'What changed?'"
 * "Animations should feel: smooth, deliberate, physically believable,
 *  restrained, informative"
 *
 * All durations and easings reference MOTION_DURATION and MOTION_EASING
 * from design-tokens.ts — no hardcoded values.
 */

import { type Variants, type Transition } from "framer-motion";
import { MOTION_DURATION, MOTION_EASING } from "./design-tokens";

// =============================================================================
// SHARED TRANSITIONS
// Reusable transition definitions referencing token values.
// =============================================================================

/** Standard transition — most UI elements */
export const transitionStandard: Transition = {
  duration: MOTION_DURATION.normal / 1000,
  ease: MOTION_EASING.standard,
};

/** Fast transition — micro-interactions, hover states */
export const transitionFast: Transition = {
  duration: MOTION_DURATION.fast / 1000,
  ease: MOTION_EASING.standard,
};

/** Slow transition — panel reveals, page entrances */
export const transitionSlow: Transition = {
  duration: MOTION_DURATION.slow / 1000,
  ease: MOTION_EASING.decelerate,
};

/** Cinematic transition — camera movements, major scene changes */
export const transitionCinematic: Transition = {
  duration: MOTION_DURATION.cinematic / 1000,
  ease: MOTION_EASING.emphasized,
};

/** Spring transition — spatially grounded interactions */
export const transitionSpring: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
  mass: 1,
};

// =============================================================================
// SEMANTIC TRANSITIONS (PHASE 6)
// =============================================================================

export const transitionFeedback: Transition = {
  duration: MOTION_DURATION.feedback / 1000,
  ease: MOTION_EASING.standard,
};

export const transitionContext: Transition = {
  duration: MOTION_DURATION.context / 1000,
  ease: MOTION_EASING.standard,
};

export const transitionTransition: Transition = {
  duration: MOTION_DURATION.transition / 1000,
  ease: MOTION_EASING.decelerate,
};

export const transitionHero: Transition = {
  duration: MOTION_DURATION.hero / 1000,
  ease: MOTION_EASING.emphasized,
};

// =============================================================================
// FADE VARIANTS
// Opacity transitions for elements appearing and disappearing.
// =============================================================================

export const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: transitionStandard,
  },
  exit: {
    opacity: 0,
    transition: transitionFast,
  },
};

// =============================================================================
// SLIDE VARIANTS
// Directional reveal animations for panels, drawers, and sheets.
// =============================================================================

export const slideUpVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitionSlow,
  },
  exit: {
    opacity: 0,
    y: 16,
    transition: transitionFast,
  },
};

export const slideDownVariants: Variants = {
  hidden: { opacity: 0, y: -16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitionSlow,
  },
  exit: {
    opacity: 0,
    y: -16,
    transition: transitionFast,
  },
};

export const slideInFromLeftVariants: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: transitionSlow,
  },
  exit: {
    opacity: 0,
    x: -24,
    transition: transitionFast,
  },
};

export const slideInFromRightVariants: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: transitionSlow,
  },
  exit: {
    opacity: 0,
    x: 24,
    transition: transitionFast,
  },
};

// =============================================================================
// SCALE VARIANTS
// Subtle scale changes for cards, buttons, and interactive surfaces.
// Kept restrained — no exaggerated scaling (DESIGN_LANGUAGE.md).
// =============================================================================

export const scaleVariants: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: transitionSlow,
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    transition: transitionFast,
  },
};

// =============================================================================
// STAGGER CONTAINER
// Container variant that staggers child animations.
// Used for lists of recommendations, cards, etc.
// =============================================================================

export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitionStandard,
  },
};

// =============================================================================
// PAGE TRANSITION VARIANTS
// Used for route-level animations.
// Calm and restrained — "calmness is preferred over excitement" (DESIGN_LANGUAGE.md).
// =============================================================================

export const pageVariants: Variants = {
  initial: { opacity: 0 },
  enter: {
    opacity: 1,
    transition: {
      duration: MOTION_DURATION.slow / 1000,
      ease: MOTION_EASING.decelerate,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: MOTION_DURATION.normal / 1000,
      ease: MOTION_EASING.accelerate,
    },
  },
};

// =============================================================================
// OVERLAY VARIANTS
// Background overlays for modals, drawers.
// =============================================================================

export const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: MOTION_DURATION.normal / 1000 },
  },
  exit: {
    opacity: 0,
    transition: { duration: MOTION_DURATION.fast / 1000 },
  },
};
