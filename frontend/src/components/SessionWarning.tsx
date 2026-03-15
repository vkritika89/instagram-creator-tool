import { useAuth } from '../context/AuthContext';
import { AlertTriangle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SessionWarning() {
  const { sessionWarning, timeRemaining, extendSession, signOut } = useAuth();
  const navigate = useNavigate();

  if (!sessionWarning) return null;

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-6 h-6 text-amber-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Session Expiring Soon
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              Your session will expire in <span className="font-bold text-amber-600">{timeString}</span> due to inactivity.
              Click "Stay Logged In" to continue.
            </p>
            <div className="flex gap-3">
              <button
                onClick={extendSession}
                className="flex-1 px-4 py-2.5 bg-brand-600 text-white rounded-xl font-semibold text-sm hover:bg-brand-700 transition-colors"
              >
                Stay Logged In
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-semibold text-sm hover:bg-slate-50 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

