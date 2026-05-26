import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';

const footerLinks = {
  'المنصة': [
    { label: 'بناء السيرة الذاتية',  href: '/dashboard/cv' },
    { label: 'المقابلة التجريبية',    href: '/dashboard/interview' },
    { label: 'تدريب الإنجليزية',      href: '/dashboard/english' },
    { label: 'مطابقة الوظائف',        href: '/dashboard/jobs-for-you' },
    { label: 'لوحة المسيرة المهنية',  href: '/dashboard/career-coach' },
  ],
  'الشركة': [
    { label: 'الصفحة الرئيسية', href: '/' },
    { label: 'الأسعار',          href: '/#pricing' },
    { label: 'تواصل معنا',       href: 'mailto:hello@qimma.sa' },
  ],
  'قانوني': [
    { label: 'سياسة الخصوصية', href: '/privacy' },
    { label: 'شروط الاستخدام', href: '/terms' },
  ],
};

const socialLinks = [
  { label: 'تويتر / X', icon: 'X' },
  { label: 'لينكدإن', icon: 'in' },
  { label: 'إنستغرام', icon: '📸' },
];

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400">
      {/* Top border glow */}
      <div className="h-px bg-gradient-to-l from-transparent via-[#006C35]/40 to-transparent" />

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">

          {/* Brand */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-5 w-fit">
              <div className="flex flex-col leading-none text-right">
                <span className="font-black text-white text-lg">قِمّة</span>
              </div>
              <div className="w-9 h-9 rounded-xl gradient-saudi flex items-center justify-center shadow-saudi">
                <span className="text-white font-black text-base">ق</span>
              </div>
            </Link>

            <p className="text-sm text-gray-500 leading-relaxed mb-5 max-w-xs">
              منصة سعودية لتطوير المسيرة المهنية — تساعدك على الوصول إلى فرص أفضل وبناء حضور مهني قوي في سوق العمل.
            </p>

            {/* Vision 2030 badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#006C35]/10 border border-[#006C35]/20 rounded-full mb-5">
              <span className="text-lg">🇸🇦</span>
              <span className="text-xs text-[#00A651] font-bold">مستوحى من رؤية 2030</span>
            </div>

            {/* Social */}
            <div className="flex items-center gap-2">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href="#"
                  title={s.label}
                  className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-[#006C35] flex items-center justify-center transition-all duration-200 text-xs font-bold text-gray-400 hover:text-white"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-xs font-bold text-gray-300 mb-4">{category}</h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-gray-500 hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact row */}
        <div className="mt-12 pt-8 border-t border-gray-800/60 flex flex-wrap gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-[#006C35]" />
            <span>الرياض، المملكة العربية السعودية</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail size={14} className="text-[#006C35]" />
            <span className="latin" dir="ltr">hello@qimma.sa</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone size={14} className="text-[#006C35]" />
            <span className="latin" dir="ltr">+966-XX-XXX-XXXX</span>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-600">
          <p>© 2025 قِمّة. جميع الحقوق محفوظة.</p>
          <p className="flex items-center gap-1">
            <span className="text-[#006C35]">❤️</span>
            صُنع بشغف للمواهب السعودية · رؤية 2030
          </p>
        </div>
      </div>
    </footer>
  );
}
