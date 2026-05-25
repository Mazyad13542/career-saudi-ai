import { UserPlus, Brain, Target, Rocket } from 'lucide-react';

const steps = [
  {
    step: '٠١',
    icon: UserPlus,
    title: 'أنشئ ملفك المهني',
    description: 'سجّل في دقيقتين. ارفع سيرتك الذاتية أو ابنها من الصفر. حدد أهدافك وقطاعاتك المستهدفة.',
    color: '#006C35',
    features: ['إعداد الملف الشخصي', 'تحديد الأهداف المهنية', 'خريطة المهارات'],
  },
  {
    step: '٠٢',
    icon: Brain,
    title: 'تحليل ذكي وتحسين مستمر',
    description: 'يقيّم النظام سيرتك، يحدد الثغرات، يحسب درجتك المهنية، ويقدم توصيات دقيقة لتحسين ملفك.',
    color: '#1A56DB',
    features: ['تقييم ATS', 'ثغرات الكلمات المفتاحية', 'تحسين السيرة الذاتية'],
  },
  {
    step: '٠٣',
    icon: Target,
    title: 'طابق وتحضّر',
    description: 'احصل على قائمة وظائف مطابقة لملفك. تدرب على مقابلات تجريبية صوتية، حسّن مستوى لغتك، وتتبع جاهزيتك.',
    color: '#C8A951',
    features: ['نظام مطابقة الوظائف', 'مقابلات تجريبية صوتية', 'تدريب لغوي'],
  },
  {
    step: '٠٤',
    icon: Rocket,
    title: 'احصل على وظيفتك',
    description: 'قدّم بثقة. ملفك المحسّن يظهر لمسؤولي التوظيف. تتبع كل طلب، استقبل ردود الشركات، وحقق أهدافك المهنية.',
    color: '#7C3AED',
    features: ['ظهور أمام HR', 'تتبع الطلبات', 'نمو مهني مستمر'],
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 bg-gray-50 relative overflow-hidden" id="how-it-works">
      <div className="absolute inset-0 saudi-geo-pattern opacity-20 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full mb-6 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#006C35]" />
            <span className="text-xs font-bold text-gray-600">كيف تعمل المنصة</span>
          </div>
          <h2 className="arabic-heading text-3xl sm:text-4xl lg:text-5xl text-gray-900 mb-5">
            من الصفر إلى{' '}
            <span className="text-gradient-green">الوظيفة في ٤ خطوات</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
            رحلة واضحة ومنظمة من إنشاء ملفك المهني حتى استلام عروض العمل.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line */}
          <div className="hidden lg:block absolute top-12 right-[12.5%] left-[12.5%] h-px bg-gradient-to-l from-[#006C35] via-[#C8A951] to-[#7C3AED] opacity-20" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative flex flex-col items-center text-center group">
                {/* Step Circle */}
                <div
                  className="relative w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-105 transition-transform duration-300"
                  style={{ backgroundColor: step.color }}
                >
                  <step.icon size={28} className="text-white" />
                  <div
                    className="absolute -top-2.5 -left-2.5 w-7 h-7 rounded-full bg-white border-2 flex items-center justify-center text-xs font-black"
                    style={{ color: step.color, borderColor: step.color }}
                  >
                    {index + 1}
                  </div>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm w-full hover:shadow-md transition-shadow duration-300">
                  <p className="text-xs font-black tracking-widest mb-1" style={{ color: step.color }}>
                    الخطوة {step.step}
                  </p>
                  <h3 className="font-black text-gray-900 text-base mb-3 leading-snug">{step.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4">{step.description}</p>
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

        {/* Saudi cities */}
        <div className="mt-16 p-8 rounded-3xl bg-white border border-gray-100 shadow-sm text-center">
          <p className="text-sm text-gray-400 mb-4">متاح في جميع أنحاء المملكة العربية السعودية</p>
          <div className="flex flex-wrap justify-center gap-2">
            {['الرياض','جدة','الظهران','نيوم','الدمام','مكة المكرمة','المدينة المنورة','تبوك','الخبر','ينبع'].map((city) => (
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
