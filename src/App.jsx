import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { supabase } from './lib/supabase';

const AUTH_PUBLIC_PATHS = ['/', '/login', '/register'];

function AuthRedirect() {
  const navigate = useNavigate();
  const locationRef = useRef(window.location.pathname);

  useEffect(() => {
    locationRef.current = window.location.pathname;
  });

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        if (AUTH_PUBLIC_PATHS.includes(locationRef.current)) {
          navigate('/dashboard', { replace: true });
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  return null;
}

// Public pages
import LandingPage from './pages/LandingPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import PaymentSuccess from './pages/payment/PaymentSuccess';
import NotFound from './pages/NotFound';
import Terms from './pages/legal/Terms';
import Privacy from './pages/legal/Privacy';
import Onboarding from './pages/Onboarding';

// Candidate Dashboard
import Overview from './pages/candidate/Overview';
import Broadcast from './pages/candidate/Broadcast';
import MyCV from './pages/candidate/MyCV';
import ProfessionalProfile from './pages/candidate/ProfessionalProfile';
import AIInterview from './pages/candidate/AIInterview';
import EnglishPractice from './pages/candidate/EnglishPractice';
import AICareerCoach from './pages/candidate/AICareerCoach';
import AllJobs from './pages/candidate/AllJobs';
import JobsForYou from './pages/candidate/JobsForYou';
import MyApplications from './pages/candidate/MyApplications';
import CompanyReplies from './pages/candidate/CompanyReplies';
import Portfolio from './pages/candidate/Portfolio';
import Settings from './pages/candidate/Settings';
import Subscription from './pages/candidate/Subscription';

// HR Dashboard
import HROverview from './pages/hr/HROverview';
import JobPosts from './pages/hr/JobPosts';
import Candidates from './pages/hr/Candidates';
import HRMessages from './pages/hr/HRMessages';
import HRAnalytics from './pages/hr/HRAnalytics';
import SavedCandidates from './pages/hr/SavedCandidates';

// Admin
import AdminOverview from './pages/admin/AdminOverview';
import AdminUsers from './pages/admin/AdminUsers';
import AdminJobs from './pages/admin/AdminJobs';
import AdminOrders from './pages/admin/AdminOrders';

// Client
import IntakeForm from './pages/client/IntakeForm';

function PrivateRoute({ children, requirePremium, requireRole }) {
  return (
    <ProtectedRoute requirePremium={requirePremium} requireRole={requireRole}>
      {children}
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AuthRedirect />
        <Routes>
          {/* ── Public ── */}
          <Route path="/"         element={<LandingPage />} />
          <Route path="/login"    element={<Login />} />
          <Route path="/register"        element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password"  element={<ResetPassword />} />
          <Route path="/terms"       element={<Terms />} />
          <Route path="/privacy"     element={<Privacy />} />
          <Route path="/onboarding"  element={<PrivateRoute><Onboarding /></PrivateRoute>} />

          {/* ── Payment (requires auth) ── */}
          <Route path="/payment-success" element={<PrivateRoute><PaymentSuccess /></PrivateRoute>} />

          {/* ── Candidate Dashboard (requires auth) ── */}
          <Route path="/dashboard"              element={<PrivateRoute><Overview /></PrivateRoute>} />
          <Route path="/dashboard/broadcast"    element={<PrivateRoute><Broadcast /></PrivateRoute>} />
          <Route path="/dashboard/cv"           element={<PrivateRoute><MyCV /></PrivateRoute>} />
          <Route path="/dashboard/profile"      element={<PrivateRoute><ProfessionalProfile /></PrivateRoute>} />
          <Route path="/dashboard/interview"      element={<PrivateRoute><AIInterview /></PrivateRoute>} />
          <Route path="/dashboard/english"       element={<PrivateRoute><EnglishPractice /></PrivateRoute>} />
          <Route path="/dashboard/career-coach"  element={<PrivateRoute><AICareerCoach /></PrivateRoute>} />
          <Route path="/dashboard/jobs"          element={<PrivateRoute><AllJobs /></PrivateRoute>} />
          <Route path="/dashboard/jobs-for-you" element={<PrivateRoute><JobsForYou /></PrivateRoute>} />
          <Route path="/dashboard/applications" element={<PrivateRoute><MyApplications /></PrivateRoute>} />
          <Route path="/dashboard/replies"      element={<PrivateRoute><CompanyReplies /></PrivateRoute>} />
          <Route path="/dashboard/portfolio"    element={<PrivateRoute><Portfolio /></PrivateRoute>} />
          <Route path="/dashboard/settings"      element={<PrivateRoute><Settings /></PrivateRoute>} />
          <Route path="/dashboard/subscription" element={<PrivateRoute><Subscription /></PrivateRoute>} />

          {/* ── HR Dashboard (requires hr or admin role) ── */}
          <Route path="/hr-dashboard"            element={<PrivateRoute requireRole={['hr','admin']}><HROverview /></PrivateRoute>} />
          <Route path="/hr-dashboard/jobs"       element={<PrivateRoute requireRole={['hr','admin']}><JobPosts /></PrivateRoute>} />
          <Route path="/hr-dashboard/candidates" element={<PrivateRoute requireRole={['hr','admin']}><Candidates /></PrivateRoute>} />
          <Route path="/hr-dashboard/messages"   element={<PrivateRoute requireRole={['hr','admin']}><HRMessages /></PrivateRoute>} />
          <Route path="/hr-dashboard/analytics"  element={<PrivateRoute requireRole={['hr','admin']}><HRAnalytics /></PrivateRoute>} />
          <Route path="/hr-dashboard/saved"      element={<PrivateRoute requireRole={['hr','admin']}><SavedCandidates /></PrivateRoute>} />

          {/* ── Intake Form (requires auth) ── */}
          <Route path="/dashboard/intake" element={<PrivateRoute><IntakeForm /></PrivateRoute>} />

          {/* ── Admin (requires admin role) ── */}
          <Route path="/admin"          element={<PrivateRoute requireRole="admin"><AdminOverview /></PrivateRoute>} />
          <Route path="/admin/users"    element={<PrivateRoute requireRole="admin"><AdminUsers /></PrivateRoute>} />
          <Route path="/admin/jobs"     element={<PrivateRoute requireRole="admin"><AdminJobs /></PrivateRoute>} />
          <Route path="/admin/orders"   element={<PrivateRoute requireRole="admin"><AdminOrders /></PrivateRoute>} />

          {/* ── Shortcuts & catch-all ── */}
          <Route path="/pricing" element={<Navigate to="/#pricing" replace />} />
          <Route path="*"        element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
