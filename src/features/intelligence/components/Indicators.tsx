import React from "react";
import clsx from "clsx";

interface StatusIndicatorProps {
  status: 'normal' | 'warning' | 'critical' | 'offline';
  pulse?: boolean;
}

export function StatusIndicator({ status, pulse = false }: StatusIndicatorProps) {
  const getColors = () => {
    switch (status) {
      case 'normal': return 'bg-state-success';
      case 'warning': return 'bg-state-warning';
      case 'critical': return 'bg-state-danger';
      case 'offline': return 'bg-text-tertiary';
    }
  };

  return (
    <div className={clsx(
      "relative flex items-center justify-center w-2.5 h-2.5 rounded-full",
      getColors()
    )}>
      {pulse && (
        <span className={clsx(
          "absolute inset-0 rounded-full animate-ping opacity-40",
          getColors()
        )} />
      )}
      <span className={clsx(
        "absolute inset-0 rounded-full blur-[2px] opacity-60",
        getColors()
      )} />
    </div>
  );
}

interface CrowdIndicatorProps {
  density: 'low' | 'medium' | 'high'; // 0-100 logically mapping to this
}

export function CrowdIndicator({ density }: CrowdIndicatorProps) {
  const getColors = () => {
    switch (density) {
      case 'low': return 'text-state-success bg-state-success/10 border border-state-success/20';
      case 'medium': return 'text-state-warning bg-state-warning/10 border border-state-warning/20';
      case 'high': return 'text-state-danger bg-state-danger/10 border border-state-danger/20';
    }
  };
  
  const getLabel = () => {
    switch (density) {
      case 'low': return 'Smooth Flow';
      case 'medium': return 'Moderate Crowd';
      case 'high': return 'Heavy Congestion';
    }
  };

  return (
    <div className={clsx(
      "inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider",
      getColors()
    )}>
      {getLabel()}
    </div>
  );
}
