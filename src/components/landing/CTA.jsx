import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Users, FileText, Mic } from 'lucide-react';
import Button from '../ui/Button';

const socialProof = [
  { icon: Users, value: '+٥٠,٠٠٠', label: 'باحث عن عمل' },
  { icon: FileText, value: '+٢٠,٠٠٠', label: 'سيرة ذاتية محسّنة' },
  { icon: Mic, value: '+١٠,٠٠٠', label: 'مقابلة تجريبية' },
];

export default function CTA() {
  return (
    <section className="py-24 bg-gray-950 relative overflow-hidden">
      <div className="absolute inset-0 saudi-geo-pattern opacity-[0.05] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[#006C35]/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#C8A951]/4 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-l from-transparent via-[#006C35]/40 to-transparent" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        {/* Vision badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 badge-vision rounded-full mb-8">
          <span className="text-base">🇸🇦</span>
          <span className="text-xs font-bold text-[#00A651]">مستوحى من رؤية المملكة 2030</span>
          <Sparkles size={12} className="text-[#C8A951]" />
        </div>

        <h2 className="arabic-heading text-3xl sm:text-4xl lg:text-6xl text-white mb-6">
          مسيرتك المهنية{' '}
          <span className="text-gradient-saudi">تبدأ الآن</span>
        </h2>

        <p className="text-gray-400 text-lg mb-4 max-w-2xl mx-auto leading-loose">
          انضم إلى أكثر من ٥٠,٠٠٠ باحث عن عمل يبنون حضورهم المهني ويتقدمون لأفضل الفرص في السعودية.
        </p>

        <p className="text-[#C8A951] font-bold text-base mb-10">
          لأن مستقبلك يستحق الأفضل · نحو القمة
        </p>

        {/* Social Proof Stats */}
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
          <Link to="/register">
            <Button variant="primary" size="xl" className="w-full sm:w-auto shadow-xl-saudi">
              <Sparkles size={18} />
              ابدأ مجانًا
              <ArrowLeft size={18} className="icon-rtl-flip" />
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="secondary" size="xl" className="w-full sm:w-auto border-gray-700 bg-gray-900 text-white hover:bg-gray-800">
              استكشف المنصة
            </Button>
          </Link>
        </div>

        {/* Reassurances */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-500 mb-14">
          <div className="flex items-center gap-2">
            <span className="text-[#C8A951]">✓</span>
            خطة مجانية دائمة
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#C8A951]">✓</span>
            لا تلزم بطاقة ائتمانية
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#C8A951]">✓</span>
            إلغاء في أي وقت
          </div>
        </div>

        {/* Companies */}
        <div className="pt-8 border-t border-gray-800/60">
          <p className="text-xs text-gray-600 mb-6">يثق به موظفون من أبرز الشركات السعودية</p>
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
