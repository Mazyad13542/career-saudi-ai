import { useState } from 'react';
import { Mic, MicOff, Play, RotateCcw, CheckCircle, Volume2, Lock, ChevronLeft } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import ScoreRing from '../../components/ui/ScoreRing';
import ProgressBar from '../../components/ui/ProgressBar';

const fields = [
  { id: 'tech',     label: 'تقنية المعلومات',  icon: '💻' },
  { id: 'finance',  label: 'المالية والمحاسبة', icon: '📊' },
  { id: 'eng',      label: 'الهندسة',           icon: '⚙️' },
  { id: 'marketing',label: 'التسويق',           icon: '📣' },
  { id: 'hr',       label: 'الموارد البشرية',   icon: '👥' },
  { id: 'medical',  label: 'الطب والصحة',       icon: '🏥' },
];

const languages = [
  { id: 'ar',   label: 'عربي',             flag: '🇸🇦' },
  { id: 'en',   label: 'إنجليزي',          flag: '🇬🇧' },
  { id: 'both', label: 'عربي وإنجليزي',    flag: '🌐' },
];

const sampleQuestions = {
  tech: [
    'حدّثني عن نفسك وخلفيتك التقنية.',
    'ما هي أصعب مشكلة تقنية واجهتها وكيف حللتها؟',
    'صف بنية مشروع عملت عليه.',
    'كيف تتعامل مع code review؟',
    'أين ترى نفسك بعد ٥ سنوات في مجال التقنية؟',
  ],
  finance: [
    'حدّثني عن خبرتك في المحاسبة والتحليل المالي.',
    'كيف تتعامل مع التناقضات في البيانات المالية؟',
    'صف تجربتك مع برامج المحاسبة.',
    'كيف تضمن الدقة في التقارير المالية؟',
    'ما هو أكبر تحدٍّ مالي واجهته في دورك السابق؟',
  ],
  eng: [
    'ما هي مجالات الهندسة التي تخصصت فيها؟',
    'حدّثني عن مشروع هندسي معقد أشرفت عليه.',
    'كيف تتعامل مع التحديات غير المتوقعة في المشاريع؟',
    'ما هي معايير السلامة التي تلتزم بها؟',
    'كيف تتعاون مع فريق متعدد التخصصات؟',
  ],
  marketing: [
    'صف حملة تسويقية ناجحة أطلقتها.',
    'كيف تقيس نجاح استراتيجية التسويق الرقمي؟',
    'ما هي أدوات التحليل التي تستخدمها؟',
    'كيف تتكيف مع تغيرات السوق المفاجئة؟',
    'ما هو دورك في بناء هوية العلامة التجارية؟',
  ],
  hr: [
    'كيف تتعامل مع الخلافات بين الموظفين؟',
    'ما هي استراتيجيتك في استقطاب المواهب؟',
    'حدّثني عن تجربتك في إدارة الأداء.',
    'كيف تبني ثقافة مؤسسية إيجابية؟',
    'صف أصعب قرار HR اتخذته.',
  ],
  medical: [
    'حدّثني عن خلفيتك الطبية وتخصصك.',
    'كيف تتعامل مع مريض في حالة طارئة؟',
    'ما هي أحدث التطورات في مجالك؟',
    'كيف تحافظ على التطوير المهني المستمر؟',
    'صف حالة طبية صعبة تعاملت معها.',
  ],
};

const demoResults = {
  englishLevel: 'B',
  englishLabel: 'جيد',
  confidenceScore: 78,
  communicationScore: 82,
  clarityScore: 75,
  grammarScore: 80,
  vocabulary: 73,
  improvements: [
    'استخدم أمثلة محددة عند الإجابة (طريقة STAR)',
    'قلّل كلمات الحشو — رُصد استخدامها ١٢ مرة',
    'زد وتيرة الكلام قليلاً — بدت بطيئة في القسم الثالث',
    'وسّع مفرداتك: جرّب مرادفات أكثر تنوعاً',
    'هيكل إجاباتك بمقدمة وعرض وخاتمة واضحة',
  ],
  strengths: [
    'نطق واثق وواضح',
    'استخدام جيد للمفردات المتخصصة في مجالك',
    'تسلسل منطقي في إجاباتك',
  ],
};

export default function AIInterview() {
  const [phase, setPhase] = useState('setup');
  const [selectedField, setSelectedField] = useState('tech');
  const [selectedLang, setSelectedLang] = useState('en');
  const [recording, setRecording] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [progress, setProgress] = useState(0);

  const questions = sampleQuestions[selectedField] || sampleQuestions.tech;

  const startInterview = () => { setPhase('interview'); setCurrentQ(0); setProgress(0); };
  const toggleRecording = () => setRecording(!recording);

  const nextQuestion = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
      setProgress(((currentQ + 1) / questions.length) * 100);
      setRecording(false);
    } else {
      setPhase('results');
    }
  };

  const reset = () => { setPhase('setup'); setCurrentQ(0); setProgress(0); setRecording(false); };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-6 text-right">
        <h1 className="text-2xl font-black text-gray-900">المقابلة التجريبية</h1>
        <p className="text-gray-500 text-sm mt-0.5">محاكاة مقابلة صوتية تفاعلية مع تحليل احترافي للأداء</p>
      </div>

      {/* ── SETUP PHASE ── */}
      {phase === 'setup' && (
        <div className="max-w-2xl mx-auto space-y-5">
          {/* Field selection */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-black text-gray-900 mb-4 text-right">اختر مجالك الوظيفي</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {fields.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSelectedField(f.id)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    selectedField === f.id
                      ? 'border-[#006C35] bg-[#006C35]/5'
                      : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <span className="text-2xl">{f.icon}</span>
                  <span className={`text-xs font-bold ${selectedField === f.id ? 'text-[#006C35]' : 'text-gray-600'}`}>
                    {f.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Language selection */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-black text-gray-900 mb-4 text-right">لغة المقابلة</h2>
            <div className="grid grid-cols-3 gap-3">
              {languages.map((l) => (
                <button
                  key={l.id}
                  onClick={() => setSelectedLang(l.id)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    selectedLang === l.id
                      ? 'border-[#006C35] bg-[#006C35]/5'
                      : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <span className="text-2xl">{l.flag}</span>
                  <span className={`text-xs font-bold ${selectedLang === l.id ? 'text-[#006C35]' : 'text-gray-600'}`}>
                    {l.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* What you get */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-black text-gray-900 mb-4 text-right">ستحصل على</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { icon: '🎯', label: 'مستوى اللغة', sub: 'تقييم A/B/C/D' },
                { icon: '💪', label: 'نقاط الثقة', sub: 'من ١٠٠' },
                { icon: '🗣️', label: 'التواصل', sub: 'تحليل مفصّل' },
                { icon: '📈', label: 'توصيات تحسين', sub: 'مخصصة لك' },
                { icon: '✅', label: 'نقاط القواعد', sub: 'جودة الجمل' },
                { icon: '📚', label: 'المفردات', sub: 'ثراء اللغة' },
              ].map((item) => (
                <div key={item.label} className="p-3 bg-gray-50 rounded-xl text-center">
                  <span className="text-xl">{item.icon}</span>
                  <p className="text-xs font-black text-gray-800 mt-1">{item.label}</p>
                  <p className="text-[10px] text-gray-400">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl">
              <Lock size={13} className="text-amber-500" />
              <span className="text-xs text-amber-700 font-bold">جلسات غير محدودة في الخطة الاحترافية</span>
            </div>
            <Button variant="primary" size="lg" onClick={startInterview}>
              <Play size={16} />
              ابدأ المقابلة
            </Button>
          </div>
          <p className="text-center text-xs text-gray-400">الوضع التجريبي: نتائج محاكاة لعرض الواجهة</p>
        </div>
      )}

      {/* ── INTERVIEW PHASE ── */}
      {phase === 'interview' && (
        <div className="max-w-2xl mx-auto space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400">السؤال {currentQ + 1} من {questions.length}</span>
              <span className="text-xs font-bold text-gray-600">{fields.find(f => f.id === selectedField)?.label}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div className="bg-[#006C35] h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-xs font-bold text-[#006C35]">يُرجى الإجابة بالصوت</span>
              <Volume2 size={16} className="text-[#006C35]" />
            </div>
            <div className="w-16 h-16 rounded-2xl bg-[#006C35]/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-black text-[#006C35]">س{currentQ + 1}</span>
            </div>
            <p className="text-xl font-black text-gray-900 leading-relaxed mb-8">
              "{questions[currentQ]}"
            </p>

            <div className="flex flex-col items-center gap-4">
              <button
                onClick={toggleRecording}
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
                  recording
                    ? 'bg-red-500 shadow-lg shadow-red-200 animate-pulse scale-110'
                    : 'bg-[#006C35] hover:bg-[#005528] shadow-lg shadow-[#006C35]/30 hover:scale-105'
                }`}
              >
                {recording ? <MicOff size={28} className="text-white" /> : <Mic size={28} className="text-white" />}
              </button>
              <p className="text-sm text-gray-500">
                {recording ? (
                  <span className="text-red-500 font-bold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    يتم التسجيل... انقر للإيقاف
                  </span>
                ) : 'انقر على الميكروفون لبدء تسجيل إجابتك'}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" size="md" className="flex-1" onClick={() => setRecording(false)}>
              تخطّى
            </Button>
            <Button variant="primary" size="md" className="flex-1" onClick={nextQuestion}>
              {currentQ === questions.length - 1 ? '🎯 احصل على النتائج' : 'السؤال التالي →'}
            </Button>
          </div>
        </div>
      )}

      {/* ── RESULTS PHASE ── */}
      {phase === 'results' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-l from-[#006C35] to-[#00A651] rounded-2xl p-6 text-white relative overflow-hidden">
            <div className="absolute inset-0 saudi-geo-pattern opacity-[0.04] pointer-events-none" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-4 justify-end">
                <div className="text-right">
                  <h2 className="font-black text-lg">اكتمل تحليل المقابلة</h2>
                  <p className="text-green-200 text-xs">تقرير احترافي — نتائج تجريبية</p>
                </div>
                <CheckCircle size={24} className="text-[#C8A951]" />
              </div>
              <div className="flex flex-wrap gap-3 justify-end">
                {[
                  { label: 'المفردات', value: demoResults.vocabulary },
                  { label: 'التواصل', value: demoResults.communicationScore },
                  { label: 'الثقة', value: demoResults.confidenceScore },
                ].map((s) => (
                  <div key={s.label} className="px-4 py-2 bg-white/20 rounded-xl text-right">
                    <p className="text-xs text-green-200">{s.label}</p>
                    <p className="text-2xl font-black">{s.value}</p>
                    <p className="text-xs text-green-200">من ١٠٠</p>
                  </div>
                ))}
                <div className="px-4 py-2 bg-white/20 rounded-xl text-right">
                  <p className="text-xs text-green-200">مستوى اللغة</p>
                  <p className="text-2xl font-black">{demoResults.englishLevel}</p>
                  <p className="text-xs text-green-200">{demoResults.englishLabel}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h3 className="font-black text-gray-900 mb-5 text-right">تفصيل النقاط</h3>
              <div className="flex justify-around mb-6">
                <ScoreRing score={demoResults.clarityScore} label="الوضوح" color="#C8A951" size={72} />
                <ScoreRing score={demoResults.communicationScore} label="التواصل" color="#1A56DB" size={72} />
                <ScoreRing score={demoResults.confidenceScore} label="الثقة" color="#006C35" size={72} />
              </div>
              <div className="space-y-3">
                <ProgressBar label="المفردات" value={demoResults.vocabulary} color="blue" size="sm" />
                <ProgressBar label="القواعد" value={demoResults.grammarScore} color="green" size="sm" />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h3 className="font-black text-gray-900 mb-4 text-right">مجالات التحسين</h3>
              <ul className="space-y-3">
                {demoResults.improvements.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600 flex-row-reverse">
                    <span>{tip}</span>
                    <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-600 text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-black">{i + 1}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h3 className="font-black text-gray-900 mb-4 text-right">نقاط قوتك</h3>
                <ul className="space-y-3">
                  {demoResults.strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600 flex-row-reverse">
                      <span>{s}</span>
                      <CheckCircle size={15} className="text-[#006C35] flex-shrink-0 mt-0.5" />
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-gradient-to-bl from-[#006C35] to-[#004D25] rounded-2xl p-5 text-white">
                <Lock size={14} className="text-green-300 mb-2 mr-auto" />
                <h4 className="font-black text-sm mb-1 text-right">تقييم أكثر تفصيلاً؟</h4>
                <p className="text-xs text-green-200 mb-3 text-right">افتح جلسات غير محدودة مع نصوص كاملة وتوجيه مخصص</p>
                <Button variant="gold" size="sm" className="w-full">ترقَّ إلى الاحترافية</Button>
              </div>
              <Button variant="secondary" size="md" className="w-full" onClick={reset}>
                <RotateCcw size={14} />
                إعادة الإعداد واختيار مجال جديد
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
