"use client";

/**
 * Aetheris Global Error Boundary — App Router
 *
 * Catches errors thrown during rendering within the root segment.
 * Must be a Client Component (Next.js requirement for error.tsx).
 *
 * Error handling principles (ENGINEERING_STANDARDS.md):
 * - Be handled explicitly
 * - Provide meaningful messages
 * - Never fail silently
 * - Suggest a recovery action
 * - Never blame the user (BRAND_GUIDELINES.md)
 */
import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error for observability
    // In Phase 3+, this will forward to an error monitoring service.
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <main
      role="alert"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100dvh",
        padding: "var(--space-8)",
        gap: "var(--space-6)",
        backgroundColor: "var(--surface-base)",
        textAlign: "center",
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
        {/* Error indicator */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "var(--space-2)",
            padding: "var(--space-1) var(--space-3)",
            backgroundColor: "hsla(0, 84%, 60%, 0.1)",
            borderRadius: "var(--radius-full)",
            border: "1px solid var(--state-danger)",
          }}
        >
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              backgroundColor: "var(--state-danger)",
            }}
          />
          <span
            style={{
              fontSize: "var(--font-size-xs)",
              fontWeight: "500",
              color: "var(--state-danger)",
              letterSpacing: "var(--letter-spacing-wide)",
              textTransform: "uppercase",
            }}
          >
            System Error
          </span>
        </div>

        <h1
          style={{
            fontSize: "var(--font-size-2xl)",
            fontWeight: "600",
            color: "var(--text-primary)",
            lineHeight: "var(--line-height-tight)",
          }}
        >
          Something went wrong
        </h1>

        <p
          style={{
            fontSize: "var(--font-size-base)",
            color: "var(--text-secondary)",
            lineHeight: "var(--line-height-relaxed)",
          }}
        >
          An unexpected error occurred. Please try again — if the problem
          continues, refreshing the page may help.
        </p>

        <button
          onClick={reset}
          style={{
            marginTop: "var(--space-2)",
            padding: "var(--space-3) var(--space-6)",
            backgroundColor: "var(--nav-active)",
            color: "var(--text-primary)",
            border: "none",
            borderRadius: "var(--radius-lg)",
            fontSize: "var(--font-size-sm)",
            fontWeight: "500",
            cursor: "pointer",
            transition: `opacity var(--duration-fast) var(--ease-standard)`,
            fontFamily: "var(--font-sans)",
          }}
          onMouseOver={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "0.85")}
          onMouseOut={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "1")}
        >
          Try again
        </button>
      </div>
    </main>
  );
}
