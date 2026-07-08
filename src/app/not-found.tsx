/**
 * Aetheris 404 Not Found — App Router
 *
 * Displayed when a route is not found.
 * Follows DESIGN_SYSTEM.md empty state principles:
 * - Why is nothing displayed?
 * - What can the user do next?
 * - Is this expected?
 */

import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
};

export default function NotFound() {
  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100dvh",
        padding: "var(--space-8)",
        gap: "var(--space-6)",
        textAlign: "center",
        backgroundColor: "var(--surface-base)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "var(--space-4)",
          maxWidth: "440px",
        }}
      >
        {/* Status indicator */}
        <span
          style={{
            fontSize: "var(--font-size-xs)",
            fontWeight: "500",
            color: "var(--text-tertiary)",
            letterSpacing: "var(--letter-spacing-wide)",
            textTransform: "uppercase",
          }}
        >
          404
        </span>

        <h1
          style={{
            fontSize: "var(--font-size-3xl)",
            fontWeight: "600",
            color: "var(--text-primary)",
            lineHeight: "var(--line-height-tight)",
          }}
        >
          Page not found
        </h1>

        <p
          style={{
            fontSize: "var(--font-size-base)",
            color: "var(--text-secondary)",
            lineHeight: "var(--line-height-relaxed)",
          }}
        >
          This page doesn&apos;t exist. You may have followed an outdated link
          or entered an incorrect address.
        </p>

        <Link
          href="/"
          style={{
            marginTop: "var(--space-2)",
            padding: "var(--space-3) var(--space-6)",
            backgroundColor: "var(--nav-active)",
            color: "var(--text-primary)",
            borderRadius: "var(--radius-lg)",
            fontSize: "var(--font-size-sm)",
            fontWeight: "500",
            textDecoration: "none",
            display: "inline-block",
            transition: `opacity var(--duration-fast) var(--ease-standard)`,
          }}
        >
          Return to Aetheris
        </Link>
      </div>
    </main>
  );
}
