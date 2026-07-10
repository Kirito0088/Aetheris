"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Map, 
  Navigation, 
  Accessibility, 
  Settings 
} from "lucide-react";
import clsx from "clsx";
import { motion } from "framer-motion";
import { MOTION_TIMINGS, MOTION_EASINGS, useExperienceDirector } from "@/features/experience";

const fanNavItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Live Stadium", href: "/live", icon: Map },
  { name: "Navigation", href: "/navigation", icon: Navigation },
  { name: "Accessibility", href: "/accessibility", icon: Accessibility },
];

const organizerNavItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Live Stadium", href: "/live", icon: Map },
  { name: "Navigation", href: "/navigation", icon: Navigation },
  { name: "Accessibility", href: "/accessibility", icon: Accessibility },
  { name: "Operations", href: "/operations", icon: Settings },
];

const MotionLink = motion.create(Link);

export function Sidebar() {
  const pathname = usePathname();
  const role = useExperienceDirector((s) => s.role);
  const navItems = role === 'fan' ? fanNavItems : organizerNavItems;

  return (
    <motion.aside 
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: 256, opacity: 1 }}
      transition={{ 
        duration: MOTION_TIMINGS.hero / 1000, 
        ease: MOTION_EASINGS.emphasized 
      }}
      className="h-full bg-[var(--surface-base)] border-r border-[var(--border-subtle)] flex flex-col pt-8 pb-4 overflow-hidden shrink-0"
    >
      <motion.div 
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: MOTION_TIMINGS.transition / 1000 }}
        className="px-6 mb-12"
      >
        <h1 className="text-[var(--font-size-xl)] font-bold tracking-tight text-[var(--text-primary)]">
          Aetheris
        </h1>
      </motion.div>

      <motion.nav 
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.05,
              delayChildren: 0.15
            }
          }
        }}
        className="flex-1 px-4 space-y-1"
      >
        {navItems.map((item) => {
          const isActive = 
            pathname === item.href || 
            (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <MotionLink
              key={item.name}
              href={item.href}
              variants={{
                hidden: { opacity: 0, x: -12 },
                visible: { 
                  opacity: 1, 
                  x: 0,
                  transition: { duration: MOTION_TIMINGS.transition / 1000, ease: MOTION_EASINGS.decelerate }
                }
              }}
              whileHover={{ scale: 0.98 }}
              whileTap={{ scale: 0.96 }}
              className={clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] text-[var(--font-size-sm)] font-medium transition-colors duration-[var(--duration-feedback)] ease-[var(--ease-standard)]",
                isActive 
                  ? "bg-[var(--nav-selected)] text-[var(--nav-active)] border-l-2 border-[var(--nav-active)] rounded-l-none"
                  : "text-[var(--text-secondary)] hover:bg-[var(--nav-hover)] hover:text-[var(--text-primary)]"
              )}
            >
              <item.icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
              {item.name}
            </MotionLink>
          );
        })}
      </motion.nav>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: MOTION_TIMINGS.transition / 1000 }}
        className="px-6 mt-auto"
      >
        <div className="text-[var(--font-size-xs)] text-[var(--text-tertiary)] flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>System Normal</span>
        </div>
      </motion.div>
    </motion.aside>
  );
}

