import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, FileText, Globe, Building2 } from 'lucide-react';
import Button from '../ui/Button';

const socialProof = [
  { icon: FileText,   value: '+٣,٢٠٠', label: 'ملف مهني جُهِّز' },
  { icon: Globe,      value: '+٩٥٠',   label: 'موقع شخصي أُنشِئ' },
  { icon: Building2,  value: '+١٥٠,٠٠٠', label: 'تقديم على شركات' },
];

export default function CTA() {
  return (
    <section className="py-24 bg-gray-950 relative overflow-hidden" dir="rtl">
      <div className="absolute inset-0 saudi-geo-pattern opacity-[0.05] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[#006C35]/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#C8A951]/4 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-l from-transparent via-[#006C35]/40 to-transparent" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        {/* Vision badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 badge-vision rounded-full mb-8">
          <span className="text-base">🇸🇦</span>
          <span className="text-xs font-bold text-[#00A651]">خدمة تنفيذية للكفاءات السعودية</span>
          <Sparkles size={12} className="text-[#C8A951]" />
        </div>

        <h2 className="arabic-heading text-3xl sm:text-4xl lg:text-6xl text-white mb-6">
          ابدأ تجهيز{' '}
          <span className="text-gradient-saudi">حضورك المهني</span>
          {' '}الآن
        </h2>

        <p className="text-gray-400 text-lg mb-3 max-w-2xl mx-auto leading-loose">
          سيرتك الذاتية، موقعك الشخصي، والتقديم على ١٠٠+ شركة سعودية — كل شيء جاهز خلال ٨ ساعات.
        </p>

        <p className="text-[#C8A951] font-bold text-base mb-10">
          نحن ننفّذ — أنت تحصد النتائج · نحو القمة
        </p>

        {/* Social Proof */}
        <div className="flex flex-wrap justify-center gap-8 mb-10">
          {socialProof.map((s) => (
            <div key={s.label} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#006C35]/20 flex items-center justify-center">
                <s.icon size={16} className="text-[#00A651]" />
              </div>
              <div className="text-right">
                <p className="text-lg font-black text-white leading-none">{s.value}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <Link to="/order">
            <Button variant="primary" size="xl" className="w-full sm:w-auto shadow-xl-saudi">
              <Sparkles size={18} />
              اشترِ الخدمة — ١٩٩ ر.س
              <ArrowLeft size={18} className="icon-rtl-flip" />
            </Button>
          </Link>
          <a href="#pricing">
            <Button variant="secondary" size="xl" className="w-full sm:w-auto border-gray-700 bg-gray-900 text-white hover:bg-gray-800">
              اطّلع على ما تشمله الخدمة
            </Button>
          </a>
        </div>

        {/* Reassurances */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-500 mb-14">
          <div className="flex items-center gap-2">
            <span className="text-[#C8A951]">✓</span>
            نتائج خلال ٨ ساعات
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#C8A951]">✓</span>
            ضمان استرداد كامل
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#C8A951]">✓</span>
            دعم مباشر على واتساب
          </div>
        </div>

        {/* Companies */}
        <div className="pt-8 border-t border-gray-800/60">
          <p className="text-xs text-gray-600 mb-6">عملاؤنا يعملون في أبرز الشركات السعودية</p>
          <div className="flex flex-wrap justify-center gap-8">
            {['أرامكو السعودية','سابك','STC','بنك الراجحي','نيوم','البنك الأهلي','صندوق الاستثمارات العامة'].map((company) => (
              <span key={company} className="text-sm font-bold text-gray-700 hover:text-gray-400 transition-colors">
                {company}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
