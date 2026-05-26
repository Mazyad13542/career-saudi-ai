import { useState, useEffect } from 'react';
import { UserCircle, Plus, Trash2, CheckCircle, AlertCircle, Eye, Save, Loader2 } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { useAuth } from '../../context/AuthContext';

const EMPTY_PROFILE = {
  nameAr: '',
  nameEn: '',
  specialty: '',
  university: '',
  graduationYear: '',
  city: 'الرياض',
  bio: '',
  skills: [],
  languages: [
    { lang: 'العربية', level: 'لغة أم' },
    { lang: 'الإنجليزية', level: 'متوسط (C)' },
  ],
  experience:     [],
  certifications: [],
  projects:       [],
};

const fields = [
  { key: 'nameAr',         label: 'الاسم بالعربية',    placeholder: 'محمد الغامدي',      type: 'text' },
  { key: 'nameEn',         label: 'الاسم بالإنجليزية', placeholder: 'Mohammed Al-Ghamdi', type: 'text' },
  { key: 'specialty',      label: 'التخصص المهني',      placeholder: 'هندسة البرمجيات',   type: 'text' },
  { key: 'university',     label: 'الجامعة',             placeholder: 'جامعة الملك سعود',  type: 'text' },
  { key: 'graduationYear', label: 'سنة التخرج',         placeholder: '٢٠٢٢',              type: 'text' },
];

const saudiCities = ['الرياض', 'جدة', 'الدمام', 'الظهران', 'مكة المكرمة', 'المدينة المنورة', 'تبوك', 'أبها', 'القطيف'];

function completionOf(p) {
  const sections = [
    { label: 'المعلومات الأساسية', done: !!(p.nameAr && p.specialty) },
    { label: 'النبذة الشخصية',     done: p.bio?.length > 20 },
    { label: 'المهارات',           done: p.skills?.length > 0 },
    { label: 'اللغات',             done: p.languages?.length > 0 },
    { label: 'الخبرات',            done: p.experience?.length > 0 },
    { label: 'الشهادات',           done: p.certifications?.length > 0 },
    { label: 'المشاريع',           done: p.projects?.length > 0 },
  ];
  return sections;
}

export default function ProfessionalProfile() {
  const { profile: authProfile, updateProfile, loading: authLoading } = useAuth();
  const [profile,   setProfile]   = useState(EMPTY_PROFILE);
  const [newSkill,  setNewSkill]  = useState('');
  const [activeTab, setActiveTab] = useState('info');
  const [saving,    setSaving]    = useState(false);
  const [saved,     setSaved]     = useState(false);

  // Hydrate from Supabase profile on load
  useEffect(() => {
    if (!authProfile) return;
    const pd = authProfile.profile_data ?? {};
    setProfile({
      nameAr:         pd.nameAr         ?? authProfile.full_name ?? '',
      nameEn:         pd.nameEn         ?? '',
      specialty:      pd.specialty      ?? authProfile.job_title ?? '',
      university:     pd.university     ?? '',
      graduationYear: pd.graduationYear ?? '',
      city:           pd.city           ?? authProfile.city ?? 'الرياض',
      bio:            pd.bio            ?? authProfile.bio ?? '',
      skills:         pd.skills         ?? [],
      languages:      pd.languages      ?? [{ lang: 'العربية', level: 'لغة أم' }, { lang: 'الإنجليزية', level: 'متوسط (C)' }],
      experience:     pd.experience     ?? [],
      certifications: pd.certifications ?? [],
      projects:       pd.projects       ?? [],
    });
  }, [authProfile]);

  const completionSections = completionOf(profile);
  const completedCount     = completionSections.filter((s) => s.done).length;
  const completionPct      = Math.round((completedCount / completionSections.length) * 100);

  const update = (key, val) => setProfile((p) => ({ ...p, [key]: val }));
  const addSkill    = () => { if (newSkill.trim()) { update('skills', [...profile.skills, newSkill.trim()]); setNewSkill(''); } };
  const removeSkill = (i) => update('skills', profile.skills.filter((_, idx) => idx !== i));

  const handleSave = async () => {
    setSaving(true);
    const { error } = await updateProfile({
      full_name:       profile.nameAr || authProfile?.full_name,
      job_title:       profile.specialty,
      city:            profile.city,
      bio:             profile.bio,
      skills:          profile.skills,          // top-level column for AI matching
      education_level: profile.university ? 'بكالوريوس' : undefined,
      experience_years: profile.experience?.length > 0
        ? Math.max(...profile.experience.map(e => {
            const from = parseInt(e.from) || 2020;
            const to   = e.current ? new Date().getFullYear() : (parseInt(e.to) || 2023);
            return to - from;
          }).filter(y => y >= 0), 0)
        : undefined,
      profile_data: {
        nameAr:         profile.nameAr,
        nameEn:         profile.nameEn,
        specialty:      profile.specialty,
        university:     profile.university,
        graduationYear: profile.graduationYear,
        city:           profile.city,
        bio:            profile.bio,
        skills:         profile.skills,
        languages:      profile.languages,
        experience:     profile.experience,
        certifications: profile.certifications,
        projects:       profile.projects,
      },
    });
    setSaving(false);
    if (!error) { setSaved(true); setTimeout(() => setSaved(false), 2500); }
  };

  const tabs = [
    { key: 'info',       label: 'المعلومات الأساسية' },
    { key: 'skills',     label: 'المهارات واللغات' },
    { key: 'experience', label: 'الخبرات' },
    { key: 'certs',      label: 'الشهادات والمشاريع' },
  ];

  if (authLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 size={32} className="animate-spin text-[#006C35]" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-3">
          <Button variant="primary" size="sm" onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 size={14} className="animate-spin" /> : saved ? <CheckCircle size={14} /> : <Save size={14} />}
            {saving ? 'جاري الحفظ...' : saved ? 'تم الحفظ ✓' : 'حفظ الملف'}
          </Button>
        </div>
        <div className="text-right">
          <h1 className="text-2xl font-black text-gray-900">ملفي المهني</h1>
          <p className="text-gray-500 text-sm mt-0.5">بنِ هويتك المهنية — هذا ما تراه الشركات عند البحث عنك</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar: Completion */}
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm text-center">
            <div className="w-20 h-20 rounded-2xl gradient-saudi flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl font-black text-white">
                {(profile.nameAr || 'م').split(' ').map((w) => w[0]).join('').slice(0, 2)}
              </span>
            </div>
            <p className="font-black text-gray-900">{profile.nameAr || authProfile?.full_name || '—'}</p>
            <p className="text-xs text-gray-400 mt-0.5 latin">{profile.nameEn || ''}</p>
            <p className="text-xs text-[#006C35] font-bold mt-1">{profile.specialty || '—'}</p>
            <div className="mt-3 pt-3 border-t border-gray-50">
              <Badge variant="green" dot>جاهز للعمل</Badge>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-black text-[#006C35]">{completionPct}٪</span>
              <span className="text-sm font-black text-gray-900">اكتمال الملف</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
              <div className="bg-[#006C35] h-2 rounded-full transition-all duration-700" style={{ width: `${completionPct}%` }} />
            </div>
            <div className="space-y-2">
              {completionSections.map((s) => (
                <div key={s.label} className="flex items-center gap-2 flex-row-reverse">
                  {s.done
                    ? <CheckCircle size={14} className="text-[#006C35] flex-shrink-0" />
                    : <AlertCircle size={14} className="text-amber-500 flex-shrink-0" />
                  }
                  <span className={`text-xs flex-1 text-right ${s.done ? 'text-gray-600' : 'text-amber-600 font-bold'}`}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Form */}
        <div className="lg:col-span-3 space-y-5">
          <div className="flex gap-1 p-1 bg-gray-100 rounded-2xl">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-2 px-3 text-xs font-black rounded-xl transition-all duration-200 ${
                  activeTab === tab.key
                    ? 'bg-white text-[#006C35] shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab: Info */}
          {activeTab === 'info' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
              <h2 className="font-black text-gray-900 text-right">المعلومات الأساسية</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {fields.map((f) => (
                  <div key={f.key}>
                    <label className="text-xs font-black text-gray-600 block mb-1.5 text-right">{f.label}</label>
                    <input
                      type={f.type}
                      value={profile[f.key]}
                      onChange={(e) => update(f.key, e.target.value)}
                      placeholder={f.placeholder}
                      className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006C35]/20 focus:border-[#006C35] text-right"
                    />
                  </div>
                ))}
                <div>
                  <label className="text-xs font-black text-gray-600 block mb-1.5 text-right">المدينة</label>
                  <select
                    value={profile.city}
                    onChange={(e) => update('city', e.target.value)}
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none text-right"
                  >
                    {saudiCities.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-black text-gray-600 block mb-1.5 text-right">النبذة الشخصية</label>
                <textarea
                  rows={4}
                  value={profile.bio}
                  onChange={(e) => update('bio', e.target.value)}
                  placeholder="أخبر الشركات عن نفسك وطموحاتك..."
                  className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006C35]/20 focus:border-[#006C35] resize-none text-right leading-relaxed"
                />
                <p className="text-[10px] text-gray-400 text-left mt-1">{profile.bio.length} / ٥٠٠ حرف</p>
              </div>
            </div>
          )}

          {/* Tab: Skills */}
          {activeTab === 'skills' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
              <div>
                <h3 className="font-black text-gray-900 mb-4 text-right">المهارات التقنية</h3>
                <div className="flex flex-wrap gap-2 mb-4 justify-end">
                  {profile.skills.map((skill, i) => (
                    <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#006C35]/8 border border-[#006C35]/20 rounded-xl text-xs font-black text-[#006C35]">
                      <button onClick={() => removeSkill(i)} className="text-red-400 hover:text-red-600">
                        <Trash2 size={10} />
                      </button>
                      <span className="latin">{skill}</span>
                    </div>
                  ))}
                  {profile.skills.length === 0 && (
                    <p className="text-xs text-gray-400">لا توجد مهارات بعد — أضف أول مهارة</p>
                  )}
                </div>
                <div className="flex gap-2 flex-row-reverse">
                  <Button variant="primary" size="sm" onClick={addSkill}>
                    <Plus size={14} />
                    إضافة
                  </Button>
                  <input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                    placeholder="اسم المهارة (مثل: React)"
                    className="flex-1 px-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006C35]/20 latin"
                  />
                </div>
              </div>

              <div>
                <h3 className="font-black text-gray-900 mb-4 text-right">اللغات</h3>
                <div className="space-y-3">
                  {profile.languages.map((lang, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl flex-row-reverse">
                      <span className="text-sm font-black text-gray-800 flex-1 text-right">{lang.lang}</span>
                      <select
                        value={lang.level}
                        onChange={(e) => {
                          const updated = [...profile.languages];
                          updated[i] = { ...updated[i], level: e.target.value };
                          update('languages', updated);
                        }}
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none"
                      >
                        {['لغة أم', 'ممتاز (A)', 'جيد (B)', 'متوسط (C)', 'مبتدئ (D)'].map((l) => <option key={l}>{l}</option>)}
                      </select>
                      <button
                        onClick={() => update('languages', profile.languages.filter((_, idx) => idx !== i))}
                        className="text-red-400 hover:text-red-600"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => update('languages', [...profile.languages, { lang: 'لغة أخرى', level: 'مبتدئ (D)' }])}
                    className="flex items-center gap-2 text-xs text-[#006C35] font-black hover:underline flex-row-reverse w-full justify-end"
                  >
                    <span>إضافة لغة</span>
                    <Plus size={13} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Experience */}
          {activeTab === 'experience' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => update('experience', [...profile.experience, { title: '', company: '', from: '', to: '', desc: '' }])}
                  className="flex items-center gap-1.5 text-xs text-[#006C35] font-black hover:underline flex-row-reverse"
                >
                  <span>إضافة خبرة</span>
                  <Plus size={13} />
                </button>
                <h2 className="font-black text-gray-900 text-right">الخبرات العملية</h2>
              </div>

              {profile.experience.map((exp, i) => (
                <div key={i} className="p-5 border border-gray-100 rounded-2xl space-y-4 bg-gray-50/50">
                  <div className="flex items-center justify-between">
                    <button onClick={() => update('experience', profile.experience.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-600">
                      <Trash2 size={14} />
                    </button>
                    <span className="text-xs font-black text-gray-500">خبرة {i + 1}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[['title', 'المسمى الوظيفي'], ['company', 'اسم الشركة'], ['from', 'من (سنة)'], ['to', 'إلى (سنة / الآن)']].map(([key, label]) => (
                      <div key={key}>
                        <label className="text-xs font-black text-gray-500 block mb-1 text-right">{label}</label>
                        <input
                          value={exp[key]}
                          onChange={(e) => {
                            const updated = [...profile.experience];
                            updated[i] = { ...updated[i], [key]: e.target.value };
                            update('experience', updated);
                          }}
                          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006C35]/20 text-right"
                        />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="text-xs font-black text-gray-500 block mb-1 text-right">وصف الدور</label>
                    <textarea
                      rows={3}
                      value={exp.desc}
                      onChange={(e) => {
                        const updated = [...profile.experience];
                        updated[i] = { ...updated[i], desc: e.target.value };
                        update('experience', updated);
                      }}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006C35]/20 resize-none text-right"
                    />
                  </div>
                </div>
              ))}

              {profile.experience.length === 0 && (
                <div className="text-center py-10 text-gray-400">
                  <p className="text-sm">لا توجد خبرات بعد</p>
                  <p className="text-xs mt-1">انقر "إضافة خبرة" لإضافة تجربة عملية</p>
                </div>
              )}
            </div>
          )}

          {/* Tab: Certs & Projects */}
          {activeTab === 'certs' && (
            <div className="space-y-5">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => update('certifications', [...profile.certifications, { name: '', issuer: '', year: '' }])}
                    className="flex items-center gap-1.5 text-xs text-[#006C35] font-black hover:underline flex-row-reverse"
                  >
                    <span>إضافة شهادة</span>
                    <Plus size={13} />
                  </button>
                  <h2 className="font-black text-gray-900 text-right">الشهادات والدورات</h2>
                </div>
                {profile.certifications.map((cert, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl flex-row-reverse">
                    <span className="text-xl">📜</span>
                    <div className="flex-1 grid grid-cols-3 gap-2">
                      {[['name', 'اسم الشهادة'], ['issuer', 'جهة الإصدار'], ['year', 'السنة']].map(([key, label]) => (
                        <input
                          key={key}
                          value={cert[key]}
                          onChange={(e) => {
                            const updated = [...profile.certifications];
                            updated[i] = { ...updated[i], [key]: e.target.value };
                            update('certifications', updated);
                          }}
                          placeholder={label}
                          className="px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006C35]/20 text-right"
                        />
                      ))}
                    </div>
                    <button onClick={() => update('certifications', profile.certifications.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-600 flex-shrink-0">
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
                {profile.certifications.length === 0 && (
                  <p className="text-center text-xs text-gray-400 py-4">لا توجد شهادات بعد</p>
                )}
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => update('projects', [...profile.projects, { name: '', tech: '', desc: '' }])}
                    className="flex items-center gap-1.5 text-xs text-[#006C35] font-black hover:underline flex-row-reverse"
                  >
                    <span>إضافة مشروع</span>
                    <Plus size={13} />
                  </button>
                  <h2 className="font-black text-gray-900 text-right">المشاريع</h2>
                </div>
                {profile.projects.map((proj, i) => (
                  <div key={i} className="p-4 bg-gray-50 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <button onClick={() => update('projects', profile.projects.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-600">
                        <Trash2 size={13} />
                      </button>
                      <span className="text-xs font-black text-gray-500">مشروع {i + 1}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {[['name', 'اسم المشروع'], ['tech', 'التقنيات المستخدمة']].map(([key, label]) => (
                        <input
                          key={key}
                          value={proj[key]}
                          onChange={(e) => {
                            const updated = [...profile.projects];
                            updated[i] = { ...updated[i], [key]: e.target.value };
                            update('projects', updated);
                          }}
                          placeholder={label}
                          className="px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006C35]/20 text-right"
                        />
                      ))}
                    </div>
                    <textarea
                      rows={2}
                      value={proj.desc}
                      onChange={(e) => {
                        const updated = [...profile.projects];
                        updated[i] = { ...updated[i], desc: e.target.value };
                        update('projects', updated);
                      }}
                      placeholder="وصف المشروع وأثره..."
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none resize-none text-right"
                    />
                  </div>
                ))}
                {profile.projects.length === 0 && (
                  <p className="text-center text-xs text-gray-400 py-4">لا توجد مشاريع بعد</p>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-start">
            <Button variant="primary" size="lg" onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 size={16} className="animate-spin" /> : saved ? <CheckCircle size={16} /> : <Save size={16} />}
              {saving ? 'جاري الحفظ...' : saved ? 'تم حفظ الملف المهني ✓' : 'حفظ جميع التغييرات'}
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
