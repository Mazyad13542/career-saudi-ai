import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ShoppingCart, User, Phone, Mail, Briefcase, Clock, Link2, ChevronLeft, Loader2 } from 'lucide-react';

// ← ضع رقم واتساب الخاص بك هنا (مع كود الدولة بدون +)
const OWNER_WHATSAPP = '966500000000';

const SERVICES = [
  'تنظيم ملف LinkedIn احترافي',
  'موقع شخصي احترافي',
  'صورة شخصية احترافية',
  'سيرة ذاتية ATS محسّنة',
  'رسالة تقديم مخصصة',
  'التقديم على ٢٠٠ شركة سعودية',
];

export default function Order() {
  const [form, setForm] = useState({
    name: '', whatsapp: '', email: '',
    title: '', specialty: '', experience: '', linkedin: '', notes: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [payError, setPayError] = useState('');
  const [errors, setErrors] = useState({});

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const validate = () => {
    const e = {};
    if (!form.name.trim())      e.name      = 'مطلوب';
    if (!form.whatsapp.trim())  e.whatsapp  = 'مطلوب';
    if (!form.specialty.trim()) e.specialty = 'مطلوب';
    if (!form.experience)       e.experience= 'مطلوب';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setPayError('');

    try {
      const res = await fetch('/api/create-paylink', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          mobile: form.whatsapp,
          email: form.email,
          notes: [
            `المسمى: ${form.title || '—'}`,
            `التخصص: ${form.specialty}`,
            `الخبرة: ${form.experience}`,
            form.linkedin ? `LinkedIn: ${form.linkedin}` : null,
            form.notes || null,
          ].filter(Boolean).join(' | '),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.url) {
        setPayError('حدث خطأ في إنشاء رابط الدفع، يرجى المحاولة مرة أخرى.');
        setLoading(false);
        return;
      }

      window.location.href = data.url;
    } catch {
      setPayError('تعذّر الاتصال بخادم الدفع، يرجى المحاولة لاحقاً.');
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4" dir="rtl">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-10 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-[#006C35]/10 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={40} className="text-[#006C35]" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">تم إرسال طلبك! 🎉</h2>
          <p className="text-gray-500 text-sm mb-6 leading-relaxed">
            انتقلت إلى واتساب لإرسال معلوماتك. سنتواصل معك خلال <strong>٨ ساعات</strong> لتسليم جميع خدماتك.
          </p>
          <div className="space-y-2">
            <a
              href={`https://wa.me/${OWNER_WHATSAPP}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl font-black text-white text-sm"
              style={{ background: '#25D366' }}
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              افتح واتساب الآن
            </a>
            <Link to="/" className="block text-sm text-gray-400 hover:text-gray-600 font-bold py-2">
              العودة للصفحة الرئيسية
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 saudi-geo-pattern" dir="rtl">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#006C35]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-12">

        {/* Back */}
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 font-bold mb-8 transition-colors">
          <ChevronLeft size={15} />
          العودة للرئيسية
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* ── Left: Summary ──────────────────────────────── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Logo + title */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl gradient-saudi flex items-center justify-center shadow-saudi">
                <span className="text-white font-black text-xl">ق</span>
              </div>
              <div>
                <p className="font-black text-gray-900 text-lg leading-none">قِمّة</p>
                <p className="text-xs text-[#006C35] font-bold">خدمات مهنية تنفيذية</p>
              </div>
            </div>

            {/* Services included */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">الباقة الكاملة تشمل:</p>
              <ul className="space-y-2.5">
                {SERVICES.map((s, i) => (
                  <li key={i} className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-[#006C35]/15 flex items-center justify-center flex-shrink-0">
                      <CheckCircle size={11} className="text-[#006C35]" />
                    </div>
                    <span className="text-sm text-gray-700 font-bold">{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price */}
            <div className="relative rounded-2xl overflow-hidden" style={{ boxShadow: '0 0 28px rgba(0,108,53,0.15)' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-[#006C35] to-[#004d26]" />
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-l from-transparent via-[#C8A951]/60 to-transparent" />
              <div className="relative p-5 text-white text-right">
                <p className="text-xs text-green-300 font-bold mb-1">دفع مرة واحدة فقط</p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl font-black leading-none">١٩٩</span>
                  <span className="text-green-200 font-bold">ر.س</span>
                </div>
                <p className="text-xs text-green-300/70 mt-1">التسليم خلال ٨ ساعات على واتساب</p>
              </div>
            </div>

            {/* Guarantees */}
            <div className="space-y-2">
              {[
                'ضمان استرداد كامل خلال ٣٠ يوماً',
                'تسليم على واتساب خلال ٨ ساعات',
                'مراجعة مجانية عند الحاجة',
              ].map((g) => (
                <div key={g} className="flex items-center gap-2 text-xs text-gray-500 font-bold">
                  <span className="text-[#006C35]">✓</span>
                  {g}
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Form ──────────────────────────────────── */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-7 sm:p-8">

              <div className="flex items-center gap-3 mb-7">
                <div className="w-10 h-10 rounded-xl bg-[#006C35]/10 flex items-center justify-center">
                  <ShoppingCart size={18} className="text-[#006C35]" />
                </div>
                <div>
                  <h1 className="text-xl font-black text-gray-900">أكمل طلبك</h1>
                  <p className="text-xs text-gray-400">أدخل معلوماتك وسنتواصل معك فوراً</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Name */}
                <Field icon={User} label="الاسم الكامل *" error={errors.name}>
                  <input
                    type="text"
                    placeholder="محمد الغامدي"
                    value={form.name}
                    onChange={e => set('name', e.target.value)}
                    className={input(errors.name)}
                  />
                </Field>

                {/* WhatsApp */}
                <Field icon={Phone} label="رقم واتساب *" error={errors.whatsapp}>
                  <input
                    type="tel"
                    placeholder="05XXXXXXXX"
                    value={form.whatsapp}
                    onChange={e => set('whatsapp', e.target.value)}
                    className={input(errors.whatsapp)}
                    dir="ltr"
                  />
                </Field>

                {/* Email */}
                <Field icon={Mail} label="البريد الإلكتروني (اختياري)">
                  <input
                    type="email"
                    placeholder="example@email.com"
                    value={form.email}
                    onChange={e => set('email', e.target.value)}
                    className={input()}
                    dir="ltr"
                  />
                </Field>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Current title */}
                  <Field icon={Briefcase} label="المسمى الوظيفي الحالي">
                    <input
                      type="text"
                      placeholder="مهندس برمجيات"
                      value={form.title}
                      onChange={e => set('title', e.target.value)}
                      className={input()}
                    />
                  </Field>

                  {/* Experience */}
                  <Field icon={Clock} label="سنوات الخبرة *" error={errors.experience}>
                    <select
                      value={form.experience}
                      onChange={e => set('experience', e.target.value)}
                      className={input(errors.experience)}
                    >
                      <option value="">اختر</option>
                      <option>أقل من سنة (خريج)</option>
                      <option>١ – ٣ سنوات</option>
                      <option>٣ – ٥ سنوات</option>
                      <option>٥ – ١٠ سنوات</option>
                      <option>أكثر من ١٠ سنوات</option>
                    </select>
                  </Field>
                </div>

                {/* Specialty */}
                <Field icon={Briefcase} label="التخصص أو المجال *" error={errors.specialty}>
                  <input
                    type="text"
                    placeholder="هندسة برمجيات / محاسبة / تسويق..."
                    value={form.specialty}
                    onChange={e => set('specialty', e.target.value)}
                    className={input(errors.specialty)}
                  />
                </Field>

                {/* LinkedIn */}
                <Field icon={Link2} label="رابط LinkedIn (اختياري)">
                  <input
                    type="url"
                    placeholder="linkedin.com/in/username"
                    value={form.linkedin}
                    onChange={e => set('linkedin', e.target.value)}
                    className={input()}
                    dir="ltr"
                  />
                </Field>

                {/* Notes */}
                <div>
                  <label className="text-sm font-bold text-gray-700 block mb-1.5">ملاحظات إضافية (اختياري)</label>
                  <textarea
                    rows={3}
                    placeholder="أي معلومات إضافية تريد إضافتها..."
                    value={form.notes}
                    onChange={e => set('notes', e.target.value)}
                    className="w-full px-4 py-3 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006C35]/30 focus:border-[#006C35] transition-all resize-none"
                  />
                </div>

                {/* Error */}
                {payError && (
                  <p className="text-center text-sm text-red-500 font-bold bg-red-50 rounded-xl py-2 px-3">{payError}</p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-2xl font-black text-base text-white flex items-center justify-center gap-2.5 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100"
                  style={{ background: 'linear-gradient(135deg,#006C35,#00A651)', boxShadow: '0 6px 28px rgba(0,108,53,0.4)' }}
                >
                  {loading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      جارٍ إنشاء رابط الدفع...
                    </>
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white" aria-hidden="true"><path d="M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/></svg>
                      ادفع الآن — ١٩٩ ر.س
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-3 flex-wrap">
                  <span className="text-xs text-gray-400 font-bold">يدعم:</span>
                  <span className="text-xs font-black text-gray-600 px-2 py-0.5 bg-gray-100 rounded-lg">Apple Pay</span>
                  <span className="text-xs font-black text-gray-600 px-2 py-0.5 bg-gray-100 rounded-lg">مدى</span>
                  <span className="text-xs font-black text-gray-600 px-2 py-0.5 bg-gray-100 rounded-lg">Visa</span>
                  <span className="text-xs font-black text-gray-600 px-2 py-0.5 bg-gray-100 rounded-lg">Mastercard</span>
                </div>

                <p className="text-center text-xs text-gray-400">
                  دفع آمن عبر PayLink · التسليم خلال ٨ ساعات
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ icon: Icon, label, error, children }) {
  return (
    <div>
      <label className="text-sm font-bold text-gray-700 block mb-1.5">{label}</label>
      <div className="relative">
        {Icon && <Icon size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />}
        {children}
      </div>
      {error && <p className="text-xs text-red-500 mt-1 font-bold">{error}</p>}
    </div>
  );
}

function input(error) {
  return `w-full pr-10 pl-4 py-2.5 text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 transition-all ${
    error
      ? 'border-red-300 focus:ring-red-200 focus:border-red-400'
      : 'border-gray-200 focus:ring-[#006C35]/30 focus:border-[#006C35]'
  }`;
}
