import { useState } from 'react';
import { Search, ChevronDown, Loader2, Check } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Badge from '../../components/ui/Badge';
import { useAdmin } from '../../hooks/useAdmin';

const ROLE_AR  = { candidate: 'باحث عن عمل', hr: 'مسؤول توظيف', admin: 'مدير' };
const PLAN_AR  = { free: 'مجاني', professional: 'احترافي' };
const ROLES    = ['candidate', 'hr', 'admin'];

export default function AdminUsers() {
  const { users, loading, setUserRole } = useAdmin();
  const [search, setSearch]             = useState('');
  const [roleFilter, setRoleFilter]     = useState('الكل');
  const [updating, setUpdating]         = useState(null);

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const matchQ = !q || (u.full_name ?? '').toLowerCase().includes(q) || (u.email ?? '').toLowerCase().includes(q);
    const matchR = roleFilter === 'الكل' || u.role === roleFilter;
    return matchQ && matchR;
  });

  async function handleRoleChange(userId, role) {
    setUpdating(userId);
    try { await setUserRole(userId, role); } catch { /* ignore */ }
    setUpdating(null);
  }

  if (loading) {
    return (
      <DashboardLayout type="admin">
        <div className="flex items-center justify-center h-64">
          <Loader2 size={32} className="animate-spin text-[#006C35]" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout type="admin">
      <div className="mb-6 text-right">
        <h1 className="text-2xl font-black text-gray-900">المستخدمون</h1>
        <p className="text-gray-500 text-sm mt-0.5">إدارة حسابات المستخدمين وأدوارهم</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-5" dir="rtl">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث بالاسم أو البريد..."
              className="w-full pr-9 pl-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006C35]/20 focus:border-[#006C35]"
            />
          </div>
          <div className="relative">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="appearance-none pl-7 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006C35]/20 focus:border-[#006C35]"
            >
              <option value="الكل">كل الأدوار</option>
              {ROLES.map((r) => <option key={r} value={r}>{ROLE_AR[r]}</option>)}
            </select>
            <ChevronDown size={13} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="text-xs text-gray-400 mb-3 text-right">{filtered.length} مستخدم</div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden" dir="rtl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-right px-6 py-3 text-xs font-bold text-gray-500">المستخدم</th>
                <th className="text-right px-6 py-3 text-xs font-bold text-gray-500">الخطة</th>
                <th className="text-right px-6 py-3 text-xs font-bold text-gray-500">المدينة</th>
                <th className="text-right px-6 py-3 text-xs font-bold text-gray-500">تاريخ التسجيل</th>
                <th className="text-right px-6 py-3 text-xs font-bold text-gray-500">الدور</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400 text-sm">لا توجد نتائج</td></tr>
              ) : filtered.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-[#006C35]/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-black text-[#006C35]">{u.full_name?.[0] ?? '؟'}</span>
                      </div>
                      <div>
                        <p className="text-sm font-black text-gray-900">{u.full_name ?? 'مجهول'}</p>
                        <p className="text-xs text-gray-400">{u.email ?? '—'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={u.plan === 'professional' ? 'green' : 'gray'}>
                      {PLAN_AR[u.plan] ?? u.plan ?? 'مجاني'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{u.city ?? '—'}</td>
                  <td className="px-6 py-4 text-xs text-gray-400">
                    {new Date(u.created_at).toLocaleDateString('ar-SA')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="relative flex items-center gap-2">
                      <select
                        value={u.role ?? 'candidate'}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        disabled={updating === u.id}
                        className="appearance-none text-xs border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#006C35]/20 focus:border-[#006C35] disabled:opacity-50"
                      >
                        {ROLES.map((r) => <option key={r} value={r}>{ROLE_AR[r]}</option>)}
                      </select>
                      {updating === u.id && <Loader2 size={12} className="animate-spin text-[#006C35]" />}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
