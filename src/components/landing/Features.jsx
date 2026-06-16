import { FileText, Globe, Building2, MessageSquare, Camera, Link2, User2 } from 'lucide-react';

const SERVICES = [
  {
    id: 1,
    icon: Link2,
    titleAr: 'تنظيم صفحة LinkedIn',
    description: 'ننظّم ونحسّن صفحتك على LinkedIn بمحتوى احترافي — العنوان، الـ Bio، الخبرات — حتى يجدك مسؤولو التوظيف.',
    color: 'blue',
    badges: ['عنوان احترافي', 'Bio جذّاب', 'كلمات مفتاحية'],
  },
  {
    id: 2,
    icon: Globe,
    titleAr: 'موقع شخصي رسمي',
    description: 'نصنع لك موقعاً شخصياً احترافياً يضم شهاداتك، خبراتك، وأعمالك — رابط واحد تحطه في LinkedIn وكل تقديم.',
    color: 'purple',
    badges: ['شهادات وخبرات', 'أعمال ومشاريع', 'رابط خاص بك'],
  },
  {
    id: 3,
    icon: User2,
    titleAr: 'تنقيح الصورة الشخصية',
    description: 'أرسل لنا صورتك الشخصية ونحن نُنقّحها ونحوّلها لصورة مهنية احترافية تليق بـ LinkedIn وملفك المهني.',
    color: 'rose',
    badges: ['أرسل صورتك', 'تنقيح احترافي', 'جاهزة لـ LinkedIn'],
  },
  {
    id: 4,
    icon: FileText,
    titleAr: 'سيرة ذاتية CV',
    description: 'نصمم ونُنشئ لك سيرة ذاتية احترافية بتنسيق مميز يتجاوز فلاتر ATS ويلفت انتباه مسؤولي التوظيف.',
    color: 'green',
    badges: ['تصميم احترافي', 'ATS Optimized', 'صياغة مميزة'],
    highlight: true,
  },
  {
    id: 5,
    icon: MessageSquare,
    titleAr: 'رسالة تقديم احترافية',
    description: 'نصمم لك رسالة تقديم احترافية مخصصة لك تُقدِّم بها على الشركات — تعكس شخصيتك ومهاراتك بأسلوب مقنع.',
    color: 'amber',
    badges: ['مخصصة لك', 'أسلوب مقنع', 'عربية وإنجليزية'],
  },
  {
    id: 6,
    icon: Building2,
    titleAr: 'التقديم على ٢٠٠ شركة',
    description: 'نتقدم عنك على ٢٠٠ شركة سعودية بأسلوب احترافي — أنت تنتظر، ونحن ننفّذ.',
    color: 'gold',
    badges: ['٢٠٠ شركة سعودية', 'تقديم احترافي', 'إرسال فوري'],
  },
];

const COLOR = {
  green:  { icon: 'bg-[#006C35]/10 text-[#006C35]',  border: 'border-[#006C35]/20', badge: 'bg-[#006C35]/8 text-[#006C35]',   ring: 'ring-[#006C35]/30' },
  blue:   { icon: 'bg-blue-50 text-blue-600',          border: 'border-blue-200',     badge: 'bg-blue-50 text-blue-600',         ring: 'ring-blue-300'    },
  purple: { icon: 'bg-purple-50 text-purple-600',      border: 'border-purple-200',   badge: 'bg-purple-50 text-purple-600',     ring: 'ring-purple-300'  },
  gold:   { icon: 'bg-amber-50 text-amber-600',        border: 'border-amber-200',    badge: 'bg-amber-50 text-amber-600',       ring: 'ring-amber-300'   },
  rose:   { icon: 'bg-rose-50 text-rose-600',          border: 'border-rose-200',     badge: 'bg-rose-50 text-rose-600',         ring: 'ring-rose-300'    },
  amber:  { icon: 'bg-amber-50 text-amber-600',        border: 'border-amber-200',    badge: 'bg-amber-50 text-amber-600',       ring: 'ring-amber-300'   },
};

export default function Features() {
  return (
    <section className="py-24 bg-white" id="features" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#006C35]/8 border border-[#006C35]/15 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#006C35]" />
            <span className="text-xs font-bold text-[#006C35]">خدماتنا الست</span>
          </div>
          <h2 className="arabic-heading text-3xl sm:text-4xl lg:text-5xl text-gray-900 mb-5">
            نجهِّز لك كل شيء{' '}
            <span className="text-gradient-saudi">خطوة بخطوة</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
            ست خدمات تنفيذية — نكتب لك، نبني لك، ونقدِّم عنك. أنت تركّز على تطوير نفسك، ونحن ننفِّذ.
          </p>
        </div>

        {/* Services grid — two rows of 3 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-5">
          {SERVICES.slice(0, 3).map((svc) => {
            const c = COLOR[svc.color];
            return <ServiceCard key={svc.id} svc={svc} c={c} />;
          })}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.slice(3).map((svc) => {
            const c = COLOR[svc.color];
            return <ServiceCard key={svc.id} svc={svc} c={c} />;
          })}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ svc, c }) {
  return (
    <div className={`group relative p-6 rounded-2xl border-2 bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${svc.highlight ? `${c.border} ring-2 ${c.ring}` : 'border-gray-100 hover:border-gray-200'}`}>
      {svc.highlight && (
        <div className="absolute -top-3 right-5 px-3 py-1 bg-[#006C35] text-white text-[10px] font-black rounded-full shadow-sm">
          ⭐ الأكثر طلباً
        </div>
      )}

      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${c.icon} group-hover:scale-110 transition-transform duration-200`}>
        <svc.icon size={22} />
      </div>

      <div className="flex items-center gap-2 mb-1">
        <span className="text-xs text-gray-400 font-bold">٠{svc.id}</span>
        <h3 className="font-black text-gray-900 text-base">{svc.titleAr}</h3>
      </div>

      <p className="text-sm text-gray-500 leading-relaxed mb-4">{svc.description}</p>

      <div className="flex flex-wrap gap-1.5">
        {svc.badges.map((b) => (
          <span key={b} className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${c.badge}`}>
            {b}
          </span>
        ))}
      </div>
    </div>
  );
}
