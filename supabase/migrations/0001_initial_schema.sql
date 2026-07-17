-- ============================================================================
-- AETHERIS — Initial Schema (Phase 3.1)
-- FIFA Stadium Intelligence Platform — Estadio Azteca
--
-- Source of truth: BACKEND_ARCHITECTURE.md (UI audit → PostgreSQL schema)
--
-- Contents:
--   1. Extensions
--   2. ENUM types
--   3. Tables (profiles, zones, tickets, incidents, tasks, alerts)
--   4. Indexes
--   5. updated_at triggers
--   6. Auth → profile provisioning trigger (role resolution per auth matrix)
--   7. RLS helper (private.get_user_role)
--   8. Row Level Security policies (fan / volunteer / venue_operator)
--   9. Grants (authenticated-only Data API access)
--  10. Realtime publication
--  11. Seed data (venue operator account, Estadio Azteca zones, demo rows)
--
-- Deviations from the architecture doc's draft SQL (deliberate):
--   * `row` is a reserved PostgreSQL keyword — quoted as "row".
--   * gen_random_uuid() (built-in) instead of uuid_generate_v4() (needs uuid-ossp).
--   * updated_at columns + triggers added to all tables (required deliverable).
--   * RLS role checks use a SECURITY DEFINER lookup on profiles (the doc's own
--     footnote: JWT role injection requires an Auth Hook OR a profiles lookup —
--     the lookup works for all three auth providers with zero dashboard config).
-- ============================================================================


-- ============================================================================
-- 1. EXTENSIONS
-- ============================================================================

-- crypt()/gen_salt() for seeding the venue operator password.
-- (Pre-installed on hosted Supabase; IF NOT EXISTS makes this a no-op there.)
CREATE EXTENSION IF NOT EXISTS pgcrypto;


-- ============================================================================
-- 2. ENUM TYPES
-- ============================================================================

CREATE TYPE public.priority_level  AS ENUM ('high', 'medium', 'low');
CREATE TYPE public.crowd_density   AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE public.ticket_status   AS ENUM ('valid', 'scanned');
CREATE TYPE public.incident_status AS ENUM ('open', 'assigned', 'resolved');
CREATE TYPE public.task_type       AS ENUM ('incident', 'assistance', 'logistics');
CREATE TYPE public.task_status     AS ENUM ('pending', 'active', 'completed');
CREATE TYPE public.alert_type      AS ENUM ('routing', 'info', 'urgent');
CREATE TYPE public.user_role       AS ENUM ('fan', 'volunteer', 'venue_operator');


-- ============================================================================
-- 3. TABLES
-- ============================================================================

-- PROFILES — extends Supabase auth.users with an application role.
CREATE TABLE public.profiles (
  id         UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  role       public.user_role NOT NULL,
  full_name  TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.profiles IS
  'Application profile per auth user. role drives all RLS decisions.';

-- ZONES — unified zone model (audit: merges StadiumZone + DBZone).
CREATE TABLE public.zones (
  id            TEXT PRIMARY KEY,                -- slug, e.g. 'north-gate'
  name          TEXT NOT NULL,
  description   TEXT,
  crowd_density public.crowd_density NOT NULL DEFAULT 'low',
  throughput    INTEGER NOT NULL DEFAULT 0,      -- people per minute (Pax/Min)
  capacity      INTEGER NOT NULL,                -- max people allowed
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.zones IS
  'Estadio Azteca zones. Unifies fan-facing density/description with ops telemetry (throughput/capacity).';

-- TICKETS — audit: kickoff_time added for the fan countdown UI.
CREATE TABLE public.tickets (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  match_name   TEXT NOT NULL,
  match_date   DATE NOT NULL,
  kickoff_time TIMESTAMPTZ NOT NULL,
  gate         TEXT NOT NULL,
  sector       TEXT NOT NULL,
  "row"        TEXT NOT NULL,                    -- ROW is a reserved keyword
  seat         TEXT NOT NULL,
  status       public.ticket_status NOT NULL DEFAULT 'valid',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- INCIDENTS — audit: reported_by captures the reporting volunteer.
CREATE TABLE public.incidents (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title            TEXT NOT NULL,
  description      TEXT NOT NULL,
  status           public.incident_status NOT NULL DEFAULT 'open',
  priority         public.priority_level NOT NULL DEFAULT 'medium',
  location_zone_id TEXT NOT NULL REFERENCES public.zones (id) ON DELETE RESTRICT,
  reported_by      UUID REFERENCES public.profiles (id) ON DELETE SET NULL,
  reported_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- TASKS — volunteer Task Radar. assigned_to replaces the hardcoded 'vol-1'.
CREATE TABLE public.tasks (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  description TEXT NOT NULL,
  type        public.task_type NOT NULL,
  priority    public.priority_level NOT NULL DEFAULT 'medium',
  status      public.task_status NOT NULL DEFAULT 'pending',
  assigned_to UUID REFERENCES public.profiles (id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ALERTS — fan-facing AI alerts. target_user_id NULL = broadcast.
CREATE TABLE public.alerts (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title          TEXT NOT NULL,
  description    TEXT NOT NULL,
  type           public.alert_type NOT NULL,
  action_label   TEXT,
  target_user_id UUID REFERENCES public.profiles (id) ON DELETE CASCADE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ============================================================================
-- 4. INDEXES (FK columns + dashboard hot paths)
-- ============================================================================

CREATE INDEX idx_tickets_user_id        ON public.tickets (user_id);
CREATE INDEX idx_incidents_zone_id      ON public.incidents (location_zone_id);
CREATE INDEX idx_incidents_reported_by  ON public.incidents (reported_by);
CREATE INDEX idx_incidents_status       ON public.incidents (status);
CREATE INDEX idx_tasks_assigned_to      ON public.tasks (assigned_to);
CREATE INDEX idx_tasks_status           ON public.tasks (status);
CREATE INDEX idx_alerts_target_user_id  ON public.alerts (target_user_id);
CREATE INDEX idx_alerts_created_at      ON public.alerts (created_at DESC);


-- ============================================================================
-- 5. updated_at TRIGGERS
-- ============================================================================

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_profiles_updated_at  BEFORE UPDATE ON public.profiles  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_zones_updated_at     BEFORE UPDATE ON public.zones     FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_tickets_updated_at   BEFORE UPDATE ON public.tickets   FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_incidents_updated_at BEFORE UPDATE ON public.incidents FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_tasks_updated_at     BEFORE UPDATE ON public.tasks     FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_alerts_updated_at    BEFORE UPDATE ON public.alerts    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ============================================================================
-- 6. AUTH → PROFILE PROVISIONING
-- ----------------------------------------------------------------------------
-- Every new auth.users row gets a profile. Role resolution follows the
-- authentication matrix:
--   * phone (OTP)        → volunteer   (Volunteer Portal signs in by phone only)
--   * google (OAuth)     → fan         (Fan Portal signs in by Google only)
--   * email / everything → fan         (safe default — email self-signup must
--                                       NEVER mint a venue_operator)
-- Venue operators are provisioned by admins with an explicit
-- raw_app_meta_data.user_role = 'venue_operator' (app_metadata is NOT
-- user-editable, unlike user_metadata — never trust user_metadata for authz).
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  resolved_role public.user_role;
BEGIN
  resolved_role := COALESCE(
    -- 1. Explicit admin-assigned role (secure: app_metadata, not user_metadata)
    (NEW.raw_app_meta_data ->> 'user_role')::public.user_role,
    -- 2. Infer from the sign-in provider per the auth matrix
    CASE NEW.raw_app_meta_data ->> 'provider'
      WHEN 'phone' THEN 'volunteer'::public.user_role
      ELSE 'fan'::public.user_role
    END
  );

  INSERT INTO public.profiles (id, role, full_name)
  VALUES (
    NEW.id,
    resolved_role,
    COALESCE(
      NEW.raw_user_meta_data ->> 'full_name',
      NEW.raw_user_meta_data ->> 'name'
    )
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ============================================================================
-- 7. RLS HELPER — role lookup
-- ----------------------------------------------------------------------------
-- SECURITY DEFINER is required here: policies on `profiles` itself consult the
-- caller's role, and an invoker-rights lookup would recurse into RLS forever.
-- Mitigations per Supabase security guidance:
--   * lives in a non-exposed `private` schema (not reachable via the Data API)
--   * only ever returns the CALLER's own row (bound to auth.uid())
--   * EXECUTE revoked from PUBLIC/anon, granted to authenticated only
-- ============================================================================

CREATE SCHEMA IF NOT EXISTS private;

CREATE OR REPLACE FUNCTION private.get_user_role()
RETURNS public.user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT role FROM public.profiles WHERE id = (SELECT auth.uid());
$$;

REVOKE EXECUTE ON FUNCTION private.get_user_role() FROM PUBLIC;
GRANT  USAGE   ON SCHEMA  private                  TO authenticated;
GRANT  EXECUTE ON FUNCTION private.get_user_role() TO authenticated;


-- ============================================================================
-- 8. ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE public.profiles  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.zones     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts    ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- 8a. VENUE OPERATIONS (god mode) — full read/write on every table
-- ----------------------------------------------------------------------------

CREATE POLICY "Venue operators have full access to profiles"
  ON public.profiles FOR ALL TO authenticated
  USING      ((SELECT private.get_user_role()) = 'venue_operator')
  WITH CHECK ((SELECT private.get_user_role()) = 'venue_operator');

CREATE POLICY "Venue operators have full access to zones"
  ON public.zones FOR ALL TO authenticated
  USING      ((SELECT private.get_user_role()) = 'venue_operator')
  WITH CHECK ((SELECT private.get_user_role()) = 'venue_operator');

CREATE POLICY "Venue operators have full access to tickets"
  ON public.tickets FOR ALL TO authenticated
  USING      ((SELECT private.get_user_role()) = 'venue_operator')
  WITH CHECK ((SELECT private.get_user_role()) = 'venue_operator');

CREATE POLICY "Venue operators have full access to incidents"
  ON public.incidents FOR ALL TO authenticated
  USING      ((SELECT private.get_user_role()) = 'venue_operator')
  WITH CHECK ((SELECT private.get_user_role()) = 'venue_operator');

CREATE POLICY "Venue operators have full access to tasks"
  ON public.tasks FOR ALL TO authenticated
  USING      ((SELECT private.get_user_role()) = 'venue_operator')
  WITH CHECK ((SELECT private.get_user_role()) = 'venue_operator');

CREATE POLICY "Venue operators have full access to alerts"
  ON public.alerts FOR ALL TO authenticated
  USING      ((SELECT private.get_user_role()) = 'venue_operator')
  WITH CHECK ((SELECT private.get_user_role()) = 'venue_operator');

-- ----------------------------------------------------------------------------
-- 8b. VOLUNTEERS — read zones; read/update tasks; read/create incidents
-- ----------------------------------------------------------------------------

CREATE POLICY "Volunteers can read zones"
  ON public.zones FOR SELECT TO authenticated
  USING ((SELECT private.get_user_role()) = 'volunteer');

CREATE POLICY "Volunteers can read tasks"
  ON public.tasks FOR SELECT TO authenticated
  USING ((SELECT private.get_user_role()) = 'volunteer');

-- UPDATE works because the SELECT policy above exists (Postgres requires a
-- readable row to update it). WITH CHECK prevents writing rows out of role.
CREATE POLICY "Volunteers can update tasks"
  ON public.tasks FOR UPDATE TO authenticated
  USING      ((SELECT private.get_user_role()) = 'volunteer')
  WITH CHECK ((SELECT private.get_user_role()) = 'volunteer');

CREATE POLICY "Volunteers can read incidents"
  ON public.incidents FOR SELECT TO authenticated
  USING ((SELECT private.get_user_role()) = 'volunteer');

-- reported_by is pinned to the caller — a volunteer cannot spoof another
-- reporter (closes the audit's "Missing Reporter Context" gap end-to-end).
CREATE POLICY "Volunteers can create incidents"
  ON public.incidents FOR INSERT TO authenticated
  WITH CHECK (
    (SELECT private.get_user_role()) = 'volunteer'
    AND reported_by = (SELECT auth.uid())
  );

-- ----------------------------------------------------------------------------
-- 8c. FANS — own profile, global zones, own tickets, targeted/broadcast alerts
-- ----------------------------------------------------------------------------

-- Every authenticated user can read their own profile (fans, volunteers and
-- operators all need this for role resolution on the client).
CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = id);

CREATE POLICY "Fans can read zones"
  ON public.zones FOR SELECT TO authenticated
  USING ((SELECT private.get_user_role()) = 'fan');

CREATE POLICY "Fans can read own tickets"
  ON public.tickets FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Fans can read alerts"
  ON public.alerts FOR SELECT TO authenticated
  USING (
    (SELECT private.get_user_role()) = 'fan'
    AND (target_user_id IS NULL OR target_user_id = (SELECT auth.uid()))
  );


-- ============================================================================
-- 9. GRANTS — authenticated-only Data API surface
-- ----------------------------------------------------------------------------
-- All three portals require sign-in (auth matrix); anon needs NOTHING.
-- RLS is the row filter — these grants are the table-level gate.
-- ============================================================================

GRANT USAGE ON SCHEMA public TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE
  ON public.profiles, public.zones, public.tickets,
     public.incidents, public.tasks, public.alerts
  TO authenticated;

REVOKE ALL
  ON public.profiles, public.zones, public.tickets,
     public.incidents, public.tasks, public.alerts
  FROM anon;


-- ============================================================================
-- 10. REALTIME
-- ----------------------------------------------------------------------------
-- postgres_changes subscriptions (respect RLS) for:
--   * zones     → fan map densities + ops throughput telemetry
--   * tasks     → volunteer Task Radar instant dispatch/claim sync
--   * incidents → ops dashboard live incident pop-ups
--   * alerts    → fan smart-routing notifications
-- ============================================================================

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    ALTER PUBLICATION supabase_realtime
      ADD TABLE public.zones, public.tasks, public.incidents, public.alerts;
  END IF;
END;
$$;


-- ============================================================================
-- 11. SEED DATA
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 11a. Estadio Azteca zones (migrated from useFanExperienceStore /
--      useDatabaseStore mock data — unified per the audit)
-- ---------------------------------------------------------------------------

INSERT INTO public.zones (id, name, description, crowd_density, throughput, capacity) VALUES
  ('north-gate',     'North Gate (Access C)', 'Main entry point. Currently experiencing high traffic.', 'high',     120, 5000),
  ('south-gate',     'South Gate (Access A)', 'Alternative entry. Fast access recommended.',            'low',       45, 5000),
  ('sector-104',     'Sector 104',            'Premium seating sector.',                                'medium',     0,  800),
  ('vip-lounge',     'VIP Lounge',            'Exclusive hospitality area.',                            'low',       10,  300),
  ('concourse-east', 'East Concourse',        'Congested area near food vendors.',                      'critical', 350, 2000)
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- 11b. Default venue operator — testing@aetheris.ai / testing123
--
-- NOTE: seeding auth.users via SQL is a development convenience. GoTrue
-- internals occasionally change; if login fails on a future Supabase version,
-- create the user in Dashboard → Authentication instead and set
-- app_metadata: { "user_role": "venue_operator" }.
-- The empty-string token columns are required (GoTrue cannot scan NULLs).
-- ---------------------------------------------------------------------------

DO $$
DECLARE
  operator_id UUID;
BEGIN
  SELECT id INTO operator_id FROM auth.users WHERE email = 'testing@aetheris.ai';

  IF operator_id IS NULL THEN
    operator_id := '00000000-0000-4000-a000-000000000001';
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
      confirmation_token, recovery_token,
      email_change, email_change_token_new, email_change_token_current,
      phone_change, phone_change_token, reauthentication_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      operator_id,
      'authenticated',
      'authenticated',
      'testing@aetheris.ai',
      crypt('testing123', gen_salt('bf')),
      NOW(),
      jsonb_build_object(
        'provider',  'email',
        'providers', jsonb_build_array('email'),
        'user_role', 'venue_operator'
      ),
      jsonb_build_object('full_name', 'Aetheris Operations'),
      NOW(), NOW(),
      '', '', '', '', '', '', '', ''
    );

    -- GoTrue requires a matching identity row for email/password sign-in.
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider,
      last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(),
      operator_id,
      operator_id::TEXT,
      jsonb_build_object(
        'sub',            operator_id::TEXT,
        'email',          'testing@aetheris.ai',
        'email_verified', TRUE,
        'phone_verified', FALSE
      ),
      'email',
      NOW(), NOW(), NOW()
    );
  END IF;

  UPDATE auth.users
  SET raw_app_meta_data = raw_app_meta_data || jsonb_build_object('user_role', 'venue_operator')
  WHERE id = operator_id;

  -- handle_new_user() already provisioned the profile; this pins the role in
  -- case the account pre-existed with a different one.
  INSERT INTO public.profiles (id, role, full_name)
  VALUES (operator_id, 'venue_operator', 'Aetheris Operations')
  ON CONFLICT (id) DO UPDATE SET role = 'venue_operator';
END;
$$;

-- ---------------------------------------------------------------------------
-- 11c. Demo operational data (from useDatabaseStore mocks) — safe to delete
--      for production. Tickets are intentionally NOT seeded: they belong to
--      real fan accounts created via Google OAuth in Phase 3.2.
-- ---------------------------------------------------------------------------

INSERT INTO public.tasks (title, description, type, priority, status) VALUES
  ('Crowd Control Assist',   'Deploy to Gate C to assist with crowd dispersion. Guide fans to Gate D if possible.', 'logistics',  'high',   'pending'),
  ('Wheelchair Assistance',  'Fan requested assistance from Entry Gate A to Section 102.',                          'assistance', 'medium', 'pending');

INSERT INTO public.incidents (title, description, status, priority, location_zone_id) VALUES
  ('Crowd Congestion', 'Severe bottleneck forming at main turnstiles.', 'open', 'high', 'north-gate');

INSERT INTO public.alerts (title, description, type, action_label) VALUES
  ('Smart Route Available', 'Gate C is currently busy. Routing you through Gate D will save you 12 minutes.', 'routing', 'Show Route');
