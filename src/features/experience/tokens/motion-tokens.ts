/**
 * Aetheris Motion Timing and Easing Tokens
 * Aligned with DESIGN_TOKENS.md and experience principles.
 * Components must consume these tokens and never reference raw millisecond values.
 */

export const MOTION_TIMINGS = {
  instant: 0,       // For immediate state switches
  feedback: 120,    // Fast (120ms) - for micro-interactions and button clicks
  context: 240,     // Medium (240ms) - for contextual updates and hover states
  transition: 420,  // Slow (420ms) - for card entrances, panel slides, and camera transitions
  hero: 900,        // Hero (900ms) - for cinematic transitions, loading boots, and scene reveal
} as const;

export const MOTION_EASINGS = {
  standard: [0.4, 0.0, 0.2, 1.0] as [number, number, number, number],
  accelerate: [0.4, 0.0, 1.0, 1.0] as [number, number, number, number],
  decelerate: [0.0, 0.0, 0.2, 1.0] as [number, number, number, number],
  emphasized: [0.2, 0.0, 0.0, 1.0] as [number, number, number, number],
} as const;

export type MotionTiming = keyof typeof MOTION_TIMINGS;
export type MotionEasing = keyof typeof MOTION_EASINGS;
