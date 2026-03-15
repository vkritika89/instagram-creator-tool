import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Settings as SettingsIcon, User, LogOut, Crown, Save } from 'lucide-react';
import toast from 'react-hot-toast';

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
      toast.success('Signed out successfully');
      navigate('/login');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to sign out';
      toast.error(message);
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
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-slate-500" />
          Settings
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Manage your profile, preferences, and account.
        </p>
      </div>

      {/* Profile info */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 bg-gradient-to-br from-brand-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="font-semibold text-slate-900">{displayName}</h2>
            <p className="text-sm text-slate-500">{user?.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <User className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-medium text-slate-600">Creator Profile</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Niche</label>
            <input
              type="text"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Goal</label>
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white"
            >
              <option value="followers">Grow Followers</option>
              <option value="leads">Generate Leads</option>
              <option value="sales">Drive Sales</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">
              Posting Style
            </label>
            <select
              value={postingStyle}
              onChange={(e) => setPostingStyle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white"
            >
              <option value="reels">Reels-heavy</option>
              <option value="carousels">Carousels</option>
              <option value="mixed">Mixed</option>
              <option value="stories">Stories</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">
              Target Age Range
            </label>
            <select
              value={ageRange}
              onChange={(e) => setAgeRange(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white"
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
            <label className="block text-xs font-medium text-slate-500 mb-1">
              Target Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">
              Audience Interests
            </label>
            <input
              type="text"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
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

      {/* Plan */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-6">
        <h2 className="text-sm font-medium text-slate-600 mb-4 flex items-center gap-2">
          <Crown className="w-4 h-4 text-amber-500" />
          Plan & Billing
        </h2>
        <div className="flex items-center justify-between">
          <div>
            <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full">
              Free Plan
            </span>
            <p className="text-xs text-slate-400 mt-1.5">
              Unlimited AI generations during beta.
            </p>
          </div>
          <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity">
            Upgrade
          </button>
        </div>
      </div>

      {/* Account */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <h2 className="text-sm font-medium text-slate-600 mb-4">Account</h2>
        <div className="space-y-2">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
          <button
            onClick={async () => {
              await supabase.auth.signOut({ scope: 'global' });
              navigate('/login');
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign out everywhere
          </button>
        </div>
      </div>
    </div>
  );
}

