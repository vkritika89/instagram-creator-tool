import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Onboarding from './pages/Onboarding';
import DashboardHome from './pages/DashboardHome';
import WeeklyPlan from './pages/WeeklyPlan';
import ReelScripts from './pages/ReelScripts';
import CaptionsHashtags from './pages/CaptionsHashtags';
import Settings from './pages/Settings';

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

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
        <Route path="weekly-plan" element={<WeeklyPlan />} />
        <Route path="reel-scripts" element={<ReelScripts />} />
        <Route path="captions" element={<CaptionsHashtags />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Redirect root to dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

