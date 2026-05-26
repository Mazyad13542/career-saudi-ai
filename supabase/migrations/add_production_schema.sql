-- ============================================================
--  قِمّة — Production Schema Migration
--  Run in: Supabase Dashboard → SQL Editor → Run
--
--  Prerequisites (run these first in order):
--    1. supabase/schema.sql
--    2. supabase/migrations/add_profile_data.sql
--    3. supabase/migrations/add_hr_admin_schema.sql
--    4. supabase/migrations/add_jobs_aggregator_schema.sql
--    5. supabase/migrations/add_ai_features_schema.sql
--    6. THIS FILE
-- ============================================================


-- ══════════════════════════════════════════════════════════════
-- SECTION 1: New profile columns
--   Required by: Onboarding.jsx, jobMatcher.js, atsScorer.js,
--                match-jobs Edge Function, JobsForYou.jsx
-- ══════════════════════════════════════════════════════════════

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS skills              TEXT[]  DEFAULT '{}';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS preferred_sectors   TEXT[]  DEFAULT '{}';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS preferred_cities    TEXT[]  DEFAULT '{}';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS preferred_job_types TEXT[]  DEFAULT '{}';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS experience_years    INTEGER DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS education_level     TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS fresh_graduate      BOOLEAN DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS open_to_remote      BOOLEAN DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS expected_salary     INTEGER;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS onboarding_done     BOOLEAN DEFAULT false;

-- GIN indexes for fast array-overlap matching queries
CREATE INDEX IF NOT EXISTS idx_profiles_skills
  ON public.profiles USING GIN (skills);

CREATE INDEX IF NOT EXISTS idx_profiles_preferred_sectors
  ON public.profiles USING GIN (preferred_sectors);

CREATE INDEX IF NOT EXISTS idx_profiles_onboarding_done
  ON public.profiles (onboarding_done) WHERE onboarding_done = false;


-- ══════════════════════════════════════════════════════════════
-- SECTION 2: notifications
--   Used by: useNotifications.js (real-time), send-notification Edge Function
-- ══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.notifications (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    UUID        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type       TEXT        NOT NULL,
  title      TEXT        NOT NULL,
  body       TEXT,
  link       TEXT,
  is_read    BOOLEAN     DEFAULT false,
  metadata   JSONB       DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users manage their own notifications; service-role key (Edge Functions) bypasses RLS
CREATE POLICY IF NOT EXISTS "notifications_select" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "notifications_insert" ON public.notifications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "notifications_update" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "notifications_delete" ON public.notifications
  FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_notifications_user_unread
  ON public.notifications (user_id, is_read, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_notifications_user
  ON public.notifications (user_id, created_at DESC);


-- ══════════════════════════════════════════════════════════════
-- SECTION 3: job_matches
--   Used by: match-jobs Edge Function (upserts on user_id+job_id),
--            JobsForYou.jsx (optional server-side pre-computed scores)
-- ══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.job_matches (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    UUID        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  job_id     UUID        REFERENCES public.jobs(id) ON DELETE CASCADE NOT NULL,
  score      INTEGER     NOT NULL DEFAULT 0 CHECK (score >= 0 AND score <= 100),
  reasons    JSONB       DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, job_id)
);

ALTER TABLE public.job_matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "job_matches_select" ON public.job_matches
  FOR SELECT USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_job_matches_user_score
  ON public.job_matches (user_id, score DESC);

CREATE INDEX IF NOT EXISTS idx_job_matches_job
  ON public.job_matches (job_id);


-- ══════════════════════════════════════════════════════════════
-- SECTION 4: messages
--   Used by: HRMessages.jsx (HR ↔ candidate messaging thread)
-- ══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.messages (
  id             UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id      UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  receiver_id    UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  job_id         UUID        REFERENCES public.jobs(id) ON DELETE SET NULL,
  application_id UUID        REFERENCES public.applications(id) ON DELETE SET NULL,
  content        TEXT        NOT NULL,
  is_read        BOOLEAN     DEFAULT false,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "messages_select" ON public.messages
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY IF NOT EXISTS "messages_insert" ON public.messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY IF NOT EXISTS "messages_update" ON public.messages
  FOR UPDATE USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE INDEX IF NOT EXISTS idx_messages_receiver
  ON public.messages (receiver_id, is_read, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_messages_sender
  ON public.messages (sender_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_messages_application
  ON public.messages (application_id, created_at DESC);


-- ══════════════════════════════════════════════════════════════
-- SECTION 5: onboarding
--   Used by: Onboarding.jsx (upsert after 5-step wizard completes),
--            ProtectedRoute.jsx (redirect check via profile.onboarding_done)
-- ══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.onboarding (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  completed    BOOLEAN     DEFAULT false,
  step         INTEGER     DEFAULT 0,
  steps_done   TEXT[]      DEFAULT '{}',
  completed_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id)
);

ALTER TABLE public.onboarding ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "onboarding_select" ON public.onboarding
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "onboarding_insert" ON public.onboarding
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "onboarding_update" ON public.onboarding
  FOR UPDATE USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_onboarding_user
  ON public.onboarding (user_id);


-- ══════════════════════════════════════════════════════════════
-- SECTION 6: analytics_events
--   Used by: add_cron_jobs.sql (annual cleanup job), admin analytics
-- ══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.analytics_events (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  event      TEXT        NOT NULL,
  page       TEXT,
  metadata   JSONB       DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "analytics_own_insert" ON public.analytics_events
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "analytics_own_select" ON public.analytics_events
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "analytics_admin_select" ON public.analytics_events
  FOR SELECT USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
  );

CREATE INDEX IF NOT EXISTS idx_analytics_events_user
  ON public.analytics_events (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_analytics_events_event
  ON public.analytics_events (event, created_at DESC);


-- ══════════════════════════════════════════════════════════════
-- SECTION 7: Trigger — auto-increment / decrement application counts
--   Keeps jobs.applications_count and profiles.applications_count
--   in sync without relying on client-side increments.
-- ══════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.increment_job_applications()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.jobs
      SET applications_count = applications_count + 1
      WHERE id = NEW.job_id;
    UPDATE public.profiles
      SET applications_count = applications_count + 1
      WHERE id = NEW.user_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.jobs
      SET applications_count = GREATEST(0, applications_count - 1)
      WHERE id = OLD.job_id;
    UPDATE public.profiles
      SET applications_count = GREATEST(0, applications_count - 1)
      WHERE id = OLD.user_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_application_counts ON public.applications;
CREATE TRIGGER trg_application_counts
  AFTER INSERT OR DELETE ON public.applications
  FOR EACH ROW
  EXECUTE FUNCTION public.increment_job_applications();


-- ══════════════════════════════════════════════════════════════
-- SECTION 8: Function — calc_profile_strength (0–100)
--   Weights:
--     basic info  (full_name, job_title, city, avatar) — 30 pts
--     bio                                               — 10 pts
--     skills array (≥3 skills = full, ≥1 = half)        — 20 pts
--     AI matching data (sectors, experience, education) — 20 pts
--     JSONB profile_data (experience, certs, projects)  — 20 pts
-- ══════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.calc_profile_strength(p public.profiles)
RETURNS INTEGER
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  score INTEGER := 0;
BEGIN
  -- Basic info (30 pts)
  IF p.full_name  IS NOT NULL AND length(trim(p.full_name))  > 1 THEN score := score + 10; END IF;
  IF p.job_title  IS NOT NULL AND length(trim(p.job_title))  > 1 THEN score := score + 10; END IF;
  IF p.city       IS NOT NULL AND length(trim(p.city))       > 1 THEN score := score + 5;  END IF;
  IF p.avatar_url IS NOT NULL                                     THEN score := score + 5;  END IF;

  -- Bio (10 pts)
  IF p.bio IS NOT NULL AND length(trim(p.bio)) > 20 THEN score := score + 10; END IF;

  -- Skills array (20 pts)
  -- array_length returns NULL for empty arrays, so COALESCE to 0
  IF COALESCE(array_length(p.skills, 1), 0) >= 3 THEN
    score := score + 20;
  ELSIF COALESCE(array_length(p.skills, 1), 0) >= 1 THEN
    score := score + 10;
  END IF;

  -- AI matching data (20 pts)
  IF COALESCE(array_length(p.preferred_sectors, 1), 0) >= 1           THEN score := score + 10; END IF;
  IF COALESCE(p.experience_years, 0)                   >  0           THEN score := score + 5;  END IF;
  IF p.education_level IS NOT NULL AND length(trim(p.education_level)) > 1
                                                                       THEN score := score + 5;  END IF;

  -- JSONB profile_data completeness (20 pts)
  IF p.profile_data IS NOT NULL AND p.profile_data <> '{}'::JSONB THEN
    IF (p.profile_data ? 'experience')
       AND jsonb_array_length(p.profile_data -> 'experience') > 0
      THEN score := score + 10;
    END IF;
    IF (p.profile_data ? 'certifications')
       AND jsonb_array_length(p.profile_data -> 'certifications') > 0
      THEN score := score + 5;
    END IF;
    IF (p.profile_data ? 'projects')
       AND jsonb_array_length(p.profile_data -> 'projects') > 0
      THEN score := score + 5;
    END IF;
  END IF;

  RETURN LEAST(score, 100);
END;
$$;


-- ══════════════════════════════════════════════════════════════
-- SECTION 9: Trigger — auto-update profile_strength on every profile SAVE
-- ══════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.set_profile_strength()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.profile_strength := public.calc_profile_strength(NEW);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_profile_strength ON public.profiles;
CREATE TRIGGER trg_profile_strength
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.set_profile_strength();


-- ══════════════════════════════════════════════════════════════
-- SECTION 10: Realtime publication
--   Enables useNotifications.js Supabase channel subscription.
--   DO block makes this idempotent on re-runs.
-- ══════════════════════════════════════════════════════════════

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END;
$$;


-- ══════════════════════════════════════════════════════════════
-- SECTION 11: Backfill — recalculate profile_strength for existing rows
--   Safe to re-run (UPDATE is always idempotent here).
-- ══════════════════════════════════════════════════════════════

UPDATE public.profiles
SET profile_strength = public.calc_profile_strength(profiles)
WHERE true;
