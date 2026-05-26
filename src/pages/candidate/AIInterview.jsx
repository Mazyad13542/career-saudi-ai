import { useState, useEffect, useCallback, useRef } from 'react';
import { Play, RotateCcw, CheckCircle, ChevronLeft, Loader2, Lock, Star, BookOpen } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import ScoreRing from '../../components/ui/ScoreRing';
import ProgressBar from '../../components/ui/ProgressBar';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

// ── Data ─────────────────────────────────────────────────────────────────────
const FIELDS = [
  { id: 'tech',      label: 'تقنية المعلومات',   icon: '💻' },
  { id: 'finance',   label: 'المالية والمحاسبة',  icon: '📊' },
  { id: 'eng',       label: 'الهندسة',            icon: '⚙️' },
  { id: 'marketing', label: 'التسويق',            icon: '📣' },
  { id: 'hr',        label: 'الموارد البشرية',    icon: '👥' },
  { id: 'medical',   label: 'الطب والصحة',        icon: '🏥' },
];

const QUESTIONS = {
  tech: [
    { q: 'حدّثني عن نفسك وخلفيتك التقنية.', tips: ['اذكر سنوات خبرتك', 'أبرز مهاراتك الأساسية', 'اختم بما تبحث عنه'] },
    { q: 'ما هي أصعب مشكلة تقنية واجهتها وكيف حللتها؟', tips: ['استخدم أسلوب STAR', 'كن محدداً في وصف المشكلة', 'أبرز أثر الحل'] },
    { q: 'كيف تتعامل مع مراجعة الكود (Code Review)؟', tips: ['اذكر أهمية التوثيق', 'تحدّث عن التعاون', 'أبرز كيفية التعلّم من الملاحظات'] },
    { q: 'صف بنية مشروع تقني عملت عليه.', tips: ['اذكر التقنيات المستخدمة', 'وضّح التحديات المعمارية', 'أبرز قراراتك التصميمية'] },
    { q: 'أين ترى نفسك بعد ٥ سنوات في مجال التقنية؟', tips: ['اربط أهدافك بنمو الشركة', 'كن واقعياً ومطمحاً', 'اذكر مسار التطور المهني'] },
  ],
  finance: [
    { q: 'حدّثني عن خبرتك في المحاسبة والتحليل المالي.', tips: ['اذكر الأنظمة التي أتقنتها', 'أبرز إنجازاً بالأرقام', 'اذكر المعايير التي تعمل وفقها'] },
    { q: 'كيف تتعامل مع التناقضات في البيانات المالية؟', tips: ['اذكر منهجيتك خطوة بخطوة', 'أبرز أهمية الدقة', 'اذكر أدوات التحقق التي تستخدمها'] },
    { q: 'كيف تضمن الدقة في التقارير المالية؟', tips: ['اذكر إجراءات المراجعة', 'تحدّث عن المراجعة المزدوجة', 'أبرز أدوات التحقق الآلي'] },
    { q: 'ما هو أكبر تحدٍّ مالي واجهته في دورك السابق؟', tips: ['استخدم أسلوب STAR', 'اذكر الأثر المالي', 'كيف تعاملت مع الضغط'] },
    { q: 'كيف تتعامل مع متطلبات الامتثال والتدقيق؟', tips: ['اذكر أنظمة محددة', 'تحدّث عن تنظيم الوثائق', 'أبرز أهمية الشفافية'] },
  ],
  eng: [
    { q: 'ما هي مجالات الهندسة التي تخصصت فيها؟', tips: ['اذكر تخصصك بدقة', 'أبرز مهاراتك التطبيقية', 'اذكر الأدوات التي تتقنها'] },
    { q: 'حدّثني عن مشروع هندسي معقد أشرفت عليه.', tips: ['صف الهدف والمدة والفريق', 'اذكر التحديات الفنية', 'أبرز نتيجة قابلة للقياس'] },
    { q: 'كيف تتعامل مع التحديات غير المتوقعة في المشاريع؟', tips: ['اذكر مثالاً حقيقياً', 'وضّح منهجية التحليل', 'تحدّث عن التواصل مع الفريق'] },
    { q: 'ما هي معايير السلامة التي تلتزم بها؟', tips: ['اذكر معايير محددة', 'تحدّث عن ثقافة السلامة', 'أبرز تطبيقك العملي لها'] },
    { q: 'كيف تتعاون مع فريق متعدد التخصصات؟', tips: ['اذكر أدوات التعاون', 'تحدّث عن إدارة التوقعات', 'أبرز مهاراتك في التواصل'] },
  ],
  marketing: [
    { q: 'صف حملة تسويقية ناجحة أطلقتها.', tips: ['اذكر الهدف والميزانية', 'وضّح القنوات المستخدمة', 'أبرز النتائج بالأرقام'] },
    { q: 'كيف تقيس نجاح استراتيجية التسويق الرقمي؟', tips: ['اذكر KPIs محددة', 'تحدّث عن أدوات التحليل', 'اربط المقاييس بالأهداف التجارية'] },
    { q: 'ما هي أدوات التحليل التي تستخدمها؟', tips: ['اذكر أدوات بعينها', 'تحدّث عن كيفية استخدام البيانات', 'أبرز قراراً اتخذته بناءً على التحليل'] },
    { q: 'كيف تتكيف مع تغيرات السوق المفاجئة؟', tips: ['اذكر مثالاً واقعياً', 'تحدّث عن مرونة الاستراتيجية', 'أبرز سرعة الاستجابة'] },
    { q: 'كيف تبني هوية علامة تجارية قوية؟', tips: ['اذكر عناصر الهوية', 'تحدّث عن الاتساق في التواصل', 'أبرز دورك في بناء الهوية'] },
  ],
  hr: [
    { q: 'كيف تتعامل مع الخلافات بين الموظفين؟', tips: ['اذكر منهجية الوساطة', 'تحدّث عن الاستماع الفعّال', 'أبرز أثر حلولك'] },
    { q: 'ما هي استراتيجيتك في استقطاب المواهب؟', tips: ['اذكر قنوات التوظيف', 'تحدّث عن تجربة المرشح', 'أبرز نتائج قابلة للقياس'] },
    { q: 'حدّثني عن تجربتك في إدارة الأداء.', tips: ['اذكر نظام التقييم الذي تستخدمه', 'تحدّث عن المحادثات البنّاءة', 'أبرز أثر التحسين'] },
    { q: 'كيف تبني ثقافة مؤسسية إيجابية؟', tips: ['اذكر مبادرات محددة', 'تحدّث عن الشمول والتنوع', 'أبرز مؤشرات الرضا الوظيفي'] },
    { q: 'صف أصعب قرار HR اتخذته.', tips: ['اذكر السياق بدقة', 'تحدّث عن منهجية القرار', 'أبرز الدرس المستفاد'] },
  ],
  medical: [
    { q: 'حدّثني عن خلفيتك الطبية وتخصصك.', tips: ['اذكر تخصصك وسنوات خبرتك', 'أبرز إنجازاً طبياً بارزاً', 'اذكر التطوير المهني المستمر'] },
    { q: 'كيف تتعامل مع مريض في حالة طارئة؟', tips: ['اذكر بروتوكول التقييم', 'تحدّث عن الهدوء وتحديد الأولويات', 'أبرز التواصل مع الفريق'] },
    { q: 'كيف تضمن جودة الرعاية وسلامة المريض؟', tips: ['اذكر بروتوكولات السلامة', 'تحدّث عن توثيق الحالات', 'أبرز نهجك الوقائي'] },
    { q: 'كيف تحافظ على التطوير المهني المستمر؟', tips: ['اذكر دورات أو شهادات حديثة', 'تحدّث عن المؤتمرات الطبية', 'أبرز تطبيق المستجدات'] },
    { q: 'كيف تتعامل مع أسرة مريض صعب؟', tips: ['تحدّث عن التواصل الصادق', 'اذكر مهارات التعاطف', 'أبرز الحدود المهنية'] },
  ],
};

// ── Scoring Logic ─────────────────────────────────────────────────────────────
function scoreAnswer(text, tips) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const lengthScore = Math.min(40, Math.round((words / 100) * 40));

  const structureKw = ['أولاً', 'ثانياً', 'أخيراً', 'مثلاً', 'نتيجةً', 'تمكّنت', 'حققت', 'أنجزت', 'خلال', 'بناءً', 'نسبة', 'زادت', 'حسّنت', 'قلّلت', 'فريق', 'نتيجة', 'أثر'];
  const found = structureKw.filter(kw => text.includes(kw)).length;
  const structureScore = Math.min(30, found * 5);

  const starKw = ['عندما', 'واجهت', 'قررت', 'فعلت', 'النتيجة', 'الموقف', 'المهمة', 'الإجراء'];
  const starFound = starKw.filter(kw => text.includes(kw)).length;
  const starScore = Math.min(30, starFound * 6);

  return {
    total: Math.min(100, lengthScore + structureScore + starScore),
    breakdown: { length: lengthScore, structure: structureScore, star: starScore },
    wordCount: words,
  };
}

function overallScore(results) {
  if (!results.length) return 0;
  return Math.round(results.reduce((s, r) => s + r.score.total, 0) / results.length);
}

function getLevelFromScore(score) {
  if (score >= 85) return { label: 'ممتاز', color: 'text-green-600', badge: 'bg-green-100' };
  if (score >= 70) return { label: 'جيد جداً', color: 'text-blue-600', badge: 'bg-blue-100' };
  if (score >= 55) return { label: 'جيد', color: 'text-amber-600', badge: 'bg-amber-100' };
  return { label: 'يحتاج تطوير', color: 'text-red-500', badge: 'bg-red-100' };
}

const FREE_LIMIT = 3;

export default function AIInterview() {
  const { user, isPremium, updateProfile } = useAuth();
  const [phase, setPhase]           = useState('setup');
  const [field, setField]           = useState('tech');
  const [current, setCurrent]       = useState(0);
  const [answer, setAnswer]         = useState('');
  const [results, setResults]       = useState([]);
  const [saving, setSaving]         = useState(false);
  const [sessions, setSessions]     = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const textRef = useRef(null);

  const questions = QUESTIONS[field] ?? QUESTIONS.tech;
  const fieldInfo = FIELDS.find(f => f.id === field) ?? FIELDS[0];

  const thisMonthSessions = sessions.filter(s => {
    const d = new Date(s.created_at);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  const canStart = isPremium() || thisMonthSessions < FREE_LIMIT;

  const fetchSessions = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('interview_sessions')
      .select('id, field, overall_score, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(8);
    setSessions(data ?? []);
    setSessionsLoading(false);
  }, [user]);

  useEffect(() => { fetchSessions(); }, [fetchSessions]);

  const startInterview = () => {
    if (!canStart) return;
    setCurrent(0);
    setAnswer('');
    setResults([]);
    setPhase('interview');
    setTimeout(() => textRef.current?.focus(), 100);
  };

  const handleNext = () => {
    const score = scoreAnswer(answer, questions[current].tips);
    const newResults = [...results, { questionIndex: current, answer, score }];
    setResults(newResults);
    setAnswer('');

    if (current < questions.length - 1) {
      setCurrent(c => c + 1);
      setTimeout(() => textRef.current?.focus(), 100);
    } else {
      finishInterview(newResults);
    }
  };

  const finishInterview = async (finalResults) => {
    setPhase('results');
    if (!user) return;
    setSaving(true);
    const overall = overallScore(finalResults);
    const answersPayload = finalResults.map((r, i) => ({
      question: questions[i].q,
      answer: r.answer,
      score: r.score.total,
    }));
    await supabase.from('interview_sessions').insert({
      user_id: user.id,
      field,
      overall_score: overall,
      answers: answersPayload,
    });
    // Update english_level in profile based on score
    const lvl = overall >= 85 ? 'C1' : overall >= 70 ? 'B2' : overall >= 55 ? 'B1' : 'A2';
    await updateProfile({ english_level: lvl });
    setSaving(false);
    fetchSessions();
  };

  const reset = () => {
    setPhase('setup');
    setCurrent(0);
    setAnswer('');
    setResults([]);
  };

  const overall = overallScore(results);
  const lvlInfo = getLevelFromScore(overall);
  const wordCount = answer.trim().split(/\s+/).filter(Boolean).length;

  return (
    <DashboardLayout>
      <div className="mb-6 text-right">
        <h1 className="text-2xl font-black text-gray-900">المقابلة التدريبية</h1>
        <p className="text-gray-500 text-sm mt-0.5">أجب على أسئلة المقابلة بالكتابة واحصل على تقييم فوري لأدائك</p>
      </div>

      {/* ── SETUP ── */}
      {phase === 'setup' && (
        <div className="max-w-2xl mx-auto space-y-5">
          {/* Free limit notice */}
          {!isPremium() && (
            <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex-row-reverse">
              <div className="flex-1 text-right">
                <p className="text-sm font-black text-amber-800">
                  {canStart ? `${FREE_LIMIT - thisMonthSessions} جلسة متبقية هذا الشهر` : 'استنفدت جلساتك المجانية هذا الشهر'}
                </p>
                <p className="text-xs text-amber-600 mt-0.5">الخطة الاحترافية تمنحك جلسات غير محدودة مع تقارير مفصّلة</p>
              </div>
              <Lock size={18} className="text-amber-500 flex-shrink-0" />
            </div>
          )}

          {/* Field selection */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-black text-gray-900 mb-4 text-right">اختر مجالك الوظيفي</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {FIELDS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setField(f.id)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${field === f.id ? 'border-[#006C35] bg-[#006C35]/5' : 'border-gray-100 hover:border-gray-200'}`}
                >
                  <span className="text-2xl">{f.icon}</span>
                  <span className={`text-xs font-bold ${field === f.id ? 'text-[#006C35]' : 'text-gray-600'}`}>{f.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* What you get */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-black text-gray-900 mb-4 text-right">كيف تعمل الجلسة</h2>
            <div className="space-y-3">
              {[
                { icon: '📝', text: `${questions.length} أسئلة مقابلة مخصصة لمجالك` },
                { icon: '✍️', text: 'اكتب إجاباتك بأسلوبك الخاص — لا يوجد وقت محدد' },
                { icon: '💡', text: 'تلقّ تلميحات لتحسين الإجابة مع كل سؤال' },
                { icon: '📊', text: 'احصل على تقييم فوري: الطول، التنظيم، الوضوح' },
                { icon: '💾', text: 'تُحفظ نتائجك تلقائياً لمتابعة تطورك' },
              ].map(item => (
                <div key={item.icon} className="flex items-center gap-3 flex-row-reverse">
                  <span className="text-lg flex-shrink-0">{item.icon}</span>
                  <p className="text-sm text-gray-600">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <Button variant="primary" size="lg" className="w-full" onClick={startInterview} disabled={!canStart}>
            <Play size={16} />
            {canStart ? 'ابدأ المقابلة التدريبية' : 'جلساتك المجانية نفدت — ترقَّ للاحترافية'}
          </Button>

          {/* Recent sessions */}
          {!sessionsLoading && sessions.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-black text-gray-900 mb-3 text-right">جلساتك السابقة</h3>
              <div className="space-y-2">
                {sessions.map(s => {
                  const fl = FIELDS.find(f => f.id === s.field);
                  const lv = getLevelFromScore(s.overall_score ?? 0);
                  return (
                    <div key={s.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors flex-row-reverse">
                      <span className="text-xl">{fl?.icon ?? '💼'}</span>
                      <div className="flex-1 text-right">
                        <p className="text-sm font-bold text-gray-800">{fl?.label ?? s.field}</p>
                        <p className="text-xs text-gray-400">{new Date(s.created_at).toLocaleDateString('ar-SA')}</p>
                      </div>
                      <div className={`px-2 py-0.5 rounded-full text-xs font-black ${lv.badge} ${lv.color}`}>
                        {s.overall_score ?? 0}٪
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── INTERVIEW ── */}
      {phase === 'interview' && (
        <div className="max-w-2xl mx-auto space-y-5">
          {/* Progress */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-center justify-between mb-2 flex-row-reverse">
              <span className="text-xs font-bold text-gray-700">{fieldInfo.icon} {fieldInfo.label}</span>
              <span className="text-xs text-gray-400">السؤال {current + 1} من {questions.length}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div className="bg-[#006C35] h-2 rounded-full transition-all duration-500" style={{ width: `${(current / questions.length) * 100}%` }} />
            </div>
          </div>

          {/* Question */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4 justify-end">
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-lg font-bold">س {current + 1}</span>
            </div>
            <h2 className="text-lg font-black text-gray-900 text-right mb-6 leading-relaxed">
              {questions[current].q}
            </h2>
            <textarea
              ref={textRef}
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              placeholder="اكتب إجابتك هنا... حاول أن تكون تفصيلياً وتستخدم أمثلة من تجربتك الفعلية."
              className="w-full h-40 p-4 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006C35]/20 focus:border-[#006C35] resize-none text-right leading-relaxed"
              dir="rtl"
            />
            <div className="flex items-center justify-between mt-2 flex-row-reverse">
              <p className="text-xs text-gray-400">{wordCount} كلمة {wordCount < 50 && '· اكتب ٥٠ كلمة على الأقل للحصول على تقييم أفضل'}</p>
              <div className={`w-2 h-2 rounded-full ${wordCount >= 50 ? 'bg-green-500' : wordCount >= 25 ? 'bg-amber-400' : 'bg-gray-300'}`} />
            </div>
          </div>

          {/* Tips */}
          <div className="bg-[#006C35]/5 border border-[#006C35]/15 rounded-2xl p-4">
            <h3 className="text-xs font-black text-[#006C35] mb-2 text-right">💡 تلميحات للإجابة المثالية</h3>
            <ul className="space-y-1">
              {questions[current].tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 flex-row-reverse">
                  <span className="text-[11px] text-gray-600">{tip}</span>
                  <ChevronLeft size={12} className="text-[#006C35] flex-shrink-0 mt-0.5" />
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" size="md" className="flex-1" onClick={reset}>إنهاء</Button>
            <Button variant="primary" size="md" className="flex-1" onClick={handleNext} disabled={answer.trim().length < 10}>
              {current === questions.length - 1 ? '🎯 احصل على التقييم' : 'السؤال التالي ←'}
            </Button>
          </div>
        </div>
      )}

      {/* ── RESULTS ── */}
      {phase === 'results' && (
        <div className="space-y-6">
          {/* Score header */}
          <div className="bg-gradient-to-l from-[#006C35] to-[#00A651] rounded-2xl p-6 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 0,transparent 50%)', backgroundSize: '12px 12px' }} />
            <div className="relative flex flex-col sm:flex-row items-center gap-6">
              <div className="text-center flex-shrink-0">
                <div className="relative w-24 h-24">
                  <ScoreRing score={overall} size={96} strokeWidth={9} color="#C8A951" label="" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-black text-white">{overall}</span>
                  </div>
                </div>
              </div>
              <div className="flex-1 text-right">
                <div className={`inline-flex items-center gap-2 px-3 py-1 ${lvlInfo.badge} rounded-full mb-2`}>
                  <span className={`text-xs font-black ${lvlInfo.color}`}>{lvlInfo.label}</span>
                  <Star size={11} className={lvlInfo.color} />
                </div>
                <h2 className="text-xl font-black text-white mb-1">اكتملت المقابلة التدريبية</h2>
                <p className="text-green-200 text-xs">أجبت على {results.length} سؤال في مجال {fieldInfo.label}</p>
                {saving && (
                  <div className="flex items-center gap-2 mt-2 text-green-200 text-xs">
                    <Loader2 size={11} className="animate-spin" />
                    جاري حفظ النتائج...
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Score breakdown */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h3 className="font-black text-gray-900 mb-5 text-right">تحليل الأداء</h3>
              <div className="flex justify-around mb-5">
                {results.slice(0, 3).map((r, i) => (
                  <ScoreRing key={i} score={r.score.total} label={`س${i + 1}`} color={i === 0 ? '#006C35' : i === 1 ? '#C8A951' : '#1A56DB'} size={68} />
                ))}
              </div>
              <div className="space-y-3">
                <ProgressBar label="إجمالي المحتوى" value={Math.min(100, Math.round(results.reduce((s, r) => s + r.score.breakdown.length, 0) / results.length * 2.5))} color="green" size="sm" />
                <ProgressBar label="التنظيم والبنية" value={Math.min(100, Math.round(results.reduce((s, r) => s + r.score.breakdown.structure, 0) / results.length * 3.3))} color="blue" size="sm" />
                <ProgressBar label="أسلوب STAR" value={Math.min(100, Math.round(results.reduce((s, r) => s + r.score.breakdown.star, 0) / results.length * 3.3))} color="gold" size="sm" />
              </div>
            </div>

            {/* Answer review */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h3 className="font-black text-gray-900 mb-4 text-right">مراجعة الإجابات</h3>
              <div className="space-y-3 max-h-72 overflow-y-auto scrollbar-thin">
                {results.map((r, i) => {
                  const lv = getLevelFromScore(r.score.total);
                  return (
                    <div key={i} className="p-3 bg-gray-50 rounded-xl text-right">
                      <div className="flex items-center justify-between mb-1 flex-row-reverse">
                        <p className="text-xs font-black text-gray-700 flex-1 line-clamp-1">{questions[i].q}</p>
                        <span className={`text-xs font-black px-2 py-0.5 rounded-full flex-shrink-0 mr-2 ${lv.badge} ${lv.color}`}>{r.score.total}٪</span>
                      </div>
                      <p className="text-xs text-gray-400 line-clamp-2">{r.answer}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tips + Actions */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <h3 className="font-black text-gray-900 mb-3 text-right flex items-center gap-2 flex-row-reverse">
                  <BookOpen size={15} className="text-[#006C35]" />
                  توصيات التحسين
                </h3>
                <ul className="space-y-2">
                  {overall < 80 && (
                    <li className="flex items-start gap-2 flex-row-reverse text-xs text-gray-600">
                      <CheckCircle size={13} className="text-[#006C35] flex-shrink-0 mt-0.5" />
                      استخدم أسلوب STAR: الموقف، المهمة، الإجراء، النتيجة
                    </li>
                  )}
                  {results.some(r => r.score.breakdown.length < 25) && (
                    <li className="flex items-start gap-2 flex-row-reverse text-xs text-gray-600">
                      <CheckCircle size={13} className="text-[#006C35] flex-shrink-0 mt-0.5" />
                      وسّع إجاباتك — استهدف ٧٠-١٠٠ كلمة لكل سؤال
                    </li>
                  )}
                  <li className="flex items-start gap-2 flex-row-reverse text-xs text-gray-600">
                    <CheckCircle size={13} className="text-[#006C35] flex-shrink-0 mt-0.5" />
                    أضف أرقاماً ونتائج قابلة للقياس في إجاباتك
                  </li>
                  <li className="flex items-start gap-2 flex-row-reverse text-xs text-gray-600">
                    <CheckCircle size={13} className="text-[#006C35] flex-shrink-0 mt-0.5" />
                    كرّر التدريب أسبوعياً لتحسين الأداء
                  </li>
                </ul>
              </div>

              {!isPremium() && (
                <div className="bg-gradient-to-bl from-[#006C35] to-[#004D25] rounded-2xl p-5 text-white">
                  <Lock size={14} className="text-green-300 mb-2 mr-auto" />
                  <h4 className="font-black text-sm mb-1 text-right">جلسات غير محدودة</h4>
                  <p className="text-xs text-green-200 mb-3 text-right leading-relaxed">مع الخطة الاحترافية: تقارير مفصّلة + تتبّع التطور + أولوية في الوظائف</p>
                  <Button variant="gold" size="sm" className="w-full">ترقَّ إلى الاحترافية</Button>
                </div>
              )}

              <div className="flex flex-col gap-2">
                <Button variant="secondary" size="md" className="w-full" onClick={() => { reset(); }}>
                  <RotateCcw size={14} />
                  إعادة الإعداد
                </Button>
                <Button variant="primary" size="md" className="w-full" onClick={() => { setCurrent(0); setAnswer(''); setResults([]); setPhase('interview'); }}>
                  إعادة نفس المجال
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
