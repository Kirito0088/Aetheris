"use client";

/**
 * Aetheris Fan Login — Phase 3.2
 *
 * Premium, consumer-facing Google OAuth login page for the Fan Portal.
 * Design direction: warm white canvas (var(--surface-base)), centered card
 * with a subtle radial glow accent, single "Continue with Google" CTA.
 *
 * Aesthetic: Apple/Stripe-tier light mode, FIFA 2026 visual language.
 * Motion: Framer Motion entrance using the project's scaleVariants.
 * Auth: Calls supabase.auth.signInWithOAuth({ provider: 'google' }) with
 *        PKCE flow, redirecting through /auth/callback?next=/fan.
 */

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

// =============================================================================
// ANIMATION VARIANTS
// =============================================================================

const cardVariants = {
  hidden: { opacity: 0, scale: 0.96, y: 12 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.0, 0.0, 0.2, 1.0] as const, // decelerate
    },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15,
      ease: [0.0, 0.0, 0.2, 1.0] as const,
    },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.0, 0.0, 0.2, 1.0] as const,
    },
  },
};

// =============================================================================
// GOOGLE ICON (Official SVG — no third-party icon lib needed)
// =============================================================================

function GoogleIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
        fill="#EA4335"
      />
    </svg>
  );
}

// =============================================================================
// FAN LOGIN PAGE
// =============================================================================

export default function FanLoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  // Check for callback errors passed via URL
  const callbackError = searchParams.get("error");

  // ---------------------------------------------------------------------------
  // SESSION GUARD — Clear stale session on mount to prevent auto-redirect.
  // ---------------------------------------------------------------------------
  const [sessionCleared, setSessionCleared] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function clearStaleSession() {
      try {
        const supabase = createClient();
        await supabase.auth.signOut();
      } catch {
        // Ignore — session may already be empty.
      } finally {
        if (!cancelled) setSessionCleared(true);
      }
    }
    clearStaleSession();
    return () => { cancelled = true; };
  }, []);

  async function handleGoogleLogin() {
    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/fan`,
        },
      });

      if (authError) {
        setError(authError.message);
        setIsLoading(false);
      }
      // If no error, the browser is redirecting to Google — keep loading state.
    } catch {
      setError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  }

  // ---------------------------------------------------------------------------
  // LOADING GUARD — prevents login form flash while session clears.
  // ---------------------------------------------------------------------------
  if (!sessionCleared) {
    return (
      <div style={styles.page}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}
        >
          <div
            style={{
              width: "24px",
              height: "24px",
              border: "2.5px solid var(--border-default)",
              borderTopColor: "var(--brand-blue)",
              borderRadius: "50%",
              animation: "spin 0.7s linear infinite",
            }}
          />
          <p style={{ fontSize: "var(--font-size-sm)", color: "var(--text-tertiary)", margin: 0 }}>
            Preparing…
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {/* Subtle animated radial glow — fixed, GPU-safe, pointer-events-none */}
      <div style={styles.glowContainer} aria-hidden="true">
        <motion.div
          style={styles.glowOrb}
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.5, 0.7, 0.5],
          }}
          transition={{
            duration: 8,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div
          style={styles.glowOrbSecondary}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse",
            delay: 2,
          }}
        />
      </div>

      {/* Login Card */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        style={styles.card}
      >
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          style={styles.cardInner}
        >
          {/* Brand */}
          <motion.div variants={staggerItem} style={styles.brandBlock}>
            <div style={styles.logoMark}>
              <img
                src="/logo.png"
                alt="Aetheris logo"
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  objectFit: "cover",
                }}
              />
            </div>
            <h1 style={styles.wordmark}>Aetheris</h1>
          </motion.div>

          {/* Tagline */}
          <motion.div variants={staggerItem} style={styles.taglineBlock}>
            <p style={styles.tagline}>Fan Experience Portal</p>
            <p style={styles.subtitle}>FIFA World Cup 2026™</p>
          </motion.div>

          {/* Divider */}
          <motion.div variants={staggerItem} style={styles.divider} />

          {/* Error messages */}
          {(error || callbackError) && (
            <motion.div
              variants={staggerItem}
              style={styles.errorContainer}
              role="alert"
              aria-live="polite"
            >
              <p style={styles.errorText}>
                {error || "Authentication failed. Please try again."}
              </p>
            </motion.div>
          )}

          {/* Google CTA */}
          <motion.div variants={staggerItem}>
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              style={{
                ...styles.googleButton,
                ...(isLoading ? styles.googleButtonDisabled : {}),
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.boxShadow =
                    "0 2px 6px rgba(24, 18, 12, 0.06), 0 4px 12px rgba(24, 18, 12, 0.05)";
                  e.currentTarget.style.transform = "scale(0.99)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 1px 2px rgba(24, 18, 12, 0.06), 0 1px 3px rgba(24, 18, 12, 0.04)";
                e.currentTarget.style.transform = "scale(1)";
              }}
              type="button"
              id="fan-google-login-button"
            >
              {isLoading ? (
                <div style={styles.spinner} />
              ) : (
                <GoogleIcon />
              )}
              <span>{isLoading ? "Redirecting…" : "Continue with Google"}</span>
            </button>
          </motion.div>

          {/* Legal */}
          <motion.p variants={staggerItem} style={styles.legal}>
            By continuing, you agree to the Aetheris Terms of Service and Privacy
            Policy.
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
}

// =============================================================================
// STYLES — All values reference design tokens via CSS custom properties.
// =============================================================================

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100dvh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "var(--surface-base)",
    position: "relative",
    overflow: "hidden",
    padding: "16px",
  },
  glowContainer: {
    position: "fixed",
    inset: 0,
    pointerEvents: "none",
    zIndex: 0,
    overflow: "hidden",
  },
  glowOrb: {
    position: "absolute",
    top: "20%",
    left: "50%",
    transform: "translateX(-50%)",
    width: "min(600px, 80vw)",
    height: "min(600px, 80vw)",
    borderRadius: "9999px",
    background:
      "radial-gradient(circle, hsla(214, 86%, 55%, 0.12) 0%, hsla(214, 86%, 55%, 0.04) 50%, transparent 70%)",
  },
  glowOrbSecondary: {
    position: "absolute",
    bottom: "10%",
    right: "20%",
    width: "min(400px, 50vw)",
    height: "min(400px, 50vw)",
    borderRadius: "9999px",
    background:
      "radial-gradient(circle, hsla(160, 84%, 39%, 0.08) 0%, hsla(160, 84%, 39%, 0.02) 50%, transparent 70%)",
  },
  card: {
    position: "relative",
    zIndex: 1,
    width: "100%",
    maxWidth: "420px",
    backgroundColor: "var(--surface-elevated)",
    borderRadius: "var(--radius-2xl)",
    border: "1px solid var(--border-subtle)",
    boxShadow:
      "0 6px 16px rgba(24, 18, 12, 0.08), 0 12px 28px rgba(24, 18, 12, 0.06)",
    padding: "2px",
  },
  cardInner: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "24px",
    padding: "48px 40px 40px",
    borderRadius: "calc(var(--radius-2xl) - 2px)",
    backgroundColor: "var(--surface-elevated)",
  },
  brandBlock: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  logoMark: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  wordmark: {
    fontSize: "var(--font-size-2xl)",
    fontWeight: 700,
    letterSpacing: "var(--letter-spacing-tight)",
    color: "var(--text-primary)",
    lineHeight: 1,
    margin: 0,
  },
  taglineBlock: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px",
  },
  tagline: {
    fontSize: "var(--font-size-base)",
    fontWeight: 500,
    color: "var(--text-secondary)",
    margin: 0,
    lineHeight: "var(--line-height-normal)",
  },
  subtitle: {
    fontSize: "var(--font-size-xs)",
    fontWeight: 500,
    letterSpacing: "var(--letter-spacing-wider)",
    textTransform: "uppercase" as const,
    color: "var(--text-tertiary)",
    margin: 0,
    lineHeight: "var(--line-height-normal)",
  },
  divider: {
    width: "40px",
    height: "1px",
    backgroundColor: "var(--border-default)",
  },
  errorContainer: {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "var(--radius-md)",
    backgroundColor: "var(--color-red-50)",
    border: "1px solid hsla(0, 78%, 55%, 0.15)",
  },
  errorText: {
    fontSize: "var(--font-size-sm)",
    color: "var(--state-danger)",
    margin: 0,
    lineHeight: "var(--line-height-normal)",
    textAlign: "center" as const,
  },
  googleButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    width: "100%",
    minWidth: "280px",
    height: "52px",
    padding: "0 24px",
    fontSize: "var(--font-size-base)",
    fontWeight: 500,
    fontFamily: "var(--font-sans)",
    color: "var(--text-primary)",
    backgroundColor: "var(--surface-elevated)",
    border: "1px solid var(--border-default)",
    borderRadius: "var(--radius-full)",
    cursor: "pointer",
    boxShadow:
      "0 1px 2px rgba(24, 18, 12, 0.06), 0 1px 3px rgba(24, 18, 12, 0.04)",
    transition:
      "box-shadow 240ms cubic-bezier(0.4, 0, 0.2, 1), transform 120ms cubic-bezier(0.4, 0, 0.2, 1)",
    outline: "none",
  },
  googleButtonDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
  },
  spinner: {
    width: "18px",
    height: "18px",
    border: "2px solid var(--border-default)",
    borderTopColor: "var(--brand-blue)",
    borderRadius: "50%",
    animation: "spin 0.6s linear infinite",
  },
  legal: {
    fontSize: "var(--font-size-xs)",
    color: "var(--text-tertiary)",
    textAlign: "center" as const,
    lineHeight: "var(--line-height-relaxed)",
    maxWidth: "280px",
    margin: 0,
  },
};
