import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';
import SessionWarning from './components/SessionWarning';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PaymentSuccess from './pages/PaymentSuccess';
import Pricing from './pages/Pricing';
import Onboarding from './pages/Onboarding';
import DashboardHome from './pages/DashboardHome';
import ContentCalendar from './pages/ContentCalendar';
import ReelScripts from './pages/ReelScripts';
import CaptionsHashtags from './pages/CaptionsHashtags';
import Settings from './pages/Settings';
import { Loader2 } from 'lucide-react';

function RootRedirect() {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
      </div>
    );
  }

  // Not logged in → landing page
  if (!user) return <LandingPage />;

  // Logged in but no profile yet → onboarding
  if (!profile) return <Navigate to="/onboarding" replace />;

  // Logged in with profile → dashboard
  return <Navigate to="/dashboard" replace />;
}

export default function App() {
  return (
    <>
      <SessionWarning />
      <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/payment-success" element={<PaymentSuccess />} />
      <Route path="/payment-cancel" element={<Navigate to="/pricing" replace />} />
      <Route path="/pricing" element={<Pricing />} />

      {/* Onboarding (requires auth but no profile yet) */}
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
        }
      />

      {/* Protected dashboard routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardHome />} />
        <Route path="calendar" element={<ContentCalendar />} />
        <Route path="reel-scripts" element={<ReelScripts />} />
        <Route path="captions" element={<CaptionsHashtags />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Smart root redirect */}
      <Route path="/" element={<RootRedirect />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </>
  );
}

