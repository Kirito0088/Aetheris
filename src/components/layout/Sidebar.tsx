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

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Live Stadium", href: "/live", icon: Map },
  { name: "Navigation", href: "/navigation", icon: Navigation },
  { name: "Accessibility", href: "/accessibility", icon: Accessibility },
  { name: "Operations", href: "/operations", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-full bg-[var(--surface-base)] border-r border-[var(--border-subtle)] flex flex-col pt-8 pb-4">
      <div className="px-6 mb-12">
        <h1 className="text-[var(--font-size-xl)] font-bold tracking-tight text-[var(--text-primary)]">
          Aetheris
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = 
            pathname === item.href || 
            (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] text-[var(--font-size-sm)] font-medium transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)]",
                isActive 
                  ? "bg-[var(--nav-selected)] text-[var(--nav-active)]"
                  : "text-[var(--text-secondary)] hover:bg-[var(--nav-hover)] hover:text-[var(--text-primary)]"
              )}
            >
              <item.icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="px-6 mt-auto">
        <div className="text-[var(--font-size-xs)] text-[var(--text-tertiary)]">
          System Normal
        </div>
      </div>
    </aside>
  );
}
