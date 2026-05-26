-- ============================================================
--  قِمّة — Job Sources Seed
--  Populates job_sources table with Saudi/Gulf RSS feeds.
--  Run AFTER add_ai_features_schema.sql
--  All sources: public RSS feeds, no TOS violation.
-- ============================================================

INSERT INTO public.job_sources
  (name, type, url, sector, is_active)
VALUES

-- ── Indeed Saudi Arabia (public RSS, legal) ───────────────────
(
  'Indeed — وظائف السعودية (عام)',
  'rss',
  'https://www.indeed.com/rss?q=&l=Saudi+Arabia&sort=date&radius=100',
  NULL,
  true
),
(
  'Indeed — تقنية المعلومات (السعودية)',
  'rss',
  'https://www.indeed.com/rss?q=software+developer&l=Saudi+Arabia&sort=date',
  'تقنية المعلومات',
  true
),
(
  'Indeed — هندسة (السعودية)',
  'rss',
  'https://www.indeed.com/rss?q=engineer&l=Saudi+Arabia&sort=date',
  'الهندسة',
  true
),
(
  'Indeed — مالية ومحاسبة (السعودية)',
  'rss',
  'https://www.indeed.com/rss?q=finance+accounting&l=Saudi+Arabia&sort=date',
  'المالية والمحاسبة',
  true
),
(
  'Indeed — رعاية صحية (السعودية)',
  'rss',
  'https://www.indeed.com/rss?q=healthcare+medical&l=Saudi+Arabia&sort=date',
  'الرعاية الصحية',
  true
),
(
  'Indeed — تسويق ومبيعات (السعودية)',
  'rss',
  'https://www.indeed.com/rss?q=marketing+sales&l=Saudi+Arabia&sort=date',
  'التسويق والمبيعات',
  true
),
(
  'Indeed — موارد بشرية (السعودية)',
  'rss',
  'https://www.indeed.com/rss?q=human+resources+hr&l=Saudi+Arabia&sort=date',
  'الموارد البشرية',
  true
),

-- ── Bayt.com Saudi Arabia (public RSS) ───────────────────────
(
  'Bayt — وظائف السعودية',
  'rss',
  'https://www.bayt.com/en/saudi-arabia/jobs/rss/',
  NULL,
  true
),
(
  'Bayt — وظائف الرياض',
  'rss',
  'https://www.bayt.com/en/saudi-arabia/riyadh-jobs/rss/',
  NULL,
  true
),
(
  'Bayt — وظائف جدة',
  'rss',
  'https://www.bayt.com/en/saudi-arabia/jeddah-jobs/rss/',
  NULL,
  true
),

-- ── Manual sources (admin enters jobs directly) ───────────────
(
  'إدارة — استيراد يدوي',
  'manual',
  NULL,
  NULL,
  true
),
(
  'إدارة — استيراد CSV',
  'csv',
  NULL,
  NULL,
  true
)

ON CONFLICT DO NOTHING;
