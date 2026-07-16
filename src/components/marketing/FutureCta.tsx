"use client";

import React from "react";
import { motion } from "framer-motion";

export function FutureCta() {
  return (
    <section className="relative bg-[var(--surface-base)] py-40 px-6 flex flex-col items-center justify-center text-center">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-4xl w-full flex flex-col items-center"
      >
        <span className="text-sm font-mono font-medium text-[var(--text-tertiary)] uppercase tracking-widest mb-8">
          The Next Generation of Venues
        </span>
        <h2 className="text-6xl md:text-8xl font-serif font-medium text-[var(--text-primary)] tracking-tight leading-tight mb-12 text-balance">
          Ready for <br/> <span className="italic">the world.</span>
        </h2>
        
        <button className="bg-[var(--text-primary)] text-[var(--text-inverse)] px-10 py-5 rounded-full text-lg font-medium hover:bg-black transition-all hover:scale-105 active:scale-95 shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
          Explore the Platform
        </button>
      </motion.div>
    </section>
  );
}
