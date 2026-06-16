import { motion } from 'framer-motion';
import { TrendingUp, Eye, Users, Award } from 'lucide-react';

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

const LINKEDIN_BEFORE = {
  name: 'محمد الغامدي',
  title: 'مهندس برمجيات',
  connections: '٨٧',
  views: '١٢',
  appearance: '٣',
  photo: null,
};

const LINKEDIN_AFTER = {
  name: 'محمد الغامدي',
  title: 'Senior Software Engineer | Full‑Stack Developer',
  connections: '٥٠٠+',
  views: '١,٢٠٠',
  appearance: '٣٤',
  badge: 'مفتوح للعمل',
  photo: null,
};

function AvatarPlaceholder({ size = 14, after = false }) {
  return (
    <div
      className={`rounded-full flex items-center justify-center font-black text-white flex-shrink-0 ${after ? 'bg-[#006C35]' : 'bg-gray-300'}`}
      style={{ width: size * 4, height: size * 4, fontSize: size }}
    >
      م
    </div>
  );
}

function LinkedInCard({ data, label, isAfter }) {
  return (
    <div className={`relative rounded-2xl border bg-white p-5 shadow-md w-full max-w-[260px] ${isAfter ? 'border-[#006C35]/30 shadow-[0_4px_24px_rgba(0,108,53,0.15)]' : 'border-gray-200'}`}>
      {isAfter && (
        <div className="absolute -top-3 right-4 bg-[#006C35] text-white text-[10px] font-black px-3 py-0.5 rounded-full">
          بعد قِمّة ✨
        </div>
      )}
      {!isAfter && (
        <div className="absolute -top-3 right-4 bg-gray-400 text-white text-[10px] font-black px-3 py-0.5 rounded-full">
          قبل قِمّة
        </div>
      )}

      {/* LI-style cover */}
      <div className={`h-12 rounded-xl mb-0 -mx-5 -mt-5 ${isAfter ? 'bg-gradient-to-l from-[#006C35] to-[#00A651]' : 'bg-gray-100'}`} />

      {/* Avatar */}
      <div className="flex items-end gap-3 -mt-6 mb-3">
        <div className={`w-14 h-14 rounded-full border-[3px] ${isAfter ? 'border-white bg-[#006C35]' : 'border-white bg-gray-200'} flex items-center justify-center text-xl font-black ${isAfter ? 'text-white' : 'text-gray-400'} shadow-sm`}>
          م
        </div>
        {isAfter && (
          <span className="mb-1 text-[9px] font-black px-2 py-0.5 bg-[#006C35]/10 border border-[#006C35]/25 text-[#006C35] rounded-full">
            {data.badge}
          </span>
        )}
      </div>

      {/* Info */}
      <p className="font-black text-gray-900 text-sm leading-tight mb-0.5">{data.name}</p>
      <p className={`text-[11px] leading-tight mb-3 ${isAfter ? 'text-gray-600 font-semibold' : 'text-gray-400'}`}>{data.title}</p>

      {/* Stats */}
      <div className={`grid grid-cols-3 gap-1 p-2.5 rounded-xl ${isAfter ? 'bg-[#006C35]/5 border border-[#006C35]/10' : 'bg-gray-50'}`}>
        <div className="text-center">
          <p className={`text-xs font-black ${isAfter ? 'text-[#006C35]' : 'text-gray-500'}`}>{data.connections}</p>
          <p className="text-[9px] text-gray-400">اتصال</p>
        </div>
        <div className="text-center border-x border-gray-100">
          <p className={`text-xs font-black ${isAfter ? 'text-[#006C35]' : 'text-gray-500'}`}>{data.views}</p>
          <p className="text-[9px] text-gray-400">مشاهدة</p>
        </div>
        <div className="text-center">
          <p className={`text-xs font-black ${isAfter ? 'text-[#006C35]' : 'text-gray-500'}`}>{data.appearance}</p>
          <p className="text-[9px] text-gray-400">ظهور</p>
        </div>
      </div>

      {/* LI action (after only) */}
      {isAfter && (
        <div className="mt-3 flex gap-1.5">
          <div className="flex-1 h-7 rounded-full bg-[#006C35] flex items-center justify-center">
            <span className="text-white text-[10px] font-black">تواصل</span>
          </div>
          <div className="flex-1 h-7 rounded-full border border-[#006C35] flex items-center justify-center">
            <span className="text-[#006C35] text-[10px] font-black">رسالة</span>
          </div>
        </div>
      )}
    </div>
  );
}

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

      {/* ── LinkedIn Before / After ──────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full mb-5">
            {/* LinkedIn "in" logo */}
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#0077B5]">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            <span className="text-xs font-bold text-blue-700">LinkedIn — قبل وبعد قِمّة</span>
          </div>

          <h2 className="arabic-heading text-3xl sm:text-4xl lg:text-5xl text-gray-900 mb-4">
            ملفك على LinkedIn{' '}
            <span className="text-gradient-saudi">يتكلّم عنك</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
            نُحوِّل ملفك من مجرد سيرة ذاتية رقمية إلى مغناطيس يجذب مسؤولي التوظيف في السعودية تلقائياً.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Cards comparison */}
          <motion.div
            className="flex items-center justify-center gap-4 sm:gap-8"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <LinkedInCard data={LINKEDIN_BEFORE} label="قبل" isAfter={false} />

            {/* Arrow */}
            <div className="flex flex-col items-center gap-1 flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-[#006C35]/10 flex items-center justify-center">
                <span className="text-[#006C35] text-lg font-black">←</span>
              </div>
              <span className="text-[10px] text-gray-400 font-bold whitespace-nowrap">٨ ساعات</span>
            </div>

            <LinkedInCard data={LINKEDIN_AFTER} label="بعد" isAfter={true} />
          </motion.div>

          {/* Stats list */}
          <motion.div
            className="space-y-5"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.1 }}
          >
            <h3 className="text-2xl font-black text-gray-900 text-right mb-6">
              ما الذي يتغيّر بعد تحسين LinkedIn؟
            </h3>

            {[
              { icon: Eye,       color: 'bg-blue-50 text-blue-600',   stat: '١٠٠×',   label: 'زيادة في مشاهدات ملفك' },
              { icon: Users,     color: 'bg-[#006C35]/10 text-[#006C35]', stat: '٥٠٠+', label: 'اتصالات مع مسؤولي التوظيف' },
              { icon: TrendingUp,color: 'bg-amber-50 text-amber-600',  stat: '٣٠+',   label: 'طلب تواصل أسبوعياً من شركات كبرى' },
              { icon: Award,     color: 'bg-purple-50 text-purple-600',stat: '#١',    label: 'ظهور في نتائج البحث لمسؤولي التوظيف' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 bg-white hover:shadow-md transition-shadow duration-200">
                <div className="text-right flex-1">
                  <p className="text-sm text-gray-600 font-bold">{item.label}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-[#006C35] tabular-nums">{item.stat}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${item.color}`}>
                  <item.icon size={18} />
                </div>
              </div>
            ))}

            {/* Vision 2030 note */}
            <div className="flex items-center gap-3 p-4 bg-gradient-to-l from-[#006C35]/5 to-transparent border border-[#006C35]/15 rounded-2xl mt-4">
              <span className="text-3xl">🇸🇦</span>
              <div className="text-right">
                <p className="text-sm font-black text-[#006C35]">متوافق مع رؤية ٢٠٣٠</p>
                <p className="text-xs text-gray-500 leading-relaxed">
                  ندعم توطين الوظائف ونساعد الكفاءات السعودية على الوصول لأفضل الفرص
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
