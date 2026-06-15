import { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { useNavigate } from 'react-router-dom';
import { X, Lock, Shield, CheckCircle, AlertCircle, Crown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { track, EVENTS } from '../../lib/analytics';

const SAR_AMOUNT   = '199';
const SDK_CURRENCY = 'SAR';
const PLAN_LABEL   = 'الاشتراك الكامل';
const SUCCESS_PATH = '/payment-success';
const CANCEL_PATH  = '/#pricing';

const PLAN_PERKS = [
  'سيرة ذاتية ATS احترافية',
  'موقع شخصي احترافي',
  'التقديم على ١٠٠+ شركة',
  'خدمة البث Broadcast',
  'متابعة الردود والمقابلات',
  'لوحة تحكم + دعم مباشر',
];

// ── Inner checkout ────────────────────────────────────────────────────────────
function PayPalCheckout({ onSuccess, onCancel, onRetry }) {
  const [{ isPending, isRejected }] = usePayPalScriptReducer();
  const { upgradeToPremium }        = useAuth();
  const [txStatus, setTxStatus]     = useState('idle');
  const [txError,  setTxError]      = useState('');

  if (isPending) {
    return (
      <div className="space-y-2.5">
        <div className="h-12 bg-gray-100 rounded-xl animate-pulse" />
        <div className="h-10 bg-gray-100 rounded-xl animate-pulse opacity-60" />
        <p className="text-center text-xs text-gray-400">جاري تحميل خيارات الدفع…</p>
      </div>
    );
  }

  if (isRejected) {
    return (
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl">
          <AlertCircle size={15} className="text-red-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-700 leading-relaxed">
            تعذّر تحميل خدمة الدفع. تحقق من اتصالك بالإنترنت وحاول مرة أخرى.
          </p>
        </div>
        <button onClick={onRetry} className="w-full py-3 text-sm font-bold text-white bg-[#006C35] rounded-xl hover:bg-[#005a2b] active:scale-[0.98] transition-all">
          إعادة المحاولة
        </button>
      </div>
    );
  }

  if (txStatus === 'processing') {
    return (
      <div className="py-8 flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-[3px] border-[#006C35] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-bold text-gray-800">جاري تأكيد الدفع وتفعيل الاشتراك…</p>
        <p className="text-xs text-gray-400">لا تغلق هذه النافذة</p>
      </div>
    );
  }

  if (txStatus === 'success') {
    return (
      <div className="py-8 flex flex-col items-center gap-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle size={34} className="text-[#006C35]" />
        </div>
        <div className="text-center">
          <p className="text-lg font-black text-gray-900 mb-1">تم الدفع بنجاح!</p>
          <p className="text-sm text-gray-500">مرحباً بك في الخطة الاحترافية.</p>
        </div>
      </div>
    );
  }

  if (txStatus === 'error') {
    return (
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl">
          <AlertCircle size={15} className="text-red-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-700 leading-relaxed">{txError}</p>
        </div>
        <button onClick={onRetry} className="w-full py-3 text-sm font-bold text-white bg-[#006C35] rounded-xl hover:bg-[#005a2b] active:scale-[0.98] transition-all">
          حاول مرة أخرى
        </button>
      </div>
    );
  }

  return (
    <>
      <PayPalButtons
        style={{ layout: 'vertical', color: 'gold', shape: 'rect', label: 'pay', height: 50 }}
        forceReRender={[SAR_AMOUNT, SDK_CURRENCY]}
        createOrder={(data, actions) => {
          return actions.order.create({
            intent: 'CAPTURE',
            purchase_units: [{
              amount: { currency_code: SDK_CURRENCY, value: SAR_AMOUNT },
              description: `قِمّة - ${PLAN_LABEL}`,
            }],
            application_context: { shipping_preference: 'NO_SHIPPING', brand_name: 'Qimmah' },
          });
        }}
        onApprove={(data, actions) => {
          setTxStatus('processing');
          return actions.order.capture().then(async () => {
            const { error } = await upgradeToPremium(data.orderID);
            if (!error) track(EVENTS.SUBSCRIPTION_PAID, { orderId: data.orderID, amount: SAR_AMOUNT });
            setTxStatus('success');
            setTimeout(onSuccess, 1800);
          }).catch(() => {
            setTxError('تأكيد الدفع فشل. إذا خُصم المبلغ، تواصل مع الدعم فوراً.');
            setTxStatus('error');
          });
        }}
        onCancel={() => onCancel()}
        onError={() => {
          setTxError('حدث خطأ أثناء الدفع. تأكد من تسجيل الدخول بحساب PayPal Sandbox صحيح وحاول مرة أخرى.');
          setTxStatus('error');
        }}
      />

      <div className="mt-4 flex items-center justify-center gap-3 text-[10px] text-gray-400">
        <div className="flex items-center gap-1"><Lock size={9} /><span>دفع آمن</span></div>
        <span>·</span>
        <div className="flex items-center gap-1"><Shield size={9} /><span>مشفّر SSL</span></div>
        <span>·</span>
        <span className="font-bold text-gray-500">PayPal</span>
      </div>
    </>
  );
}

// ── Modal shell ───────────────────────────────────────────────────────────────
export default function PaymentModal({ isOpen, onClose }) {
  const navigate   = useNavigate();
  const [retryKey, setRetryKey] = useState(0);
  const clientId   = import.meta.env.VITE_PAYPAL_CLIENT_ID;

  if (!isOpen) return null;

  const handleSuccess = () => navigate(SUCCESS_PATH);
  const handleCancel  = () => { onClose(); navigate(CANCEL_PATH); };
  const handleRetry   = () => setRetryKey((k) => k + 1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" dir="rtl">
      <div className="absolute inset-0 bg-black/65 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="h-0.5 bg-gradient-to-l from-transparent via-[#C8A951] to-transparent" />

        {/* Header */}
        <div className="bg-[#006C35] px-6 pt-5 pb-6">
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#C8A951]/20 rounded-lg flex items-center justify-center">
                <Crown size={16} className="text-[#C8A951]" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-green-300 uppercase tracking-widest">دفع مرة واحدة</p>
                <h2 className="text-base font-black text-white">{PLAN_LABEL}</h2>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white/15 transition-colors" aria-label="إغلاق">
              <X size={17} className="text-white/70" />
            </button>
          </div>

          <div className="bg-white/8 border border-white/10 rounded-2xl px-4 py-3 flex items-center justify-between">
            <div className="text-right">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-black text-white stat-number">١٩٩</span>
                <span className="text-green-200 font-bold">ر.س</span>
              </div>
              <p className="text-[10px] text-green-300/60 mt-0.5">دفع مرة واحدة فقط · لا رسوم خفية</p>
            </div>
            <span className="text-xs font-black text-[#C8A951] px-3 py-1 bg-[#C8A951]/20 border border-[#C8A951]/30 rounded-full">وفّر ٥٠٪</span>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6">
          <div className="bg-gray-50 rounded-2xl p-4 mb-5">
            <p className="text-[10px] font-bold text-gray-400 mb-2.5">ما ستحصل عليه:</p>
            <div className="grid grid-cols-2 gap-y-1.5 gap-x-3">
              {PLAN_PERKS.map((perk) => (
                <div key={perk} className="flex items-center gap-1.5 text-xs text-gray-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#006C35] flex-shrink-0" />
                  {perk}
                </div>
              ))}
            </div>
          </div>

          {clientId ? (
            <PayPalScriptProvider
              key={retryKey}
              options={{ 'client-id': clientId, currency: SDK_CURRENCY, intent: 'capture', components: 'buttons' }}
            >
              <PayPalCheckout onSuccess={handleSuccess} onCancel={handleCancel} onRetry={handleRetry} />
            </PayPalScriptProvider>
          ) : (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl">
              <AlertCircle size={15} className="text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-700">VITE_PAYPAL_CLIENT_ID غير موجود في إعدادات المنصة.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
