-- ============================================================
--  AI Features Schema Migration
--  Run in: Supabase Dashboard → SQL Editor → Run
-- ============================================================

-- 1. interview_sessions
CREATE TABLE IF NOT EXISTS public.interview_sessions (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  field         TEXT NOT NULL,
  overall_score INTEGER DEFAULT 0,
  answers       JSONB DEFAULT '[]',
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.interview_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "interview_sessions_select" ON public.interview_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "interview_sessions_insert" ON public.interview_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_interview_sessions_user
  ON public.interview_sessions (user_id, created_at DESC);

-- 2. english_practice_sessions
CREATE TABLE IF NOT EXISTS public.english_practice_sessions (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type          TEXT NOT NULL,
  score         INTEGER DEFAULT 0,
  total         INTEGER DEFAULT 0,
  answers       JSONB DEFAULT '[]',
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.english_practice_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "english_sessions_select" ON public.english_practice_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "english_sessions_insert" ON public.english_practice_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_english_sessions_user
  ON public.english_practice_sessions (user_id, created_at DESC);

-- 3. job_sources — tracks configured aggregation sources
CREATE TABLE IF NOT EXISTS public.job_sources (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL,
  type        TEXT NOT NULL CHECK (type IN ('rss', 'api', 'manual', 'csv')),
  url         TEXT,
  sector      TEXT,
  is_active   BOOLEAN DEFAULT true,
  last_run_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  created_by  UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

ALTER TABLE public.job_sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "job_sources_admin_all" ON public.job_sources
  USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

CREATE INDEX IF NOT EXISTS idx_job_sources_active
  ON public.job_sources (is_active, type);

-- 4. import_logs — tracks CSV/RSS import history
CREATE TABLE IF NOT EXISTS public.import_logs (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  source_id     UUID REFERENCES public.job_sources(id) ON DELETE SET NULL,
  source_type   TEXT NOT NULL,
  source_name   TEXT,
  imported_at   TIMESTAMPTZ DEFAULT NOW(),
  total_rows    INTEGER DEFAULT 0,
  inserted      INTEGER DEFAULT 0,
  duplicates    INTEGER DEFAULT 0,
  errors        INTEGER DEFAULT 0,
  error_detail  JSONB DEFAULT '[]',
  created_by    UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

ALTER TABLE public.import_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "import_logs_admin_select" ON public.import_logs
  FOR SELECT USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY IF NOT EXISTS "import_logs_admin_insert" ON public.import_logs
  FOR INSERT WITH CHECK ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

CREATE INDEX IF NOT EXISTS idx_import_logs_date
  ON public.import_logs (imported_at DESC);

-- 5. career_coach_sessions — optional: track career coach interactions
CREATE TABLE IF NOT EXISTS public.career_coach_sessions (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tab         TEXT NOT NULL,
  data        JSONB DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.career_coach_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "career_coach_select" ON public.career_coach_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "career_coach_insert" ON public.career_coach_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
