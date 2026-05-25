import { XCircle, ArrowLeft } from 'lucide-react';

const problems = [
  {
    emoji: '📄',
    title: 'سير ذاتية ضعيفة ترفضها الأنظمة',
    description: 'أكثر من ٧٥٪ من سير الخريجين السعوديين يتم رفضها تلقائياً بواسطة أنظمة ATS قبل أن تصل لأي مسؤول توظيف.',
    stat: '٧٥٪',
    statLabel: 'نسبة الرفض التلقائي',
  },
  {
    emoji: '🔇',
    title: 'لا ردود من الشركات',
    description: 'معظم المتقدمين يرسلون عشرات الطلبات دون أي رد. التنسيق الضعيف وعدم مطابقة الكلمات المفتاحية السبب الرئيسي.',
    stat: '+٢٠٠',
    statLabel: 'طلب متوسطي دون نتيجة',
  },
  {
    emoji: '📉',
    title: 'ملفات LinkedIn فارغة المحتوى',
    description: 'ملف LinkedIn الضعيف يجعلك غير مرئي للمسؤولين. ٨٠٪ من الخريجين لا يعلمون كيف يُحسّنون ظهورهم في نتائج البحث.',
    stat: '٨٠٪',
    statLabel: 'لديهم ملفات شخصية ضعيفة',
  },
  {
    emoji: '🗣️',
    title: 'القلق من المقابلات وضعف اللغة',
    description: 'حتى المرشحون المؤهلون يفشلون في المقابلات بسبب عدم التحضير الكافي وضعف الثقة باللغة الإنجليزية.',
    stat: '٦٠٪',
    statLabel: 'يفشلون بسبب عدم التحضير',
  },
  {
    emoji: '🏷️',
    title: 'غياب الهوية المهنية الرقمية',
    description: 'بدون موقع شخصي أو محفظة أعمال رقمية أنت غير موجود في نظر الشركات الكبرى التي تبحث عن مواهب متميزة.',
    stat: '٩٠٪',
    statLabel: 'لا يمتلكون محفظة مهنية',
  },
  {
    emoji: '🎯',
    title: 'التقديم على وظائف غير مناسبة',
    description: 'بدون مطابقة ذكية تضيع شهوراً في التقديم على وظائف لا تتوافق مع مهاراتك أو طموحاتك المهنية.',
    stat: '٤٠ ساعة',
    statLabel: 'أسبوعياً على طلبات خاطئة',
  },
];

export default function Problem() {
  return (
    <section className="py-24 bg-gray-950 relative overflow-hidden" id="problem">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-l from-transparent via-[#006C35]/30 to-transparent" />
      <div className="absolute inset-0 saudi-pattern-dark opacity-[0.04] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-500/3 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full mb-6">
            <XCircle size={14} className="text-red-400" />
            <span className="text-xs font-bold text-red-400">واقع سوق العمل السعودي للخريجين</span>
          </div>
          <h2 className="arabic-heading text-3xl sm:text-4xl lg:text-5xl text-white mb-5">
            سوق العمل السعودي{' '}
            <span className="text-red-400">يحتاج إلى تغيير</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            المواهب السعودية تُهدر — ليس بسبب نقص في الكفاءة، بل بسبب غياب الأدوات الصحيحة.
          </p>
        </div>

        {/* Problem Cards */}
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
              <div className="absolute inset-0 rounded-2xl bg-red-500/0 group-hover:bg-red-500/[0.02] transition-colors duration-300" />
            </div>
          ))}
        </div>

        {/* Bridge to solution */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-4">
            <div className="h-px w-20 bg-gradient-to-l from-[#006C35] to-transparent" />
            <span className="text-[#00A651] font-bold text-lg">هناك طريق أفضل</span>
            <div className="h-px w-20 bg-gradient-to-r from-[#006C35] to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
