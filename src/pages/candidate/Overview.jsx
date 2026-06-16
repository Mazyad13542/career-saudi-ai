import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ClipboardList, Clock, Sparkles } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

export default function Overview() {
  const { profile, user } = useAuth();
  const [intakeRecord, setIntakeRecord] = useState(null);
  const [loadingIntake, setLoadingIntake] = useState(true);

  const firstName = profile?.full_name?.split(' ')[0] || 'أهلاً';

  useEffect(() => {
    if (!user?.id) return;
    supabase
      .from('client_intake')
      .select('id, status, created_at')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        setIntakeRecord(data ?? null);
        setLoadingIntake(false);
      });
  }, [user?.id]);

  const statusLabel = {
    new:         'قيد الانتظار 🟡',
    in_progress: 'قيد التنفيذ 🔵',
    completed:   'منجز ✅',
    delivered:   'تم التسليم 🟢',
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto" dir="rtl">

        {/* Welcome card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-5">
          <h1 className="text-2xl font-black text-gray-900 mb-1">
            أهلاً، {firstName} 👋
          </h1>
          <p className="text-gray-500 text-sm">
            مرحباً بك في قِمّة — نُجهِّز لك حضورك المهني الكامل خلال ٨ ساعات.
          </p>
        </div>

        {/* Order status card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-[#006C35]/10 flex items-center justify-center">
              <ClipboardList size={20} className="text-[#006C35]" />
            </div>
            <div>
              <h2 className="font-black text-gray-900 text-base">حالة طلبك</h2>
              <p className="text-xs text-gray-400">استمارة معلوماتك الشخصية والمهنية</p>
            </div>
          </div>

          {loadingIntake ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-[#006C35] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : intakeRecord ? (
            /* Submitted — show status */
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-2xl">
                <CheckCircle size={22} className="text-[#006C35] flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-black text-[#006C35] text-sm">تم استلام طلبك ✅</p>
                  <p className="text-xs text-green-700 mt-0.5">
                    سنتواصل معك على واتساب خلال ٨ ساعات
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between px-1">
                <span className="text-xs text-gray-400 flex items-center gap-1.5">
                  <Clock size={12} />
                  {new Date(intakeRecord.created_at).toLocaleDateString('ar-SA')}
                </span>
                <span className="text-xs font-bold text-gray-700">
                  الحالة: {statusLabel[intakeRecord.status] ?? intakeRecord.status}
                </span>
              </div>
            </div>
          ) : (
            /* Not submitted — CTA */
            <div className="space-y-4">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-right">
                <p className="font-black text-amber-800 text-sm mb-1">لم تُرسل معلوماتك بعد</p>
                <p className="text-xs text-amber-700 leading-relaxed">
                  أملأ الاستمارة حتى نتمكن من البدء بتجهيز خدماتك الست.
                </p>
              </div>
              <Link to="/dashboard/intake">
                <Button variant="primary" size="lg" className="w-full">
                  <Sparkles size={16} />
                  أكمل معلوماتك الآن
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Info box */}
        {!loadingIntake && !intakeRecord && (
          <div className="mt-5 p-4 bg-[#006C35]/5 border border-[#006C35]/15 rounded-2xl text-center">
            <p className="text-xs text-[#006C35] font-bold leading-relaxed">
              بعد إرسال المعلومات، سنبدأ فوراً في تجهيز جميع خدماتك الست وإرسالها على واتساب خلال ٨ ساعات.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
