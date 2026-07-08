/**
 * Aetheris Environment Validation
 *
 * Validates required environment variables using Zod at startup.
 * Provides type-safe access to environment variables throughout the app.
 *
 * Security rule (ENGINEERING_STANDARDS.md, AI_ARCHITECTURE.md):
 * - Secrets must never be committed.
 * - Server-only variables are inaccessible from client bundles.
 * - Only NEXT_PUBLIC_ variables are exposed to the browser.
 */

import { z } from "zod";

// =============================================================================
// SCHEMA DEFINITIONS
// =============================================================================

/** Client-side environment variables (available in browser) */
const clientEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z
    .string()
    .url("NEXT_PUBLIC_APP_URL must be a valid URL")
    .default("http://localhost:3000"),

  NEXT_PUBLIC_APP_ENV: z
    .enum(["development", "staging", "production"])
    .default("development"),
});

/**
 * Server-side environment variables.
 * These are only accessed in Route Handlers and Server Components.
 * They are intentionally absent from the client schema.
 */
const serverEnvSchema = z.object({
  // Phase 3 — Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),

  // Phase 3 — Gemini AI (server-side only — never in NEXT_PUBLIC_)
  GEMINI_API_KEY: z.string().optional(),

  // Phase 3 — External services
  WEATHER_API_KEY: z.string().optional(),
  MAPS_API_KEY: z.string().optional(),
});

// =============================================================================
// VALIDATION
// =============================================================================

const _clientEnv = clientEnvSchema.safeParse({
  NEXT_PUBLIC_APP_URL: process.env["NEXT_PUBLIC_APP_URL"],
  NEXT_PUBLIC_APP_ENV: process.env["NEXT_PUBLIC_APP_ENV"],
});

if (!_clientEnv.success) {
  console.error(
    "❌ Invalid client environment variables:",
    _clientEnv.error.flatten().fieldErrors,
  );
  throw new Error("Invalid environment configuration. Check .env.example.");
}

// =============================================================================
// TYPED EXPORTS
// =============================================================================

/** Type-safe client environment variables */
export const env = _clientEnv.data;

/** Type reference for server env (validated per-route-handler as needed) */
export type ServerEnv = z.infer<typeof serverEnvSchema>;

/** Re-exported for runtime validation in server contexts */
export { serverEnvSchema };
