"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import clsx from "clsx";
import { Home, Map, Accessibility, ClipboardList, Languages } from "lucide-react";

interface BottomNavProps {
  persona: 'fan' | 'volunteer';
}

export function BottomNav({ persona }: BottomNavProps) {
  const pathname = usePathname();

  const fanItems = [
    { label: "Home", href: "/fan", icon: Home },
    { label: "Guide", href: "/fan/guide", icon: Map },
    { label: "Amenities", href: "/fan/amenities", icon: Accessibility },
  ];

  const volunteerItems = [
    { label: "Tasks", href: "/volunteer", icon: ClipboardList },
    { label: "Guide", href: "/volunteer/guide", icon: Map },
    { label: "Translate", href: "/volunteer/translate", icon: Languages },
  ];

  const items = persona === 'fan' ? fanItems : volunteerItems;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--surface-elevated)] border-t border-[var(--border-subtle)] pb-safe-bottom">
      <div className="flex items-center justify-around px-2 h-16">
        {items.map((item) => {
          const isActive = pathname === item.href || (item.href !== `/${persona}` && pathname.startsWith(item.href));
          return (
            <Link
              key={item.label}
              href={item.href}
              className={clsx(
                "flex flex-col items-center justify-center w-full h-full space-y-1 relative",
                isActive ? "text-[var(--brand-blue)]" : "text-[var(--text-secondary)]"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="bottom-nav-indicator"
                  className="absolute top-0 w-12 h-1 bg-[var(--brand-blue)] rounded-b-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <item.icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
