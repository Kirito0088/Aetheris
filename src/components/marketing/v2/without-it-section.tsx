"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { AlertCircle, EyeOff, Users } from "lucide-react";

export function WithoutItSection() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <section 
      ref={containerRef}
      className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#111111] py-32 text-white"
    >
      {/* Subtle animated grid background */}
      <motion.div 
        style={{ y: backgroundY }}
        className="absolute inset-0 z-0 opacity-20"
      >
        <div className="h-[200%] w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </motion.div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl"
        >
          <h2 className="text-balance text-4xl font-semibold tracking-tighter text-white md:text-5xl lg:text-7xl">
            Without spatial intelligence, a venue is just concrete and blind spots.
          </h2>
          <p className="mt-8 text-balance text-lg text-gray-400 md:text-xl">
            Legacy systems trap operators in a reactive cycle. When you can't see the full picture, minor congestions cascade into critical safety hazards.
          </p>
        </motion.div>

        <div className="mt-24 grid w-full grid-cols-1 gap-8 md:grid-cols-3">
          <ProblemCard
            icon={<EyeOff className="h-5 w-5 text-red-400" />}
            title="Choke Points Hidden"
            description="Traditional CCTV lacks the ability to quantify density, leaving critical bottlenecks undetected until they are overwhelmed."
            delay={0.1}
          />
          <ProblemCard
            icon={<AlertCircle className="h-5 w-5 text-orange-400" />}
            title="Reactions Replace Strategy"
            description="Security teams are forced to respond to incidents after they happen, rather than preemptively routing crowds away from danger."
            delay={0.2}
          />
          <ProblemCard
            icon={<Users className="h-5 w-5 text-yellow-400" />}
            title="Staff Deployment Guesswork"
            description="Personnel are stationed based on historical assumptions, not real-time data, leading to misallocated resources during peak surges."
            delay={0.3}
          />
        </div>
      </div>
    </section>
  );
}

function ProblemCard({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay }}
      className="flex flex-col items-center gap-4 text-center"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10">
        {icon}
      </div>
      <h3 className="text-xl font-medium text-white">{title}</h3>
      <p className="text-base leading-relaxed text-gray-400">{description}</p>
    </motion.div>
  );
}
