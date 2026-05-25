import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Sparkles } from 'lucide-react';
import Button from '../ui/Button';

const navLinks = [
  { label: 'المنصة', href: '#features' },
  { label: 'كيف تعمل', href: '#how-it-works' },
  { label: 'الأسعار', href: '#pricing' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled
        ? 'bg-white/92 backdrop-blur-2xl shadow-sm border-b border-gray-100'
        : 'bg-transparent'
    }`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-6">

          {/* CTA Buttons — right side in RTL becomes left visually */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">تسجيل الدخول</Button>
            </Link>
            <Link to="/register">
              <Button variant="primary" size="sm">
                <Sparkles size={14} />
                ابدأ مجاناً
              </Button>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              link.href.startsWith('#') ? (
                <a
                  key={link.label}
                  href={link.href}
                  className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-xl hover:bg-gray-50 transition-all duration-200"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.label}
                  to={link.href}
                  className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-xl hover:bg-gray-50 transition-all duration-200"
                >
                  {link.label}
                </Link>
              )
            ))}
          </div>

          {/* Logo — left side in RTL = end of flex row */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="flex flex-col leading-none text-right">
              <span className="font-black text-gray-900 text-base tracking-tight">قِمّة</span>
            </div>
            <div className="w-9 h-9 rounded-xl gradient-saudi flex items-center justify-center shadow-saudi flex-shrink-0">
              <span className="text-white font-black text-base">ق</span>
            </div>
          </Link>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-xl animate-slide-up">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              link.href.startsWith('#') ? (
                <a
                  key={link.label}
                  href={link.href}
                  className="block px-4 py-2.5 text-sm font-medium text-gray-700 rounded-xl hover:bg-gray-50 text-right"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.label}
                  to={link.href}
                  className="block px-4 py-2.5 text-sm font-medium text-gray-700 rounded-xl hover:bg-gray-50 text-right"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              )
            ))}
            <div className="pt-3 flex flex-col gap-2">
              <Link to="/login" onClick={() => setMobileOpen(false)}>
                <Button variant="secondary" size="md" className="w-full">تسجيل الدخول</Button>
              </Link>
              <Link to="/register" onClick={() => setMobileOpen(false)}>
                <Button variant="primary" size="md" className="w-full">
                  <Sparkles size={14} />
                  ابدأ مجاناً
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
