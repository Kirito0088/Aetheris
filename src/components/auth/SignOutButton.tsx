"use client";

/**
 * Aetheris Global Sign-Out Button — Phase 3.2
 *
 * Reusable component with three visual variants:
 *   - "sidebar"  → Full-width nav item matching Sidebar/FanSidebar style
 *   - "header"   → Compact icon button matching Header controls
 *   - "nav"      → Bottom-nav style icon+label for BottomNav
 *
 * On click: signOut() → refresh router cache → redirect to "/".
 *
 * Design: Matches the existing Aetheris light-mode design tokens.
 * Motion: Framer Motion whileHover / whileTap spring interactions.
 * A11y:   Visible label, aria-label, focus ring.
 */

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

type SignOutVariant = "sidebar" | "header" | "nav";

interface SignOutButtonProps {
  /** Visual variant — controls layout, sizing, and label visibility. */
  variant?: SignOutVariant;
  /** Optional CSS class override for the outermost element. */
  className?: string;
}

// -----------------------------------------------------------------------------
// COMPONENT
// -----------------------------------------------------------------------------

export function SignOutButton({
  variant = "sidebar",
  className,
}: SignOutButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.refresh();
      router.push("/");
    } catch {
      // Even on error, push to root — the session is likely already invalid.
      router.push("/");
    }
  }, [isLoading, router]);

  // ---------------------------------------------------------------------------
  // VARIANT: SIDEBAR — Full-width nav item (FanSidebar / Sidebar footer)
  // ---------------------------------------------------------------------------
  if (variant === "sidebar") {
    return (
      <motion.button
        onClick={handleSignOut}
        disabled={isLoading}
        whileHover={{ scale: 0.98 }}
        whileTap={{ scale: 0.96 }}
        transition={{ type: "spring", bounce: 0, duration: 0.4 }}
        aria-label="Sign out"
        className={
          className ??
          "relative flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[length:var(--font-size-sm)] font-medium text-text-secondary hover:text-state-danger transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        }
      >
        {isLoading ? (
          <div className="w-[18px] h-[18px] border-2 border-text-tertiary/30 border-t-text-secondary rounded-full animate-spin" />
        ) : (
          <LogOut className="w-[18px] h-[18px]" strokeWidth={2} />
        )}
        <span>{isLoading ? "Signing out…" : "Sign Out"}</span>
      </motion.button>
    );
  }

  // ---------------------------------------------------------------------------
  // VARIANT: HEADER — Compact icon button (matching audio toggle in Header)
  // ---------------------------------------------------------------------------
  if (variant === "header") {
    return (
      <motion.button
        onClick={handleSignOut}
        disabled={isLoading}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.92 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        aria-label="Sign out"
        title="Sign out"
        className={
          className ??
          "flex items-center justify-center w-8 h-8 rounded-md border border-border-subtle bg-surface-elevated shadow-elevation-1 hover:bg-surface-sunken hover:border-border-strong text-text-secondary hover:text-state-danger transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue disabled:opacity-50 disabled:cursor-not-allowed"
        }
      >
        {isLoading ? (
          <div className="w-[14px] h-[14px] border-2 border-text-tertiary/30 border-t-text-secondary rounded-full animate-spin" />
        ) : (
          <LogOut className="w-[18px] h-[18px]" strokeWidth={2} />
        )}
      </motion.button>
    );
  }

  // ---------------------------------------------------------------------------
  // VARIANT: NAV — Bottom-nav style (matching BottomNav link items)
  // ---------------------------------------------------------------------------
  return (
    <motion.button
      onClick={handleSignOut}
      disabled={isLoading}
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      aria-label="Sign out"
      className={
        className ??
        "relative flex flex-col items-center justify-center w-14 h-12 cursor-pointer focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
      }
    >
      <div className="relative z-10 flex flex-col items-center justify-center gap-1">
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-text-tertiary/30 border-t-text-secondary rounded-full animate-spin" />
        ) : (
          <LogOut
            className="w-5 h-5 text-text-tertiary transition-colors duration-300"
            strokeWidth={2}
          />
        )}
        <span className="text-[10px] font-medium tracking-tight text-text-tertiary transition-all duration-300">
          {isLoading ? "…" : "Exit"}
        </span>
      </div>
    </motion.button>
  );
}
