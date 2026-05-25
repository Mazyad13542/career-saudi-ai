import { FileText, Mic, Briefcase, Globe, LayoutDashboard, ClipboardList, TrendingUp, Lock, Star } from 'lucide-react';

const features = [
  {
    icon: FileText,
    titleAr: 'بناء السيرة الذاتية',
    description: 'أنشئ سيرة ذاتية احترافية محسّنة لأنظمة ATS في دقائق. احصل على تحليل متقدم للكلمات المفتاحية وتوصيات مخصصة.',
    color: 'green',
    isPaid: false,
    highlight: ['درجة ATS', 'تحليل الكلمات', 'تحميل PDF'],
  },
  {
    icon: Mic,
    titleAr: 'المقابلة التجريبية',
    description: 'تدرّب على مقابلات حقيقية بالصوت. احصل على تقييم مفصّل لمستوى لغتك وثقتك وأدائك التواصلي.',
    color: 'blue',
    isPaid: true,
    highlight: ['مستوى اللغة', 'تقييم الصوت', 'تغذية راجعة فورية'],
  },
  {
    icon: TrendingUp,
    titleAr: 'مطابقة دقيقة للوظائف',
    description: 'يحلل النظام ملفك ويطابقك مع أفضل الفرص في المملكة. اعرف لماذا أنت مناسب وما الذي يجب تطويره.',
    color: 'purple',
    isPaid: true,
    highlight: ['نسبة التطابق', 'الفجوات المهارية', 'مخصص لك'],
  },
  {
    icon: Star,
    titleAr: 'تحسين متقدم للملف',
    description: 'احصل على توصيات ذكية لتحسين ملفك المهني وزيادة درجة الجاهزية وفرص الحصول على المقابلات.',
    color: 'gold',
    isPaid: true,
    highlight: ['توصيات مخصصة', 'درجة الجاهزية', 'خطة تطوير'],
  },
  {
    icon: Globe,
    titleAr: 'الموقع الشخصي المهني',
    description: 'أنشئ موقعاً شخصياً احترافياً يعرض مشاريعك ومهاراتك وخبراتك. شاركه مع أصحاب العمل مباشرة.',
    color: 'green',
    isPaid: true,
    highlight: ['رابط مخصص', 'نطاق خاص', 'تصميم متجاوب'],
  },
  {
    icon: LayoutDashboard,
    titleAr: 'لوحة المسيرة المهنية',
    description: 'تتبع درجتك المهنية ونقاط ATS ومستوى اللغة وتطورك في لوحة تحكم متكاملة وأنيقة.',
    color: 'blue',
    isPaid: false,
    highlight: ['الدرجة المهنية', 'التحليلات', 'تتبع التقدم'],
  },
  {
    icon: ClipboardList,
    titleAr: 'متابعة التقديمات',
    description: 'لا تفقد أي طلب. تابع حالة كل تقديم من المراجعة إلى المقابلة إلى العرض في واجهة منظمة.',
    color: 'purple',
    isPaid: true,
    highlight: ['تحديثات الحالة', 'ردود الشركات', 'جدول زمني'],
  },
  {
    icon: Briefcase,
    titleAr: 'وظائف سعودية حديثة',
    description: 'استعرض آلاف الوظائف السعودية الموثقة من LinkedIn وبيت وجدارة وطاقة وصفحات الشركات الكبرى.',
    color: 'gold',
    isPaid: false,
    highlight: ['+١٠ مصادر', 'تحديث يومي', 'فلترة متقدمة'],
  },
];

const colorMap = {
  green:  { icon: 'bg-[#006C35]/10 text-[#006C35]',  border: 'hover:border-[#006C35]/20', badge: 'bg-[#006C35]/8 text-[#006C35]'  },
  blue:   { icon: 'bg-blue-50 text-blue-600',          border: 'hover:border-blue-200',    badge: 'bg-blue-50 text-blue-600'       },
  purple: { icon: 'bg-purple-50 text-purple-600',      border: 'hover:border-purple-200',  badge: 'bg-purple-50 text-purple-600'   },
  gold:   { icon: 'bg-amber-50 text-amber-600',        border: 'hover:border-amber-200',   badge: 'bg-amber-50 text-amber-600'     },
};

export default function Features() {
  return (
    <section className="py-24 bg-white" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#006C35]/8 border border-[#006C35]/15 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#006C35]" />
            <span className="text-xs font-bold text-[#006C35]">مميزات المنصة</span>
          </div>
          <h2 className="arabic-heading text-3xl sm:text-4xl lg:text-5xl text-gray-900 mb-5">
            كل ما تحتاجه{' '}
            <span className="text-gradient-saudi">لوظيفة أحلامك</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
            منظومة متكاملة من الأدوات الاحترافية مصممة خصيصاً لسوق العمل السعودي ورؤية 2030.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feature, index) => {
            const c = colorMap[feature.color];
            return (
              <div
                key={index}
                className={`group relative p-5 rounded-2xl border border-gray-100 bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${c.border}`}
              >
                {feature.isPaid && (
                  <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-0.5 bg-amber-50 border border-amber-200 rounded-full">
                    <Lock size={9} className="text-amber-500" />
                    <span className="text-[9px] font-black text-amber-600">احترافي</span>
                  </div>
                )}

                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${c.icon} group-hover:scale-110 transition-transform duration-200`}>
                  <feature.icon size={20} />
                </div>

                <h3 className="font-bold text-gray-900 mb-2 text-sm leading-snug">{feature.titleAr}</h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-4">{feature.description}</p>

                <div className="flex flex-wrap gap-1.5">
                  {feature.highlight.map((h) => (
                    <span key={h} className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${c.badge}`}>
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
