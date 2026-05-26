import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { faqs } from '../../data/pricing';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="py-24 bg-white" id="faq" dir="rtl">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#006C35]/8 border border-[#006C35]/15 rounded-full mb-6">
            <HelpCircle size={14} className="text-[#006C35]" />
            <span className="text-xs font-bold text-[#006C35]">الأسئلة الشائعة</span>
          </div>
          <h2 className="arabic-heading text-3xl sm:text-4xl text-gray-900 mb-4">
            أسئلة{' '}
            <span className="text-gradient-green">يسألها الجميع</span>
          </h2>
          <p className="text-gray-500 leading-relaxed">كل ما تريد معرفته عن خدمات قِمّة.</p>
        </div>

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

        <div className="mt-10 text-center">
          <p className="text-gray-400 text-sm">
            لديك سؤال آخر؟{' '}
            <a href="mailto:hello@qimma.sa" className="text-[#006C35] font-bold hover:underline">
              تواصل مع فريقنا
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
