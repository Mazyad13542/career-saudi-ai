import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle, ShoppingCart, User, Phone, Mail, Briefcase, Clock,
  Link2, ChevronLeft, Loader2, MapPin, Globe, GraduationCap,
  Upload, X, Plus, Trash2, Tag, Languages, Award, Target,
} from 'lucide-react';

const OWNER_WHATSAPP = '966500000000';

const SERVICES = [
  'تنظيم ملف LinkedIn احترافي',
  'موقع شخصي احترافي',
  'صورة شخصية احترافية',
  'سيرة ذاتية ATS محسّنة',
  'رسالة تقديم مخصصة',
  'التقديم على ٢٠٠ شركة سعودية',
];

const SUGGESTED_SKILLS = ['Excel','Power BI','AutoCAD','Python','Revit','SolidWorks','SQL','Photoshop','SAP','MATLAB'];
const SUGGESTED_JOBS   = ['Mechanical Engineer','HVAC Engineer','Project Engineer','Electrical Engineer','Software Engineer','Data Analyst','Civil Engineer','Business Analyst'];
const LANGUAGES        = ['العربية','الإنجليزية','الفرنسية','الألمانية','اليابانية','الصينية'];

const emptyExp = () => ({ company: '', title: '', startDate: '', endDate: '', current: false, description: '' });

// ─── File Upload Component ──────────────────────────────────────────────────
function FileUpload({ label, accept, required, file, onChange, hint }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) onChange(f);
  };

  return (
    <div>
      <label className="text-sm font-bold text-gray-700 block mb-1.5">
        {label} {required ? <span className="text-red-400">*</span> : <span className="text-gray-400 font-normal">(اختياري)</span>}
      </label>
      {file ? (
        <div className="flex items-center gap-3 p-3 bg-[#006C35]/5 border border-[#006C35]/20 rounded-xl">
          <div className="w-8 h-8 rounded-lg bg-[#006C35]/10 flex items-center justify-center flex-shrink-0">
            <Upload size={14} className="text-[#006C35]" />
          </div>
          <span className="text-sm font-bold text-gray-700 flex-1 truncate">{file.name}</span>
          <button type="button" onClick={() => onChange(null)} className="text-gray-400 hover:text-red-500 transition-colors">
            <X size={16} />
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
            dragging ? 'border-[#006C35] bg-[#006C35]/5' : 'border-gray-200 hover:border-[#006C35]/40 hover:bg-gray-50'
          }`}
        >
          <Upload size={20} className="text-gray-400 mx-auto mb-2" />
          <p className="text-sm font-bold text-gray-500">اسحب الملف هنا أو <span className="text-[#006C35]">اختر ملفاً</span></p>
          {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
        </div>
      )}
      <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={e => onChange(e.target.files[0] || null)} />
    </div>
  );
}

// ─── Tag Input Component ────────────────────────────────────────────────────
function TagInput({ tags, onChange, suggestions = [], placeholder }) {
  const [input, setInput] = useState('');

  const add = (val) => {
    const v = val.trim();
    if (v && !tags.includes(v)) onChange([...tags, v]);
    setInput('');
  };

  const remove = (t) => onChange(tags.filter(x => x !== t));

  return (
    <div>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {tags.map(t => (
          <span key={t} className="inline-flex items-center gap-1 px-3 py-1 bg-[#006C35]/10 text-[#006C35] text-xs font-bold rounded-full">
            {t}
            <button type="button" onClick={() => remove(t)} className="hover:text-red-500"><X size={11} /></button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); add(input); } }}
          placeholder={placeholder}
          className="flex-1 px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006C35]/30 focus:border-[#006C35] transition-all"
        />
        <button type="button" onClick={() => add(input)} className="px-3 py-2 bg-[#006C35]/10 text-[#006C35] rounded-xl hover:bg-[#006C35]/20 transition-colors">
          <Plus size={16} />
        </button>
      </div>
      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {suggestions.filter(s => !tags.includes(s)).map(s => (
            <button key={s} type="button" onClick={() => add(s)}
              className="px-2.5 py-1 text-[10px] font-bold text-gray-500 bg-gray-100 hover:bg-[#006C35]/10 hover:text-[#006C35] rounded-full transition-colors">
              + {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Section Header ─────────────────────────────────────────────────────────
function SectionHeader({ num, title, icon: Icon }) {
  return (
    <div className="flex items-center gap-3 mb-5 pb-3 border-b border-gray-100">
      <div className="w-8 h-8 rounded-xl bg-[#006C35] flex items-center justify-center flex-shrink-0">
        <span className="text-white text-xs font-black">{num}</span>
      </div>
      <div className="flex items-center gap-2">
        <Icon size={16} className="text-[#006C35]" />
        <h3 className="font-black text-gray-900 text-base">{title}</h3>
      </div>
    </div>
  );
}

function inputCls(err) {
  return `w-full px-4 py-2.5 text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 transition-all ${
    err ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-[#006C35]/30 focus:border-[#006C35]'
  }`;
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function Order() {
  // Section 1 — Basic Info
  const [basic, setBasic] = useState({ name: '', whatsapp: '', email: '', city: '', nationality: '', linkedin: '' });

  // Section 2 — Files
  const [files, setFiles] = useState({ cv: null, photo: null, certificates: null, extra: null });

  // Section 3 — Professional
  const [prof, setProf] = useState({ title: '', specialty: '', experience: '', bio: '' });

  // Section 4 — Education
  const [edu, setEdu] = useState({ university: '', degree: '', gradYear: '', gpa: '' });

  // Section 5 — Work Experience
  const [experiences, setExperiences] = useState([emptyExp()]);

  // Section 6 — Skills & Certs
  const [skills, setSkills]   = useState([]);
  const [langs, setLangs]     = useState(['العربية','الإنجليزية']);
  const [certs, setCerts]     = useState('');

  // Section 7 — Job Target
  const [targetJobs, setTargetJobs] = useState([]);
  const [jobLevel, setJobLevel]     = useState('');

  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const [payError, setPayError] = useState('');

  const setB = (k, v) => setBasic(p => ({ ...p, [k]: v }));
  const setP = (k, v) => setProf(p => ({ ...p, [k]: v }));
  const setE = (k, v) => setEdu(p => ({ ...p, [k]: v }));

  const updateExp = (i, k, v) => setExperiences(prev => prev.map((e, idx) => idx === i ? { ...e, [k]: v } : e));
  const addExp    = () => setExperiences(p => [...p, emptyExp()]);
  const removeExp = (i) => setExperiences(p => p.filter((_, idx) => idx !== i));

  const validate = () => {
    const e = {};
    if (!basic.name.trim())     e.name     = 'مطلوب';
    if (!basic.whatsapp.trim()) e.whatsapp = 'مطلوب';
    if (!prof.specialty.trim()) e.specialty = 'مطلوب';
    if (!prof.experience)       e.experience = 'مطلوب';
    if (!files.photo)           e.photo    = 'الصورة الشخصية مطلوبة';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      document.getElementById('form-top')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    setLoading(true);
    setPayError('');

    const note = [
      `المدينة: ${basic.city || '—'} | الجنسية: ${basic.nationality || '—'}`,
      `LinkedIn: ${basic.linkedin || '—'}`,
      `التخصص: ${prof.specialty} | الخبرة: ${prof.experience}`,
      `التعليم: ${edu.degree || '—'} — ${edu.university || '—'} ${edu.gradYear || ''}`,
      `المهارات: ${skills.join(', ') || '—'}`,
      `اللغات: ${langs.join(', ')}`,
      `الوظائف المستهدفة: ${targetJobs.join(', ') || '—'} | المستوى: ${jobLevel || '—'}`,
      files.cv    ? `✅ CV مرفق: ${files.cv.name}`    : '⬜ لا يوجد CV',
      files.photo ? `✅ صورة مرفقة: ${files.photo.name}` : '',
    ].filter(Boolean).join('\n');

    try {
      const res = await fetch('/api/create-paylink', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: basic.name, mobile: basic.whatsapp, email: basic.email, notes: note }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) { setPayError('حدث خطأ في إنشاء رابط الدفع، حاول مرة أخرى.'); setLoading(false); return; }

      // Save form data locally for admin WhatsApp message
      localStorage.setItem('qimma_order', JSON.stringify({ basic, prof, edu, experiences, skills, langs, certs, targetJobs, jobLevel }));

      window.location.href = data.url;
    } catch {
      setPayError('تعذّر الاتصال بخادم الدفع، حاول لاحقاً.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 saudi-geo-pattern" dir="rtl">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#006C35]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 font-bold mb-8 transition-colors">
          <ChevronLeft size={15} />
          العودة للرئيسية
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* ── Sidebar ─────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-5 lg:sticky lg:top-8 lg:self-start">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl gradient-saudi flex items-center justify-center shadow-saudi">
                <span className="text-white font-black text-xl">ق</span>
              </div>
              <div>
                <p className="font-black text-gray-900 text-lg leading-none">قِمّة</p>
                <p className="text-xs text-[#006C35] font-bold">خدمات مهنية تنفيذية</p>
              </div>
            </div>

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

            <div className="relative rounded-2xl overflow-hidden" style={{ boxShadow: '0 0 28px rgba(0,108,53,0.15)' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-[#006C35] to-[#004d26]" />
              <div className="relative p-5 text-white text-right">
                <p className="text-xs text-green-300 font-bold mb-1">دفع مرة واحدة فقط</p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl font-black leading-none">١٩٩</span>
                  <span className="text-green-200 font-bold">ر.س</span>
                </div>
                <p className="text-xs text-green-300/70 mt-1">التسليم خلال ٨ ساعات على واتساب</p>
              </div>
            </div>

            <div className="space-y-2">
              {['ضمان استرداد كامل خلال ٣٠ يوماً','تسليم على واتساب خلال ٨ ساعات','مراجعة مجانية عند الحاجة'].map(g => (
                <div key={g} className="flex items-center gap-2 text-xs text-gray-500 font-bold">
                  <span className="text-[#006C35]">✓</span>{g}
                </div>
              ))}
            </div>
          </div>

          {/* ── Form ────────────────────────────────────────── */}
          <div className="lg:col-span-3 space-y-5" id="form-top">
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* ── Section 1: Basic Info ── */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                <SectionHeader num="١" title="المعلومات الأساسية" icon={User} />
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-bold text-gray-700 block mb-1.5">الاسم الكامل بالإنجليزية <span className="text-red-400">*</span></label>
                    <input type="text" placeholder="Mohammed Abdullah Al-Ghamdi" value={basic.name}
                      onChange={e => setB('name', e.target.value)} className={inputCls(errors.name)} dir="ltr" />
                    {errors.name && <p className="text-xs text-red-500 mt-1 font-bold">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-bold text-gray-700 block mb-1.5">رقم واتساب <span className="text-red-400">*</span></label>
                    <div className="relative">
                      <Phone size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      <input type="tel" placeholder="05XXXXXXXX" value={basic.whatsapp}
                        onChange={e => setB('whatsapp', e.target.value)} className={`${inputCls(errors.whatsapp)} pr-10`} dir="ltr" />
                    </div>
                    {errors.whatsapp && <p className="text-xs text-red-500 mt-1 font-bold">{errors.whatsapp}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-bold text-gray-700 block mb-1.5">البريد الإلكتروني <span className="text-gray-400 font-normal">(اختياري)</span></label>
                    <div className="relative">
                      <Mail size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      <input type="email" placeholder="example@email.com" value={basic.email}
                        onChange={e => setB('email', e.target.value)} className={`${inputCls()} pr-10`} dir="ltr" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-bold text-gray-700 block mb-1.5">المدينة والدولة</label>
                      <div className="relative">
                        <MapPin size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        <input type="text" placeholder="الرياض، السعودية" value={basic.city}
                          onChange={e => setB('city', e.target.value)} className={`${inputCls()} pr-10`} />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-bold text-gray-700 block mb-1.5">الجنسية</label>
                      <div className="relative">
                        <Globe size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        <input type="text" placeholder="سعودي" value={basic.nationality}
                          onChange={e => setB('nationality', e.target.value)} className={`${inputCls()} pr-10`} />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-bold text-gray-700 block mb-1.5">رابط LinkedIn الحالي <span className="text-gray-400 font-normal">(اختياري)</span></label>
                    <div className="relative">
                      <Link2 size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      <input type="url" placeholder="linkedin.com/in/username" value={basic.linkedin}
                        onChange={e => setB('linkedin', e.target.value)} className={`${inputCls()} pr-10`} dir="ltr" />
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Section 2: Files ── */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                <SectionHeader num="٢" title="رفع الملفات" icon={Upload} />
                <div className="space-y-4">
                  <FileUpload label="السيرة الذاتية الحالية" accept=".pdf,.doc,.docx"
                    file={files.cv} onChange={f => setFiles(p => ({ ...p, cv: f }))}
                    hint="PDF أو DOCX" />
                  <FileUpload label="الصورة الشخصية" required accept=".jpg,.jpeg,.png"
                    file={files.photo} onChange={f => setFiles(p => ({ ...p, photo: f }))}
                    hint="JPG أو PNG — مطلوبة لإنشاء الصورة الاحترافية" />
                  {errors.photo && <p className="text-xs text-red-500 -mt-2 font-bold">{errors.photo}</p>}
                  <FileUpload label="الشهادات والدورات" accept=".pdf,.jpg,.jpeg,.png"
                    file={files.certificates} onChange={f => setFiles(p => ({ ...p, certificates: f }))}
                    hint="PDF أو صورة" />
                  <FileUpload label="ملفات إضافية" accept=".pdf,.doc,.docx,.jpg,.png"
                    file={files.extra} onChange={f => setFiles(p => ({ ...p, extra: f }))}
                    hint="أي ملف إضافي تريد إرفاقه" />
                  <p className="text-xs text-gray-400 bg-amber-50 border border-amber-100 rounded-xl p-3 font-bold">
                    📎 سيتم إرسال الملفات عبر واتساب بعد الدفع للتأكد من استلامها
                  </p>
                </div>
              </div>

              {/* ── Section 3: Professional ── */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                <SectionHeader num="٣" title="المعلومات المهنية" icon={Briefcase} />
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-bold text-gray-700 block mb-1.5">المسمى الوظيفي الحالي</label>
                    <input type="text" placeholder="مهندس برمجيات" value={prof.title}
                      onChange={e => setP('title', e.target.value)} className={inputCls()} />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-gray-700 block mb-1.5">التخصص أو المجال <span className="text-red-400">*</span></label>
                    <input type="text" placeholder="هندسة برمجيات / محاسبة / تسويق..." value={prof.specialty}
                      onChange={e => setP('specialty', e.target.value)} className={inputCls(errors.specialty)} />
                    {errors.specialty && <p className="text-xs text-red-500 mt-1 font-bold">{errors.specialty}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-bold text-gray-700 block mb-1.5">سنوات الخبرة <span className="text-red-400">*</span></label>
                    <select value={prof.experience} onChange={e => setP('experience', e.target.value)} className={inputCls(errors.experience)}>
                      <option value="">اختر</option>
                      <option>حديث تخرج</option>
                      <option>أقل من سنة</option>
                      <option>١ – ٣ سنوات</option>
                      <option>٣ – ٥ سنوات</option>
                      <option>أكثر من ٥ سنوات</option>
                    </select>
                    {errors.experience && <p className="text-xs text-red-500 mt-1 font-bold">{errors.experience}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-bold text-gray-700 block mb-1.5">نبذة مختصرة عن نفسك <span className="text-gray-400 font-normal">(اختياري)</span></label>
                    <textarea rows={3} placeholder="اكتب نبذة مختصرة تصف شخصيتك المهنية وأبرز إنجازاتك..."
                      value={prof.bio} onChange={e => setP('bio', e.target.value)}
                      className="w-full px-4 py-3 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006C35]/30 focus:border-[#006C35] transition-all resize-none" />
                  </div>
                </div>
              </div>

              {/* ── Section 4: Education ── */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                <SectionHeader num="٤" title="التعليم" icon={GraduationCap} />
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-bold text-gray-700 block mb-1.5">اسم الجامعة أو الكلية</label>
                    <input type="text" placeholder="جامعة الملك سعود" value={edu.university}
                      onChange={e => setE('university', e.target.value)} className={inputCls()} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-bold text-gray-700 block mb-1.5">الدرجة العلمية</label>
                      <select value={edu.degree} onChange={e => setE('degree', e.target.value)} className={inputCls()}>
                        <option value="">اختر</option>
                        <option>دبلوم</option>
                        <option>بكالوريوس</option>
                        <option>ماجستير</option>
                        <option>دكتوراه</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-bold text-gray-700 block mb-1.5">سنة التخرج</label>
                      <input type="text" placeholder="2022" value={edu.gradYear}
                        onChange={e => setE('gradYear', e.target.value)} className={inputCls()} dir="ltr" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-bold text-gray-700 block mb-1.5">المعدل <span className="text-gray-400 font-normal">(اختياري)</span></label>
                    <input type="text" placeholder="4.5 / 5 أو 3.8 / 4" value={edu.gpa}
                      onChange={e => setE('gpa', e.target.value)} className={inputCls()} dir="ltr" />
                  </div>
                </div>
              </div>

              {/* ── Section 5: Work Experience ── */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                <SectionHeader num="٥" title="الخبرات العملية" icon={Clock} />
                <div className="space-y-5">
                  {experiences.map((exp, i) => (
                    <div key={i} className="relative p-4 border border-gray-100 rounded-2xl bg-gray-50/50 space-y-3">
                      {experiences.length > 1 && (
                        <button type="button" onClick={() => removeExp(i)}
                          className="absolute top-3 left-3 text-gray-300 hover:text-red-500 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      )}
                      <p className="text-xs font-black text-gray-400 mb-1">الخبرة {i + 1}</p>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-bold text-gray-600 block mb-1">اسم الشركة</label>
                          <input type="text" placeholder="أرامكو السعودية" value={exp.company}
                            onChange={e => updateExp(i, 'company', e.target.value)} className={inputCls()} />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-gray-600 block mb-1">المسمى الوظيفي</label>
                          <input type="text" placeholder="مهندس مشاريع" value={exp.title}
                            onChange={e => updateExp(i, 'title', e.target.value)} className={inputCls()} />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-bold text-gray-600 block mb-1">تاريخ البداية</label>
                          <input type="month" value={exp.startDate}
                            onChange={e => updateExp(i, 'startDate', e.target.value)} className={`${inputCls()} text-gray-600`} dir="ltr" />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-gray-600 block mb-1">تاريخ النهاية</label>
                          <input type="month" value={exp.endDate} disabled={exp.current}
                            onChange={e => updateExp(i, 'endDate', e.target.value)} className={`${inputCls()} text-gray-600 disabled:bg-gray-100`} dir="ltr" />
                          <label className="inline-flex items-center gap-1.5 mt-1 cursor-pointer">
                            <input type="checkbox" checked={exp.current} onChange={e => updateExp(i, 'current', e.target.checked)} className="accent-[#006C35]" />
                            <span className="text-xs text-gray-500 font-bold">حتى الآن</span>
                          </label>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-600 block mb-1">وصف المهام</label>
                        <textarea rows={2} placeholder="اذكر أبرز مهامك وإنجازاتك في هذا الدور..."
                          value={exp.description} onChange={e => updateExp(i, 'description', e.target.value)}
                          className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006C35]/30 focus:border-[#006C35] transition-all resize-none" />
                      </div>
                    </div>
                  ))}
                  <button type="button" onClick={addExp}
                    className="w-full py-2.5 border-2 border-dashed border-[#006C35]/25 rounded-2xl text-sm font-black text-[#006C35]/70 hover:border-[#006C35]/50 hover:text-[#006C35] hover:bg-[#006C35]/5 transition-all flex items-center justify-center gap-2">
                    <Plus size={16} /> إضافة خبرة جديدة
                  </button>
                </div>
              </div>

              {/* ── Section 6: Skills ── */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                <SectionHeader num="٦" title="المهارات والشهادات" icon={Tag} />
                <div className="space-y-5">
                  <div>
                    <label className="text-sm font-bold text-gray-700 block mb-2">المهارات التقنية</label>
                    <TagInput tags={skills} onChange={setSkills} suggestions={SUGGESTED_SKILLS} placeholder="اكتب مهارة ثم Enter" />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-gray-700 block mb-2">اللغات</label>
                    <div className="flex flex-wrap gap-2">
                      {LANGUAGES.map(l => (
                        <button key={l} type="button"
                          onClick={() => setLangs(p => p.includes(l) ? p.filter(x => x !== l) : [...p, l])}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                            langs.includes(l) ? 'bg-[#006C35] text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                          }`}>
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-bold text-gray-700 block mb-1.5">الشهادات والدورات <span className="text-gray-400 font-normal">(اختياري)</span></label>
                    <textarea rows={3} placeholder="مثال: PMP — Project Management Professional&#10;Google Data Analytics Certificate — Coursera&#10;IELTS 7.5"
                      value={certs} onChange={e => setCerts(e.target.value)}
                      className="w-full px-4 py-3 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006C35]/30 focus:border-[#006C35] transition-all resize-none" />
                  </div>
                </div>
              </div>

              {/* ── Section 7: Job Target ── */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                <SectionHeader num="٧" title="معلومات التوظيف" icon={Target} />
                <div className="space-y-5">
                  <div>
                    <label className="text-sm font-bold text-gray-700 block mb-2">الوظائف المستهدفة</label>
                    <TagInput tags={targetJobs} onChange={setTargetJobs} suggestions={SUGGESTED_JOBS} placeholder="اكتب وظيفة مستهدفة ثم Enter" />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-gray-700 block mb-2">مستوى الوظيفة</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {['حديث تخرج','Junior','Mid-Level','Senior'].map(l => (
                        <button key={l} type="button"
                          onClick={() => setJobLevel(l)}
                          className={`py-2.5 rounded-xl text-xs font-black transition-all ${
                            jobLevel === l ? 'bg-[#006C35] text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}>
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Payment Button ── */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
                {payError && (
                  <p className="text-center text-sm text-red-500 font-bold bg-red-50 rounded-xl py-2 px-3">{payError}</p>
                )}
                <button type="submit" disabled={loading}
                  className="w-full py-4 rounded-2xl font-black text-base text-white flex items-center justify-center gap-2.5 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100"
                  style={{ background: 'linear-gradient(135deg,#006C35,#00A651)', boxShadow: '0 6px 28px rgba(0,108,53,0.4)' }}>
                  {loading ? (
                    <><Loader2 size={20} className="animate-spin" /> جارٍ إنشاء رابط الدفع...</>
                  ) : (
                    <><ShoppingCart size={20} /> ادفع الآن — ١٩٩ ر.س</>
                  )}
                </button>
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  <span className="text-xs text-gray-400 font-bold">يدعم:</span>
                  {['Apple Pay','مدى','Visa','Mastercard'].map(m => (
                    <span key={m} className="text-xs font-black text-gray-600 px-2.5 py-1 bg-gray-100 rounded-lg">{m}</span>
                  ))}
                </div>
                <p className="text-center text-xs text-gray-400">دفع آمن عبر PayLink · التسليم خلال ٨ ساعات</p>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
