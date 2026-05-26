import { useState, useRef, useEffect } from 'react';
import { Bell, X, Check, Briefcase, MessageSquare, CreditCard, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNotifications } from '../../hooks/useNotifications';
import { cn } from '../../utils/helpers';

const TYPE_ICON = {
  job_match:          <Briefcase size={14} className="text-[#006C35]" />,
  application_update: <Check size={14} className="text-blue-500" />,
  new_message:        <MessageSquare size={14} className="text-purple-500" />,
  payment:            <CreditCard size={14} className="text-amber-500" />,
  system:             <Info size={14} className="text-gray-500" />,
};

export default function NotificationBell() {
  const { notifications, unreadCount, loading, markRead, markAllRead, deleteNotification } = useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative w-9 h-9 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors"
      >
        <Bell size={18} className="text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-[9px] font-black text-white flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute top-11 left-0 w-80 bg-white rounded-2xl border border-gray-100 shadow-xl z-50 overflow-hidden" dir="rtl">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <button
              onClick={markAllRead}
              className="text-xs text-[#006C35] font-bold hover:underline"
            >
              تحديد الكل كمقروء
            </button>
            <h3 className="font-black text-gray-900 text-sm">الإشعارات</h3>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="py-8 text-center text-gray-400 text-sm">جارٍ التحميل…</div>
            ) : notifications.length === 0 ? (
              <div className="py-10 text-center">
                <Bell size={28} className="mx-auto text-gray-200 mb-2" />
                <p className="text-sm text-gray-400">لا توجد إشعارات</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={cn(
                    'flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-none cursor-pointer',
                    !n.is_read && 'bg-[#006C35]/5'
                  )}
                  onClick={() => { markRead(n.id); setOpen(false); }}
                >
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteNotification(n.id); }}
                    className="flex-shrink-0 mt-0.5 p-1 rounded-lg hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={11} />
                  </button>
                  <div className="flex-1 min-w-0 text-right">
                    <div className="flex items-center justify-end gap-2 mb-0.5">
                      <p className="text-xs font-black text-gray-900 truncate">{n.title}</p>
                      {TYPE_ICON[n.type] || TYPE_ICON.system}
                    </div>
                    {n.body && <p className="text-[11px] text-gray-500 leading-relaxed">{n.body}</p>}
                    <p className="text-[10px] text-gray-400 mt-1">
                      {new Date(n.created_at).toLocaleDateString('ar-SA')}
                    </p>
                  </div>
                  {!n.is_read && (
                    <div className="w-2 h-2 rounded-full bg-[#006C35] flex-shrink-0 mt-1.5" />
                  )}
                </div>
              ))
            )}
          </div>

          <div className="p-3 border-t border-gray-100">
            <Link
              to="/dashboard"
              onClick={() => setOpen(false)}
              className="block text-center text-xs text-[#006C35] font-bold hover:underline"
            >
              الصفحة الرئيسية
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
