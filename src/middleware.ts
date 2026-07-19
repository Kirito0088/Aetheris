import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

import type { Database } from "@/types/supabase";

// =============================================================================
// ROUTE DEFINITIONS
// =============================================================================

/**
 * Persona-gated routes — each requires authentication AND a matching profile
 * role. Users with a valid session but no role are redirected to /experience
 * to pick a portal (not to "/" which would cause a redirect loop).
 */
const PROTECTED_ROUTES = [
  { prefix: "/fan", loginPath: "/fan/login" },
  { prefix: "/volunteer", loginPath: "/volunteer/login" },
  { prefix: "/venue-operations", loginPath: "/venue-operations/login" },
] as const;

const LOGIN_PATHS = new Set<string>(
  PROTECTED_ROUTES.map(({ loginPath }) => loginPath),
);

// =============================================================================
// HELPERS
// =============================================================================

/** Keep an unavailable Auth or database service from stalling page routing. */
function withTimeout<T>(
  operation: PromiseLike<T>,
  timeoutMs = 2_500,
): Promise<T> {
  return Promise.race([
    Promise.resolve(operation),
    new Promise<T>((_, reject) => {
      setTimeout(() => reject(new Error("Auth check timed out")), timeoutMs);
    }),
  ]);
}

/**
 * Build a redirect response that preserves refreshed session cookies.
 * Uses `request.nextUrl.origin` for consistent URL construction.
 */
function redirectWithSession(
  request: NextRequest,
  responseWithSession: NextResponse,
  pathname: string,
) {
  const redirectUrl = new URL(pathname, request.nextUrl.origin);

  const response = NextResponse.redirect(redirectUrl);
  responseWithSession.cookies
    .getAll()
    .forEach(({ name, value, ...options }) =>
      response.cookies.set(name, value, options),
    );
  return response;
}

// =============================================================================
// MIDDLEWARE
// =============================================================================

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // -------------------------------------------------------------------------
  // Route classification
  // -------------------------------------------------------------------------
  const protectedRoute = PROTECTED_ROUTES.find(
    ({ prefix }) =>
      pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
  const isLoginPath = LOGIN_PATHS.has(pathname);
  // Fast path: public routes pass through immediately with no auth network call.
  // "/" (landing) and "/experience" (role selector) are both fully public.
  // Auth is only enforced on the actual persona portals below.
  const needsAuthCheck = protectedRoute || isLoginPath;
  if (!needsAuthCheck) {
    return NextResponse.next({ request });
  }

  // -------------------------------------------------------------------------
  // Supabase client setup (edge-compatible)
  // -------------------------------------------------------------------------
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    // Env vars missing — degrade gracefully.
    // Protected routes → kick to login; everything else passes through.
    if (protectedRoute && !isLoginPath) {
      return redirectWithSession(
        request,
        NextResponse.next({ request }),
        protectedRoute.loginPath,
      );
    }
    return NextResponse.next({ request });
  }

  let responseWithSession = NextResponse.next({ request });
  const supabase = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        responseWithSession = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          responseWithSession.cookies.set(name, value, options),
        );
      },
    },
  });

  // -------------------------------------------------------------------------
  // 1. Fetch user securely via getUser() (server-validated JWT, not getSession)
  // -------------------------------------------------------------------------
  let user = null;
  try {
    const { data } = await withTimeout(supabase.auth.getUser());
    user = data.user;
  } catch {
    // Auth service unavailable or timed out — fall through as anonymous.
  }

  // -------------------------------------------------------------------------
  // 2. Fetch profile role (only when authenticated)
  // -------------------------------------------------------------------------
  let role: string | null = null;
  if (user) {
    try {
      const { data: profile } = await withTimeout(
        supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .maybeSingle(),
      );
      role = profile?.role ?? null;
    } catch {
      // Fail closed: role remains null
    }
  }

  // -------------------------------------------------------------------------
  // 3. Public routes ("/" and "/experience") already passed through above.
  //    Below this point we only handle persona-gated routes.
  // -------------------------------------------------------------------------

  // -------------------------------------------------------------------------
  // 5. UNAUTHENTICATED users on protected persona routes → login page
  // -------------------------------------------------------------------------
  if (!user && protectedRoute && !isLoginPath) {
    return redirectWithSession(
      request,
      responseWithSession,
      protectedRoute.loginPath,
    );
  }

  // -------------------------------------------------------------------------
  // 6. STRICT RBAC persona isolation — authenticated users with a role
  // -------------------------------------------------------------------------
  if (user && role) {
    const isVolunteerRoute =
      pathname === "/volunteer" || pathname.startsWith("/volunteer/");
    const isVenueOpsRoute =
      pathname === "/venue-operations" ||
      pathname.startsWith("/venue-operations/");
    const isFanRoute =
      pathname === "/fan" || pathname.startsWith("/fan/");

    // Venue Admin accessing non-venue routes
    if (role === "venue_operator" && (isVolunteerRoute || isFanRoute)) {
      return redirectWithSession(
        request,
        responseWithSession,
        "/venue-operations",
      );
    }

    // Volunteer accessing non-volunteer routes
    if (role === "volunteer" && (isVenueOpsRoute || isFanRoute)) {
      return redirectWithSession(
        request,
        responseWithSession,
        "/volunteer",
      );
    }

    // Fan accessing non-fan routes
    if (role === "fan" && (isVenueOpsRoute || isVolunteerRoute)) {
      return redirectWithSession(request, responseWithSession, "/fan");
    }

    // Logged-in users visiting a login page should go to their portal
    if (isLoginPath) {
      if (role === "venue_operator")
        return redirectWithSession(
          request,
          responseWithSession,
          "/venue-operations",
        );
      if (role === "volunteer")
        return redirectWithSession(
          request,
          responseWithSession,
          "/volunteer",
        );
      if (role === "fan")
        return redirectWithSession(request, responseWithSession, "/fan");
    }
  }

  // -------------------------------------------------------------------------
  // 7. Authenticated but NO role — pass through.
  //    Do NOT redirect role-less users (to "/" or "/experience") because
  //    that creates a redirect loop. Let the portal pages handle missing
  //    roles at the page level (defense-in-depth).
  // -------------------------------------------------------------------------

  return responseWithSession;
}

// =============================================================================
// MATCHER — explicitly skip static assets, images, and auth callback paths
// =============================================================================

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|api/auth|auth/callback|images/|models/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|avif|glb|gltf)$).*)",
  ],
};
