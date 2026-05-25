import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [password,  setPassword]  = useState('');
  const [confirm,   setConfirm]   = useState('');
  const [status,    setStatus]    = useState('idle'); // idle | loading | success | error
  const [message,   setMessage]   = useState('');
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    // Supabase sends the user here after clicking the reset link.
    // The URL contains hash params that Supabase SDK auto-processes into a session.
    supabase.auth.getSession().then(({ data }) => {
      setHasSession(!!data.session);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setMessage('كلمتا المرور غير متطابقتين');
      setStatus('error');
      return;
    }
    if (password.length < 8) {
      setMessage('كلمة المرور يجب أن تكون ٨ أحرف على الأقل');
      setStatus('error');
      return;
    }
    setStatus('loading');
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setMessage('فشل تحديث كلمة المرور. قد يكون الرابط منتهي الصلاحية — اطلب رابطاً جديداً.');
      setStatus('error');
    } else {
      setStatus('success');
      setTimeout(() => navigate('/dashboard'), 2000);
    }
  };

  if (!hasSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#006C35]/5 via-white to-[#C8A951]/5 flex items-center justify-center p-4" dir="rtl">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 p-8 text-center">
          <AlertCircle size={40} className="text-amber-500 mx-auto mb-4" />
          <h1 className="text-xl font-black text-gray-900 mb-2">رابط غير صالح</h1>
          <p className="text-sm text-gray-500 mb-6">
            هذا الرابط منتهي الصلاحية أو تم استخدامه بالفعل. يرجى طلب رابط استعادة جديد.
          </p>
          <button
            onClick={() => navigate('/forgot-password')}
            className="w-full py-3 text-sm font-bold text-white bg-[#006C35] rounded-xl hover:bg-[#005a2b] transition-all"
          >
            طلب رابط جديد
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#006C35]/5 via-white to-[#C8A951]/5 flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <span className="text-3xl font-black text-[#006C35]">قِمّة</span>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
          {status === 'success' ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle size={32} className="text-[#006C35]" />
              </div>
              <h1 className="text-xl font-black text-gray-900">تم تغيير كلمة المرور!</h1>
              <p className="text-sm text-gray-500">جاري تحويلك للوحة التحكم...</p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-black text-gray-900 mb-1">كلمة مرور جديدة</h1>
                <p className="text-sm text-gray-500">أدخل كلمة مرور قوية لحسابك.</p>
              </div>

              {status === 'error' && (
                <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-100 rounded-2xl mb-5">
                  <AlertCircle size={15} className="text-red-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-red-700">{message}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { label: 'كلمة المرور الجديدة', value: password, onChange: setPassword },
                  { label: 'تأكيد كلمة المرور',   value: confirm,  onChange: setConfirm  },
                ].map((f) => (
                  <div key={f.label}>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">{f.label}</label>
                    <div className="relative">
                      <Lock size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="password"
                        value={f.value}
                        onChange={(e) => f.onChange(e.target.value)}
                        placeholder="••••••••"
                        required
                        minLength={8}
                        className="w-full pr-9 pl-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006C35]/20 focus:border-[#006C35]"
                      />
                    </div>
                  </div>
                ))}

                <button
                  type="submit"
                  disabled={status === 'loading' || !password || !confirm}
                  className="w-full py-3 text-sm font-bold text-white bg-[#006C35] rounded-xl hover:bg-[#005a2b] active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {status === 'loading' ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      جاري التحديث…
                    </>
                  ) : 'تحديث كلمة المرور'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
