import { motion } from 'framer-motion';
import { CheckCircle, FileText, Zap, ShieldCheck } from 'lucide-react';

const COMPANIES = [
  'أرامكو السعودية',
  'سابك',
  'STC',
  'بنك الراجحي',
  'نيوم',
  'صندوق الاستثمارات العامة',
  'مدينة الملك عبدالله الاقتصادية',
  'البنك الأهلي',
  'stc pay',
  'الاتحاد للاتصالات',
];


export default function SaudiMarket() {
  return (
    <section className="py-16 bg-white overflow-hidden" dir="rtl">

      {/* ── Companies trust strip ───────────────────────────── */}
      <motion.div
        className="border-y border-gray-100 py-5 mb-20 bg-gray-50/50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Vision 2030 badge */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#006C35] to-[#004d26] flex items-center justify-center shadow-sm">
                <span className="text-2xl">🇸🇦</span>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-[#006C35] uppercase tracking-widest">رؤية ٢٠٣٠</p>
                <p className="text-xs font-bold text-gray-500">شريك التوظيف الوطني</p>
              </div>
              <div className="h-8 w-px bg-gray-200 mx-2 hidden sm:block" />
            </div>

            {/* Scrolling companies */}
            <p className="text-xs text-gray-400 font-bold flex-shrink-0">عملاؤنا يعملون في:</p>
            <div className="flex-1 overflow-hidden">
              <div className="flex gap-8 items-center whitespace-nowrap">
                {[...COMPANIES, ...COMPANIES].map((c, i) => (
                  <span
                    key={i}
                    className="text-sm font-black text-gray-400 hover:text-[#006C35] transition-colors cursor-default flex-shrink-0"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── CV Design Showcase ──────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#006C35]/8 border border-[#006C35]/15 rounded-full mb-5">
            <FileText size={13} className="text-[#006C35]" />
            <span className="text-xs font-bold text-[#006C35]">سيرة ذاتية احترافية</span>
          </div>
          <h2 className="arabic-heading text-3xl sm:text-4xl lg:text-5xl text-gray-900 mb-4">
            سيرة ذاتية تتجاوز{' '}
            <span className="text-gradient-green">فلاتر ATS</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
            نصمم سيرتك الذاتية بأحدث المعايير التي تخترق أنظمة الفلترة التلقائية وتصل مباشرة إلى مسؤول التوظيف.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

          {/* CV Mockup — real samples */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            {/* ATS Score Badge */}
            <div className="absolute -top-4 -left-4 z-20 bg-white border border-[#C8A951]/40 rounded-2xl px-4 py-3 shadow-xl">
              <p className="text-[10px] text-gray-400 font-bold mb-0.5">ATS Score</p>
              <div className="flex items-end gap-1">
                <span className="text-2xl font-black text-[#006C35]">٩٧</span>
                <span className="text-sm font-black text-[#C8A951] mb-0.5">/ ١٠٠</span>
              </div>
            </div>

            {/* 3 stacked CV images */}
            <div className="relative h-[420px] flex items-center justify-center">
              {/* Card 3 — back right */}
              <div className="absolute right-0 top-6 w-[200px] rounded-2xl overflow-hidden shadow-lg border border-gray-200 rotate-[4deg] z-10">
                <img src="/cv-sample-3.png" alt="نموذج سيرة ذاتية ٣" className="w-full object-cover object-top" />
                <div className="absolute inset-0 bg-white/20" />
              </div>

              {/* Card 1 — back left */}
              <div className="absolute left-0 top-6 w-[200px] rounded-2xl overflow-hidden shadow-lg border border-gray-200 -rotate-[4deg] z-10">
                <img src="/cv-sample-1.png" alt="نموذج سيرة ذاتية ١" className="w-full object-cover object-top" />
                <div className="absolute inset-0 bg-white/20" />
              </div>

              {/* Card 2 — front center */}
              <div className="relative w-[220px] rounded-2xl overflow-hidden shadow-2xl shadow-[#006C35]/15 border-2 border-[#006C35]/20 z-20">
                <img src="/cv-sample-2.png" alt="نموذج سيرة ذاتية ٢" className="w-full object-cover object-top" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#006C35] to-transparent py-3 px-3">
                  <p className="text-white text-[10px] font-black">تصميم قِمّة الاحترافي ✓</p>
                </div>
              </div>
            </div>

            {/* Bottom label */}
            <div className="flex justify-center gap-3 mt-2">
              {['نموذج ١','نموذج ٢','نموذج ٣'].map((l, i) => (
                <div key={l} className={`px-3 py-1 rounded-full text-[10px] font-black ${i === 1 ? 'bg-[#006C35] text-white' : 'bg-gray-100 text-gray-400'}`}>{l}</div>
              ))}
            </div>
          </motion.div>

          {/* Features list */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.1 }}
          >
            <h3 className="text-2xl font-black text-gray-900 mb-6">
              لماذا سيرتك من قِمّة تختلف؟
            </h3>

            {[
              { icon: Zap,         color: 'bg-[#C8A951]/10 text-[#C8A951]',      title: 'تتجاوز أنظمة ATS تلقائياً',         desc: 'نستخدم أحدث معايير ATS 2024 — الكلمات المفتاحية، الهيكل، والتنسيق الصحيح.' },
              { icon: ShieldCheck, color: 'bg-[#006C35]/10 text-[#006C35]',      title: 'معدل قبول ٩٧٪',                      desc: 'سيرتنا تصل لمسؤول التوظيف بدل ما تحذفها الأنظمة التلقائية قبل ما يشوفها أحد.' },
              { icon: FileText,    color: 'bg-blue-50 text-blue-600',             title: 'تصميم يلفت الانتباه',                desc: 'تصميم عصري واحترافي يجعل سيرتك تبرز من بين مئات الطلبات.' },
              { icon: CheckCircle, color: 'bg-purple-50 text-purple-600',         title: 'عربي وإنجليزي في نسخة واحدة',        desc: 'نصيغ محتواك بالعربية والإنجليزية مع مراجعة لغوية كاملة.' },
            ].map((item) => (
              <div key={item.title} className="flex gap-4 p-4 rounded-2xl border border-gray-100 bg-white hover:shadow-md hover:border-gray-200 transition-all duration-200">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${item.color}`}>
                  <item.icon size={19} />
                </div>
                <div className="text-right flex-1">
                  <p className="font-black text-gray-900 text-sm mb-0.5">{item.title}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              {[
                { num: '٩٧٪', label: 'نسبة اجتياز ATS' },
                { num: '+٣٢٠٠', label: 'سيرة سُلِّمت' },
                { num: '٨ ساعات', label: 'وقت التسليم' },
              ].map(s => (
                <div key={s.label} className="text-center p-3 bg-gray-50 rounded-2xl">
                  <p className="text-lg font-black text-[#006C35]">{s.num}</p>
                  <p className="text-[9px] text-gray-500 font-bold mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
