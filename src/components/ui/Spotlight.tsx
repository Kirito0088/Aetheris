'use client';

import React, { createContext, useContext, useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface SpotlightProps {
  children: React.ReactNode;
  className?: string;
  proximitySpotlight?: boolean;
  hoverFocusSpotlight?: boolean;
  cursorFlowGradient?: boolean;
}

interface SpotlightItemProps {
  children: React.ReactNode;
  className?: string;
}

interface SpotLightContextType {
  proximitySpotlight: boolean;
  hoverFocusSpotlight: boolean;
  cursorFlowGradient: boolean;
}

const SpotLightContext = createContext<SpotLightContextType | undefined>(undefined);

export const useSpotlight = () => {
  const context = useContext(SpotLightContext);
  if (!context) {
    throw new Error('useSpotlight must be used within a SpotlightProvider');
  }
  return context;
};

export const Spotlight = ({
  children,
  className,
  proximitySpotlight = true,
  hoverFocusSpotlight = false,
  cursorFlowGradient = true,
}: SpotlightProps) => {
  return (
    <SpotLightContext.Provider
      value={{
        proximitySpotlight,
        hoverFocusSpotlight,
        cursorFlowGradient,
      }}
    >
      <div className={cn('group relative z-10', className)}>{children}</div>
    </SpotLightContext.Provider>
  );
};

export function SpotLightItem({ children, className }: SpotlightItemProps) {
  const { hoverFocusSpotlight, proximitySpotlight, cursorFlowGradient } = useSpotlight();
  const boxWrapper = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const updateMousePosition = (ev: MouseEvent) => {
      setMousePosition({ x: ev.clientX, y: ev.clientY });
    };
    window.addEventListener('mousemove', updateMousePosition);
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);

  const [overlayColor, setOverlayColor] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!boxWrapper.current) return;
    const { left, top } = boxWrapper.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    setOverlayColor({ x, y });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => cursorFlowGradient && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      ref={boxWrapper}
      className={cn(
        'relative rounded-xl p-[1px] overflow-hidden bg-zinc-800/40 border border-zinc-800/40 transition-all duration-300',
        className
      )}
    >
      {/* Cursor Flow Gradient (local to card bounds on hover) */}
      {isHovered && (
        <div
          className="pointer-events-none absolute opacity-0 z-10 rounded-xl w-full h-full group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(
              200px circle at ${overlayColor.x}px ${overlayColor.y}px,
              rgba(59, 130, 246, 0.08),
              transparent 85%
            )`,
            inset: 0,
          }}
        />
      )}

      {/* Hover Focus Spotlight (global mouse tracking within viewport when hovering) */}
      {hoverFocusSpotlight && (
        <div
          className="pointer-events-none absolute opacity-0 group-hover:opacity-100 z-10 inset-0 bg-fixed rounded-xl"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.08) 0%, transparent 20%)`,
          }}
        />
      )}

      {/* Proximity Spotlight (global mouse tracking) */}
      {proximitySpotlight && (
        <div
          className="pointer-events-none absolute inset-0 z-0 bg-fixed rounded-xl"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.04) 0%, transparent 25%)`,
          }}
        />
      )}

      {/* Content wrapper */}
      <div className="relative z-20 rounded-xl h-full w-full" style={{ background: 'var(--surface-glass-strong)', backdropFilter: 'blur(var(--blur-lg))' }}>
        {children}
      </div>
    </div>
  );
}

export default Spotlight;
