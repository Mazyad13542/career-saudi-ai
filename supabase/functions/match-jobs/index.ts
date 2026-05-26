/**
 * قِمّة Job Matching Edge Function
 * Runs after profile update or on cron — computes match scores for all active jobs.
 *
 * Deploy: supabase functions deploy match-jobs
 * Call:   POST /functions/v1/match-jobs { userId: 'uuid' }
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function normText(str: string) {
  return (str || '').toLowerCase().replace(/[^a-zأ-ي0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
}

function skillScore(userSkills: string[], jobSkills: string[], jobDesc: string): number {
  if (!userSkills?.length) return 0;
  const desc = normText(jobDesc);
  let matched = 0;
  for (const s of userSkills) {
    const ns = normText(s);
    if (!ns) continue;
    if ((jobSkills || []).some((js: string) => normText(js).includes(ns)) || desc.includes(ns)) matched++;
  }
  return Math.round((matched / userSkills.length) * 100);
}

function sectorScore(userSectors: string[], jobSector: string): number {
  if (!jobSector || !userSectors?.length) return 50;
  return userSectors.some((s: string) => normText(s) === normText(jobSector)) ? 100 : 20;
}

function cityScore(userCities: string[], jobCity: string, isRemote: boolean): number {
  if (isRemote) return 100;
  if (!userCities?.length || !jobCity) return 60;
  return userCities.some((c: string) => normText(c) === normText(jobCity)) ? 100 : 25;
}

function expScore(userYears: number, level: string): number {
  const l = normText(level);
  if (!l) return 70;
  if (l.includes('مبتدئ') || l.includes('حديث') || l.includes('خريج')) return userYears <= 2 ? 100 : 60;
  if (l.includes('متوسط')) return (userYears >= 2 && userYears <= 6) ? 100 : 70;
  if (l.includes('متقدم') || l.includes('خبير')) return userYears >= 5 ? 100 : 50;
  return 70;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { userId } = await req.json();
    if (!userId) throw new Error('userId required');

    // Fetch profile
    const { data: profile, error: pErr } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (pErr || !profile) throw new Error('Profile not found');

    // Fetch active jobs
    const { data: jobs } = await supabase
      .from('jobs')
      .select('id, title, company, city, sector, job_type, experience_level, skills, description, is_remote')
      .eq('is_active', true)
      .eq('status', 'approved')
      .limit(500);

    if (!jobs?.length) {
      return new Response(JSON.stringify({ matched: 0 }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const upserts = [];
    for (const job of jobs) {
      const sk = skillScore(profile.skills || [], job.skills || [], job.description || '');
      const sec = sectorScore(profile.preferred_sectors || [], job.sector || '');
      const city = cityScore(profile.preferred_cities || [], job.city || '', job.is_remote || false);
      const exp = expScore(profile.experience_years || 0, job.experience_level || '');
      const score = Math.round(sk * 0.35 + sec * 0.25 + city * 0.20 + exp * 0.20);

      if (score >= 35) {
        upserts.push({
          user_id: userId,
          job_id:  job.id,
          score,
          reasons: [
            { label: 'المهارات',   score: sk },
            { label: 'القطاع',    score: sec },
            { label: 'المدينة',   score: city },
            { label: 'الخبرة',    score: exp },
          ],
        });
      }
    }

    if (upserts.length) {
      await supabase.from('job_matches').upsert(upserts, { onConflict: 'user_id,job_id' });
    }

    return new Response(JSON.stringify({ matched: upserts.length }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
