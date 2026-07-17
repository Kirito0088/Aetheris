"use client";

import React, { useRef } from "react";
import { useDatabaseStore } from "@/store/useDatabaseStore";
import { DigitalTicket } from "@/components/ui/DigitalTicket";
import { UnifiedStadiumMap, type UnifiedStadiumMapHandle } from "@/components/shared/UnifiedStadiumMap";
import { motion } from "framer-motion";

export default function TicketsPage() {
  const { tickets } = useDatabaseStore();
  const mapRef = useRef<UnifiedStadiumMapHandle>(null);

  // For this demo, grab the first ticket
  const ticket = Object.values(tickets)[0];

  const handleTicketClick = () => {
    if (ticket && mapRef.current) {
      // We map the ticket's gate to a zone ID for the demo
      const gateToZoneMap: Record<string, string> = {
        'Gate C': 'north-gate',
        'Gate A': 'south-gate',
      };
      const zoneId = gateToZoneMap[ticket.gate] || 'sector-104';
      
      // Cinematic 60fps buttery smooth zoom
      mapRef.current.focusZone(zoneId);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8 min-h-[calc(100vh-100px)] flex flex-col">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.2, 0.0, 0.0, 1.0] }}
        className="w-full"
      >
        <h1 className="text-[length:var(--font-size-3xl)] font-bold text-text-primary tracking-tight mb-2">My Tickets</h1>
        <p className="text-text-secondary text-[length:var(--font-size-sm)] font-medium mb-8">Tap your ticket to view entry details.</p>
        
        {ticket ? (
          <DigitalTicket ticket={ticket} onClick={handleTicketClick} />
        ) : (
          <div className="p-8 text-center text-text-tertiary bg-surface-elevated rounded-3xl border border-border-subtle">
            No active tickets found.
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2, type: "spring", bounce: 0.2 }}
        className="flex-1 w-full flex flex-col"
      >
        <h2 className="text-[length:var(--font-size-xl)] font-bold text-text-primary tracking-tight mb-4 px-2">Stadium Navigator</h2>
        <div className="flex-1 min-h-[400px] w-full relative z-10">
          <UnifiedStadiumMap ref={mapRef} mode="fan" />
        </div>
      </motion.div>
    </div>
  );
}
