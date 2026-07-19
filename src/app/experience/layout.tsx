/**
 * Aetheris Experience Layout
 *
 * Wrapper layout for the /experience route. Provides a Suspense boundary
 * with the premium loading state (loading.tsx) while the Server Component
 * page resolves its auth check.
 *
 * No auth logic here — that's handled by the page.tsx Server Component
 * and the middleware.
 */

import React from "react";

export default function ExperienceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
