/**
 * Venue Operations Login Layout — Phase 3.2
 *
 * Minimal layout that bypasses the main Venue Operations layout's sidebar and header.
 * Login pages render full-viewport without any app chrome.
 */

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In — Operations Console",
};

export default function VenueOperationsLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
