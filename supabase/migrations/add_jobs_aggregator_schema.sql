-- ============================================================
--  Jobs Aggregator Schema Migration
--  Run in: Supabase Dashboard → SQL Editor → Run
-- ============================================================

-- 1. New columns on jobs table
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS region          TEXT;
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS source          TEXT DEFAULT 'manual';
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS source_url      TEXT;
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS is_remote       BOOLEAN DEFAULT false;
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS fresh_graduate  BOOLEAN DEFAULT false;
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS status         TEXT DEFAULT 'approved'
  CHECK (status IN ('pending', 'approved', 'rejected'));

-- 2. Index for fast duplicate checking (title + company + city)
CREATE INDEX IF NOT EXISTS idx_jobs_dedup
  ON public.jobs (lower(title), lower(company), lower(coalesce(city, '')));

-- 3. Index for common filter patterns
CREATE INDEX IF NOT EXISTS idx_jobs_active_posted
  ON public.jobs (is_active, status, posted_at DESC);

CREATE INDEX IF NOT EXISTS idx_jobs_city
  ON public.jobs (city) WHERE is_active = true AND status = 'approved';

CREATE INDEX IF NOT EXISTS idx_jobs_remote
  ON public.jobs (is_remote) WHERE is_active = true AND status = 'approved';

CREATE INDEX IF NOT EXISTS idx_jobs_fresh_grad
  ON public.jobs (fresh_graduate) WHERE is_active = true AND status = 'approved';

-- 4. Admin RLS: admin can see pending/rejected jobs too
CREATE POLICY IF NOT EXISTS "admin_jobs_all_statuses" ON public.jobs FOR SELECT USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'hr')
);

-- 5. HR can see their own pending/rejected jobs too
DROP POLICY IF EXISTS "hr_own_jobs_select" ON public.jobs;
CREATE POLICY "hr_own_jobs_select" ON public.jobs FOR SELECT USING (
  auth.uid() = created_by
);

-- 6. Update public jobs select to only show approved
DROP POLICY IF EXISTS "jobs_select" ON public.jobs;
CREATE POLICY "jobs_select" ON public.jobs FOR SELECT USING (
  is_active = true AND status = 'approved'
);
