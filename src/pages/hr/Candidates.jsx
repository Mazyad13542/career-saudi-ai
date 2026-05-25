import { useState } from 'react';
import { Search, MapPin, Loader2, ChevronDown } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { useHRApplications } from '../../hooks/useHRApplications';

const STATUS_AR   = { Pending: 'بانتظار المراجعة', Reviewed: 'تمت المراجعة', Interview: 'مقابلة', Offer: 'عرض', Rejected: 'مرفوض' };
const STATUS_OPTS = ['الكل', 'Pending', 'Reviewed', 'Interview', 'Offer', 'Rejected'];
const ENG_LABEL   = { A: 'احترافي', B: 'جيد', C: 'متوسط', D: 'مبتدئ' };
const ENG_COLOR   = { A: 'bg-green-50 text-green-700 border-green-200', B: 'bg-blue-50 text-blue-700 border-blue-200', C: 'bg-amber-50 text-amber-700 border-amber-200', D: 'bg-red-50 text-red-700 border-red-200' };

function parseLetter(raw) {
  if (!raw) return 'B';
  const l = String(raw)[0].toUpperCase();
  return ['A', 'B', 'C', 'D'].includes(l) ? l : 'B';
}

export default function Candidates() {
  const { applications, stats, loading, updateStatus } = useHRApplications();

  const [search, setSearch]       = useState('');
  const [statusFilter, setStatus] = useState('الكل');
  const [jobFilter, setJobFilter] = useState('الكل');
  const [updating, setUpdating]   = useState(null);

  const jobs = ['الكل', ...new Set(applications.map((a) => a.job?.title).filter(Boolean))];

  const filtered = applications.filter((a) => {
    const name = a.candidate?.full_name?.toLowerCase() ?? '';
    const title = (a.candidate?.job_title ?? '').toLowerCase();
    const q = search.toLowerCase();
    const matchQ = !q || name.includes(q) || title.includes(q);
    const matchS = statusFilter === 'الكل' || a.status === statusFilter;
    const matchJ = jobFilter === 'الكل' || a.job?.title === jobFilter;
    return matchQ && matchS && matchJ;
  });

  async function handleStatusChange(appId, newStatus) {
    setUpdating(appId);
    try { await updateStatus(appId, newStatus); } catch { /* ignore */ }
    setUpdating(null);
  }

  if (loading) {
    return (
      <DashboardLayout type="hr">
        <div className="flex items-center justify-center h-64">
          <Loader2 size={32} className="animate-spin text-[#006C35]" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout type="hr">
      {/* Header */}
      <div className="mb-6 text-right">
        <h1 className="text-2xl font-black text-gray-900">المتقدمون</h1>
        <p className="text-gray-500 text-sm mt-0.5">جميع الطلبات الواردة على وظائفك</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-5 gap-3 mb-6">
        {[
          { label: 'إجمالي', value: stats.total,     color: 'text-gray-900' },
          { label: 'انتظار', value: stats.pending,   color: 'text-amber-600' },
          { label: 'مراجعة', value: stats.reviewed,  color: 'text-blue-600' },
          { label: 'مقابلة', value: stats.interview, color: 'text-purple-600' },
          { label: 'عرض',    value: stats.offer,     color: 'text-green-600' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 text-center">
            <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-5" dir="rtl">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث بالاسم أو المسمى الوظيفي..."
              className="w-full pr-9 pl-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006C35]/20 focus:border-[#006C35]"
            />
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatus(e.target.value)}
                className="appearance-none pl-7 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006C35]/20 focus:border-[#006C35]"
              >
                {STATUS_OPTS.map((s) => <option key={s} value={s}>{s === 'الكل' ? 'كل الحالات' : STATUS_AR[s]}</option>)}
              </select>
              <ChevronDown size={13} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            <div className="relative">
              <select
                value={jobFilter}
                onChange={(e) => setJobFilter(e.target.value)}
                className="appearance-none pl-7 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006C35]/20 focus:border-[#006C35]"
              >
                {jobs.map((j) => <option key={j} value={j}>{j === 'الكل' ? 'كل الوظائف' : j}</option>)}
              </select>
              <ChevronDown size={13} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <p className="text-gray-500 font-bold">لا يوجد متقدمون</p>
          <p className="text-xs text-gray-400 mt-1">
            {applications.length === 0
              ? 'انشر وظائفك لبدء استقبال الطلبات'
              : 'لا توجد نتائج لهذا البحث'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((app) => {
            const c   = app.candidate;
            const eng = parseLetter(c?.english_level);
            return (
              <div key={app.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden" dir="rtl">
                <div className="p-5">
                  {/* Avatar + name */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-[#006C35]/10 flex items-center justify-center flex-shrink-0">
                        {c?.avatar_url ? (
                          <img src={c.avatar_url} alt="" className="w-full h-full object-cover rounded-2xl" />
                        ) : (
                          <span className="text-lg font-black text-[#006C35]">{c?.full_name?.[0] ?? '؟'}</span>
                        )}
                      </div>
                      <div>
                        <h3 className="font-black text-gray-900 text-sm">{c?.full_name ?? 'مجهول'}</h3>
                        <p className="text-xs text-gray-500">{c?.job_title ?? '—'}</p>
                        {c?.city && (
                          <div className="flex items-center gap-1 mt-0.5">
                            <MapPin size={10} className="text-gray-400" />
                            <span className="text-[10px] text-gray-400">{c.city}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className={`px-2 py-0.5 text-[10px] font-bold rounded-lg border ${ENG_COLOR[eng]}`}>
                      {eng} — {ENG_LABEL[eng]}
                    </div>
                  </div>

                  {/* Job */}
                  <p className="text-xs text-[#006C35] font-bold mb-3">
                    طلب: {app.job?.title ?? app.position ?? '—'}
                  </p>

                  {/* Scores */}
                  {c?.career_score != null && (
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="text-center p-2 bg-gray-50 rounded-xl">
                        <p className="text-base font-black text-[#006C35]">{c.career_score}</p>
                        <p className="text-[9px] text-gray-400">نقاط المهنة</p>
                      </div>
                      <div className="text-center p-2 bg-gray-50 rounded-xl">
                        <p className="text-base font-black text-blue-600">{c?.profile_data?.atsScore ?? '—'}</p>
                        <p className="text-[9px] text-gray-400">ATS</p>
                      </div>
                    </div>
                  )}

                  {/* Skills */}
                  {(c?.profile_data?.skills ?? []).length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {(c.profile_data.skills).slice(0, 3).map((skill) => (
                        <span key={skill} className="px-2 py-0.5 bg-gray-50 border border-gray-100 text-[10px] text-gray-500 rounded-full">{skill}</span>
                      ))}
                    </div>
                  )}

                  {/* Status selector */}
                  <div className="relative">
                    <select
                      value={app.status}
                      onChange={(e) => handleStatusChange(app.id, e.target.value)}
                      disabled={updating === app.id}
                      className="w-full appearance-none border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#006C35]/20 focus:border-[#006C35] disabled:opacity-50"
                    >
                      {Object.entries(STATUS_AR).map(([v, l]) => (
                        <option key={v} value={v}>{l}</option>
                      ))}
                    </select>
                    {updating === app.id && (
                      <Loader2 size={12} className="absolute left-2 top-1/2 -translate-y-1/2 animate-spin text-[#006C35]" />
                    )}
                  </div>
                </div>

                {/* Applied date */}
                <div className="px-5 py-2.5 border-t border-gray-50 flex justify-end">
                  <span className="text-[10px] text-gray-400">
                    تقدّم: {new Date(app.applied_at).toLocaleDateString('ar-SA')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}
