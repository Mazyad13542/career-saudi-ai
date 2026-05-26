import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin, AlertCircle, Lock, ExternalLink,
  Bookmark, BookmarkCheck,
  Loader2, Wifi, RefreshCw,
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import { useJobs, useSavedJobs } from '../../hooks/useJobs';
import { useAuth } from '../../context/AuthContext';
import { useApplications } from '../../hooks/useApplications';
import { track, EVENTS } from '../../lib/analytics';
import { matchJobToProfile, matchLabel } from '../../lib/jobMatcher';

function buildReasons(job, profile) {
  const { reasons } = matchJobToProfile(profile, job);
  return reasons
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(r => `${r.label}: ${r.score}٪`);
}

function buildGaps(job, profile) {
  const profileSkills = (profile?.skills ?? []).map(s => s.toLowerCase());
  return (job.skills ?? [])
    .filter(s => !profileSkills.some(u => u.includes(s.toLowerCase()) || s.toLowerCase().includes(u)))
    .slice(0, 3);
}

function MatchBadge({ score }) {
  const bg = score >= 90 ? 'bg-green-500' : score >= 80 ? 'bg-blue-500' : score >= 70 ? 'bg-amber-500' : 'bg-gray-400';
  return (
    <div className={`${bg} text-white px-3 py-2 rounded-xl text-center flex-shrink-0 w-16`}>
      <p className="text-lg font-black leading-none">{score}٪</p>
      <p className="text-[9px] opacity-80 mt-0.5">تطابق</p>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function JobsForYou() {
  const { jobs, loading, refetch } = useJobs();
  const { savedIds, toggle: toggleSave } = useSavedJobs();
  const { addApplication }               = useApplications();
  const { profile, isPremium }           = useAuth();
  const [applied,   setApplied]          = useState({});
  const [expanded,  setExpanded]         = useState({});
  const [minScore,  setMinScore]         = useState(70);

  const premium = isPremium();

  const rankedJobs = useMemo(() => {
    if (!jobs.length) return [];
    return [...jobs]
      .map(j => ({ ...j, _score: matchJobToProfile(profile, j).score }))
      .sort((a, b) => b._score - a._score);
  }, [jobs, profile]);

  const filtered  = rankedJobs.filter(j => j._score >= minScore);
  const displayed = premium ? filtered : filtered.slice(0, 3);
  const locked    = !premium && filtered.length > 3;

  const totalAnalyzed = jobs.length;
  const matches       = filtered.length;
  const avgScore      = rankedJobs.length
    ? Math.round(rankedJobs.reduce((s, j) => s + j._score, 0) / rankedJobs.length)
    : 0;

  const hasProfileData = !!(profile?.skills?.length || profile?.city || profile?.job_title);

  const handleApply = async (job) => {
    if (applied[job.id]) return;
    setApplied((a) => ({ ...a, [job.id]: true }));
    if (job.source_url) window.open(job.source_url, '_blank', 'noopener,noreferrer');
    await addApplication({ job_id: job.id, company: job.company, position: job.title, logo: job.company_logo, status: 'Pending' });
    track(EVENTS.JOB_APPLIED, { jobId: job.id, company: job.company, source: 'jobs-for-you' });
  };

  return (
    <DashboardLayout>
      <div className="mb-6 text-right">
        <div className="flex items-center gap-2 justify-end">
          <h1 className="text-2xl font-black text-gray-900">الوظائف المناسبة لك</h1>
        </div>
        <p className="text-gray-500 text-sm mt-0.5">مرتبة حسب مدى توافق ملفك المهني مع كل وظيفة</p>
      </div>

      {/* Profile completeness nudge */}
      {!hasProfileData && !loading && (
        <div className="mb-5 p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-3 flex-row-reverse">
          <AlertCircle size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="text-right">
            <p className="text-sm font-black text-amber-800 mb-1">أكمل ملفك المهني لتحسين التطابق</p>
            <p className="text-xs text-amber-600">أضف مهاراتك ومدينتك ومسماك الوظيفي لتحصل على توصيات أدق.</p>
            <Link to="/dashboard/profile" className="text-xs font-black text-[#006C35] hover:underline mt-1 block">
              أكمل ملفك الآن ←
            </Link>
          </div>
        </div>
      )}

      {/* Insight Stats */}
      <div className="mb-5 grid grid-cols-3 gap-4">
        {[
          { label: 'وظائف تم تحليلها', value: totalAnalyzed.toLocaleString('ar-SA'), icon: '🔍', color: 'bg-blue-50 border-blue-100' },
          { label: 'تطابقات وُجدت',     value: matches.toLocaleString('ar-SA'),       icon: '🎯', color: 'bg-green-50 border-green-100' },
          { label: 'متوسط التطابق',      value: `${avgScore}٪`,                       icon: '⭐', color: 'bg-amber-50 border-amber-100' },
        ].map((s) => (
          <div key={s.label} className={`p-4 rounded-2xl border ${s.color} flex items-center gap-3 flex-row-reverse`}>
            <div className="text-right">
              <p className="text-xl font-black text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
            <span className="text-2xl">{s.icon}</span>
          </div>
        ))}
      </div>

      {/* Score threshold control */}
      {!loading && rankedJobs.length > 0 && (
        <div className="mb-5 flex items-center gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex-row-reverse">
          <div className="flex items-center gap-2">
            <button onClick={() => refetch()} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
              <RefreshCw size={14} />
            </button>
          </div>
          <div className="flex-1 text-right">
            <p className="text-xs font-bold text-gray-600 mb-1.5">عرض وظائف بنسبة تطابق ≥ {minScore}٪</p>
            <input
              type="range" min={50} max={90} step={5}
              value={minScore}
              onChange={(e) => setMinScore(Number(e.target.value))}
              className="w-full accent-[#006C35] h-1.5"
              dir="ltr"
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
              <span>90٪</span>
              <span>50٪</span>
            </div>
          </div>
          <p className="text-sm font-black text-[#006C35] flex-shrink-0">{filtered.length} وظيفة</p>
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 h-48 animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <span className="text-4xl mb-3 block">🎯</span>
          <p className="text-gray-500 font-black">لا توجد وظائف بنسبة {minScore}٪ أو أعلى</p>
          <p className="text-xs text-gray-400 mt-1 mb-4">خفّض حد التطابق أو أكمل ملفك المهني</p>
          <Button variant="secondary" size="sm" onClick={() => setMinScore(50)}>عرض كل الوظائف</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {displayed.map((job) => {
            const isLocked  = !premium && filtered.indexOf(job) >= 3;
            const isSaved   = savedIds.has(job.id);
            const isApplied = applied[job.id];
            const score     = job._score;
            const reasons   = buildReasons(job, profile);
            const gaps      = buildGaps(job, profile);
            const salary    = job.salary_min && job.salary_max
              ? `${job.salary_min.toLocaleString('ar-SA')} – ${job.salary_max.toLocaleString('ar-SA')} ر.س`
              : null;

            return (
              <div
                key={job.id}
                className={`relative bg-white rounded-2xl border shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md ${score >= 90 ? 'border-[#006C35]/30' : 'border-gray-100'}`}
              >
                {score >= 90 && <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#006C35] to-[#00A651]" />}

                {isLocked && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-[3px] z-20 flex flex-col items-center justify-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center">
                      <Lock size={20} className="text-gray-400" />
                    </div>
                    <p className="text-sm font-black text-gray-700">ترقَّ لرؤية هذه الفرصة</p>
                    <Link to="/#pricing">
                      <Button variant="primary" size="sm">ترقَّ الآن — ٩٩ ريال/شهر</Button>
                    </Link>
                  </div>
                )}

                <div className="p-5">
                  <div className="flex items-start gap-4">
                    <MatchBadge score={score} />

                    <div className="flex-1 min-w-0 text-right">
                      {/* Header row */}
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex gap-2 flex-shrink-0">
                          <button
                            onClick={() => toggleSave(job.id)}
                            className={`p-2 rounded-xl border transition-all ${isSaved ? 'bg-[#006C35]/10 border-[#006C35]/20 text-[#006C35]' : 'bg-gray-50 border-gray-200 text-gray-400 hover:text-[#006C35]'}`}
                          >
                            {isSaved ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
                          </button>
                          {isApplied ? (
                            <span className="px-3 py-1.5 bg-green-50 border border-green-200 text-green-700 text-xs font-black rounded-xl">✓ تم التقديم</span>
                          ) : (
                            <Button variant="primary" size="sm" onClick={() => handleApply(job)}>
                              {job.source_url && <ExternalLink size={11} />}
                              تقدّم الآن
                            </Button>
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-1.5 justify-end flex-wrap mb-0.5">
                            {job.fresh_graduate && <span className="text-[10px] font-bold text-green-600 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded-full flex items-center gap-0.5"><GraduationCap size={9} />لحديثي التخرج</span>}
                            {job.is_remote      && <span className="text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded-full flex items-center gap-0.5"><Wifi size={9} />عن بُعد</span>}
                            <h3 className="font-black text-gray-900 text-base leading-tight">{job.title}</h3>
                          </div>
                          <p className="text-sm text-[#006C35] font-bold">{job.company}</p>
                          <div className="flex items-center gap-3 mt-1 text-xs text-gray-400 justify-end flex-wrap">
                            {salary && <span>💰 {salary}</span>}
                            <span>{job.job_type}</span>
                            {job.experience_level && <span>{job.experience_level}</span>}
                            <span className="flex items-center gap-1"><MapPin size={11} />{[job.city, job.region].filter(Boolean).join(' · ')}</span>
                          </div>
                        </div>
                      </div>

                      {/* Why match */}
                      <div className="mt-3 p-3 bg-green-50 border border-green-100 rounded-xl">
                        <p className="text-xs font-black text-green-800 mb-1.5 flex items-center gap-1 justify-end">
                          <span>أنت مناسب لأن</span><CheckCircle size={11} />
                        </p>
                        <ul className="space-y-1">
                          {reasons.map((r, i) => (
                            <li key={i} className="text-xs text-green-700 flex items-start gap-1.5 flex-row-reverse">
                              <CheckCircle size={10} className="mt-0.5 flex-shrink-0 text-green-500" />{r}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Skill gaps */}
                      {gaps.length > 0 && (
                        <div className="mt-2 p-3 bg-amber-50 border border-amber-100 rounded-xl">
                          <p className="text-xs font-black text-amber-800 mb-1.5 flex items-center gap-1 justify-end">
                            <span>مهارات مقترحة للتطوير</span><AlertCircle size={11} />
                          </p>
                          <div className="flex flex-wrap gap-1.5 justify-end">
                            {gaps.map((g) => (
                              <span key={g} className="text-[10px] font-bold text-amber-700 bg-white border border-amber-200 px-2 py-0.5 rounded-full">{g}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Skills section (expandable) */}
                      {job.skills?.length > 0 && (
                        <>
                          <button
                            onClick={() => setExpanded((e) => ({ ...e, [job.id]: !e[job.id] }))}
                            className="mt-2 text-xs text-blue-600 font-bold hover:underline flex items-center gap-1 mr-auto"
                          >
                            <BookOpen size={11} />
                            {expanded[job.id] ? 'إخفاء المهارات' : `عرض ${job.skills.length} مهارة مطلوبة`}
                            <ChevronDown size={11} className={`transition-transform ${expanded[job.id] ? 'rotate-180' : ''}`} />
                          </button>
                          {expanded[job.id] && (
                            <div className="mt-2 flex flex-wrap gap-1.5 justify-end">
                              {job.skills.map((s) => {
                                const userSkills = (profile?.profile_data?.skills ?? []).map((u) => u.toLowerCase());
                                const matched = userSkills.some((u) => u.includes(s.toLowerCase()) || s.toLowerCase().includes(u));
                                return (
                                  <span
                                    key={s}
                                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${matched ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-500 border-gray-200'}`}
                                  >
                                    {matched && <Award size={9} />}{s}
                                  </span>
                                );
                              })}
                            </div>
                          )}
                        </>
                      )}

                      <div className="flex gap-3 mt-3 justify-end">
                        <Link to="/dashboard/profile" className="text-xs text-[#006C35] font-bold hover:underline flex items-center gap-1">
                          <TrendingUp size={11} />
                          حسّن ملفك لهذه الوظيفة
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Premium upsell */}
      {locked && (
        <div className="mt-8 p-6 bg-gradient-to-l from-[#006C35] to-[#00A651] rounded-2xl text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 saudi-geo-pattern opacity-[0.04] pointer-events-none" />
          <div className="relative">
            <p className="text-3xl mb-3">🎯</p>
            <h3 className="font-black text-lg mb-2">اعرض كل {filtered.length} وظيفة متطابقة</h3>
            <p className="text-green-200 text-sm mb-4">افتح القائمة الكاملة مع التحليل المفصّل لكل وظيفة</p>
            <div className="flex justify-center gap-4 text-sm mb-4 flex-wrap">
              <span className="text-green-200">✓ تحليل مهارات كامل</span>
              <span className="text-green-200">✓ فجوات للتطوير</span>
              <span className="text-green-200">✓ تقديم مباشر</span>
            </div>
            <Link to="/#pricing">
              <Button variant="gold" size="md">ترقَّ إلى الخطة الاحترافية — ٩٩ ريال/شهر</Button>
            </Link>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
