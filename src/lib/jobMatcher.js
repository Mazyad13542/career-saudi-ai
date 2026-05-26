/**
 * Rule-based AI Job Matching Engine
 * Scores 0-100 how well a job matches a user's profile.
 * No external API needed — runs entirely client-side.
 */

// Sector keyword maps for fuzzy matching
const SECTOR_ALIASES = {
  'تقنية المعلومات': ['تقنية', 'برمجة', 'it', 'tech', 'software', 'برمجيات', 'حاسب', 'ذكاء اصطناعي', 'سايبر', 'شبكات', 'بيانات', 'data'],
  'المالية والمحاسبة': ['مالية', 'محاسبة', 'مال', 'بنك', 'استثمار', 'أسواق', 'تمويل', 'مصرفية', 'actuarial'],
  'الهندسة': ['هندسة', 'مدني', 'ميكانيكا', 'كهرباء', 'معماري', 'كيمياء', 'صناعي', 'بتروكيماوي', 'مساحة'],
  'التسويق والمبيعات': ['تسويق', 'مبيعات', 'إعلان', 'علامة تجارية', 'رقمي', 'content', 'social media', 'سوشيال'],
  'الموارد البشرية': ['موارد بشرية', 'hr', 'توظيف', 'تدريب', 'شؤون موظفين'],
  'الرعاية الصحية': ['طب', 'صحة', 'تمريض', 'صيدلة', 'مستشفى', 'طبي', 'عيادة'],
  'التعليم': ['تعليم', 'تدريس', 'معلم', 'أكاديمي', 'جامعة', 'مدرسة'],
  'الإدارة': ['إدارة', 'تنفيذي', 'مدير', 'إداري', 'operations', 'عمليات'],
  'القانون': ['قانون', 'حقوق', 'مستشار قانوني', 'محامي', 'legal'],
  'العمليات والإنتاج': ['إنتاج', 'مصنع', 'logistics', 'لوجستي', 'سلسلة توريد', 'مستودع'],
};

function normText(str) {
  return (str || '').toLowerCase().replace(/[^a-zأ-ي0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
}

function skillOverlap(userSkills = [], jobSkills = [], jobDescription = '') {
  if (!userSkills.length) return 0;
  const normDesc = normText(jobDescription);
  let matched = 0;
  for (const skill of userSkills) {
    const ns = normText(skill);
    if (!ns) continue;
    const inJobSkills = (jobSkills || []).some(js => normText(js).includes(ns) || ns.includes(normText(js)));
    const inDesc      = normDesc.includes(ns);
    if (inJobSkills || inDesc) matched++;
  }
  return Math.round((matched / userSkills.length) * 100);
}

function sectorMatch(userSectors = [], jobSector = '', jobTitle = '') {
  if (!jobSector && !jobTitle) return 50; // neutral when no sector info
  const normJob  = normText(jobSector + ' ' + jobTitle);
  for (const us of userSectors) {
    if (!us) continue;
    if (normText(us) === normText(jobSector)) return 100;
    const aliases = SECTOR_ALIASES[us] || [];
    if (aliases.some(a => normJob.includes(a))) return 85;
  }
  return 20;
}

function cityMatch(userCities = [], jobCity = '', isRemote = false) {
  if (isRemote) return 100;
  if (!jobCity) return 60;
  if (!userCities?.length) return 60;
  return userCities.some(c => normText(c) === normText(jobCity)) ? 100 : 25;
}

function experienceMatch(userYears = 0, jobLevel = '') {
  const lvl = normText(jobLevel);
  if (!lvl) return 70;
  if (lvl.includes('حديث') || lvl.includes('مبتدئ') || lvl.includes('junior') || lvl.includes('خريج')) {
    return userYears <= 2 ? 100 : userYears <= 4 ? 75 : 50;
  }
  if (lvl.includes('متوسط') || lvl.includes('mid')) {
    return userYears >= 2 && userYears <= 6 ? 100 : userYears < 2 ? 60 : 80;
  }
  if (lvl.includes('خبير') || lvl.includes('senior') || lvl.includes('متقدم')) {
    return userYears >= 5 ? 100 : userYears >= 3 ? 75 : 40;
  }
  return 70;
}

function jobTypeMatch(userTypes = [], jobType = '') {
  if (!userTypes?.length || !jobType) return 70;
  return userTypes.some(t => normText(t) === normText(jobType)) ? 100 : 50;
}

function remoteMatch(openToRemote = false, isRemote = false) {
  if (openToRemote && isRemote) return 100;
  if (!openToRemote && !isRemote) return 80;
  return 60;
}

/**
 * Main match function.
 * @param {Object} profile - user profile from Supabase
 * @param {Object} job     - job row from Supabase
 * @returns {{ score: number, reasons: Array }}
 */
export function matchJobToProfile(profile, job) {
  if (!profile || !job) return { score: 0, reasons: [] };

  const weights = {
    skills:     0.35,
    sector:     0.20,
    city:       0.15,
    experience: 0.15,
    jobType:    0.10,
    remote:     0.05,
  };

  const scores = {
    skills:     skillOverlap(profile.skills, job.skills, job.description),
    sector:     sectorMatch(profile.preferred_sectors, job.sector, job.title),
    city:       cityMatch(profile.preferred_cities, job.city, job.is_remote),
    experience: experienceMatch(profile.experience_years || 0, job.experience_level),
    jobType:    jobTypeMatch(profile.preferred_job_types, job.job_type),
    remote:     remoteMatch(profile.open_to_remote, job.is_remote),
  };

  const LABELS = {
    skills:     'تطابق المهارات',
    sector:     'القطاع المهني',
    city:       'الموقع الجغرافي',
    experience: 'مستوى الخبرة',
    jobType:    'نوع الدوام',
    remote:     'العمل عن بُعد',
  };

  const reasons = Object.entries(scores).map(([key, s]) => ({
    label:  LABELS[key],
    score:  s,
    weight: weights[key],
  }));

  const total = Math.round(
    Object.entries(weights).reduce((sum, [k, w]) => sum + scores[k] * w, 0)
  );

  return { score: Math.min(total, 100), reasons };
}

/**
 * Rank and filter jobs by match score for a given profile.
 * Returns jobs sorted by score descending, filtered to >= minScore.
 */
export function rankJobsForProfile(profile, jobs, minScore = 40) {
  return jobs
    .map(job => ({ ...job, _match: matchJobToProfile(profile, job) }))
    .filter(j => j._match.score >= minScore)
    .sort((a, b) => b._match.score - a._match.score);
}

/**
 * Get match label from score
 */
export function matchLabel(score) {
  if (score >= 85) return { text: 'تطابق ممتاز', color: 'text-green-700 bg-green-100' };
  if (score >= 70) return { text: 'تطابق جيد جداً', color: 'text-blue-700 bg-blue-100' };
  if (score >= 55) return { text: 'تطابق جيد', color: 'text-[#006C35] bg-[#006C35]/10' };
  if (score >= 40) return { text: 'تطابق معقول', color: 'text-amber-700 bg-amber-100' };
  return { text: 'تطابق ضعيف', color: 'text-gray-500 bg-gray-100' };
}
