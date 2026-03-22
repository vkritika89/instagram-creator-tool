import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiGet } from '../lib/api';
import {
  LayoutDashboard,
  CalendarDays,
  Film,
  MessageSquareText,
  Settings,
  LogOut,
  Menu,
  X,
  Sparkles,
  Crown,
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/dashboard/calendar', icon: CalendarDays, label: 'My Calendar' },
  { to: '/dashboard/reel-scripts', icon: Film, label: 'Reel Scripts' },
  { to: '/dashboard/captions', icon: MessageSquareText, label: 'Video Generation & Caption' },
  { to: '/dashboard/settings', icon: Settings, label: 'Settings' },
];

export default function DashboardLayout() {
  const { user, profile, demoMode, signOut } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [planName, setPlanName] = useState<string | null>(null);

  useEffect(() => {
    apiGet<{ plan: string; status: string }>('/api/payments/subscription')
      .then(data => {
        if (data.plan !== 'free' && data.status === 'active') {
          setPlanName(data.plan === 'plus' ? 'Plus' : 'Basic');
        }
      })
      .catch(() => {});
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (err: unknown) {
      console.error('Signout error:', err);
      navigate('/login');
    }
  };

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split('@')[0] ||
    'Creator';

  const avatarLetter = displayName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-[#09090f] flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[260px] bg-[#0f0f1b] border-r border-white/[0.07] transform transition-transform duration-300 ease-out md:translate-x-0 md:static md:z-auto flex flex-col ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 py-5 border-b border-white/[0.07]">
          <div className="w-9 h-9 bg-gradient-to-br from-brand-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/30">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="text-base font-bold text-white leading-none">CreatorCanvas</span>
            {demoMode && (
              <span className="block text-[9px] text-amber-400 font-semibold uppercase tracking-wider">Demo Mode</span>
            )}
          </div>
          <button
            className="ml-auto md:hidden text-slate-500 hover:text-slate-300"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all ${
                  isActive
                    ? 'bg-brand-500/10 text-brand-300 border border-brand-500/20'
                    : 'text-slate-500 hover:bg-white/5 hover:text-slate-200'
                }`
              }
            >
              <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User + Logout */}
        <div className="px-3 pb-4 pt-2">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition-all w-full"
          >
            <LogOut className="w-[18px] h-[18px]" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-[#09090f]/80 backdrop-blur-xl border-b border-white/[0.07] px-4 md:px-6 py-3">
          <div className="flex items-center justify-between">
            <button
              className="md:hidden text-slate-500 hover:text-slate-300 p-1"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="hidden md:flex items-center gap-2">
              {profile?.niche && (
                <span className="text-xs bg-brand-500/10 border border-brand-500/20 text-brand-400 px-3 py-1 rounded-full font-semibold">
                  {profile.niche}
                </span>
              )}
              {profile?.goal && (
                <span className="text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full font-semibold capitalize">
                  Goal: {profile.goal}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Upgrade / Plan badge */}
              {planName ? (
                <NavLink
                  to="/dashboard/settings"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-brand-600 to-pink-500 text-white text-xs font-bold shadow-md shadow-brand-500/30 hover:opacity-90 transition-opacity"
                >
                  <Crown className="w-3.5 h-3.5 text-yellow-300" />
                  {planName} Plan
                </NavLink>
              ) : (
                <NavLink
                  to="/pricing"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-brand-600 to-pink-500 text-white text-xs font-bold shadow-md shadow-brand-500/30 hover:opacity-90 transition-opacity"
                >
                  <Crown className="w-3.5 h-3.5 text-yellow-300" /> Upgrade to Pro
                </NavLink>
              )}

              {/* User info + avatar */}
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-white leading-tight">{displayName}</p>
                <p className="text-[10px] text-slate-500">
                  {demoMode ? 'Demo account' : planName ? `${planName} plan` : 'Free plan'}
                </p>
              </div>
              <div className="w-9 h-9 bg-gradient-to-br from-brand-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-brand-500/30 ring-2 ring-white/10">
                {avatarLetter}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
