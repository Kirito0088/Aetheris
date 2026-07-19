"use client";

/**
 * Aetheris Experience Selector — Client Component
 *
 * Pure presentational component for the role-selection gateway.
 * Receives user data from the Server Component parent (experience/page.tsx).
 *
 * Routing: All navigation is via `<Link>` elements — no client-side auth
 * guards or `useRouter` redirects. Auth security is handled server-side
 * by the middleware and the parent Server Component.
 *
 * Motion: Framer Motion hover interactions per DESIGN_LANGUAGE.md —
 * "every animation answers 'What changed?'"
 */

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Users, ClipboardList, Settings, ArrowRight } from "lucide-react";
import { useExperienceDirector, MOTION_EASINGS } from "@/features/experience";

// =============================================================================
// TYPES
// =============================================================================

interface ExperienceSelectorProps {
  /** Display name for personalized greeting — optional. */
  userName?: string | null;
}

// =============================================================================
// ANIMATION VARIANTS
// =============================================================================

const CARD_HOVER = {
  rest: { scale: 1, y: 0 },
  hover: {
    scale: 1.02,
    y: -4,
    transition: { duration: 0.25, ease: MOTION_EASINGS.decelerate },
  },
};

const CONTAINER_VARIANTS = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 24,
    },
  },
};

// =============================================================================
// PORTAL CARD DATA
// =============================================================================

const PORTALS = [
  {
    role: "fan" as const,
    href: "/fan",
    title: "Fan",
    description:
      "Navigate the stadium, find amenities, and get AI-guided directions. Mobile-first.",
    icon: Users,
    accentBg: "bg-blue-50",
    accentText: "text-blue-500",
    cta: "Enter as Fan",
  },
  {
    role: "volunteer" as const,
    href: "/volunteer",
    title: "Volunteer",
    description:
      "Receive intelligent task dispatch, assist fans, and translate in real-time.",
    icon: ClipboardList,
    accentBg: "bg-emerald-50",
    accentText: "text-emerald-500",
    cta: "Enter as Volunteer",
  },
  {
    role: "venue-operations" as const,
    href: "/venue-operations",
    title: "Venue Operations",
    description:
      "Full operational dashboard with crowd analytics, path planning, and dispatch.",
    icon: Settings,
    accentBg: "bg-amber-50",
    accentText: "text-amber-500",
    cta: "Enter Venue Operations",
  },
] as const;

// =============================================================================
// COMPONENT
// =============================================================================

export function ExperienceSelector({ userName }: ExperienceSelectorProps) {
  const setRole = useExperienceDirector((s) => s.setRole);

  const handleSelect = (role: "fan" | "volunteer" | "venue-operations") => {
    setRole(role);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[var(--surface-base)] p-6">
      <motion.div
        className="w-full max-w-4xl space-y-12"
        variants={CONTAINER_VARIANTS}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div className="text-center space-y-4" variants={ITEM_VARIANTS}>
          <h1 className="text-4xl font-bold tracking-tight text-[var(--text-primary)]">
            {userName
              ? `Welcome back, ${userName}`
              : "Choose Your Experience"}
          </h1>
          <p className="text-lg text-[var(--text-secondary)]">
            Select how you&apos;ll interact with the Stadium Intelligence
            Platform.
          </p>
        </motion.div>

        {/* Portal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PORTALS.map((portal) => {
            const Icon = portal.icon;
            return (
              <motion.div key={portal.role} variants={ITEM_VARIANTS}>
                <Link
                  href={portal.href}
                  className="block relative z-50"
                  onClick={() => handleSelect(portal.role)}
                >
                  <motion.div
                    variants={CARD_HOVER}
                    initial="rest"
                    whileHover="hover"
                    className="group p-8 rounded-2xl cursor-pointer space-y-6 transition-colors border border-[var(--border-subtle)] bg-[var(--surface-elevated)]"
                  >
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${portal.accentBg}`}
                    >
                      <Icon className={`w-6 h-6 ${portal.accentText}`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-[var(--text-primary)]">
                        {portal.title}
                      </h3>
                      <p className="text-sm mt-2 leading-relaxed text-[var(--text-secondary)]">
                        {portal.description}
                      </p>
                    </div>
                    <div
                      className={`flex items-center gap-2 text-sm font-semibold ${portal.accentText} group-hover:translate-x-1 transition-transform`}
                    >
                      {portal.cta} <ArrowRight className="w-4 h-4" />
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
