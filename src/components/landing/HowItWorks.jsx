import { UserPlus, FileText, Globe, Send, MessageSquare } from 'lucide-react';

const steps = [
  {
    step: '٠١',
    icon: UserPlus,
    title: 'سجّل وأخبرنا عنك',
    description: 'سجّل حسابك في دقيقتين. أخبرنا عن تخصصك وخبرتك وأهدافك المهنية — نبني عليها كل الخدمات.',
    color: '#006C35',
    features: ['إعداد الملف الشخصي', 'تحديد المجال والأهداف', 'رفع بيانات الخبرة'],
  },
  {
    step: '٠٢',
    icon: FileText,
    title: 'نُجهِّز سيرتك وموقعك',
    description: 'نبني سيرة ذاتية ATS محسّنة وموقعاً شخصياً احترافياً جاهزاً للمشاركة مع أصحاب العمل.',
    color: '#1A56DB',
    features: ['سيرة ذاتية ATS', 'موقع شخصي مخصص', 'صياغة احترافية'],
  },
  {
    step: '٠٣',
    icon: Send,
    title: 'نُرسل البرودكاست',
    description: 'نُعدّ رسالة تعريفية مخصصة ونُرسلها بأسلوب احترافي لشركات مستهدفة تناسب مجالك وتطلعاتك.',
    color: '#C8A951',
    features: ['رسالة مخصصة', 'شركات مستهدفة', 'أسلوب احترافي'],
  },
  {
    step: '٠٤',
    icon: Globe,
    title: 'نُقدِّم على ١٠٠+ شركة',
    description: 'نتقدم عنك على ١٠٠ شركة سعودية أو أكثر، مع عرض حالة كل تقديم وتحديثات مستمرة.',
    color: '#7C3AED',
    features: ['١٠٠+ شركة', 'تتبع كل تقديم', 'تحديثات مستمرة'],
  },
  {
    step: '٠٥',
    icon: MessageSquare,
    title: 'تتابع الردود والمقابلات',
    description: 'نُبلّغك بكل رد — شركة ردّت، طلبت مقابلة، أو رفضت. لوحة واضحة لكل حالة.',
    color: '#E11D48',
    features: ['إشعارات الردود', 'مواعيد المقابلات', 'سجل كامل'],
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 bg-gray-50 relative overflow-hidden" id="how-it-works" dir="rtl">
      <div className="absolute inset-0 saudi-geo-pattern opacity-20 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full mb-6 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#006C35]" />
            <span className="text-xs font-bold text-gray-600">كيف نعمل لك</span>
          </div>
          <h2 className="arabic-heading text-3xl sm:text-4xl lg:text-5xl text-gray-900 mb-5">
            من التسجيل إلى{' '}
            <span className="text-gradient-green">المقابلة في ٥ خطوات</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
            نحن ننفّذ — أنت تنتظر النتائج. عملية واضحة ومنظمة من البداية حتى الحصول على المقابلات.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line desktop */}
          <div className="hidden lg:block absolute top-12 right-[10%] left-[10%] h-px bg-gradient-to-l from-[#E11D48] via-[#7C3AED] via-[#C8A951] via-[#1A56DB] to-[#006C35] opacity-20" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {steps.map((step, index) => (
              <div key={index} className="relative flex flex-col items-center text-center group">
                <div
                  className="relative w-20 h-20 rounded-2xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-105 transition-transform duration-300"
                  style={{ backgroundColor: step.color }}
                >
                  <step.icon size={26} className="text-white" />
                  <div
                    className="absolute -top-2.5 -left-2.5 w-7 h-7 rounded-full bg-white border-2 flex items-center justify-center text-xs font-black"
                    style={{ color: step.color, borderColor: step.color }}
                  >
                    {index + 1}
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm w-full hover:shadow-md transition-shadow duration-300">
                  <p className="text-[10px] font-black tracking-widest mb-1" style={{ color: step.color }}>
                    الخطوة {step.step}
                  </p>
                  <h3 className="font-black text-gray-900 text-sm mb-2 leading-snug">{step.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed mb-3">{step.description}</p>
                  <div className="flex flex-col gap-1">
                    {step.features.map((f) => (
                      <div key={f} className="flex items-center gap-2 text-xs text-gray-400 justify-center">
                        <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: step.color }} />
                        {f}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Guarantee */}
        <div className="mt-16 p-8 rounded-3xl bg-white border border-gray-100 shadow-sm text-center">
          <p className="text-2xl font-black text-gray-900 mb-2">🚀 نتائج خلال ٧٢ ساعة</p>
          <p className="text-gray-500 text-sm max-w-xl mx-auto">
            بعد تفعيل الخدمة، تحصل على سيرتك وموقعك جاهزَين خلال ٧٢ ساعة — وتبدأ التقديمات فوراً.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {['الرياض','جدة','الظهران','نيوم','الدمام','مكة المكرمة','المدينة المنورة','تبوك','الخبر','أبها'].map((city) => (
              <span key={city} className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full text-xs text-gray-600">
                {city}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
