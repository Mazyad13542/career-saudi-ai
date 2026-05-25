import { BarChart, Bar, AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Briefcase, Star, Loader2 } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatCard from '../../components/ui/StatCard';
import { useHRApplications } from '../../hooks/useHRApplications';
import { useHRJobs } from '../../hooks/useHRJobs';

const MONTHS_AR = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
const ENG_COLORS = { A: '#006C35', B: '#1A56DB', C: '#F59E0B', D: '#EF4444' };
const PIE_COLORS = ['#006C35', '#1A56DB', '#C8A951', '#7C3AED', '#9CA3AF'];

function buildMonthlyData(applications) {
  const now = new Date();
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const y = d.getFullYear(), m = d.getMonth();
    const monthApps = applications.filter((a) => {
      const ad = new Date(a.applied_at);
      return ad.getFullYear() === y && ad.getMonth() === m;
    });
    return {
      month: MONTHS_AR[m].slice(0, 3),
      طلبات: monthApps.length,
      مقابلات: monthApps.filter((a) => ['Interview', 'Offer'].includes(a.status)).length,
    };
  });
}

function buildCityData(applications) {
  const counts = {};
  for (const a of applications) {
    const city = a.candidate?.city;
    if (city) counts[city] = (counts[city] ?? 0) + 1;
  }
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([city, count]) => ({ city, count }));
}

function buildEngData(applications) {
  const counts = { A: 0, B: 0, C: 0, D: 0 };
  for (const a of applications) {
    const raw = a.candidate?.english_level;
    if (!raw) continue;
    const l = String(raw)[0].toUpperCase();
    if (l in counts) counts[l]++;
  }
  return Object.entries(counts).map(([level, count]) => ({ level, count, color: ENG_COLORS[level] }));
}

function buildSectorData(jobs) {
  const counts = {};
  for (const j of jobs) {
    const s = j.sector ?? j.category ?? 'أخرى';
    counts[s] = (counts[s] ?? 0) + (j.applications_count ?? 0);
  }
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const total = entries.reduce((s, [, v]) => s + v, 0) || 1;
  return entries.map(([name, value], i) => ({ name, value: Math.round((value / total) * 100), color: PIE_COLORS[i] }));
}

export default function HRAnalytics() {
  const { applications, stats: appStats, loading: appsLoading } = useHRApplications();
  const { jobs, stats: jobStats, loading: jobsLoading }         = useHRJobs();
  const loading = appsLoading || jobsLoading;

  if (loading) {
    return (
      <DashboardLayout type="hr">
        <div className="flex items-center justify-center h-64">
          <Loader2 size={32} className="animate-spin text-[#006C35]" />
        </div>
      </DashboardLayout>
    );
  }

  const monthlyData = buildMonthlyData(applications);
  const cityData    = buildCityData(applications);
  const engData     = buildEngData(applications);
  const sectorData  = buildSectorData(jobs);
  const convRate    = appStats.total > 0 ? ((appStats.interview + appStats.offer) / appStats.total * 100).toFixed(1) : '0';
  const engTotal    = engData.reduce((s, e) => s + e.count, 0) || 1;

  return (
    <DashboardLayout type="hr">
      <div className="mb-6 text-right">
        <h1 className="text-2xl font-black text-gray-900">التحليلات</h1>
        <p className="text-gray-500 text-sm mt-0.5">رؤى مفصّلة عن حملتك التوظيفية</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={<Users size={20} />}    label="إجمالي الطلبات" value={appStats.total}        color="green" />
        <StatCard icon={<TrendingUp size={20} />} label="معدل التحويل"  value={`${convRate}٪`}        color="blue" />
        <StatCard icon={<Star size={20} />}     label="مقابلات"        value={appStats.interview}     color="gold" />
        <StatCard icon={<Briefcase size={20} />} label="وظائف نشطة"   value={jobStats.active}        color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Monthly trend */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="text-right mb-4">
            <h2 className="font-black text-gray-900">اتجاه الطلبات</h2>
            <p className="text-xs text-gray-400 mt-0.5">الطلبات الشهرية والمقابلات</p>
          </div>
          {appStats.total > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="appGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#006C35" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#006C35" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E5E7EB', direction: 'rtl' }} />
                <Area type="monotone" dataKey="طلبات"   stroke="#006C35" strokeWidth={2} fill="url(#appGrad)" />
                <Area type="monotone" dataKey="مقابلات" stroke="#C8A951" strokeWidth={2} fill="none" strokeDasharray="4 4" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-44 flex items-center justify-center text-gray-300 text-sm">لا توجد بيانات بعد</div>
          )}
        </div>

        {/* City distribution */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="text-right mb-4">
            <h2 className="font-black text-gray-900">المتقدمون حسب المدينة</h2>
            <p className="text-xs text-gray-400 mt-0.5">التوزيع الجغرافي</p>
          </div>
          {cityData.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={cityData} layout="vertical" barSize={12}>
                <XAxis type="number" tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <YAxis type="category" dataKey="city" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} width={70} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E5E7EB', direction: 'rtl' }} />
                <Bar dataKey="count" fill="#006C35" radius={[0, 4, 4, 0]} name="متقدمون" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-44 flex items-center justify-center text-gray-300 text-sm">لا توجد بيانات مدن</div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sector breakdown */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="text-right mb-4">
            <h2 className="font-black text-gray-900">الطلبات حسب القطاع</h2>
            <p className="text-xs text-gray-400 mt-0.5">توزيع الطلبات على وظائفك</p>
          </div>
          {sectorData.length > 0 ? (
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="50%" height={160}>
                <PieChart>
                  <Pie data={sectorData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value">
                    {sectorData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {sectorData.map((s) => (
                  <div key={s.name} className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
                    <span className="text-xs text-gray-600 flex-1 text-right truncate">{s.name}</span>
                    <span className="text-xs font-black text-gray-800">{s.value}٪</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-44 flex items-center justify-center text-gray-300 text-sm">لا توجد بيانات قطاعات</div>
          )}
        </div>

        {/* English level distribution */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="text-right mb-4">
            <h2 className="font-black text-gray-900">توزيع مستوى الإنجليزية</h2>
            <p className="text-xs text-gray-400 mt-0.5">مستويات اللغة لدى المتقدمين</p>
          </div>
          <div className="space-y-4">
            {engData.map((item) => (
              <div key={item.level} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-sm flex-shrink-0" style={{ backgroundColor: item.color }}>
                  {item.level}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between text-xs mb-1 flex-row-reverse">
                    <span className="text-gray-400">{item.count} متقدم</span>
                    <span className="text-gray-600 font-bold">المستوى {item.level}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div className="h-1.5 rounded-full transition-all duration-700" style={{ width: `${(item.count / engTotal) * 100}%`, backgroundColor: item.color }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
