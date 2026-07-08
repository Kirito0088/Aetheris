/**
 * Aetheris Root Page
 *
 * The application entry point (/).
 *
 * Phase 1 scope: This is the minimal application shell entry point only.
 * Business features and the Living Digital Twin are Phase 2+ deliverables.
 *
 * The purpose of this page is to confirm the application shell is operational
 * and properly structured, not to display product UI.
 */

export default function RootPage() {
  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100dvh",
        gap: "var(--space-6)",
        padding: "var(--space-8)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "var(--space-4)",
          maxWidth: "480px",
          textAlign: "center",
        }}
      >
        {/* Status indicator */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "var(--space-2)",
            padding: "var(--space-1) var(--space-3)",
            backgroundColor: "var(--nav-selected)",
            borderRadius: "var(--radius-full)",
            border: "1px solid var(--nav-active)",
          }}
        >
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              backgroundColor: "var(--nav-active)",
            }}
          />
          <span
            style={{
              fontSize: "var(--font-size-xs)",
              fontWeight: "500",
              color: "var(--nav-active)",
              letterSpacing: "var(--letter-spacing-wide)",
              textTransform: "uppercase",
            }}
          >
            Phase 1 — Foundation
          </span>
        </div>

        {/* Wordmark */}
        <h1
          style={{
            fontSize: "var(--font-size-4xl)",
            fontWeight: "700",
            color: "var(--text-primary)",
            letterSpacing: "var(--letter-spacing-tighter)",
            lineHeight: "var(--line-height-tight)",
          }}
        >
          Aetheris
        </h1>

        <p
          style={{
            fontSize: "var(--font-size-base)",
            color: "var(--text-secondary)",
            lineHeight: "var(--line-height-relaxed)",
          }}
        >
          AI-powered Spatial Intelligence Platform
        </p>

        <p
          style={{
            fontSize: "var(--font-size-sm)",
            color: "var(--text-tertiary)",
            lineHeight: "var(--line-height-relaxed)",
            borderTop: "1px solid var(--border-subtle)",
            paddingTop: "var(--space-4)",
          }}
        >
          Foundation complete. The Living Digital Twin and platform features
          will be implemented in Phase 2.
        </p>
      </div>
    </main>
  );
}
