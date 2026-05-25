import { BookmarkCheck, Loader2, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Badge from '../../components/ui/Badge';
import { useHRApplications } from '../../hooks/useHRApplications';

const ENG_COLOR = { A: 'bg-green-50 text-green-700 border-green-200', B: 'bg-blue-50 text-blue-700 border-blue-200', C: 'bg-amber-50 text-amber-700 border-amber-200', D: 'bg-red-50 text-red-700 border-red-200' };

function parseLetter(raw) {
  if (!raw) return 'B';
  const l = String(raw)[0].toUpperCase();
  return ['A', 'B', 'C', 'D'].includes(l) ? l : 'B';
}

export default function SavedCandidates() {
  const { applications, loading } = useHRApplications();

  if (loading) {
    return (
      <DashboardLayout type="hr">
        <div className="flex items-center justify-center h-64">
          <Loader2 size={32} className="animate-spin text-[#006C35]" />
        </div>
      </DashboardLayout>
    );
  }

  // Shortlisted = applications with Interview or Offer status
  const shortlisted = applications.filter((a) => ['Interview', 'Offer'].includes(a.status) && a.candidate);

  return (
    <DashboardLayout type="hr">
      <div className="mb-6 text-right">
        <h1 className="text-2xl font-black text-gray-900">المرشحون المختارون</h1>
        <p className="text-gray-500 text-sm mt-0.5">المتقدمون الذين وصلوا لمرحلة المقابلة أو العرض</p>
      </div>

      {shortlisted.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <BookmarkCheck size={40} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 font-black">لا يوجد مرشحون مختارون بعد</p>
          <p className="text-xs text-gray-400 mt-1 mb-4">
            راجع طلبات المتقدمين وحدّث حالتهم إلى "مقابلة" أو "عرض"
          </p>
          <Link to="/hr-dashboard/candidates" className="text-sm text-[#006C35] font-black hover:underline">
            مراجعة المتقدمين
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden" dir="rtl">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-right px-6 py-3 text-xs font-bold text-gray-500">المرشح</th>
                <th className="text-right px-6 py-3 text-xs font-bold text-gray-500">نقاط المهنة</th>
                <th className="text-right px-6 py-3 text-xs font-bold text-gray-500">الإنجليزية</th>
                <th className="text-right px-6 py-3 text-xs font-bold text-gray-500">الوظيفة المتقدم إليها</th>
                <th className="text-right px-6 py-3 text-xs font-bold text-gray-500">المرحلة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {shortlisted.map((app) => {
                const c   = app.candidate;
                const eng = parseLetter(c?.english_level);
                return (
                  <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#006C35]/10 flex items-center justify-center flex-shrink-0">
                          {c?.avatar_url ? (
                            <img src={c.avatar_url} alt="" className="w-full h-full object-cover rounded-xl" />
                          ) : (
                            <span className="text-sm font-black text-[#006C35]">{c?.full_name?.[0] ?? '؟'}</span>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-black text-gray-900">{c?.full_name ?? 'مجهول'}</p>
                          <div className="flex items-center gap-1 mt-0.5">
                            {c?.city && <><MapPin size={9} className="text-gray-400" /><span className="text-[10px] text-gray-400">{c.city}</span></>}
                            {c?.job_title && <span className="text-[10px] text-gray-400">{c.city ? ' · ' : ''}{c.job_title}</span>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-black text-[#006C35]">{c?.career_score ?? '—'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 text-xs font-black rounded-lg border ${ENG_COLOR[eng]}`}>{eng}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-700">{app.job?.title ?? app.position ?? '—'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={app.status === 'Offer' ? 'green' : 'purple'} dot>
                        {app.status === 'Offer' ? 'عرض عمل' : 'مقابلة'}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
}
