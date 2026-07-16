"use client";

import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

export function HeroSection() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 200]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);
  const scale = useTransform(scrollY, [0, 500], [1, 1.05]);

  return (
    <section className="relative flex min-h-[100dvh] w-full flex-col items-center justify-center overflow-hidden bg-[#FBFBFA]">
      {/* Cinematic Background */}
      <motion.div 
        style={{ y, scale }}
        className="absolute inset-0 z-0 h-full w-full"
      >
        <Image
          src="/images/cinematic_stadium_wide.jpg"
          alt="Massive modern sports stadium packed with fans, glowing under evening lights"
          fill
          priority
          className="object-cover object-center opacity-[0.25] mix-blend-multiply grayscale-[30%]"
        />
        {/* Subtle radial gradient overlay to ensure text contrast */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#FBFBFA_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#FBFBFA] via-[#FBFBFA]/80 to-transparent" />
      </motion.div>

      {/* Hero Content */}
      <motion.div 
        style={{ opacity }}
        className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-4 pt-24 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 32, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        >
          <span className="mb-8 inline-block rounded-full border border-black/10 bg-black/5 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.2em] text-[#111111]">
            Official Intelligence Platform of the FIFA World Cup 2026™
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="text-balance text-5xl font-semibold tracking-tighter text-[#111111] md:text-7xl lg:text-8xl"
        >
          Aetheris quietly orchestrates <br className="hidden md:block" />
          every fan journey.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          className="mt-8 max-w-[500px] text-balance text-lg font-medium leading-relaxed text-gray-500 md:text-xl"
        >
          Inside the world's largest sporting events, spatial intelligence prevents chaos. The journey is protected before the match begins.
        </motion.p>
      </motion.div>
    </section>
  );
}
