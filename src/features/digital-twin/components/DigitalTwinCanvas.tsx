'use client';

import { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { SceneManager } from '../scene';

/**
 * DigitalTwinCanvas — Persistent 3D canvas for the Digital Twin.
 *
 * POINTER EVENT FIX: Uses `eventSource` and `eventPrefix` to scope
 * canvas pointer events to the canvas container only. This prevents
 * HTML buttons/UI from accidentally triggering 3D interactions.
 *
 * The canvas container div is the event source — only pointer events
 * originating inside this div are forwarded to React Three Fiber.
 * HTML elements in the z-10 layer above naturally receive priority.
 */
export function DigitalTwinCanvas() {
  const containerRef = useRef<HTMLDivElement>(null!);

  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-[hsl(40,38%,98%)]"
      role="region"
      aria-label="Interactive Living Digital Twin"
    >
      <Suspense fallback={<div className="flex items-center justify-center w-full h-full text-[var(--text-tertiary)] text-sm">Loading Digital Twin...</div>}>
        <Canvas
          shadows
          dpr={[1, 2]}
          eventSource={containerRef}
          eventPrefix="offset"
          style={{ pointerEvents: 'none' }}
        >
          <SceneManager />
        </Canvas>
      </Suspense>
    </div>
  );
}
