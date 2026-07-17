/**
 * Aetheris Supabase Client — Browser
 *
 * For Client Components only ("use client"). Backed by @supabase/ssr's
 * createBrowserClient, which stores the session in cookies (readable by the
 * server clients) and internally returns a per-page singleton.
 *
 * Usage:
 *   const supabase = createClient();
 *   supabase.channel("zones").on("postgres_changes", ...).subscribe();
 *
 * Security: only ever receives the publishable anon key (NEXT_PUBLIC_*).
 * All data access is enforced by RLS in 0001_initial_schema.sql.
 */

import { createBrowserClient } from "@supabase/ssr";

import { type Database } from "@/types/supabase";

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
