"use client";

/**
 * Aetheris Experience Gateway — Client Component (Stitch Design Rebuild)
 *
 * Full-page experience selector matching the Stitch MCP design language.
 * Features ambient background glows, a fixed top navigation bar, a hero
 * section with personalized greeting, and a 3-card bento grid with image
 * headers, gradient overlays, hover lift, and portal-entry CTAs.
 *
 * Routing: All navigation is via `<Link>` — no client-side auth guards.
 * Motion: Framer Motion with `useReducedMotion` compliance.
 */

import React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Link from "next/link";
import {
  Landmark as Stadium,
  Users,
  Settings,
  ArrowRight,
  Bell,
  AlertTriangle,
} from "lucide-react";
import { useExperienceDirector, MOTION_EASINGS } from "@/features/experience";
import type { ExperienceRole } from "@/features/experience";

// =============================================================================
// TYPES
// =============================================================================

interface ExperienceSelectorProps {
  /** Display name for personalized greeting — optional. */
  userName?: string | null;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const USER_AVATAR_URL =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCmmeL3dCGZTeV2SJkSeIV6zUVoDWY3-ToeFDdD0jhGHrr-WM19HYiCX0zrpvy6Cjg0JyZgjKLNs5zXDtZ8WGXXYbZ2jp1Rs-rkKWWUx0M4z-bHyO0SjFaphKB8-RjbWu9MTJ-9drCvF1_RNvicG9jUIAea6C4U-RUYek3lZMiEyyrbr_ZBNxU371Stkk814-Alh53fXpaPyN2mlxyEVQp48UMWmJRwhNFHyHjZ3qj9PBqm6qzAnt8v";

const NAV_LINKS = [
  { label: "Fan", href: "/fan" },
  { label: "Volunteer", href: "/volunteer" },
  { label: "Operations", href: "/venue-operations" },
] as const;

// =============================================================================
// PORTAL CARD DATA
// =============================================================================

const PORTALS: readonly PortalConfig[] = [
  {
    role: "fan",
    href: "/fan",
    portalLabel: "Portal A",
    title: "Fan Experience",
    description:
      "Navigate the stadium, find amenities, and get AI-guided directions with a mobile-first interface designed for matchday.",
    icon: Stadium,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDkXaJ0Zp6HqSCUpB3dlFmaKDaI1p_839SAHdGKEDOldT7qu3vrJQ-P3SMe9EHKhOX6cL1eQsJ6d3gQlgL8LQkF5-aBG8afEsCFEOmnUqcAKLBV0FctjCUDmFcWZVU99jeW-82dykL3iptK7-yR8WNyVtEBN7Fg55mTDwhxxp_QZMF-IsHGxdr_WuZCr1vTVoD7JzwyuJPuGWcZrnRvcSYyCuVdncsX8DH7uoTVNiZHeDqUgGWVXuWI",
    accentColor: "var(--stitch-primary)",
    accentContainerColor: "var(--stitch-primary-fixed)",
    onContainerColor: "var(--stitch-on-primary-fixed)",
  },
  {
    role: "volunteer",
    href: "/volunteer",
    portalLabel: "Portal B",
    title: "Volunteer Hub",
    description:
      "Receive intelligent task dispatch, assist fans in real-time, and access AI-powered translation for seamless communication.",
    icon: Users,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBc6kF2k5L2ILsqUNR93bMsVXNidhBmmdVyc2B3qYNAOA1Aqkoo_eJvPovzkE_W-mUDnpQUG8Izzi7LmkldtTGK81cP4CCLZZWXlZ-FTb-rxpqUD_BLXBCTLGPusH8cjOeiGPzgLZ1O5FQkf1ByZ_zYyw1B3X6dMemLUdeyyiKbg_DhrbP9OPNcPd_oVMg2Bxhas3T87ltPhYQ2Iu-TXIaAXeiHAcs1B4_THIddhn6AOXgVrmZmirU6",
    accentColor: "var(--stitch-secondary)",
    accentContainerColor: "var(--stitch-secondary-fixed)",
    onContainerColor: "var(--stitch-on-secondary-fixed)",
  },
  {
    role: "venue-operations",
    href: "/venue-operations",
    portalLabel: "Portal C",
    title: "Venue Operations",
    description:
      "Full operational dashboard with crowd analytics, intelligent path planning, resource dispatch, and real-time monitoring.",
    icon: Settings,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDmOx453IZEYMsKU5iW2h__57cH6xhWdDXdocUwRzKR5wuvJZXdkBDn9Crr_Ht8uw7KVdkOgurM6unjCPbNg17OLAvD4gwTj33WtbnI-UWO8y_iJiYlPzqXgDTgUBQsgx8djOT680R0zg693j9QXG8JFp2eIdsyPSihGRgmyXsIGtq575bu0CivjQeTrh84Rl9q5h7A8g94P6SqPwYdl-8qWCwc20waIrGrt-Bw6MtQlO_JYRJw_hPX",
    accentColor: "var(--stitch-tertiary)",
    accentContainerColor: "var(--stitch-tertiary-fixed)",
    onContainerColor: "var(--stitch-on-tertiary-fixed)",
  },
] as const;

interface PortalConfig {
  role: ExperienceRole;
  href: string;
  portalLabel: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string; color?: string }>;
  imageUrl: string;
  accentColor: string;
  accentContainerColor: string;
  onContainerColor: string;
}

// =============================================================================
// ANIMATION VARIANTS (with reduced-motion awareness)
// =============================================================================

import type { TargetAndTransition } from "framer-motion";

function useMotionVariants() {
  const prefersReduced = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReduced ? 0 : 0.08,
        delayChildren: prefersReduced ? 0 : 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: prefersReduced ? 1 : 0,
      y: prefersReduced ? 0 : 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: prefersReduced
        ? { duration: 0 }
        : {
            type: "spring" as const,
            stiffness: 300,
            damping: 24,
          },
    },
  };

  const cardHover: TargetAndTransition = prefersReduced
    ? { scale: 1, y: 0 }
    : {
        scale: 1.01,
        y: -4,
        transition: {
          duration: 0.3,
          ease: MOTION_EASINGS.decelerate,
        },
      };

  return { containerVariants, itemVariants, cardHover, prefersReduced };
}

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

/** Ambient background glows — fixed, GPU-safe, pointer-events-none. */
function AmbientGlows() {
  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{ pointerEvents: "none", zIndex: 0 }}
    >
      {/* Primary glow — top right */}
      <div
        style={{
          position: "absolute",
          top: "-20%",
          right: "-10%",
          width: "60vw",
          height: "60vw",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, var(--stitch-primary-fixed-dim) 0%, transparent 70%)",
          opacity: 0.2,
          filter: "blur(100px)",
          willChange: "transform",
        }}
      />
      {/* Secondary glow — bottom left */}
      <div
        style={{
          position: "absolute",
          bottom: "-15%",
          left: "-10%",
          width: "50vw",
          height: "50vw",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, var(--stitch-secondary-fixed-dim) 0%, transparent 70%)",
          opacity: 0.2,
          filter: "blur(120px)",
          willChange: "transform",
        }}
      />
      {/* Tertiary glow — center */}
      <div
        style={{
          position: "absolute",
          top: "40%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "40vw",
          height: "40vw",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, var(--stitch-tertiary-fixed-dim) 0%, transparent 70%)",
          opacity: 0.1,
          filter: "blur(100px)",
          willChange: "transform",
        }}
      />
    </div>
  );
}

/** Fixed top navigation bar. */
function TopNavBar({ userName }: { userName?: string | null }) {
  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        borderBottom: "1px solid var(--stitch-outline-variant)",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 24px",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <img
            src="/logo.png"
            alt="Aetheris logo"
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              objectFit: "cover",
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-headline)",
              fontSize: "18px",
              fontWeight: 700,
              color: "var(--stitch-on-surface)",
              letterSpacing: "-0.01em",
            }}
          >
            Aetheris
          </span>
        </div>

        {/* Nav links */}
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: "32px",
          }}
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "12px",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "var(--stitch-on-surface-variant)",
                textDecoration: "none",
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--stitch-on-surface)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color =
                  "var(--stitch-on-surface-variant)")
              }
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          {/* Emergency button */}
          <button
            type="button"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 14px",
              borderRadius: "9999px",
              backgroundColor: "var(--stitch-error-container)",
              color: "var(--stitch-on-error-container)",
              border: "none",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: 600,
              fontFamily: "var(--font-body)",
              letterSpacing: "0.02em",
            }}
          >
            <AlertTriangle style={{ width: "14px", height: "14px" }} />
            Emergency
          </button>

          {/* Notification button */}
          <button
            type="button"
            aria-label="Notifications"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              border: "1px solid var(--stitch-outline-variant)",
              backgroundColor: "transparent",
              cursor: "pointer",
              color: "var(--stitch-on-surface-variant)",
              transition: "background-color 0.2s ease",
            }}
          >
            <Bell style={{ width: "16px", height: "16px" }} />
          </button>

          {/* Settings button */}
          <button
            type="button"
            aria-label="Settings"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              border: "1px solid var(--stitch-outline-variant)",
              backgroundColor: "transparent",
              cursor: "pointer",
              color: "var(--stitch-on-surface-variant)",
              transition: "background-color 0.2s ease",
            }}
          >
            <Settings style={{ width: "16px", height: "16px" }} />
          </button>

          {/* User avatar */}
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              overflow: "hidden",
              border: "2px solid var(--stitch-outline-variant)",
              flexShrink: 0,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={USER_AVATAR_URL}
              alt={userName ?? "User avatar"}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}

// =============================================================================
// PORTAL CARD COMPONENT
// =============================================================================

interface PortalCardProps {
  portal: PortalConfig;
  _index: number;
  onSelect: (role: ExperienceRole) => void;
  cardHover: TargetAndTransition;
  prefersReduced: boolean;
}

function PortalCard({
  portal,
  _index,
  onSelect,
  cardHover,
  prefersReduced,
}: PortalCardProps) {
  const Icon = portal.icon;
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <Link
      href={portal.href}
      onClick={() => onSelect(portal.role)}
      style={{ textDecoration: "none", color: "inherit", display: "block" }}
    >
      <motion.div
        whileHover={cardHover}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        style={{
          borderRadius: "20px",
          overflow: "hidden",
          backgroundColor: "var(--stitch-surface-white)",
          border: "1px solid var(--stitch-outline-variant)",
          cursor: "pointer",
          willChange: "transform",
          boxShadow: isHovered
            ? "var(--stitch-hover-shadow)"
            : "0 1px 3px 0 rgba(0,0,0,0.04)",
          transition: `box-shadow 0.5s var(--stitch-cinematic-ease)`,
        }}
      >
        {/* Image header */}
        <div
          style={{
            position: "relative",
            height: "192px",
            overflow: "hidden",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={portal.imageUrl}
            alt={portal.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: prefersReduced
                ? "none"
                : "transform 0.5s cubic-bezier(0.2,0.8,0.2,1), filter 0.5s cubic-bezier(0.2,0.8,0.2,1)",
              transform: isHovered ? "scale(1.05)" : "scale(1)",
              filter: isHovered ? "none" : "saturate(0.7)",
            }}
          />

          {/* Gradient overlay fading to white */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to bottom, transparent 40%, rgba(255,255,255,0.6) 70%, rgba(255,255,255,1) 100%)",
              pointerEvents: "none",
            }}
          />

          {/* Icon badge — top left */}
          <div
            style={{
              position: "absolute",
              top: "12px",
              left: "12px",
              width: "40px",
              height: "40px",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              border: "1px solid rgba(255, 255, 255, 0.4)",
            }}
          >
            <Icon
              className="w-5 h-5"
              color={portal.accentColor}
            />
          </div>
        </div>

        {/* Card body */}
        <div style={{ padding: "20px 24px 24px" }}>
          {/* Portal badge pill */}
          <span
            style={{
              display: "inline-block",
              padding: "3px 10px",
              borderRadius: "9999px",
              fontSize: "11px",
              fontWeight: 600,
              fontFamily: "var(--font-body)",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              backgroundColor: portal.accentContainerColor,
              color: portal.onContainerColor,
              marginBottom: "12px",
            }}
          >
            {portal.portalLabel}
          </span>

          {/* Title */}
          <h3
            style={{
              fontFamily: "var(--font-headline)",
              fontSize: "20px",
              fontWeight: 600,
              color: "var(--stitch-on-surface)",
              margin: "0 0 8px 0",
              lineHeight: 1.3,
            }}
          >
            {portal.title}
          </h3>

          {/* Description */}
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "14px",
              lineHeight: 1.6,
              color: "var(--stitch-on-surface-variant)",
              margin: "0 0 20px 0",
            }}
          >
            {portal.description}
          </p>

          {/* CTA */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontFamily: "var(--font-body)",
              fontSize: "14px",
              fontWeight: 600,
              color: portal.accentColor,
              transition: prefersReduced ? "none" : "gap 0.25s ease",
            }}
          >
            <span>Enter Portal</span>
            <ArrowRight
              style={{
                width: "16px",
                height: "16px",
                transition: prefersReduced ? "none" : "transform 0.25s ease",
                transform: isHovered ? "translateX(4px)" : "translateX(0)",
              }}
            />
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function ExperienceSelector({ userName }: ExperienceSelectorProps) {
  const setRole = useExperienceDirector((s) => s.setRole);
  const { containerVariants, itemVariants, cardHover, prefersReduced } =
    useMotionVariants();

  const handleSelect = (role: ExperienceRole) => {
    setRole(role);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        backgroundColor: "var(--stitch-surface-white)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient background glows */}
      <AmbientGlows />

      {/* Fixed top nav */}
      <TopNavBar userName={userName} />

      {/* Main content */}
      <main
        style={{
          position: "relative",
          zIndex: 1,
          paddingTop: "120px",
          paddingBottom: "80px",
          paddingLeft: "24px",
          paddingRight: "24px",
          maxWidth: "1120px",
          margin: "0 auto",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key="experience-gateway"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Hero Section */}
            <motion.div
              variants={itemVariants}
              style={{
                textAlign: "center",
                maxWidth: "768px",
                margin: "0 auto 56px",
              }}
            >
              <h1
                style={{
                  fontFamily: "var(--font-headline)",
                  fontSize: "clamp(36px, 5vw, 64px)",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.1,
                  color: "var(--stitch-on-surface)",
                  margin: "0 0 16px 0",
                }}
              >
                {userName
                  ? `Welcome back, ${userName}`
                  : "Choose Your Experience"}
              </h1>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "18px",
                  lineHeight: 1.6,
                  color: "var(--stitch-on-surface-variant)",
                  margin: 0,
                  maxWidth: "560px",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              >
                Select how you&apos;ll interact with the Stadium Intelligence
                Platform. Each portal is tailored to your role.
              </p>
            </motion.div>

            {/* 3-Card Bento Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "24px",
              }}
            >
              {PORTALS.map((portal, index) => (
                <motion.div key={portal.role} variants={itemVariants}>
                  <PortalCard
                    portal={portal}
                    _index={index}
                    onSelect={handleSelect}
                    cardHover={cardHover}
                    prefersReduced={prefersReduced ?? false}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
