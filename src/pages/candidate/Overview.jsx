import { Link } from 'react-router-dom';
import {
  Send, FileText, Globe, Building2, MessageSquare,
  ArrowLeft, CheckCircle, Clock, Lock, Sparkles, Crown,
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useApplications } from '../../hooks/useApplications';

const STATUS_COLOR = {
  Pending:  'bg-amber-50 text-amber-700 border-amber-200',
  Reviewed: 'bg-blue-50 text-blue-700 border-blue-200',
  Interview:'bg-green-50 text-green-700 border-green-200',
  Offer:    'bg-purple-50 text-purple-700 border-purple-200',
  Rejected: 'bg-red-50 text-red-600 border-red-200',
};
const STATUS_AR = { Pending: 'قيد المراجعة', Reviewed: 'تمت المراجعة', Interview: 'مقابلة', Offer: 'عرض عمل', Rejected: 'مرفوض' };

const SERVICES = [
  {
    id: 'broadcast',
    icon: Send,
    label: 'البرودكاست',
    desc: 'رسالة احترافية تُرسَل باسمك للشركات',
    href: '/dashboard/broadcast',
    color: 'green',
    stat: { value: '٨', label: 'شركة ردّت' },
  },
  {
    id: 'cv',
    icon: FileText,
    label: 'السيرة الذاتية',
    desc: 'سيرة ذاتية ATS محسّنة وجاهزة',
    href: '/dashboard/cv',
    color: 'blue',
    stat: { value: 'ATS', label: 'محسّنة' },
  },
  {
    id: 'portfolio',
    icon: Globe,
    label: 'الموقع الشخصي',
    desc: 'موقعك المهني جاهز للمشاركة',
    href: '/dashboard/portfolio',
    color: 'purple',
    stat: { value: '٢٤', label: 'زيارة' },
  },
  {
    id: 'applications',
    icon: Building2,
    label: 'التقديم على الشركات',
    desc: 'متابعة التقديمات على الشركات السعودية',
    href: '/dashboard/applications',
    color: 'gold',
    stat: { value: null, label: null },
    dynamic: true,
  },
  {
    id: 'replies',
    icon: MessageSquare,
    label: 'ردود الشركات',
    desc: 'الشركات التي طلبت مقابلة أو ردّت',
    href: '/dashboard/replies',
    color: 'rose',
    stat: { value: null, label: null },
    dynamic: true,
  },
];

const COLOR = {
  green:  { bg: 'bg-[#006C35]/10',  text: 'text-[#006C35]',   ring: 'ring-[#006C35]/20',  val: 'text-[#006C35]'  },
  blue:   { bg: 'bg-blue-50',        text: 'text-blue-600',     ring: 'ring-blue-200',       val: 'text-blue-600'   },
  purple: { bg: 'bg-purple-50',      text: 'text-purple-600',   ring: 'ring-purple-200',     val: 'text-purple-600' },
  gold:   { bg: 'bg-amber-50',       text: 'text-amber-600',    ring: 'ring-amber-200',      val: 'text-amber-600'  },
  rose:   { bg: 'bg-rose-50',        text: 'text-rose-600',     ring: 'ring-rose-200',       val: 'text-rose-600'   },
};

export default function Overview() {
  const { profile, isPremium } = useAuth();
  const { applications, stats } = useApplications();

  const firstName = profile?.full_name?.split(' ')[0] || 'أهلاً';
  const premium   = isPremium();
  const recentApps = applications.slice(0, 5);

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-start justify-between mb-8" dir="rtl">
        <div className="flex gap-3">
          {premium ? (
            <Link to="/#pricing">
              <Button variant="gold" size="sm">
                <Crown size={14} />
                جميع الخدمات مفعّلة
              </Button>
            </Link>
          ) : (
            <Link to="/#pricing">
              <Button variant="primary" size="sm">
                <Sparkles size={14} />
                فعّل خدماتك
              </Button>
            </Link>
          )}
        </div>
        <div className="text-right">
          <h1 className="text-2xl font-black text-gray-900">
            أهلاً، {firstName} 👋
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            إليك خدماتك المهنية — نُجهِّز، نُرسل، ونتابع عنك
          </p>
        </div>
      </div>

      {/* 5 Service Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8" dir="rtl">
        {SERVICES.slice(0, 3).map((svc) => {
          const c = COLOR[svc.color];
          const statValue = svc.dynamic
            ? (svc.id === 'applications' ? (stats?.total || '٠') : (stats?.interview || '٠'))
            : svc.stat.value;
          const statLabel = svc.dynamic
            ? (svc.id === 'applications' ? 'إجمالي التقديمات' : 'مقابلة أو رد')
            : svc.stat.label;

          return (
            <Link
              key={svc.id}
              to={svc.href}
              className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-right">
                  <p className={`text-2xl font-black ${c.val}`}>{statValue}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{statLabel}</p>
                </div>
                <div className={`w-11 h-11 rounded-xl ${c.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <svc.icon size={20} className={c.text} />
                </div>
              </div>
              <h3 className="font-black text-gray-900 text-sm mb-1 text-right">{svc.label}</h3>
              <p className="text-xs text-gray-400 text-right leading-relaxed mb-3">{svc.desc}</p>
              <div className="flex items-center gap-1 justify-end">
                <ArrowLeft size={12} className={`${c.text} icon-rtl-flip`} />
                <span className={`text-xs font-black ${c.text}`}>فتح الخدمة</span>
              </div>
            </Link>
          );
        })}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8" dir="rtl">
        {SERVICES.slice(3).map((svc) => {
          const c = COLOR[svc.color];
          const statValue = svc.id === 'applications' ? (stats?.total || '٠') : (stats?.interview || '٠');
          const statLabel = svc.id === 'applications' ? 'إجمالي التقديمات' : 'مقابلة أو رد';

          return (
            <Link
              key={svc.id}
              to={svc.href}
              className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-right">
                  <p className={`text-2xl font-black ${c.val}`}>{statValue}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{statLabel}</p>
                </div>
                <div className={`w-11 h-11 rounded-xl ${c.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <svc.icon size={20} className={c.text} />
                </div>
              </div>
              <h3 className="font-black text-gray-900 text-sm mb-1 text-right">{svc.label}</h3>
              <p className="text-xs text-gray-400 text-right leading-relaxed mb-3">{svc.desc}</p>
              <div className="flex items-center gap-1 justify-end">
                <ArrowLeft size={12} className={`${c.text} icon-rtl-flip`} />
                <span className={`text-xs font-black ${c.text}`}>فتح الخدمة</span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Applications + Upgrade */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" dir="rtl">

        {/* Recent apps */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between p-5 pb-3">
            <Link to="/dashboard/applications" className="text-xs text-[#006C35] font-black hover:underline flex items-center gap-1">
              <ArrowLeft size={12} />
              عرض الكل
            </Link>
            <h2 className="font-black text-gray-900">آخر التقديمات</h2>
          </div>

          {recentApps.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <Building2 size={32} className="text-gray-200 mx-auto mb-3" />
              <p className="text-sm text-gray-400">لم يتم التقديم على أي شركة بعد</p>
              <Link to="/#pricing" className="text-xs text-[#006C35] font-black hover:underline mt-2 block">
                فعّل خدمة التقديم على ١٠٠+ شركة
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentApps.map((app) => (
                <div key={app.id} className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50 transition-colors">
                  <span className={`px-2.5 py-0.5 text-xs font-black rounded-full border flex-shrink-0 ${STATUS_COLOR[app.status] || 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                    {STATUS_AR[app.status] || app.status}
                  </span>
                  <div className="flex-1 min-w-0 text-right">
                    <p className="text-sm font-black text-gray-900 truncate">{app.position}</p>
                    <p className="text-xs text-gray-400">{app.company} · {new Date(app.applied_at).toLocaleDateString('ar-SA')}</p>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-[#006C35]/10 flex items-center justify-center flex-shrink-0">
                    <Building2 size={16} className="text-[#006C35]" />
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="p-4 pt-3">
            <Link to="/dashboard/applications">
              <Button variant="outline" size="sm" className="w-full">متابعة جميع التقديمات</Button>
            </Link>
          </div>
        </div>

        {/* Status summary + upgrade */}
        <div className="space-y-5">
          {/* Quick status */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h2 className="font-black text-gray-900 mb-4 text-right">ملخص الخدمات</h2>
            <div className="space-y-3">
              {[
                { label: 'البرودكاست',           done: premium, icon: Send,          href: '/dashboard/broadcast' },
                { label: 'السيرة الذاتية',        done: true,    icon: FileText,       href: '/dashboard/cv' },
                { label: 'الموقع الشخصي',         done: premium, icon: Globe,          href: '/dashboard/portfolio' },
                { label: 'التقديم على الشركات',   done: premium, icon: Building2,      href: '/dashboard/applications' },
                { label: 'متابعة الردود',          done: true,    icon: MessageSquare,  href: '/dashboard/replies' },
              ].map((item) => (
                <Link key={item.label} to={item.href} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors flex-row-reverse">
                  <item.icon size={15} className={item.done ? 'text-[#006C35]' : 'text-gray-300'} />
                  <span className="flex-1 text-right text-xs font-bold text-gray-700">{item.label}</span>
                  {item.done
                    ? <CheckCircle size={14} className="text-[#006C35]" />
                    : <Lock size={14} className="text-gray-300" />
                  }
                </Link>
              ))}
            </div>
          </div>

          {/* Upgrade CTA for free users */}
          {!premium && (
            <div className="bg-gradient-to-bl from-gray-900 to-gray-800 rounded-2xl p-5 text-white relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-l from-transparent via-[#C8A951]/60 to-transparent" />
              <div className="flex items-center gap-2 mb-2 justify-end">
                <span className="text-xs font-black text-[#C8A951]">الباقة الكاملة</span>
                <Crown size={14} className="text-[#C8A951]" />
              </div>
              <h3 className="font-black text-sm mb-1 text-right">فعّل جميع الخدمات الخمس</h3>
              <p className="text-xs text-gray-400 mb-3 text-right leading-relaxed">
                البرودكاست · السيرة · الموقع · ١٠٠+ شركة · متابعة الردود
              </p>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-gray-500 line-through">٩٩٩ ريال</span>
                <span className="text-lg font-black text-white">٤٩٩ ريال<span className="text-xs text-gray-400">/شهر</span></span>
              </div>
              <Link to="/#pricing">
                <Button variant="gold" size="sm" className="w-full">فعّل الآن</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
