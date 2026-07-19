"use client";

import React from "react";
import { motion } from "framer-motion";
import { useMotionSafe } from "@/hooks/useMotionSafe";
import type { HTMLMotionProps } from "framer-motion";

interface FadeInProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
}

export function FadeIn({ children, delay = 0, duration = 0.4, className, ...props }: FadeInProps) {
  const { shouldReduce, safeTransition } = useMotionSafe();

  return (
    <motion.div
      initial={{ opacity: 0, ...(shouldReduce ? {} : {}) }}
      animate={{ opacity: 1 }}
      transition={safeTransition({
        duration,
        delay,
        ease: [0.4, 0.0, 0.2, 1.0], // Standard easing
      })}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
