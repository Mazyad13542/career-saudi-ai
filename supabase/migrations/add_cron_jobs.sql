-- ============================================================
--  قِمّة — pg_cron Scheduled Jobs
--  Run in: Supabase Dashboard → SQL Editor → Run
--
--  BEFORE running this file:
--    1. Enable pg_cron  → Database → Extensions → pg_cron
--    2. Enable pg_net   → Database → Extensions → pg_net
--    3. Replace the two placeholder values below:
--         <YOUR_PROJECT_REF>   → your Supabase project reference (e.g. eerduxtweznidslizpgb)
--         <YOUR_SERVICE_ROLE_KEY> → from Project Settings → API → service_role key
--
--  Idempotent: cron.schedule() is a REPLACE — safe to re-run.
-- ============================================================

-- ── Helper: store project settings so cron jobs can reference them ────────────
-- Run this once; values are stored in the postgres config layer.
-- Replace both values with your real project credentials.
ALTER DATABASE postgres SET app.supabase_url     = 'https://eerduxtweznidslizpgb.supabase.co';
ALTER DATABASE postgres SET app.service_role_key = '<YOUR_SERVICE_ROLE_KEY>';


-- ── 1. Aggregate jobs daily at 6 AM Saudi time (UTC+3 = 03:00 UTC) ───────────
SELECT cron.schedule(
  'aggregate-jobs-daily',
  '0 3 * * *',
  $$
  SELECT net.http_post(
    url     := current_setting('app.supabase_url') || '/functions/v1/jobs-aggregator',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || current_setting('app.service_role_key'),
      'Content-Type',  'application/json'
    ),
    body    := '{}'::jsonb
  );
  $$
);


-- ── 2. Expire jobs past their expires_at date (daily 04:00 UTC) ──────────────
SELECT cron.schedule(
  'expire-old-jobs',
  '0 4 * * *',
  $$
  UPDATE public.jobs
  SET    is_active = false
  WHERE  expires_at < NOW()
    AND  is_active  = true;
  $$
);


-- ── 3. Clean read notifications older than 90 days (Sunday 02:00 UTC) ─────────
SELECT cron.schedule(
  'clean-old-notifications',
  '0 2 * * 0',
  $$
  DELETE FROM public.notifications
  WHERE  created_at < NOW() - INTERVAL '90 days'
    AND  is_read = true;
  $$
);


-- ── 4. Clean analytics events older than 1 year (1st of each month 01:00) ────
SELECT cron.schedule(
  'clean-analytics',
  '0 1 1 * *',
  $$
  DELETE FROM public.analytics_events
  WHERE created_at < NOW() - INTERVAL '1 year';
  $$
);


-- ── 5. Purge stale job_matches older than 7 days (Sunday 05:00 UTC) ──────────
-- Keeps the table lean; match-jobs Edge Function re-calculates on demand.
SELECT cron.schedule(
  'refresh-job-matches',
  '0 5 * * 0',
  $$
  DELETE FROM public.job_matches
  WHERE created_at < NOW() - INTERVAL '7 days';
  $$
);


-- ── Verify scheduled jobs ─────────────────────────────────────────────────────
-- SELECT jobid, jobname, schedule, active FROM cron.job ORDER BY jobid;

-- ── Remove a job if needed ────────────────────────────────────────────────────
-- SELECT cron.unschedule('aggregate-jobs-daily');
