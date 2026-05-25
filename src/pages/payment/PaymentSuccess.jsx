import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle, Crown, FileText, Briefcase, ClipboardList, Mic, TrendingUp, Star } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const FEATURES = [
  { icon: FileText,      label: 'تحليل السيرة الذاتية المتقدم' },
  { icon: Briefcase,     label: 'تقديم مباشر على الوظائف' },
  { icon: ClipboardList, label: 'متابعة كاملة للتقديمات' },
  { icon: Mic,           label: 'مقابلات تجريبية غير محدودة' },
  { icon: TrendingUp,    label: 'تحليلات الأداء المهني' },
  { icon: Star,          label: 'وظائف مميزة حصرية' },
];

export default function PaymentSuccess() {
  const navigate           = useNavigate();
  const { profile, isPremium, refreshProfile } = useAuth();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    refreshProfile?.();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (countdown <= 0) { navigate('/dashboard'); return; }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown, navigate]);

  const name = profile?.full_name?.split(' ')[0] || 'عزيزي المستخدم';

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden"
      dir="rtl"
      style={{ background: 'linear-gradient(135deg, #004a23 0%, #006C35 50%, #005a2b 100%)' }}
    >
      <div className="absolute inset-0 saudi-geo-pattern opacity-[0.04] pointer-events-none" />
      <div className="absolute top-20 right-1/4 w-96 h-96 bg-[#C8A951]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />

      <div className="relative w-full max-w-lg">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="h-1 bg-gradient-to-l from-transparent via-[#C8A951] to-transparent" />

          {/* Top section */}
          <div className="text-center px-8 pt-10 pb-8">
            <div className="relative inline-block mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle size={40} className="text-[#006C35]" />
              </div>
              <div className="absolute -top-1 -right-1 w-7 h-7 bg-[#C8A951] rounded-full flex items-center justify-center shadow-lg">
                <Crown size={13} className="text-white" />
              </div>
            </div>

            <h1 className="text-2xl font-black text-gray-900 mb-2">
              مبروك، {name}! 🎉
            </h1>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">
              تم تفعيل الخطة الاحترافية بنجاح. أنت الآن تملك وصولاً كاملاً لجميع أدوات قِمّة.
            </p>

            {isPremium() && (
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#C8A951]/15 border border-[#C8A951]/30 rounded-full text-sm font-black text-amber-700">
                <Crown size={13} className="text-[#C8A951]" />
                الخطة الاحترافية — مفعّلة
              </span>
            )}
          </div>

          {/* Features unlocked */}
          <div className="px-8 pb-8">
            <p className="text-xs font-black text-gray-400 mb-4 text-center uppercase tracking-widest">ما تم فتحه</p>
            <div className="grid grid-cols-2 gap-3 mb-8">
              {FEATURES.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 p-3 bg-[#006C35]/5 rounded-xl border border-[#006C35]/10">
                  <Icon size={15} className="text-[#006C35] flex-shrink-0" />
                  <span className="text-xs font-bold text-gray-700">{label}</span>
                </div>
              ))}
            </div>

            <Link
              to="/dashboard"
              className="block w-full py-3.5 text-center text-sm font-black text-white bg-[#006C35] rounded-2xl hover:bg-[#005a2b] active:scale-[0.98] transition-all"
            >
              الذهاب إلى لوحة التحكم
            </Link>

            <p className="text-center text-xs text-gray-400 mt-3">
              التحويل التلقائي خلال{' '}
              <span className="font-black text-[#006C35]">{countdown}</span>
              {' '}ثانية
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
