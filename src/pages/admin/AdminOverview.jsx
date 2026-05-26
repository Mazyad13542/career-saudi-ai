import { Users, Briefcase, FileText, CreditCard, TrendingUp, Loader2, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatCard from '../../components/ui/StatCard';
import { useAdmin } from '../../hooks/useAdmin';

export default function AdminOverview() {
  const { stats, users, loading } = useAdmin();

  if (loading) {
    return (
      <DashboardLayout type="admin">
        <div className="flex items-center justify-center h-64">
          <Loader2 size={32} className="animate-spin text-[#006C35]" />
        </div>
      </DashboardLayout>
    );
  }

  // Recent users (last 5)
  const recentUsers = [...users].slice(0, 5);
  // Plan breakdown
  const proUsers  = users.filter((u) => u.plan === 'professional').length;
  const freeUsers = users.filter((u) => u.plan !== 'professional').length;
  const hrUsers   = users.filter((u) => u.role === 'hr').length;

  return (
    <DashboardLayout type="admin">
      <div className="mb-8 text-right">
        <h1 className="text-2xl font-black text-gray-900">لوحة الإدارة</h1>
        <p className="text-gray-500 text-sm mt-1">نظرة عامة على المنصة</p>
      </div>

      {/* Pending jobs alert — shown when aggregator imports jobs awaiting review */}
      {(stats?.pendingJobs ?? 0) > 0 && (
        <Link to="/admin/jobs" className="block mb-5">
          <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl hover:bg-amber-100 transition-colors" dir="rtl">
            <AlertTriangle size={18} className="text-amber-500 flex-shrink-0" />
            <div className="flex-1 text-right">
              <p className="text-sm font-black text-amber-800">
                {stats.pendingJobs} وظيفة تنتظر المراجعة
              </p>
              <p className="text-xs text-amber-600 mt-0.5">جلبها مجمّع الوظائف تلقائياً — راجعها وأقرّها للنشر</p>
            </div>
            <span className="text-xs font-black text-amber-700 bg-amber-200 px-3 py-1 rounded-full flex-shrink-0">مراجعة →</span>
          </div>
        </Link>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={<Users size={20} />}      label="إجمالي المستخدمين" value={stats?.totalUsers ?? 0}    color="green" />
        <StatCard icon={<Briefcase size={20} />}  label="إجمالي الوظائف"    value={stats?.totalJobs ?? 0}     color="blue" />
        <StatCard icon={<FileText size={20} />}   label="إجمالي الطلبات"    value={stats?.totalApps ?? 0}     color="gold" />
        <StatCard icon={<CreditCard size={20} />} label="إيرادات (ر.س)"     value={(stats?.revenue ?? 0).toLocaleString('ar-SA')} color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Plan breakdown */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-black text-gray-900 mb-5 text-right">توزيع الخطط</h2>
          <div className="space-y-4">
            {[
              { label: 'خطة مجانية',      value: freeUsers, color: 'bg-gray-200', textColor: 'text-gray-600', pct: stats?.totalUsers ? Math.round((freeUsers / stats.totalUsers) * 100) : 0 },
              { label: 'خطة احترافية',    value: proUsers,  color: 'bg-[#006C35]', textColor: 'text-[#006C35]', pct: stats?.totalUsers ? Math.round((proUsers / stats.totalUsers) * 100) : 0 },
              { label: 'مسؤولو التوظيف', value: hrUsers,   color: 'bg-blue-500', textColor: 'text-blue-600', pct: stats?.totalUsers ? Math.round((hrUsers / stats.totalUsers) * 100) : 0 },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-xs mb-1.5 flex-row-reverse">
                  <span className="text-gray-400">{item.value} مستخدم</span>
                  <span className={`font-bold ${item.textColor}`}>{item.label}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className={`h-2 rounded-full transition-all duration-700 ${item.color}`} style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Platform health */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-black text-gray-900 mb-5 text-right">صحة المنصة</h2>
          <div className="space-y-3">
            {[
              { label: 'وظائف نشطة',        value: stats?.activeJobs ?? 0,      icon: '✅', highlight: false },
              { label: 'تنتظر المراجعة',     value: stats?.pendingJobs ?? 0,     icon: '⏳', highlight: (stats?.pendingJobs ?? 0) > 0 },
              { label: 'اشتراكات مكتملة',   value: stats?.totalPayments ?? 0,   icon: '💳', highlight: false },
              { label: 'مستخدمو HR',         value: hrUsers,                     icon: '👔', highlight: false },
            ].map((item) => (
              <div key={item.label} className={`flex items-center gap-3 p-3 rounded-xl flex-row-reverse ${item.highlight ? 'bg-amber-50' : 'bg-gray-50'}`}>
                <span className="text-lg">{item.icon}</span>
                <span className="flex-1 text-sm font-bold text-gray-700 text-right">{item.label}</span>
                <span className={`font-black ${item.highlight ? 'text-amber-600' : 'text-[#006C35]'}`}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent users */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-black text-gray-900 mb-4 text-right">أحدث المستخدمين</h2>
          {recentUsers.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-8">لا يوجد مستخدمون</p>
          ) : (
            <div className="space-y-3">
              {recentUsers.map((u) => (
                <div key={u.id} className="flex items-center gap-3 flex-row-reverse">
                  <div className="w-8 h-8 rounded-xl bg-[#006C35]/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-black text-[#006C35]">{u.full_name?.[0] ?? '؟'}</span>
                  </div>
                  <div className="flex-1 text-right min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">{u.full_name ?? 'مجهول'}</p>
                    <p className="text-[10px] text-gray-400">{u.role === 'hr' ? 'HR' : u.plan === 'professional' ? 'احترافي' : 'مجاني'}</p>
                  </div>
                  <span className="text-[10px] text-gray-400 flex-shrink-0">
                    {new Date(u.created_at).toLocaleDateString('ar-SA')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
