import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { track, EVENTS } from '../../lib/analytics';

export default function Register() {
  const { signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [step,    setStep]    = useState(1);
  const [loading, setLoading] = useState(false);
  const [gLoad,   setGLoad]   = useState(false);
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState(false);
  const [form,    setForm]    = useState({
    fullName: '', email: '', password: '', confirm: '',
  });

  const handleGoogle = async () => {
    setGLoad(true);
    const { error: err } = await signInWithGoogle();
    if (err) { setError('فشل الدخول عبر Google'); setGLoad(false); }
  };

  const handleStep1 = (e) => {
    e.preventDefault();
    if (!form.fullName.trim() || !form.email.trim()) return;
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) {
      setError('كلمتا المرور غير متطابقتين');
      return;
    }
    if (form.password.length < 8) {
      setError('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
      return;
    }
    setLoading(true);
    const { error: err } = await signUp(form.email, form.password, form.fullName);
    if (err) {
      setError(
        err.message.includes('already registered')
          ? 'هذا البريد مسجّل بالفعل'
          : 'حدث خطأ. حاول مرة أخرى.'
      );
      setLoading(false);
    } else {
      track(EVENTS.REGISTER, { method: 'email' });
      setSuccess(true);
      // If email confirmation is disabled in Supabase, redirect immediately
      setTimeout(() => navigate('/dashboard'), 1500);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4" dir="rtl">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-10 max-w-sm w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={30} className="text-green-600" />
          </div>
          <h2 className="text-xl font-black text-gray-900 mb-2">تم إنشاء حسابك! 🎉</h2>
          <p className="text-sm text-gray-400">جاري تحويلك إلى لوحة التحكم…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 saudi-geo-pattern flex items-center justify-center p-4" dir="rtl">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#006C35]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="flex flex-col leading-none text-right">
              <span className="font-black text-gray-900 text-lg">قِمّة</span>
            </div>
            <div className="w-10 h-10 rounded-2xl gradient-saudi flex items-center justify-center shadow-saudi">
              <span className="text-white font-black text-lg">ق</span>
            </div>
          </Link>
          <h1 className="text-2xl font-black text-gray-900 mb-1">أنشئ حسابك</h1>
          <p className="text-gray-500 text-sm">انضم إلى أكثر من ٥٠,٠٠٠ مهني سعودي</p>
        </div>

        {/* Progress */}
        <div className="flex gap-2 mb-6">
          {[1, 2].map((s) => (
            <div
              key={s}
              className={`flex-1 h-1 rounded-full transition-all duration-300 ${step >= s ? 'bg-[#006C35]' : 'bg-gray-200'}`}
            />
          ))}
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8">
          {error && (
            <div className="mb-5 flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
              <AlertCircle size={14} className="text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700 font-bold">{error}</p>
            </div>
          )}

          {step === 1 && (
            <>
              {/* Google */}
              <button
                onClick={handleGoogle}
                disabled={gLoad}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-bold text-sm text-gray-700 mb-5 disabled:opacity-60"
              >
                {gLoad ? (
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                )}
                التسجيل عبر Google
              </button>

              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-xs text-gray-400">أو بالبريد الإلكتروني</span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>

              <form onSubmit={handleStep1} className="space-y-4">
                <div>
                  <label className="text-sm font-bold text-gray-700 block mb-1.5">الاسم الكامل</label>
                  <div className="relative">
                    <User size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="محمد الغامدي"
                      required
                      className="w-full pr-10 pl-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006C35]/30 focus:border-[#006C35] transition-all text-right"
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-bold text-gray-700 block mb-1.5">البريد الإلكتروني</label>
                  <div className="relative">
                    <Mail size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      placeholder="example@email.com"
                      required
                      className="w-full pr-10 pl-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006C35]/30 focus:border-[#006C35] transition-all"
                      dir="ltr"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>
                </div>

                <Button type="submit" variant="primary" size="lg" className="w-full">
                  التالي
                </Button>
              </form>
            </>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="text-center p-4 bg-[#006C35]/5 rounded-2xl border border-[#006C35]/15">
                <span className="text-2xl">🚀</span>
                <p className="text-sm font-bold text-gray-700 mt-1">أضف كلمة مرور لحسابك</p>
              </div>

              <div>
                <label className="text-sm font-bold text-gray-700 block mb-1.5">كلمة المرور</label>
                <div className="relative">
                  <Lock size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    placeholder="٨ أحرف على الأقل"
                    required
                    minLength={8}
                    className="w-full pr-10 pl-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006C35]/30 focus:border-[#006C35] transition-all"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-bold text-gray-700 block mb-1.5">تأكيد كلمة المرور</label>
                <div className="relative">
                  <Lock size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    placeholder="أعد كتابة كلمة المرور"
                    required
                    className="w-full pr-10 pl-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006C35]/30 focus:border-[#006C35] transition-all"
                    value={form.confirm}
                    onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                  />
                </div>
              </div>

              <label className="flex items-start gap-2 cursor-pointer">
                <span className="text-xs text-gray-500 flex-1">
                  بالتسجيل أوافق على{' '}
                  <a href="#" className="text-[#006C35] hover:underline font-bold">شروط الاستخدام</a>
                  {' '}و{' '}
                  <a href="#" className="text-[#006C35] hover:underline font-bold">سياسة الخصوصية</a>
                </span>
                <input type="checkbox" required className="mt-0.5 accent-[#006C35] flex-shrink-0" />
              </label>

              <div className="flex gap-3">
                <Button type="button" variant="secondary" size="lg" onClick={() => setStep(1)} className="flex-1">
                  رجوع
                </Button>
                <Button type="submit" variant="primary" size="lg" loading={loading} className="flex-1">
                  إنشاء الحساب
                </Button>
              </div>
            </form>
          )}

          <p className="text-center text-sm text-gray-500 mt-5">
            لديك حساب بالفعل؟{' '}
            <Link to="/login" className="text-[#006C35] font-black hover:underline">سجّل الدخول</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
