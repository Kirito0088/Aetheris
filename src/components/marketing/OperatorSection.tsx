"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export function OperatorSection() {
  return (
    <section className="relative min-h-[120vh] bg-[var(--surface-base)] flex items-center justify-center py-32 px-6">
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        
        {/* Left: Text & UI Fragments */}
        <div className="order-2 lg:order-1 flex flex-col items-start">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-sans font-semibold tracking-tight text-[var(--text-primary)] mb-8"
          >
            Empowering the <br/>people in the room.
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-xl text-[var(--text-secondary)] leading-relaxed mb-12 max-w-lg"
          >
            Aetheris doesn't replace venue operators; it gives them superhuman spatial awareness. Making complex decisions simple, fast, and unerringly accurate.
          </motion.p>

          {/* Floating UI Widget */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="bg-white border border-black/10 rounded-2xl p-6 shadow-xl w-full max-w-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-medium text-[var(--text-tertiary)] uppercase">Action Required</span>
              <span className="w-2 h-2 rounded-full bg-[var(--brand-blue)] animate-pulse" />
            </div>
            <p className="font-medium text-[var(--text-primary)] mb-4">
              Divert East Concourse traffic to Level 2.
            </p>
            <div className="flex gap-3">
              <button className="flex-1 bg-black text-white text-sm font-medium py-2 rounded-lg hover:bg-black/80 transition-colors">Execute</button>
              <button className="flex-1 bg-[var(--surface-base)] text-[var(--text-primary)] text-sm font-medium py-2 rounded-lg border border-black/10 hover:bg-[var(--surface-sunken)] transition-colors">Dismiss</button>
            </div>
          </motion.div>
        </div>

        {/* Right: High Contrast Portrait */}
        <div className="order-1 lg:order-2 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative aspect-[3/4] w-full max-w-md mx-auto rounded-3xl overflow-hidden bg-[var(--surface-sunken)]"
          >
            <Image 
              src="/images/operator.jpg" 
              alt="Venue Operator at command center"
              fill
              className="object-cover grayscale contrast-125 mix-blend-multiply" 
            />
            {/* Subtle overlay to soften */}
            <div className="absolute inset-0 bg-black/5" />
          </motion.div>
          
          {/* Decorative Technical Accents */}
          <div className="absolute -bottom-6 -right-6 text-xs font-mono text-[var(--text-tertiary)] rotate-90 origin-bottom-right">
            OP-ID: 4492 // SECTOR 7G
          </div>
        </div>

      </div>
    </section>
  );
}
