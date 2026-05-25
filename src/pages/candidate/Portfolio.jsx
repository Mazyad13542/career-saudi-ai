import { Globe, Eye, RefreshCw, Lock, ExternalLink, CheckCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { useAuth } from '../../context/AuthContext';

function makeSlug(name) {
  if (!name) return 'my-profile';
  return name
    .toLowerCase()
    .replace(/[؀-ۿ]/g, (ch) => ch) // keep Arabic as-is
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9؀-ۿ-]/g, '')
    .slice(0, 30) || 'my-profile';
}

function getInitials(name) {
  if (!name) return 'م';
  const parts = name.trim().split(/\s+/);
  return parts.length >= 2 ? `${parts[0][0]} ${parts[1][0]}` : parts[0][0];
}

export default function Portfolio() {
  const { profile, loading, isPremium } = useAuth();

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 size={32} className="animate-spin text-[#006C35]" />
        </div>
      </DashboardLayout>
    );
  }

  const pd       = profile?.profile_data ?? {};
  const skills   = pd.skills   ?? [];
  const projects = pd.projects ?? [];
  const exp      = pd.experience ?? [];
  const certs    = pd.certifications ?? [];

  const slug     = makeSlug(profile?.full_name);
  const url      = `careersaudi.ai/${slug}`;

  // Section completion checks
  const sectionDefs = [
    { name: 'نبذة عني',      icon: '👤', done: Boolean(profile?.bio) },
    { name: 'المهارات',      icon: '⚙️', done: skills.length > 0 },
    { name: 'الخبرة العملية', icon: '💼', done: exp.length > 0 },
    { name: 'التعليم',       icon: '🎓', done: Boolean(pd.education) },
    { name: 'المشاريع',      icon: '🚀', done: projects.length > 0 },
    { name: 'الشهادات',      icon: '📜', done: certs.length > 0 },
    { name: 'التواصل',       icon: '📱', done: Boolean(profile?.linkedin_url || profile?.phone) },
  ];

  const completedCount = sectionDefs.filter((s) => s.done).length;
  const completionPct  = Math.round((completedCount / sectionDefs.length) * 100);

  const displaySkills  = skills.slice(0, 4);
  const displayProjects = projects.slice(0, 2);

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-3">
          <a href={`https://${url}`} target="_blank" rel="noopener noreferrer">
            <Button variant="primary" size="sm">
              <Globe size={14} />
              عرض المباشر
              <ExternalLink size={12} />
            </Button>
          </a>
          <Button variant="secondary" size="sm">
            <Eye size={14} />
            معاينة
          </Button>
        </div>
        <div className="text-right">
          <h1 className="text-2xl font-black text-gray-900">الموقع الشخصي</h1>
          <p className="text-gray-500 text-sm mt-0.5">أنشئ وشارك ملفك المهني الإلكتروني</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Preview */}
        <div className="lg:col-span-2 space-y-5">
          {/* Status bar */}
          <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm flex-row-reverse">
            <div className="w-10 h-10 rounded-xl bg-[#006C35]/10 flex items-center justify-center">
              <Globe size={20} className="text-[#006C35]" />
            </div>
            <div className="flex-1 text-right">
              <div className="flex items-center gap-2 justify-end">
                <Badge variant="green" dot>منشور</Badge>
                <span className="font-black text-gray-900 text-sm latin">{url}</span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">رابطك المهني الشخصي</p>
            </div>
            <Button variant="ghost" size="sm">
              <RefreshCw size={13} />
              تحديث
            </Button>
          </div>

          {/* Portfolio browser mock */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-100">
              <div className="flex-1 mx-3 bg-white border border-gray-200 rounded px-2 py-0.5 text-[10px] text-gray-400 text-center latin">
                {url}
              </div>
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-red-400" />
              </div>
            </div>

            {/* Portfolio content */}
            <div className="p-0">
              {/* Hero */}
              <div className="gradient-saudi p-8 text-white text-center">
                <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-3">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="" className="w-full h-full object-cover rounded-2xl" />
                  ) : (
                    <span className="text-2xl font-black">{getInitials(profile?.full_name)}</span>
                  )}
                </div>
                <h2 className="text-lg font-black">{profile?.full_name ?? 'مستخدم قِمّة'}</h2>
                <p className="text-green-200 text-sm">
                  {[profile?.job_title, profile?.city ? `${profile.city}، المملكة العربية السعودية` : null]
                    .filter(Boolean).join(' · ') || 'باحث عن عمل'}
                </p>
                {displaySkills.length > 0 && (
                  <div className="flex justify-center flex-wrap gap-2 mt-3">
                    {displaySkills.map((s) => (
                      <span key={s} className="px-2 py-0.5 bg-white/20 text-white text-[10px] rounded-full">{s}</span>
                    ))}
                  </div>
                )}
              </div>

              {/* About */}
              <div className="p-5 border-b border-gray-50 text-right">
                <h3 className="text-xs font-black text-gray-800 uppercase tracking-wider mb-2">نبذة عني</h3>
                {profile?.bio ? (
                  <p className="text-xs text-gray-500 leading-relaxed">{profile.bio}</p>
                ) : (
                  <p className="text-xs text-gray-400 italic">
                    لم تُضِف نبذة بعد —{' '}
                    <Link to="/dashboard/profile" className="text-[#006C35] font-bold not-italic hover:underline">
                      أضف الآن
                    </Link>
                  </p>
                )}
              </div>

              {/* Projects */}
              <div className="p-5">
                <h3 className="text-xs font-black text-gray-800 uppercase tracking-wider mb-3 text-right">المشاريع المميزة</h3>
                {displayProjects.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {displayProjects.map((p, i) => (
                      <div key={p.name ?? i} className={`${i % 2 === 0 ? 'bg-blue-50' : 'bg-green-50'} rounded-xl p-3 text-right`}>
                        <p className="text-[11px] font-black text-gray-800">{p.name}</p>
                        {p.tech && <p className="text-[10px] text-gray-500 mt-0.5">{p.tech}</p>}
                        {p.description && <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">{p.description}</p>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 italic text-right">
                    لا توجد مشاريع بعد —{' '}
                    <Link to="/dashboard/profile" className="text-[#006C35] font-bold not-italic hover:underline">
                      أضف مشاريعك
                    </Link>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          {/* Section Completion */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-black text-gray-900 mb-4 text-sm text-right">أقسام الموقع</h3>
            <div className="space-y-2">
              {sectionDefs.map((s) => (
                <div key={s.name} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors flex-row-reverse">
                  <span>{s.icon}</span>
                  <span className="flex-1 text-sm text-gray-700 text-right">{s.name}</span>
                  {s.done ? (
                    <CheckCircle size={15} className="text-[#006C35]" />
                  ) : (
                    <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">غير مكتمل</span>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-50">
              <div className="flex justify-between text-xs text-gray-500 mb-2 flex-row-reverse">
                <span>اكتمال الموقع</span>
                <span className="font-black text-[#006C35]">{completionPct}٪</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div className="bg-[#006C35] h-1.5 rounded-full transition-all duration-500" style={{ width: `${completionPct}%` }} />
              </div>
            </div>
          </div>

          {/* Custom Domain — paid feature */}
          {isPremium() ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-black text-gray-900 mb-2 text-sm text-right">نطاقك الخاص</h3>
              <p className="text-xs text-gray-500 text-right mb-3">ربط نطاق مخصص متاح في الخطة الاحترافية</p>
              <div className="p-3 bg-[#006C35]/5 rounded-xl text-right">
                <p className="text-xs font-bold text-[#006C35] latin">{url}</p>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-bl from-[#006C35] to-[#004D25] rounded-2xl p-5 text-white">
              <Lock size={14} className="text-green-300 mb-2 mr-auto" />
              <h3 className="font-black mb-1 text-sm text-right">نطاق خاص بك</h3>
              <p className="text-xs text-green-200 mb-3 leading-relaxed text-right">
                احصل على نطاقك الخاص: <strong className="latin">yourname.com</strong><br />
                رابط احترافي ولا يُنسى
              </p>
              <Link to="/pricing">
                <Button variant="gold" size="sm" className="w-full">ترقَّ إلى المميز</Button>
              </Link>
            </div>
          )}

          {/* Share */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-black text-gray-900 mb-3 text-sm text-right">شارك موقعك</h3>
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl mb-3 flex-row-reverse">
              <Globe size={13} className="text-gray-400 flex-shrink-0" />
              <span className="text-xs text-gray-600 truncate flex-1 text-right latin">{url}</span>
              <button
                onClick={() => navigator.clipboard?.writeText(`https://${url}`)}
                className="text-xs text-[#006C35] font-black flex-shrink-0 hover:opacity-70 transition-opacity"
              >
                نسخ
              </button>
            </div>
            <div className="flex gap-2">
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=https://${url}`}
                target="_blank" rel="noopener noreferrer"
                className="flex-1 py-2 text-xs font-bold bg-gray-50 border border-gray-100 rounded-xl hover:bg-gray-100 transition-colors text-gray-600 text-center"
              >
                LinkedIn
              </a>
              <a
                href={`https://wa.me/?text=https://${url}`}
                target="_blank" rel="noopener noreferrer"
                className="flex-1 py-2 text-xs font-bold bg-gray-50 border border-gray-100 rounded-xl hover:bg-gray-100 transition-colors text-gray-600 text-center"
              >
                WhatsApp
              </a>
              <a
                href={`mailto:?subject=ملفي المهني&body=https://${url}`}
                className="flex-1 py-2 text-xs font-bold bg-gray-50 border border-gray-100 rounded-xl hover:bg-gray-100 transition-colors text-gray-600 text-center"
              >
                بريد
              </a>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
