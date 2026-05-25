import { useState, useEffect } from 'react';
import { Bell, Lock, Globe, Shield, Trash2, Save, CheckCircle, User, Mail, Phone, AlertCircle } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { track, EVENTS } from '../../lib/analytics';

const SECTIONS = [
  { key: 'account',       label: 'الحساب',      icon: User },
  { key: 'notifications', label: 'الإشعارات',   icon: Bell },
  { key: 'privacy',       label: 'الخصوصية',    icon: Shield },
  { key: 'security',      label: 'الأمان',       icon: Lock },
];

export default function Settings() {
  const { profile, updateProfile, changePassword } = useAuth();
  const [active, setActive]   = useState('account');
  const [saving, setSaving]   = useState(false);
  const [saved,  setSaved]    = useState(false);
  const [error,  setError]    = useState('');

  const [form, setForm] = useState({
    full_name: '',
    phone:     '',
    city:      '',
    job_title: '',
  });

  const [passwords, setPasswords] = useState({
    current: '', newPass: '', confirm: '',
  });

  const [notifications, setNotifications] = useState({
    jobMatches: true, companyReplies: true, weeklyReport: true,
    marketingEmails: false, smsAlerts: false,
  });

  const [privacy, setPrivacy] = useState({
    profileVisible: true, showEnglishLevel: true,
    allowRecruiters: true, showSalaryExpectation: false,
  });

  // Populate from profile
  useEffect(() => {
    if (!profile) return;
    setForm({
      full_name: profile.full_name || '',
      phone:     profile.phone     || '',
      city:      profile.city      || '',
      job_title: profile.job_title || '',
    });
    if (profile.notifications_prefs) setNotifications(profile.notifications_prefs);
    if (profile.privacy_settings)    setPrivacy(profile.privacy_settings);
  }, [profile]);

  const showSuccess = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

  const saveAccount = async () => {
    setSaving(true); setError('');
    const { error: err } = await updateProfile(form);
    setSaving(false);
    if (err) { setError('حدث خطأ أثناء الحفظ'); return; }
    track(EVENTS.PROFILE_UPDATED);
    showSuccess();
  };

  const saveNotifications = async () => {
    setSaving(true);
    await updateProfile({ notifications_prefs: notifications });
    setSaving(false);
    track(EVENTS.SETTINGS_UPDATED, { section: 'notifications' });
    showSuccess();
  };

  const savePrivacy = async () => {
    setSaving(true);
    await updateProfile({ privacy_settings: privacy });
    setSaving(false);
    track(EVENTS.SETTINGS_UPDATED, { section: 'privacy' });
    showSuccess();
  };

  const savePassword = async () => {
    setError('');
    if (passwords.newPass !== passwords.confirm) {
      setError('كلمتا المرور الجديدة غير متطابقتين');
      return;
    }
    if (passwords.newPass.length < 8) {
      setError('كلمة المرور يجب أن تكون ٨ أحرف على الأقل');
      return;
    }
    setSaving(true);
    const { error: err } = await changePassword(passwords.newPass);
    setSaving(false);
    if (err) { setError('فشل تغيير كلمة المرور. تأكد من صحة المعلومات.'); return; }
    setPasswords({ current: '', newPass: '', confirm: '' });
    showSuccess();
  };

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : 'م';

  return (
    <DashboardLayout>
      <div className="mb-6 text-right">
        <h1 className="text-2xl font-black text-gray-900">الإعدادات</h1>
        <p className="text-gray-500 text-sm mt-0.5">إدارة حسابك وتفضيلاتك</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="space-y-1">
          {SECTIONS.map((s) => (
            <button
              key={s.key}
              onClick={() => { setActive(s.key); setError(''); setSaved(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-black transition-all duration-200 flex-row-reverse ${
                active === s.key
                  ? 'bg-[#006C35]/10 text-[#006C35]'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <s.icon size={16} className="flex-shrink-0" />
              <span className="flex-1 text-right">{s.label}</span>
            </button>
          ))}

          <div className="pt-4 mt-4 border-t border-gray-100">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-black text-red-500 hover:bg-red-50 transition-all flex-row-reverse">
              <Trash2 size={16} />
              <span>حذف الحساب</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">

          {/* Error / Success */}
          {error && (
            <div className="mb-4 flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
              <AlertCircle size={14} className="text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700 font-bold">{error}</p>
            </div>
          )}
          {saved && (
            <div className="mb-4 flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl">
              <CheckCircle size={14} className="text-green-600 flex-shrink-0" />
              <p className="text-sm text-green-700 font-bold">تم الحفظ بنجاح ✓</p>
            </div>
          )}

          {/* Account */}
          {active === 'account' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
              <h2 className="font-black text-gray-900 text-right">معلومات الحساب</h2>

              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl flex-row-reverse">
                <div className="w-16 h-16 rounded-2xl gradient-saudi flex items-center justify-center flex-shrink-0">
                  <span className="text-xl font-black text-white">{initials}</span>
                </div>
                <div className="text-right flex-1">
                  <p className="font-black text-gray-900">{profile?.full_name || 'المستخدم'}</p>
                  <p className="text-xs text-gray-400 mt-0.5 latin">{profile?.email}</p>
                  <p className="text-xs font-bold mt-1" style={{ color: '#006C35' }}>
                    {profile?.plan === 'professional' ? '⭐ الخطة الاحترافية' : 'الخطة المجانية'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: 'الاسم الكامل',           field: 'full_name', icon: User,  type: 'text',  dir: 'rtl' },
                  { label: 'رقم الجوال',             field: 'phone',     icon: Phone, type: 'tel',   dir: 'ltr' },
                  { label: 'المدينة',                field: 'city',      icon: Globe, type: 'text',  dir: 'rtl' },
                  { label: 'المسمى الوظيفي',         field: 'job_title', icon: Mail,  type: 'text',  dir: 'rtl' },
                ].map((f) => (
                  <div key={f.field}>
                    <label className="text-xs font-black text-gray-500 block mb-1.5 text-right">{f.label}</label>
                    <div className="relative">
                      <f.icon size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type={f.type}
                        dir={f.dir}
                        value={form[f.field]}
                        onChange={(e) => setForm((p) => ({ ...p, [f.field]: e.target.value }))}
                        className="w-full pr-9 pl-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006C35]/20 focus:border-[#006C35] text-right"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <Button variant="primary" size="md" onClick={saveAccount} loading={saving}>
                {saved ? <CheckCircle size={14} /> : <Save size={14} />}
                {saved ? 'تم الحفظ ✓' : 'حفظ التغييرات'}
              </Button>
            </div>
          )}

          {/* Notifications */}
          {active === 'notifications' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
              <h2 className="font-black text-gray-900 text-right">إعدادات الإشعارات</h2>
              <div className="space-y-4">
                {[
                  { key: 'jobMatches',     label: 'وظائف مناسبة جديدة',  desc: 'إشعار عند وجود وظائف تتطابق مع ملفك' },
                  { key: 'companyReplies', label: 'ردود الشركات',         desc: 'إشعار فوري عند رد أي شركة على طلبك' },
                  { key: 'weeklyReport',   label: 'التقرير الأسبوعي',     desc: 'ملخص أسبوعي لنشاطك ومستوى جاهزيتك' },
                  { key: 'marketingEmails',label: 'رسائل تسويقية',        desc: 'عروض ونصائح مهنية من الفريق' },
                  { key: 'smsAlerts',      label: 'تنبيهات SMS',          desc: 'إشعارات نصية على جوالك' },
                ].map((n) => (
                  <div key={n.key} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 flex-row-reverse">
                    <div className="text-right flex-1">
                      <p className="text-sm font-black text-gray-900">{n.label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{n.desc}</p>
                    </div>
                    <button
                      onClick={() => setNotifications((p) => ({ ...p, [n.key]: !p[n.key] }))}
                      className={`relative w-11 h-6 rounded-full transition-all duration-300 flex-shrink-0 mr-4 ${notifications[n.key] ? 'bg-[#006C35]' : 'bg-gray-200'}`}
                    >
                      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-300 ${notifications[n.key] ? 'right-0.5' : 'left-0.5'}`} />
                    </button>
                  </div>
                ))}
              </div>
              <Button variant="primary" size="md" onClick={saveNotifications} loading={saving}>
                {saved ? <CheckCircle size={14} /> : <Save size={14} />}
                {saved ? 'تم الحفظ ✓' : 'حفظ التفضيلات'}
              </Button>
            </div>
          )}

          {/* Privacy */}
          {active === 'privacy' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
              <h2 className="font-black text-gray-900 text-right">إعدادات الخصوصية</h2>
              <div className="space-y-4">
                {[
                  { key: 'profileVisible',       label: 'ملفي مرئي للشركات',        desc: 'السماح للشركات برؤية ملفك المهني' },
                  { key: 'showEnglishLevel',     label: 'عرض مستوى الإنجليزية',      desc: 'عرض درجة مستوى اللغة الإنجليزية على ملفك' },
                  { key: 'allowRecruiters',      label: 'السماح بالتواصل المباشر',   desc: 'السماح لمسؤولي التوظيف بالتواصل معك' },
                  { key: 'showSalaryExpectation',label: 'عرض توقعات الراتب',         desc: 'عرض توقعاتك الراتبية للشركات' },
                ].map((p) => (
                  <div key={p.key} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 flex-row-reverse">
                    <div className="text-right flex-1">
                      <p className="text-sm font-black text-gray-900">{p.label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{p.desc}</p>
                    </div>
                    <button
                      onClick={() => setPrivacy((prev) => ({ ...prev, [p.key]: !prev[p.key] }))}
                      className={`relative w-11 h-6 rounded-full transition-all duration-300 flex-shrink-0 mr-4 ${privacy[p.key] ? 'bg-[#006C35]' : 'bg-gray-200'}`}
                    >
                      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-300 ${privacy[p.key] ? 'right-0.5' : 'left-0.5'}`} />
                    </button>
                  </div>
                ))}
              </div>
              <Button variant="primary" size="md" onClick={savePrivacy} loading={saving}>
                {saved ? <CheckCircle size={14} /> : <Save size={14} />}
                {saved ? 'تم الحفظ ✓' : 'حفظ الخصوصية'}
              </Button>
            </div>
          )}

          {/* Security */}
          {active === 'security' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
              <h2 className="font-black text-gray-900 text-right">الأمان والمصادقة</h2>
              <div className="space-y-4">
                {[
                  { label: 'كلمة المرور الجديدة', field: 'newPass'  },
                  { label: 'تأكيد كلمة المرور',  field: 'confirm'  },
                ].map((f) => (
                  <div key={f.field}>
                    <label className="text-xs font-black text-gray-600 block mb-1.5 text-right">{f.label}</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={passwords[f.field]}
                      onChange={(e) => setPasswords((p) => ({ ...p, [f.field]: e.target.value }))}
                      className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006C35]/20"
                    />
                  </div>
                ))}
              </div>
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-right">
                <p className="text-xs font-black text-blue-800 mb-1">🔒 تعزيز أمان الحساب</p>
                <p className="text-xs text-blue-600">استخدم كلمة مرور قوية تحتوي على أحرف وأرقام ورموز</p>
              </div>
              <Button variant="primary" size="md" onClick={savePassword} loading={saving}>
                {saved ? <CheckCircle size={14} /> : <Lock size={14} />}
                {saved ? 'تم تغيير كلمة المرور ✓' : 'تحديث كلمة المرور'}
              </Button>
            </div>
          )}

        </div>
      </div>
    </DashboardLayout>
  );
}
