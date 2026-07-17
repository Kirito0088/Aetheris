/**
 * Aetheris Supabase Client — Middleware Session Refresh
 *
 * Exports `updateSession`, consumed by the root `src/middleware.ts`
 * (Phase 3.2). It refreshes expired auth tokens on every matched request and
 * propagates the refreshed cookies BOTH to Server Components (via the
 * mutated request) and to the browser (via the response).
 *
 * Without this, server-side `auth.getUser()` calls would randomly fail once
 * the access token expires (~1 hour).
 *
 * Root middleware sketch (Phase 3.2 wires the auth matrix on top):
 *
 *   import { updateSession } from "@/lib/supabase/middleware";
 *   export async function middleware(request: NextRequest) {
 *     return await updateSession(request);
 *   }
 */

import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

import { type Database } from "@/types/supabase";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env["NEXT_PUBLIC_SUPABASE_URL"]!,
    process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"]!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // 1. Make refreshed tokens visible to Server Components downstream.
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          // 2. Send them back to the browser.
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // IMPORTANT: do not run code between createServerClient and auth.getUser()
  // — doing so can cause hard-to-debug random logouts.
  //
  // getUser() (not getSession()) — it revalidates the JWT against Supabase
  // Auth on the server, which is the only trustworthy check in middleware.
  // The result is intentionally unused here; calling it is what triggers the
  // token refresh. Phase 3.2 layers the route-protection matrix
  // (/fan, /volunteer, /venue-operations) on top of this helper.
  await supabase.auth.getUser();

  // IMPORTANT: return supabaseResponse as-is. If you create a custom
  // response in the root middleware, copy the cookies over:
  //   const res = NextResponse.next({ request });
  //   supabaseResponse.cookies.getAll().forEach(({ name, value, ...opts }) =>
  //     res.cookies.set(name, value, opts));
  return supabaseResponse;
}
