import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
  { to: '/dashboard/weekly-plan', icon: CalendarDays, label: 'Weekly Plan' },
  { to: '/dashboard/reel-scripts', icon: Film, label: 'Reel Scripts' },
  { to: '/dashboard/captions', icon: MessageSquareText, label: 'Video Generation & Caption' },
  { to: '/dashboard/settings', icon: Settings, label: 'Settings' },
];

export default function DashboardLayout() {
  const { user, profile, demoMode, signOut } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split('@')[0] ||
    'Creator';

  const avatarLetter = displayName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[260px] bg-white border-r border-slate-100 transform transition-transform duration-300 ease-out md:translate-x-0 md:static md:z-auto flex flex-col ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 py-5 border-b border-slate-100">
          <div className="w-9 h-9 bg-gradient-to-br from-brand-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/20">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="text-base font-bold text-slate-900 leading-none">CreatorCanvas</span>
            {demoMode && (
              <span className="block text-[9px] text-amber-600 font-semibold uppercase tracking-wider">Demo Mode</span>
            )}
          </div>
          <button
            className="ml-auto md:hidden text-slate-400 hover:text-slate-600"
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
                    ? 'bg-gradient-to-r from-brand-50 to-pink-50 text-brand-700 shadow-sm'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`
              }
            >
              <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Upgrade card */}
        <div className="px-3 pb-2">
          <div className="bg-gradient-to-br from-brand-600 to-pink-500 rounded-2xl p-4 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <Crown className="w-5 h-5 text-yellow-300 mb-2" />
            <p className="text-xs font-bold mb-1">Upgrade to Pro</p>
            <p className="text-[10px] text-white/70 leading-relaxed mb-3">
              Unlimited AI generations, priority support, and more.
            </p>
            <button className="w-full py-1.5 bg-white text-brand-700 rounded-lg text-[11px] font-bold hover:bg-white/90 transition-colors">
              Upgrade
            </button>
          </div>
        </div>

        {/* User + Logout */}
        <div className="px-3 pb-4 pt-2">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all w-full"
          >
            <LogOut className="w-[18px] h-[18px]" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white/70 backdrop-blur-xl border-b border-slate-100 px-4 md:px-6 py-3">
          <div className="flex items-center justify-between">
            <button
              className="md:hidden text-slate-500 hover:text-slate-700 p-1"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="hidden md:flex items-center gap-2">
              {profile?.niche && (
                <span className="text-xs bg-brand-50 text-brand-600 px-3 py-1 rounded-full font-semibold">
                  {profile.niche}
                </span>
              )}
              {profile?.goal && (
                <span className="text-xs bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full font-semibold capitalize">
                  Goal: {profile.goal}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-slate-800 leading-tight">{displayName}</p>
                <p className="text-[10px] text-slate-400">{demoMode ? 'Demo account' : 'Free plan'}</p>
              </div>
              <div className="w-9 h-9 bg-gradient-to-br from-brand-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-brand-500/20 ring-2 ring-white">
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
