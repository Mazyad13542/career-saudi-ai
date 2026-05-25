import { TrendingUp, Mic, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import ProgressBar from '../../components/ui/ProgressBar';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';

const levelInfo = {
  A: { label: 'احترافي', color: 'green', desc: 'إنجليزية احترافية قريبة من مستوى الناطق الأصلي مع تواصل مهني قوي.', companies: 'جميع الشركات متعددة الجنسيات، المناصب القيادية' },
  B: { label: 'جيد',     color: 'blue',  desc: 'إنجليزية مهنية جيدة مناسبة لمعظم الوظائف في الشركات السعودية.', companies: 'معظم الشركات السعودية، البيئات ثنائية اللغة' },
  C: { label: 'متوسط',   color: 'amber', desc: 'قدرة تواصل أساسية — يُنصح بالتحسين بشدة.', companies: 'بيئات العمل العربية فقط، بعض الشركات المحلية' },
  D: { label: 'مبتدئ',   color: 'red',   desc: 'إنجليزية محدودة — ركّز على التحسين قبل التقدم لمعظم الوظائف.', companies: 'الوظائف المحلية فقط، المناصب الحكومية باللغة العربية' },
};

// Profile stores CEFR codes like B1, B2 — extract the letter grade
function parseLetter(raw) {
  if (!raw) return 'B';
  const letter = String(raw)[0].toUpperCase();
  return ['A', 'B', 'C', 'D'].includes(letter) ? letter : 'B';
}

const recommendations = [
  { icon: '📚', title: 'اقرأ بالإنجليزية يومياً', desc: 'اقرأ Arab News أو Saudi Gazette بالإنجليزية ٢٠ دقيقة يومياً' },
  { icon: '🎙️', title: 'تدرّب على التحدث', desc: 'استخدم ميزة المقابلة الذكية للتدرب على المحادثة الإنجليزية بانتظام' },
  { icon: '📺', title: 'شاهد محتوى إنجليزياً', desc: 'شاهد TED Talks وقنوات YouTube المتعلقة بمجالك' },
  { icon: '✍️', title: 'اكتب بالإنجليزية', desc: 'ابدأ بكتابة ملخصات قصيرة عن أعمالك اليومية بالإنجليزية' },
  { icon: '📱', title: 'استخدم تطبيقات التعلم', desc: 'Duolingo أو British Council App للتدرب المنظّم' },
  { icon: '🤝', title: 'انضم لمجموعات إنجليزية', desc: 'انضم لمجتمعات أو أندية محادثة إنجليزية في الرياض أو جدة' },
];

export default function EnglishLevel() {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 size={32} className="animate-spin text-[#006C35]" />
        </div>
      </DashboardLayout>
    );
  }

  const level = parseLetter(profile?.english_level);
  const info  = levelInfo[level];

  // Sub-scores stored in profile_data.interviewScores if the user has done an interview
  const scores = profile?.profile_data?.interviewScores ?? {
    comprehension: 0, fluency: 0, pronunciation: 0, vocabulary: 0, grammar: 0,
  };
  const hasScores = Object.values(scores).some((v) => v > 0);

  const levelColorClass = {
    A: 'bg-green-100 text-green-600',
    B: 'bg-blue-100 text-blue-600',
    C: 'bg-amber-100 text-amber-600',
    D: 'bg-red-100 text-red-600',
  }[level];

  const levelTextClass = {
    A: 'text-green-600',
    B: 'text-blue-600',
    C: 'text-amber-600',
    D: 'text-red-600',
  }[level];

  return (
    <DashboardLayout>
      <div className="mb-6 text-right">
        <h1 className="text-2xl font-black text-gray-900">مستوى اللغة الإنجليزية</h1>
        <p className="text-gray-500 text-sm mt-0.5">بناءً على مستواك المحفوظ في ملفك المهني</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Level Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
            <div className={`w-28 h-28 rounded-3xl mx-auto mb-4 flex items-center justify-center ${levelColorClass.split(' ')[0]}`}>
              <span className={`text-5xl font-black ${levelTextClass}`}>{level}</span>
            </div>
            <h2 className="text-xl font-black text-gray-900 mb-1">المستوى {level}</h2>
            <p className={`text-sm font-bold mb-3 ${levelTextClass}`}>{info.label}</p>
            <p className="text-xs text-gray-500 leading-relaxed mb-5">{info.desc}</p>
            <div className="p-3 bg-gray-50 rounded-xl text-right">
              <p className="text-xs font-bold text-gray-500 mb-1">مناسب لـ:</p>
              <p className="text-xs text-gray-700">{info.companies}</p>
            </div>
          </div>

          {/* Take Interview */}
          <div className="mt-4 bg-gradient-to-bl from-[#006C35] to-[#004D25] rounded-2xl p-5 text-white text-center">
            <Mic size={24} className="mx-auto mb-2 text-green-300" />
            <h3 className="font-black mb-1">طوّر مستواك</h3>
            <p className="text-xs text-green-200 mb-3">أجرِ اختبار مقابلة ذكية جديداً لتحديث درجتك</p>
            <Link to="/dashboard/interview">
              <Button variant="gold" size="sm" className="w-full">إعادة المقابلة الذكية</Button>
            </Link>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Level Scale */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-black text-gray-900 mb-5 text-right">سلّم مستويات اللغة</h2>
            <div className="space-y-4">
              {Object.entries(levelInfo).map(([lvl, inf]) => (
                <div
                  key={lvl}
                  className={`flex items-center gap-4 p-4 rounded-xl border transition-all flex-row-reverse ${
                    lvl === level ? 'border-[#006C35]/30 bg-[#006C35]/5' : 'border-gray-100'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg flex-shrink-0 ${
                    lvl === 'A' ? 'bg-green-100 text-green-600' :
                    lvl === 'B' ? 'bg-blue-100 text-blue-600' :
                    lvl === 'C' ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'
                  }`}>{lvl}</div>
                  <div className="flex-1 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {lvl === level && (
                        <span className="text-xs font-black text-[#006C35] bg-[#006C35]/10 px-2 py-0.5 rounded-full">
                          مستواك الحالي
                        </span>
                      )}
                      <span className="text-sm font-bold text-gray-800">{inf.label}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{inf.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Score Details */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <span className="text-xs text-gray-400">
                {hasScores ? 'من آخر مقابلة' : 'أجرِ مقابلة لرؤية نتائجك'}
              </span>
              <h2 className="font-black text-gray-900 text-right">نقاط آخر مقابلة</h2>
            </div>
            {hasScores ? (
              <div className="space-y-3">
                <ProgressBar label="الفهم والاستيعاب" value={scores.comprehension} color="blue" />
                <ProgressBar label="الطلاقة"          value={scores.fluency}       color="gold" />
                <ProgressBar label="النطق"            value={scores.pronunciation} color="green" />
                <ProgressBar label="المفردات"          value={scores.vocabulary}    color="blue" />
                <ProgressBar label="القواعد والنحو"   value={scores.grammar}       color="green" />
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <Mic size={32} className="text-gray-200 mx-auto mb-3" />
                <p className="text-sm">لا توجد نتائج مقابلة بعد</p>
                <Link to="/dashboard/interview" className="text-xs text-[#006C35] font-black hover:underline mt-2 block">
                  ابدأ مقابلتك الأولى الآن
                </Link>
              </div>
            )}
          </div>

          {/* Recommendations */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-black text-gray-900 mb-5 flex items-center gap-2 justify-end">
              <span>توصيات مخصصة لك</span>
              <TrendingUp size={16} className="text-[#006C35]" />
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {recommendations.map((r) => (
                <div key={r.title} className="p-4 bg-gray-50 rounded-xl hover:bg-[#006C35]/5 transition-colors text-right">
                  <span className="text-xl">{r.icon}</span>
                  <p className="text-sm font-black text-gray-800 mt-2 mb-1">{r.title}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{r.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
