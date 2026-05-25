import { useState } from 'react';
import { Check, X, Zap, Crown, Flame, Timer } from 'lucide-react';
import { Link } from 'react-router-dom';
import { pricingPlans } from '../../data/pricing';
import Button from '../ui/Button';
import PaymentModal from '../payment/PaymentModal';

export default function Pricing() {
  const [paymentOpen, setPaymentOpen] = useState(false);

  const free = pricingPlans.find((p) => p.id === 'free');
  const pro  = pricingPlans.find((p) => p.id === 'professional');

  const discount = Math.round((1 - pro.price / pro.oldPrice) * 100);

  return (
    <section className="py-28 bg-white relative overflow-hidden" id="pricing">
      {/* Subtle background blobs */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#006C35]/4 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-[#C8A951]/4 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#006C35]/8 border border-[#006C35]/15 rounded-full mb-6">
            <Zap size={14} className="text-[#006C35]" />
            <span className="text-xs font-bold text-[#006C35]">خطط الأسعار</span>
          </div>
          <h2 className="arabic-heading text-4xl sm:text-5xl text-gray-900 mb-4">
            خطة واحدة تكفي.{' '}
            <span className="text-gradient-saudi">ابدأ مجاناً.</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto leading-relaxed">
            لا تعقيد، لا مفاجآت — خطتان شفافتان مصممتان للباحث عن عمل في السعودية.
          </p>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">

          {/* ── FREE PLAN ── */}
          <div className="bg-gray-50 border-2 border-gray-200 rounded-3xl p-8 flex flex-col">
            <div className="mb-6 text-right">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">مجانية</p>
              <h3 className="text-2xl font-black text-gray-900 mb-1">{free.name}</h3>
              <p className="text-sm text-gray-400">{free.description}</p>
            </div>

            {/* Price */}
            <div className="mb-7 text-right">
              <span className="text-5xl font-black text-gray-900">مجانًا</span>
              <p className="text-xs text-gray-400 mt-1">إلى الأبد · لا يلزم بطاقة</p>
            </div>

            {/* CTA */}
            <Link to="/register" className="block mb-7">
              <Button variant="secondary" size="lg" className="w-full">
                {free.cta}
              </Button>
            </Link>

            {/* Features */}
            <ul className="space-y-3 flex-1">
              {free.features.map((f, i) => (
                <li key={i} className="flex items-center gap-3 flex-row-reverse">
                  <span className={`text-sm flex-1 text-right ${f.included ? 'text-gray-700' : 'text-gray-300'}`}>
                    {f.text}
                  </span>
                  {f.included
                    ? <Check size={15} className="text-[#006C35] flex-shrink-0" />
                    : <X size={15} className="text-gray-200 flex-shrink-0" />
                  }
                </li>
              ))}
            </ul>
          </div>

          {/* ── PROFESSIONAL PLAN ── */}
          <div className="relative bg-[#006C35] rounded-3xl overflow-hidden flex flex-col shadow-2xl shadow-[#006C35]/30">

            {/* Glow ring */}
            <div className="absolute inset-0 rounded-3xl ring-2 ring-[#C8A951]/40 pointer-events-none" />

            {/* Top shimmer line */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-l from-transparent via-[#C8A951] to-transparent" />

            {/* Launch badge */}
            <div className="relative z-10 flex items-center justify-center gap-2 py-2.5 bg-[#C8A951]">
              <Flame size={13} className="text-white" />
              <span className="text-xs font-black text-white tracking-wide">{pro.badge}</span>
              <Timer size={13} className="text-white" />
            </div>

            <div className="relative z-10 p-8 flex flex-col flex-1">
              <div className="mb-6 text-right">
                <p className="text-xs font-bold text-green-300 uppercase tracking-widest mb-2">احترافية</p>
                <h3 className="text-2xl font-black text-white mb-1">{pro.name}</h3>
                <p className="text-sm text-green-200">{pro.description}</p>
              </div>

              {/* Price block */}
              <div className="mb-7 text-right">
                {/* Old price strikethrough */}
                <div className="flex items-center gap-3 justify-end mb-1">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#C8A951]/20 border border-[#C8A951]/30 rounded-full">
                    <span className="text-xs font-black text-[#C8A951]">وفّر {discount}٪</span>
                  </span>
                  <span className="text-xl text-green-400/60 line-through font-bold">
                    {pro.oldPrice} ريال
                  </span>
                </div>

                {/* Current price */}
                <div className="flex items-baseline gap-2 justify-end">
                  <span className="text-sm text-green-200">/ شهر</span>
                  <span className="text-5xl font-black text-white stat-number">{pro.price}</span>
                  <span className="text-lg font-bold text-green-200">ريال</span>
                </div>
                <p className="text-xs text-green-300/70 mt-1">إلغاء في أي وقت · لا رسوم خفية</p>
              </div>

              {/* CTA */}
              <div className="mb-7">
                <Button
                  variant="gold"
                  size="lg"
                  className="w-full text-base"
                  onClick={() => setPaymentOpen(true)}
                >
                  <Crown size={16} />
                  {pro.cta}
                </Button>
              </div>

              {/* Features */}
              <ul className="space-y-3 flex-1">
                {pro.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-3 flex-row-reverse">
                    <span className="text-sm text-green-100 flex-1 text-right">{f.text}</span>
                    <Check size={15} className="text-[#C8A951] flex-shrink-0" />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom note */}
        <p className="text-center text-xs text-gray-400 mt-8">
          جميع الأسعار بالريال السعودي · قد تنطبق ضريبة القيمة المضافة · إلغاء في أي وقت
        </p>
      </div>

      <PaymentModal isOpen={paymentOpen} onClose={() => setPaymentOpen(false)} />
    </section>
  );
}
