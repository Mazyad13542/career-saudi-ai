import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children, requirePremium = false, requireRole = null }) {
  const { session, profile, loading, isPremium } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50" dir="rtl">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-[3px] border-[#006C35] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400 font-bold">جاري التحميل…</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (requirePremium && !isPremium()) {
    return <Navigate to="/pricing" replace />;
  }

  if (requireRole) {
    const roles = Array.isArray(requireRole) ? requireRole : [requireRole];
    if (!roles.includes(profile?.role)) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
}
