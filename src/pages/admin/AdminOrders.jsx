import { useEffect, useState } from 'react';
import {
  Loader2, Copy, ChevronDown, ChevronUp,
  Phone, MapPin, GraduationCap, Briefcase, User, Send,
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { supabase } from '../../lib/supabase';
import SendApplicationsModal from '../../components/admin/SendApplicationsModal';

const STATUS_OPTIONS = [
  { value: 'new',         label: 'جديد',          emoji: '🟡' },
  { value: 'in_progress', label: 'قيد التنفيذ',   emoji: '🔵' },
  { value: 'completed',   label: 'منجز',           emoji: '✅' },
  { value: 'delivered',   label: 'تم التسليم',     emoji: '🟢' },
];

function statusLabel(val) {
  const found = STATUS_OPTIONS.find((s) => s.value === val);
  return found ? `${found.emoji} ${found.label}` : val;
}

function Section({ title, icon: Icon, children }) {
  return (
    <div className="mt-4">
      <div className="flex items-center gap-2 mb-2 pb-1 border-b border-gray-100">
        <Icon size={15} className="text-[#006C35]" />
        <span className="text-xs font-black text-gray-700">{title}</span>
      </div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-xs text-gray-600">
        {children}
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  if (!value) return null;
  return (
    <>
      <span className="text-gray-400">{label}</span>
      <span className="font-bold text-gray-800 break-words">{value}</span>
    </>
  );
}

function buildCopyText(order) {
  const lines = [
    `== طلب: ${order.full_name || 'غير محدد'} ==`,
    '',
    '-- المعلومات الشخصية --',
    `الاسم: ${order.full_name || ''}`,
    `الجوال: ${order.phone || ''}`,
    `المنطقة: ${order.region || ''}`,
    `المدينة: ${order.city || ''}`,
    '',
    '-- التعليم --',
    `الجامعة: ${order.university || ''}`,
    `الدرجة: ${order.degree || ''}`,
    `التخصص: ${order.major || ''}`,
    `سنة التخرج: ${order.graduation_year || ''}`,
    '',
    '-- الخبرة والمهارات --',
    `سنوات الخبرة: ${order.experience_years || ''}`,
    `آخر مسمى: ${order.last_job_title || ''}`,
    `آخر جهة عمل: ${order.last_company || ''}`,
    `المهارات: ${order.skills || ''}`,
    `اللغات: ${(order.languages || []).join('، ')}`,
    `الوظيفة المستهدفة: ${order.target_job || ''}`,
    `القطاع المستهدف: ${order.target_sector || ''}`,
    '',
    '-- معلومات إضافية --',
    `LinkedIn: ${order.linkedin_url || ''}`,
    `ملاحظات: ${order.additional_info || ''}`,
    '',
    `تاريخ الإرسال: ${order.created_at ? new Date(order.created_at).toLocaleString('ar-SA') : ''}`,
  ];
  return lines.join('\n');
}

function OrderCard({ order, onStatusChange, onSendApplications }) {
  const [expanded, setExpanded] = useState(false);
  const [status, setStatus]     = useState(order.status || 'new');
  const [copying, setCopying]   = useState(false);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    await supabase
      .from('client_intake')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', order.id);
    onStatusChange?.(order.id, newStatus);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(buildCopyText(order));
      setCopying(true);
      setTimeout(() => setCopying(false), 2000);
    } catch {
      alert('تعذّر النسخ — حاول مرة أخرى.');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden" dir="rtl">
      {/* Card header */}
      <div className="flex items-start justify-between p-5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setExpanded((e) => !e)}
            className="flex items-center gap-1.5 text-xs font-bold text-[#006C35] bg-[#006C35]/8 px-3 py-1.5 rounded-xl hover:bg-[#006C35]/15 transition"
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {expanded ? 'إخفاء' : 'عرض التفاصيل'}
          </button>
          <select
            value={status}
            onChange={handleStatusChange}
            className="text-xs font-bold border border-gray-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#006C35]/30 focus:border-[#006C35] bg-white cursor-pointer"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>{s.emoji} {s.label}</option>
            ))}
          </select>
        </div>

        <div className="text-right">
          <p className="font-black text-gray-900 text-sm">{order.full_name || 'مجهول'}</p>
          <div className="flex items-center gap-3 mt-1 justify-end">
            {order.phone && (
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <Phone size={11} />
                <span dir="ltr">{order.phone}</span>
              </span>
            )}
            {(order.city || order.region) && (
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <MapPin size={11} />
                {[order.city, order.region].filter(Boolean).join('، ')}
              </span>
            )}
          </div>
          {order.created_at && (
            <p className="text-[10px] text-gray-400 mt-1">
              {new Date(order.created_at).toLocaleDateString('ar-SA', {
                year: 'numeric', month: 'long', day: 'numeric',
              })}
            </p>
          )}
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="px-5 pb-5 border-t border-gray-50 pt-4">
          <Section title="المعلومات الشخصية" icon={User}>
            <InfoRow label="الاسم" value={order.full_name} />
            <InfoRow label="الجوال" value={order.phone} />
            <InfoRow label="المنطقة" value={order.region} />
            <InfoRow label="المدينة" value={order.city} />
          </Section>

          <Section title="التعليم" icon={GraduationCap}>
            <InfoRow label="الجامعة" value={order.university} />
            <InfoRow label="الدرجة" value={order.degree} />
            <InfoRow label="التخصص" value={order.major} />
            <InfoRow label="سنة التخرج" value={order.graduation_year} />
          </Section>

          <Section title="الخبرة والمهارات" icon={Briefcase}>
            <InfoRow label="سنوات الخبرة" value={order.experience_years} />
            <InfoRow label="آخر مسمى" value={order.last_job_title} />
            <InfoRow label="آخر جهة عمل" value={order.last_company} />
            <InfoRow label="المهارات" value={order.skills} />
            <InfoRow label="اللغات" value={(order.languages || []).join('، ')} />
            <InfoRow label="الوظيفة المستهدفة" value={order.target_job} />
            <InfoRow label="القطاع المستهدف" value={order.target_sector} />
          </Section>

          {(order.linkedin_url || order.additional_info) && (
            <Section title="معلومات إضافية" icon={User}>
              <InfoRow label="LinkedIn" value={order.linkedin_url} />
              <InfoRow label="ملاحظات" value={order.additional_info} />
            </Section>
          )}

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition"
            >
              <Copy size={14} />
              {copying ? 'تم النسخ ✓' : 'نسخ كل المعلومات'}
            </button>
            <button
              onClick={() => onSendApplications?.(order)}
              className="flex items-center gap-2 px-4 py-2 bg-[#006C35] text-white rounded-xl text-xs font-bold hover:bg-[#005528] transition-colors"
            >
              <Send size={14} />
              تقديم على ٢٠٠ شركة
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminOrders() {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [appModal, setAppModal] = useState({ open: false, client: null });

  useEffect(() => {
    supabase
      .from('client_intake')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setOrders(data);
        setLoading(false);
      });
  }, []);

  const handleStatusChange = (id, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
  };

  return (
    <DashboardLayout type="admin">
      <div className="mb-6 text-right" dir="rtl">
        <h1 className="text-2xl font-black text-gray-900">طلبات العملاء</h1>
        <p className="text-sm text-gray-500 mt-1">
          استمارات المعلومات المُرسَلة من العملاء
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 size={32} className="animate-spin text-[#006C35]" />
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center" dir="rtl">
          <p className="text-gray-400 text-sm font-bold mb-1">لا توجد طلبات بعد</p>
          <p className="text-xs text-gray-300">ستظهر هنا بمجرد إرسال العملاء للاستمارة</p>
        </div>
      ) : (
        <div className="space-y-4" dir="rtl">
          <p className="text-xs text-gray-400 font-bold">{orders.length} طلب</p>
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onStatusChange={handleStatusChange}
              onSendApplications={(client) => setAppModal({ open: true, client })}
            />
          ))}
        </div>
      )}
      <SendApplicationsModal
        isOpen={appModal.open}
        onClose={() => setAppModal({ open: false, client: null })}
        clientInfo={appModal.client}
      />
    </DashboardLayout>
  );
}
