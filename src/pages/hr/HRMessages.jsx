import { useState } from 'react';
import { MessageSquare, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useHRApplications } from '../../hooks/useHRApplications';

const STATUS_AR    = { Pending: 'بانتظار المراجعة', Reviewed: 'تمت المراجعة', Interview: 'دعوة مقابلة', Offer: 'عرض عمل', Rejected: 'مرفوض' };
const STATUS_COLOR = { Pending: 'text-amber-600', Reviewed: 'text-blue-600', Interview: 'text-purple-600', Offer: 'text-green-600', Rejected: 'text-red-500' };

function generateMessage(app) {
  const name    = app.candidate?.full_name ?? 'المتقدم';
  const jobTitle = app.job?.title ?? app.position ?? 'الوظيفة';
  const msgs = {
    Pending:  `شكراً على تقدّمك لوظيفة "${jobTitle}". سنراجع طلبك وسنتواصل معك قريباً.`,
    Reviewed: `تمت مراجعة طلبك لوظيفة "${jobTitle}". ملفك المهني جيد وسنكمل عملية التقييم.`,
    Interview: `يسعدنا دعوتك لإجراء مقابلة لوظيفة "${jobTitle}". يرجى التواصل لتحديد الموعد المناسب.`,
    Offer:    `نحن سعداء بتقديم عرض عمل لك لشغل وظيفة "${jobTitle}". سيتم إرسال التفاصيل قريباً.`,
    Rejected: `نشكرك على اهتمامك بوظيفة "${jobTitle}". مع الأسف لن نتمكن من المضي في طلبك حالياً.`,
  };
  return msgs[app.status] ?? `تحديث بخصوص طلبك لوظيفة "${jobTitle}".`;
}

export default function HRMessages() {
  const { applications, loading } = useHRApplications();
  const [selected, setSelected]   = useState(null);

  const conversations = applications.filter((a) => a.candidate);

  if (loading) {
    return (
      <DashboardLayout type="hr">
        <div className="flex items-center justify-center h-64">
          <Loader2 size={32} className="animate-spin text-[#006C35]" />
        </div>
      </DashboardLayout>
    );
  }

  const active = selected ?? conversations[0] ?? null;

  return (
    <DashboardLayout type="hr">
      <div className="mb-6 text-right">
        <h1 className="text-2xl font-black text-gray-900">الرسائل</h1>
        <p className="text-gray-500 text-sm mt-0.5">متابعة المتقدمين وتحديث حالة طلباتهم</p>
      </div>

      {conversations.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <MessageSquare size={40} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 font-bold">لا توجد محادثات بعد</p>
          <p className="text-xs text-gray-400 mt-1 mb-4">ستظهر هنا المراسلات مع المتقدمين لوظائفك</p>
          <Link to="/hr-dashboard/jobs" className="text-sm text-[#006C35] font-black hover:underline">
            انشر وظيفتك الأولى
          </Link>
        </div>
      ) : (
        <div className="flex gap-5 h-[calc(100vh-220px)]" dir="rtl">
          {/* Conversations list */}
          <div className="w-72 flex-shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
            <div className="px-4 py-3 border-b border-gray-50">
              <p className="text-sm font-black text-gray-900">المتقدمون</p>
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
              {conversations.map((app) => {
                const c = app.candidate;
                const isActive = active?.id === app.id;
                return (
                  <button
                    key={app.id}
                    onClick={() => setSelected(app)}
                    className={`w-full text-right p-4 hover:bg-gray-50 transition-colors ${isActive ? 'bg-[#006C35]/5' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#006C35]/10 flex items-center justify-center flex-shrink-0">
                        {c?.avatar_url ? (
                          <img src={c.avatar_url} alt="" className="w-full h-full object-cover rounded-xl" />
                        ) : (
                          <span className="text-sm font-black text-[#006C35]">{c?.full_name?.[0] ?? '؟'}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-bold ${STATUS_COLOR[app.status] ?? 'text-gray-400'}`}>
                            {STATUS_AR[app.status]}
                          </span>
                          <p className="text-sm font-black text-gray-900 truncate">{c?.full_name ?? 'مجهول'}</p>
                        </div>
                        <p className="text-xs text-gray-400 truncate mt-0.5 text-right">
                          {app.job?.title ?? app.position ?? '—'}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chat panel */}
          {active && (
            <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
              {/* Header */}
              <div className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-50 flex-row-reverse">
                <div className="w-9 h-9 rounded-xl bg-[#006C35]/10 flex items-center justify-center flex-shrink-0">
                  {active.candidate?.avatar_url ? (
                    <img src={active.candidate.avatar_url} alt="" className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <span className="text-sm font-black text-[#006C35]">{active.candidate?.full_name?.[0] ?? '؟'}</span>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-gray-900">{active.candidate?.full_name ?? 'مجهول'}</p>
                  <p className="text-xs text-gray-400">{active.job?.title ?? active.position}</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 p-5 overflow-y-auto space-y-4">
                {/* System message: application received */}
                <div className="flex justify-center">
                  <span className="text-[10px] text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
                    تقدّم بطلب في {new Date(active.applied_at).toLocaleDateString('ar-SA')}
                  </span>
                </div>

                {/* HR automated message based on status */}
                <div className="flex justify-start">
                  <div className="max-w-sm px-4 py-3 rounded-2xl text-sm leading-relaxed bg-[#006C35] text-white rounded-bl-sm">
                    <p>{generateMessage(active)}</p>
                    <p className="text-[10px] mt-1.5 text-green-200">
                      {new Date(active.updated_at ?? active.applied_at).toLocaleDateString('ar-SA')}
                    </p>
                  </div>
                </div>

                {/* Notes if any */}
                {active.notes && (
                  <div className="flex justify-end">
                    <div className="max-w-sm px-4 py-3 rounded-2xl text-sm leading-relaxed bg-gray-100 text-gray-800 rounded-br-sm">
                      <p>{active.notes}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Status info footer */}
              <div className="px-5 py-3.5 border-t border-gray-50 flex items-center justify-between" dir="rtl">
                <span className="text-xs text-gray-400">لتحديث الحالة، انتقل إلى صفحة المتقدمين</span>
                <Link
                  to="/hr-dashboard/candidates"
                  className="text-xs font-black text-[#006C35] hover:underline"
                >
                  إدارة الطلب
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}
