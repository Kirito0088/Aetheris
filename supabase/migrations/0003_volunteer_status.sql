-- ============================================================================
-- AETHERIS — Phase 4: Volunteer Status Telemetry
-- ============================================================================

CREATE TABLE public.volunteer_status (
  id               UUID PRIMARY KEY REFERENCES public.profiles (id) ON DELETE CASCADE,
  current_zone_id  TEXT REFERENCES public.zones (id) ON DELETE SET NULL,
  assignment       TEXT,
  battery          INTEGER NOT NULL DEFAULT 100,
  radio_channel    TEXT,
  status           TEXT NOT NULL DEFAULT 'available', -- 'available', 'busy', 'dispatched'
  workload         TEXT NOT NULL DEFAULT 'optimal',   -- 'low', 'optimal', 'high'
  last_active      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ai_recommended   BOOLEAN NOT NULL DEFAULT false,
  rec_reason       TEXT
);

COMMENT ON TABLE public.volunteer_status IS
  'Live telemetry and status for volunteers, used by the Dispatch console.';

-- Enable RLS
ALTER TABLE public.volunteer_status ENABLE ROW LEVEL SECURITY;

-- Venue Ops can read and write all statuses
CREATE POLICY "Venue operators have full access to volunteer_status"
  ON public.volunteer_status FOR ALL TO authenticated
  USING      ((SELECT private.get_user_role()) = 'venue_operator')
  WITH CHECK ((SELECT private.get_user_role()) = 'venue_operator');

-- Volunteers can read their own status and update their own status
CREATE POLICY "Volunteers can read own status"
  ON public.volunteer_status FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = id);

CREATE POLICY "Volunteers can update own status"
  ON public.volunteer_status FOR UPDATE TO authenticated
  USING      ((SELECT auth.uid()) = id)
  WITH CHECK ((SELECT auth.uid()) = id);

-- Realtime publication
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.volunteer_status;
  END IF;
END;
$$;
