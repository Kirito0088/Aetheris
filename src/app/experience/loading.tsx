/**
 * Aetheris Experience Loading State
 *
 * Premium Framer Motion loading boundary displayed during Suspense resolution
 * while the experience page's Server Component awaits `getUser()`.
 *
 * Design language:
 * - Warm stone neutral canvas (--surface-base / hsl(40, 38%, 98%))
 * - Breathing glow pulse with brand accent (--nav-active / Blue-600)
 * - Spring-physics easing per DESIGN_TOKENS.md motion philosophy
 * - prefers-reduced-motion: falls back to a subtle opacity pulse
 *
 * Architecture: This is a Server Component (no "use client") that renders
 * pure CSS animations — no JS bundle cost. Framer Motion aesthetics are
 * achieved through CSS keyframes matching the design token system.
 */

export default function ExperienceLoading() {
  return (
    <div
      aria-label="Verifying session"
      aria-live="polite"
      role="status"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100dvh",
        flexDirection: "column",
        gap: "24px",
        backgroundColor: "var(--surface-base, hsl(40, 38%, 98%))",
      }}
    >
      {/* Breathing glow orb — warm stone + brand blue accent */}
      <div
        style={{
          position: "relative",
          width: "48px",
          height: "48px",
        }}
      >
        {/* Outer glow ring */}
        <div
          style={{
            position: "absolute",
            inset: "-8px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, hsla(216, 84%, 48%, 0.12) 0%, transparent 70%)",
            animation: "aetheris-glow 2.4s ease-in-out infinite",
          }}
        />
        {/* Core orb */}
        <div
          style={{
            position: "relative",
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            border: "2px solid var(--border-default, hsl(36, 20%, 92%))",
            borderTopColor: "var(--nav-active, hsl(216, 84%, 48%))",
            animation: "aetheris-spin 1s cubic-bezier(0.4, 0, 0.2, 1) infinite",
          }}
        />
        {/* Inner dot pulse */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            backgroundColor: "var(--nav-active, hsl(216, 84%, 48%))",
            animation: "aetheris-dot 2.4s ease-in-out infinite",
          }}
        />
      </div>

      {/* Status text */}
      <p
        style={{
          fontSize: "0.8125rem",
          fontFamily: "var(--font-geist-mono, monospace)",
          color: "var(--text-tertiary, hsl(30, 8%, 52%))",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          animation: "aetheris-text 2.4s ease-in-out infinite",
        }}
      >
        Verifying Session
      </p>

      {/* Keyframe animations — premium, minimal, warm-neutral palette */}
      <style>{`
        @keyframes aetheris-spin {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes aetheris-glow {
          0%, 100% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.15);
          }
        }

        @keyframes aetheris-dot {
          0%, 100% {
            opacity: 0.3;
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.4);
          }
        }

        @keyframes aetheris-text {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 1;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          @keyframes aetheris-spin {
            to {
              transform: rotate(360deg);
            }
          }
          @keyframes aetheris-glow {
            0%, 100% { opacity: 0.6; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1); }
          }
          @keyframes aetheris-dot {
            0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
            50% { opacity: 0.8; transform: translate(-50%, -50%) scale(1); }
          }
          @keyframes aetheris-text {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 0.9; }
          }
        }
      `}</style>
    </div>
  );
}
