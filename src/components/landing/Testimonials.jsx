import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { testimonials } from '../../data/testimonials';

const HIDDEN_SCROLL_CSS = `.testimonials-snap::-webkit-scrollbar { display: none; }`;

const FEATURED = testimonials.slice(0, 12);

const PLAN_AR = {
  Free:         'مجاني',
  Professional: 'احترافي',
  'HR Plan':    'HR',
};

const STATS = [
  { end: 4.8,  suffix: '/5', label: 'متوسط التقييم',    sub: 'من عملائنا',          decimals: 1 },
  { end: 3200, suffix: '+',  label: 'ملف مهني جُهِّز',   sub: 'سيرة + موقع',         decimals: 0 },
  { end: 150,  suffix: 'K+', label: 'تقديم على شركات',  sub: 'خلال ١٢ شهراً',        decimals: 0 },
  { end: 94,   suffix: '%',  label: 'نسبة الرضا',       sub: 'يوصون بالخدمة',        decimals: 0 },
];

function StatsBar() {
  const [vals, setVals]   = useState(STATS.map(() => 0));
  const containerRef      = useRef(null);
  const triggered         = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !triggered.current) {
        triggered.current = true;
        obs.disconnect();
        const duration = 1600;
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
    }, { threshold: 0.4 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <motion.div
      ref={containerRef}
      className="mt-14 mx-4 sm:mx-8 lg:mx-auto max-w-4xl grid grid-cols-2 sm:grid-cols-4 gap-5 p-7 bg-white rounded-2xl border border-gray-100 shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      {STATS.map((s, i) => (
        <div key={s.label} className="text-center group cursor-default select-none">
          <p className="text-2xl sm:text-3xl font-black text-gray-900 tabular-nums transition-transform duration-200 group-hover:scale-105">
            {s.decimals > 0
              ? vals[i].toFixed(s.decimals)
              : vals[i].toLocaleString('en-US')}
            <span className="text-[#006C35]">{s.suffix}</span>
          </p>
          <div className="w-5 h-0.5 bg-[#006C35]/25 rounded-full mx-auto mt-1.5 mb-1 group-hover:bg-[#006C35]/50 transition-colors duration-300" />
          <p className="text-sm text-gray-700 font-semibold">{s.label}</p>
          <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
        </div>
      ))}
    </motion.div>
  );
}

function TestimonialCard({ name, role, company, avatar, rating, comment, plan }) {
  return (
    <div
      className="h-full bg-white rounded-2xl border border-gray-100 shadow-[0_2px_14px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.13)] hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col gap-3 cursor-default"
      dir="rtl"
    >
      <Quote size={22} className="text-[#006C35]/10 self-start" style={{ transform: 'scaleX(-1)' }} />

      <div className="flex gap-0.5 -mt-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={12}
            className={i < rating ? 'text-[#C8A951] fill-[#C8A951]' : 'text-gray-200 fill-gray-200'}
          />
        ))}
      </div>

      <p className="text-gray-700 text-sm leading-relaxed flex-1">"{comment}"</p>

      <div className="flex items-center gap-2.5 pt-3 border-t border-gray-50">
        <img src={avatar} alt={name} className="w-9 h-9 rounded-full flex-shrink-0" loading="lazy" />
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900 text-sm truncate">{name}</p>
          <p className="text-xs text-gray-400 truncate">{role} · {company}</p>
        </div>
        {plan && (
          <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-[#006C35]/8 text-[#006C35] border border-[#006C35]/15 flex-shrink-0">
            {PLAN_AR[plan] ?? plan}
          </span>
        )}
      </div>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="py-24 bg-gray-50 relative overflow-hidden" id="testimonials" dir="rtl">
      <style>{HIDDEN_SCROLL_CSS}</style>

      <div className="absolute inset-0 saudi-geo-pattern opacity-15 pointer-events-none" />
      <div className="absolute top-0 right-1/3 w-[400px] h-[400px] bg-[#006C35]/4 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-[300px] h-[300px] bg-[#C8A951]/4 rounded-full blur-3xl pointer-events-none" />

      <div className="relative">

        {/* Header */}
        <motion.div
          className="text-center mb-12 px-4"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#006C35]/8 border border-[#006C35]/15 rounded-full mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#006C35]" />
            <span className="text-xs font-bold text-[#006C35]">نتائج حقيقية من عملائنا</span>
          </div>
          <h2 className="arabic-heading text-3xl sm:text-4xl lg:text-5xl text-gray-900 mb-4">
            ماذا حقّق{' '}
            <span className="text-gradient-green">عملاؤنا في السعودية</span>
          </h2>
          <p className="text-gray-500 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            من جهّزنا له سيرته وموقعه وقدّمنا عنه — تجارب حقيقية من مختلف القطاعات والمناطق.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Mobile: manual horizontal snap scroll — no auto animation */}
          <div
            className="lg:hidden overflow-x-auto testimonials-snap pb-3"
            style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
          >
            <div className="flex gap-4 px-4 snap-x snap-mandatory" style={{ width: 'max-content' }}>
              {FEATURED.map((t) => (
                <div key={t.id} className="w-[288px] flex-shrink-0 snap-start">
                  <TestimonialCard {...t} />
                </div>
              ))}
            </div>
          </div>

          {/* Desktop: static 3-column grid */}
          <div className="hidden lg:grid grid-cols-3 gap-5 max-w-6xl mx-auto px-8">
            {FEATURED.map((t) => (
              <TestimonialCard key={t.id} {...t} />
            ))}
          </div>
        </motion.div>

        {/* Stats bar — count-up on scroll */}
        <StatsBar />

        {/* Trust badges */}
        <motion.div
          className="mt-8 flex flex-wrap justify-center gap-3 px-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          {[
            { icon: '📝', text: 'سيرة ذاتية ATS احترافية' },
            { icon: '🌐', text: 'موقع شخصي مخصص' },
            { icon: '📤', text: 'تقديم على ٢٠٠+ شركة' },
            { icon: '💬', text: 'متابعة الردود والمقابلات' },
            { icon: '🇸🇦', text: 'خدمة تنفيذية سعودية' },
          ].map((b) => (
            <div
              key={b.text}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-full shadow-sm hover:border-[#006C35]/20 hover:shadow-md transition-all duration-200"
            >
              <span className="text-sm">{b.icon}</span>
              <span className="text-xs font-bold text-gray-600">{b.text}</span>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
