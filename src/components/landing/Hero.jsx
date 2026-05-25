import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import Button from '../ui/Button';

const STATS = [
  { end: 5860,  suffix: '+',  label: 'مستخدم نشط',    decimals: 0 },
  { end: 1420,  suffix: '+',  label: 'وظيفة منشورة',  decimals: 0 },
  { end: 1320,  suffix: '+',  label: 'شركة موثوقة',   decimals: 0 },
  { end: 4.2,   suffix: '/5', label: 'متوسط التقييم', decimals: 1 },
];

const floatingCards = [
  { emoji: '🎯', text: 'درجة ATS: 94',         style: 'top-[18%] left-[4%]',    delay: '0s'   },
  { emoji: '✅', text: 'سيرة ذاتية محسّنة',     style: 'top-[28%] right-[3%]',   delay: '0.6s' },
  { emoji: '📈', text: '+٢٣ نقطة مهنية',        style: 'bottom-[32%] left-[5%]', delay: '1.1s' },
  { emoji: '💼', text: 'تطابق ٩٤٪ مع الوظيفة', style: 'bottom-[22%] right-[4%]', delay: '1.6s' },
];

// ── Count-up stats section ────────────────────────────────────────────────────
function StatsRow() {
  const [vals, setVals] = useState(STATS.map(() => 0));
  const containerRef = useRef(null);
  const triggered    = useRef(false);

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
    <div
      ref={containerRef}
      className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-6 max-w-3xl mx-auto"
    >
      {STATS.map((stat, i) => (
        <div
          key={stat.label}
          className="text-center group cursor-default select-none"
        >
          <p className="text-2xl sm:text-3xl font-black text-gray-900 tabular-nums transition-transform duration-200 group-hover:scale-105">
            {stat.decimals > 0
              ? vals[i].toFixed(stat.decimals)
              : vals[i].toLocaleString('en-US')}
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

      {/* Saudi geometric pattern */}
      <div className="absolute inset-0 saudi-geo-pattern opacity-40 pointer-events-none" />

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 gradient-hero pointer-events-none" />

      {/* Top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#006C35]/6 rounded-full blur-3xl pointer-events-none" />
      {/* Gold accent */}
      <div className="absolute bottom-20 left-20 w-[300px] h-[300px] bg-[#C8A951]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">

        {/* Badge */}
        <div className="flex justify-center mb-8">
          <div className="badge-vision inline-flex items-center gap-2 px-5 py-2 rounded-full">
            <Sparkles size={13} className="text-[#C8A951]" />
            <span className="text-xs font-bold text-[#006C35]">نحو القمة • لتمكين الكفاءات السعودية</span>
            <span className="text-base">🇸🇦</span>
          </div>
        </div>

        {/* Main headline */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="arabic-heading text-5xl sm:text-6xl lg:text-7xl text-gray-900 mb-5">
            ابنِ{' '}
            <span className="text-gradient-saudi">حضورك المهني</span>
            <br />
            <span className="text-gray-900">بثقة</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-500 leading-loose mb-10 max-w-2xl mx-auto">
            منصة سعودية تساعدك على تجهيز سيرتك الذاتية، بناء ملفك المهني،
            <br className="hidden sm:block" />
            <span className="text-[#006C35] font-bold"> متابعة طلباتك، والاستعداد للمقابلات للوصول إلى فرص أفضل.</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-5">
            <Link to="/register">
              <Button variant="primary" size="xl" className="w-full sm:w-auto shadow-xl-saudi">
                <Sparkles size={18} />
                ابدأ مجانًا
                <ArrowLeft size={18} className="icon-rtl-flip" />
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="secondary" size="xl" className="w-full sm:w-auto">
                استكشف المنصة
              </Button>
            </Link>
          </div>

          <p className="text-xs text-gray-400">مجاني للبدء · لا يلزم بطاقة ائتمانية · لخريجي الجامعات والباحثين عن عمل</p>
        </div>

        {/* Dashboard Preview */}
        <div className="relative max-w-5xl mx-auto mt-14">
          {/* Floating cards */}
          {floatingCards.map((card, i) => (
            <div
              key={i}
              className={`hidden lg:flex absolute items-center gap-2 bg-white border border-gray-100 shadow-lg rounded-2xl px-3 py-2 text-xs font-medium text-gray-700 animate-float z-10 ${card.style}`}
              style={{ animationDelay: card.delay }}
            >
              <span>{card.emoji}</span>
              <span>{card.text}</span>
            </div>
          ))}

          {/* Browser chrome */}
          <div className="rounded-3xl border border-gray-200 shadow-2xl shadow-gray-200/60 overflow-hidden bg-white glow-green">
            {/* Browser bar */}
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

            {/* Mock dashboard */}
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
                {['نظرة عامة','سيرتي الذاتية','ملفي المهني','الوظائف الحديثة','متابعة التقديمات'].map((item, i) => (
                  <div key={item} className={`flex items-center gap-2 px-2 py-1.5 rounded-lg mb-0.5 text-xs ${
                    i === 0 ? 'bg-[#006C35]/10 text-[#006C35] font-bold' : 'text-gray-400'
                  }`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-[#006C35]' : 'bg-gray-200'}`} />
                    {item}
                  </div>
                ))}
              </div>

              {/* Content */}
              <div className="flex-1 p-4 bg-gray-50/80 overflow-hidden">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                  {[
                    { label: 'الدرجة المهنية', val: '٨٧', color: 'text-[#006C35]' },
                    { label: 'درجة ATS',       val: '٨٢', color: 'text-blue-600'  },
                    { label: 'مستوى اللغة',    val: 'B',  color: 'text-amber-600' },
                    { label: 'الطلبات',         val: '١٢', color: 'text-purple-600'},
                  ].map((stat) => (
                    <div key={stat.label} className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm">
                      <p className={`text-lg font-black ${stat.color}`}>{stat.val}</p>
                      <p className="text-[9px] text-gray-400 mt-0.5">{stat.label}</p>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm">
                    <p className="text-[10px] font-bold text-gray-700 mb-2">التقدم المهني</p>
                    <div className="flex items-end gap-1 h-10">
                      {[35, 50, 62, 73, 87].map((h, i) => (
                        <div key={i} className="flex-1 rounded-sm bg-[#006C35]" style={{ height: `${h}%`, opacity: 0.5 + i * 0.12 }} />
                      ))}
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm">
                    <p className="text-[10px] font-bold text-gray-700 mb-2">أفضل وظائف لك</p>
                    {['أرامكو · ٩٤٪','نيوم · ٨٩٪','STC · ٨٥٪'].map((j) => (
                      <div key={j} className="text-[9px] text-gray-500 py-0.5 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#006C35]" />
                        {j}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats — count-up on scroll */}
        <StatsRow />

        {/* Trusted by */}
        <div className="mt-12 text-center">
          <p className="text-xs text-gray-400 mb-4">يثق به موظفون في أبرز الشركات السعودية</p>
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
