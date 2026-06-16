import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, FileText, Globe, Building2, MessageSquare, User2, Link2 } from 'lucide-react';
import Button from '../ui/Button';

const STATS = [
  { end: 3200, suffix: '+',  label: 'ملف مهني جُهِّز',   decimals: 0 },
  { end: 950,  suffix: '+',  label: 'موقع شخصي أُنشِئ',  decimals: 0 },
  { end: 150,  suffix: 'K+', label: 'تقديم على شركة',    decimals: 0 },
  { end: 4.8,  suffix: '/5', label: 'متوسط التقييم',      decimals: 1 },
];

const SERVICES = [
  { icon: Link2,         label: 'LinkedIn',           color: 'bg-blue-50 text-blue-600' },
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
            <Link to="/order">
              <Button variant="primary" size="xl" className="w-full sm:w-auto shadow-xl-saudi">
                <Sparkles size={18} />
                اشترِ الخدمة — ١٩٩ ر.س
                <ArrowLeft size={18} className="icon-rtl-flip" />
              </Button>
            </Link>
            <a href="#features">
              <Button variant="secondary" size="xl" className="w-full sm:w-auto">
                اطلع على الخدمات
              </Button>
            </a>
          </div>

          <p className="text-xs text-gray-400">خدمة تنفيذية كاملة · التسليم على واتساب خلال ٨ ساعات</p>
        </div>

        {/* Visual: LinkedIn profile + CV showcase */}
        <div className="relative max-w-5xl mx-auto mt-14" dir="rtl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

            {/* ── LinkedIn Profile Card ── */}
            <div className="rounded-3xl overflow-hidden shadow-2xl shadow-[#0A66C2]/10 border border-gray-100 bg-white">
              {/* LinkedIn top bar */}
              <div className="flex items-center gap-2 px-4 py-2.5 bg-white border-b border-gray-100">
                <div className="w-5 h-5 rounded bg-[#0A66C2] flex items-center justify-center">
                  <span className="text-white text-[9px] font-black">in</span>
                </div>
                <span className="text-[10px] font-bold text-[#0A66C2]">LinkedIn</span>
                <span className="mr-auto text-[9px] text-gray-300 latin" dir="ltr">linkedin.com/in/...</span>
              </div>

              {/* Cover */}
              <div className="h-16 bg-gradient-to-l from-[#0A66C2] to-[#004182] relative">
                <div className="absolute -bottom-7 right-4 w-14 h-14 rounded-full border-3 border-white bg-gradient-to-b from-[#006C35] to-[#00A651] flex items-center justify-center shadow-lg">
                  <span className="text-white text-lg font-black">م</span>
                </div>
              </div>

              {/* Profile info */}
              <div className="pt-10 px-4 pb-4">
                <p className="font-black text-gray-900 text-sm mb-0.5">محمد عبدالله العتيبي</p>
                <p className="text-[11px] text-gray-500 mb-2">مدير تطوير الأعمال · شركة أرامكو السعودية</p>
                <p className="text-[10px] text-gray-400 mb-3">الرياض، المملكة العربية السعودية · +٥٠٠ متابع</p>

                {/* Skills */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {['إدارة المشاريع','التحليل المالي','القيادة'].map(s => (
                    <span key={s} className="px-2 py-0.5 bg-[#0A66C2]/8 text-[#0A66C2] text-[9px] font-bold rounded-full">{s}</span>
                  ))}
                </div>

                {/* Open to work badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#006C35]/8 border border-[#006C35]/20 rounded-full">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#006C35] animate-pulse" />
                  <span className="text-[9px] font-black text-[#006C35]">Open to Work — تم تفعيله بواسطة قِمّة ✓</span>
                </div>
              </div>
            </div>

            {/* ── CV Card ── */}
            <div className="rounded-3xl overflow-hidden shadow-2xl shadow-gray-200/60 border border-gray-100 bg-white">
              {/* CV header */}
              <div className="bg-gradient-to-l from-gray-900 to-gray-800 px-5 py-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-b from-[#006C35] to-[#00A651] flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-black text-sm">س</span>
                </div>
                <div>
                  <p className="text-white font-black text-sm">سارة أحمد الزهراني</p>
                  <p className="text-gray-400 text-[10px]">محللة بيانات · حاصلة على PMP</p>
                </div>
                <div className="mr-auto">
                  <div className="px-2 py-1 bg-[#C8A951]/20 border border-[#C8A951]/30 rounded-lg">
                    <span className="text-[#C8A951] text-[9px] font-black">ATS ٩٥٪</span>
                  </div>
                </div>
              </div>

              {/* CV body */}
              <div className="p-4 space-y-3" dir="rtl">
                {/* Experience */}
                <div>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 border-b border-gray-100 pb-1">الخبرات</p>
                  {[
                    { role: 'محللة بيانات أولى', co: 'صندوق الاستثمارات العامة', yrs: '٢٠٢١ – الآن' },
                    { role: 'محللة أعمال', co: 'شركة STC', yrs: '٢٠١٩ – ٢٠٢١' },
                  ].map(e => (
                    <div key={e.co} className="flex items-center justify-between py-1">
                      <div>
                        <p className="text-[10px] font-bold text-gray-800">{e.role}</p>
                        <p className="text-[9px] text-gray-400">{e.co}</p>
                      </div>
                      <span className="text-[8px] text-gray-300 latin">{e.yrs}</span>
                    </div>
                  ))}
                </div>

                {/* Skills */}
                <div>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 border-b border-gray-100 pb-1">المهارات</p>
                  <div className="flex flex-wrap gap-1">
                    {['Python','Power BI','SQL','Excel','Tableau'].map(sk => (
                      <span key={sk} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[9px] font-bold rounded-full latin">{sk}</span>
                    ))}
                  </div>
                </div>

                {/* Designed by badge */}
                <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                  <span className="text-[8px] text-gray-300">صُمِّمت بواسطة</span>
                  <div className="flex items-center gap-1">
                    <div className="w-3.5 h-3.5 rounded gradient-saudi flex items-center justify-center">
                      <span className="text-white text-[7px] font-black">ق</span>
                    </div>
                    <span className="text-[9px] font-black text-[#006C35]">قِمّة</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating badge */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-white border border-gray-200 rounded-full shadow-lg flex items-center gap-2">
            <Sparkles size={12} className="text-[#C8A951]" />
            <span className="text-xs font-black text-gray-700">نتائج حقيقية لعملائنا</span>
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
