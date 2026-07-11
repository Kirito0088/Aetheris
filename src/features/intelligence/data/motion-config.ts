import type { Transition } from "framer-motion";

export const SPRING_FAST: Transition = {
  type: "spring",
  damping: 25,
  stiffness: 180,
};

export const SPRING_PRECISE: Transition = {
  type: "spring",
  damping: 30,
  stiffness: 220,
};

export const EASE_OUT_ELEGANT: Transition = {
  type: "tween",
  ease: [0.16, 1, 0.3, 1], // easeOutExpo
  duration: 0.6,
};

export const MOTION_PRESETS = {
  pageTransition: {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
    transition: EASE_OUT_ELEGANT,
  },
  cardReveal: {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: SPRING_FAST,
  },
  cardHover: {
    whileHover: { y: -4, scale: 1.015, boxShadow: "0 12px 20px -8px rgba(0, 0, 0, 0.15)" },
    whileTap: { scale: 0.99 },
    transition: SPRING_FAST,
  },
  overlayFade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.25 },
  },
  panelTransition: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    transition: EASE_OUT_ELEGANT,
  },
};
