-- Migration: add role to profiles, created_by to jobs, HR + admin RLS policies
-- Run this in Supabase SQL Editor on existing databases

-- 1. Add role column to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'candidate' CHECK (role IN ('candidate', 'hr', 'admin'));

-- 2. Add created_by to jobs (who posted the job)
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- 3. HR job policies
CREATE POLICY IF NOT EXISTS "hr_jobs_insert"      ON public.jobs FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY IF NOT EXISTS "hr_jobs_update"      ON public.jobs FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY IF NOT EXISTS "hr_jobs_delete"      ON public.jobs FOR DELETE USING (auth.uid() = created_by);
CREATE POLICY IF NOT EXISTS "hr_own_jobs_select"  ON public.jobs FOR SELECT USING (auth.uid() = created_by);

-- 4. HR application policies
CREATE POLICY IF NOT EXISTS "hr_apps_select" ON public.applications FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.jobs j WHERE j.id = applications.job_id AND j.created_by = auth.uid())
);
CREATE POLICY IF NOT EXISTS "hr_apps_update" ON public.applications FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.jobs j WHERE j.id = applications.job_id AND j.created_by = auth.uid())
);

-- 5. HR profile visibility (see applicants to their jobs)
CREATE POLICY IF NOT EXISTS "hr_profiles_select" ON public.profiles FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.applications a
    JOIN public.jobs j ON a.job_id = j.id
    WHERE a.user_id = profiles.id AND j.created_by = auth.uid()
  )
);

-- 6. Admin policies
CREATE POLICY IF NOT EXISTS "admin_profiles_select" ON public.profiles FOR SELECT USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);
CREATE POLICY IF NOT EXISTS "admin_profiles_update" ON public.profiles FOR UPDATE USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);
CREATE POLICY IF NOT EXISTS "admin_jobs_select" ON public.jobs FOR SELECT USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);
CREATE POLICY IF NOT EXISTS "admin_jobs_all" ON public.jobs FOR ALL USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);
CREATE POLICY IF NOT EXISTS "admin_apps_select" ON public.applications FOR SELECT USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);
CREATE POLICY IF NOT EXISTS "admin_payments_select" ON public.payments FOR SELECT USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);
