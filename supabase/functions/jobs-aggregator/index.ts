/**
 * قِمّة Jobs Aggregator Edge Function
 *
 * Aggregates jobs from configured RSS/XML feeds (public, legal sources only).
 * Called via pg_cron (daily at 03:00 UTC) or manually from admin panel.
 *
 * Deploy: supabase functions deploy jobs-aggregator
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RSSJob {
  title: string;
  company: string;
  city: string;
  description: string;
  url: string;
  postedAt: string;
  sector: string;
  jobType: string;
  experienceLevel: string;
  isRemote: boolean;
}

// ── Fallback RSS sources (used when job_sources table is empty) ────────────
// All sources: public RSS feeds, no terms-of-service violation.
const FALLBACK_RSS: { name: string; url: string; sector: string | null }[] = [
  {
    name: 'Indeed — Saudi Arabia (General)',
    url: 'https://www.indeed.com/rss?q=&l=Saudi+Arabia&sort=date&radius=100',
    sector: null,
  },
  {
    name: 'Indeed — IT & Software (Saudi Arabia)',
    url: 'https://www.indeed.com/rss?q=software+engineer+developer&l=Saudi+Arabia&sort=date',
    sector: 'تقنية المعلومات',
  },
  {
    name: 'Indeed — Engineering (Saudi Arabia)',
    url: 'https://www.indeed.com/rss?q=engineer&l=Saudi+Arabia&sort=date',
    sector: 'الهندسة',
  },
  {
    name: 'Indeed — Finance (Saudi Arabia)',
    url: 'https://www.indeed.com/rss?q=finance+accounting&l=Saudi+Arabia&sort=date',
    sector: 'المالية والمحاسبة',
  },
  {
    name: 'Indeed — Healthcare (Saudi Arabia)',
    url: 'https://www.indeed.com/rss?q=healthcare+medical+nursing&l=Saudi+Arabia&sort=date',
    sector: 'الرعاية الصحية',
  },
  {
    name: 'Bayt — Saudi Arabia (General)',
    url: 'https://www.bayt.com/en/saudi-arabia/jobs/rss/',
    sector: null,
  },
  {
    name: 'Bayt — Riyadh Jobs',
    url: 'https://www.bayt.com/en/saudi-arabia/riyadh-jobs/rss/',
    sector: null,
  },
  {
    name: 'Bayt — Jeddah Jobs',
    url: 'https://www.bayt.com/en/saudi-arabia/jeddah-jobs/rss/',
    sector: null,
  },
];

// ── City extraction ────────────────────────────────────────────────────────
const CITY_MAP: [RegExp, string][] = [
  [/riyadh|الرياض/i,                        'الرياض'],
  [/jeddah|jedda|جدة/i,                     'جدة'],
  [/dammam|الدمام/i,                        'الدمام'],
  [/khobar|al.khobar|الخبر/i,              'الخبر'],
  [/dhahran|الظهران/i,                      'الظهران'],
  [/mecca|makkah|مكة/i,                     'مكة المكرمة'],
  [/medina|madinah|المدينة/i,               'المدينة المنورة'],
  [/tabuk|تبوك/i,                           'تبوك'],
  [/abha|أبها/i,                            'أبها'],
  [/jubail|الجبيل/i,                        'الجبيل'],
  [/yanbu|ينبع/i,                           'ينبع'],
  [/qassim|buraydah|القصيم|بريدة/i,         'القصيم'],
  [/taif|الطائف/i,                          'الطائف'],
  [/jizan|جازان/i,                          'جازان'],
  [/hail|حائل/i,                            'حائل'],
  [/najran|نجران/i,                         'نجران'],
  [/remote|عن بُعد|عن بعد/i,               'عن بُعد'],
];

function extractCity(text: string): string {
  for (const [re, city] of CITY_MAP) {
    if (re.test(text)) return city;
  }
  return 'الرياض';
}

// ── Sector extraction ──────────────────────────────────────────────────────
const SECTOR_PATTERNS: [RegExp, string][] = [
  [/\b(it|software|developer|engineer.*tech|data.*sci|machine.*learn|devops|cloud|cyber|برمجة|تقنية|مطور|بيانات)\b/i, 'تقنية المعلومات'],
  [/\b(finance|accounting|audit|tax|treasury|cfa|محاسب|مالي|خزينة)\b/i, 'المالية والمحاسبة'],
  [/\b(civil|mechanical|electrical|structural|chemical|petroleum|هندسة|مهندس)\b/i, 'الهندسة'],
  [/\b(marketing|sales|brand|digital.*market|seo|sem|تسويق|مبيعات|علامة)\b/i, 'التسويق والمبيعات'],
  [/\b(hr|human.resources|talent|recruitment|payroll|موارد.بشرية|توظيف)\b/i, 'الموارد البشرية'],
  [/\b(health|medical|nurs|pharma|doctor|clinic|طب|صحة|تمريض|صيدل)\b/i, 'الرعاية الصحية'],
  [/\b(teach|education|academic|school|university|تعليم|معلم|تدريس)\b/i, 'التعليم'],
  [/\b(legal|law|compliance|attorney|قانون|محامي|امتثال)\b/i, 'القانون'],
  [/\b(logistics|supply.chain|warehouse|transport|لوجستي|مستودع|توريد)\b/i, 'العمليات والإنتاج'],
];

function extractSector(text: string, hint?: string | null): string {
  const src = (hint ?? '') + ' ' + text;
  for (const [re, sector] of SECTOR_PATTERNS) {
    if (re.test(src)) return sector;
  }
  return 'الإدارة';
}

// ── Experience level extraction ────────────────────────────────────────────
function extractExperienceLevel(text: string): string {
  const t = text.toLowerCase();
  if (/fresh.*grad|entry.level|junior|0.2 year|less.*year|خريج|حديث|مبتدئ/.test(t)) return 'مبتدئ';
  if (/senior|lead|principal|خبير|أول|رئيس/.test(t)) return 'خبير';
  if (/mid|3.6 year|متوسط/.test(t)) return 'متوسط';
  return 'متوسط';
}

// ── RSS feed parser ────────────────────────────────────────────────────────
async function parseRSSFeed(url: string, sourceSector: string | null): Promise<RSSJob[]> {
  let xml = '';
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Qimmah-JobAggregator/1.0 (+https://qimma.sa; RSS reader for job aggregation)',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*',
      },
      signal: AbortSignal.timeout(20000),
    });
    if (!res.ok) return [];
    xml = await res.text();
  } catch {
    return [];
  }

  const jobs: RSSJob[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  let m: RegExpExecArray | null;

  while ((m = itemRegex.exec(xml)) !== null) {
    const item = m[1];

    // Extract field handling CDATA and plain text
    const get = (tag: string): string => {
      const r = new RegExp(
        `<${tag}[^>]*>(?:<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>|([\\s\\S]*?))<\\/${tag}>`, 'i'
      );
      const match = item.match(r);
      return ((match?.[1] ?? match?.[2] ?? '')).trim();
    };

    const title = get('title');
    if (!title || title.length < 3) continue;

    // Strip HTML tags from description
    const rawDesc  = get('description');
    const cleanDesc = rawDesc.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 2000);

    const fullText  = title + ' ' + cleanDesc + ' ' + get('category');
    const isRemote  = /remote|عن.بُعد|عن.بعد/i.test(fullText);

    jobs.push({
      title:           title.slice(0, 200),
      company:         (get('company') || get('author') || get('dc:creator') || 'غير محدد').slice(0, 200),
      city:            isRemote ? 'عن بُعد' : extractCity(fullText),
      description:     cleanDesc,
      url:             (get('link') || get('guid')).slice(0, 500),
      postedAt:        get('pubDate') || get('dc:date') || new Date().toISOString(),
      sector:          extractSector(fullText, sourceSector),
      jobType:         isRemote ? 'عن بُعد' : 'دوام كامل',
      experienceLevel: extractExperienceLevel(fullText),
      isRemote,
    });
  }

  return jobs;
}

// ── Deduplication check ────────────────────────────────────────────────────
async function isDuplicate(supabase: ReturnType<typeof createClient>, title: string, company: string): Promise<boolean> {
  const { data } = await supabase
    .from('jobs')
    .select('id')
    .ilike('title', title.slice(0, 80))
    .ilike('company', company.slice(0, 80))
    .limit(1);
  return (data?.length ?? 0) > 0;
}

// ── Main handler ───────────────────────────────────────────────────────────
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    // Fetch active RSS/API sources from DB
    const { data: dbSources } = await supabase
      .from('job_sources')
      .select('*')
      .eq('is_active', true)
      .in('type', ['rss', 'api']);

    // Merge DB sources with fallback list, DB sources take priority
    const dbUrls = new Set((dbSources ?? []).map((s: { url: string }) => s.url).filter(Boolean));
    const fallbacks = FALLBACK_RSS
      .filter(f => !dbUrls.has(f.url))
      .map(f => ({ id: null, name: f.name, url: f.url, type: 'rss', sector: f.sector }));

    const allSources = [...(dbSources ?? []), ...fallbacks];

    const totals = { sources_processed: 0, total_fetched: 0, inserted: 0, duplicates: 0, errors: 0 };

    for (const source of allSources) {
      if (!source.url) continue;
      totals.sources_processed++;

      const jobs = await parseRSSFeed(source.url, source.sector ?? null);
      totals.total_fetched += jobs.length;

      let srcInserted = 0, srcDuplicates = 0, srcErrors = 0;

      for (const job of jobs) {
        try {
          const dup = await isDuplicate(supabase, job.title, job.company);
          if (dup) { totals.duplicates++; srcDuplicates++; continue; }

          const { error: insErr } = await supabase.from('jobs').insert({
            title:            job.title,
            company:          job.company,
            city:             job.city,
            description:      job.description,
            source_url:       job.url,
            sector:           job.sector,
            job_type:         job.jobType,
            experience_level: job.experienceLevel,
            is_remote:        job.isRemote,
            source:           source.type ?? 'rss',
            status:           'pending',   // admin must approve before going live
            is_active:        false,
            fresh_graduate:   job.experienceLevel === 'مبتدئ',
            posted_at:        (() => { try { return new Date(job.postedAt).toISOString(); } catch { return new Date().toISOString(); } })(),
            expires_at:       new Date(Date.now() + 30 * 86400 * 1000).toISOString(),
          });

          if (insErr) { totals.errors++; srcErrors++; }
          else        { totals.inserted++; srcInserted++; }
        } catch {
          totals.errors++;
          srcErrors++;
        }
      }

      // Update last_run_at and log import for DB sources
      if (source.id) {
        await Promise.all([
          supabase.from('job_sources').update({ last_run_at: new Date().toISOString() }).eq('id', source.id),
          supabase.from('import_logs').insert({
            source_id:   source.id,
            source_type: source.type ?? 'rss',
            source_name: source.name,
            total_rows:  jobs.length,
            inserted:    srcInserted,
            duplicates:  srcDuplicates,
            errors:      srcErrors,
          }),
        ]);
      }
    }

    return new Response(JSON.stringify({ success: true, results: totals }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
