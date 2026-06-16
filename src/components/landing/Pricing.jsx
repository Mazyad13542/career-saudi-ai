import { useState } from 'react';
import { Check, Crown, Flame, Users } from 'lucide-react';
import PaymentModal from '../payment/PaymentModal';

const FEATURES = [
  'تنظيم صفحة LinkedIn باحترافية',
  'موقع شخصي رسمي (شهادات + خبرات + أعمال)',
  'تنقيح صورتك الشخصية احترافياً',
  'تصميم سيرة ذاتية CV احترافية',
  'رسالة تقديم احترافية مخصصة',
  'التقديم على ٢٠٠ شركة سعودية',
  '⚡ التسليم خلال ٨ ساعات عمل على واتساب',
];

export default function Pricing() {
  const [paymentOpen, setPaymentOpen] = useState(false);

  return (
    <section className="py-28 bg-gray-950 relative overflow-hidden" id="pricing" dir="rtl">
      {/* Background layers */}
      <div className="absolute inset-0 saudi-geo-pattern opacity-[0.04] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-l from-transparent via-[#C8A951]/30 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#006C35]/12 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#C8A951]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-2xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#C8A951]/10 border border-[#C8A951]/25 rounded-full mb-6">
            <Crown size={13} className="text-[#C8A951]" />
            <span className="text-xs font-bold text-[#C8A951]">اشتراك واحد · كل شيء مشمول</span>
          </div>
          <h2 className="arabic-heading text-4xl sm:text-5xl text-white mb-4">
            سعر واحد.{' '}
            <span className="text-gradient-saudi">كل شيء.</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-md mx-auto leading-relaxed">
            لا تعقيد، لا خيارات محيرة — اشتراك واحد يفتح جميع الخدمات الاحترافية.
          </p>
        </div>

        {/* Single Card */}
        <div className="relative mx-auto">
          {/* Outer glow ring */}
          <div className="absolute -inset-px rounded-[2rem] bg-gradient-to-b from-[#C8A951]/50 via-[#006C35]/30 to-[#C8A951]/20 blur-sm" />

          <div className="relative bg-gradient-to-b from-gray-900 to-gray-950 rounded-[2rem] overflow-hidden border border-white/8 shadow-2xl">

            {/* Top shimmer */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-l from-transparent via-[#C8A951] to-transparent" />

            {/* Seats badge */}
            <div className="flex items-center justify-center gap-2 py-3 bg-gradient-to-l from-[#C8A951]/15 to-[#C8A951]/8 border-b border-[#C8A951]/15">
              <Flame size={13} className="text-[#C8A951] animate-pulse" />
              <span className="text-xs font-black text-[#C8A951] tracking-wide">عدد المقاعد محدود لهذا الشهر</span>
              <Users size={13} className="text-[#C8A951]" />
            </div>

            <div className="p-8 sm:p-10">

              {/* Name + description */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-[#C8A951]/15 border border-[#C8A951]/25 flex items-center justify-center">
                    <Crown size={16} className="text-[#C8A951]" />
                  </div>
                  <h3 className="text-2xl font-black text-white">الاشتراك الكامل</h3>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed max-w-sm mx-auto">
                  كل ما تحتاجه للحصول على وظيفة بشكل احترافي
                </p>
              </div>

              {/* Price block */}
              <div className="text-center mb-8">
                <div className="inline-flex flex-col items-center">
                  {/* Old price */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-black text-[#C8A951] px-2.5 py-0.5 bg-[#C8A951]/15 border border-[#C8A951]/25 rounded-full">
                      وفّر ٥٠٪
                    </span>
                    <span className="text-lg text-gray-600 line-through font-bold">٣٩٩ ر.س</span>
                  </div>

                  {/* Main price */}
                  <div className="flex items-baseline gap-2">
                    <span className="text-7xl sm:text-8xl font-black text-white leading-none tabular-nums"
                          style={{ textShadow: '0 0 40px rgba(0,108,53,0.4)' }}>
                      ١٩٩
                    </span>
                    <span className="text-xl font-black text-[#00A651] self-end mb-1">ر.س</span>
                  </div>

                  <p className="text-sm font-bold text-[#C8A951] mt-2">دفع مرة واحدة فقط</p>
                  <p className="text-xs text-gray-600 mt-1">لا رسوم خفية · لا اشتراك متكرر</p>
                </div>
              </div>

              {/* CTA Button */}
              <button
                onClick={() => setPaymentOpen(true)}
                className="w-full py-4 text-base font-black text-white rounded-2xl mb-8 relative overflow-hidden group transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: 'linear-gradient(135deg, #006C35 0%, #00A651 50%, #006C35 100%)',
                  backgroundSize: '200% 100%',
                  boxShadow: '0 8px 32px rgba(0,108,53,0.45), 0 0 0 1px rgba(0,108,53,0.3)',
                }}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                     style={{ background: 'linear-gradient(135deg, #00A651 0%, #006C35 100%)' }} />
                <span className="relative flex items-center justify-center gap-2">
                  <Crown size={18} className="text-[#C8A951]" />
                  ابدأ الآن
                </span>
              </button>

              {/* Features */}
              <ul className="space-y-3.5">
                {FEATURES.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 flex-row-reverse">
                    <div className="w-5 h-5 rounded-full bg-[#006C35]/20 border border-[#006C35]/40 flex items-center justify-center flex-shrink-0">
                      <Check size={11} className="text-[#00A651]" strokeWidth={3} />
                    </div>
                    <span className="text-sm text-gray-300 flex-1 text-right">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Divider */}
              <div className="mt-8 pt-6 border-t border-white/6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#006C35]" />
                  دعم مباشر عبر واتساب
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C8A951]" />
                  ضمان استرداد كامل ٣٠ يوم
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom note */}
        <p className="text-center text-xs text-gray-600 mt-8">
          جميع الأسعار بالريال السعودي · قد تنطبق ضريبة القيمة المضافة · إلغاء في أي وقت
        </p>
      </div>

      <PaymentModal isOpen={paymentOpen} onClose={() => setPaymentOpen(false)} />
    </section>
  );
}
