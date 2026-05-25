import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FileText, Mic, Briefcase, Star,
  ClipboardList, MessageSquare, Globe, Settings, LogOut,
  ChevronRight, ChevronLeft, Crown, UserCircle, Sparkles,
  Users, BarChart2, BookmarkCheck, Shield,
} from 'lucide-react';
import { cn } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';

const CANDIDATE_NAV = [
  { icon: LayoutDashboard, label: 'نظرة عامة',           href: '/dashboard' },
  { icon: FileText,        label: 'سيرتي الذاتية',       href: '/dashboard/cv' },
  { icon: UserCircle,      label: 'ملفي المهني',          href: '/dashboard/profile' },
  { icon: Mic,             label: 'المقابلة التجريبية',   href: '/dashboard/interview' },
  { icon: Briefcase,       label: 'الوظائف الحديثة',     href: '/dashboard/jobs' },
  { icon: Star,            label: 'الوظائف المناسبة لي', href: '/dashboard/jobs-for-you' },
  { icon: ClipboardList,   label: 'متابعة التقديمات',    href: '/dashboard/applications' },
  { icon: MessageSquare,   label: 'ردود الشركات',        href: '/dashboard/replies' },
  { icon: Globe,           label: 'موقعي الشخصي',        href: '/dashboard/portfolio' },
  { icon: Settings,        label: 'الإعدادات',            href: '/dashboard/settings' },
];

const HR_NAV = [
  { icon: LayoutDashboard, label: 'نظرة عامة',           href: '/hr-dashboard' },
  { icon: Briefcase,       label: 'وظائفي',               href: '/hr-dashboard/jobs' },
  { icon: Users,           label: 'المتقدمون',            href: '/hr-dashboard/candidates' },
  { icon: MessageSquare,   label: 'الرسائل',              href: '/hr-dashboard/messages' },
  { icon: BarChart2,       label: 'التحليلات',            href: '/hr-dashboard/analytics' },
  { icon: BookmarkCheck,   label: 'المرشحون المختارون',   href: '/hr-dashboard/saved' },
];

const ADMIN_NAV = [
  { icon: LayoutDashboard, label: 'نظرة عامة',           href: '/admin' },
  { icon: Users,           label: 'المستخدمون',          href: '/admin/users' },
  { icon: Briefcase,       label: 'الوظائف',             href: '/admin/jobs' },
  { icon: LayoutDashboard, label: 'لوحة المرشحين',       href: '/dashboard' },
];

export default function DashboardSidebar({ type = 'candidate', collapsed, onToggleCollapse, onClose }) {
  const location = useLocation();
  const navigate  = useNavigate();
  const { signOut, isPremium, profile } = useAuth();

  const premium = isPremium();
  const role    = profile?.role ?? 'candidate';

  let navItems;
  if (type === 'admin' || role === 'admin') {
    navItems = ADMIN_NAV;
  } else if (type === 'hr' || role === 'hr') {
    navItems = HR_NAV;
  } else {
    navItems = CANDIDATE_NAV;
  }

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const canSwitchDashboards = role === 'admin' || role === 'hr';
  const currentType = type === 'admin' || (role === 'admin' && !type) ? 'admin'
    : type === 'hr' || (role === 'hr' && !type) ? 'hr'
    : 'candidate';

  const handleNavClick = () => {
    if (onClose) onClose();
  };

  return (
    <aside className={cn(
      'fixed top-0 right-0 h-screen bg-white border-l border-gray-100 z-40',
      'flex flex-col transition-all duration-300',
      'shadow-[-4px_0_24px_rgba(0,0,0,0.04)]',
      collapsed ? 'w-16' : 'w-62'
    )}>
      {/* Logo */}
      <div className={cn(
        'flex items-center h-16 px-4 border-b border-gray-100',
        collapsed ? 'justify-center' : 'gap-2.5'
      )}>
        <div className="w-9 h-9 rounded-xl gradient-saudi flex items-center justify-center flex-shrink-0 shadow-saudi">
          <span className="text-white font-black text-base">ق</span>
        </div>
        {!collapsed && (
          <div className="flex flex-col leading-none">
            <span className="font-black text-gray-900 text-base">قِمّة</span>
            {currentType === 'hr' && <span className="text-[10px] text-[#006C35] font-bold">HR</span>}
            {currentType === 'admin' && <span className="text-[10px] text-red-500 font-bold">Admin</span>}
          </div>
        )}
        {/* Mobile close button */}
        {onClose && !collapsed && (
          <button
            onClick={onClose}
            className="mr-auto p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 lg:hidden"
          >
            <ChevronRight size={16} />
          </button>
        )}
      </div>

      {/* Dashboard switcher for HR/admin */}
      {canSwitchDashboards && !collapsed && (
        <div className="px-3 pt-3 pb-1">
          <div className="flex rounded-xl border border-gray-100 overflow-hidden text-[10px] font-black">
            <Link
              to="/dashboard"
              onClick={handleNavClick}
              className={cn(
                'flex-1 text-center py-1.5 transition-colors',
                currentType === 'candidate' ? 'bg-[#006C35] text-white' : 'text-gray-400 hover:bg-gray-50'
              )}
            >
              مرشح
            </Link>
            {(role === 'hr' || role === 'admin') && (
              <Link
                to="/hr-dashboard"
                onClick={handleNavClick}
                className={cn(
                  'flex-1 text-center py-1.5 transition-colors',
                  currentType === 'hr' ? 'bg-[#006C35] text-white' : 'text-gray-400 hover:bg-gray-50'
                )}
              >
                HR
              </Link>
            )}
            {role === 'admin' && (
              <Link
                to="/admin"
                onClick={handleNavClick}
                className={cn(
                  'flex-1 text-center py-1.5 transition-colors',
                  currentType === 'admin' ? 'bg-red-500 text-white' : 'text-gray-400 hover:bg-gray-50'
                )}
              >
                إدارة
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto scrollbar-thin">
        {navItems.map((item) => {
          const active = location.pathname === item.href
            || (item.href !== '/dashboard' && item.href !== '/admin' && item.href !== '/hr-dashboard'
                && location.pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={handleNavClick}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 group relative',
                active
                  ? 'bg-[#006C35]/10 text-[#006C35] sidebar-active'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                collapsed && 'justify-center'
              )}
            >
              <item.icon size={18} className="flex-shrink-0" />
              {!collapsed && <span className="flex-1">{item.label}</span>}
              {collapsed && (
                <div className="absolute right-full mr-2 px-2.5 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg z-50">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Plan Banner (candidate only) */}
      {!collapsed && currentType === 'candidate' && (
        premium ? (
          <div className="mx-3 mb-3 p-3 rounded-xl bg-gradient-to-l from-[#C8A951]/15 to-[#C8A951]/5 border border-[#C8A951]/30">
            <div className="flex items-center gap-2">
              <Crown size={13} className="text-[#C8A951]" />
              <span className="text-[10px] font-black text-[#C8A951]">الخطة الاحترافية ✓</span>
            </div>
            <p className="text-[10px] text-gray-500 mt-1">جميع الميزات مفعّلة</p>
          </div>
        ) : (
          <div className="mx-3 mb-3 p-3 rounded-xl bg-gradient-to-l from-[#006C35]/8 to-[#C8A951]/8 border border-[#006C35]/10">
            <div className="flex items-center gap-2 mb-1">
              <Crown size={13} className="text-[#C8A951]" />
              <span className="text-[10px] font-black text-[#C8A951]">الخطة المجانية</span>
            </div>
            <p className="text-[10px] text-gray-500 leading-relaxed mb-2">ارقَ إلى الاحترافية لفتح كل الميزات</p>
            <Link to="/#pricing" onClick={handleNavClick} className="flex items-center gap-1 text-[10px] font-black text-[#006C35] hover:underline">
              <Sparkles size={9} />
              عرض الخطط
            </Link>
          </div>
        )
      )}

      {/* Admin badge */}
      {!collapsed && currentType === 'admin' && (
        <div className="mx-3 mb-3 p-3 rounded-xl bg-red-50 border border-red-100">
          <div className="flex items-center gap-2">
            <Shield size={13} className="text-red-500" />
            <span className="text-[10px] font-black text-red-500">صلاحيات المدير</span>
          </div>
        </div>
      )}

      {/* Bottom */}
      <div className="px-2 py-3 border-t border-gray-100 space-y-0.5">
        <button
          onClick={handleSignOut}
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all duration-200 w-full',
            collapsed && 'justify-center'
          )}
        >
          <LogOut size={18} />
          {!collapsed && <span>تسجيل الخروج</span>}
        </button>
      </div>

      {/* Collapse toggle (desktop only) */}
      {onToggleCollapse && (
        <button
          onClick={onToggleCollapse}
          className="absolute -left-3 top-20 w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm hover:shadow-md transition-all text-gray-400 hover:text-gray-800 z-50 hidden lg:flex"
        >
          {collapsed ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
        </button>
      )}
    </aside>
  );
}
