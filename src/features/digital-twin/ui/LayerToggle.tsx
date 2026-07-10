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
        "flex items-center justify-between w-full px-3 py-2 text-left rounded-xl transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-blue-500/30",
      )}
      style={{
        background: isActive ? 'var(--surface-elevated)' : 'transparent',
        border: isActive ? '1px solid var(--border-default)' : '1px solid transparent',
        boxShadow: isActive ? 'var(--elevation-1)' : 'none',
        color: isActive ? 'var(--text-primary)' : 'var(--text-tertiary)',
      }}
      aria-pressed={isActive}
      aria-label={`Toggle ${name} layer. ${description}`}
      title={description}
    >
      <div className="flex flex-col pr-2">
        <span className="text-xs font-semibold">{name}</span>
        <span className="text-[10px] line-clamp-1 mt-0.5" style={{ color: 'var(--text-disabled)' }}>
          {description}
        </span>
      </div>
      
      {/* Toggle indicator */}
      <span
        className="w-2.5 h-2.5 rounded-full transition-all duration-300 shrink-0"
        style={{
          background: isActive ? 'var(--brand-blue)' : 'var(--border-strong)',
        }}
      />
    </button>
  );
});
