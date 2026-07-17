"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Map as MapIcon, Ticket, Compass } from "lucide-react";
import { clsx } from "clsx";
import { motion } from "framer-motion";
import { SignOutButton } from "@/components/auth/SignOutButton";

const navItems = [
  { name: "Dashboard", href: "/fan", icon: Home },
  { name: "Map", href: "/fan/map", icon: MapIcon },
  { name: "Tickets", href: "/fan/tickets", icon: Ticket },
  { name: "Guide", href: "/fan/guide", icon: Compass },
];

const MotionLink = motion.create(Link);

export function FanSidebar() {
  const pathname = usePathname();

  return (
    <motion.aside 
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: 256, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.2, 0.0, 0.0, 1.0] }}
      className="hidden md:flex h-full bg-surface-base/80 backdrop-blur-2xl border-r border-border-subtle flex-col pt-8 pb-4 overflow-hidden shrink-0 relative z-40"
    >
      {/* Brand Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="px-6 mb-12 flex items-center gap-3"
      >
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-blue to-brand-emerald flex items-center justify-center shadow-glow-blue">
          <div className="w-3 h-3 bg-surface-elevated rounded-full" />
        </div>
        <div>
          <h1 className="text-[length:var(--font-size-base)] font-bold tracking-tight text-text-primary leading-tight">
            Aetheris
          </h1>
          <p className="text-[length:var(--font-size-xs)] text-text-tertiary font-medium">Fan Portal</p>
        </div>
      </motion.div>

      {/* Navigation */}
      <motion.nav 
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.05, delayChildren: 0.1 }
          }
        }}
        aria-label="Fan portal"
        className="flex-1 px-4 space-y-1.5"
      >
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/fan" && pathname.startsWith(item.href));

          return (
            <MotionLink
              key={item.name}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              variants={{
                hidden: { opacity: 0, x: -10 },
                visible: { 
                  opacity: 1, 
                  x: 0,
                  transition: { duration: 0.4, ease: [0.2, 0.0, 0.0, 1.0] }
                }
              }}
              whileHover={{ scale: 0.98 }}
              whileTap={{ scale: 0.96 }}
              className={clsx(
                "relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-[length:var(--font-size-sm)] font-medium transition-colors duration-200 z-10",
                isActive ? "text-brand-blue" : "text-text-secondary hover:text-text-primary"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="fan-sidebar-active-indicator"
                  className="absolute inset-0 bg-nav-selected rounded-xl z-[-1]"
                  transition={{ type: "spring", bounce: 0, duration: 0.5 }}
                />
              )}
              {isActive && (
                <motion.div 
                  layoutId="fan-sidebar-active-border"
                  className="absolute left-0 top-2 bottom-2 w-1 bg-brand-blue rounded-r-full"
                  transition={{ type: "spring", bounce: 0, duration: 0.5 }}
                />
              )}
              <item.icon className="w-[18px] h-[18px]" strokeWidth={isActive ? 2.5 : 2} />
              {item.name}
            </MotionLink>
          );
        })}
      </motion.nav>

      {/* Sign Out */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="px-4 mt-auto"
      >
        <SignOutButton variant="sidebar" />
      </motion.div>
    </motion.aside>
  );
}
