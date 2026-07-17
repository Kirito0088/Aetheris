"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Map, Users, AlertTriangle } from "lucide-react";
import clsx from "clsx";
import { motion } from "framer-motion";
import { MOTION_TIMINGS, MOTION_EASINGS } from "@/features/experience";
import { SignOutButton } from "@/components/auth/SignOutButton";

const venueOperationsItems = [
  { name: "Dashboard", href: "/venue-operations", icon: Home },
  { name: "Venue Guide", href: "/venue-operations/guide", icon: Map },
  { name: "Dispatch", href: "/venue-operations/dispatch", icon: Users },
  { name: "Incidents", href: "/venue-operations/incidents", icon: AlertTriangle },
];

const MotionLink = motion.create(Link);

export function Sidebar({ _persona }: { _persona?: 'venue-operations' }) {
  const pathname = usePathname();

  return (
    <motion.aside 
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: 256, opacity: 1 }}
      transition={{ 
        duration: MOTION_TIMINGS.hero / 1000, 
        ease: MOTION_EASINGS.emphasized 
      }}
      className="h-full bg-surface-base/60 backdrop-blur-2xl border-r border-border-subtle flex flex-col pt-8 pb-4 overflow-hidden shrink-0 relative z-navigation"
    >
      <motion.div 
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: MOTION_TIMINGS.transition / 1000 }}
        className="px-6 mb-10 flex items-center gap-3"
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-blue to-brand-emerald flex items-center justify-center shadow-glow-blue">
          <div className="w-3 h-3 bg-surface-elevated rounded-full" />
        </div>
        <div>
          <h1 className="text-[length:var(--font-size-base)] font-semibold tracking-tight text-text-primary leading-tight">
            Aetheris
          </h1>
          <p className="text-[length:var(--font-size-xs)] text-text-tertiary font-medium">Operations</p>
        </div>
      </motion.div>

      <motion.nav 
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.04,
              delayChildren: 0.1
            }
          }
        }}
        className="flex-1 px-3 space-y-1"
      >
        {venueOperationsItems.map((item) => {
          const isActive = 
            pathname === item.href || 
            (item.href !== "/venue-operations" && pathname.startsWith(item.href));

          return (
            <MotionLink
              key={item.name}
              href={item.href}
              variants={{
                hidden: { opacity: 0, x: -8 },
                visible: { 
                  opacity: 1, 
                  x: 0,
                  transition: { duration: MOTION_TIMINGS.transition / 1000, ease: MOTION_EASINGS.decelerate }
                }
              }}
              whileHover={{ scale: 0.98 }}
              whileTap={{ scale: 0.96 }}
              className={clsx(
                "relative flex items-center gap-3 px-3 py-2 rounded-md text-[length:var(--font-size-sm)] font-medium transition-colors duration-200 z-10",
                isActive 
                  ? "text-brand-blue"
                  : "text-text-secondary hover:text-text-primary"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active-indicator"
                  className="absolute inset-0 bg-nav-selected rounded-md z-[-1]"
                  transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                />
              )}
              {/* Very subtle left accent line for Linear feel */}
              {isActive && (
                <motion.div 
                  layoutId="sidebar-active-border"
                  className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-brand-blue rounded-r-full"
                  transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                />
              )}
              <item.icon className="w-[18px] h-[18px]" strokeWidth={isActive ? 2.5 : 2} />
              {item.name}
            </MotionLink>
          );
        })}
      </motion.nav>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: MOTION_TIMINGS.transition / 1000 }}
        className="px-3 mt-auto"
      >
        <SignOutButton variant="sidebar" />
      </motion.div>
    </motion.aside>
  );
}
