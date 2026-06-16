import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, FileText, Globe, Building2, MessageSquare, User2, Link2 } from 'lucide-react';
import Button from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

const STATS = [
  { end: 3200, suffix: '+',  label: 'ملف مهني جُهِّز',   decimals: 0 },
  { end: 950,  suffix: '+',  label: 'موقع شخصي أُنشِئ',  decimals: 0 },
  { end: 150,  suffix: 'K+', label: 'تقديم على شركة',    decimals: 0 },
  { end: 4.8,  suffix: '/5', label: 'متوسط التقييم',      decimals: 1 },
];

const SERVICES = [
  { icon: Link2,      label: 'LinkedIn',           color: 'bg-blue-50 text-blue-600' },
  { icon: Globe,         label: 'الموقع الشخصي',      color: 'bg-purple-50 text-purple-600' },
  { icon: User2,         label: 'صورة احترافية',       color: 'bg-rose-50 text-rose-600' },
  { icon: FileText,      label: 'سيرة ذاتية',          color: 'bg-[#006C35]/10 text-[#006C35]' },
  { icon: MessageSquare, label: 'رسالة تقديم',         color: 'bg-amber-50 text-amber-600' },
  { icon: Building2,     label: '٢٠٠ شركة',           color: 'bg-indigo-50 text-indigo-600' },
];

function StatsRow() {
  const [vals, setVals] = useState(STATS.map(() => 0));
  const containerRef   = useRef(null);
  const triggered      = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !triggered.current) {
        triggered.current = true;
        obs.disconnect();
        const duration = 1700;
        let t0 = null;
        const frame = (ts) => {
          if (!t0) t0 = ts;
          const p    = Math.min((ts - t0) / duration, 1);
          const ease = 1 - (1 - p) ** 3;
          setVals(STATS.map((s) => parseFloat((ease * s.end).toFixed(s.decimals))));
          if (p < 1) requestAnimationFrame(frame);
        };
        requestAnimationFrame(frame);
      }
    }, { threshold: 0.35 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-6 max-w-3xl mx-auto">
      {STATS.map((stat, i) => (
        <div key={stat.label} className="text-center group cursor-default select-none">
          <p className="text-2xl sm:text-3xl font-black text-gray-900 tabular-nums transition-transform duration-200 group-hover:scale-105">
            {stat.decimals > 0 ? vals[i].toFixed(stat.decimals) : vals[i].toLocaleString('en-US')}
            <span className="text-[#006C35]">{stat.suffix}</span>
          </p>
          <div className="w-6 h-0.5 bg-[#006C35]/30 rounded-full mx-auto mt-1.5 mb-1 group-hover:bg-[#006C35]/60 transition-colors duration-300" />
          <p className="text-sm text-gray-500">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}

export default function Hero() {
  const { session } = useAuth();
  const ctaHref = session ? '/dashboard' : '/register';

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
      <div className="absolute inset-0 saudi-geo-pattern opacity-40 pointer-events-none" />
      <div className="absolute inset-0 gradient-hero pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#006C35]/6 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-20 w-[300px] h-[300px] bg-[#C8A951]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">

        {/* Badge */}
        <div className="flex justify-center mb-8">
          <div className="badge-vision inline-flex items-center gap-2 px-5 py-2 rounded-full">
            <Sparkles size={13} className="text-[#C8A951]" />
            <span className="text-xs font-bold text-[#006C35]">خدمات مهنية تنفيذية للكفاءات السعودية</span>
            <span className="text-base">🇸🇦</span>
          </div>
        </div>

        {/* Main headline */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="arabic-heading text-5xl sm:text-6xl lg:text-7xl text-gray-900 mb-5">
            نُجهِّز لك{' '}
            <span className="text-gradient-saudi">حضورك المهني</span>
            <br />
            <span className="text-gray-900">بالكامل</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-500 leading-loose mb-6 max-w-2xl mx-auto">
            سيرتك الذاتية، موقعك الشخصي، ونُقدِّم عنك على{' '}
            <span className="text-[#006C35] font-bold">٢٠٠ شركة سعودية</span>
            {' '}مع متابعة كل رد.
          </p>

          {/* Service pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {SERVICES.map((svc) => (
              <div key={svc.label} className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border border-gray-100 bg-white shadow-sm ${svc.color}`}>
                <svc.icon size={13} />
                {svc.label}
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-5">
            <Link to={ctaHref}>
              <Button variant="primary" size="xl" className="w-full sm:w-auto shadow-xl-saudi">
                <Sparkles size={18} />
                {session ? 'الذهاب إلى لوحة التحكم' : 'ابدأ تجهيز ملفك المهني'}
                <ArrowLeft size={18} className="icon-rtl-flip" />
              </Button>
            </Link>
            <a href="#features">
              <Button variant="secondary" size="xl" className="w-full sm:w-auto">
                اطلع على الخدمات
              </Button>
            </a>
          </div>

          <p className="text-xs text-gray-400">بدون بطاقة ائتمانية · خدمة تنفيذية كاملة · نتائج خلال ٧٢ ساعة</p>
        </div>

        {/* Visual: service showcase */}
        <div className="relative max-w-5xl mx-auto mt-14">
          {/* Browser chrome */}
          <div className="rounded-3xl border border-gray-200 shadow-2xl shadow-gray-200/60 overflow-hidden bg-white glow-green">
            <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-100">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 mx-4 bg-white border border-gray-200 rounded-lg px-3 py-1 text-xs text-gray-400 text-center latin" dir="ltr">
                qimma.sa/dashboard
              </div>
            </div>

            <div className="flex h-72 sm:h-80" dir="rtl">
              {/* Sidebar mock */}
              <div className="w-44 bg-white border-l border-gray-100 p-3 hidden sm:block">
                <div className="flex items-center gap-2 mb-4 p-2">
                  <div className="flex flex-col leading-none">
                    <span className="text-sm font-black text-gray-900">قِمّة</span>
                  </div>
                  <div className="w-7 h-7 rounded-lg gradient-saudi flex items-center justify-center">
                    <span className="text-white text-[10px] font-black">ق</span>
                  </div>
                </div>
                {['نظرة عامة','البرودكاست','السيرة الذاتية','الموقع الشخصي','التقديم على الشركات','ردود الشركات'].map((item, i) => (
                  <div key={item} className={`flex items-center gap-2 px-2 py-1.5 rounded-lg mb-0.5 text-xs ${
                    i === 0 ? 'bg-[#006C35]/10 text-[#006C35] font-bold' : 'text-gray-400'
                  }`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-[#006C35]' : 'bg-gray-200'}`} />
                    {item}
                  </div>
                ))}
              </div>

              {/* Content area */}
              <div className="flex-1 p-4 bg-gray-50/80 overflow-hidden">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
                  {[
                    { label: 'السيرة الذاتية',      val: '✓ جاهزة',   color: 'text-[#006C35]' },
                    { label: 'الموقع الشخصي',        val: '✓ منشور',   color: 'text-blue-600' },
                    { label: 'التقديمات',             val: '٨٧ شركة',  color: 'text-amber-600' },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm">
                      <p className={`text-sm font-black ${stat.color}`}>{stat.val}</p>
                      <p className="text-[9px] text-gray-400 mt-0.5">{stat.label}</p>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm">
                    <p className="text-[10px] font-bold text-gray-700 mb-2 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#006C35]" />
                      البرودكاست
                    </p>
                    {['أرامكو · تم الإرسال','سابك · ردّت ✓','نيوم · تم الإرسال'].map((j) => (
                      <div key={j} className="text-[9px] text-gray-500 py-0.5">{j}</div>
                    ))}
                  </div>
                  <div className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm">
                    <p className="text-[10px] font-bold text-gray-700 mb-2 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      ردود الشركات
                    </p>
                    {['مقابلة مجدولة 🎉','طلب CV إضافي','قيد المراجعة'].map((j) => (
                      <div key={j} className="text-[9px] text-gray-500 py-0.5">{j}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <StatsRow />

        <div className="mt-12 text-center">
          <p className="text-xs text-gray-400 mb-4">عملاء من أبرز الشركات السعودية</p>
          <div className="flex flex-wrap justify-center gap-6">
            {['أرامكو السعودية','سابك','STC','بنك الراجحي','نيوم','صندوق الاستثمارات العامة','البنك الأهلي'].map((c) => (
              <span key={c} className="text-sm font-bold text-gray-300 hover:text-gray-500 transition-colors">{c}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
