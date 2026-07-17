/**
 * Fan Login Layout — Phase 3.2
 *
 * Minimal layout that bypasses the main Fan layout's sidebar and bottom nav.
 * Login pages render full-viewport without any app chrome.
 */

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In — Fan Portal",
};

export default function FanLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
