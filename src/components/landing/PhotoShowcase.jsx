import { useState } from 'react';
import { Camera, Star, ArrowLeft, ArrowRight } from 'lucide-react';

const PAIRS = [
  {
    before: '/IMG_2470.JPG',
    after:  '/7B792D5E-3730-468B-8DB3-4449AF574B4D.PNG',
    result: 'صورة احترافية للـ LinkedIn',
  },
  {
    before: '/IMG_2465.JPG',
    after:  '/9F677A53-0C27-402E-BE54-3B6B7F26C6E9.PNG',
    result: 'صورة احترافية للـ CV',
  },
  {
    before: '/IMG_2467.JPG',
    after:  '/779E47C6-4708-4A2F-86A3-7947037DFB25.PNG',
    result: 'صورة احترافية للـ LinkedIn',
  },
  {
    before: '/IMG_2469.JPG',
    after:  '/99C0FD2C-B481-42CB-BBDA-08BC8BED932E.PNG',
    result: 'صورة احترافية للـ CV',
  },
];

function Placeholder({ label, isAfter }) {
  return (
    <div className={`absolute inset-0 flex flex-col items-center justify-center gap-3 ${
      isAfter
        ? 'bg-gradient-to-b from-[#006C35]/10 to-[#006C35]/5'
        : 'bg-gradient-to-b from-gray-200 to-gray-100'
    }`}>
      <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
        isAfter ? 'bg-[#006C35]/15' : 'bg-gray-300/50'
      }`}>
        <Camera size={28} className={isAfter ? 'text-[#006C35]' : 'text-gray-400'} />
      </div>
      <p className={`text-xs font-bold ${isAfter ? 'text-[#006C35]' : 'text-gray-400'}`}>{label}</p>
    </div>
  );
}

function BeforeAfterCard({ pair }) {
  const [showAfter, setShowAfter] = useState(false);
  const [beforeLoaded, setBeforeLoaded] = useState(false);
  const [afterLoaded, setAfterLoaded]   = useState(false);

  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-md hover:shadow-xl transition-shadow duration-300">
      {/* Image area */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
        {/* Before */}
        {!beforeLoaded && !showAfter && <Placeholder label="صورة العميل قبل التعديل" isAfter={false} />}
        <img
          src={pair.before}
          alt="قبل"
          onLoad={() => setBeforeLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-500 ${showAfter ? 'opacity-0' : beforeLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
        {/* After */}
        {!afterLoaded && showAfter && <Placeholder label="الصورة الاحترافية النهائية" isAfter={true} />}
        <img
          src={pair.after}
          alt="بعد"
          onLoad={() => setAfterLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-500 ${showAfter ? afterLoaded ? 'opacity-100' : 'opacity-0' : 'opacity-0'}`}
        />

        {/* Label badge */}
        <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-black shadow-sm transition-all duration-300 ${
          showAfter
            ? 'bg-[#006C35] text-white'
            : 'bg-gray-800/70 text-white backdrop-blur-sm'
        }`}>
          {showAfter ? '✨ بعد' : '📸 قبل'}
        </div>
      </div>

      {/* Toggle buttons */}
      <div className="p-4">
        <p className="text-xs text-gray-500 text-center mb-3 font-bold">{pair.result}</p>
        <div className="flex rounded-xl overflow-hidden border border-gray-200">
          <button
            onClick={() => setShowAfter(false)}
            className={`flex-1 py-2.5 text-sm font-black transition-all ${
              !showAfter ? 'bg-gray-800 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'
            }`}
          >
            قبل
          </button>
          <button
            onClick={() => setShowAfter(true)}
            className={`flex-1 py-2.5 text-sm font-black transition-all ${
              showAfter ? 'bg-[#006C35] text-white' : 'bg-white text-gray-500 hover:bg-gray-50'
            }`}
          >
            بعد ✨
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PhotoShowcase() {
  return (
    <section className="py-24 bg-white relative overflow-hidden" id="photo-showcase" dir="rtl">
      {/* Subtle background */}
      <div className="absolute inset-0 saudi-geo-pattern opacity-[0.03] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-l from-transparent via-[#006C35]/20 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#006C35]/8 border border-[#006C35]/20 rounded-full mb-6">
            <Camera size={13} className="text-[#006C35]" />
            <span className="text-xs font-black text-[#006C35]">خدمة الصورة الاحترافية</span>
          </div>
          <h2 className="arabic-heading text-3xl sm:text-4xl lg:text-5xl text-gray-900 mb-5">
            صورتك الشخصية —{' '}
            <span className="text-gradient-green">أول انطباع يصنع الفرق</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
            نأخذ صورتك العادية ونحوّلها إلى صورة احترافية تليق بـ LinkedIn وسيرتك الذاتية.
            فقط أرسل صورتك على واتساب.
          </p>
        </div>

        {/* Before / After Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-5xl mx-auto mb-14">
          {PAIRS.map((pair, i) => (
            <BeforeAfterCard key={i} pair={pair} />
          ))}
        </div>

        {/* Stats row */}
        <div className="flex flex-wrap justify-center gap-8 mb-14">
          {[
            { num: '+٢٠٠', label: 'صورة محترفة سُلّمت' },
            { num: '٨ ساعات', label: 'وقت التسليم' },
            { num: '١٠٠٪', label: 'رضا العملاء' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-black text-[#006C35] mb-1">{s.num}</p>
              <p className="text-sm text-gray-500 font-bold">{s.label}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="inline-flex flex-col items-center gap-4 p-8 bg-gray-950 rounded-3xl border border-white/8">
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map((s) => (
                <Star key={s} size={16} className="fill-[#C8A951] text-[#C8A951]" />
              ))}
            </div>
            <p className="text-white font-black text-lg">احصل على صورة احترافية ضمن الباقة الكاملة</p>
            <p className="text-gray-400 text-sm">مشمولة مع ٥ خدمات أخرى — دفع مرة واحدة فقط</p>
            <a
              href="#pricing"
              className="flex items-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-black text-white transition-all hover:scale-[1.03]"
              style={{ background: 'linear-gradient(135deg,#006C35,#00A651)', boxShadow: '0 8px 24px rgba(0,108,53,0.4)' }}
            >
              اشترِ الباقة الكاملة — ١٩٩ ر.س
              <ArrowLeft size={16} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
