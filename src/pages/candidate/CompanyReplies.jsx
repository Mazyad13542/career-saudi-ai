import { useState, useMemo } from 'react';
import { Mail, Calendar, CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useApplications } from '../../hooks/useApplications';

const typeConfig = {
  interview:  { icon: CheckCircle,  color: 'text-green-600', bg: 'bg-green-50',  border: 'border-green-200',  label: 'دعوة مقابلة' },
  progress:   { icon: AlertCircle,  color: 'text-blue-600',  bg: 'bg-blue-50',   border: 'border-blue-200',   label: 'تحديث الطلب' },
  rejection:  { icon: XCircle,      color: 'text-red-500',   bg: 'bg-red-50',    border: 'border-red-200',    label: 'لم يُختر' },
  offer:      { icon: Info,         color: 'text-purple-600',bg: 'bg-purple-50', border: 'border-purple-200', label: 'عرض وظيفي' },
};

function statusToType(status) {
  if (status === 'Interview') return 'interview';
  if (status === 'Offer')     return 'offer';
  if (status === 'Rejected')  return 'rejection';
  return 'progress';
}

function generateContent(app) {
  const pos = app.position;
  const co  = app.company;
  if (app.status === 'Interview') {
    return `تهانينا على تقدّمك لوظيفة ${pos}!\n\nيسعدنا إبلاغك بأن طلبك تجاوز مرحلة الفرز الأولية، وأننا نرغب في دعوتك لإجراء مقابلة شخصية مع فريق التوظيف في ${co}.\n\nسيتواصل معك فريق HR خلال 48 ساعة لتحديد موعد المقابلة. يُرجى التأكد من توفّر بريدك الإلكتروني.\n\nنتطلع لمعرفتك أكثر!`;
  }
  if (app.status === 'Offer') {
    return `بخصوص طلبك لشغل منصب ${pos} في ${co}،\n\nيسعدنا إبلاغك بأننا اخترناك من بين عدد كبير من المرشحين المتميزين. نرغب في تقديم عرض وظيفي رسمي لك.\n\nسيتواصل معك فريقنا خلال يومين عمل لمناقشة تفاصيل العرض والراتب والمزايا.\n\nأهلاً بك في عائلة ${co}!`;
  }
  if (app.status === 'Rejected') {
    return `شكراً لاهتمامك بالانضمام إلى فريق ${co} وتقديمك لوظيفة ${pos}.\n\nبعد مراجعة دقيقة لجميع الطلبات، آثرنا المضيّ قدماً مع مرشحين آخرين تتوافق خلفياتهم بشكل أوثق مع متطلبات هذا الدور في الوقت الراهن.\n\nنقدّر جهودك وحماسك، ونتمنى لك التوفيق في مسيرتك المهنية.`;
  }
  return `شكراً لتقديمك على وظيفة ${pos} في ${co}.\n\nتمت مراجعة ملفك الشخصي من قِبَل فريق التوظيف، وطلبك حالياً في مرحلة التقييم التفصيلي. سنُعلمك بأي تطوّر خلال أسبوع.\n\nشكراً لصبرك.`;
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('ar-SA', { month: 'short', day: 'numeric' });
}

function avatarUrl(app) {
  if (app.logo) return app.logo;
  const letter = (app.company || 'C')[0].toUpperCase();
  return `https://ui-avatars.com/api/?name=${letter}&background=006C35&color=fff&size=40&bold=true`;
}

export default function CompanyReplies() {
  const { applications, loading } = useApplications();
  const [readIds, setReadIds] = useState(new Set());

  const messages = useMemo(() =>
    applications
      .filter((a) => a.status !== 'Pending')
      .map((a) => ({
        id:       a.id,
        from:     a.company,
        fromLogo: avatarUrl(a),
        subject:  `بشأن طلبك لوظيفة ${a.position}`,
        type:     statusToType(a.status),
        date:     formatDate(a.applied_at),
        content:  generateContent(a),
        status:   a.status,
      })),
    [applications]
  );

  const [selected, setSelected] = useState(null);

  const handleSelect = (msg) => {
    setSelected(msg);
    setReadIds((s) => new Set([...s, msg.id]));
  };

  const unread = messages.filter((m) => !readIds.has(m.id)).length;

  return (
    <DashboardLayout>
      <div className="mb-6 text-right">
        <h1 className="text-2xl font-black text-gray-900">ردود الشركات</h1>
        <p className="text-gray-500 text-sm mt-0.5">دعوات المقابلات والردود ورسائل فرق HR</p>
      </div>

      <div className="flex gap-6 h-[calc(100vh-220px)]">
        {/* Message Detail */}
        {selected ? (
          <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-50">
              <div className="flex items-start justify-between gap-4 flex-row-reverse">
                <div className="flex items-start gap-3 flex-row-reverse">
                  <img src={selected.fromLogo} alt={selected.from} className="w-10 h-10 rounded-xl" />
                  <div className="text-right">
                    <h2 className="font-black text-gray-900 text-lg leading-tight">{selected.subject}</h2>
                    <div className="flex items-center gap-2 mt-1 justify-end">
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Calendar size={11} /> {selected.date}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-gray-300" />
                      <span className="text-sm text-gray-500">من: {selected.from}</span>
                    </div>
                  </div>
                </div>
                {(() => {
                  const tc = typeConfig[selected.type];
                  return (
                    <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${tc.bg} ${tc.color} ${tc.border}`}>
                      {tc.label}
                      <tc.icon size={12} />
                    </span>
                  );
                })()}
              </div>
            </div>

            <div className="flex-1 p-6 overflow-y-auto scrollbar-thin">
              <div className="max-w-2xl mr-auto">
                <div className="bg-gray-50 rounded-2xl p-5 text-sm text-gray-700 leading-relaxed whitespace-pre-line text-right">
                  {selected.content}
                </div>

                {selected.type === 'interview' && (
                  <div className="mt-6 p-5 bg-green-50 border border-green-200 rounded-2xl text-right">
                    <p className="text-sm font-black text-green-800 mb-3">🎉 لديك دعوة مقابلة!</p>
                    <div className="flex gap-3 flex-row-reverse">
                      <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-xl transition-colors">
                        ✅ تأكيد الحضور
                      </button>
                      <button className="px-4 py-2 bg-white border border-green-200 text-green-700 text-sm font-bold rounded-xl hover:bg-green-50 transition-colors">
                        📅 طلب إعادة الجدولة
                      </button>
                    </div>
                  </div>
                )}

                {selected.type === 'offer' && (
                  <div className="mt-6 p-5 bg-purple-50 border border-purple-200 rounded-2xl text-right">
                    <p className="text-sm font-black text-purple-800 mb-3">🎊 عرض وظيفي رسمي!</p>
                    <div className="flex gap-3 flex-row-reverse">
                      <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold rounded-xl transition-colors">
                        ✅ قبول العرض
                      </button>
                      <button className="px-4 py-2 bg-white border border-purple-200 text-purple-700 text-sm font-bold rounded-xl hover:bg-purple-50 transition-colors">
                        🤝 طلب مفاوضة
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center">
            <div className="text-center">
              <Mail size={40} className="text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">
                {loading ? 'جاري التحميل...' : messages.length === 0 ? 'لا توجد ردود بعد' : 'اختر رسالة لعرضها'}
              </p>
            </div>
          </div>
        )}

        {/* Message List */}
        <div className="w-80 flex-shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between flex-row-reverse">
            <span className="text-sm font-black text-gray-900">الوارد</span>
            {unread > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#006C35] text-white text-xs flex items-center justify-center font-black">
                {unread}
              </span>
            )}
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-gray-50 scrollbar-thin">
            {loading ? (
              <div className="flex items-center justify-center h-32 text-gray-400 text-sm">جاري التحميل...</div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-gray-400 text-center px-4">
                <Mail size={28} className="text-gray-200 mb-2" />
                <p className="text-xs">ستظهر هنا ردود الشركات على تقديماتك</p>
              </div>
            ) : (
              messages.map((msg) => {
                const tc = typeConfig[msg.type];
                const isRead = readIds.has(msg.id);
                return (
                  <button
                    key={msg.id}
                    onClick={() => handleSelect(msg)}
                    className={`w-full text-right p-4 hover:bg-gray-50 transition-colors ${selected?.id === msg.id ? 'bg-[#006C35]/5' : ''}`}
                  >
                    <div className="flex items-start gap-3 flex-row-reverse">
                      <img src={msg.fromLogo} alt={msg.from} className="w-9 h-9 rounded-xl flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between flex-row-reverse">
                          <p className={`text-sm font-bold truncate ${!isRead ? 'text-gray-900' : 'text-gray-600'}`}>
                            {msg.from}
                          </p>
                          {!isRead && <span className="w-2 h-2 rounded-full bg-[#006C35] flex-shrink-0" />}
                        </div>
                        <p className={`text-xs mt-0.5 truncate ${!isRead ? 'text-gray-700 font-bold' : 'text-gray-400'}`}>
                          {msg.subject}
                        </p>
                        <div className="flex items-center gap-2 mt-1 flex-row-reverse">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${tc.bg} ${tc.color} ${tc.border}`}>
                            {tc.label}
                          </span>
                          <span className="text-[10px] text-gray-300">{msg.date}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
