import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const nicheOptions = [
  'Fitness Coach',
  'SaaS Founder',
  'Designer',
  'Content Creator',
  'Life Coach',
  'Real Estate Agent',
  'E-commerce',
  'Personal Finance',
  'Travel',
  'Food & Recipe',
  'Beauty & Fashion',
  'Tech / Developer',
  'Other',
];

const goalOptions = [
  { value: 'followers', label: 'Grow Followers', emoji: '👥' },
  { value: 'leads', label: 'Generate Leads', emoji: '📩' },
  { value: 'sales', label: 'Drive Sales', emoji: '💰' },
];

const styleOptions = [
  { value: 'reels', label: 'Reels-heavy', emoji: '🎬' },
  { value: 'carousels', label: 'Carousels', emoji: '📸' },
  { value: 'mixed', label: 'Mixed', emoji: '🎨' },
  { value: 'stories', label: 'Stories', emoji: '📱' },
];

export default function Onboarding() {
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [niche, setNiche] = useState('');
  const [goal, setGoal] = useState('');
  const [postingStyle, setPostingStyle] = useState('');
  const [ageRange, setAgeRange] = useState('');
  const [location, setLocation] = useState('');
  const [interests, setInterests] = useState('');

  const handleSubmit = async () => {
    if (!niche || !goal || !postingStyle) {
      toast.error('Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.from('creator_profiles').insert({
        user_id: user!.id,
        niche,
        goal,
        posting_style: postingStyle,
        target_audience: {
          age_range: ageRange,
          location,
          interests,
        },
      });
      if (error) throw error;
      await refreshProfile();
      toast.success("Profile created! Let's grow 🚀");
      navigate('/dashboard');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save profile';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-900">CreatorCanvas</span>
          </div>
          <h2 className="text-xl font-semibold text-slate-800">Let's set up your creator profile</h2>
          <p className="text-slate-500 text-sm mt-1">This helps us personalize your content strategy.</p>
        </div>

        {/* Progress bar */}
        <div className="flex gap-2 mb-8">
          {[1, 2].map((s) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                s <= step ? 'bg-brand-500' : 'bg-slate-200'
              }`}
            />
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 p-8">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  What's your niche? *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {nicheOptions.map((n) => (
                    <button
                      key={n}
                      onClick={() => setNiche(n)}
                      className={`px-3 py-2.5 text-sm rounded-xl border transition-all ${
                        niche === n
                          ? 'border-brand-500 bg-brand-50 text-brand-700 font-medium'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  What's your main goal? *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {goalOptions.map((g) => (
                    <button
                      key={g.value}
                      onClick={() => setGoal(g.value)}
                      className={`px-3 py-4 text-sm rounded-xl border transition-all flex flex-col items-center gap-2 ${
                        goal === g.value
                          ? 'border-brand-500 bg-brand-50 text-brand-700 font-medium'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-xl">{g.emoji}</span>
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Posting style preference? *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {styleOptions.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => setPostingStyle(s.value)}
                      className={`px-3 py-3 text-sm rounded-xl border transition-all flex items-center gap-2 ${
                        postingStyle === s.value
                          ? 'border-brand-500 bg-brand-50 text-brand-700 font-medium'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <span>{s.emoji}</span>
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  if (!niche || !goal || !postingStyle) {
                    toast.error('Please select niche, goal, and posting style');
                    return;
                  }
                  setStep(2);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-pink-500 text-white font-semibold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                Next <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Target audience age range
                </label>
                <select
                  value={ageRange}
                  onChange={(e) => setAgeRange(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white"
                >
                  <option value="">Select age range</option>
                  <option value="18-24">18 – 24</option>
                  <option value="25-34">25 – 34</option>
                  <option value="35-44">35 – 44</option>
                  <option value="45+">45+</option>
                  <option value="all">All ages</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Target location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., USA, India, Global"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Audience interests
                </label>
                <input
                  type="text"
                  value={interests}
                  onChange={(e) => setInterests(e.target.value)}
                  placeholder="e.g., health, startups, fashion"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium text-sm hover:bg-slate-50 transition-colors flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-pink-500 text-white font-semibold text-sm hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2"
                >
                  {loading ? 'Saving…' : 'Complete Setup'} <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

