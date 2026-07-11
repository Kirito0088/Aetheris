"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Users, ClipboardList, Settings, ArrowRight } from "lucide-react";
import { useExperienceDirector, MOTION_EASINGS } from "@/features/experience";

export default function ExperienceSelectorPage() {
  const router = useRouter();
  const setRole = useExperienceDirector((s) => s.setRole);

  const handleSelect = (role: 'fan' | 'volunteer' | 'venue-operations', path: string) => {
    setRole(role);
    router.push(path);
  };

  const CARD_HOVER = {
    rest: { scale: 1, y: 0 },
    hover: { scale: 1.02, y: -4, transition: { duration: 0.25, ease: MOTION_EASINGS.decelerate } },
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[var(--surface-base)] p-6">
      <div className="w-full max-w-4xl space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-[var(--text-primary)]">
            Choose Your Experience
          </h1>
          <p className="text-lg text-[var(--text-secondary)]">
            Select how you'll interact with the Stadium Intelligence Platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Fan */}
          <motion.div
            variants={CARD_HOVER}
            initial="rest"
            whileHover="hover"
            onClick={() => handleSelect('fan', '/fan')}
            className="group p-8 rounded-2xl cursor-pointer space-y-6 transition-colors border border-[var(--border-subtle)] bg-[var(--surface-elevated)]"
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-50">
              <Users className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[var(--text-primary)]">Fan</h3>
              <p className="text-sm mt-2 leading-relaxed text-[var(--text-secondary)]">
                Navigate the stadium, find amenities, and get AI-guided directions. Mobile-first.
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold text-blue-500 group-hover:translate-x-1 transition-transform">
              Enter as Fan <ArrowRight className="w-4 h-4" />
            </div>
          </motion.div>

          {/* Volunteer */}
          <motion.div
            variants={CARD_HOVER}
            initial="rest"
            whileHover="hover"
            onClick={() => handleSelect('volunteer', '/volunteer')}
            className="group p-8 rounded-2xl cursor-pointer space-y-6 transition-colors border border-[var(--border-subtle)] bg-[var(--surface-elevated)]"
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-emerald-50">
              <ClipboardList className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[var(--text-primary)]">Volunteer</h3>
              <p className="text-sm mt-2 leading-relaxed text-[var(--text-secondary)]">
                Receive intelligent task dispatch, assist fans, and translate in real-time.
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold text-emerald-500 group-hover:translate-x-1 transition-transform">
              Enter as Volunteer <ArrowRight className="w-4 h-4" />
            </div>
          </motion.div>

          {/* Venue Operations */}
          <motion.div
            variants={CARD_HOVER}
            initial="rest"
            whileHover="hover"
            onClick={() => handleSelect('venue-operations', '/venue-operations')}
            className="group p-8 rounded-2xl cursor-pointer space-y-6 transition-colors border border-[var(--border-subtle)] bg-[var(--surface-elevated)]"
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-amber-50">
              <Settings className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[var(--text-primary)]">Venue Operations</h3>
              <p className="text-sm mt-2 leading-relaxed text-[var(--text-secondary)]">
                Full operational dashboard with crowd analytics, path planning, and dispatch.
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold text-amber-500 group-hover:translate-x-1 transition-transform">
              Enter Venue Operations <ArrowRight className="w-4 h-4" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
