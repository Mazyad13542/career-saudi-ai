import { Link } from 'react-router-dom';
import { ArrowUpRight, Briefcase, Star, TrendingUp, FileText, Crown, UserCircle, Mic, CheckCircle, AlertCircle, ChevronLeft, Flame, Zap, Bell } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import DashboardLayout from '../../components/layout/DashboardLayout';
import ScoreRing from '../../components/ui/ScoreRing';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useApplications } from '../../hooks/useApplications';

const STATUS_AR    = { Pending: 'قيد المراجعة', Reviewed: 'تمت المراجعة', Interview: 'مقابلة', Offer: 'عرض عمل', Rejected: 'مرفوض' };
const STATUS_COLOR = {
  Pending:  'bg-amber-50 text-amber-700 border-amber-200',
  Reviewed: 'bg-blue-50 text-blue-700 border-blue-200',
  Interview:'bg-green-50 text-green-700 border-green-200',
  Offer:    'bg-purple-50 text-purple-700 border-purple-200',
  Rejected: 'bg-red-50 text-red-600 border-red-200',
};

const READINESS_ITEMS = [
  { label: 'السيرة الذاتية',   done: true,  href: '/dashboard/cv',        icon: FileText },
  { label: 'الملف المهني',     done: true,  href: '/dashboard/profile',   icon: UserCircle },
  { label: 'المقابلة التجريبية',done: true,  href: '/dashboard/interview', icon: Mic },
  { label: 'الموقع الشخصي',   done: false, href: '/dashboard/portfolio',  icon: Star },
];

const TODAY_OPPS = [
  { type: 'job',       icon: '💼', title: 'وظيفة جديدة مناسبة',  desc: 'React Developer — أرامكو السعودية · تطابق ٩٤٪', href: '/dashboard/jobs-for-you', badge: 'جديد',   badgeColor: 'bg-green-100 text-green-700' },
  { type: 'profile',   icon: '👁️', title: 'شركة شاهدت ملفك',     desc: 'شاهد ٣ مسؤولو توظيف ملفك هذا الأسبوع',          href: '/dashboard/profile',      badge: 'نشاط',   badgeColor: 'bg-blue-100 text-blue-700' },
  { type: 'improve',   icon: '🚀', title: 'أضف مهارة مطلوبة',    desc: 'Docker مطلوبة في ٧٢٪ من الوظائف المناسبة لك',    href: '/dashboard/cv',           badge: 'تحسين',  badgeColor: 'bg-amber-100 text-amber-700' },
  { type: 'interview', icon: '🎙️', title: 'مقابلة تدريبية مقترحة',desc: 'تدرّب على أسئلة تقنية شائعة قبل مقابلتك',       href: '/dashboard/interview',    badge: 'مقترح',  badgeColor: 'bg-purple-100 text-purple-700' },
];

const NEXT_STEPS = [
  { icon: '🎯', title: 'خصّص سيرتك لوظيفة محددة',   cta: 'اذهب للسيرة',   href: '/dashboard/cv',           premium: true },
  { icon: '💬', title: 'أجرِ مقابلة تجريبية جديدة',  cta: 'ابدأ المقابلة', href: '/dashboard/interview',    premium: false },
  { icon: '📈', title: 'اكتشف مسارك المهني المثالي', cta: 'افتح المستشار', href: '/dashboard/career-coach', premium: false },
  { icon: '🔍', title: 'استعرض أحدث الوظائف اليوم', cta: 'عرض الوظائف',  href: '/dashboard/jobs',          premium: false },
];

export default function Overview() {
  const { profile, isPremium } = useAuth();
  const { applications, stats } = useApplications();

  const firstName      = profile?.full_name?.split(' ')[0] || 'أهلاً';
  const readinessScore = profile?.profile_strength || 72;

  // Build a 6-month progress curve ending at the current readiness score
  const MONTHS = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'];
  const start  = Math.max(20, readinessScore - 35);
  const careerProgressData = MONTHS.map((month, i) => ({
    month,
    score: Math.round(start + (readinessScore - start) * (i / (MONTHS.length - 1))),
  }));
  const streakDays    = profile?.streak_days || 0;
  const recentApps    = applications.slice(0, 4);

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : 'م';

  const avatarUrl = profile?.avatar_url
    || `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=006C35&color=fff&size=40`;

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <Link to="/dashboard/cv">
          <Button variant="primary" size="sm">
            <TrendingUp size={14} />
            طوّر ملفك الآن
          </Button>
        </Link>
        <div className="text-right">
          <h1 className="text-2xl font-black text-gray-900">
            صباح النور، {firstName} 👋
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            فرصتك تبدأ من هنا — إليك نظرة عامة على جاهزيتك المهنية
          </p>
        </div>
      </div>

      {/* Score Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Readiness Score */}
        <div className="lg:col-span-2 p-6 bg-gradient-to-l from-[#006C35] to-[#00A651] rounded-2xl relative overflow-hidden">
          <div className="absolute inset-0 saudi-geo-pattern opacity-[0.04] pointer-events-none" />
          <div className="relative flex flex-col sm:flex-row items-center gap-6">
            <div className="text-center flex-shrink-0">
              <div className="relative">
                <ScoreRing score={readinessScore} size={110} strokeWidth={10} color="#C8A951" label="" />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-white">{readinessScore}</span>
                  <span className="text-xs text-green-200 font-bold">من ١٠٠</span>
                </div>
              </div>
            </div>
            <div className="flex-1 text-right">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 rounded-full mb-2">
                <span className="text-xs font-black text-[#C8A951]">مستوى: جيد · نحو القمة</span>
                <Star size={12} className="text-[#C8A951]" />
              </div>
              <h2 className="text-xl font-black text-white mb-1">مؤشر الجاهزية المهنية</h2>
              <p className="text-green-200 text-xs leading-relaxed mb-3">أكمل ملفك المهني لترفع درجتك وتزيد فرص الحصول على المقابلات</p>
              <div className="flex flex-wrap gap-2 justify-end">
                {READINESS_ITEMS.map((item) => (
                  <Link key={item.href} to={item.href} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${item.done ? 'bg-white/20 text-white' : 'bg-white/10 text-green-300 border border-white/20'}`}>
                    {item.label}
                    {item.done ? <CheckCircle size={11} className="text-[#C8A951]" /> : <AlertCircle size={11} className="text-green-300" />}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Streak */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col justify-between">
          <div className="text-right">
            <div className="flex items-center gap-2 justify-end mb-3">
              <span className="text-sm font-black text-gray-900">التطوير المستمر</span>
              <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center">
                <Flame size={18} className="text-orange-500" />
              </div>
            </div>
            <div className="flex items-baseline gap-1 justify-end mb-1">
              <span className="text-sm text-gray-400">أيام</span>
              <span className="text-5xl font-black text-orange-500">{streakDays}</span>
              <span className="text-2xl">🔥</span>
            </div>
            <p className="text-xs text-gray-400 mb-4">متتالية من التطوير المهني</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400">الهدف: ١٤ يوم</span>
              <span className="font-black text-orange-500">{Math.round(Math.min(streakDays / 14 * 100, 100))}٪</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5">
              <div className="bg-gradient-to-l from-orange-400 to-orange-600 h-1.5 rounded-full transition-all" style={{ width: `${Math.min(streakDays / 14 * 100, 100)}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'الوظائف المناسبة لك', value: '٣٨',            sub: 'بناءً على ملفك',   color: 'text-[#006C35]', bg: 'bg-[#006C35]/8', icon: '🎯', href: '/dashboard/jobs-for-you' },
          { label: 'الطلبات المُرسلة',    value: stats.total || '٠', sub: 'إجمالي الطلبات',   color: 'text-blue-600',  bg: 'bg-blue-50',     icon: '📋', href: '/dashboard/applications' },
          { label: 'ردود الشركات',        value: stats.interview || '٠', sub: 'مقابلات ورود',  color: 'text-amber-600', bg: 'bg-amber-50',    icon: '💬', href: '/dashboard/replies' },
          { label: 'مستوى اللغة',        value: profile?.english_level || 'B1', sub: 'إنجليزي', color: 'text-purple-600', bg: 'bg-purple-50', icon: '🌐', href: '/dashboard/english' },
        ].map((stat) => (
          <Link key={stat.label} to={stat.href} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 text-right block group">
            <div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center mb-3 mr-auto group-hover:scale-110 transition-transform`}>
              <span className="text-lg">{stat.icon}</span>
            </div>
            <p className={`text-2xl font-black ${stat.color} stat-number`}>{stat.value}</p>
            <p className="text-xs font-bold text-gray-700 mt-0.5">{stat.label}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">{stat.sub}</p>
          </Link>
        ))}
      </div>

      {/* Opportunities */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <Link to="/dashboard/jobs-for-you" className="text-xs text-[#006C35] font-black hover:underline flex items-center gap-1">
            <ChevronLeft size={12} />
            عرض الكل
          </Link>
          <div className="flex items-center gap-2">
            <h2 className="font-black text-gray-900">فرصك اليوم</h2>
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {TODAY_OPPS.map((op) => (
            <Link key={op.type} to={op.href} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 block group">
              <div className="flex items-start justify-between mb-3">
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${op.badgeColor}`}>{op.badge}</span>
                <span className="text-2xl group-hover:scale-110 transition-transform">{op.icon}</span>
              </div>
              <p className="text-sm font-black text-gray-900 mb-1 text-right">{op.title}</p>
              <p className="text-xs text-gray-400 text-right leading-relaxed">{op.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">

          {/* Chart */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-black text-[#006C35] bg-[#006C35]/10 px-3 py-1 rounded-full flex items-center gap-1">
                <Zap size={11} />
                +٢٢ نقطة هذا الشهر
              </span>
              <div className="text-right">
                <h2 className="font-black text-gray-900">تقدّم الجاهزية المهنية</h2>
                <p className="text-xs text-gray-400 mt-0.5">تطور المؤشر خلال الأشهر الماضية</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={140}>
              <AreaChart data={careerProgressData}>
                <defs>
                  <linearGradient id="readGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#006C35" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#006C35" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E5E7EB', fontFamily: 'Tajawal' }} formatter={(v) => [v, 'الجاهزية']} />
                <Area type="monotone" dataKey="score" stroke="#006C35" strokeWidth={2.5} fill="url(#readGrad)" dot={{ fill: '#006C35', strokeWidth: 0, r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Applications */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between p-5 pb-3">
              <Link to="/dashboard/applications" className="text-xs text-[#006C35] font-black hover:underline flex items-center gap-1">
                <ChevronLeft size={12} />
                عرض الكل
              </Link>
              <h2 className="font-black text-gray-900">آخر الطلبات</h2>
            </div>

            {recentApps.length === 0 ? (
              <div className="px-5 py-8 text-center">
                <p className="text-sm text-gray-400">لا توجد طلبات بعد</p>
                <Link to="/dashboard/jobs" className="text-xs text-[#006C35] font-black hover:underline mt-2 block">
                  استعرض الوظائف وتقدّم الآن
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
                      <Briefcase size={16} className="text-[#006C35]" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="p-4 pt-3">
              <Link to="/dashboard/applications">
                <Button variant="outline" size="sm" className="w-full">متابعة جميع الطلبات</Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Profile Scores */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h2 className="font-black text-gray-900 mb-4 text-right">حالة الملف المهني</h2>
            <div className="flex justify-around mb-4">
              <ScoreRing score={profile?.profile_strength || 0} label="الملف"  color="#C8A951" size={68} />
              <ScoreRing score={profile?.ats_score || 0}        label="ATS"    color="#1A56DB" size={68} />
              <ScoreRing score={profile?.career_score || 0}     label="الأداء" color="#006C35" size={68} />
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h2 className="font-black text-gray-900 mb-4 text-right">الخطوات التالية</h2>
            <div className="space-y-3">
              {NEXT_STEPS.map((step) => (
                <div key={step.title} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-[#006C35]/5 transition-colors flex-row-reverse group">
                  <span className="text-xl flex-shrink-0 group-hover:scale-110 transition-transform">{step.icon}</span>
                  <div className="flex-1 min-w-0 text-right">
                    <p className="text-xs font-black text-gray-800">{step.title}</p>
                    {step.premium && (
                      <span className="text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full font-black">احترافي</span>
                    )}
                  </div>
                  <Link to={step.href} className="text-xs text-[#006C35] font-black hover:underline flex-shrink-0">{step.cta}</Link>
                </div>
              ))}
            </div>
          </div>

          {/* Upgrade CTA — only show for free users */}
          {!isPremium() && (
            <div className="bg-gradient-to-bl from-gray-900 to-gray-800 rounded-2xl p-5 text-white relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-l from-transparent via-[#C8A951]/60 to-transparent" />
              <div className="flex items-center gap-2 mb-2 justify-end">
                <span className="text-xs font-black text-[#C8A951]">الخطة الاحترافية</span>
                <Crown size={14} className="text-[#C8A951]" />
              </div>
              <h3 className="font-black text-sm mb-1 text-right">ارقَ وافتح جميع الأدوات</h3>
              <p className="text-xs text-gray-400 mb-3 text-right leading-relaxed">مقابلات غير محدودة · تخصيص السيرة · مطابقة متقدمة للوظائف</p>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-gray-500 line-through">٢٩٩ ريال</span>
                <span className="text-lg font-black text-white">٩٩ ريال<span className="text-xs text-gray-400">/شهر</span></span>
              </div>
              <Link to="/#pricing">
                <Button variant="gold" size="sm" className="w-full">اشترك الآن</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
