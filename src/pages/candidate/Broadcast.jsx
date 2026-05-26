import { useState } from 'react';
import { Send, CheckCircle, Clock, Building2, Edit3, Copy, Sparkles, Lock } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';

const SAMPLE_COMPANIES = [
  { name: 'أرامكو السعودية',       sector: 'طاقة',         status: 'sent',      statusAr: 'تم الإرسال' },
  { name: 'سابك',                  sector: 'بتروكيماويات', status: 'replied',   statusAr: 'ردّت عليك' },
  { name: 'STC',                   sector: 'اتصالات',      status: 'sent',      statusAr: 'تم الإرسال' },
  { name: 'مجموعة المملكة القابضة', sector: 'استثمار',      status: 'pending',   statusAr: 'قيد التجهيز' },
  { name: 'البنك الأهلي السعودي',   sector: 'مصرفي',        status: 'replied',   statusAr: 'ردّت عليك' },
  { name: 'نيوم',                  sector: 'تطوير',        status: 'sent',      statusAr: 'تم الإرسال' },
  { name: 'مصرف الراجحي',          sector: 'مصرفي',        status: 'pending',   statusAr: 'قيد التجهيز' },
  { name: 'موبايلي',               sector: 'اتصالات',      status: 'sent',      statusAr: 'تم الإرسال' },
];

const STATUS_STYLE = {
  sent:    { bg: 'bg-blue-50',   text: 'text-blue-700',  dot: 'bg-blue-400' },
  replied: { bg: 'bg-green-50',  text: 'text-[#006C35]', dot: 'bg-[#006C35]' },
  pending: { bg: 'bg-amber-50',  text: 'text-amber-700', dot: 'bg-amber-400' },
};

const MESSAGE_TEMPLATE = `السلام عليكم ورحمة الله وبركاته،

أتوجّه إليكم بهذه الرسالة مُعرِّفًا بنفسي؛ أنا [الاسم الكامل]، [المسمى الوظيفي أو التخصص]، وأسعى للانضمام إلى فريق [اسم الشركة] في مجال [المجال].

لديّ خبرة في [أبرز مهاراتك]، وقد عملت سابقًا في [الشركة أو التجربة الأبرز]. أؤمن بأن مهاراتي وطموحاتي تتوافق مع رؤية شركتكم وأهدافها الاستراتيجية.

أودّ الاطلاع على الفرص المتاحة لديكم، وأُسعد بإرسال سيرتي الذاتية ومحفظة أعمالي عند طلبكم.

مع خالص التقدير،
[الاسم الكامل]
[رابط الموقع الشخصي]
[البريد الإلكتروني]`;

export default function Broadcast() {
  const { profile, isPremium } = useAuth();
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState(MESSAGE_TEMPLATE);

  const premium = isPremium();
  const sentCount    = SAMPLE_COMPANIES.filter((c) => c.status === 'sent').length;
  const repliedCount = SAMPLE_COMPANIES.filter((c) => c.status === 'replied').length;
  const pendingCount = SAMPLE_COMPANIES.filter((c) => c.status === 'pending').length;

  const handleCopy = () => {
    navigator.clipboard.writeText(message).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-start justify-between mb-6" dir="rtl">
        <div className="flex gap-3">
          {premium ? (
            <Button variant="primary" size="sm">
              <Send size={14} />
              إرسال الحملة
            </Button>
          ) : (
            <Button variant="gold" size="sm">
              <Lock size={14} />
              فعّل الخدمة
            </Button>
          )}
        </div>
        <div className="text-right">
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2 justify-end">
            <Send size={22} className="text-[#006C35]" />
            البرودكاست
          </h1>
          <p className="text-gray-500 text-sm mt-1">رسالة احترافية تُرسَل باسمك إلى شركات مستهدفة</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-6" dir="rtl">
        {[
          { label: 'تم الإرسال',    value: sentCount,    icon: '📤', color: 'text-blue-600',   bg: 'bg-blue-50' },
          { label: 'ردّت عليك',    value: repliedCount, icon: '💬', color: 'text-[#006C35]',  bg: 'bg-[#006C35]/8' },
          { label: 'قيد التجهيز',  value: pendingCount, icon: '⏳', color: 'text-amber-600',  bg: 'bg-amber-50' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm text-right">
            <div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center mb-2 mr-auto`}>
              <span className="text-lg">{stat.icon}</span>
            </div>
            <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" dir="rtl">

        {/* Message editor */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between p-5 pb-3 border-b border-gray-50">
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {copied ? <CheckCircle size={14} className="text-[#006C35]" /> : <Copy size={14} />}
                {copied ? 'تم النسخ' : 'نسخ'}
              </button>
            </div>
            <div className="flex items-center gap-2">
              <Edit3 size={16} className="text-[#006C35]" />
              <h2 className="font-black text-gray-900">نص الرسالة</h2>
            </div>
          </div>

          <div className="p-5">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={14}
              className="w-full text-sm text-gray-700 leading-relaxed resize-none outline-none border border-gray-100 rounded-xl p-4 focus:border-[#006C35]/40 focus:ring-2 focus:ring-[#006C35]/10 transition-all font-medium bg-gray-50/50"
              dir="rtl"
            />

            {!premium && (
              <div className="mt-3 flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                <Lock size={14} className="text-amber-600 flex-shrink-0" />
                <p className="text-xs text-amber-700">
                  لإرسال الرسالة للشركات تلقائياً، فعّل الخطة الاحترافية
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Company list */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between p-5 pb-3 border-b border-gray-50">
            <span className="text-xs text-gray-400 font-bold">{SAMPLE_COMPANIES.length} شركة مستهدفة</span>
            <div className="flex items-center gap-2">
              <Building2 size={16} className="text-[#006C35]" />
              <h2 className="font-black text-gray-900">الشركات المستهدفة</h2>
            </div>
          </div>

          <div className="divide-y divide-gray-50">
            {SAMPLE_COMPANIES.map((company) => {
              const s = STATUS_STYLE[company.status];
              return (
                <div key={company.name} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
                  <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black ${s.bg} ${s.text} flex-shrink-0`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                    {company.statusAr}
                  </span>
                  <span className="text-xs text-gray-400 flex-shrink-0">{company.sector}</span>
                  <p className="flex-1 text-sm font-bold text-gray-900 text-right truncate">{company.name}</p>
                </div>
              );
            })}
          </div>

          <div className="p-4 pt-3 border-t border-gray-50">
            {premium ? (
              <Button variant="primary" size="sm" className="w-full">
                <Sparkles size={14} />
                إضافة شركات جديدة للحملة
              </Button>
            ) : (
              <div className="text-center">
                <p className="text-xs text-gray-400 mb-2">فعّل الخطة الاحترافية لإدارة قائمة شركاتك</p>
                <Button variant="gold" size="sm" className="w-full">
                  <Lock size={14} />
                  تفعيل الخدمة — ابدأ الآن
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="mt-6 bg-gradient-to-l from-[#006C35] to-[#00A651] rounded-2xl p-6 relative overflow-hidden" dir="rtl">
        <div className="absolute inset-0 saudi-geo-pattern opacity-[0.04] pointer-events-none" />
        <div className="relative">
          <h3 className="font-black text-white text-lg mb-4">كيف تعمل خدمة البرودكاست؟</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { step: '١', title: 'نجهّز رسالتك',    desc: 'نصيغ رسالة تعريفية احترافية تعبّر عنك وتُبرز مهاراتك وتجربتك.' },
              { step: '٢', title: 'نختار الشركات',   desc: 'نحدد الشركات المناسبة لتخصصك وخبرتك وأهدافك المهنية في السعودية.' },
              { step: '٣', title: 'نُرسل ونتابع',    desc: 'نرسل الرسالة بأسلوب احترافي ونتابع الردود وحالة كل شركة لك.' },
            ].map((s) => (
              <div key={s.step} className="flex gap-3">
                <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0 text-white font-black text-sm">
                  {s.step}
                </div>
                <div>
                  <p className="text-white font-bold text-sm mb-1">{s.title}</p>
                  <p className="text-green-200 text-xs leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
