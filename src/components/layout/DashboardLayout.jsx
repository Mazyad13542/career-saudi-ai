import { useState, useRef, useEffect } from 'react';
import { Bell, Search, ChevronDown, Crown, LogOut, Settings, User, Menu } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardSidebar from './DashboardSidebar';
import { useAuth } from '../../context/AuthContext';

export default function DashboardLayout({ children, type = 'candidate' }) {
  const { profile, isPremium, getAvatarUrl, signOut } = useAuth();
  const navigate = useNavigate();
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [collapsed,  setCollapsed]  = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef(null);

  const displayName = profile?.full_name || 'المستخدم';
  const planLabel   = isPremium() ? 'احترافي' : 'مجاني';
  const planIcon    = isPremium() ? <Crown size={10} className="text-[#C8A951]" /> : null;
  const planClass   = isPremium()
    ? 'bg-[#C8A951]/15 text-amber-700 border-[#C8A951]/30'
    : 'bg-[#006C35]/10 text-[#006C35] border-[#006C35]/20';

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close mobile sidebar on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const sidebarWidth = collapsed ? 'lg:mr-16' : 'lg:mr-62';

  return (
    <div className="flex h-screen bg-gray-50/60 overflow-hidden" dir="rtl">

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar — hidden on mobile unless mobileOpen */}
      <div className={`${mobileOpen ? 'block' : 'hidden'} lg:block`}>
        <DashboardSidebar
          type={type}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((c) => !c)}
          onClose={() => setMobileOpen(false)}
        />
      </div>

      {/* Main area — shifts on desktop based on sidebar width */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${sidebarWidth}`}>

        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 sm:px-6 flex-shrink-0 shadow-sm gap-3">

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden w-9 h-9 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors flex-shrink-0"
            aria-label="القائمة"
          >
            <Menu size={18} className="text-gray-600" />
          </button>

          {/* Search */}
          <div className="flex-1 max-w-xs hidden sm:block">
            <div className="relative">
              <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                placeholder="ابحث عن وظيفة أو مهارة..."
                className="w-full pr-9 pl-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006C35]/20 focus:border-[#006C35] text-right"
              />
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Plan badge */}
            <span className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full border ${planClass}`}>
              {planIcon}
              {planLabel}
            </span>

            {/* Notification */}
            <button className="relative w-9 h-9 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors">
              <Bell size={16} className="text-gray-500" />
            </button>

            {/* User menu */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100"
              >
                <ChevronDown size={12} className="text-gray-400 hidden sm:block" />
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-xs font-black text-gray-900 leading-none">
                    {displayName.split(' ')[0]}
                  </span>
                  <span className="text-[10px] text-gray-400 leading-none mt-0.5">
                    {planLabel}
                  </span>
                </div>
                <img
                  src={getAvatarUrl()}
                  alt={displayName}
                  className="w-7 h-7 rounded-lg object-cover"
                />
              </button>

              {menuOpen && (
                <div className="absolute left-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-50">
                    <p className="text-xs font-black text-gray-900 truncate">{displayName}</p>
                    <p className="text-[11px] text-gray-400 truncate">{profile?.email}</p>
                  </div>
                  <div className="p-1">
                    <Link
                      to="/dashboard/settings"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors flex-row-reverse"
                    >
                      <Settings size={14} className="text-gray-400" />
                      الإعدادات
                    </Link>
                    <Link
                      to="/dashboard/profile"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors flex-row-reverse"
                    >
                      <User size={14} className="text-gray-400" />
                      الملف المهني
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-colors flex-row-reverse"
                    >
                      <LogOut size={14} />
                      تسجيل الخروج
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="p-4 sm:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
