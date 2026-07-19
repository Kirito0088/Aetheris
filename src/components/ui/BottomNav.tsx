"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Map as MapIcon, Ticket, Compass, BookOpen } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { SignOutButton } from "@/components/auth/SignOutButton";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/* Navigation items per persona — optimized for mobile touch targets (48px+) */
const NAV_CONFIGS: Record<string, { href: string; icon: typeof Home; label: string }[]> = {
  fan: [
    { href: "/fan", icon: Home, label: "Home" },
    { href: "/fan/map", icon: MapIcon, label: "Map" },
    { href: "/fan/tickets", icon: Ticket, label: "Tickets" },
    { href: "/fan/guide", icon: Compass, label: "Guide" },
  ],
  volunteer: [
    { href: "/volunteer", icon: Home, label: "Radar" },
    { href: "/volunteer/guide", icon: BookOpen, label: "Guide" },
    { href: "/volunteer/translate", icon: Compass, label: "Translate" },
  ],
};

export function BottomNav({ persona = "fan" }: { persona?: string }) {
  const pathname = usePathname();
  const navItems = NAV_CONFIGS[persona] ?? NAV_CONFIGS.fan!;
  const basePath = persona === "volunteer" ? "/volunteer" : "/fan";

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pt-2 bg-gradient-to-t from-[var(--surface-base)] via-[var(--surface-base)]/90 to-transparent pointer-events-none md:hidden">
      <nav
        aria-label={`${persona} mobile navigation`}
        className="mx-auto max-w-md flex items-center justify-between bg-[var(--surface-glass-strong)] backdrop-blur-2xl border border-[var(--border-subtle)] shadow-[0_12px_36px_rgba(0,0,0,0.12)] rounded-full px-3 py-1.5 pointer-events-auto ring-1 ring-black/5"
      >
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (pathname.startsWith(item.href) && item.href !== basePath);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              aria-label={item.label}
              className="relative flex flex-col items-center justify-center min-w-[56px] min-h-[48px] px-2 py-1 transition-transform active:scale-95"
            >
              {/* Active Bubble (Spring physics animation) */}
              {isActive && (
                <motion.div
                  layoutId="bottomNavActiveBubble"
                  className="absolute inset-0 bg-[var(--nav-selected)] rounded-full"
                  transition={{ type: "spring", stiffness: 350, damping: 28 }}
                />
              )}

              <div className="relative z-10 flex flex-col items-center justify-center gap-0.5">
                <Icon
                  className={cn(
                    "w-5 h-5 transition-colors duration-200",
                    isActive
                      ? "text-[var(--brand-blue)]"
                      : "text-[var(--text-tertiary)] group-hover:text-[var(--text-secondary)]"
                  )}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span
                  className={cn(
                    "text-[10px] font-bold tracking-tight transition-all duration-200",
                    isActive
                      ? "text-[var(--brand-blue)] opacity-100"
                      : "text-[var(--text-tertiary)] opacity-80"
                  )}
                  style={{ fontFamily: "var(--font-data)" }}
                >
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}

        {/* Sign-Out Button — always accessible on mobile */}
        <div className="flex items-center justify-center min-w-[48px] min-h-[48px]">
          <SignOutButton variant="nav" />
        </div>
      </nav>
    </div>
  );
}
