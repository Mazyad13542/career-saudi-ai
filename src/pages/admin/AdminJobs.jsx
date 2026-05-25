import { useState, useRef } from 'react';
import {
  Plus, Edit2, Trash2, Eye, EyeOff, Check, X, Loader2,
  Upload, Download, Search, ChevronDown, ExternalLink,
  CheckCircle, XCircle, Clock, AlertTriangle,
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { useAdminJobs } from '../../hooks/useJobs';

// ── Constants ────────────────────────────────────────────────────────────────
const CITIES    = ['الرياض', 'جدة', 'الدمام', 'الظهران', 'المدينة المنورة', 'مكة المكرمة', 'تبوك', 'أبها', 'جازان', 'نجران', 'الطائف', 'القطيف', 'الخبر', 'بريدة', 'حائل'];
const REGIONS   = ['منطقة الرياض', 'منطقة مكة المكرمة', 'المنطقة الشرقية', 'منطقة المدينة المنورة', 'منطقة تبوك', 'منطقة الحدود الشمالية', 'منطقة جازان', 'منطقة نجران', 'منطقة الباحة', 'منطقة الجوف', 'منطقة عسير', 'منطقة القصيم', 'منطقة حائل'];
const JOB_TYPES = ['دوام كامل', 'دوام جزئي', 'عقد مؤقت', 'تدريب', 'عن بُعد'];
const EXP_LEVELS = ['مبتدئ', 'متوسط', 'متقدم', 'خبير'];
const SECTORS   = ['تقنية المعلومات', 'الاتصالات', 'المصارف والتمويل', 'الرعاية الصحية', 'الهندسة والبناء', 'التسويق والإعلام', 'الموارد البشرية', 'القانون', 'التعليم', 'التعدين والطاقة', 'القطاع الحكومي', 'التجزئة والتجارة', 'السياحة والضيافة', 'النقل واللوجستيات', 'الزراعة والغذاء', 'أخرى'];
const SOURCES   = ['manual', 'csv', 'rss', 'linkedin_manual', 'other'];
const SOURCE_AR = { manual: 'يدوي', csv: 'CSV', rss: 'RSS', linkedin_manual: 'LinkedIn', other: 'أخرى' };

const EMPTY_FORM = {
  title: '', company: '', city: 'الرياض', region: 'منطقة الرياض',
  job_type: 'دوام كامل', experience_level: 'متوسط', sector: '',
  description: '', requirements: '', skills: '',
  salary_min: '', salary_max: '',
  source: 'manual', source_url: '',
  is_remote: false, fresh_graduate: false, is_featured: false,
  status: 'approved',
};

const STATUS_CONFIG = {
  approved: { label: 'مقبول',     color: 'text-green-600',  bg: 'bg-green-50 border-green-200',  icon: CheckCircle },
  pending:  { label: 'انتظار',    color: 'text-amber-600',  bg: 'bg-amber-50 border-amber-200',  icon: Clock },
  rejected: { label: 'مرفوض',    color: 'text-red-500',    bg: 'bg-red-50 border-red-200',      icon: XCircle },
};

// ── CSV Parser ───────────────────────────────────────────────────────────────
function parseCSV(text) {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map((h) => h.trim().toLowerCase().replace(/['"]/g, ''));
  return lines.slice(1).map((line) => {
    // Handle quoted fields
    const fields = [];
    let cur = '', inQuote = false;
    for (const ch of line) {
      if (ch === '"') inQuote = !inQuote;
      else if (ch === ',' && !inQuote) { fields.push(cur.trim()); cur = ''; }
      else cur += ch;
    }
    fields.push(cur.trim());
    const obj = {};
    headers.forEach((h, i) => { obj[h] = (fields[i] ?? '').replace(/^"|"$/g, '').trim(); });
    return {
      title:            obj.title            ?? '',
      company:          obj.company          ?? '',
      city:             obj.city             ?? '',
      region:           obj.region           ?? '',
      job_type:         obj.job_type         ?? 'دوام كامل',
      experience_level: obj.experience_level ?? 'متوسط',
      sector:           obj.sector           ?? '',
      description:      obj.description      ?? '',
      source_url:       obj.source_url       ?? '',
      salary_min:       obj.salary_min       ? Number(obj.salary_min) : null,
      salary_max:       obj.salary_max       ? Number(obj.salary_max) : null,
      skills:           obj.skills           ? obj.skills.split(/[،,|]+/).map((s) => s.trim()).filter(Boolean) : [],
      requirements:     obj.requirements     ? obj.requirements.split(/[،,|]+/).map((s) => s.trim()).filter(Boolean) : [],
      is_remote:        obj.is_remote        === 'true' || obj.is_remote === '1',
      fresh_graduate:   obj.fresh_graduate   === 'true' || obj.fresh_graduate === '1',
      source:           'csv',
      is_active:        true,
    };
  }).filter((r) => r.title && r.company);
}

// ── CSV Template download ─────────────────────────────────────────────────
function downloadTemplate() {
  const headers = 'title,company,city,region,job_type,experience_level,sector,description,skills,requirements,salary_min,salary_max,source_url,is_remote,fresh_graduate';
  const example = 'مهندس برمجيات,شركة الاتصالات السعودية,الرياض,منطقة الرياض,دوام كامل,متوسط,تقنية المعلومات,وصف الوظيفة هنا,JavaScript|React|Node.js,بكالوريوس علوم حاسب|3 سنوات خبرة,15000,25000,https://example.com/job,false,false';
  const blob = new Blob([headers + '\n' + example], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = 'jobs_template.csv'; a.click();
  URL.revokeObjectURL(url);
}

// ── Job Form ─────────────────────────────────────────────────────────────────
function JobForm({ initial, onSave, onCancel, saving, error }) {
  const [form, setForm] = useState(initial ?? EMPTY_FORM);
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const inputCls = 'w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006C35]/20 focus:border-[#006C35]';

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} dir="rtl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div className="sm:col-span-2">
          <label className="text-xs font-bold text-gray-600 mb-1 block">عنوان الوظيفة *</label>
          <input value={form.title} onChange={(e) => set('title', e.target.value)} required placeholder="مثال: مهندس برمجيات أول" className={inputCls} />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-600 mb-1 block">الشركة *</label>
          <input value={form.company} onChange={(e) => set('company', e.target.value)} required placeholder="اسم الشركة" className={inputCls} />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-600 mb-1 block">القطاع</label>
          <select value={form.sector} onChange={(e) => set('sector', e.target.value)} className={inputCls}>
            <option value="">اختر القطاع</option>
            {SECTORS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-bold text-gray-600 mb-1 block">المدينة</label>
          <select value={form.city} onChange={(e) => set('city', e.target.value)} className={inputCls}>
            {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-bold text-gray-600 mb-1 block">المنطقة</label>
          <select value={form.region} onChange={(e) => set('region', e.target.value)} className={inputCls}>
            <option value="">اختر المنطقة</option>
            {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-bold text-gray-600 mb-1 block">نوع الوظيفة</label>
          <select value={form.job_type} onChange={(e) => set('job_type', e.target.value)} className={inputCls}>
            {JOB_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-bold text-gray-600 mb-1 block">مستوى الخبرة</label>
          <select value={form.experience_level} onChange={(e) => set('experience_level', e.target.value)} className={inputCls}>
            {EXP_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-bold text-gray-600 mb-1 block">الراتب من (ريال)</label>
          <input type="number" value={form.salary_min} onChange={(e) => set('salary_min', e.target.value)} placeholder="15000" className={inputCls} />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-600 mb-1 block">الراتب إلى (ريال)</label>
          <input type="number" value={form.salary_max} onChange={(e) => set('salary_max', e.target.value)} placeholder="25000" className={inputCls} />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-600 mb-1 block">المصدر</label>
          <select value={form.source} onChange={(e) => set('source', e.target.value)} className={inputCls}>
            {SOURCES.map((s) => <option key={s} value={s}>{SOURCE_AR[s]}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-bold text-gray-600 mb-1 block">رابط المصدر</label>
          <input value={form.source_url} onChange={(e) => set('source_url', e.target.value)} placeholder="https://..." className={inputCls} dir="ltr" />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-600 mb-1 block">الحالة</label>
          <select value={form.status} onChange={(e) => set('status', e.target.value)} className={inputCls}>
            <option value="approved">مقبول (يظهر للمستخدمين)</option>
            <option value="pending">انتظار (مراجعة)</option>
            <option value="rejected">مرفوض</option>
          </select>
        </div>
        <div className="flex items-center gap-4 pt-4">
          {[
            { key: 'is_remote',      label: 'عن بُعد' },
            { key: 'fresh_graduate', label: 'لحديثي التخرج' },
            { key: 'is_featured',    label: 'وظيفة مميزة ⭐' },
            { key: 'is_active',      label: 'نشط' },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={Boolean(form[key])}
                onChange={(e) => set(key, e.target.checked)}
                className="w-4 h-4 rounded accent-[#006C35]"
              />
              <span className="text-xs font-bold text-gray-600">{label}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <label className="text-xs font-bold text-gray-600 mb-1 block">وصف الوظيفة</label>
        <textarea rows={4} value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="اكتب وصفاً تفصيلياً للوظيفة..." className={`${inputCls} resize-none`} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <div>
          <label className="text-xs font-bold text-gray-600 mb-1 block">المهارات المطلوبة (مفصولة بفاصلة)</label>
          <input
            value={typeof form.skills === 'string' ? form.skills : (form.skills ?? []).join('، ')}
            onChange={(e) => set('skills', e.target.value)}
            placeholder="Python، SQL، Excel"
            className={inputCls}
          />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-600 mb-1 block">المتطلبات (مفصولة بفاصلة)</label>
          <input
            value={typeof form.requirements === 'string' ? form.requirements : (form.requirements ?? []).join('، ')}
            onChange={(e) => set('requirements', e.target.value)}
            placeholder="بكالوريوس، 3 سنوات خبرة"
            className={inputCls}
          />
        </div>
      </div>
      {error && <p className="text-sm text-red-500 mb-3">{error}</p>}
      <div className="flex gap-3 justify-start">
        <Button variant="secondary" size="md" type="button" onClick={onCancel}>إلغاء</Button>
        <Button variant="primary" size="md" type="submit" disabled={saving}>
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
          حفظ الوظيفة
        </Button>
      </div>
    </form>
  );
}

// ── CSV Import Panel ──────────────────────────────────────────────────────────
function CSVImportPanel({ onImport, onClose }) {
  const fileRef          = useRef(null);
  const [preview, setPrev] = useState(null);
  const [importing, setImp] = useState(false);
  const [result, setResult] = useState(null);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const rows = parseCSV(ev.target.result);
      setPrev(rows);
      setResult(null);
    };
    reader.readAsText(file, 'utf-8');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) { const dt = new DataTransfer(); dt.items.add(file); fileRef.current.files = dt.files; handleFile({ target: { files: dt.files } }); }
  };

  const handleImport = async () => {
    if (!preview?.length) return;
    setImp(true);
    const res = await onImport(preview);
    setResult(res);
    setPrev(null);
    setImp(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-[#006C35]/20 shadow-sm p-6 mb-6" dir="rtl">
      <div className="flex items-center justify-between mb-5">
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"><X size={16} className="text-gray-400" /></button>
        <h2 className="font-black text-gray-900">استيراد وظائف من CSV</h2>
      </div>

      {result ? (
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-green-50 rounded-xl text-center"><p className="text-xl font-black text-green-600">{result.inserted}</p><p className="text-xs text-green-600">تمت الإضافة</p></div>
            <div className="p-3 bg-amber-50 rounded-xl text-center"><p className="text-xl font-black text-amber-600">{result.duplicates}</p><p className="text-xs text-amber-600">مكررة</p></div>
            <div className="p-3 bg-red-50 rounded-xl text-center"><p className="text-xl font-black text-red-600">{result.errors}</p><p className="text-xs text-red-600">أخطاء</p></div>
          </div>
          <p className="text-xs text-gray-500 text-center">الوظائف المستوردة بحالة "انتظار" تحتاج موافقة</p>
          <Button variant="primary" size="sm" className="w-full" onClick={onClose}>إغلاق</Button>
        </div>
      ) : preview ? (
        <div>
          <div className="flex items-center justify-between mb-3 flex-row-reverse">
            <button onClick={() => setPrev(null)} className="text-xs text-gray-400 hover:text-gray-600">← رجوع</button>
            <p className="text-sm font-bold text-gray-700">{preview.length} وظيفة جاهزة للاستيراد</p>
          </div>
          <div className="max-h-64 overflow-y-auto border border-gray-100 rounded-xl mb-4">
            <table className="w-full text-xs">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="text-right px-3 py-2 font-bold text-gray-500">العنوان</th>
                  <th className="text-right px-3 py-2 font-bold text-gray-500">الشركة</th>
                  <th className="text-right px-3 py-2 font-bold text-gray-500">المدينة</th>
                  <th className="text-right px-3 py-2 font-bold text-gray-500">النوع</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {preview.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-3 py-2 text-gray-900 font-bold truncate max-w-[120px]">{row.title}</td>
                    <td className="px-3 py-2 text-gray-600 truncate max-w-[100px]">{row.company}</td>
                    <td className="px-3 py-2 text-gray-500">{row.city}</td>
                    <td className="px-3 py-2 text-gray-500">{row.job_type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex gap-3 justify-start">
            <Button variant="secondary" size="sm" onClick={() => setPrev(null)}>إلغاء</Button>
            <Button variant="primary" size="sm" onClick={handleImport} disabled={importing}>
              {importing ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
              استيراد {preview.length} وظيفة
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <div
            className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-[#006C35]/30 transition-colors cursor-pointer"
            onClick={() => fileRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <Upload size={32} className="text-gray-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-gray-600 mb-1">اسحب ملف CSV هنا أو انقر للتحديد</p>
            <p className="text-xs text-gray-400">يجب أن يحتوي الملف على: title, company, city, job_type</p>
            <input ref={fileRef} type="file" accept=".csv,text/csv" className="hidden" onChange={handleFile} />
          </div>
          <div className="flex items-center gap-2 mt-4 justify-end">
            <button onClick={downloadTemplate} className="flex items-center gap-1.5 text-xs font-bold text-[#006C35] hover:underline">
              <Download size={13} />
              تحميل قالب CSV
            </button>
          </div>
          <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-xl">
            <p className="text-xs font-bold text-amber-800 flex items-center gap-1.5 mb-1">
              <AlertTriangle size={12} />
              ملاحظة حول LinkedIn
            </p>
            <p className="text-xs text-amber-700">
              لا تستخدم scraping تلقائي لـ LinkedIn. أضف روابط LinkedIn يدوياً في عمود source_url أو انتظر ربط API رسمي معتمد.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function AdminJobs() {
  const { jobs, loading, stats, createJob, updateJob, deleteJob, setStatus, toggleActive, bulkImport } = useAdminJobs();

  const [view,         setView]        = useState('all'); // all | pending | approved | rejected
  const [search,       setSearch]      = useState('');
  const [showForm,     setShowForm]    = useState(false);
  const [editJob,      setEditJob]     = useState(null);
  const [saving,       setSaving]      = useState(false);
  const [formError,    setFormError]   = useState(null);
  const [showCSV,      setShowCSV]     = useState(false);
  const [deleteConfirm, setDelConf]    = useState(null);
  const [togglingId,   setTogglingId]  = useState(null);

  // Filter displayed jobs
  const filtered = jobs.filter((j) => {
    const matchS = view === 'all' || j.status === view;
    const q = search.toLowerCase();
    const matchQ = !q || (j.title ?? '').toLowerCase().includes(q) || (j.company ?? '').toLowerCase().includes(q);
    return matchS && matchQ;
  });

  function buildPayload(form) {
    return {
      ...form,
      salary_min:   form.salary_min   ? Number(form.salary_min)   : null,
      salary_max:   form.salary_max   ? Number(form.salary_max)   : null,
      skills:       typeof form.skills       === 'string' ? form.skills.split(/[،,]+/).map((s) => s.trim()).filter(Boolean)       : form.skills ?? [],
      requirements: typeof form.requirements === 'string' ? form.requirements.split(/[،,]+/).map((s) => s.trim()).filter(Boolean) : form.requirements ?? [],
    };
  }

  async function handleSave(form) {
    if (!form.title?.trim() || !form.company?.trim()) { setFormError('عنوان الوظيفة والشركة مطلوبان'); return; }
    setSaving(true); setFormError(null);
    try {
      if (editJob) await updateJob(editJob.id, buildPayload(form));
      else         await createJob(buildPayload(form));
      setShowForm(false); setEditJob(null);
    } catch (err) {
      setFormError(err.message ?? 'حدث خطأ');
    } finally { setSaving(false); }
  }

  async function handleDelete(id) {
    try { await deleteJob(id); } catch { /* ignore */ }
    setDelConf(null);
  }

  async function handleToggle(id, current) {
    setTogglingId(id);
    try { await toggleActive(id, current); } catch { /* ignore */ }
    setTogglingId(null);
  }

  if (loading && jobs.length === 0) {
    return (
      <DashboardLayout type="admin">
        <div className="flex items-center justify-center h-64">
          <Loader2 size={32} className="animate-spin text-[#006C35]" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout type="admin">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-row-reverse">
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => { setShowCSV(true); setShowForm(false); }}>
            <Upload size={14} />
            استيراد CSV
          </Button>
          <Button variant="primary" size="sm" onClick={() => { setShowForm(true); setEditJob(null); setShowCSV(false); }}>
            <Plus size={14} />
            إضافة وظيفة
          </Button>
        </div>
        <div className="text-right">
          <h1 className="text-2xl font-black text-gray-900">إدارة الوظائف</h1>
          <p className="text-gray-500 text-sm mt-0.5">جميع وظائف المنصة مع أدوات الإدارة الكاملة</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-3 mb-6">
        {[
          { label: 'إجمالي',  value: stats.total,    color: 'text-gray-900' },
          { label: 'نشطة',    value: stats.active,   color: 'text-green-600' },
          { label: 'مقبولة',  value: stats.approved, color: 'text-green-600' },
          { label: 'انتظار',  value: stats.pending,  color: 'text-amber-600' },
          { label: 'مرفوضة', value: stats.rejected, color: 'text-red-500' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 text-center">
            <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* CSV Import Panel */}
      {showCSV && !showForm && (
        <CSVImportPanel onImport={bulkImport} onClose={() => setShowCSV(false)} />
      )}

      {/* Job Form */}
      {showForm && !showCSV && (
        <div className="bg-white rounded-2xl border border-[#006C35]/20 shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-5 flex-row-reverse">
            <h2 className="font-black text-gray-900">{editJob ? 'تعديل الوظيفة' : 'إضافة وظيفة جديدة'}</h2>
            <button onClick={() => { setShowForm(false); setEditJob(null); }} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
              <X size={16} className="text-gray-400" />
            </button>
          </div>
          <JobForm
            initial={editJob ? {
              ...editJob,
              skills:       (editJob.skills ?? []).join('، '),
              requirements: (editJob.requirements ?? []).join('، '),
            } : undefined}
            onSave={handleSave}
            onCancel={() => { setShowForm(false); setEditJob(null); }}
            saving={saving}
            error={formError}
          />
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4" dir="rtl">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Status tabs */}
          <div className="flex gap-2 flex-wrap">
            {[
              { key: 'all',      label: `الكل (${stats.total})` },
              { key: 'pending',  label: `انتظار (${stats.pending})` },
              { key: 'approved', label: `مقبول (${stats.approved})` },
              { key: 'rejected', label: `مرفوض (${stats.rejected})` },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setView(key)}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-colors ${
                  view === key ? 'bg-[#006C35] text-white border-[#006C35]' : 'bg-white text-gray-500 border-gray-200 hover:border-[#006C35]/30'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          {/* Search */}
          <div className="flex-1 relative min-w-[200px]">
            <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث بعنوان الوظيفة أو الشركة..."
              className="w-full pr-8 pl-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006C35]/20 focus:border-[#006C35]"
            />
          </div>
        </div>
      </div>

      <div className="text-xs text-gray-400 mb-3 text-right">{filtered.length} وظيفة</div>

      {/* Jobs Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <p className="text-gray-500 font-bold">لا توجد وظائف</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden" dir="rtl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-right px-4 py-3 text-xs font-bold text-gray-500">الوظيفة</th>
                  <th className="text-right px-4 py-3 text-xs font-bold text-gray-500">المدينة</th>
                  <th className="text-right px-4 py-3 text-xs font-bold text-gray-500">المصدر</th>
                  <th className="text-right px-4 py-3 text-xs font-bold text-gray-500">الحالة</th>
                  <th className="text-right px-4 py-3 text-xs font-bold text-gray-500">تاريخ النشر</th>
                  <th className="text-right px-4 py-3 text-xs font-bold text-gray-500">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((job) => {
                  const sc = STATUS_CONFIG[job.status] ?? STATUS_CONFIG.approved;
                  const StatusIcon = sc.icon;
                  return (
                    <tr key={job.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {job.is_featured && <span className="text-[#C8A951] text-xs">⭐</span>}
                          <div>
                            <p className="text-sm font-black text-gray-900">{job.title}</p>
                            <p className="text-xs text-gray-400">{job.company} · {job.job_type}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{job.city ?? '—'}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-gray-500">{SOURCE_AR[job.source] ?? job.source ?? 'يدوي'}</span>
                        {job.source_url && (
                          <a href={job.source_url} target="_blank" rel="noopener noreferrer" className="mr-1 text-[#006C35] hover:opacity-70">
                            <ExternalLink size={11} className="inline" />
                          </a>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${sc.bg}`}>
                          <StatusIcon size={10} className={sc.color} />
                          <span className={sc.color}>{sc.label}</span>
                        </span>
                        {!job.is_active && <span className="mr-1 text-[10px] text-gray-400">(موقوف)</span>}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400">
                        {new Date(job.posted_at ?? job.created_at).toLocaleDateString('ar-SA')}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 justify-end">
                          {/* Approve / Reject for pending */}
                          {job.status === 'pending' && (
                            <>
                              <button onClick={() => setStatus(job.id, 'approved')} title="قبول" className="p-1.5 rounded-lg hover:bg-green-50 text-green-500 hover:text-green-700 transition-colors">
                                <CheckCircle size={15} />
                              </button>
                              <button onClick={() => setStatus(job.id, 'rejected')} title="رفض" className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors">
                                <XCircle size={15} />
                              </button>
                            </>
                          )}
                          {/* Re-approve rejected */}
                          {job.status === 'rejected' && (
                            <button onClick={() => setStatus(job.id, 'approved')} title="قبول" className="p-1.5 rounded-lg hover:bg-green-50 text-green-500 transition-colors">
                              <CheckCircle size={15} />
                            </button>
                          )}
                          {/* Toggle active */}
                          <button
                            onClick={() => handleToggle(job.id, job.is_active)}
                            disabled={togglingId === job.id}
                            title={job.is_active ? 'إيقاف' : 'تفعيل'}
                            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-40"
                          >
                            {togglingId === job.id ? <Loader2 size={14} className="animate-spin" /> : job.is_active ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                          {/* Edit */}
                          <button
                            onClick={() => { setEditJob(job); setShowForm(true); setShowCSV(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                            className="p-1.5 rounded-lg hover:bg-amber-50 text-amber-400 hover:text-amber-600 transition-colors"
                          >
                            <Edit2 size={14} />
                          </button>
                          {/* Delete with confirm */}
                          {deleteConfirm === job.id ? (
                            <div className="flex items-center gap-1">
                              <button onClick={() => handleDelete(job.id)} className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100"><Check size={13} /></button>
                              <button onClick={() => setDelConf(null)} className="p-1.5 rounded-lg bg-gray-50 text-gray-400 hover:bg-gray-100"><X size={13} /></button>
                            </div>
                          ) : (
                            <button onClick={() => setDelConf(job.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors">
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
