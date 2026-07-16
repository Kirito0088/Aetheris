"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";
import Link from "next/link";

const MotionLink = motion.create(Link);

export function FluidNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-6 left-0 right-0 z-50 mx-auto w-max"
      >
        <div className="flex items-center gap-8 rounded-full border border-black/5 bg-white/70 px-4 py-2.5 backdrop-blur-2xl shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
          
          <div className="flex items-center gap-2 pl-2">
            <span className="font-sans text-lg font-semibold tracking-tight text-[#111111]">
              Aetheris
            </span>
          </div>

          <div className="hidden items-center gap-6 md:flex">
            <NavLink href="#capabilities">Capabilities</NavLink>
            <NavLink href="#scale">Scale</NavLink>
            <NavLink href="#trust">Trust</NavLink>
          </div>

          <div className="flex items-center gap-2">
            <MotionLink
              href="/experience"
              whileHover="hover"
              whileTap={{ scale: 0.98 }}
              className="group relative flex items-center gap-2 rounded-full bg-[#111111] pl-5 pr-1.5 py-1.5 text-sm font-medium text-white transition-colors"
            >
              <span>Enter Platform</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 transition-transform group-hover:bg-white/20">
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </MotionLink>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden flex h-10 w-10 items-center justify-center rounded-full bg-black/5"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-white/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex h-full flex-col justify-center px-8">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute right-6 top-8 flex h-12 w-12 items-center justify-center rounded-full bg-black/5"
              >
                <X className="h-5 w-5" />
              </button>
              
              <div className="flex flex-col gap-6 text-3xl font-medium tracking-tight">
                <MobileNavLink href="#capabilities" onClick={() => setIsOpen(false)}>Capabilities</MobileNavLink>
                <MobileNavLink href="#scale" onClick={() => setIsOpen(false)}>Scale</MobileNavLink>
                <MobileNavLink href="#trust" onClick={() => setIsOpen(false)}>Trust</MobileNavLink>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="text-sm font-medium text-gray-500 transition-colors hover:text-[#111111]"
    >
      {children}
    </a>
  );
}

function MobileNavLink({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <motion.a
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      href={href}
      onClick={onClick}
      className="border-b border-black/5 pb-4 text-[#111111]"
    >
      {children}
    </motion.a>
  );
}
