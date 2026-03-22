import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { apiGet, apiPost } from '../lib/api';
import { Settings as SettingsIcon, User, LogOut, Crown, Save, Loader2, ExternalLink, Zap, Film } from 'lucide-react';
import toast from 'react-hot-toast';

interface Subscription {
  plan: 'free' | 'basic' | 'plus';
  status: 'active' | 'inactive' | 'cancelled' | 'cancelling' | 'past_due';
  current_period_end: string | null;
}

export default function Settings() {
  const { user, profile, signOut, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const [niche, setNiche] = useState('');
  const [goal, setGoal] = useState('');
  const [postingStyle, setPostingStyle] = useState('');
  const [ageRange, setAgeRange] = useState('');
  const [location, setLocation] = useState('');
  const [interests, setInterests] = useState('');
  const [saving, setSaving] = useState(false);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [subLoading, setSubLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      setNiche(profile.niche || '');
      setGoal(profile.goal || '');
      setPostingStyle(profile.posting_style || '');
      setAgeRange(profile.target_audience?.age_range || '');
      setLocation(profile.target_audience?.location || '');
      setInterests(profile.target_audience?.interests || '');
    }
  }, [profile]);

  useEffect(() => {
    apiGet<Subscription>('/api/payments/subscription')
      .then(setSubscription)
      .catch(() => setSubscription({ plan: 'free', status: 'inactive', current_period_end: null }))
      .finally(() => setSubLoading(false));
  }, []);

  const handleOpenPortal = async () => {
    setPortalLoading(true);
    try {
      const data = await apiPost<{ url: string }>('/api/payments/portal', {});
      window.location.href = data.url;
    } catch {
      toast.error('Could not open billing portal. Please try again.');
    } finally {
      setPortalLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('creator_profiles')
        .update({
          niche,
          goal,
          posting_style: postingStyle,
          target_audience: { age_range: ageRange, location, interests },
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile.id);
      if (error) throw error;
      await refreshProfile();
      toast.success('Profile updated!');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update profile';
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to sign out';
      toast.error(message);
      navigate('/login');
    }
  };

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split('@')[0] ||
    'Creator';

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-slate-500" />
          Settings
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Manage your profile, preferences, and account.
        </p>
      </div>

      {/* Profile info */}
      <div className="bg-[#13131f] rounded-2xl border border-white/[0.07] p-6 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 bg-gradient-to-br from-brand-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-brand-500/30">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="font-semibold text-white">{displayName}</h2>
            <p className="text-sm text-slate-400">{user?.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <User className="w-4 h-4 text-slate-500" />
          <span className="text-sm font-medium text-slate-400">Creator Profile</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Niche</label>
            <input
              type="text"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-white/10 bg-[#1c1c2e] text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500/60 placeholder-slate-600"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Goal</label>
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-white/10 bg-[#1c1c2e] text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500/60"
            >
              <option value="followers">Grow Followers</option>
              <option value="leads">Generate Leads</option>
              <option value="sales">Drive Sales</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Posting Style
            </label>
            <select
              value={postingStyle}
              onChange={(e) => setPostingStyle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-white/10 bg-[#1c1c2e] text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500/60"
            >
              <option value="reels">Reels-heavy</option>
              <option value="carousels">Carousels</option>
              <option value="mixed">Mixed</option>
              <option value="stories">Stories</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Target Age Range
            </label>
            <select
              value={ageRange}
              onChange={(e) => setAgeRange(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-white/10 bg-[#1c1c2e] text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500/60"
            >
              <option value="">Select</option>
              <option value="18-24">18 – 24</option>
              <option value="25-34">25 – 34</option>
              <option value="35-44">35 – 44</option>
              <option value="45+">45+</option>
              <option value="all">All ages</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Target Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-white/10 bg-[#1c1c2e] text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500/60 placeholder-slate-600"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Audience Interests
            </label>
            <input
              type="text"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-white/10 bg-[#1c1c2e] text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500/60 placeholder-slate-600"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSaveProfile}
            disabled={saving}
            className="px-5 py-2 rounded-xl bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </div>

      {/* Plan & Billing */}
      <div className="bg-[#13131f] rounded-2xl border border-white/[0.07] p-6 mb-6">
        <h2 className="text-sm font-medium text-slate-400 mb-4 flex items-center gap-2">
          <Crown className="w-4 h-4 text-amber-400" />
          Plan &amp; Billing
        </h2>

        {subLoading ? (
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading subscription…
          </div>
        ) : subscription && subscription.plan !== 'free' && subscription.status === 'active' ? (
          /* ── Active paid plan ── */
          <div>
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${subscription.plan === 'plus' ? 'bg-brand-500/15 text-brand-300' : 'bg-white/10 text-slate-200'}`}>
                    <Crown className="w-3 h-3 text-amber-400" />
                    {subscription.plan === 'plus' ? 'Plus Plan' : 'Basic Plan'}
                  </span>
                  <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-bold uppercase tracking-wide">
                    Active
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="flex items-center gap-1 text-xs text-slate-500">
                    <Zap className="w-3 h-3 text-yellow-400" />
                    {subscription.plan === 'plus' ? '500' : '150'} credits/mo
                  </span>
                  <span className="flex items-center gap-1 text-xs text-slate-500">
                    <Film className="w-3 h-3 text-pink-400" />
                    {subscription.plan === 'plus' ? '120' : '20'} videos/mo
                  </span>
                </div>
                {subscription.current_period_end && (
                  <p className="text-xs text-slate-500 mt-1.5">
                    Renews {new Date(subscription.current_period_end).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                )}
              </div>
              <button
                onClick={handleOpenPortal}
                disabled={portalLoading}
                className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl border border-white/10 text-slate-300 text-sm font-semibold hover:bg-white/5 transition-colors disabled:opacity-50"
              >
                {portalLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ExternalLink className="w-3.5 h-3.5" />}
                {portalLoading ? 'Opening…' : 'Manage / Cancel'}
              </button>
            </div>
            <p className="text-xs text-slate-500">
              To cancel or update your payment method, click "Manage / Cancel" above.
            </p>
          </div>

        ) : subscription && subscription.plan !== 'free' && subscription.status === 'cancelling' ? (
          /* ── Cancelling — still active until period end ── */
          <div>
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${subscription.plan === 'plus' ? 'bg-brand-500/15 text-brand-300' : 'bg-white/10 text-slate-200'}`}>
                    <Crown className="w-3 h-3 text-amber-400" />
                    {subscription.plan === 'plus' ? 'Plus Plan' : 'Basic Plan'}
                  </span>
                  <span className="inline-block px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 text-[10px] font-bold uppercase tracking-wide">
                    Cancelling
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="flex items-center gap-1 text-xs text-slate-500">
                    <Zap className="w-3 h-3 text-yellow-400" />
                    {subscription.plan === 'plus' ? '500' : '150'} credits/mo
                  </span>
                  <span className="flex items-center gap-1 text-xs text-slate-500">
                    <Film className="w-3 h-3 text-pink-400" />
                    {subscription.plan === 'plus' ? '120' : '20'} videos/mo
                  </span>
                </div>
                {subscription.current_period_end && (
                  <p className="text-xs text-amber-400 mt-1.5 font-medium">
                    Access ends {new Date(subscription.current_period_end).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                )}
              </div>
              <button
                onClick={handleOpenPortal}
                disabled={portalLoading}
                className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 transition-colors disabled:opacity-50"
              >
                {portalLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ExternalLink className="w-3.5 h-3.5" />}
                {portalLoading ? 'Opening…' : 'Reactivate'}
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Your plan is cancelled but you still have full access until the date above.
            </p>
          </div>

        ) : subscription?.status === 'cancelled' ? (
          /* ── Cancelled ── */
          <div className="flex items-center justify-between">
            <div>
              <span className="inline-block px-3 py-1 bg-red-500/15 text-red-400 text-xs font-semibold rounded-full">Cancelled</span>
              <p className="text-xs text-slate-500 mt-1.5">Your plan has been cancelled.</p>
            </div>
            <a href="/pricing" className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-pink-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity">
              Resubscribe
            </a>
          </div>
        ) : subscription?.status === 'past_due' ? (
          /* ── Past due ── */
          <div className="flex items-center justify-between">
            <div>
              <span className="inline-block px-3 py-1 bg-amber-500/15 text-amber-400 text-xs font-semibold rounded-full">Payment past due</span>
              <p className="text-xs text-slate-500 mt-1.5">Please update your payment method.</p>
            </div>
            <button onClick={handleOpenPortal} disabled={portalLoading}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50">
              {portalLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ExternalLink className="w-3.5 h-3.5" />}
              Update Payment
            </button>
          </div>
        ) : (
          /* ── Free plan ── */
          <div className="flex items-center justify-between">
            <div>
              <span className="inline-block px-3 py-1 bg-white/8 text-slate-400 text-xs font-semibold rounded-full border border-white/10">Free Plan</span>
              <p className="text-xs text-slate-500 mt-1.5">Upgrade to unlock more credits and videos.</p>
            </div>
            <a href="/pricing" className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-pink-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity">
              Upgrade
            </a>
          </div>
        )}
      </div>

      {/* Account */}
      <div className="bg-[#13131f] rounded-2xl border border-white/[0.07] p-6">
        <h2 className="text-sm font-medium text-slate-400 mb-4">Account</h2>
        <div className="space-y-2">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
          <button
            onClick={async () => {
              await supabase.auth.signOut({ scope: 'global' });
              navigate('/login');
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-500 hover:bg-white/5 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign out everywhere
          </button>
        </div>
      </div>
    </div>
  );
}

