import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { track, EVENTS } from '../../lib/analytics';

export default function Login() {
  const { signIn, signInWithGoogle } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const redirect  = location.state?.from || '/dashboard';

  const [showPass, setShowPass]   = useState(false);
  const [loading,  setLoading]    = useState(false);
  const [gLoading, setGLoading]   = useState(false);
  const [error,    setError]      = useState('');
  const [form,     setForm]       = useState({ email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error: err } = await signIn(form.email, form.password);
    if (err) {
      setError(
        err.message.includes('Invalid login')
          ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
          : err.message.includes('Email not confirmed')
          ? 'يرجى تأكيد بريدك الإلكتروني أولاً'
          : 'حدث خطأ. حاول مرة أخرى.'
      );
      setLoading(false);
    } else {
      track(EVENTS.LOGIN, { method: 'email' });
      navigate(redirect, { replace: true });
    }
  };

  const handleGoogle = async () => {
    setGLoading(true);
    const { error: err } = await signInWithGoogle();
    if (err) { setError('فشل تسجيل الدخول عبر Google'); setGLoading(false); }
    // on success Supabase redirects automatically
  };

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
          <h1 className="text-2xl font-black text-gray-900 mb-1">مرحباً بعودتك</h1>
          <p className="text-gray-500 text-sm">سجّل دخولك للوصول إلى لوحة التحكم</p>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8">

          {/* Error */}
          {error && (
            <div className="mb-5 flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
              <AlertCircle size={14} className="text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700 font-bold">{error}</p>
            </div>
          )}

          {/* Google */}
          <button
            onClick={handleGoogle}
            disabled={gLoading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-bold text-sm text-gray-700 mb-5 disabled:opacity-60"
          >
            {gLoading ? (
              <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            الدخول عبر Google
          </button>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400">أو بالبريد الإلكتروني</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <Link to="/forgot-password" className="text-xs text-[#006C35] hover:underline font-bold">
                  نسيت كلمة المرور؟
                </Link>
                <label className="text-sm font-bold text-gray-700">كلمة المرور</label>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  required
                  className="w-full pr-10 pl-10 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006C35]/30 focus:border-[#006C35] transition-all"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <Button type="submit" variant="primary" size="lg" className="w-full" loading={loading}>
              تسجيل الدخول
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            ليس لديك حساب؟{' '}
            <Link to="/register" className="text-[#006C35] font-black hover:underline">
              أنشئ حساباً مجانياً
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          بتسجيل الدخول توافق على{' '}
          <a href="#" className="text-[#006C35] hover:underline">شروط الاستخدام</a>
          {' '}و{' '}
          <a href="#" className="text-[#006C35] hover:underline">سياسة الخصوصية</a>
        </p>
      </div>
    </div>
  );
}
