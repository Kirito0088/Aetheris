/**
 * Volunteer Login Layout — Phase 3.2
 *
 * Minimal layout that bypasses the main Volunteer layout's header and bottom nav.
 * Login pages render full-viewport without any app chrome.
 */

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In — Volunteer Portal",
};

export default function VolunteerLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
