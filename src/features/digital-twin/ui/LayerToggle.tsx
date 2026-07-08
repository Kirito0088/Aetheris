"use client";

import React from "react";
import { clsx } from "clsx";

interface LayerToggleProps {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  onToggle: () => void;
}

export const LayerToggle = React.memo(function LayerToggle({
  name,
  description,
  isActive,
  onToggle,
}: LayerToggleProps) {
  return (
    <button
      onClick={onToggle}
      className={clsx(
        "flex items-center justify-between w-full px-3 py-2 text-left rounded-lg transition-all duration-200",
        "border focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400",
        isActive
          ? "bg-neutral-900/60 border-neutral-700 text-white shadow-sm shadow-blue-500/5"
          : "bg-transparent border-transparent text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/30"
      )}
      aria-pressed={isActive}
      aria-label={`Toggle ${name} layer. ${description}`}
      title={description}
    >
      <div className="flex flex-col pr-2">
        <span className="text-xs font-semibold tracking-wide uppercase">{name}</span>
        <span className="text-[10px] text-neutral-500 line-clamp-1 mt-0.5 font-normal">
          {description}
        </span>
      </div>
      
      {/* Visual Status Indicator */}
      <span
        className={clsx(
          "w-2.5 h-2.5 rounded-full transition-all duration-300 relative flex",
          isActive ? "bg-blue-500" : "bg-neutral-800"
        )}
      >
        {isActive && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
        )}
      </span>
    </button>
  );
});
