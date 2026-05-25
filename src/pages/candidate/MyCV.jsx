import { useState } from 'react';
import { Upload, Download, RefreshCw, Sparkles, Lock, CheckCircle, AlertCircle, Info,
         ArrowLeft, FileText, Layers, Palette, Trash2, Star, Edit3 } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import ScoreRing from '../../components/ui/ScoreRing';
import ProgressBar from '../../components/ui/ProgressBar';
import Badge from '../../components/ui/Badge';
import { useCVs } from '../../hooks/useCVs';
import { track, EVENTS } from '../../lib/analytics';

const STEPS = [
  { id: 1, label: 'رفع الملف' },
  { id: 2, label: 'التحليل' },
  { id: 3, label: 'النتائج' },
  { id: 4, label: 'القالب' },
  { id: 5, label: 'تحميل PDF' },
];

const SUGGESTIONS = [
  { type: 'success', text: 'استخدام أفعال قوية في قسم الخبرات — ممتاز', icon: CheckCircle },
  { type: 'warning', text: 'أضف كلمات مفتاحية: "Agile"، "CI/CD"، "REST APIs"', icon: AlertCircle },
  { type: 'warning', text: 'دعّم إنجازاتك بأرقام وإحصاءات محددة', icon: AlertCircle },
  { type: 'info',    text: 'فكّر في إضافة ملخص مهني في بداية السيرة', icon: Info },
  { type: 'success', text: 'قسم التعليم منظّم بشكل ممتاز', icon: CheckCircle },
  { type: 'warning', text: 'رابط LinkedIn مفقود — أضفه لتعزيز ظهورك', icon: AlertCircle },
];

const CV_SECTIONS = [
  { label: 'معلومات التواصل',         score: 95, color: 'green' },
  { label: 'الملخص المهني',           score: 72, color: 'blue' },
  { label: 'الخبرة العملية',          score: 85, color: 'green' },
  { label: 'التعليم',                  score: 90, color: 'green' },
  { label: 'المهارات والكلمات المفتاحية', score: 68, color: 'gold' },
  { label: 'الشهادات',                score: 80, color: 'blue' },
];

const TEMPLATES = [
  { id: 'modern',    name: 'عصري نظيف',   desc: 'تصميم أبيض بسيط',            badge: 'الحالي',  badgeColor: 'bg-[#006C35]/10 text-[#006C35]' },
  { id: 'bilingual', name: 'مهني سعودي',  desc: 'ثنائي اللغة عربي/إنجليزي',  badge: null,      badgeColor: '' },
  { id: 'executive', name: 'تنفيذي',      desc: 'رأس داكن فاخر',              badge: 'احترافي', badgeColor: 'bg-amber-50 text-amber-600' },
  { id: 'tech',      name: 'تقني',        desc: 'موجّه للمطورين',             badge: 'احترافي', badgeColor: 'bg-amber-50 text-amber-600' },
];

export default function MyCV() {
  const { cvs, activeCV, loading: cvsLoading, uploadCV, deleteCV, setActiveCV, renameCV, getDownloadUrl } = useCVs();

  const [step,             setStep]             = useState(3);
  const [dragging,         setDragging]         = useState(false);
  const [uploading,        setUploading]        = useState(false);
  const [uploadProgress,   setUploadProgress]   = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [uploadError,      setUploadError]      = useState('');
  const [renamingId,       setRenamingId]       = useState(null);
  const [renameValue,      setRenameValue]      = useState('');

  const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

  const handleFile = async (file) => {
    setUploadError('');
    if (!file) return;
    if (file.size > MAX_SIZE) { setUploadError('حجم الملف يتجاوز ١٠ ميجابايت'); return; }
    const allowed = ['application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowed.includes(file.type)) { setUploadError('يُقبل PDF أو Word فقط'); return; }

    setStep(2); setUploading(true); setUploadProgress(0);

    // Fake progress while uploading
    const ticker = setInterval(() => setUploadProgress((p) => Math.min(p + 12, 85)), 400);
    const { error } = await uploadCV(file, file.name.replace(/\.[^/.]+$/, ''));
    clearInterval(ticker);

    if (error) {
      setUploadError(error.message.includes('Bucket') || error.message.includes('bucket')
        ? 'مجلد التخزين غير مُعدّ بعد. راجع خطوات إعداد Supabase Storage.'
        : `فشل الرفع: ${error.message}`);
      setStep(1);
    } else {
      setUploadProgress(100);
      track(EVENTS.CV_UPLOADED, { fileType: file.type, fileSize: file.size });
      setTimeout(() => { setUploading(false); setStep(3); }, 600);
    }
    setUploading(false);
  };

  const handleDownload = async (cv) => {
    const url = await getDownloadUrl(cv.file_path);
    if (url) { window.open(url, '_blank'); track(EVENTS.CV_DOWNLOADED, { cvId: cv.id }); }
  };

  const handleRename = async (cvId) => {
    if (!renameValue.trim()) { setRenamingId(null); return; }
    await renameCV(cvId, renameValue.trim());
    setRenamingId(null);
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-3">
          {activeCV && (
            <Button variant="primary" size="sm" onClick={() => handleDownload(activeCV)}>
              <Download size={14} />
              تحميل PDF
            </Button>
          )}
          <Button variant="secondary" size="sm" onClick={() => { setStep(1); setUploadError(''); }}>
            <Upload size={14} />
            رفع سيرة جديدة
          </Button>
        </div>
        <div className="text-right">
          <h1 className="text-2xl font-black text-gray-900">سيرتي الذاتية</h1>
          <p className="text-gray-500 text-sm mt-0.5">بناء وتحسين وتحميل سيرتك الذاتية</p>
        </div>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-6 bg-white rounded-2xl border border-gray-100 p-4 shadow-sm overflow-x-auto">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => step >= s.id && setStep(s.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                step === s.id ? 'bg-[#006C35] text-white'
                : step > s.id ? 'bg-[#006C35]/10 text-[#006C35]'
                : 'bg-gray-50 text-gray-400'}`}
            >
              {step > s.id ? <CheckCircle size={12} /> : <span>{s.id}</span>}
              {s.label}
            </button>
            {i < STEPS.length - 1 && (
              <div className={`w-6 h-px ${step > s.id ? 'bg-[#006C35]/40' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      {/* ── STEP 1: Upload ── */}
      {step === 1 && (
        <div className="max-w-2xl mx-auto space-y-4">
          {uploadError && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl">
              <AlertCircle size={15} className="text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-700">{uploadError}</p>
            </div>
          )}

          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
            className={`border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-200 ${
              dragging ? 'border-[#006C35] bg-[#006C35]/5 scale-[1.01]' : 'border-gray-200 bg-gray-50 hover:border-[#006C35]/40 hover:bg-[#006C35]/3'}`}
          >
            <div className="w-16 h-16 rounded-2xl bg-[#006C35]/10 flex items-center justify-center mx-auto mb-4">
              <Upload size={28} className="text-[#006C35]" />
            </div>
            <h3 className="text-lg font-black text-gray-900 mb-2">ارفع سيرتك الذاتية</h3>
            <p className="text-sm text-gray-400 mb-6">PDF أو Word · حجم أقصى ١٠ ميجابايت</p>
            <label className="cursor-pointer">
              <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
              <span className="inline-flex items-center gap-2 px-6 py-3 bg-[#006C35] text-white text-sm font-black rounded-xl hover:bg-[#005528] transition-colors">
                <Upload size={16} />
                اختر ملفاً
              </span>
            </label>
            <p className="text-xs text-gray-400 mt-4">أو اسحب الملف وأفلته هنا</p>
          </div>

          {/* Existing CVs list */}
          {cvs.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-black text-gray-900 text-right mb-4">السير الذاتية المحفوظة</h3>
              <div className="space-y-3">
                {cvs.map((cv) => (
                  <div key={cv.id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button onClick={() => deleteCV(cv.id, cv.file_path)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 size={14} />
                      </button>
                      <button onClick={() => { setRenamingId(cv.id); setRenameValue(cv.name); }} className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-500 transition-colors">
                        <Edit3 size={14} />
                      </button>
                      {cv.file_path && (
                        <button onClick={() => handleDownload(cv)} className="p-1.5 rounded-lg hover:bg-green-50 text-gray-400 hover:text-green-600 transition-colors">
                          <Download size={14} />
                        </button>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 text-right">
                      {renamingId === cv.id ? (
                        <form onSubmit={(e) => { e.preventDefault(); handleRename(cv.id); }} className="flex gap-2">
                          <Button type="submit" variant="primary" size="sm">حفظ</Button>
                          <input
                            autoFocus
                            value={renameValue}
                            onChange={(e) => setRenameValue(e.target.value)}
                            onBlur={() => handleRename(cv.id)}
                            className="flex-1 px-3 py-1.5 text-sm border border-[#006C35] rounded-lg focus:outline-none text-right"
                          />
                        </form>
                      ) : (
                        <>
                          <p className="text-sm font-black text-gray-900 truncate">{cv.name}</p>
                          <p className="text-xs text-gray-400">{new Date(cv.created_at).toLocaleDateString('ar-SA')}</p>
                        </>
                      )}
                    </div>
                    <button
                      onClick={() => setActiveCV(cv.id)}
                      className={`flex-shrink-0 p-1.5 rounded-lg transition-colors ${cv.is_active ? 'text-[#C8A951]' : 'text-gray-300 hover:text-[#C8A951]'}`}
                    >
                      <Star size={16} className={cv.is_active ? 'fill-[#C8A951]' : ''} />
                    </button>
                    <div className="w-10 h-10 rounded-xl bg-[#006C35]/10 flex items-center justify-center flex-shrink-0">
                      <FileText size={18} className="text-[#006C35]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── STEP 2: Uploading/Analyzing ── */}
      {step === 2 && (
        <div className="max-w-xl mx-auto text-center">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10">
            <div className="w-20 h-20 rounded-3xl bg-[#006C35]/10 flex items-center justify-center mx-auto mb-6 relative">
              <FileText size={32} className="text-[#006C35]" />
              {uploading && <div className="absolute inset-0 rounded-3xl border-2 border-[#006C35] border-t-transparent animate-spin" />}
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2">
              {uploading ? 'جارٍ رفع السيرة الذاتية...' : 'اكتمل الرفع! ✅'}
            </h3>
            <p className="text-sm text-gray-400 mb-8">
              {uploading ? 'نحفظ ملفك بأمان في التخزين السحابي' : 'سيتم توجيهك إلى النتائج'}
            </p>
            <div className="w-full bg-gray-100 rounded-full h-2.5 mb-4">
              <div className="bg-[#006C35] h-2.5 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>{Math.round(uploadProgress)}٪</span>
              <span>{uploading ? 'جارٍ الرفع' : 'مكتمل'}</span>
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 3: Results ── */}
      {step === 3 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
                <Button variant="ghost" size="sm" onClick={() => setStep(1)}>
                  <RefreshCw size={14} />
                  رفع سيرة جديدة
                </Button>
                <div className="flex items-center gap-3">
                  {activeCV && <span className="text-xs text-gray-400 truncate max-w-40">{activeCV.name}</span>}
                  <Badge variant="green" dot>محفوظة</Badge>
                </div>
              </div>

              {/* CV Preview */}
              <div className="p-6">
                <div className="border border-gray-100 rounded-xl p-6 bg-gray-50 min-h-80 font-mono text-sm">
                  <div className="text-center border-b border-gray-200 pb-4 mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Mohammed Al-Ghamdi</h3>
                    <p className="text-gray-500 text-xs">Software Engineer · Riyadh, Saudi Arabia</p>
                    <p className="text-[#006C35] text-xs latin">mohammed@example.com · +966-XX-XXX-XXXX</p>
                  </div>
                  <div className="mb-4">
                    <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider border-b border-gray-200 pb-1 mb-2">Work Experience</h4>
                    <div className="mb-3">
                      <div className="flex justify-between">
                        <p className="text-xs text-gray-400">2022 – Present</p>
                        <p className="text-xs font-semibold text-gray-800">Software Engineer</p>
                      </div>
                      <p className="text-xs text-[#006C35] font-medium text-right">TechStart Arabia · Riyadh</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider border-b border-gray-200 pb-1 mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-1 justify-end">
                      {['React', 'Node.js', 'Python', 'AWS', 'Docker', 'PostgreSQL'].map((s) => (
                        <span key={s} className="px-2 py-0.5 bg-[#006C35]/8 text-[#006C35] text-[10px] rounded-full latin">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 pb-4 flex gap-3 justify-end">
                <Button variant="secondary" size="sm" onClick={() => setStep(4)}>
                  <Palette size={14} />
                  تغيير القالب
                </Button>
                <Button variant="primary" size="sm" onClick={() => setStep(5)}>
                  <Download size={14} />
                  تحميل PDF
                </Button>
              </div>
            </div>

            {/* Suggestions */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4 justify-end">
                <h2 className="font-bold text-gray-900">اقتراحات تحسين السيرة</h2>
                <Sparkles size={16} className="text-[#006C35]" />
              </div>
              <div className="space-y-3">
                {SUGGESTIONS.map((s, i) => {
                  const colorMap = { success: 'text-green-600 bg-green-50', warning: 'text-amber-600 bg-amber-50', info: 'text-blue-600 bg-blue-50' };
                  return (
                    <div key={i} className={`flex items-start gap-3 p-3 rounded-xl ${colorMap[s.type]} flex-row-reverse`}>
                      <s.icon size={15} className="mt-0.5 flex-shrink-0" />
                      <p className="text-xs font-bold text-right flex-1">{s.text}</p>
                    </div>
                  );
                })}
              </div>
              <div className="mt-5 p-4 bg-gradient-to-l from-[#006C35]/8 to-[#C8A951]/5 border border-[#006C35]/15 rounded-xl">
                <div className="flex items-center gap-2 justify-end mb-2">
                  <p className="text-sm font-black text-gray-800">حسّن السيرة لوظيفة محددة</p>
                  <Lock size={13} className="text-amber-500" />
                </div>
                <p className="text-xs text-gray-500 text-right mb-3">اختر وظيفة من قائمتك وسيتم تخصيص سيرتك لتطابقها بشكل أمثل</p>
                <Button variant="gold" size="sm" className="w-full">فتح مع الخطة الاحترافية</Button>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm text-center">
              <p className="text-sm font-bold text-gray-700 mb-4">نقاط ATS</p>
              <div className="flex justify-center mb-3">
                <ScoreRing score={82} size={100} strokeWidth={8} color="#006C35" label="ATS الكلي" />
              </div>
              <p className="text-xs text-gray-400 mb-5">جيد — سيرتك تجتاز معظم فلاتر ATS</p>
              <div className="space-y-3">
                {CV_SECTIONS.map((section) => (
                  <ProgressBar key={section.label} label={section.label} value={section.score} color={section.color} size="sm" />
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-bl from-[#006C35] to-[#004D25] rounded-2xl p-5 text-white">
              <div className="flex items-center gap-2 mb-2 justify-end">
                <span className="text-xs font-black text-green-200 uppercase tracking-wider">احترافي</span>
                <Lock size={14} className="text-green-300" />
              </div>
              <h3 className="font-black mb-1 text-right">خصّص السيرة لهذه الوظيفة</h3>
              <p className="text-xs text-green-200 mb-4 leading-relaxed text-right">يكيّف النظام سيرتك تحديداً لكل وظيفة لزيادة درجة التطابق وفرص الرد.</p>
              <Button variant="gold" size="sm" className="w-full">ترقَّ لفتح الميزة</Button>
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 4: Template ── */}
      {step === 4 && (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <button onClick={() => setStep(3)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
                <ArrowLeft size={14} className="icon-rtl-flip" />
                رجوع
              </button>
              <h2 className="font-black text-gray-900 flex items-center gap-2">
                <Layers size={18} className="text-[#006C35]" />
                اختر قالب السيرة
              </h2>
            </div>
            <div className="space-y-3">
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTemplate(t.id)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all text-right ${selectedTemplate === t.id ? 'border-[#006C35] bg-[#006C35]/5' : 'border-gray-100 hover:border-gray-200'}`}
                >
                  {t.badge && <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${t.badgeColor}`}>{t.badge}</span>}
                  <div>
                    <p className={`text-sm font-bold ${selectedTemplate === t.id ? 'text-[#006C35]' : 'text-gray-700'}`}>{t.name}</p>
                    <p className="text-xs text-gray-400">{t.desc}</p>
                  </div>
                </button>
              ))}
            </div>
            <Button variant="primary" size="lg" className="w-full mt-6" onClick={() => setStep(5)}>
              <CheckCircle size={16} />
              تطبيق القالب والمتابعة
            </Button>
          </div>
        </div>
      )}

      {/* ── STEP 5: Download ── */}
      {step === 5 && (
        <div className="max-w-md mx-auto text-center">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10">
            <div className="w-20 h-20 rounded-3xl bg-green-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={36} className="text-green-600" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">سيرتك جاهزة! 🎉</h3>
            <p className="text-gray-400 text-sm mb-8">تم إنشاء نسخة محسّنة لـ ATS بالقالب المختار</p>
            <div className="space-y-3">
              {activeCV ? (
                <Button variant="primary" size="lg" className="w-full" onClick={() => handleDownload(activeCV)}>
                  <Download size={18} />
                  تحميل PDF
                </Button>
              ) : (
                <p className="text-xs text-gray-400">ارفع سيرة أولاً لتتمكن من التحميل</p>
              )}
              <Button variant="secondary" size="lg" className="w-full" onClick={() => setStep(3)}>
                <RefreshCw size={16} />
                العودة للسيرة
              </Button>
            </div>
            <div className="mt-6 p-4 bg-[#006C35]/5 border border-[#006C35]/15 rounded-xl text-right">
              <p className="text-xs font-black text-[#006C35] mb-1">نصيحة</p>
              <p className="text-xs text-gray-500">خصّص سيرتك لكل وظيفة تتقدم لها لمضاعفة فرص الرد</p>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
