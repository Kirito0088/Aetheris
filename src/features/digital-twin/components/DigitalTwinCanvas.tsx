'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { SceneManager } from '../scene';

export function DigitalTwinCanvas() {
  return (
    <div 
      className="w-full h-full bg-[#0a0a0a]"
      role="region" 
      aria-label="Interactive Living Digital Twin"
    >
      <Suspense fallback={<div className="flex items-center justify-center w-full h-full text-white">Loading Digital Twin...</div>}>
        <Canvas shadows dpr={[1, 2]}>
          <SceneManager />
        </Canvas>
      </Suspense>
    </div>
  );
}
