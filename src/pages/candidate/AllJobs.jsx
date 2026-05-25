import { useState, useCallback, useRef } from 'react';
import {
  Search, MapPin, Briefcase, Calendar, BookmarkCheck, Bookmark,
  SlidersHorizontal, Loader2, ExternalLink, ChevronDown,
  Wifi, GraduationCap, Star,
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { useJobs, useSavedJobs } from '../../hooks/useJobs';
import { useApplications } from '../../hooks/useApplications';
import { track, EVENTS } from '../../lib/analytics';

// ── Data ─────────────────────────────────────────────────────────────────────
const CITIES  = ['كل المدن', 'الرياض', 'جدة', 'الدمام', 'الظهران', 'المدينة المنورة', 'مكة المكرمة', 'تبوك', 'أبها', 'جازان', 'الطائف', 'بريدة', 'حائل'];
const REGIONS = ['كل المناطق', 'منطقة الرياض', 'منطقة مكة المكرمة', 'المنطقة الشرقية', 'منطقة المدينة المنورة', 'منطقة تبوك', 'منطقة عسير', 'منطقة جازان', 'منطقة القصيم', 'منطقة حائل'];
const SECTORS = ['كل القطاعات', 'تقنية المعلومات', 'الاتصالات', 'المصارف والتمويل', 'الرعاية الصحية', 'الهندسة والبناء', 'التسويق والإعلام', 'الموارد البشرية', 'القانون', 'التعليم', 'التعدين والطاقة', 'القطاع الحكومي', 'التجزئة والتجارة', 'السياحة والضيافة'];
const JOB_TYPES = ['كل الأنواع', 'دوام كامل', 'دوام جزئي', 'عن بُعد', 'عقد مؤقت', 'تدريب'];
const EXP_LEVELS = ['كل المستويات', 'مبتدئ', 'متوسط', 'متقدم', 'خبير'];

const SOURCE_LABEL = { manual: null, csv: null, rss: 'RSS', linkedin_manual: 'LinkedIn', other: null };

function daysAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 86400000);
  if (diff === 0) return 'اليوم';
  if (diff === 1) return 'أمس';
  if (diff < 7)  return `منذ ${diff} أيام`;
  if (diff < 30) return `منذ ${Math.floor(diff / 7)} أسابيع`;
  return `منذ ${Math.floor(diff / 30)} أشهر`;
}

function SelectFilter({ value, onChange, children }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        className="appearance-none w-full pl-7 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006C35]/20 focus:border-[#006C35] bg-white"
      >
        {children}
      </select>
      <ChevronDown size={13} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
    </div>
  );
}

// ── Job Card ─────────────────────────────────────────────────────────────────
function JobCard({ job, isSaved, isApplied, onSave, onApply }) {
  const salary = job.salary_min && job.salary_max
    ? `${job.salary_min.toLocaleString('ar-SA')} – ${job.salary_max.toLocaleString('ar-SA')} ر.س`
    : null;

  const handleApply = () => {
    if (job.source_url) {
      window.open(job.source_url, '_blank', 'noopener,noreferrer');
      onApply(job); // log the click
    } else {
      onApply(job);
    }
  };

  const sourceBadge = SOURCE_LABEL[job.source];

  return (
    <div className={`bg-white rounded-2xl border shadow-sm p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 relative ${job.is_featured ? 'border-[#C8A951]/40' : 'border-gray-100'} ${isApplied ? 'opacity-80' : ''}`}>
      {job.is_featured && (
        <div className="absolute top-3 left-3 px-2 py-0.5 bg-[#C8A951] text-white text-[10px] font-black rounded-full flex items-center gap-1">
          <Star size={9} />
          مميزة
        </div>
      )}

      <div className="flex items-start gap-4 flex-row-reverse">
        {/* Logo */}
        <div className="w-11 h-11 rounded-xl bg-[#006C35]/10 flex items-center justify-center flex-shrink-0 text-sm font-black text-[#006C35]">
          {job.company_logo
            ? <img src={job.company_logo} alt="" className="w-full h-full object-contain rounded-xl" />
            : job.company[0]}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 text-right">
          <div className="flex items-start justify-between gap-2 mb-0.5">
            <div className="flex items-center gap-2 flex-shrink-0">
              {isApplied ? (
                <span className="px-2 py-1 bg-green-50 border border-green-200 text-green-700 text-[11px] font-black rounded-xl">✓ تم التقديم</span>
              ) : (
                <Button variant="primary" size="sm" onClick={handleApply}>
                  {job.source_url ? <ExternalLink size={11} /> : null}
                  تقدّم
                </Button>
              )}
              <button
                onClick={() => onSave(job.id)}
                className={`p-1.5 rounded-xl border transition-all ${isSaved ? 'bg-[#006C35]/10 border-[#006C35]/20 text-[#006C35]' : 'bg-gray-50 border-gray-100 text-gray-400 hover:text-[#006C35]'}`}
              >
                {isSaved ? <BookmarkCheck size={13} /> : <Bookmark size={13} />}
              </button>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-1.5 justify-end mb-0.5">
                {job.fresh_graduate && <Badge variant="green">🌱 لحديثي التخرج</Badge>}
                {job.is_remote      && <Badge variant="blue">🏠 عن بُعد</Badge>}
                {sourceBadge        && <span className="text-[9px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded font-bold">{sourceBadge}</span>}
                <h3 className="font-black text-gray-900 text-sm leading-tight">{job.title}</h3>
              </div>
              <p className="text-sm text-[#006C35] font-bold">{job.company}</p>
            </div>
          </div>

          {/* Meta row */}
          <div className="flex flex-wrap gap-3 text-xs text-gray-400 justify-end mt-2 mb-2">
            <span className="flex items-center gap-1"><Calendar size={11} />{daysAgo(job.posted_at)}</span>
            <span className="flex items-center gap-1"><Briefcase size={11} />{job.job_type}</span>
            <span className="flex items-center gap-1"><MapPin size={11} />{[job.city, job.region].filter(Boolean).join(' · ')}</span>
            {job.experience_level && <span className="flex items-center gap-1">🎓 {job.experience_level}</span>}
          </div>

          {/* Salary + skills */}
          <div className="flex flex-wrap items-center gap-1.5 justify-end">
            {salary && <span className="text-xs font-bold text-gray-700 bg-gray-50 px-2 py-0.5 rounded-lg border border-gray-100">💰 {salary}</span>}
            {(job.skills ?? []).slice(0, 4).map((skill) => (
              <span key={skill} className="px-2 py-0.5 bg-gray-50 border border-gray-100 text-gray-500 text-[10px] rounded-full">{skill}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function AllJobs() {
  const [search,       setSearch]       = useState('');
  const [debouncedQ,   setDebouncedQ]   = useState('');
  const [city,         setCity]         = useState('كل المدن');
  const [region,       setRegion]       = useState('كل المناطق');
  const [sector,       setSector]       = useState('كل القطاعات');
  const [jobType,      setJobType]      = useState('كل الأنواع');
  const [expLevel,     setExpLevel]     = useState('كل المستويات');
  const [isRemote,     setIsRemote]     = useState(false);
  const [freshGrad,    setFreshGrad]    = useState(false);
  const [showFilters,  setShowFilters]  = useState(false);
  const [applied,      setApplied]      = useState({});
  const timerRef = useRef(null);

  const handleSearchChange = useCallback((val) => {
    setSearch(val);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setDebouncedQ(val), 420);
  }, []);

  const activeFilters = {
    search:          debouncedQ  || undefined,
    city:            city        !== 'كل المدن'       ? city        : undefined,
    region:          region      !== 'كل المناطق'     ? region      : undefined,
    sector:          sector      !== 'كل القطاعات'   ? sector      : undefined,
    jobType:         jobType     !== 'كل الأنواع'    ? jobType     : undefined,
    experienceLevel: expLevel    !== 'كل المستويات'  ? expLevel    : undefined,
    isRemote:        isRemote    || undefined,
    freshGraduate:   freshGrad   || undefined,
  };

  const { jobs, loading, hasMore, loadMore } = useJobs(activeFilters);
  const { savedIds, toggle: toggleSave }     = useSavedJobs();
  const { addApplication }                   = useApplications();

  const hasActiveFilters = !!(debouncedQ || city !== 'كل المدن' || region !== 'كل المناطق' || sector !== 'كل القطاعات' || jobType !== 'كل الأنواع' || expLevel !== 'كل المستويات' || isRemote || freshGrad);

  function reset() {
    setSearch(''); setDebouncedQ('');
    setCity('كل المدن'); setRegion('كل المناطق');
    setSector('كل القطاعات'); setJobType('كل الأنواع');
    setExpLevel('كل المستويات'); setIsRemote(false); setFreshGrad(false);
  }

  const handleApply = async (job) => {
    if (applied[job.id]) return;
    setApplied((a) => ({ ...a, [job.id]: true }));
    await addApplication({ job_id: job.id, company: job.company, position: job.title, logo: job.company_logo, status: 'Pending' });
    track(EVENTS.JOB_APPLIED, { jobId: job.id, company: job.company });
  };

  const handleSave = (jobId) => {
    toggleSave(jobId);
    track(EVENTS.JOB_SAVED, { jobId });
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-6 flex items-start justify-between flex-row-reverse">
        <div className="text-right">
          <h1 className="text-2xl font-black text-gray-900">وظائف حديثة في السعودية</h1>
          <p className="text-gray-500 text-sm mt-0.5">تصفّح أحدث الوظائف المضافة من مصادر متعددة</p>
        </div>
        {savedIds.size > 0 && (
          <Badge variant="green" dot>{savedIds.size} محفوظة</Badge>
        )}
      </div>

      {/* Search + Filters bar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4" dir="rtl">
        <div className="flex gap-3 mb-3">
          <div className="flex-1 relative">
            <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="ابحث عن وظيفة أو شركة..."
              className="w-full pr-10 pl-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006C35]/20 focus:border-[#006C35]"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-bold transition-all ${showFilters || hasActiveFilters ? 'bg-[#006C35]/10 border-[#006C35]/20 text-[#006C35]' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
          >
            <SlidersHorizontal size={15} />
            فلاتر {hasActiveFilters && <span className="w-4 h-4 rounded-full bg-[#006C35] text-white text-[9px] flex items-center justify-center">!</span>}
          </button>
        </div>

        {showFilters && (
          <div className="pt-3 border-t border-gray-50 space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              <SelectFilter value={city}    onChange={(e) => setCity(e.target.value)}   >{CITIES.map((c)    => <option key={c}>{c}</option>)}</SelectFilter>
              <SelectFilter value={region}  onChange={(e) => setRegion(e.target.value)} >{REGIONS.map((r)   => <option key={r}>{r}</option>)}</SelectFilter>
              <SelectFilter value={sector}  onChange={(e) => setSector(e.target.value)} >{SECTORS.map((s)   => <option key={s}>{s}</option>)}</SelectFilter>
              <SelectFilter value={jobType} onChange={(e) => setJobType(e.target.value)}>{JOB_TYPES.map((t) => <option key={t}>{t}</option>)}</SelectFilter>
              <SelectFilter value={expLevel} onChange={(e) => setExpLevel(e.target.value)}>{EXP_LEVELS.map((l) => <option key={l}>{l}</option>)}</SelectFilter>
            </div>
            {/* Toggle filters */}
            <div className="flex items-center gap-4 flex-wrap">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={isRemote} onChange={(e) => setIsRemote(e.target.checked)} className="w-4 h-4 rounded accent-[#006C35]" />
                <span className="text-sm font-bold text-gray-600 flex items-center gap-1"><Wifi size={14} className="text-blue-500" /> عن بُعد فقط</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={freshGrad} onChange={(e) => setFreshGrad(e.target.checked)} className="w-4 h-4 rounded accent-[#006C35]" />
                <span className="text-sm font-bold text-gray-600 flex items-center gap-1"><GraduationCap size={14} className="text-green-500" /> لحديثي التخرج</span>
              </label>
              {hasActiveFilters && (
                <button onClick={reset} className="text-xs font-bold text-red-500 hover:underline flex items-center gap-1">
                  × مسح الفلاتر
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Quick filter chips */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1 flex-row-reverse">
        {[
          { label: '⭐ مميزة',            active: false, onClick: () => {} },
          { label: '🏠 عن بُعد',          active: isRemote,  onClick: () => setIsRemote(!isRemote) },
          { label: '🌱 لحديثي التخرج',   active: freshGrad, onClick: () => setFreshGrad(!freshGrad) },
          { label: '🖥 تقنية',             active: sector === 'تقنية المعلومات', onClick: () => setSector(sector === 'تقنية المعلومات' ? 'كل القطاعات' : 'تقنية المعلومات') },
          { label: '🏥 صحة',              active: sector === 'الرعاية الصحية',  onClick: () => setSector(sector === 'الرعاية الصحية' ? 'كل القطاعات' : 'الرعاية الصحية') },
          { label: '🏦 مصارف',            active: sector === 'المصارف والتمويل', onClick: () => setSector(sector === 'المصارف والتمويل' ? 'كل القطاعات' : 'المصارف والتمويل') },
        ].map(({ label, active, onClick }) => (
          <button
            key={label}
            onClick={onClick}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${active ? 'bg-[#006C35] text-white border-[#006C35]' : 'bg-white text-gray-600 border-gray-200 hover:border-[#006C35]/30'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between mb-4 flex-row-reverse">
        {loading ? (
          <Loader2 size={16} className="text-gray-400 animate-spin" />
        ) : (
          <p className="text-sm text-gray-500">
            <span className="font-black text-gray-900">{jobs.length}</span> وظيفة{hasMore ? '+' : ''}
          </p>
        )}
        {jobs.some((j) => j.is_featured) && <Badge variant="gold" dot>تشمل وظائف مميزة</Badge>}
      </div>

      {/* Job List */}
      {loading && jobs.length === 0 ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 h-28 animate-pulse" />)}
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <Briefcase size={40} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 font-black">لا توجد وظائف مطابقة</p>
          <p className="text-xs text-gray-400 mt-1 mb-4">
            {hasActiveFilters ? 'جرّب تعديل خيارات البحث' : 'لم تُضَف وظائف بعد — استخدم أدوات الإدارة لإضافة وظائف'}
          </p>
          {hasActiveFilters && (
            <button onClick={reset} className="text-xs text-[#006C35] font-black hover:underline">إعادة تعيين الفلاتر</button>
          )}
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                isSaved={savedIds.has(job.id)}
                isApplied={!!applied[job.id]}
                onSave={handleSave}
                onApply={handleApply}
              />
            ))}
          </div>

          {/* Load More */}
          {hasMore && (
            <div className="mt-6 text-center">
              <Button variant="secondary" size="md" onClick={loadMore} disabled={loading}>
                {loading ? <Loader2 size={15} className="animate-spin" /> : null}
                تحميل المزيد من الوظائف
              </Button>
            </div>
          )}

          {!hasMore && jobs.length > 5 && (
            <p className="text-center text-xs text-gray-400 mt-6">تم عرض جميع الوظائف المتاحة ({jobs.length})</p>
          )}
        </>
      )}
    </DashboardLayout>
  );
}
