import { XCircle } from 'lucide-react';

const problems = [
  {
    emoji: '📄',
    title: 'سيرة ذاتية لا تتجاوز أنظمة ATS',
    description: 'أكثر من ٧٥٪ من سير الخريجين السعوديين تُرفض تلقائياً بواسطة أنظمة ATS قبل أن تصل لأي مسؤول توظيف.',
    stat: '٧٥٪',
    statLabel: 'نسبة الرفض التلقائي',
  },
  {
    emoji: '🔇',
    title: 'لا ردود رغم عشرات الطلبات',
    description: 'معظم الباحثين عن عمل يرسلون عشرات الطلبات يدوياً دون أي رد. الوقت والجهد يضيعان بدون نتيجة.',
    stat: '+٢٠٠',
    statLabel: 'طلب يدوي بدون استجابة',
  },
  {
    emoji: '🌐',
    title: 'غياب الهوية المهنية الرقمية',
    description: 'بدون موقع شخصي أو محفظة أعمال رقمية، أنت غير موجود أمام الشركات التي تبحث عن مواهب متميزة.',
    stat: '٩٠٪',
    statLabel: 'لا يمتلكون موقعاً شخصياً',
  },
  {
    emoji: '📤',
    title: 'التقديم العشوائي على وظائف غير مناسبة',
    description: 'بدون استهداف دقيق، تضيع شهوراً على وظائف لا تناسب مهاراتك أو خبرتك. التقديم الصحيح يُوفّر وقتك.',
    stat: '٤٠ ساعة',
    statLabel: 'أسبوعياً هدر بلا نتيجة',
  },
  {
    emoji: '📊',
    title: 'لا تتابع ردود الشركات بشكل منظم',
    description: 'بدون نظام متابعة واضح، تفوّتك فرص المقابلات وردود الشركات لأنك لا تعرف من ردّ ومن لم يرد.',
    stat: '٦٠٪',
    statLabel: 'يفوّتون فرص بسبب عدم المتابعة',
  },
  {
    emoji: '💬',
    title: 'رسائل التعريف الضعيفة لا تُفتح',
    description: 'رسالة تعريفية ركيكة أو عامة تُحذف فوراً. الرسالة الاحترافية المخصصة تفتح الأبواب قبل أي وظيفة رسمية.',
    stat: '٨٥٪',
    statLabel: 'رسائل لا تصل لمسؤول التوظيف',
  },
];

export default function Problem() {
  return (
    <section className="py-24 bg-gray-950 relative overflow-hidden" id="problem" dir="rtl">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-l from-transparent via-[#006C35]/30 to-transparent" />
      <div className="absolute inset-0 saudi-pattern-dark opacity-[0.04] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-500/3 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full mb-6">
            <XCircle size={14} className="text-red-400" />
            <span className="text-xs font-bold text-red-400">التحديات الحقيقية للباحث عن عمل في السعودية</span>
          </div>
          <h2 className="arabic-heading text-3xl sm:text-4xl lg:text-5xl text-white mb-5">
            البحث عن عمل{' '}
            <span className="text-red-400">بدون أدوات صحيحة</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            المواهب السعودية لا تنقصها الكفاءة — تنقصها الأدوات الصحيحة والتنفيذ الاحترافي.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {problems.map((problem, index) => (
            <div
              key={index}
              className="group relative p-6 rounded-2xl border border-gray-800 bg-gray-900/40 hover:border-red-500/25 hover:bg-gray-900/70 transition-all duration-300 cursor-default"
            >
              <div className="text-3xl mb-4">{problem.emoji}</div>
              <h3 className="text-white font-bold text-base mb-2 leading-snug">{problem.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-5">{problem.description}</p>
              <div className="flex items-baseline gap-2 pt-4 border-t border-gray-800/80">
                <span className="text-2xl font-black text-red-400 stat-number">{problem.stat}</span>
                <span className="text-xs text-gray-500">{problem.statLabel}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-4">
            <div className="h-px w-20 bg-gradient-to-l from-[#006C35] to-transparent" />
            <span className="text-[#00A651] font-bold text-lg">قِمّة تحلّ هذه المشكلات كلها</span>
            <div className="h-px w-20 bg-gradient-to-r from-[#006C35] to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
