import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  const [email,   setEmail]   = useState('');
  const [status,  setStatus]  = useState('idle'); // idle | loading | success | error
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');
    const { error } = await resetPassword(email.trim());
    if (error) {
      setMessage('تعذّر إرسال رابط الاستعادة. تحقق من البريد الإلكتروني وحاول مرة أخرى.');
      setStatus('error');
    } else {
      setStatus('success');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#006C35]/5 via-white to-[#C8A951]/5 flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex flex-col items-center gap-1">
            <span className="text-3xl font-black text-[#006C35]">قِمّة</span>
            <span className="text-xs text-gray-400">منصة التوظيف الذكي</span>
          </Link>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">

          {status === 'success' ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle size={32} className="text-[#006C35]" />
              </div>
              <h1 className="text-xl font-black text-gray-900">تحقق من بريدك الإلكتروني</h1>
              <p className="text-sm text-gray-500 leading-relaxed">
                أرسلنا رابط استعادة كلمة المرور إلى <span className="font-bold text-gray-800">{email}</span>.
                تحقق من صندوق الوارد أو مجلد الرسائل غير المرغوب فيها.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 mt-2 text-sm font-bold text-[#006C35] hover:underline"
              >
                <ArrowRight size={14} />
                العودة لتسجيل الدخول
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-black text-gray-900 mb-1">استعادة كلمة المرور</h1>
                <p className="text-sm text-gray-500">
                  أدخل بريدك الإلكتروني وسنرسل لك رابط الاستعادة.
                </p>
              </div>

              {status === 'error' && (
                <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-100 rounded-2xl mb-5">
                  <AlertCircle size={15} className="text-red-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-red-700">{message}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">
                    البريد الإلكتروني
                  </label>
                  <div className="relative">
                    <Mail size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      required
                      className="w-full pr-9 pl-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006C35]/20 focus:border-[#006C35] text-right"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={status === 'loading' || !email.trim()}
                  className="w-full py-3 text-sm font-bold text-white bg-[#006C35] rounded-xl hover:bg-[#005a2b] active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {status === 'loading' ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      جاري الإرسال…
                    </>
                  ) : 'إرسال رابط الاستعادة'}
                </button>
              </form>

              <p className="text-center text-sm text-gray-500 mt-6">
                تذكرت كلمة المرور؟{' '}
                <Link to="/login" className="font-bold text-[#006C35] hover:underline">
                  تسجيل الدخول
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
