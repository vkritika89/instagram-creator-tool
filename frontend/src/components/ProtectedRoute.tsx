import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth();
  const location = useLocation();
  const [forceStop, setForceStop] = React.useState(false);

  // Force stop loading after 15 seconds as last resort
  React.useEffect(() => {
    if (loading) {
      const timeout = setTimeout(() => {
        console.warn('ProtectedRoute: Force stopping loading after 15 seconds');
        setForceStop(true);
      }, 15000);
      return () => clearTimeout(timeout);
    }
  }, [loading]);

  if (loading && !forceStop) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-brand-600 mx-auto mb-2" />
          <p className="text-sm text-slate-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user has no profile and not on onboarding page, redirect to onboarding
  if (!profile && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
}

