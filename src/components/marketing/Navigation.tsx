"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useLandingMotion } from "@/components/marketing/LandingDirector";

const NAV_LINKS = [
  { label: "Platform", href: "#" },
  { label: "Intelligence", href: "#" },
  { label: "Security", href: "#" },
  { label: "Operations", href: "#" },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { scrollYProgress } = useLandingMotion();

  // Hide nav during Scene 3 (Wiper) and Scene 6 (CTA Takeover)
  const navOpacity = useTransform(
    scrollYProgress, 
    [0, 0.32, 0.35, 0.60, 0.63, 0.82, 0.85], 
    [1, 1, 0, 0, 1, 1, 0]
  );

  return (
    <>
      {/* FLUID ISLAND NAV */}
      <motion.nav
        style={{ opacity: navOpacity }}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between px-6 py-3 w-[calc(100%-3rem)] max-w-5xl rounded-full bg-white/80 backdrop-blur-md border border-white/40 shadow-[0_4px_32px_rgba(0,0,0,0.04)]"
      >
        <Link href="/" className="relative z-50 flex items-center gap-3">
          <div className="w-8 h-8 relative">
            <Image
              src="/Aetheris_Icon.png"
              alt="Aetheris Logo"
              fill
              className="object-contain"
            />
          </div>
          <span className="font-sans font-medium text-[var(--text-primary)] tracking-tight">
            Aetheris
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <button className="text-sm font-semibold text-white bg-[var(--text-primary)] px-5 py-2 rounded-full hover:bg-black transition-colors">
            Enter Platform
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative z-50 w-10 h-10 flex flex-col items-center justify-center gap-[4px] md:hidden group"
          aria-label="Toggle Menu"
        >
          <motion.div
            animate={{
              rotate: isOpen ? 45 : 0,
              y: isOpen ? 6 : 0,
            }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="w-5 h-[1.5px] bg-[var(--text-primary)] origin-center"
          />
          <motion.div
            animate={{
              opacity: isOpen ? 0 : 1,
            }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="w-5 h-[1.5px] bg-[var(--text-primary)]"
          />
          <motion.div
            animate={{
              rotate: isOpen ? -45 : 0,
              y: isOpen ? -6 : 0,
            }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="w-5 h-[1.5px] bg-[var(--text-primary)] origin-center"
          />
        </button>
      </motion.nav>

      {/* FULL SCREEN OVERLAY (Mobile) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 bg-white/90 backdrop-blur-xl flex flex-col justify-center px-8"
          >
            <div className="flex flex-col gap-6">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.05,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-4xl font-serif font-medium text-[var(--text-primary)] tracking-tight"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{
                  duration: 0.5,
                  delay: NAV_LINKS.length * 0.05,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="mt-4"
              >
                <button className="text-lg font-semibold text-white bg-[var(--text-primary)] px-8 py-4 rounded-full w-full">
                  Enter Platform
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
