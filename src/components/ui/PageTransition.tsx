"use client";

import React from "react";
import { motion } from "framer-motion";
import { useMotionSafe } from "@/hooks/useMotionSafe";
import type { HTMLMotionProps } from "framer-motion";

interface PageTransitionProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
}

export function PageTransition({ children, className, ...props }: PageTransitionProps) {
  const { shouldReduce, safeTransition } = useMotionSafe();

  return (
    <motion.div
      initial={{ opacity: 0, ...(shouldReduce ? {} : { y: 8 }) }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, ...(shouldReduce ? {} : { y: -8 }) }}
      transition={safeTransition({
        duration: 0.3,
        ease: [0.4, 0.0, 0.2, 1.0], // Standard easing from design tokens
      })}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
