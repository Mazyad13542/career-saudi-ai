import { useState, useEffect } from 'react';
import { Crown, CheckCircle, CreditCard, Calendar, Shield, Loader2, AlertCircle } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import PaymentModal from '../../components/payment/PaymentModal';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

const FREE_LIMITS = [
  { label: 'جلسات المقابلة التجريبية',   limit: '٣ جلسات/شهر', free: true },
  { label: 'جلسات تدريب الإنجليزية',     limit: '٣ جلسات/شهر', free: true },
  { label: 'الوظائف المناسبة لك',         limit: 'أول ٣ نتائج',  free: true },
  { label: 'تخصيص السيرة الذاتية (ATS)',  limit: 'غير متاح',     free: false },
  { label: 'تحليل مفصّل لكل وظيفة',       limit: 'غير متاح',     free: false },
  { label: 'مستشار المسيرة المهني',        limit: 'محدود',        free: true },
];

const PRO_FEATURES = [
  'جلسات مقابلة وإنجليزية غير محدودة',
  'عرض جميع الوظائف المناسبة لك',
  'ATS Scoring متقدم لكل وظيفة',
  'تحليل مفصّل لنقاط ضعف وقوة ملفك',
  'مستشار مسيرة مهنية كامل',
  'أولوية في ظهور ملفك للشركات',
];

export default function Subscription() {
  const { profile, isPremium } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [payments,  setPayments]  = useState([]);
  const [loadingPay, setLoadingPay] = useState(true);

  const premium = isPremium();

  useEffect(() => {
    if (!profile) return;
    supabase
      .from('payments')
      .select('*')
      .eq('user_id', profile.id)
      .order('created_at', { ascending: false })
      .limit(10)
      .then(({ data }) => { setPayments(data ?? []); setLoadingPay(false); });
  }, [profile]);

  const expiresAt   = profile?.plan_expires_at ? new Date(profile.plan_expires_at) : null;
  const daysLeft    = expiresAt ? Math.max(0, Math.ceil((expiresAt - new Date()) / (1000 * 60 * 60 * 24))) : 0;
  const isExpiring  = premium && daysLeft <= 5;

  return (
    <DashboardLayout>
      <div className="mb-6 text-right">
        <h1 className="text-2xl font-black text-gray-900">إدارة الاشتراك</h1>
        <p className="text-gray-500 text-sm mt-0.5">خطتك الحالية والفوائد المتاحة</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Plan Card */}
        <div className="lg:col-span-2 space-y-5">
          <div className={`rounded-2xl p-6 border ${premium ? 'bg-gradient-to-l from-[#C8A951]/10 to-[#006C35]/10 border-[#C8A951]/30' : 'bg-white border-gray-100'} shadow-sm`}>
            <div className="flex items-start justify-between mb-4">
              <div>
                {premium ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#C8A951]/20 border border-[#C8A951]/30 rounded-full text-xs font-black text-amber-700">
                    <Crown size={11} className="text-[#C8A951]" />
                    احترافي
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 rounded-full text-xs font-black text-gray-600">
                    مجاني
                  </span>
                )}
              </div>
              <div className="text-right">
                <h2 className="text-lg font-black text-gray-900">
                  {premium ? 'الخطة الاحترافية' : 'الخطة المجانية'}
                </h2>
                {premium && expiresAt && (
                  <p className="text-xs text-gray-500 mt-0.5">
                    ينتهي في: {expiresAt.toLocaleDateString('ar-SA')}
                    {isExpiring && <span className="text-red-500 font-bold mr-2">({daysLeft} أيام متبقية)</span>}
                  </p>
                )}
              </div>
            </div>

            {isExpiring && (
              <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-100 rounded-xl mb-4">
                <AlertCircle size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700">
                  اشتراكك على وشك الانتهاء! جدّد الآن للاستمرار في الوصول الكامل.
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
              {(premium ? PRO_FEATURES : FREE_LIMITS.map(f => f.label)).map((f, i) => (
                <div key={i} className="flex items-center gap-2 flex-row-reverse">
                  <CheckCircle size={13} className={premium ? 'text-[#006C35]' : 'text-gray-300'} />
                  <span className="text-xs text-gray-700">{f}</span>
                </div>
              ))}
            </div>

            {!premium && (
              <Button variant="primary" onClick={() => setModalOpen(true)} className="w-full">
                <Crown size={14} className="text-[#C8A951]" />
                ترقّ إلى الاحترافية — ٩٩ ريال/شهر
              </Button>
            )}
            {premium && (
              <div className="flex items-center gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setModalOpen(true)}>
                  تجديد مبكّر
                </Button>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Shield size={12} />
                  <span>مدفوع بأمان عبر PayPal</span>
                </div>
              </div>
            )}
          </div>

          {/* Feature comparison */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-50">
              <h3 className="font-black text-gray-900 text-right">مقارنة الخطط</h3>
            </div>
            <div className="divide-y divide-gray-50">
              {FREE_LIMITS.map((f) => (
                <div key={f.label} className="flex items-center justify-between px-4 py-3" dir="rtl">
                  <span className={`text-xs font-bold ${f.free ? 'text-[#006C35]' : 'text-gray-400'}`}>{f.limit}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-20 text-center">
                      {premium
                        ? <span className="text-[10px] font-black text-[#006C35] bg-[#006C35]/10 px-2 py-0.5 rounded-full">غير محدود</span>
                        : <span className="text-[10px] font-black text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">{f.limit}</span>
                      }
                    </div>
                    <span className="text-xs font-black text-gray-700 w-36 text-right">{f.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Payment History */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="p-4 border-b border-gray-50 flex items-center justify-between">
            <CreditCard size={16} className="text-gray-400" />
            <h3 className="font-black text-gray-900 text-sm">سجل الدفعات</h3>
          </div>
          {loadingPay ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 size={20} className="animate-spin text-gray-300" />
            </div>
          ) : payments.length === 0 ? (
            <div className="py-10 text-center">
              <CreditCard size={28} className="mx-auto text-gray-200 mb-2" />
              <p className="text-xs text-gray-400">لا توجد دفعات بعد</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {payments.map(p => (
                <div key={p.id} className="px-4 py-3 text-right" dir="rtl">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-black text-[#006C35]">{p.amount_sar} ريال</span>
                    <span className="text-xs font-black text-gray-900">خطة احترافية</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${p.status === 'completed' ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-500'}`}>
                      {p.status === 'completed' ? 'مكتمل' : p.status}
                    </span>
                    <div className="flex items-center gap-1 text-[10px] text-gray-400">
                      <Calendar size={10} />
                      <span>{new Date(p.created_at).toLocaleDateString('ar-SA')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <PaymentModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </DashboardLayout>
  );
}
