import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ChevronLeft, ChevronRight, Loader2, Briefcase, MapPin, GraduationCap, Code, Crown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const SECTORS = ['تقنية المعلومات', 'المالية والمحاسبة', 'الهندسة', 'التسويق والمبيعات', 'الموارد البشرية', 'الرعاية الصحية', 'التعليم', 'الإدارة', 'القانون', 'العمليات والإنتاج'];
const CITIES  = ['الرياض', 'جدة', 'مكة المكرمة', 'المدينة المنورة', 'الدمام', 'الخبر', 'الظهران', 'القصيم', 'تبوك', 'أبها', 'جازان', 'نجران', 'حائل', 'ينبع', 'الجبيل'];
const JOB_TYPES = ['دوام كامل', 'دوام جزئي', 'عقد', 'عمل حر', 'تدريب'];
const EXP_LEVELS = [
  { label: 'حديث التخرج (بدون خبرة)', years: 0 },
  { label: '١–٢ سنوات', years: 1 },
  { label: '٣–٥ سنوات', years: 3 },
  { label: '٦–٩ سنوات', years: 6 },
  { label: '١٠+ سنوات', years: 10 },
];
const EDUCATION = ['ثانوية عامة', 'دبلوم', 'بكالوريوس', 'ماجستير', 'دكتوراه'];
const POPULAR_SKILLS = {
  'تقنية المعلومات': ['JavaScript', 'React', 'Python', 'Node.js', 'SQL', 'AWS', 'Docker', 'TypeScript', 'Flutter', 'Git'],
  'المالية والمحاسبة': ['Excel', 'IFRS', 'SAP', 'Financial Modeling', 'Audit', 'Tax', 'QuickBooks', 'CFA', 'Power BI'],
  'الهندسة': ['AutoCAD', 'Revit', 'PMP', 'ISO', 'Six Sigma', 'HVAC', 'Structural', 'HSE', 'Primavera'],
  'التسويق والمبيعات': ['SEO', 'Google Ads', 'Meta Ads', 'CRM', 'Salesforce', 'Content', 'Email Marketing', 'Analytics'],
  'الموارد البشرية': ['LinkedIn Recruiter', 'ATS', 'SAP HR', 'Performance Management', 'Training', 'HRIS'],
  'الرعاية الصحية': ['Patient Care', 'EMR', 'BLS', 'ACLS', 'Clinical', 'Pharmacology'],
  'default': ['Communication', 'Microsoft Office', 'Leadership', 'Problem Solving', 'Arabic', 'English', 'Teamwork', 'Project Management'],
};

const STEPS = [
  { id: 'role',        label: 'دورك',          icon: Briefcase },
  { id: 'location',   label: 'الموقع',         icon: MapPin },
  { id: 'experience', label: 'الخبرة',         icon: GraduationCap },
  { id: 'skills',     label: 'المهارات',        icon: Code },
  { id: 'preferences',label: 'التفضيلات',      icon: CheckCircle },
];

export default function Onboarding() {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);

  const [data, setData] = useState({
    job_title:           '',
    preferred_sectors:   [],
    city:                '',
    preferred_cities:    [],
    experience_years:    0,
    education_level:     '',
    fresh_graduate:      false,
    skills:              [],
    preferred_job_types: [],
    open_to_remote:      false,
    expected_salary:     '',
  });

  const setField = (k, v) => setData(d => ({ ...d, [k]: v }));
  const toggleArr = (k, v) => setData(d => ({
    ...d,
    [k]: d[k].includes(v) ? d[k].filter(x => x !== v) : [...d[k], v],
  }));

  const suggestedSkills = [
    ...(POPULAR_SKILLS[data.preferred_sectors[0]] || []),
    ...POPULAR_SKILLS.default,
  ].filter((s, i, a) => a.indexOf(s) === i).slice(0, 12);

  async function finish() {
    setSaving(true);
    await updateProfile({
      job_title:           data.job_title,
      city:                data.city,
      preferred_sectors:   data.preferred_sectors,
      preferred_cities:    data.preferred_cities.length ? data.preferred_cities : [data.city],
      experience_years:    data.experience_years,
      education_level:     data.education_level,
      fresh_graduate:      data.fresh_graduate,
      skills:              data.skills,
      preferred_job_types: data.preferred_job_types,
      open_to_remote:      data.open_to_remote,
      expected_salary:     data.expected_salary ? parseInt(data.expected_salary) : null,
      onboarding_done:     true,
    });

    // Create onboarding record
    if (user) {
      await supabase.from('onboarding').upsert({
        user_id:      user.id,
        completed:    true,
        step:         STEPS.length,
        steps_done:   STEPS.map(s => s.id),
        completed_at: new Date().toISOString(),
      });
    }

    setSaving(false);
    navigate('/dashboard');
  }

  const canNext = [
    data.job_title.length >= 2 || data.preferred_sectors.length > 0,
    data.city.length > 0,
    data.education_level.length > 0,
    data.skills.length >= 2,
    true,
  ][step];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#006C35]/5 via-white to-[#C8A951]/5 flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl gradient-saudi flex items-center justify-center shadow-saudi">
              <span className="text-white font-black text-lg">ق</span>
            </div>
            <span className="font-black text-xl text-gray-900">قِمّة</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-1">أهلاً بك! دعنا نخصّص تجربتك</h1>
          <p className="text-gray-500 text-sm">سيستغرق هذا أقل من دقيقتين</p>
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all
                ${i < step ? 'bg-[#006C35] text-white' : i === step ? 'bg-[#006C35] text-white ring-4 ring-[#006C35]/20' : 'bg-gray-100 text-gray-400'}`}>
                {i < step ? <CheckCircle size={14} /> : i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`w-8 h-0.5 mx-1 rounded ${i < step ? 'bg-[#006C35]' : 'bg-gray-100'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-black text-gray-900 text-right">{STEPS[step].label}</h2>
          </div>

          <div className="p-6">
            {/* Step 0: Role & Sector */}
            {step === 0 && (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-black text-gray-700 mb-2 text-right">مسماك الوظيفي الحالي أو المستهدف</label>
                  <input
                    value={data.job_title}
                    onChange={e => setField('job_title', e.target.value)}
                    placeholder="مثال: مطوّر Full Stack، محلل مالي، مهندس مدني..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#006C35]/20 focus:border-[#006C35] text-right"
                  />
                </div>
                <div>
                  <label className="block text-sm font-black text-gray-700 mb-2 text-right">القطاع المهني (اختر ما يناسبك)</label>
                  <div className="grid grid-cols-2 gap-2">
                    {SECTORS.map(s => (
                      <button
                        key={s}
                        onClick={() => toggleArr('preferred_sectors', s)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all text-right
                          ${data.preferred_sectors.includes(s)
                            ? 'bg-[#006C35] text-white border-[#006C35]'
                            : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-[#006C35]/40'}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 1: Location */}
            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-black text-gray-700 mb-2 text-right">مدينتك الحالية</label>
                  <div className="grid grid-cols-3 gap-2">
                    {CITIES.slice(0, 9).map(c => (
                      <button
                        key={c}
                        onClick={() => setField('city', c)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all
                          ${data.city === c
                            ? 'bg-[#006C35] text-white border-[#006C35]'
                            : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-[#006C35]/40'}`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={data.open_to_remote}
                      onChange={e => setField('open_to_remote', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#006C35]" />
                  </label>
                  <div className="text-right">
                    <p className="text-sm font-black text-gray-900">منفتح على العمل عن بُعد</p>
                    <p className="text-xs text-gray-500">ستظهر لك فرص Remote من كل مكان</p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Experience */}
            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-black text-gray-700 mb-2 text-right">سنوات الخبرة</label>
                  <div className="space-y-2">
                    {EXP_LEVELS.map(e => (
                      <button
                        key={e.label}
                        onClick={() => { setField('experience_years', e.years); setField('fresh_graduate', e.years === 0); }}
                        className={`w-full px-4 py-3 rounded-xl text-sm font-bold border transition-all text-right
                          ${data.experience_years === e.years
                            ? 'bg-[#006C35] text-white border-[#006C35]'
                            : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-[#006C35]/40'}`}
                      >
                        {e.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-black text-gray-700 mb-2 text-right">المستوى التعليمي</label>
                  <div className="grid grid-cols-3 gap-2">
                    {EDUCATION.map(e => (
                      <button
                        key={e}
                        onClick={() => setField('education_level', e)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all
                          ${data.education_level === e
                            ? 'bg-[#006C35] text-white border-[#006C35]'
                            : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-[#006C35]/40'}`}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Skills */}
            {step === 3 && (
              <div className="space-y-4">
                <p className="text-sm text-gray-500 text-right">اختر مهاراتك (على الأقل ٢)</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedSkills.map(s => (
                    <button
                      key={s}
                      onClick={() => toggleArr('skills', s)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all
                        ${data.skills.includes(s)
                          ? 'bg-[#006C35] text-white border-[#006C35]'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-[#006C35]/40'}`}
                    >
                      {data.skills.includes(s) ? '✓ ' : ''}{s}
                    </button>
                  ))}
                </div>
                <div>
                  <input
                    placeholder="أضف مهارة يدوياً ثم اضغط Enter..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#006C35]/20 focus:border-[#006C35] text-right"
                    onKeyDown={e => {
                      if (e.key === 'Enter' && e.target.value.trim()) {
                        toggleArr('skills', e.target.value.trim());
                        e.target.value = '';
                      }
                    }}
                  />
                </div>
                <div className="text-xs text-[#006C35] font-bold text-right">
                  {data.skills.length} مهارة مختارة
                </div>
              </div>
            )}

            {/* Step 4: Preferences */}
            {step === 4 && (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-black text-gray-700 mb-2 text-right">نوع الدوام المفضّل</label>
                  <div className="flex flex-wrap gap-2">
                    {JOB_TYPES.map(t => (
                      <button
                        key={t}
                        onClick={() => toggleArr('preferred_job_types', t)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all
                          ${data.preferred_job_types.includes(t)
                            ? 'bg-[#006C35] text-white border-[#006C35]'
                            : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-[#006C35]/40'}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-black text-gray-700 mb-2 text-right">الراتب الشهري المتوقع (ريال)</label>
                  <input
                    type="number"
                    value={data.expected_salary}
                    onChange={e => setField('expected_salary', e.target.value)}
                    placeholder="مثال: 15000"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#006C35]/20 focus:border-[#006C35] text-right"
                  />
                </div>
                <div className="p-4 bg-gradient-to-l from-[#C8A951]/10 to-[#006C35]/10 rounded-2xl border border-[#C8A951]/20">
                  <div className="flex items-center gap-2 justify-end mb-1">
                    <span className="text-sm font-black text-gray-900">الخطة الاحترافية</span>
                    <Crown size={14} className="text-[#C8A951]" />
                  </div>
                  <p className="text-xs text-gray-500 text-right leading-relaxed mb-2">
                    وصول غير محدود لجميع الميزات — مقابلات، ATS scoring، مطابقة متقدمة
                  </p>
                  <p className="text-sm font-black text-[#006C35] text-right">٩٩ ريال/شهر فقط</p>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="px-6 py-4 border-t border-gray-50 flex items-center justify-between">
            <button
              onClick={() => step > 0 && setStep(s => s - 1)}
              disabled={step === 0}
              className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} />
              السابق
            </button>

            <span className="text-xs text-gray-400">{step + 1} / {STEPS.length}</span>

            {step < STEPS.length - 1 ? (
              <button
                onClick={() => setStep(s => s + 1)}
                disabled={!canNext}
                className="flex items-center gap-1 px-5 py-2 rounded-xl text-sm font-bold bg-[#006C35] text-white hover:bg-[#005a2b] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                التالي
                <ChevronLeft size={16} />
              </button>
            ) : (
              <button
                onClick={finish}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold bg-[#006C35] text-white hover:bg-[#005a2b] disabled:opacity-50 transition-colors"
              >
                {saving ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                ابدأ الاستخدام
              </button>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          يمكنك تعديل هذه المعلومات لاحقاً من إعدادات الملف المهني
        </p>
      </div>
    </div>
  );
}
