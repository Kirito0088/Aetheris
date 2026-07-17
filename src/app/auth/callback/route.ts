/**
 * Aetheris Auth Callback — Phase 3.2
 *
 * Route Handler that processes the OAuth code exchange for the PKCE flow.
 * After a user signs in with Google (or any future OAuth provider), Supabase
 * redirects back here with a `code` query parameter.
 *
 * Flow:
 * 1. Extract `code` and `next` from the URL search params.
 * 2. Exchange the code for a session using the server-side Supabase client.
 * 3. Redirect to the `next` URL (defaults to `/fan` for Google OAuth).
 * 4. On error, redirect to the fan login page with an error indicator.
 *
 * Security:
 * - The `next` param is validated to ensure it's a relative path (no open
 *   redirect vulnerability).
 * - Uses the server client which writes cookies via the Next.js cookie store.
 * - Handles `x-forwarded-host` for deployments behind load balancers.
 */

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  // The `next` param tells us where to redirect after successful auth.
  // The fan login page sets this to `/fan` when initiating the OAuth flow.
  let next = searchParams.get("next") ?? "/fan";

  // Security: prevent open redirect — only allow relative paths.
  if (!next.startsWith("/")) {
    next = "/fan";
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const host = request.headers.get("host") || request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";
      const protocol = request.headers.get("x-forwarded-proto") || (isLocalEnv ? "http" : "https");

      if (host) {
        return NextResponse.redirect(`${protocol}://${host}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  // Auth code exchange failed — redirect to fan login with error indicator.
  return NextResponse.redirect(`${origin}/fan/login?error=auth_callback`);
}
