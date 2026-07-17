/**
 * Aetheris Supabase Client — Server
 *
 * For React Server Components, Server Actions and Route Handlers.
 * Reads/writes the auth session from the Next.js cookie store via
 * @supabase/ssr, so RLS sees the signed-in user on every query.
 *
 * IMPORTANT: always create a NEW client per request (never module-level) —
 * the cookie store is request-scoped.
 *
 * Usage (RSC):
 *   const supabase = await createClient();
 *   const { data } = await supabase.from("tickets").select("*");
 */

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { type Database } from "@/types/supabase";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env["NEXT_PUBLIC_SUPABASE_URL"]!,
    process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"]!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component, where Next.js forbids cookie
            // writes. Safe to ignore: the root middleware (updateSession)
            // is responsible for refreshing sessions.
          }
        },
      },
    },
  );
}
