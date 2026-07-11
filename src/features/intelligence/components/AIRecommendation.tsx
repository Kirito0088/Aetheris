import React from "react";
import clsx from "clsx";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface AIRecommendationProps {
  title: string;
  description: string;
  type?: 'routing' | 'amenity' | 'dispatch' | 'info';
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function AIRecommendation({
  title,
  description,
  type: _type = 'info',
  actionLabel,
  onAction,
  className
}: AIRecommendationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ y: -2, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={clsx(
        "relative overflow-hidden rounded-2xl p-5 border",
        "bg-gradient-to-br from-surface-elevated to-surface-base",
        "border-brand-blue/20 shadow-elevation-1",
        className
      )}
    >
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
        <Sparkles className="w-24 h-24 text-brand-blue" />
      </div>
      
      <div className="relative z-10 flex items-start gap-4">
        <div className="flex-shrink-0 mt-1">
          <div className="w-8 h-8 rounded-full bg-brand-blue/10 flex items-center justify-center shadow-inner">
            <Sparkles className="w-4 h-4 text-brand-blue" />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="text-[length:var(--font-size-base)] font-semibold text-text-primary mb-1">
            {title}
          </h4>
          <p className="text-[length:var(--font-size-sm)] text-text-secondary leading-relaxed mb-4 pr-6">
            {description}
          </p>
          
          {actionLabel && (
            <motion.button
              onClick={onAction}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-brand-blue text-white text-[length:var(--font-size-sm)] font-medium hover:bg-brand-blue-strong transition-colors shadow-glow-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base"
            >
              {actionLabel}
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
