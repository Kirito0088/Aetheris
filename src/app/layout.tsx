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
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import { Providers } from "@/providers";
import "@/styles/globals.css";

// =============================================================================
// FONT CONFIGURATION
// =============================================================================

// Stitch Design System Fonts — "Architectural Optimism" typography triad
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  weight: ["400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
  weight: ["500", "700"],
});

// =============================================================================
// METADATA
// =============================================================================

export const metadata: Metadata = {
  title: {
    default: "Aetheris — Operational Intelligence for FIFA 2026",
    template: "%s | Aetheris",
  },
  description:
    "Aetheris is the official operational intelligence platform for FIFA World Cup 2026. The invisible nervous system protecting and orchestrating humanity's largest event.",
  icons: {
    icon: [
      { url: "/logo.png", type: "image/png" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: "/apple-icon.png",
  },
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
    index: false,
    follow: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FAF8F4",
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
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
