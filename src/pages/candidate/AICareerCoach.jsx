import { useState, useMemo } from 'react';
import { Target, TrendingUp, BookOpen, Briefcase, ChevronLeft, Star, Zap, CheckCircle, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import ProgressBar from '../../components/ui/ProgressBar';
import { useAuth } from '../../context/AuthContext';

// ── Market Skills Data ────────────────────────────────────────────────────────
const MARKET_SKILLS = {
  'تقنية المعلومات': ['Python', 'SQL', 'React', 'Node.js', 'Docker', 'AWS', 'Machine Learning', 'Kubernetes', 'TypeScript', 'Git'],
  'المالية والمحاسبة': ['Excel', 'SAP', 'IFRS', 'Power BI', 'Financial Modeling', 'SQL', 'Tableau', 'SOCPA', 'Budgeting'],
  'الهندسة': ['AutoCAD', 'Revit', 'MATLAB', 'Project Management', 'PMP', 'Safety Management', 'BIM', 'Civil 3D'],
  'التسويق': ['SEO', 'Google Ads', 'Social Media', 'Content Marketing', 'Analytics', 'HubSpot', 'CRM', 'Copywriting'],
  'الموارد البشرية': ['Recruitment', 'Labor Law', 'HRMS', 'Performance Management', 'Talent Acquisition', 'SAP HR', 'KPIs'],
  'الرعاية الصحية': ['Clinical Assessment', 'Patient Care', 'Medical Documentation', 'EMR Systems', 'CPR', 'Research'],
};

const CAREER_PATHS = {
  'تقنية المعلومات': [
    { level: 1, title: 'مطوّر مبتدئ', years: '0-2', skills: ['HTML/CSS', 'JavaScript', 'Git', 'SQL'] },
    { level: 2, title: 'مطوّر متوسط', years: '2-4', skills: ['React/Vue', 'Node.js', 'Docker', 'REST APIs'] },
    { level: 3, title: 'مطوّر أول', years: '4-7', skills: ['System Design', 'AWS/GCP', 'CI/CD', 'Mentoring'] },
    { level: 4, title: 'مهندس معمارية / Tech Lead', years: '7+', skills: ['Architecture', 'Leadership', 'Strategy', 'Stakeholder Management'] },
  ],
  'المالية والمحاسبة': [
    { level: 1, title: 'محاسب مبتدئ', years: '0-2', skills: ['Excel', 'SAP Basics', 'IFRS Basics', 'Reporting'] },
    { level: 2, title: 'محلل مالي', years: '2-5', skills: ['Financial Modeling', 'Power BI', 'Forecasting', 'Budgeting'] },
    { level: 3, title: 'مدير مالي', years: '5-8', skills: ['FP&A', 'Treasury', 'Tax', 'Team Management'] },
    { level: 4, title: 'CFO / مدير مالي أول', years: '8+', skills: ['Corporate Strategy', 'M&A', 'Board Reporting', 'Leadership'] },
  ],
  'التسويق': [
    { level: 1, title: 'مسوّق مبتدئ', years: '0-2', skills: ['Social Media', 'Content Writing', 'SEO Basics', 'Analytics'] },
    { level: 2, title: 'مدير تسويق رقمي', years: '2-4', skills: ['Google Ads', 'Email Marketing', 'CRM', 'A/B Testing'] },
    { level: 3, title: 'مدير تسويق أول', years: '4-7', skills: ['Brand Strategy', 'Campaign Management', 'Budget', 'Team Lead'] },
    { level: 4, title: 'مدير تسويق / CMO', years: '7+', skills: ['Go-to-Market', 'Market Research', 'PR', 'Executive Leadership'] },
  ],
};

const CERTIFICATES = {
  'تقنية المعلومات': [
    { name: 'AWS Certified Solutions Architect', impact: 'عالٍ', provider: 'Amazon' },
    { name: 'Google Associate Cloud Engineer', impact: 'عالٍ', provider: 'Google' },
    { name: 'CompTIA Security+', impact: 'متوسط', provider: 'CompTIA' },
    { name: 'Scrum Master (CSM)', impact: 'متوسط', provider: 'Scrum Alliance' },
  ],
  'المالية والمحاسبة': [
    { name: 'SOCPA — المحاسبون السعوديون', impact: 'عالٍ', provider: 'SOCPA' },
    { name: 'CFA Level I', impact: 'عالٍ', provider: 'CFA Institute' },
    { name: 'IFRS Certification', impact: 'متوسط', provider: 'ICAEW' },
    { name: 'PMP — إدارة المشاريع', impact: 'متوسط', provider: 'PMI' },
  ],
  'التسويق': [
    { name: 'Google Ads Certification', impact: 'عالٍ', provider: 'Google' },
    { name: 'HubSpot Marketing Certification', impact: 'متوسط', provider: 'HubSpot' },
    { name: 'Meta Blueprint Certification', impact: 'متوسط', provider: 'Meta' },
    { name: 'SEMrush SEO Certification', impact: 'متوسط', provider: 'SEMrush' },
  ],
};

const SALARY_DATA = {
  'تقنية المعلومات': { min: 12000, avg: 20000, max: 45000, growth: '+18%' },
  'المالية والمحاسبة': { min: 10000, avg: 16000, max: 35000, growth: '+12%' },
  'الهندسة': { min: 11000, avg: 17000, max: 38000, growth: '+10%' },
  'التسويق': { min: 8000, avg: 14000, max: 28000, growth: '+15%' },
  'الموارد البشرية': { min: 9000, avg: 15000, max: 30000, growth: '+8%' },
  'الرعاية الصحية': { min: 10000, avg: 18000, max: 40000, growth: '+20%' },
};

function SkillGapAnalysis({ userSkills, sector }) {
  const marketSkills = MARKET_SKILLS[sector] ?? MARKET_SKILLS['تقنية المعلومات'];
  const userSkillsLower = (userSkills ?? []).map(s => s.toLowerCase());
  const have = marketSkills.filter(s => userSkillsLower.some(us => us.includes(s.toLowerCase()) || s.toLowerCase().includes(us)));
  const missing = marketSkills.filter(s => !userSkillsLower.some(us => us.includes(s.toLowerCase()) || s.toLowerCase().includes(us)));
  const coverage = Math.round((have.length / marketSkills.length) * 100);
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-4 flex-row-reverse">
        <h3 className="font-black text-gray-900">تحليل فجوة المهارات</h3>
        <span className={`text-sm font-black px-3 py-1 rounded-full ${coverage >= 70 ? 'bg-green-100 text-green-700' : coverage >= 40 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-600'}`}>
          {coverage}٪ تغطية
        </span>
      </div>
      <ProgressBar label={`المهارات الموجودة (${have.length}/${marketSkills.length})`} value={coverage} color="green" />
      <div className="mt-4 space-y-3">
        {have.length > 0 && (
          <div>
            <p className="text-xs font-black text-green-700 mb-2">✓ مهاراتك الموجودة</p>
            <div className="flex flex-wrap gap-1.5">
              {have.map(s => <span key={s} className="px-2 py-0.5 bg-green-50 border border-green-200 text-green-700 text-[10px] rounded-full font-bold">{s}</span>)}
            </div>
          </div>
        )}
        {missing.length > 0 && (
          <div>
            <p className="text-xs font-black text-amber-700 mb-2">⚡ مهارات مطلوبة في سوق العمل</p>
            <div className="flex flex-wrap gap-1.5">
              {missing.slice(0, 6).map(s => <span key={s} className="px-2 py-0.5 bg-amber-50 border border-amber-200 text-amber-700 text-[10px] rounded-full font-bold">{s}</span>)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CareerRoadmap({ sector }) {
  const path = CAREER_PATHS[sector];
  if (!path) return null;
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h3 className="font-black text-gray-900 mb-4 text-right">مسار التطور المهني</h3>
      <div className="relative">
        <div className="absolute right-4 top-4 bottom-4 w-0.5 bg-gray-100" />
        <div className="space-y-4">
          {path.map((step, i) => (
            <div key={i} className="flex gap-4 flex-row-reverse">
              <div className="w-8 h-8 rounded-full bg-[#006C35]/10 border-2 border-[#006C35]/20 flex items-center justify-center flex-shrink-0 z-10">
                <span className="text-xs font-black text-[#006C35]">{step.level}</span>
              </div>
              <div className="flex-1 pb-4">
                <div className="flex items-center gap-2 justify-end mb-1 flex-row-reverse">
                  <h4 className="text-sm font-black text-gray-900">{step.title}</h4>
                  <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{step.years} سنة</span>
                </div>
                <div className="flex flex-wrap gap-1 justify-end">
                  {step.skills.map(s => <span key={s} className="text-[10px] px-1.5 py-0.5 bg-gray-50 border border-gray-100 text-gray-500 rounded">{s}</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AICareerCoach() {
  const { profile, isPremium } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const pd = profile?.profile_data ?? {};
  const skills = pd.skills ?? [];
  const experience = pd.experience ?? [];
  const yearsExp = pd.yearsOfExperience ?? (experience.length > 0 ? experience.length * 1.5 : 0);
  const sector = profile?.job_title
    ? Object.keys(MARKET_SKILLS).find(s => profile.job_title.includes(s.split(' ')[0])) ?? 'تقنية المعلومات'
    : 'تقنية المعلومات';

  const salaryInfo = SALARY_DATA[sector] ?? SALARY_DATA['تقنية المعلومات'];
  const certs = CERTIFICATES[sector] ?? CERTIFICATES['تقنية المعلومات'];

  const profileScore = useMemo(() => {
    let score = 0;
    if (profile?.full_name)   score += 10;
    if (profile?.bio)         score += 15;
    if (profile?.job_title)   score += 10;
    if (profile?.city)        score += 5;
    if (profile?.linkedin_url) score += 10;
    if (skills.length >= 5)   score += 20;
    if (experience.length >= 1) score += 20;
    if (pd.education)         score += 10;
    return Math.min(100, score);
  }, [profile, skills, experience, pd]);

  const tabs = [
    { id: 'overview',  label: 'نظرة عامة', icon: Target },
    { id: 'skills',    label: 'المهارات',   icon: Zap },
    { id: 'roadmap',   label: 'مسار مهني',  icon: TrendingUp },
    { id: 'salary',    label: 'الرواتب',    icon: Briefcase },
    { id: 'certs',     label: 'الشهادات',   icon: Star },
  ];

  const actionPlan = [
    { done: !!profile?.bio,          action: 'أضف نبذة مهنية',      href: '/dashboard/profile',   priority: 'عالٍ' },
    { done: skills.length >= 5,      action: 'أضف ٥ مهارات أو أكثر', href: '/dashboard/profile',  priority: 'عالٍ' },
    { done: experience.length >= 1,  action: 'أضف خبرة عملية',      href: '/dashboard/profile',   priority: 'عالٍ' },
    { done: !!profile?.linkedin_url, action: 'اربط حساب LinkedIn',   href: '/dashboard/profile',   priority: 'متوسط' },
    { done: !!pd.education,          action: 'أضف تفاصيل التعليم',   href: '/dashboard/profile',   priority: 'متوسط' },
  ].filter(a => !a.done);

  return (
    <DashboardLayout>
      <div className="mb-6 text-right">
        <h1 className="text-2xl font-black text-gray-900">المرشد المهني</h1>
        <p className="text-gray-500 text-sm mt-0.5">توصيات مخصصة لتطوير مسيرتك المهنية في السوق السعودي</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1 flex-row-reverse">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all flex-shrink-0 ${activeTab === tab.id ? 'bg-[#006C35] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-[#006C35]/30'}`}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW ── */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            {/* Profile completeness */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4 flex-row-reverse">
                <h3 className="font-black text-gray-900">قوة ملفك المهني</h3>
                <span className={`text-lg font-black ${profileScore >= 70 ? 'text-green-600' : profileScore >= 40 ? 'text-amber-600' : 'text-red-500'}`}>{profileScore}٪</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3 mb-4">
                <div className="bg-gradient-to-l from-[#006C35] to-[#00A651] h-3 rounded-full transition-all duration-700" style={{ width: `${profileScore}%` }} />
              </div>
              <p className="text-xs text-gray-500 text-right mb-4">
                {profileScore >= 80 ? 'ملفك قوي جداً — مستعد لسوق العمل' :
                 profileScore >= 60 ? 'ملف جيد — أضف بعض التفاصيل لتعزيزه' :
                 'ملفك يحتاج إكمال — سيرفع فرصك بشكل كبير'}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { done: !!profile?.bio, label: 'النبذة المهنية' },
                  { done: skills.length >= 5, label: '٥ مهارات' },
                  { done: experience.length >= 1, label: 'خبرة عملية' },
                  { done: !!pd.education, label: 'التعليم' },
                  { done: !!profile?.linkedin_url, label: 'LinkedIn' },
                  { done: !!profile?.city, label: 'المدينة' },
                ].map((item, i) => (
                  <div key={i} className={`flex items-center gap-2 p-2.5 rounded-xl flex-row-reverse ${item.done ? 'bg-green-50' : 'bg-gray-50'}`}>
                    <CheckCircle size={13} className={item.done ? 'text-green-600' : 'text-gray-300'} />
                    <span className={`text-xs font-bold ${item.done ? 'text-green-700' : 'text-gray-500'}`}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Immediate actions */}
            {actionPlan.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-black text-gray-900 mb-4 text-right">خطوات فورية مقترحة</h3>
                <div className="space-y-3">
                  {actionPlan.map((a, i) => (
                    <Link key={i} to={a.href} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-[#006C35]/5 transition-colors group flex-row-reverse">
                      <ArrowUpRight size={14} className="text-[#006C35] flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="flex-1 text-right">
                        <p className="text-sm font-bold text-gray-800">{a.action}</p>
                      </div>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full flex-shrink-0 ${a.priority === 'عالٍ' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>{a.priority}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-5">
            {/* Market position */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-black text-gray-900 mb-3 text-right text-sm">موقعك في السوق</h3>
              <div className="space-y-2 text-right">
                <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl flex-row-reverse">
                  <span className="text-xs text-gray-500">القطاع المستهدف</span>
                  <span className="text-xs font-black text-gray-800">{sector}</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl flex-row-reverse">
                  <span className="text-xs text-gray-500">سنوات الخبرة</span>
                  <span className="text-xs font-black text-gray-800">{Math.round(yearsExp)} سنة</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl flex-row-reverse">
                  <span className="text-xs text-gray-500">المهارات</span>
                  <span className="text-xs font-black text-gray-800">{skills.length} مهارة</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-green-50 rounded-xl flex-row-reverse">
                  <span className="text-xs text-gray-500">نمو القطاع</span>
                  <span className="text-xs font-black text-green-700">{salaryInfo.growth} سنوياً</span>
                </div>
              </div>
            </div>

            {/* Quick links */}
            <div className="bg-gradient-to-bl from-[#006C35] to-[#004D25] rounded-2xl p-5 text-white">
              <Zap size={16} className="text-[#C8A951] mb-2 mr-auto" />
              <h3 className="font-black text-sm mb-3 text-right">تطوير سريع</h3>
              <div className="space-y-2">
                {[
                  { label: 'تمرين إنجليزي', href: '/dashboard/english-practice', icon: BookOpen },
                  { label: 'مقابلة تدريبية', href: '/dashboard/interview', icon: Target },
                  { label: 'تحديث السيرة', href: '/dashboard/cv', icon: Briefcase },
                ].map((link) => (
                  <Link key={link.href} to={link.href} className="flex items-center gap-2 p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors flex-row-reverse text-xs font-bold text-green-100">
                    <link.icon size={12} />
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── SKILLS ── */}
      {activeTab === 'skills' && (
        <div className="max-w-3xl mx-auto">
          <SkillGapAnalysis userSkills={skills} sector={sector} />
        </div>
      )}

      {/* ── ROADMAP ── */}
      {activeTab === 'roadmap' && (
        <div className="max-w-3xl mx-auto">
          {CAREER_PATHS[sector] ? (
            <CareerRoadmap sector={sector} />
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
              <TrendingUp size={40} className="text-gray-200 mx-auto mb-3" />
              <p className="text-gray-500 font-black">لا يوجد مسار محدد لهذا القطاع بعد</p>
              <p className="text-xs text-gray-400 mt-1">حدّث مجالك الوظيفي في ملفك المهني</p>
            </div>
          )}
        </div>
      )}

      {/* ── SALARY ── */}
      {activeTab === 'salary' && (
        <div className="max-w-3xl mx-auto space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-black text-gray-900 mb-5 text-right">بيانات الرواتب — {sector}</h3>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { label: 'الحد الأدنى', value: salaryInfo.min.toLocaleString('ar-SA'), color: 'text-gray-600', bg: 'bg-gray-50' },
                { label: 'المتوسط', value: salaryInfo.avg.toLocaleString('ar-SA'), color: 'text-[#006C35]', bg: 'bg-[#006C35]/5' },
                { label: 'الحد الأقصى', value: salaryInfo.max.toLocaleString('ar-SA'), color: 'text-[#C8A951]', bg: 'bg-[#C8A951]/10' },
              ].map(s => (
                <div key={s.label} className={`${s.bg} rounded-2xl p-4 text-center`}>
                  <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-gray-400 mt-1">{s.label} / شهر</p>
                </div>
              ))}
            </div>
            <div className="p-3 bg-green-50 border border-green-100 rounded-xl text-right">
              <p className="text-xs font-black text-green-700">نمو القطاع: {salaryInfo.growth} سنوياً</p>
              <p className="text-xs text-green-600 mt-0.5">المصدر: بيانات سوق العمل السعودي — تقدير عام للتوجيه فقط</p>
            </div>
          </div>

          {/* Salary-boosting tips */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-black text-gray-900 mb-4 text-right">كيف ترفع راتبك؟</h3>
            <div className="space-y-3">
              {[
                { tip: 'احصل على شهادة مهنية معتمدة في مجالك', impact: '+١٥-٢٥٪' },
                { tip: 'أضف مهارات سحابية (AWS / Azure / GCP)', impact: '+٢٠-٣٠٪' },
                { tip: 'طوّر مهاراتك في الإنجليزية المهنية', impact: '+١٠-١٥٪' },
                { tip: 'انتقل من شركة صغيرة إلى متوسطة أو كبرى', impact: '+٢٠-٤٠٪' },
                { tip: 'طوّر مهارات قيادة وإدارة الفريق', impact: '+٣٠-٥٠٪' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl flex-row-reverse">
                  <span className="text-xs font-black text-green-700 bg-green-100 px-2 py-0.5 rounded-full flex-shrink-0">{item.impact}</span>
                  <p className="text-sm text-gray-700 flex-1 text-right">{item.tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── CERTS ── */}
      {activeTab === 'certs' && (
        <div className="max-w-3xl mx-auto space-y-4">
          <p className="text-sm text-gray-500 text-right mb-4">الشهادات الأكثر تأثيراً في مجالك</p>
          {certs.map((cert, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4 flex-row-reverse">
              <div className="w-10 h-10 rounded-xl bg-[#006C35]/10 flex items-center justify-center flex-shrink-0">
                <Star size={18} className="text-[#006C35]" />
              </div>
              <div className="flex-1 text-right">
                <h4 className="font-black text-gray-900 text-sm">{cert.name}</h4>
                <p className="text-xs text-gray-400 mt-0.5">مزوّد: {cert.provider}</p>
              </div>
              <span className={`text-xs font-black px-2 py-1 rounded-full flex-shrink-0 ${cert.impact === 'عالٍ' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                تأثير {cert.impact}
              </span>
            </div>
          ))}
          <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl text-right">
            <p className="text-xs font-bold text-amber-800">💡 نصيحة:</p>
            <p className="text-xs text-amber-700 mt-1">ابدأ بشهادة واحدة ذات تأثير عالٍ ثم أضف الأخرى تدريجياً. الشهادات تُذكر في السيرة الذاتية وتُرفع فرص الدعوة للمقابلة.</p>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
