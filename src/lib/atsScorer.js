/**
 * ATS (Applicant Tracking System) Scorer
 * Scores a CV/profile against a job description — rule-based, no external API.
 */

// High-demand keywords by sector
const SECTOR_KEYWORDS = {
  'تقنية المعلومات': [
    'javascript', 'react', 'node', 'python', 'sql', 'aws', 'docker', 'kubernetes',
    'git', 'api', 'agile', 'scrum', 'typescript', 'vue', 'angular', 'linux',
    'azure', 'ci/cd', 'machine learning', 'data science', 'mongodb', 'postgresql',
    'redis', 'graphql', 'microservices', 'devops', 'selenium', 'jira',
  ],
  'المالية والمحاسبة': [
    'excel', 'ifrs', 'gaap', 'quickbooks', 'sap', 'audit', 'tax', 'cpa', 'cfa',
    'financial analysis', 'forecasting', 'budget', 'reconciliation', 'erp',
    'zakat', 'vat', 'financial reporting', 'variance analysis', 'accounting',
  ],
  'الهندسة': [
    'autocad', 'solidworks', 'catia', 'ansys', 'pmp', 'iso', 'quality control',
    'project management', 'lean', 'six sigma', 'revit', 'structural', 'mechanical',
    'electrical', 'civil', 'safety', 'hse', 'procurement', 'commissioning',
  ],
  'التسويق والمبيعات': [
    'seo', 'sem', 'google ads', 'facebook ads', 'crm', 'salesforce', 'hubspot',
    'content', 'social media', 'branding', 'market research', 'analytics',
    'email marketing', 'kpi', 'roi', 'b2b', 'b2c', 'lead generation', 'conversion',
  ],
  'الموارد البشرية': [
    'recruitment', 'onboarding', 'performance management', 'payroll', 'kpi',
    'succession planning', 'talent management', 'shrm', 'training', 'l&d',
    'compensation', 'benefits', 'policy', 'compliance', 'workforce planning',
  ],
  'الرعاية الصحية': [
    'patient care', 'clinical', 'diagnosis', 'treatment', 'pharmacology',
    'emr', 'ehr', 'bls', 'acls', 'cpr', 'healthcare', 'nursing', 'surgery',
    'radiology', 'pharmacy', 'clinical research', 'medical coding',
  ],
};

const GENERIC_POWER_KEYWORDS = [
  'leadership', 'team management', 'project management', 'communication',
  'problem solving', 'analytical', 'strategic', 'bilingual', 'english', 'arabic',
  'vision 2030', 'saudi', 'gcc', 'results-driven', 'cross-functional',
];

function normText(str) {
  return (str || '').toLowerCase().replace(/[^؀-ۿa-z0-9 ]/g, ' ').replace(/\s+/g, ' ');
}

function extractKeywords(text = '') {
  const norm = normText(text);
  const found = new Set();
  const allKws = [
    ...GENERIC_POWER_KEYWORDS,
    ...Object.values(SECTOR_KEYWORDS).flat(),
  ];
  for (const kw of allKws) {
    if (norm.includes(normText(kw))) found.add(kw);
  }
  return [...found];
}

function computeKeywordMatch(cvText = '', jobText = '') {
  const jobKws = extractKeywords(jobText);
  if (!jobKws.length) return { score: 50, matched: [], missing: [] };

  const normCV = normText(cvText);
  const matched = jobKws.filter(kw => normCV.includes(normText(kw)));
  const missing  = jobKws.filter(kw => !normCV.includes(normText(kw))).slice(0, 8);

  return {
    score:   Math.round((matched.length / jobKws.length) * 100),
    matched,
    missing,
  };
}

function computeFormatScore(profile = {}) {
  let score = 0;
  const checks = [];

  if (profile.full_name?.length > 3)              { score += 10; checks.push({ label: 'الاسم الكامل', ok: true }); }
  else                                             { checks.push({ label: 'الاسم الكامل', ok: false }); }

  if (profile.job_title)                           { score += 10; checks.push({ label: 'المسمى الوظيفي', ok: true }); }
  else                                             { checks.push({ label: 'المسمى الوظيفي', ok: false }); }

  if (profile.bio?.length >= 100)                  { score += 15; checks.push({ label: 'الملخص المهني (١٠٠+ حرف)', ok: true }); }
  else                                             { checks.push({ label: 'الملخص المهني', ok: false }); }

  if ((profile.skills || []).length >= 5)          { score += 20; checks.push({ label: '٥+ مهارات', ok: true }); }
  else if ((profile.skills || []).length > 0)      { score += 10; checks.push({ label: 'المهارات (أضف أكثر)', ok: false }); }
  else                                             { checks.push({ label: 'المهارات', ok: false }); }

  if (profile.experience_years > 0)               { score += 15; checks.push({ label: 'سنوات الخبرة', ok: true }); }
  else                                             { checks.push({ label: 'سنوات الخبرة', ok: false }); }

  if (profile.education_level)                    { score += 10; checks.push({ label: 'المستوى التعليمي', ok: true }); }
  else                                             { checks.push({ label: 'المستوى التعليمي', ok: false }); }

  if (profile.linkedin_url)                       { score += 10; checks.push({ label: 'رابط LinkedIn', ok: true }); }
  else                                             { checks.push({ label: 'رابط LinkedIn', ok: false }); }

  if (profile.city)                               { score += 5;  checks.push({ label: 'المدينة', ok: true }); }
  else                                             { checks.push({ label: 'المدينة', ok: false }); }

  if (profile.english_level && profile.english_level !== 'B1') { score += 5; checks.push({ label: 'مستوى الإنجليزية', ok: true }); }
  else                                             { checks.push({ label: 'مستوى الإنجليزية', ok: false }); }

  return { score: Math.min(score, 100), checks };
}

/**
 * Full ATS score for a profile against a job.
 * @returns {{ overall, keyword, format, suggestions, matched, missing }}
 */
export function scoreProfileAgainstJob(profile, job) {
  const profileText = [
    profile.full_name,
    profile.job_title,
    profile.bio,
    (profile.skills || []).join(' '),
    profile.education_level,
  ].join(' ');

  const jobText = [
    job?.title,
    job?.description,
    (job?.requirements || []).join(' '),
    (job?.skills || []).join(' '),
  ].join(' ');

  const { score: kwScore, matched, missing } = computeKeywordMatch(profileText, jobText);
  const { score: fmtScore, checks } = computeFormatScore(profile);

  const overall = Math.round(kwScore * 0.6 + fmtScore * 0.4);

  const suggestions = [];
  if (fmtScore < 70) {
    const failing = checks.filter(c => !c.ok).map(c => c.label);
    suggestions.push(`أكمل معلومات الملف: ${failing.slice(0, 3).join('، ')}`);
  }
  if (missing.length) {
    suggestions.push(`أضف هذه الكلمات المفتاحية لملفك: ${missing.slice(0, 4).join('، ')}`);
  }
  if ((profile.skills || []).length < 5) {
    suggestions.push('أضف على الأقل ٥ مهارات تقنية لتحسين نقاط ATS');
  }

  return { overall, keyword: kwScore, format: fmtScore, suggestions, matched, missing, checks };
}

/**
 * Score a profile without a specific job — general ATS readiness.
 */
export function scoreProfileGeneral(profile) {
  const { score: fmtScore, checks } = computeFormatScore(profile);
  const profileText = [profile.bio, (profile.skills || []).join(' ')].join(' ');
  const genericText = GENERIC_POWER_KEYWORDS.join(' ');
  const { score: kwScore } = computeKeywordMatch(profileText, genericText);
  const overall = Math.round(kwScore * 0.4 + fmtScore * 0.6);
  const suggestions = checks.filter(c => !c.ok).map(c => `أضف ${c.label} لتحسين ملفك`);
  return { overall, keyword: kwScore, format: fmtScore, suggestions, checks };
}

/**
 * ATS level label
 */
export function atsLabel(score) {
  if (score >= 80) return { text: 'ممتاز للـ ATS', color: 'text-green-700 bg-green-100' };
  if (score >= 65) return { text: 'جيد جداً', color: 'text-blue-700 bg-blue-100' };
  if (score >= 50) return { text: 'مقبول', color: 'text-amber-700 bg-amber-100' };
  return { text: 'يحتاج تحسيناً', color: 'text-red-700 bg-red-100' };
}
