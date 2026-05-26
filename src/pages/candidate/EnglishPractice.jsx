import { useState, useEffect, useCallback } from 'react';
import { CheckCircle, XCircle, ChevronLeft, RotateCcw, Loader2, BookOpen, Lock } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import ScoreRing from '../../components/ui/ScoreRing';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

// ── Exercise Bank ─────────────────────────────────────────────────────────────
const EXERCISE_SETS = {
  vocabulary: {
    label: 'المفردات المهنية',
    icon: '📖',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    exercises: [
      { q: 'ما معنى كلمة "negotiate" في سياق العمل؟', options: ['يرفض', 'يفاوض', 'يوقّع', 'يُقدّم'], answer: 1 },
      { q: 'أيّ من التالي يعني "deadline" في بيئة العمل؟', options: ['اجتماع', 'مهلة نهائية', 'عقد', 'استراحة'], answer: 1 },
      { q: '"Stakeholder" تعني في الغالب:', options: ['عامل مؤقت', 'طرف ذو مصلحة', 'مدير قسم', 'مقاول'], answer: 1 },
      { q: 'معنى "onboarding" في الموارد البشرية:', options: ['الفصل من العمل', 'التدريب الأولي للموظف الجديد', 'التدريب الميداني', 'إنهاء الخدمة'], answer: 1 },
      { q: '"Revenue" تعني:', options: ['التكاليف', 'الأرباح الصافية', 'الإيرادات الإجمالية', 'الرواتب'], answer: 2 },
      { q: 'ما معنى "proactive"؟', options: ['متأخر', 'سلبي', 'استباقي ومبادر', 'محايد'], answer: 2 },
      { q: '"KPI" اختصار لـ:', options: ['Key Performance Indicators', 'Knowledge Process Integration', 'Key Project Input', 'Knowledge Priority Items'], answer: 0 },
      { q: 'معنى "collaborate" في العمل الجماعي:', options: ['ينافس', 'يتعاون', 'يرفض', 'يتجنب'], answer: 1 },
    ],
  },
  grammar: {
    label: 'قواعد اللغة',
    icon: '✍️',
    color: 'text-green-600',
    bg: 'bg-green-50',
    border: 'border-green-200',
    exercises: [
      { q: 'اختر الجملة الصحيحة:', options: ['I has worked here for 3 years.', 'I have worked here for 3 years.', 'I working here for 3 years.', 'I am work here for 3 years.'], answer: 1 },
      { q: 'الصيغة الصحيحة في المراسلات الرسمية:', options: ['I am writing to inquire about...', 'I writing to inquire about...', 'I write about inquire...', 'I have write to inquire...'], answer: 0 },
      { q: 'اختر الصواب: "The meeting ___ at 3 PM yesterday."', options: ['will be', 'were', 'was', 'is'], answer: 2 },
      { q: 'الفعل المناسب: "She ___ the report before the deadline."', options: ['submit', 'submits', 'submitted', 'submitting'], answer: 2 },
      { q: 'اختر الصيغة الصحيحة للمستقبل:', options: ['We will meeting tomorrow.', 'We will be meet tomorrow.', 'We will meet tomorrow.', 'We meets tomorrow.'], answer: 2 },
      { q: '"I look forward to ___ from you."', options: ['hear', 'heard', 'hearing', 'hears'], answer: 2 },
      { q: 'الصيغة الصحيحة للمبني للمجهول:', options: ['The project is completed by the team.', 'The project completed is by the team.', 'The project be completed by the team.', 'The project completing by the team.'], answer: 0 },
      { q: 'اختر الصواب: "Neither the manager nor the employees ___ available."', options: ['is', 'are', 'were being', 'has'], answer: 1 },
    ],
  },
  phrases: {
    label: 'عبارات المقابلات',
    icon: '🎙️',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    exercises: [
      { q: 'كيف تصف نفسك بشكل احترافي؟', options: ['I am a good worker.', 'I am a results-driven professional with X years of experience in...', 'I work and I am good.', 'My name is X and I like working.'], answer: 1 },
      { q: 'كيف تذكر نقطة ضعف في مقابلة؟', options: ['I have no weaknesses.', 'I am terrible at everything.', 'One area I am actively working to improve is...', 'I don\'t know my weaknesses.'], answer: 2 },
      { q: 'الردّ الأفضل على "Why should we hire you?"', options: ['Because I need the money.', 'My combination of skills and experience aligns directly with what you need...', 'I am the best candidate.', 'I don\'t know, you decide.'], answer: 1 },
      { q: 'كيف تسأل عن الراتب باحترافية؟', options: ['How much do you pay?', 'What is the salary range for this position?', 'Money is not important to me.', 'I need a big salary.'], answer: 1 },
      { q: 'كيف تُنهي مقابلة بشكل إيجابي؟', options: ['OK, I will wait for your call.', 'Bye.', 'Thank you for your time. I am excited about this opportunity and look forward to next steps.', 'When will I know?'], answer: 2 },
      { q: 'كيف تشرح فجوة في سيرتك؟', options: ['I was lazy.', 'During that period, I focused on professional development and...', 'I didn\'t work.', 'I had no jobs.'], answer: 1 },
      { q: 'كيف تُبرز إنجازاً بالأرقام؟', options: ['I worked hard.', 'I increased team productivity by 30% through...', 'I did a good job.', 'I improved things.'], answer: 1 },
      { q: 'كيف تُعرب عن اهتمامك بالشركة؟', options: ['I just need any job.', 'I specifically chose your company because of your work in...', 'Your company is okay.', 'I applied to many companies.'], answer: 1 },
    ],
  },
  email: {
    label: 'المراسلات المهنية',
    icon: '📧',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    exercises: [
      { q: 'أنسب افتتاحية لبريد إلكتروني رسمي:', options: ['Hey!', 'Dear Mr./Ms. [Name],', 'Yo,', 'Hi there,'], answer: 1 },
      { q: 'أنسب خاتمة لبريد التقديم على وظيفة:', options: ['Bye.', 'See you soon.', 'Sincerely, [Your Name]', 'Thanks, bye!'], answer: 2 },
      { q: 'كيف تطلب تأجيل موعد باحترام:', options: ['I can\'t come.', 'I would like to request a reschedule if possible.', 'Change the meeting.', 'I\'m busy.'], answer: 1 },
      { q: 'كيف تُرفق ملف في بريد احترافي:', options: ['Here is the file.', 'Please find the attached [document name] for your review.', 'I attached something.', 'Look at the attachment.'], answer: 1 },
      { q: 'كيف تشكر بعد مقابلة عمل؟', options: ['Thanks for the interview.', 'Thank you for taking the time to meet with me. I remain enthusiastic about...', 'OK thanks.', 'I appreciate the interview.'], answer: 1 },
      { q: 'أنسب طريقة لتقديم نفسك في بريد أول:', options: ['My name is X.', 'I hope this email finds you well. My name is X, and I am...', 'Hello.', 'Hi, I\'m X.'], answer: 1 },
      { q: 'كيف تطلب توضيحاً باحترافية؟', options: ['What do you mean?', 'Could you please clarify the details regarding...?', 'I don\'t understand.', 'Explain again.'], answer: 1 },
      { q: 'العبارة الصحيحة للمتابعة بعد أسبوعين:', options: ['Why haven\'t you replied?', 'I wanted to follow up on my previous application dated...', 'Hello again.', 'Any news?'], answer: 1 },
    ],
  },
};

const TYPES = Object.keys(EXERCISE_SETS);

// ── Scoring ───────────────────────────────────────────────────────────────────
function calcLevel(pct) {
  if (pct >= 90) return { level: 'C1', label: 'متقدم', color: 'text-green-600' };
  if (pct >= 75) return { level: 'B2', label: 'فوق المتوسط', color: 'text-blue-600' };
  if (pct >= 60) return { level: 'B1', label: 'متوسط', color: 'text-amber-600' };
  if (pct >= 40) return { level: 'A2', label: 'أساسي', color: 'text-orange-500' };
  return { level: 'A1', label: 'مبتدئ', color: 'text-red-500' };
}

export default function EnglishPractice() {
  const { user, isPremium } = useAuth();
  const [phase, setPhase]       = useState('menu');   // menu | exercise | results
  const [type, setType]         = useState(null);
  const [current, setCurrent]   = useState(0);
  const [answers, setAnswers]   = useState([]);
  const [selected, setSelected] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [saving, setSaving]     = useState(false);
  const [sessions, setSessions] = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);

  // Limit free users to 3 sessions per month
  const freeLimit = 3;
  const thisMonth = sessions.filter(s => {
    const d = new Date(s.created_at);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;
  const canPractice = isPremium() || thisMonth < freeLimit;

  const fetchSessions = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('english_practice_sessions')
      .select('id, type, score, total, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);
    setSessions(data ?? []);
    setSessionsLoading(false);
  }, [user]);

  useEffect(() => { fetchSessions(); }, [fetchSessions]);

  const startExercise = (t) => {
    if (!canPractice) return;
    setType(t);
    setCurrent(0);
    setAnswers([]);
    setSelected(null);
    setConfirmed(false);
    setPhase('exercise');
  };

  const set = EXERCISE_SETS[type] ?? EXERCISE_SETS.vocabulary;
  const questions = set.exercises;
  const q = questions[current];

  const handleSelect = (idx) => {
    if (confirmed) return;
    setSelected(idx);
  };

  const handleConfirm = () => {
    if (selected === null) return;
    setConfirmed(true);
    setAnswers(prev => [...prev, { question: current, selected, correct: q.answer }]);
  };

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent(c => c + 1);
      setSelected(null);
      setConfirmed(false);
    } else {
      finishExercise();
    }
  };

  const finishExercise = async () => {
    const allAnswers = [...answers];
    const score = allAnswers.filter(a => a.selected === a.correct).length;
    setPhase('results');
    if (!user) return;
    setSaving(true);
    await supabase.from('english_practice_sessions').insert({
      user_id: user.id,
      type,
      score,
      total: questions.length,
      answers: allAnswers,
    });
    setSaving(false);
    fetchSessions();
  };

  const reset = () => {
    setPhase('menu');
    setType(null);
    setCurrent(0);
    setAnswers([]);
    setSelected(null);
    setConfirmed(false);
  };

  const correctCount = answers.filter(a => a.selected === a.correct).length;
  const pct = answers.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
  const levelInfo = calcLevel(pct);

  return (
    <DashboardLayout>
      <div className="mb-6 text-right">
        <h1 className="text-2xl font-black text-gray-900">تطوير اللغة الإنجليزية المهنية</h1>
        <p className="text-gray-500 text-sm mt-0.5">تدرّب على المفردات والقواعد وعبارات المقابلات والمراسلات</p>
      </div>

      {/* ── MENU ── */}
      {phase === 'menu' && (
        <div className="space-y-6 max-w-3xl mx-auto">
          {/* Session counter for free users */}
          {!isPremium() && (
            <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex-row-reverse">
              <div className="text-right flex-1">
                <p className="text-sm font-black text-amber-800">الخطة المجانية: {freeLimit - thisMonth} جلسة متبقية هذا الشهر</p>
                <p className="text-xs text-amber-600 mt-0.5">الخطة الاحترافية تمنحك جلسات غير محدودة</p>
              </div>
              <div className="flex gap-1">
                {Array.from({ length: freeLimit }).map((_, i) => (
                  <div key={i} className={`w-3 h-3 rounded-full ${i < (freeLimit - thisMonth) ? 'bg-amber-500' : 'bg-amber-200'}`} />
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {TYPES.map((t) => {
              const s = EXERCISE_SETS[t];
              const lastSession = sessions.find(x => x.type === t);
              const lastPct = lastSession ? Math.round((lastSession.score / lastSession.total) * 100) : null;
              return (
                <button
                  key={t}
                  onClick={() => startExercise(t)}
                  disabled={!canPractice}
                  className={`relative text-right p-5 bg-white rounded-2xl border-2 shadow-sm hover:shadow-md transition-all duration-200 ${canPractice ? `hover:border-current hover:-translate-y-0.5 ${s.border}` : 'opacity-60 cursor-not-allowed border-gray-100'}`}
                >
                  {!canPractice && (
                    <Lock size={14} className="absolute top-3 left-3 text-gray-400" />
                  )}
                  <div className="flex items-start justify-between mb-3 flex-row-reverse">
                    <span className="text-3xl">{s.icon}</span>
                    {lastPct !== null && (
                      <span className={`text-xs font-black px-2 py-0.5 rounded-full ${s.bg} ${s.color}`}>
                        آخر نتيجة: {lastPct}٪
                      </span>
                    )}
                  </div>
                  <h3 className={`font-black text-gray-900 mb-1`}>{s.label}</h3>
                  <p className="text-xs text-gray-400">{s.exercises.length} سؤال · متعدد الاختيارات</p>
                </button>
              );
            })}
          </div>

          {/* Recent Sessions */}
          {!sessionsLoading && sessions.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-black text-gray-900 mb-4 text-right">آخر جلساتك</h3>
              <div className="space-y-2">
                {sessions.slice(0, 5).map((s) => {
                  const p = Math.round((s.score / s.total) * 100);
                  const lvl = calcLevel(p);
                  return (
                    <div key={s.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors flex-row-reverse">
                      <span className="text-xl">{EXERCISE_SETS[s.type]?.icon ?? '📚'}</span>
                      <div className="flex-1 text-right">
                        <p className="text-sm font-bold text-gray-800">{EXERCISE_SETS[s.type]?.label ?? s.type}</p>
                        <p className="text-xs text-gray-400">{new Date(s.created_at).toLocaleDateString('ar-SA')}</p>
                      </div>
                      <div className="text-left">
                        <span className={`text-sm font-black ${lvl.color}`}>{p}٪</span>
                        <p className="text-[10px] text-gray-400">{s.score}/{s.total} صحيح</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── EXERCISE ── */}
      {phase === 'exercise' && type && (
        <div className="max-w-2xl mx-auto space-y-5">
          {/* Progress */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-center justify-between mb-2 flex-row-reverse">
              <span className="text-xs font-bold text-gray-700">{set.label}</span>
              <span className="text-xs text-gray-400">السؤال {current + 1} من {questions.length}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div className="bg-[#006C35] h-2 rounded-full transition-all duration-500" style={{ width: `${((current) / questions.length) * 100}%` }} />
            </div>
          </div>

          {/* Question */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className={`inline-flex items-center gap-2 px-3 py-1 ${set.bg} rounded-full mb-4`}>
              <span className="text-sm">{set.icon}</span>
              <span className={`text-xs font-bold ${set.color}`}>{set.label}</span>
            </div>
            <h2 className="text-lg font-black text-gray-900 text-right mb-6 leading-relaxed">{q.q}</h2>
            <div className="space-y-3">
              {q.options.map((opt, idx) => {
                let cls = 'border-gray-200 text-gray-700 hover:border-[#006C35]/30 hover:bg-gray-50';
                if (confirmed) {
                  if (idx === q.answer) cls = 'border-green-500 bg-green-50 text-green-800';
                  else if (idx === selected && idx !== q.answer) cls = 'border-red-400 bg-red-50 text-red-700';
                  else cls = 'border-gray-100 text-gray-400';
                } else if (idx === selected) {
                  cls = 'border-[#006C35] bg-[#006C35]/5 text-[#006C35]';
                }
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelect(idx)}
                    className={`w-full flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all text-right ${cls}`}
                  >
                    {confirmed && idx === q.answer && <CheckCircle size={16} className="text-green-600 flex-shrink-0" />}
                    {confirmed && idx === selected && idx !== q.answer && <XCircle size={16} className="text-red-500 flex-shrink-0" />}
                    {(!confirmed || (idx !== q.answer && idx !== selected)) && (
                      <span className="w-4 h-4 rounded-full border-2 border-current flex-shrink-0" />
                    )}
                    <span className="text-sm font-bold flex-1">{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" size="md" className="flex-1" onClick={reset}>إنهاء</Button>
            {!confirmed ? (
              <Button variant="primary" size="md" className="flex-1" onClick={handleConfirm} disabled={selected === null}>
                تأكيد الإجابة
              </Button>
            ) : (
              <Button variant="primary" size="md" className="flex-1" onClick={handleNext}>
                {current < questions.length - 1 ? 'السؤال التالي' : '🎯 عرض النتائج'}
              </Button>
            )}
          </div>
        </div>
      )}

      {/* ── RESULTS ── */}
      {phase === 'results' && (
        <div className="max-w-2xl mx-auto space-y-5">
          <div className="bg-gradient-to-l from-[#006C35] to-[#00A651] rounded-2xl p-6 text-white text-center">
            <div className="w-20 h-20 mx-auto mb-4 relative">
              <ScoreRing score={pct} size={80} strokeWidth={8} color="#C8A951" label="" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-black text-white">{pct}٪</span>
              </div>
            </div>
            <h2 className="text-xl font-black mb-1">اكتملت الجلسة!</h2>
            <p className={`text-sm font-bold`}>
              مستواك: <span className="text-[#C8A951]">{levelInfo.level} · {levelInfo.label}</span>
            </p>
            <p className="text-green-200 text-sm mt-2">{correctCount} إجابة صحيحة من {questions.length}</p>
            {saving && (
              <div className="flex items-center justify-center gap-2 mt-3 text-green-200 text-xs">
                <Loader2 size={12} className="animate-spin" />
                جاري حفظ النتائج...
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-black text-gray-900 mb-4 text-right">مراجعة الإجابات</h3>
            <div className="space-y-3">
              {answers.map((a, i) => {
                const qRef = questions[a.question];
                const isCorrect = a.selected === a.correct;
                return (
                  <div key={i} className={`p-3 rounded-xl border ${isCorrect ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
                    <div className="flex items-start gap-2 flex-row-reverse">
                      {isCorrect ? <CheckCircle size={15} className="text-green-600 flex-shrink-0 mt-0.5" /> : <XCircle size={15} className="text-red-500 flex-shrink-0 mt-0.5" />}
                      <div className="flex-1 text-right">
                        <p className="text-xs font-bold text-gray-700 mb-1">{qRef.q}</p>
                        {!isCorrect && (
                          <p className="text-xs text-green-700">✓ الإجابة الصحيحة: {qRef.options[a.correct]}</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" size="md" className="flex-1" onClick={reset}>
              <RotateCcw size={14} />
              تمرين جديد
            </Button>
            <Button variant="primary" size="md" className="flex-1" onClick={() => startExercise(type)}>
              إعادة هذا التمرين
            </Button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
