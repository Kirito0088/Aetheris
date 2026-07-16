"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function FooterPortal() {
  return (
    <footer className="relative w-full overflow-hidden bg-[#111111] py-32 px-4 md:py-48">
      {/* Background abstract element */}
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-20">
        <div className="h-[800px] w-[800px] rounded-full bg-gradient-to-tr from-blue-600/20 to-transparent blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center justify-center text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl text-balance text-5xl font-semibold tracking-tighter text-white md:text-7xl lg:text-8xl"
        >
          Step into the future of venue intelligence.
        </motion.h2>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="mt-16 flex flex-col gap-4 sm:flex-row"
        >
          <button className="group relative flex h-14 items-center justify-center gap-2 overflow-hidden rounded-full bg-white px-8 text-base font-medium text-[#111111] transition-transform hover:scale-105 active:scale-95">
            <span className="relative z-10">Request Access</span>
            <ArrowRight className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
          
          <button className="group relative flex h-14 items-center justify-center gap-2 rounded-full border border-white/20 bg-transparent px-8 text-base font-medium text-white transition-colors hover:bg-white/5 active:scale-95">
            Enterprise Demo
          </button>
        </motion.div>
      </div>
      
      {/* Footer bottom links */}
      <div className="relative z-10 mx-auto mt-32 flex max-w-7xl flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 text-sm text-gray-500 md:flex-row">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-white">Aetheris</span>
          <span>© {new Date().getFullYear()}</span>
        </div>
        <div className="flex gap-8">
          <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
          <Link href="#" className="hover:text-white transition-colors">System Status</Link>
        </div>
      </div>
    </footer>
  );
}
