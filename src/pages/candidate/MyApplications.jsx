import { useState } from 'react';
import { Search, Download, Briefcase, Loader2 } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import { useApplications } from '../../hooks/useApplications';

const statusAr = {
  'All':      'الكل',
  'Pending':  'قيد المراجعة',
  'Reviewed': 'تم الرد',
  'Interview':'مقابلة',
  'Offer':    'قبول مبدئي',
  'Rejected': 'مرفوض',
};

const statusColor = {
  'Pending':  'bg-amber-50 text-amber-700 border-amber-200',
  'Reviewed': 'bg-blue-50 text-blue-700 border-blue-200',
  'Interview':'bg-[#006C35]/10 text-[#006C35] border-[#006C35]/25',
  'Offer':    'bg-purple-50 text-purple-700 border-purple-200',
  'Rejected': 'bg-red-50 text-red-600 border-red-200',
};

const statusDot = {
  'Pending':  'bg-amber-400',
  'Reviewed': 'bg-blue-400',
  'Interview':'bg-[#006C35]',
  'Offer':    'bg-purple-500',
  'Rejected': 'bg-red-400',
};

const statusOptions = ['All', 'Pending', 'Reviewed', 'Interview', 'Offer', 'Rejected'];

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('ar-SA', { year: 'numeric', month: 'short', day: 'numeric' });
}

function exportCSV(applications) {
  const rows = [
    ['الشركة', 'المنصب', 'الحالة', 'تاريخ التقديم'],
    ...applications.map((a) => [a.company, a.position, statusAr[a.status] ?? a.status, formatDate(a.applied_at)]),
  ];
  const csv = rows.map((r) => r.join(',')).join('\n');
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'applications.csv'; a.click();
  URL.revokeObjectURL(url);
}

export default function MyApplications() {
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  const { applications, loading } = useApplications();

  const filtered = applications.filter((a) => {
    const matchStatus = statusFilter === 'All' || a.status === statusFilter;
    const q = search.toLowerCase();
    const matchSearch = !q || a.company.toLowerCase().includes(q) || a.position.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const counts = statusOptions.reduce((acc, s) => {
    acc[s] = s === 'All' ? applications.length : applications.filter((a) => a.status === s).length;
    return acc;
  }, {});

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <Button variant="secondary" size="sm" onClick={() => exportCSV(applications)}>
          <Download size={14} />
          تصدير CSV
        </Button>
        <div className="text-right">
          <h1 className="text-2xl font-black text-gray-900">متابعة التقديمات</h1>
          <p className="text-gray-500 text-sm mt-0.5">تتبّع جميع طلباتك في مكان واحد</p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-6">
        {statusOptions.filter((s) => s !== 'All').map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`p-3 rounded-xl border text-center transition-all duration-200 ${
              statusFilter === s ? 'border-[#006C35]/30 bg-[#006C35]/5' : 'bg-white border-gray-100 hover:border-gray-200'
            }`}
          >
            <div className={`w-2 h-2 rounded-full mx-auto mb-1.5 ${statusDot[s]}`} />
            <p className="text-lg font-black text-gray-900">{counts[s]}</p>
            <p className="text-[10px] text-gray-400 leading-tight">{statusAr[s]}</p>
          </button>
        ))}
      </div>

      {/* Filters Row */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-5 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex gap-1.5 flex-wrap">
          {statusOptions.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all duration-200 ${
                statusFilter === s
                  ? 'bg-[#006C35] text-white shadow-sm'
                  : 'bg-gray-50 border border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {statusAr[s]}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${statusFilter === s ? 'bg-white/20' : 'bg-gray-200'}`}>
                {counts[s]}
              </span>
            </button>
          ))}
        </div>

        <div className="relative">
          <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث عن شركة أو منصب..."
            className="w-full sm:w-56 pr-9 pl-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006C35]/20 focus:border-[#006C35] text-right"
          />
        </div>
      </div>

      {/* Applications List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 h-20 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <Briefcase size={40} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 font-bold">
            {applications.length === 0 ? 'لم تُقدّم على أي وظيفة بعد' : 'لا توجد طلبات لهذا الفلتر'}
          </p>
          {applications.length === 0 && (
            <p className="text-xs text-gray-400 mt-1">ابدأ بتصفّح الوظائف والتقديم عليها</p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((app) => (
            <div
              key={app.id}
              className={`bg-white rounded-2xl border shadow-sm p-4 hover:shadow-md transition-all duration-200 flex items-center gap-4 flex-row-reverse ${
                app.status === 'Offer'      ? 'border-purple-200 bg-purple-50/30' :
                app.status === 'Interview'  ? 'border-[#006C35]/20' : 'border-gray-100'
              }`}
            >
              {app.logo ? (
                <img src={app.logo} alt={app.company} className="w-11 h-11 rounded-xl flex-shrink-0 object-cover" />
              ) : (
                <div className="w-11 h-11 rounded-xl bg-[#006C35]/10 flex items-center justify-center flex-shrink-0 text-sm font-black text-[#006C35]">
                  {app.company[0]}
                </div>
              )}

              <div className="flex-1 min-w-0 text-right">
                <div className="flex items-center gap-2 justify-end">
                  {app.status === 'Offer'      && <span className="text-xs font-black text-purple-600">🎉 تهانينا!</span>}
                  {app.status === 'Interview'  && <span className="text-xs font-black text-[#006C35]">📅 مقابلة قادمة</span>}
                  <h3 className="text-sm font-black text-gray-900">{app.position}</h3>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{app.company}</p>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-xs text-gray-400">{formatDate(app.applied_at)}</span>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-black rounded-full border ${statusColor[app.status] ?? 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${statusDot[app.status] ?? 'bg-gray-400'}`} />
                  {statusAr[app.status] ?? app.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-5 flex justify-end">
        <p className="text-xs text-gray-400">عرض {filtered.length} من {applications.length} طلب</p>
      </div>
    </DashboardLayout>
  );
}
