import { useState } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, Users, Loader2, X, Check, Briefcase } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { useHRJobs } from '../../hooks/useHRJobs';
import { useAuth } from '../../context/AuthContext';

const CITIES = ['الرياض', 'جدة', 'الدمام', 'الظهران', 'تبوك', 'مكة المكرمة', 'المدينة المنورة', 'أبها', 'عن بُعد', 'أكثر من مدينة'];
const EXP_LEVELS = ['مبتدئ', 'متوسط', 'متقدم', 'خبير'];
const JOB_TYPES = ['دوام كامل', 'دوام جزئي', 'عقد مؤقت', 'تدريب', 'عن بُعد'];

const EMPTY_FORM = { title: '', city: 'الرياض', job_type: 'دوام كامل', experience_level: 'متوسط', salary_min: '', salary_max: '', description: '', skills: '', sector: '' };

export default function JobPosts() {
  const { profile } = useAuth();
  const { jobs, stats, loading, createJob, updateJob, deleteJob, toggleActive } = useHRJobs();

  const [showForm, setShowForm]   = useState(false);
  const [editId, setEditId]       = useState(null);
  const [form, setForm]           = useState(EMPTY_FORM);
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  function openCreate() { setForm(EMPTY_FORM); setEditId(null); setError(null); setShowForm(true); }
  function openEdit(job) {
    setForm({
      title: job.title ?? '',
      city: job.city ?? 'الرياض',
      job_type: job.job_type ?? 'دوام كامل',
      experience_level: job.experience_level ?? 'متوسط',
      salary_min: job.salary_min ?? '',
      salary_max: job.salary_max ?? '',
      description: job.description ?? '',
      skills: (job.skills ?? []).join('، '),
      sector: job.sector ?? '',
    });
    setEditId(job.id);
    setError(null);
    setShowForm(true);
  }
  function closeForm() { setShowForm(false); setEditId(null); setError(null); }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) { setError('عنوان الوظيفة مطلوب'); return; }
    setSaving(true);
    setError(null);
    try {
      const payload = {
        ...form,
        salary_min: form.salary_min ? Number(form.salary_min) : null,
        salary_max: form.salary_max ? Number(form.salary_max) : null,
        skills: form.skills ? form.skills.split(/[،,]+/).map((s) => s.trim()).filter(Boolean) : [],
        company: profile?.job_title ?? 'الشركة',
        location: form.city,
      };
      if (editId) await updateJob(editId, payload);
      else await createJob(payload);
      closeForm();
    } catch (err) {
      setError(err.message ?? 'حدث خطأ، حاول مجدداً');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    try { await deleteJob(id); } catch { /* ignore */ }
    setDeleteConfirm(null);
  }

  if (loading) {
    return (
      <DashboardLayout type="hr">
        <div className="flex items-center justify-center h-64">
          <Loader2 size={32} className="animate-spin text-[#006C35]" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout type="hr">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-row-reverse">
        <Button variant="primary" size="sm" onClick={openCreate}>
          <Plus size={14} />
          نشر وظيفة جديدة
        </Button>
        <div className="text-right">
          <h1 className="text-2xl font-black text-gray-900">وظائفي</h1>
          <p className="text-gray-500 text-sm mt-0.5">إدارة قوائم الوظائف الخاصة بك</p>
        </div>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'إجمالي الوظائف', value: stats.total },
          { label: 'وظائف نشطة',    value: stats.active },
          { label: 'إجمالي الطلبات', value: stats.totalApps },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
            <p className="text-2xl font-black text-[#006C35]">{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-[#006C35]/20 shadow-sm p-6 mb-6" dir="rtl">
          <div className="flex items-center justify-between mb-5">
            <button onClick={closeForm} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
              <X size={16} className="text-gray-400" />
            </button>
            <h2 className="font-black text-gray-900">{editId ? 'تعديل الوظيفة' : 'نشر وظيفة جديدة'}</h2>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1 block">عنوان الوظيفة *</label>
                <input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  placeholder="مثال: مهندس برمجيات أول"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006C35]/20 focus:border-[#006C35]" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1 block">القطاع</label>
                <input value={form.sector} onChange={(e) => setForm((p) => ({ ...p, sector: e.target.value }))}
                  placeholder="مثال: تقنية المعلومات"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006C35]/20 focus:border-[#006C35]" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1 block">المدينة</label>
                <select value={form.city} onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006C35]/20 focus:border-[#006C35]">
                  {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1 block">نوع الوظيفة</label>
                <select value={form.job_type} onChange={(e) => setForm((p) => ({ ...p, job_type: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006C35]/20 focus:border-[#006C35]">
                  {JOB_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1 block">مستوى الخبرة</label>
                <select value={form.experience_level} onChange={(e) => setForm((p) => ({ ...p, experience_level: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006C35]/20 focus:border-[#006C35]">
                  {EXP_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1 block">الراتب (ريال)</label>
                <div className="flex gap-2">
                  <input value={form.salary_min} onChange={(e) => setForm((p) => ({ ...p, salary_min: e.target.value }))}
                    type="number" placeholder="من"
                    className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006C35]/20 focus:border-[#006C35]" />
                  <input value={form.salary_max} onChange={(e) => setForm((p) => ({ ...p, salary_max: e.target.value }))}
                    type="number" placeholder="إلى"
                    className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006C35]/20 focus:border-[#006C35]" />
                </div>
              </div>
            </div>
            <div className="mb-4">
              <label className="text-xs font-bold text-gray-600 mb-1 block">وصف الوظيفة</label>
              <textarea rows={4} value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                placeholder="اوصف الدور والمهام والمتطلبات..."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#006C35]/20 focus:border-[#006C35] resize-none" />
            </div>
            <div className="mb-5">
              <label className="text-xs font-bold text-gray-600 mb-1 block">المهارات المطلوبة (مفصولة بفاصلة)</label>
              <input value={form.skills} onChange={(e) => setForm((p) => ({ ...p, skills: e.target.value }))}
                placeholder="مثال: React، Node.js، SQL"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006C35]/20 focus:border-[#006C35]" />
            </div>
            {error && <p className="text-sm text-red-500 mb-3 text-right">{error}</p>}
            <div className="flex gap-3 justify-end">
              <Button variant="secondary" size="md" type="button" onClick={closeForm}>إلغاء</Button>
              <Button variant="primary" size="md" type="submit" disabled={saving}>
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                {editId ? 'حفظ التعديلات' : 'نشر الوظيفة'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Jobs Table */}
      {jobs.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <Briefcase size={40} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 font-bold">لا توجد وظائف منشورة بعد</p>
          <p className="text-xs text-gray-400 mt-1 mb-4">انشر أول وظيفة وابدأ باستقبال الطلبات</p>
          <Button variant="primary" size="sm" onClick={openCreate}>
            <Plus size={14} /> نشر وظيفتك الأولى
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden" dir="rtl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-right px-6 py-3 text-xs font-bold text-gray-500">الوظيفة</th>
                  <th className="text-right px-6 py-3 text-xs font-bold text-gray-500">الطلبات</th>
                  <th className="text-right px-6 py-3 text-xs font-bold text-gray-500">المشاهدات</th>
                  <th className="text-right px-6 py-3 text-xs font-bold text-gray-500">الحالة</th>
                  <th className="text-right px-6 py-3 text-xs font-bold text-gray-500">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-right">
                      <p className="text-sm font-black text-gray-900">{job.title}</p>
                      <p className="text-xs text-gray-400">{job.city ?? '—'} · {job.job_type}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center gap-1.5 justify-end">
                        <span className="text-sm font-bold text-gray-900">{job.applications_count ?? 0}</span>
                        <Users size={13} className="text-gray-400" />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm text-gray-600">{job.views_count ?? 0}</span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={job.is_active ? 'green' : 'gray'} dot>
                        {job.is_active ? 'نشط' : 'موقوف'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 justify-end">
                        <button
                          onClick={() => toggleActive(job.id, job.is_active)}
                          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                          title={job.is_active ? 'إيقاف' : 'تفعيل'}
                        >
                          {job.is_active ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                        <button
                          onClick={() => openEdit(job)}
                          className="p-1.5 rounded-lg hover:bg-amber-50 text-amber-400 hover:text-amber-600 transition-colors"
                        >
                          <Edit2 size={14} />
                        </button>
                        {deleteConfirm === job.id ? (
                          <div className="flex items-center gap-1">
                            <button onClick={() => handleDelete(job.id)} className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors">
                              <Check size={14} />
                            </button>
                            <button onClick={() => setDeleteConfirm(null)} className="p-1.5 rounded-lg bg-gray-50 text-gray-400 hover:bg-gray-100 transition-colors">
                              <X size={14} />
                            </button>
                          </div>
                        ) : (
                          <button onClick={() => setDeleteConfirm(job.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors">
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

