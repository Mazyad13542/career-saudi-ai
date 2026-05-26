import { Link } from 'react-router-dom';
import { Home, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#006C35]/5 via-white to-[#C8A951]/5 flex items-center justify-center p-4" dir="rtl">
      <div className="text-center max-w-md">
        <div className="text-8xl font-black text-[#006C35]/20 mb-4 leading-none">٤٠٤</div>
        <h1 className="text-2xl font-black text-gray-900 mb-2">الصفحة غير موجودة</h1>
        <p className="text-gray-500 text-sm mb-8 leading-relaxed">
          يبدو أن الرابط الذي اتبعته غير صحيح أو أن الصفحة قد نُقلت أو حُذفت.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#006C35] text-white text-sm font-bold rounded-xl hover:bg-[#005a2b] transition-colors"
          >
            <Home size={15} />
            الصفحة الرئيسية
          </Link>
          <Link
            to="/dashboard"
            className="flex items-center justify-center gap-2 px-5 py-2.5 border border-gray-200 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-50 transition-colors"
          >
            لوحة التحكم
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
}
