/**
 * Aetheris Root Layout
 *
 * The root layout wraps the entire application.
 * It provides:
 * - Global font setup (Inter + JetBrains Mono — DESIGN_TOKENS.md)
 * - Global CSS
 * - Root application providers
 * - HTML metadata
 *
 * Architecture rule (ADR-002):
 * Server Components are preferred by default.
 * Providers are split into a separate 'use client' wrapper.
 */

import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Providers } from "@/providers";
import "@/styles/globals.css";

// =============================================================================
// FONT CONFIGURATION
// Inter (primary) and JetBrains Mono (monospace) — from DESIGN_TOKENS.md.
// Using next/font for performance — automatic subsetting and self-hosting.
// =============================================================================

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
  weight: ["400", "500"],
});

// =============================================================================
// METADATA
// =============================================================================

export const metadata: Metadata = {
  title: {
    default: "Aetheris — AI-powered Spatial Intelligence Platform",
    template: "%s | Aetheris",
  },
  description:
    "Aetheris transforms every stadium into a living digital twin that thinks, predicts, and guides in real time.",
  keywords: [
    "stadium intelligence",
    "spatial intelligence",
    "FIFA World Cup 2026",
    "digital twin",
    "crowd management",
    "venue operations",
  ],
  authors: [{ name: "Team Aetheris" }],
  creator: "Team Aetheris",
  robots: {
    index: false, // Not yet production-ready for indexing
    follow: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FAF8F4", // Matches --surface-base (warm white, Neutral-50)
};

// =============================================================================
// ROOT LAYOUT
// =============================================================================

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
