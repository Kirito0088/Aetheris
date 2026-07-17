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

/* Navigation items per persona — max 4 to leave room for the sign-out item. */
const NAV_CONFIGS: Record<string, { href: string; icon: typeof Home; label: string }[]> = {
  fan: [
    { href: "/fan", icon: Home, label: "Home" },
    { href: "/fan/map", icon: MapIcon, label: "Map" },
    { href: "/fan/tickets", icon: Ticket, label: "Tickets" },
    { href: "/fan/guide", icon: Compass, label: "Guide" },
  ],
  volunteer: [
    { href: "/volunteer", icon: Home, label: "Home" },
    { href: "/volunteer/guide", icon: BookOpen, label: "Guide" },
    { href: "/volunteer/translate", icon: Compass, label: "Translate" },
  ],
};

export function BottomNav({ persona = "fan" }: { persona?: string }) {
  const pathname = usePathname();
  const navItems = NAV_CONFIGS[persona] ?? NAV_CONFIGS.fan!;
  const basePath = persona === "volunteer" ? "/volunteer" : "/fan";

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-6 pt-2 bg-gradient-to-t from-surface-base via-surface-base/80 to-transparent pointer-events-none md:hidden">
      <nav aria-label={`${persona} portal`} className="mx-auto max-w-md flex items-center justify-around bg-surface-glass-strong backdrop-blur-xl border border-border-subtle shadow-elevation-2 rounded-full px-2 py-2 pointer-events-auto">
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
              className="relative flex flex-col items-center justify-center w-14 h-12"
            >
              {/* Active Bubble (Framer Motion Layout ID) */}
              {isActive && (
                <motion.div
                  layoutId="bottomNavBubble"
                  className="absolute inset-0 bg-nav-selected rounded-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}

              <div className="relative z-10 flex flex-col items-center justify-center gap-1">
                <Icon
                  className={cn(
                    "w-5 h-5 transition-colors duration-300",
                    isActive ? "text-nav-active" : "text-text-tertiary group-hover:text-text-secondary"
                  )}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span
                  className={cn(
                    "text-[10px] font-medium tracking-tight transition-all duration-300",
                    isActive ? "text-nav-active opacity-100" : "text-text-tertiary opacity-0 h-0"
                  )}
                >
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}

        {/* Sign-Out — always the last item */}
        <SignOutButton variant="nav" />
      </nav>
    </div>
  );
}
