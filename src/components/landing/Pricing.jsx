import { useState } from 'react';
import { Check, X, Crown, Flame, Timer, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { pricingPlans } from '../../data/pricing';
import Button from '../ui/Button';
import PaymentModal from '../payment/PaymentModal';

const PLAN_COLOR = {
  blue:   { ring: 'border-blue-200',   badge: 'bg-blue-600',   btn: 'secondary' },
  purple: { ring: 'border-purple-200', badge: 'bg-purple-600', btn: 'secondary' },
  gold:   { ring: 'border-[#C8A951]',  badge: 'bg-[#C8A951]',  btn: 'gold'      },
  green:  { ring: 'border-[#006C35]',  badge: 'bg-[#006C35]',  btn: 'primary'   },
};

export default function Pricing() {
  const [paymentOpen, setPaymentOpen] = useState(false);

  return (
    <section className="py-28 bg-white relative overflow-hidden" id="pricing" dir="rtl">
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#006C35]/4 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-[#C8A951]/4 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#006C35]/8 border border-[#006C35]/15 rounded-full mb-6">
            <Star size={14} className="text-[#C8A951]" />
            <span className="text-xs font-bold text-[#006C35]">باقات الخدمة</span>
          </div>
          <h2 className="arabic-heading text-4xl sm:text-5xl text-gray-900 mb-4">
            اختر الخدمة{' '}
            <span className="text-gradient-saudi">المناسبة لك</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto leading-relaxed">
            أربع باقات واضحة — من السيرة الذاتية فقط حتى الخدمة التنفيذية الكاملة.
          </p>
        </div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {pricingPlans.map((plan) => {
            const c = PLAN_COLOR[plan.color];
            const isPopular  = plan.popular;
            const isFull     = plan.id === 'professional';
            const discount   = plan.oldPrice ? Math.round((1 - plan.price / plan.oldPrice) * 100) : 0;

            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
                  isFull
                    ? 'bg-[#006C35] shadow-xl shadow-[#006C35]/25'
                    : `bg-white border-2 ${isPopular ? c.ring : 'border-gray-100'} shadow-sm`
                }`}
              >
                {/* Badge */}
                {plan.badge && (
                  <div className={`flex items-center justify-center gap-2 py-2.5 ${isFull ? 'bg-[#C8A951]' : c.badge}`}>
                    {isPopular && <Flame size={12} className="text-white" />}
                    <span className="text-[11px] font-black text-white">{plan.badge}</span>
                    {isPopular && <Timer size={12} className="text-white" />}
                  </div>
                )}

                {/* Top ring glow for full plan */}
                {isFull && (
                  <div className="absolute inset-0 rounded-3xl ring-2 ring-[#C8A951]/40 pointer-events-none" />
                )}

                <div className="p-6 flex flex-col flex-1">
                  {/* Name & description */}
                  <div className="mb-5 text-right">
                    <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${isFull ? 'text-green-300' : 'text-gray-400'}`}>
                      {plan.period}
                    </p>
                    <h3 className={`text-xl font-black mb-1 ${isFull ? 'text-white' : 'text-gray-900'}`}>{plan.name}</h3>
                    <p className={`text-xs leading-relaxed ${isFull ? 'text-green-200' : 'text-gray-400'}`}>{plan.description}</p>
                  </div>

                  {/* Price */}
                  <div className="mb-6 text-right">
                    {discount > 0 && (
                      <div className="flex items-center gap-2 justify-end mb-1">
                        <span className={`text-xs font-black px-2 py-0.5 rounded-full ${isFull ? 'bg-[#C8A951]/20 text-[#C8A951]' : 'bg-gray-100 text-gray-500'}`}>
                          وفّر {discount}٪
                        </span>
                        <span className={`text-base line-through ${isFull ? 'text-green-400/60' : 'text-gray-300'}`}>
                          {plan.oldPrice} ر.س
                        </span>
                      </div>
                    )}
                    <div className="flex items-baseline gap-1.5 justify-end">
                      <span className={`text-xs font-bold ${isFull ? 'text-green-200' : 'text-gray-400'}`}>ر.س</span>
                      <span className={`text-4xl font-black ${isFull ? 'text-white' : 'text-gray-900'}`}>{plan.price}</span>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="mb-6">
                    {isFull || isPopular ? (
                      <Button
                        variant={isFull ? 'gold' : 'primary'}
                        size="md"
                        className="w-full"
                        onClick={() => setPaymentOpen(true)}
                      >
                        {isFull && <Crown size={14} />}
                        {plan.cta}
                      </Button>
                    ) : (
                      <Link to="/register" className="block">
                        <Button variant="secondary" size="md" className="w-full">
                          {plan.cta}
                        </Button>
                      </Link>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="space-y-2.5 flex-1">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2.5 flex-row-reverse">
                        <span className={`text-xs flex-1 text-right ${f.included ? (isFull ? 'text-green-100' : 'text-gray-700') : (isFull ? 'text-green-400/40' : 'text-gray-300')}`}>
                          {f.text}
                        </span>
                        {f.included
                          ? <Check size={13} className={isFull ? 'text-[#C8A951]' : 'text-[#006C35]'} />
                          : <X size={13} className={isFull ? 'text-green-400/30' : 'text-gray-200'} />
                        }
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-center text-xs text-gray-400 mt-8">
          جميع الأسعار بالريال السعودي · قد تنطبق ضريبة القيمة المضافة · إلغاء في أي وقت
        </p>
      </div>

      <PaymentModal isOpen={paymentOpen} onClose={() => setPaymentOpen(false)} />
    </section>
  );
}
