/**
 * Aetheris Experience Selector Page
 *
 * Public role-selection gateway. No auth required to view this page —
 * anyone clicking "Enter Aetheris" from the landing page lands here.
 *
 * Auth is enforced downstream: clicking a portal card navigates to
 * /fan, /volunteer, or /venue-operations, where the middleware enforces
 * login if the user is not authenticated.
 *
 * Architecture (ADR-002): Server Component by default. The interactive
 * role cards are delegated to the ExperienceSelector client component.
 */

import { createClient } from "@/lib/supabase/server";
import { ExperienceSelector } from "@/components/experience/ExperienceSelector";

export default async function ExperiencePage() {
  // Attempt to get the current user for a personalized greeting.
  // This is best-effort only — the page renders for everyone regardless.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userName =
    user?.user_metadata?.full_name ??
    user?.user_metadata?.name ??
    user?.email?.split("@")[0] ??
    null;

  return <ExperienceSelector userName={userName} />;
}
