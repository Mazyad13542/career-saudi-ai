# قِمّة — Production Deployment Guide

> **Target:** Vercel (frontend) + Supabase (backend)  
> **Domain:** qimma.sa  
> **Stack:** React 19 + Vite 8 + Supabase + PayPal

---

## Step 1 — Supabase Database Setup

Run these SQL files **in order** in Supabase Dashboard → SQL Editor:

```
1. supabase/schema.sql                              ← core tables, triggers, RLS
2. supabase/migrations/add_profile_data.sql         ← profile_data JSONB column
3. supabase/migrations/add_hr_admin_schema.sql      ← HR/admin roles and policies
4. supabase/migrations/add_jobs_aggregator_schema.sql ← aggregator indexes
5. supabase/migrations/add_ai_features_schema.sql   ← interview/english/career tables
6. supabase/migrations/add_production_schema.sql    ← notifications, job_matches, onboarding, etc.
7. supabase/seed_jobs_production.sql                ← 150 Saudi seed jobs
8. supabase/seed_job_sources.sql                    ← RSS source configuration
```

---

## Step 2 — Supabase Extensions

In **Database → Extensions**, enable:
- `pg_cron`
- `pg_net`
- `uuid-ossp` (usually pre-enabled)

Then run (after replacing `<YOUR_SERVICE_ROLE_KEY>`):
```
supabase/migrations/add_cron_jobs.sql
```

---

## Step 3 — Supabase Storage

Create a private bucket named `cvs`:
1. Storage → New Bucket → Name: `cvs` → Public: OFF
2. Add RLS policies:
   - **INSERT**: `(storage.foldername(name))[1] = auth.uid()::text`
   - **SELECT**: `(storage.foldername(name))[1] = auth.uid()::text`
   - **DELETE**: `(storage.foldername(name))[1] = auth.uid()::text`

---

## Step 4 — Google OAuth Setup

In Supabase Dashboard → Authentication → Providers → Google:

1. Enable Google provider
2. Note the **Callback URL**: `https://eerduxtweznidslizpgb.supabase.co/auth/v1/callback`

In [Google Cloud Console](https://console.cloud.google.com):
1. APIs & Services → Credentials → OAuth 2.0 Client IDs
2. Add Authorized redirect URIs:
   - `https://eerduxtweznidslizpgb.supabase.co/auth/v1/callback`
3. Add Authorized JavaScript origins:
   - `https://qimma.sa`
   - `http://localhost:5173`
4. Copy Client ID and Client Secret → paste into Supabase Google provider settings

---

## Step 5 — Edge Functions

```bash
# Install Supabase CLI if needed
npm install -g supabase

# Login
supabase login

# Link to project
supabase link --project-ref eerduxtweznidslizpgb

# Deploy all three functions
supabase functions deploy jobs-aggregator
supabase functions deploy send-notification
supabase functions deploy match-jobs

# Set Resend secret for email notifications
supabase secrets set RESEND_API_KEY=re_<your_key>
```

---

## Step 6 — Vercel Environment Variables

In Vercel Dashboard → Project → Settings → Environment Variables, add:

| Variable | Value | Environments |
|----------|-------|-------------|
| `VITE_SUPABASE_URL` | `https://eerduxtweznidslizpgb.supabase.co` | All |
| `VITE_SUPABASE_ANON_KEY` | `<your_anon_key>` | All |
| `VITE_PAYPAL_CLIENT_ID` | `<sandbox_or_live_client_id>` | All |

> ⚠️ **NEVER** add `PAYPAL_SECRET` or any service-role key to Vercel  
> ⚠️ **NEVER** prefix secret keys with `VITE_`

---

## Step 7 — Vercel Project Settings

In Vercel Dashboard:
1. **Framework Preset**: Vite
2. **Build Command**: `npm run build`
3. **Output Directory**: `dist`
4. **Root Directory**: `/` (project root)

The `vercel.json` already handles:
- SPA rewrites (`/* → /index.html`)
- CSP headers (PayPal, Supabase, Resend)
- HSTS, X-Frame-Options, X-Content-Type-Options
- Asset cache headers (1 year immutable)

---

## Step 8 — Custom Domain

1. Vercel → Domains → Add `qimma.sa`
2. Add DNS records at your registrar:
   - `A` record: `76.76.21.21`
   - `CNAME` record: `www` → `cname.vercel-dns.com`
3. Update `VITE_SITE_URL=https://qimma.sa` in Vercel env vars

---

## Step 9 — PayPal Production Switch

When ready to accept real payments:
1. Go to [developer.paypal.com](https://developer.paypal.com) → Apps & Credentials → Live
2. Create a Live app → copy the **Live Client ID**
3. Update Vercel env var: `VITE_PAYPAL_CLIENT_ID` = Live Client ID

---

## Step 10 — Set First Admin User

After deploying, promote your account to admin:
```sql
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'mazyad13542@gmail.com';
```

Run this in Supabase Dashboard → SQL Editor.

---

## Step 11 — Resend Email Domain (Optional)

For `@qimma.sa` email sending:
1. [resend.com](https://resend.com) → Domains → Add `qimma.sa`
2. Add the DNS TXT records shown in Resend dashboard
3. Update the `from` address in `supabase/functions/send-notification/index.ts`

---

## Post-Deploy Checklist

- [ ] Open `https://qimma.sa` — landing page loads
- [ ] Register a new account → onboarding wizard appears
- [ ] Complete onboarding → redirect to `/dashboard`
- [ ] View "الوظائف المناسبة لي" — jobs appear with match scores
- [ ] Apply to a job → application tracked in "متابعة التقديمات"
- [ ] Open PayPal checkout → sandbox payment completes
- [ ] Check `/payment-success` → premium badge appears
- [ ] Log in as HR role → `/hr-dashboard` accessible
- [ ] Log in as admin → `/admin` accessible, pending jobs alert shows
- [ ] Admin approves a pending job → job goes live
- [ ] Notification bell shows real-time updates

---

## OG Image (Action Required)

An SVG social card exists at `public/og-image.svg`.  
For maximum Twitter/Facebook compatibility, export a PNG:

1. Open `public/og-image.svg` in a browser
2. Screenshot at 1200×630 px
3. Save as `public/og-image.png`
4. Update `index.html`: change `og-image.svg` → `og-image.png`

---

## Architecture Summary

```
Frontend (Vercel)
  React 19 + Vite 8
  Tailwind CSS v4 (RTL Arabic)
  7 vendor chunks — avg TTFB < 200ms

Backend (Supabase)
  PostgreSQL 15 with RLS
  Auth (Email + Google OAuth)
  Storage (CVs bucket)
  Edge Functions (Deno):
    jobs-aggregator  — daily RSS ingestion
    send-notification — in-app + email alerts
    match-jobs       — server-side AI matching
  pg_cron:
    aggregate-jobs-daily  (03:00 UTC)
    expire-old-jobs       (04:00 UTC)
    clean-old-notifications (02:00 UTC Sun)
    clean-analytics       (01:00 UTC 1st)
    refresh-job-matches   (05:00 UTC Sun)

Payments
  PayPal SDK (sandbox → live toggle)
  99 SAR/month (= 26.40 USD)
  Stored in: payments table

Email
  Resend API (via Edge Function)
  Templates: welcome, job_match, application_update
```
