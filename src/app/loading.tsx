/**
 * Aetheris Global Loading State — App Router
 *
 * Displayed during route transitions and Suspense boundaries.
 * Follows the loading philosophy from DESIGN_SYSTEM.md:
 * - Preserve layout stability
 * - Communicate progress without unnecessary spinners
 * - Progressive streaming preferred for AI features (Phase 3+)
 */

export default function GlobalLoading() {
  return (
    <div
      aria-label="Loading"
      aria-live="polite"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100dvh",
        flexDirection: "column",
        gap: "var(--space-4)",
        backgroundColor: "var(--surface-base)",
      }}
    >
      {/* Pulse indicator — calm, restrained (DESIGN_LANGUAGE.md) */}
      <div
        style={{
          width: "32px",
          height: "32px",
          borderRadius: "50%",
          border: "2px solid var(--border-default)",
          borderTopColor: "var(--nav-active)",
          animation: "spin 0.8s linear infinite",
        }}
      />

      <p
        style={{
          fontSize: "var(--font-size-sm)",
          color: "var(--text-tertiary)",
          fontFamily: "var(--font-sans)",
        }}
      >
        Loading
      </p>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
