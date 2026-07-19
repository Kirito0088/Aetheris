"use client";

import { useReducedMotion } from "framer-motion";
import type { Transition, Variants } from "framer-motion";

/**
 * Returns motion-safe animation props. When the user prefers reduced motion,
 * all transforms and delays are removed — only instant opacity fades remain.
 *
 * Usage:
 *   const safe = useMotionSafe();
 *   <motion.div {...safe.fadeIn} />
 */
export function useMotionSafe() {
  const shouldReduce = useReducedMotion();

  const instant: Transition = { duration: 0 };

  return {
    shouldReduce,

    /** Safe fade-in: opacity only, instant when reduced */
    fadeIn: shouldReduce
      ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: instant }
      : undefined,

    /** Returns a transition that is instant when reduced */
    safeTransition(normal: Transition): Transition {
      return shouldReduce ? instant : normal;
    },

    /** Returns variants that collapse to opacity-only when reduced */
    safeVariants(variants: Variants): Variants {
      if (!shouldReduce) return variants;
      const safe: Variants = {};
      for (const [key, variant] of Object.entries(variants)) {
        if (typeof variant === "object" && variant !== null) {
          const { opacity } = variant as Record<string, unknown>;
          // Keep only opacity, strip all transforms
          safe[key] = {
            ...(opacity !== undefined ? { opacity: opacity as number } : {}),
            transition: instant,
          };
        } else {
          safe[key] = variant;
        }
      }
      return safe;
    },
  } as const;
}
