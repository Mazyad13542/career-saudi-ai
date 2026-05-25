import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: 'هل المنصة متاحة للمقيمين في المملكة أيضاً وليس السعوديين فقط؟',
    answer: 'نعم! قِمّة مفتوحة لجميع المهنيين الراغبين في العمل في المملكة العربية السعودية أو الباحثين عن فرص فيها. المنصة مصممة لخدمة كل من يتنقل في سوق العمل السعودي.',
  },
  {
    question: 'كيف يعمل بناء السيرة الذاتية؟',
    answer: 'تحلّل المنصة خبراتك وتعليمك ومهاراتك لتولّد سيرة ذاتية محسّنة لأنظمة ATS. تقيّمها بعد ذلك مقارنةً بمتطلبات الوظائف الحقيقية وتقدم توصيات تحسين محددة.',
  },
  {
    question: 'ما هي درجة ATS ولماذا هي مهمة؟',
    answer: 'نظام ATS (تتبع المتقدمين) هو برنامج تستخدمه معظم الشركات لفلترة السير الذاتية تلقائياً قبل أن يطّلع عليها أي مسؤول. درجة فوق 80 تزيد بشكل ملحوظ من فرصك في الوصول للمقابلة.',
  },
  {
    question: 'كيف تعمل المقابلة التجريبية بالصوت؟',
    answer: 'يجري النظام معك محاكاة مقابلة واقعية بالصوت. يطرح أسئلة متخصصة في مجالك ويقيّم إجاباتك. في النهاية تحصل على تقرير شامل يتضمن مستوى اللغة (A/B/C/D) ودرجة الثقة والتواصل.',
  },
  {
    question: 'ما مستويات اللغة الإنجليزية على المنصة؟',
    answer: 'المستوى A (احترافي)، B (جيد)، C (متوسط)، D (مبتدئ). يُحدد مستواك بناءً على أداء المقابلة الصوتية مع توصيات تحسين مخصصة لكل مستوى.',
  },
  {
    question: 'هل يمكنني إلغاء اشتراكي في أي وقت؟',
    answer: 'بالطبع. يمكنك إلغاء اشتراكك في أي وقت من إعدادات لوحة التحكم دون أي غرامات أو رسوم إضافية.',
  },
  {
    question: 'كيف تختلف المنصة عن LinkedIn؟',
    answer: 'قِمّة مصممة خصيصاً للسوق السعودي مع ميزات مواءمة رؤية 2030 ودعم ثنائي اللغة وشراكات مع شركات محلية وأدوات متخصصة لتحسين السيرة الذاتية وتحضير المقابلات ومطابقة الوظائف في المملكة.',
  },
  {
    question: 'هل يمكن لفرق HR تجربة المنصة قبل الاشتراك؟',
    answer: 'نعم! تحصل فرق HR على تجربة مجانية لمدة 14 يوماً مع وصول كامل لبحث المرشحين والمراسلة ونشر الوظائف بدون بطاقة ائتمانية.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="py-24 bg-white" id="faq">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#006C35]/8 border border-[#006C35]/15 rounded-full mb-6">
            <HelpCircle size={14} className="text-[#006C35]" />
            <span className="text-xs font-bold text-[#006C35]">الأسئلة الشائعة</span>
          </div>
          <h2 className="arabic-heading text-3xl sm:text-4xl text-gray-900 mb-4">
            أسئلة{' '}
            <span className="text-gradient-green">يسألها الجميع</span>
          </h2>
          <p className="text-gray-500 leading-relaxed">كل ما تريد معرفته عن منصة قِمّة.</p>
        </div>

        {/* FAQ */}
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                openIndex === index ? 'border-[#006C35]/25 shadow-sm' : 'border-gray-100 hover:border-gray-200'
              }`}
            >
              <button
                className="w-full flex items-center justify-between p-5 text-right bg-white hover:bg-gray-50 transition-colors duration-200 gap-4"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <ChevronDown
                  size={18}
                  className={`flex-shrink-0 text-gray-400 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180 text-[#006C35]' : ''
                  }`}
                />
                <span className="font-bold text-gray-900 text-sm flex-1 text-right">{faq.question}</span>
              </button>
              {openIndex === index && (
                <div className="px-5 pb-5 bg-white animate-slide-up">
                  <div className="h-px bg-gray-100 mb-4" />
                  <p className="text-gray-500 text-sm leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className="mt-10 text-center">
          <p className="text-gray-400 text-sm">
            لديك سؤال آخر؟{' '}
            <a href="mailto:hello@careersaudi.ai" className="text-[#006C35] font-bold hover:underline">
              تواصل مع فريقنا
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
