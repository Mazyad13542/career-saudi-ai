-- ============================================================
--  قِمّة — Supabase Schema
--  Run this in: Supabase Dashboard → SQL Editor → Run
-- ============================================================

-- ── PROFILES ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id                   UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name            TEXT,
  email                TEXT,
  phone                TEXT,
  city                 TEXT,
  job_title            TEXT,
  bio                  TEXT,
  linkedin_url         TEXT,
  avatar_url           TEXT,
  plan                 TEXT DEFAULT 'free' CHECK (plan IN ('free', 'professional')),
  plan_expires_at      TIMESTAMPTZ,
  career_score         INTEGER DEFAULT 0,
  ats_score            INTEGER DEFAULT 0,
  profile_strength     INTEGER DEFAULT 0,
  streak_days          INTEGER DEFAULT 0,
  english_level        TEXT DEFAULT 'B1',
  applications_count   INTEGER DEFAULT 0,
  replies_count        INTEGER DEFAULT 0,
  last_active_at       TIMESTAMPTZ DEFAULT NOW(),
  role                 TEXT DEFAULT 'candidate' CHECK (role IN ('candidate', 'hr', 'admin')),
  notifications_prefs  JSONB DEFAULT '{"jobMatches":true,"companyReplies":true,"weeklyReport":true,"marketingEmails":false,"smsAlerts":false}',
  privacy_settings     JSONB DEFAULT '{"profileVisible":true,"showEnglishLevel":true,"allowRecruiters":true,"showSalaryExpectation":false}',
  profile_data         JSONB DEFAULT '{}',
  created_at           TIMESTAMPTZ DEFAULT NOW(),
  updated_at           TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.email,
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── CVS ───────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.cvs (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name        TEXT NOT NULL DEFAULT 'سيرتي الذاتية',
  file_path   TEXT,
  file_size   INTEGER,
  file_type   TEXT,
  ats_score   INTEGER DEFAULT 0,
  is_active   BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── JOBS ──────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.jobs (
  id                   UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title                TEXT NOT NULL,
  company              TEXT NOT NULL,
  company_logo         TEXT,
  location             TEXT,
  city                 TEXT,
  salary_min           INTEGER,
  salary_max           INTEGER,
  currency             TEXT DEFAULT 'SAR',
  job_type             TEXT DEFAULT 'دوام كامل',
  experience_level     TEXT DEFAULT 'متوسط',
  sector               TEXT,
  category             TEXT,
  description          TEXT,
  requirements         TEXT[],
  skills               TEXT[],
  benefits             TEXT[],
  created_by           UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_active            BOOLEAN DEFAULT true,
  is_featured          BOOLEAN DEFAULT false,
  is_remote            BOOLEAN DEFAULT false,
  fresh_graduate       BOOLEAN DEFAULT false,
  region               TEXT,
  source               TEXT DEFAULT 'manual',
  source_url           TEXT,
  status               TEXT DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected')),
  views_count          INTEGER DEFAULT 0,
  applications_count   INTEGER DEFAULT 0,
  posted_at            TIMESTAMPTZ DEFAULT NOW(),
  expires_at           TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days'),
  created_at           TIMESTAMPTZ DEFAULT NOW()
);

-- ── SAVED JOBS ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.saved_jobs (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  job_id     UUID REFERENCES public.jobs(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, job_id)
);

-- ── APPLICATIONS ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.applications (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  job_id      UUID REFERENCES public.jobs(id) ON DELETE SET NULL,
  company     TEXT NOT NULL,
  position    TEXT NOT NULL,
  logo        TEXT,
  status      TEXT DEFAULT 'Pending' CHECK (status IN ('Pending','Reviewed','Interview','Offer','Rejected')),
  notes       TEXT,
  cv_id       UUID REFERENCES public.cvs(id) ON DELETE SET NULL,
  applied_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── PAYMENTS ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.payments (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id          UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  paypal_order_id  TEXT UNIQUE,
  amount_usd       NUMERIC(10,2) DEFAULT 26.40,
  amount_sar       NUMERIC(10,2) DEFAULT 99,
  status           TEXT DEFAULT 'completed' CHECK (status IN ('pending','completed','failed','refunded')),
  plan             TEXT DEFAULT 'professional',
  period_months    INTEGER DEFAULT 1,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ── ACTIVITY LOGS ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  event      TEXT NOT NULL,
  metadata   JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── ROW LEVEL SECURITY ────────────────────────────────────────────────────────
ALTER TABLE public.profiles      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cvs           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_jobs    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- profiles
CREATE POLICY "profiles_select" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- cvs
CREATE POLICY "cvs_select" ON public.cvs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "cvs_insert" ON public.cvs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "cvs_update" ON public.cvs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "cvs_delete" ON public.cvs FOR DELETE USING (auth.uid() = user_id);

-- jobs — public read (active + approved only), no anonymous write
CREATE POLICY "jobs_select" ON public.jobs FOR SELECT USING (is_active = true AND status = 'approved');

-- saved_jobs
CREATE POLICY "saved_jobs_select" ON public.saved_jobs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "saved_jobs_insert" ON public.saved_jobs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "saved_jobs_delete" ON public.saved_jobs FOR DELETE USING (auth.uid() = user_id);

-- applications
CREATE POLICY "apps_select" ON public.applications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "apps_insert" ON public.applications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "apps_update" ON public.applications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "apps_delete" ON public.applications FOR DELETE USING (auth.uid() = user_id);

-- payments — insert + select own
CREATE POLICY "payments_select" ON public.payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "payments_insert" ON public.payments FOR INSERT WITH CHECK (auth.uid() = user_id);

-- activity_logs
CREATE POLICY "logs_select" ON public.activity_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "logs_insert" ON public.activity_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ── HR POLICIES ──────────────────────────────────────────────────────────────
-- HR users can create, update, delete their own jobs
CREATE POLICY "hr_jobs_insert" ON public.jobs FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "hr_jobs_update" ON public.jobs FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "hr_jobs_delete" ON public.jobs FOR DELETE USING (auth.uid() = created_by);
-- HR can see all jobs they created (including inactive)
CREATE POLICY "hr_own_jobs_select" ON public.jobs FOR SELECT USING (auth.uid() = created_by);

-- HR can view applications to their jobs
CREATE POLICY "hr_apps_select" ON public.applications FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.jobs j WHERE j.id = applications.job_id AND j.created_by = auth.uid())
);
-- HR can update application status on their jobs
CREATE POLICY "hr_apps_update" ON public.applications FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.jobs j WHERE j.id = applications.job_id AND j.created_by = auth.uid())
);
-- HR can view profiles of candidates who applied to their jobs
CREATE POLICY "hr_profiles_select" ON public.profiles FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.applications a
    JOIN public.jobs j ON a.job_id = j.id
    WHERE a.user_id = profiles.id AND j.created_by = auth.uid()
  )
);

-- ── ADMIN POLICIES ────────────────────────────────────────────────────────────
-- Admin can see all profiles
CREATE POLICY "admin_profiles_select" ON public.profiles FOR SELECT USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);
-- Admin can update any profile
CREATE POLICY "admin_profiles_update" ON public.profiles FOR UPDATE USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);
-- Admin can see all jobs (active or not)
CREATE POLICY "admin_jobs_select" ON public.jobs FOR SELECT USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);
-- Admin can manage all jobs
CREATE POLICY "admin_jobs_all" ON public.jobs FOR ALL USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);
-- Admin can see all applications
CREATE POLICY "admin_apps_select" ON public.applications FOR SELECT USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);
-- Admin can see all payments
CREATE POLICY "admin_payments_select" ON public.payments FOR SELECT USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-- ── STORAGE BUCKET (run separately in Supabase Storage UI) ───────────────────
-- 1. Create bucket named "cvs" with Public: OFF
-- 2. Add storage policy:
--    Bucket: cvs  |  Operation: INSERT  |  Expression: (storage.foldername(name))[1] = auth.uid()::text
--    Bucket: cvs  |  Operation: SELECT  |  Expression: (storage.foldername(name))[1] = auth.uid()::text
--    Bucket: cvs  |  Operation: DELETE  |  Expression: (storage.foldername(name))[1] = auth.uid()::text

-- ── CLIENT INTAKE ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.client_intake (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id          UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  -- Personal
  full_name        TEXT,
  phone            TEXT,
  region           TEXT,
  city             TEXT,
  -- Education
  university       TEXT,
  degree           TEXT,
  major            TEXT,
  graduation_year  TEXT,
  -- Experience
  experience_years TEXT,
  last_job_title   TEXT,
  last_company     TEXT,
  skills           TEXT,
  languages        TEXT[],
  target_job       TEXT,
  target_sector    TEXT,
  -- Additional
  linkedin_url     TEXT,
  projects         TEXT,
  additional_info  TEXT,
  -- Admin
  status           TEXT DEFAULT 'new' CHECK (status IN ('new','in_progress','completed','delivered')),
  admin_notes      TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id)
);

ALTER TABLE public.client_intake ENABLE ROW LEVEL SECURITY;

-- Users can only see/edit their own intake
CREATE POLICY "Users manage own intake" ON public.client_intake
  FOR ALL USING (auth.uid() = user_id);

-- Admins can see all intakes
CREATE POLICY "Admins view all intakes" ON public.client_intake
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ── COMPANY APPLICATIONS ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.company_applications (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_intake_id UUID REFERENCES public.client_intake(id) ON DELETE CASCADE,
  user_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name    TEXT NOT NULL,
  company_email   TEXT NOT NULL,
  company_sector  TEXT,
  email_subject   TEXT,
  status          TEXT DEFAULT 'sent' CHECK (status IN ('sent','failed','replied')),
  sent_at         TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.company_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage applications" ON public.company_applications
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
