"use client";

import React from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Ticket, MapPin, ScanLine } from "lucide-react";
import { type DBTicket } from "@/store/useDatabaseStore";

interface DigitalTicketProps {
  ticket: DBTicket;
  onClick: () => void;
}

export function DigitalTicket({ ticket, onClick }: DigitalTicketProps) {
  // Mouse tracking for the holographic tilt effect
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  
  const rotateX = useTransform(y, [0, 1], [5, -5]);
  const rotateY = useTransform(x, [0, 1], [-5, 5]);

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left) / rect.width);
    y.set((event.clientY - rect.top) / rect.height);
  }

  function handleMouseLeave() {
    x.set(0.5);
    y.set(0.5);
  }

  return (
    <motion.div
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      style={{ rotateX, rotateY, perspective: 1000 }}
      className="relative w-full max-w-sm mx-auto cursor-pointer rounded-[32px] bg-surface-elevated shadow-elevation-3 border border-border-subtle overflow-hidden"
    >
      {/* 21st dev / Aceternity inspired holographic sheen overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-10 mix-blend-overlay opacity-30"
        style={{
          background: `radial-gradient(circle at ${useTransform(x, v => v * 100)}% ${useTransform(y, v => v * 100)}%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 60%)`
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent skew-x-[-20deg] animate-[aetheris-sheen_3s_infinite] pointer-events-none z-10 opacity-0 group-hover:opacity-100" />

      {/* Top Banner Accent */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-brand-blue to-brand-emerald" />

      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-emerald animate-pulse" />
              <span className="text-[10px] font-bold text-brand-emerald uppercase tracking-wider">Verified Match Pass</span>
            </div>
            <h2 className="text-[length:var(--font-size-2xl)] font-bold text-text-primary tracking-tight leading-none">{ticket.match}</h2>
            <p className="text-[length:var(--font-size-sm)] text-text-secondary font-medium mt-1">{ticket.date}</p>
          </div>
          <div className="bg-surface-sunken p-2 rounded-xl">
            <ScanLine className="w-6 h-6 text-brand-blue" />
          </div>
        </div>

        {/* Core Details Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col bg-surface-base p-3 rounded-xl border border-border-subtle">
            <div className="flex items-center gap-1.5 text-text-tertiary mb-1">
              <Ticket className="w-3 h-3" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Sector</span>
            </div>
            <div className="text-[length:var(--font-size-xl)] font-bold text-text-primary">{ticket.sector}</div>
            <div className="text-[length:var(--font-size-xs)] text-text-secondary mt-0.5">Row {ticket.row}, Seat {ticket.seat}</div>
          </div>
          <div className="flex flex-col bg-surface-base p-3 rounded-xl border border-border-subtle">
            <div className="flex items-center gap-1.5 text-text-tertiary mb-1">
              <MapPin className="w-3 h-3" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Gate</span>
            </div>
            <div className="text-[length:var(--font-size-xl)] font-bold text-text-primary">{ticket.gate}</div>
            <div className="text-[10px] font-medium text-brand-blue bg-brand-blue/10 px-2 py-0.5 rounded-md mt-1 w-fit">
              Tap to view map
            </div>
          </div>
        </div>
      </div>

      {/* Perforated Edge Divider */}
      <div className="relative h-6 w-full flex items-center justify-between px-[-10px]">
        <div className="absolute top-1/2 -translate-y-1/2 left-0 w-3 h-6 bg-[var(--surface-base)] rounded-r-full border-r border-y border-border-subtle z-20" />
        <div className="absolute top-1/2 -translate-y-1/2 right-0 w-3 h-6 bg-[var(--surface-base)] rounded-l-full border-l border-y border-border-subtle z-20" />
        <div className="absolute top-1/2 left-4 right-4 border-t-2 border-dashed border-border-subtle" />
      </div>

      {/* Footer / Barcode Area */}
      <div className="p-6 pt-4 text-center">
        <div className="w-full h-12 flex flex-col justify-between mb-2 opacity-60">
          <div className="w-full h-0.5 bg-text-primary" />
          <div className="w-full h-1.5 bg-text-primary" />
          <div className="w-full h-1 bg-text-primary" />
          <div className="w-full h-2 bg-text-primary" />
          <div className="w-full h-0.5 bg-text-primary" />
          <div className="w-full h-1 bg-text-primary" />
        </div>
        <span className="text-[10px] font-mono tracking-[0.2em] text-text-tertiary uppercase">AE-{ticket.id}-2026</span>
      </div>
    </motion.div>
  );
}
