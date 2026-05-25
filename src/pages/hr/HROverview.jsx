import { Users, Briefcase, Star, TrendingUp, ArrowUpRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatCard from '../../components/ui/StatCard';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useHRJobs } from '../../hooks/useHRJobs';
import { useHRApplications } from '../../hooks/useHRApplications';

const STATUS_AR = { Pending: 'بانتظار المراجعة', Reviewed: 'تمت المراجعة', Interview: 'مقابلة', Offer: 'عرض', Rejected: 'مرفوض' };
const STATUS_COLOR = { Pending: 'bg-amber-50 text-amber-600 border-amber-200', Reviewed: 'bg-blue-50 text-blue-600 border-blue-200', Interview: 'bg-purple-50 text-purple-600 border-purple-200', Offer: 'bg-green-50 text-green-600 border-green-200', Rejected: 'bg-red-50 text-red-600 border-red-200' };

function buildMonthlyChart(applications) {
  const MONTHS = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
  const now = new Date();
  const result = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const y = d.getFullYear(), m = d.getMonth();
    const monthApps = applications.filter((a) => {
      const ad = new Date(a.applied_at);
      return ad.getFullYear() === y && ad.getMonth() === m;
    });
    result.push({
      month: MONTHS[m].slice(0, 3),
      طلبات: monthApps.length,
      مقابلات: monthApps.filter((a) => a.status === 'Interview' || a.status === 'Offer').length,
    });
  }
  return result;
}

export default function HROverview() {
  const { profile } = useAuth();
  const { jobs, stats: jobStats, loading: jobsLoading } = useHRJobs();
  const { applications, stats: appStats, loading: appsLoading } = useHRApplications();

  const loading = jobsLoading || appsLoading;
  const chartData = buildMonthlyChart(applications);
  const recentApps = applications.slice(0, 5);

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
      <div className="flex items-start justify-between mb-8 flex-row-reverse">
        <Link to="/hr-dashboard/jobs">
          <Button variant="primary" size="sm">
            <Briefcase size={14} />
            نشر وظيفة جديدة
          </Button>
        </Link>
        <div className="text-right">
          <h1 className="text-2xl font-black text-gray-900">
            أهلاً، {profile?.full_name?.split(' ')[0] ?? 'مسؤول التوظيف'} 👔
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {profile?.job_title ?? 'مسؤول موارد بشرية'} · نظرة عامة على التوظيف
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={<Briefcase size={20} />} label="وظائف نشطة"      value={jobStats.active}    color="green" />
        <StatCard icon={<Users size={20} />}    label="إجمالي الطلبات"   value={appStats.total}     color="blue" />
        <StatCard icon={<Star size={20} />}     label="مقابلات"          value={appStats.interview} color="gold" />
        <StatCard icon={<TrendingUp size={20} />} label="عروض عمل"       value={appStats.offer}     color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left */}
        <div className="lg:col-span-2 space-y-6">
          {/* Chart */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 flex-row-reverse">
              <Badge variant="green" dot>نشط</Badge>
              <div className="text-right">
                <h2 className="font-black text-gray-900">الطلبات والمقابلات</h2>
                <p className="text-xs text-gray-400 mt-0.5">آخر ٦ أشهر</p>
              </div>
            </div>
            {applications.length > 0 ? (
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={chartData} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E5E7EB', direction: 'rtl' }} />
                  <Bar dataKey="طلبات"  fill="#006C35" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="مقابلات" fill="#C8A951" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-40 flex items-center justify-center text-gray-400 text-sm">
                لا توجد طلبات بعد
              </div>
            )}
          </div>

          {/* Active Jobs */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between p-6 pb-4 flex-row-reverse">
              <Link to="/hr-dashboard/jobs" className="text-xs text-[#006C35] font-bold flex items-center gap-1 hover:underline">
                <ArrowUpRight size={12} />
                إدارة الكل
              </Link>
              <h2 className="font-black text-gray-900">وظائفي النشطة</h2>
            </div>
            {jobs.filter((j) => j.is_active).length === 0 ? (
              <div className="px-6 pb-6 text-center text-gray-400 text-sm">
                لا توجد وظائف نشطة —{' '}
                <Link to="/hr-dashboard/jobs" className="text-[#006C35] font-bold hover:underline">انشر الآن</Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {jobs.filter((j) => j.is_active).slice(0, 4).map((job) => (
                  <div key={job.id} className="flex items-center gap-4 px-6 py-3 hover:bg-gray-50 transition-colors flex-row-reverse">
                    <div className="flex-1 text-right">
                      <p className="text-sm font-bold text-gray-900">{job.title}</p>
                      <p className="text-xs text-gray-400">{job.city ?? job.location ?? '—'} · {job.applications_count ?? 0} طلب</p>
                    </div>
                    <Badge variant="green" dot>نشط</Badge>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Applications */}
          {recentApps.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between p-6 pb-4 flex-row-reverse">
                <Link to="/hr-dashboard/candidates" className="text-xs text-[#006C35] font-bold flex items-center gap-1 hover:underline">
                  <ArrowUpRight size={12} />
                  عرض الكل
                </Link>
                <h2 className="font-black text-gray-900">أحدث الطلبات</h2>
              </div>
              <div className="divide-y divide-gray-50">
                {recentApps.map((app) => (
                  <div key={app.id} className="flex items-center gap-4 px-6 py-3 hover:bg-gray-50 transition-colors flex-row-reverse">
                    <div className="w-8 h-8 rounded-xl bg-[#006C35]/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-black text-[#006C35]">
                        {app.candidate?.full_name?.[0] ?? '؟'}
                      </span>
                    </div>
                    <div className="flex-1 text-right">
                      <p className="text-sm font-bold text-gray-900">{app.candidate?.full_name ?? 'مجهول'}</p>
                      <p className="text-xs text-gray-400">{app.job?.title ?? app.position}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${STATUS_COLOR[app.status] ?? 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                      {STATUS_AR[app.status] ?? app.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Quick Actions */}
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-black text-gray-900 mb-3 text-sm text-right">إجراءات سريعة</h3>
            <div className="space-y-2">
              {[
                { label: 'نشر وظيفة جديدة',   href: '/hr-dashboard/jobs',       icon: '📋' },
                { label: 'طلبات المتقدمين',    href: '/hr-dashboard/candidates', icon: '👥' },
                { label: 'الرسائل',            href: '/hr-dashboard/messages',   icon: '💬' },
                { label: 'التحليلات',          href: '/hr-dashboard/analytics',  icon: '📊' },
                { label: 'المرشحون المختارون', href: '/hr-dashboard/saved',      icon: '⭐' },
              ].map((action) => (
                <Link
                  key={action.label}
                  to={action.href}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#006C35]/5 transition-colors group flex-row-reverse"
                >
                  <span className="text-lg">{action.icon}</span>
                  <span className="flex-1 text-sm font-bold text-gray-700 group-hover:text-[#006C35] text-right">{action.label}</span>
                  <ArrowUpRight size={13} className="text-gray-300 group-hover:text-[#006C35]" />
                </Link>
              ))}
            </div>
          </div>

          {/* Summary card */}
          <div className="bg-gradient-to-bl from-[#006C35] to-[#004D25] rounded-2xl p-5 text-white text-right">
            <h3 className="font-black mb-3">ملخص الأداء</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm flex-row-reverse">
                <span className="text-green-200">إجمالي الوظائف</span>
                <span className="font-black">{jobStats.total}</span>
              </div>
              <div className="flex justify-between text-sm flex-row-reverse">
                <span className="text-green-200">إجمالي المشاهدات</span>
                <span className="font-black">{jobStats.totalViews.toLocaleString('ar-SA')}</span>
              </div>
              <div className="flex justify-between text-sm flex-row-reverse">
                <span className="text-green-200">معدل الاستجابة</span>
                <span className="font-black">
                  {appStats.total > 0
                    ? `${Math.round(((appStats.interview + appStats.offer) / appStats.total) * 100)}٪`
                    : '—'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
