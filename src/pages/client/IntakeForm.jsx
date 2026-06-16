import { useState } from 'react';
import { CheckCircle, ChevronRight, ChevronLeft } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

const TOTAL_STEPS = 4;

const REGIONS = [
  'الرياض', 'مكة المكرمة', 'المدينة المنورة', 'القصيم', 'المنطقة الشرقية',
  'عسير', 'تبوك', 'حائل', 'الحدود الشمالية', 'جازان', 'نجران', 'الباحة', 'الجوف',
];

const GRADUATION_YEARS = Array.from({ length: 17 }, (_, i) => String(2026 - i));

const EXPERIENCE_OPTIONS = [
  'حديث التخرج', 'أقل من سنة', '١-٣ سنوات', '٣-٥ سنوات', '٥-١٠ سنوات', 'أكثر من ١٠ سنوات',
];

const SECTORS = [
  'تقنية المعلومات', 'المالية والمصرفية', 'الموارد البشرية', 'التسويق',
  'الهندسة', 'الطب والصحة', 'التعليم', 'المبيعات', 'الإدارة والقيادة', 'أخرى',
];

const LANGUAGES_OPTIONS = ['العربية', 'الإنجليزية', 'الفرنسية', 'أخرى'];

const inputCls =
  'w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#006C35]/30 focus:border-[#006C35] bg-white transition';

const labelCls = 'block text-sm font-bold text-gray-700 mb-1.5';

function Field({ label, children }) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      {children}
    </div>
  );
}

export default function IntakeForm() {
  const { user } = useAuth();
  const [step, setStep]           = useState(1);
  const [loading, setLoading]     = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData]   = useState({
    // Step 1
    full_name: '',
    phone: '',
    region: '',
    city: '',
    // Step 2
    university: '',
    degree: '',
    major: '',
    graduation_year: '',
    // Step 3
    experience_years: '',
    last_job_title: '',
    last_company: '',
    skills: '',
    languages: [],
    target_job: '',
    target_sector: '',
    // Step 4
    linkedin_url: '',
    additional_info: '',
  });

  const set = (key, val) => setFormData((prev) => ({ ...prev, [key]: val }));

  const toggleLanguage = (lang) => {
    setFormData((prev) => {
      const langs = prev.languages.includes(lang)
        ? prev.languages.filter((l) => l !== lang)
        : [...prev.languages, lang];
      return { ...prev, languages: langs };
    });
  };

  const handleSubmit = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const { error } = await supabase.from('client_intake').upsert(
        {
          user_id:          user.id,
          full_name:        formData.full_name,
          phone:            formData.phone,
          region:           formData.region,
          city:             formData.city,
          university:       formData.university,
          degree:           formData.degree,
          major:            formData.major,
          graduation_year:  formData.graduation_year,
          experience_years: formData.experience_years,
          last_job_title:   formData.last_job_title,
          last_company:     formData.last_company,
          skills:           formData.skills,
          languages:        formData.languages,
          target_job:       formData.target_job,
          target_sector:    formData.target_sector,
          linkedin_url:     formData.linkedin_url,
          additional_info:  formData.additional_info,
          updated_at:       new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      );
      if (error) throw error;
      setSubmitted(true);
    } catch (err) {
      console.error('Intake submit error:', err);
      alert('حدث خطأ أثناء الحفظ. حاول مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <DashboardLayout>
        <div className="max-w-lg mx-auto mt-12 text-center" dir="rtl">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10">
            <CheckCircle size={56} className="text-[#006C35] mx-auto mb-5" />
            <h2 className="text-xl font-black text-gray-900 mb-3">تم إرسال معلوماتك بنجاح!</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              سنتواصل معك خلال <span className="font-black text-[#006C35]">٨ ساعات</span> على واتساب بجميع خدماتك جاهزة.
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-xl mx-auto" dir="rtl">

        {/* Header */}
        <div className="mb-6 text-right">
          <h1 className="text-2xl font-black text-gray-900 mb-1">استمارة المعلومات</h1>
          <p className="text-sm text-gray-500">أملأ معلوماتك حتى نبدأ تجهيز خدماتك الست.</p>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs font-bold text-gray-500 mb-2">
            <span>الخطوة {step} من {TOTAL_STEPS}</span>
            <span>{Math.round((step / TOTAL_STEPS) * 100)}٪</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#006C35] rounded-full transition-all duration-500"
              style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
            />
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">

          {/* ── Step 1: Personal Info ── */}
          {step === 1 && (
            <>
              <h2 className="font-black text-gray-900 text-base mb-2">المعلومات الشخصية</h2>
              <Field label="الاسم الكامل">
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => set('full_name', e.target.value)}
                  className={inputCls}
                  placeholder="محمد علي الشمري"
                />
              </Field>
              <Field label="رقم الجوال">
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => set('phone', e.target.value)}
                  className={inputCls}
                  placeholder="05XXXXXXXX"
                  dir="ltr"
                />
              </Field>
              <Field label="المنطقة">
                <select
                  value={formData.region}
                  onChange={(e) => set('region', e.target.value)}
                  className={inputCls}
                >
                  <option value="">اختر المنطقة</option>
                  {REGIONS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </Field>
              <Field label="المدينة">
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => set('city', e.target.value)}
                  className={inputCls}
                  placeholder="أدخل اسم المدينة"
                />
              </Field>
            </>
          )}

          {/* ── Step 2: Education ── */}
          {step === 2 && (
            <>
              <h2 className="font-black text-gray-900 text-base mb-2">التعليم</h2>
              <Field label="الجامعة أو المؤسسة التعليمية">
                <input
                  type="text"
                  value={formData.university}
                  onChange={(e) => set('university', e.target.value)}
                  className={inputCls}
                  placeholder="جامعة الملك سعود"
                />
              </Field>
              <Field label="الدرجة العلمية">
                <select
                  value={formData.degree}
                  onChange={(e) => set('degree', e.target.value)}
                  className={inputCls}
                >
                  <option value="">اختر الدرجة</option>
                  {['بكالوريوس', 'ماجستير', 'دكتوراه', 'دبلوم', 'ثانوية عامة'].map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </Field>
              <Field label="التخصص">
                <input
                  type="text"
                  value={formData.major}
                  onChange={(e) => set('major', e.target.value)}
                  className={inputCls}
                  placeholder="علوم الحاسب"
                />
              </Field>
              <Field label="سنة التخرج">
                <select
                  value={formData.graduation_year}
                  onChange={(e) => set('graduation_year', e.target.value)}
                  className={inputCls}
                >
                  <option value="">اختر السنة</option>
                  {GRADUATION_YEARS.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </Field>
            </>
          )}

          {/* ── Step 3: Experience & Skills ── */}
          {step === 3 && (
            <>
              <h2 className="font-black text-gray-900 text-base mb-2">الخبرة والمهارات</h2>
              <Field label="سنوات الخبرة">
                <select
                  value={formData.experience_years}
                  onChange={(e) => set('experience_years', e.target.value)}
                  className={inputCls}
                >
                  <option value="">اختر مستوى الخبرة</option>
                  {EXPERIENCE_OPTIONS.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </Field>
              <Field label="آخر مسمى وظيفي">
                <input
                  type="text"
                  value={formData.last_job_title}
                  onChange={(e) => set('last_job_title', e.target.value)}
                  className={inputCls}
                  placeholder="آخر مسمى وظيفي"
                />
              </Field>
              <Field label="آخر جهة عمل">
                <input
                  type="text"
                  value={formData.last_company}
                  onChange={(e) => set('last_company', e.target.value)}
                  className={inputCls}
                  placeholder="آخر جهة عمل"
                />
              </Field>
              <Field label="المهارات">
                <textarea
                  value={formData.skills}
                  onChange={(e) => set('skills', e.target.value)}
                  className={`${inputCls} min-h-[90px] resize-none`}
                  placeholder="اكتب مهاراتك مفصولة بفواصل"
                />
              </Field>
              <Field label="اللغات">
                <div className="flex flex-wrap gap-3">
                  {LANGUAGES_OPTIONS.map((lang) => (
                    <label key={lang} className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={formData.languages.includes(lang)}
                        onChange={() => toggleLanguage(lang)}
                        className="w-4 h-4 accent-[#006C35] rounded"
                      />
                      <span className="text-sm text-gray-700">{lang}</span>
                    </label>
                  ))}
                </div>
              </Field>
              <Field label="الوظيفة المستهدفة">
                <input
                  type="text"
                  value={formData.target_job}
                  onChange={(e) => set('target_job', e.target.value)}
                  className={inputCls}
                  placeholder="الوظيفة التي تبحث عنها"
                />
              </Field>
              <Field label="القطاع المستهدف">
                <select
                  value={formData.target_sector}
                  onChange={(e) => set('target_sector', e.target.value)}
                  className={inputCls}
                >
                  <option value="">اختر القطاع</option>
                  {SECTORS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </Field>
            </>
          )}

          {/* ── Step 4: Additional Info ── */}
          {step === 4 && (
            <>
              <h2 className="font-black text-gray-900 text-base mb-2">معلومات إضافية</h2>
              <Field label="رابط LinkedIn الحالي (اختياري)">
                <input
                  type="text"
                  value={formData.linkedin_url}
                  onChange={(e) => set('linkedin_url', e.target.value)}
                  className={inputCls}
                  placeholder="رابط LinkedIn الحالي إن وجد"
                  dir="ltr"
                />
              </Field>
              <Field label="معلومات إضافية (اختياري)">
                <textarea
                  value={formData.additional_info}
                  onChange={(e) => set('additional_info', e.target.value)}
                  className={`${inputCls} min-h-[100px] resize-none`}
                  placeholder="أي معلومات إضافية تريد إضافتها"
                />
              </Field>
              {/* WhatsApp note */}
              <div className="p-4 bg-[#006C35]/5 border border-[#006C35]/15 rounded-xl flex items-start gap-3">
                <span className="text-lg flex-shrink-0">📱</span>
                <p className="text-xs text-[#006C35] font-bold leading-relaxed">
                  سيتم التواصل معك على رقم الجوال المُدخل في الخطوة الأولى عبر واتساب.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between mt-5">
          {step > 1 ? (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="flex items-center gap-2 border border-gray-200 text-gray-600 px-6 py-3 rounded-xl hover:bg-gray-50 text-sm font-bold transition"
            >
              <ChevronRight size={16} />
              السابق
            </button>
          ) : (
            <div />
          )}

          {step < TOTAL_STEPS ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              className="flex items-center gap-2 bg-[#006C35] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#005528] text-sm transition"
            >
              التالي
              <ChevronLeft size={16} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 bg-[#006C35] text-white font-bold px-8 py-3 rounded-xl hover:bg-[#005528] text-sm transition disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  جاري الإرسال...
                </span>
              ) : (
                <>
                  <CheckCircle size={16} />
                  إرسال المعلومات
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
