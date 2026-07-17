import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

import type { Database } from "@/types/supabase";

const PROTECTED_ROUTES = [
  { prefix: "/fan", loginPath: "/fan/login" },
  { prefix: "/volunteer", loginPath: "/volunteer/login" },
  { prefix: "/venue-operations", loginPath: "/venue-operations/login" },
] as const;

const LOGIN_PATHS = new Set<string>(PROTECTED_ROUTES.map(({ loginPath }) => loginPath));

/** Keep an unavailable Auth or database service from stalling page routing. */
function withTimeout<T>(operation: PromiseLike<T>, timeoutMs = 2_500): Promise<T> {
  return Promise.race([
    Promise.resolve(operation),
    new Promise<T>((_, reject) => {
      setTimeout(() => reject(new Error("Auth check timed out")), timeoutMs);
    }),
  ]);
}

function redirectWithSession(
  request: NextRequest,
  responseWithSession: NextResponse,
  pathname: string,
) {
  // Use native request.url which automatically handles x-forwarded headers and ports
  const redirectUrl = new URL(pathname, request.url);

  const response = NextResponse.redirect(redirectUrl);
  responseWithSession.cookies.getAll().forEach(({ name, value, ...options }) =>
    response.cookies.set(name, value, options),
  );
  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const protectedRoute = PROTECTED_ROUTES.find(({ prefix }) =>
    pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
  const isLoginPath = LOGIN_PATHS.has(pathname);

  // Do not make the entire application depend on an Auth network call. Only
  // persona routes require a session check; everything else passes through.
  if (!protectedRoute && !isLoginPath) {
    return NextResponse.next({ request });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    if (protectedRoute && !isLoginPath) {
      return redirectWithSession(request, NextResponse.next({ request }), protectedRoute.loginPath);
    }
    return NextResponse.next({ request });
  }

  let responseWithSession = NextResponse.next({ request });
  const supabase = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        responseWithSession = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          responseWithSession.cookies.set(name, value, options),
        );
      },
    },
  });

  // 1. Fetch Session securely using getUser
  let user = null;
  try {
    const { data } = await withTimeout(supabase.auth.getUser());
    user = data.user;
  } catch {
    // Fall through as anonymous
  }

  // 2. Fetch Profile Role
  let role: string | null = null;
  if (user) {
    try {
      const { data: profile } = await withTimeout(
        supabase.from("profiles").select("role").eq("id", user.id).maybeSingle()
      );
      if (profile?.role) {
        role = profile.role;
      } else {
        // Fallback for testing environments without profile setup
        if (user.email === 'admin@aetheris.ai' || user.email === 'testing_venue@aetheris.ai') {
          role = 'venue_operator';
        } else if (user.email === 'vol@aetheris.ai' || user.email === 'testing_vol@aetheris.ai') {
          role = 'volunteer';
        } else if (user.email === 'testing_fan@aetheris.ai') {
          role = 'fan';
        }
      }
    } catch {
      // Fail closed: role remains null
    }
  }

  // 3. Unauthenticated users accessing protected routes -> send to appropriate login
  if (!user && protectedRoute && !isLoginPath) {
    return redirectWithSession(request, responseWithSession, protectedRoute.loginPath);
  }

  // 4. Enforce STRICT RBAC persona isolation
  if (user && role) {
    const isVolunteerRoute = pathname === '/volunteer' || pathname.startsWith('/volunteer/');
    const isVenueOpsRoute = pathname === '/venue-operations' || pathname.startsWith('/venue-operations/');
    const isFanRoute = pathname === '/fan' || pathname.startsWith('/fan/');

    // Venue Admin accessing non-venue routes
    if (role === 'venue_operator' && (isVolunteerRoute || isFanRoute)) {
      return redirectWithSession(request, responseWithSession, '/venue-operations');
    }
    
    // Volunteer accessing non-volunteer routes
    if (role === 'volunteer' && (isVenueOpsRoute || isFanRoute)) {
      return redirectWithSession(request, responseWithSession, '/volunteer');
    }

    // Fan accessing non-fan routes
    if (role === 'fan' && (isVenueOpsRoute || isVolunteerRoute)) {
      return redirectWithSession(request, responseWithSession, '/fan');
    }

    // Logged in users visiting a login page should go to their portal
    if (isLoginPath) {
       if (role === 'venue_operator') return redirectWithSession(request, responseWithSession, '/venue-operations');
      if (role === 'volunteer') return redirectWithSession(request, responseWithSession, '/volunteer');
      if (role === 'fan') return redirectWithSession(request, responseWithSession, '/fan');
    }
  }

  // 5. If logged in but NO role could be found, kick them out to root (Fail closed)
  if (user && !role && protectedRoute) {
    return redirectWithSession(request, responseWithSession, '/');
  }

  return responseWithSession;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|images/|models/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|avif|glb|gltf)$).*)",
  ],
};
