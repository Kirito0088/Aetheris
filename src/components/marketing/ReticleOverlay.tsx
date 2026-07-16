"use client";

import React from "react";

export function ReticleOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-6 md:p-12 lg:p-24 opacity-40">
      {/* Top Left */}
      <div className="absolute top-6 left-6 md:top-12 md:left-12 lg:top-24 lg:left-24">
        <div className="w-8 h-[1px] bg-black" />
        <div className="w-[1px] h-8 bg-black" />
      </div>
      {/* Top Right */}
      <div className="absolute top-6 right-6 md:top-12 md:right-12 lg:top-24 lg:right-24 flex flex-col items-end">
        <div className="w-8 h-[1px] bg-black" />
        <div className="w-[1px] h-8 bg-black absolute top-0 right-0" />
      </div>
      {/* Bottom Left */}
      <div className="absolute bottom-6 left-6 md:bottom-12 md:left-12 lg:bottom-24 lg:left-24 flex flex-col justify-end">
        <div className="w-[1px] h-8 bg-black absolute bottom-0 left-0" />
        <div className="w-8 h-[1px] bg-black" />
      </div>
      {/* Bottom Right */}
      <div className="absolute bottom-6 right-6 md:bottom-12 md:right-12 lg:bottom-24 lg:right-24 flex justify-end items-end">
        <div className="w-8 h-[1px] bg-black absolute bottom-0 right-0" />
        <div className="w-[1px] h-8 bg-black absolute bottom-0 right-0" />
      </div>

      {/* Center Crosshair Optional */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20">
        <div className="w-12 h-[1px] bg-black absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <div className="w-[1px] h-12 bg-black absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>
    </div>
  );
}
