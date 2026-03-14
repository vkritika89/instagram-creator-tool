import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Play,
  Zap,
  TrendingUp,
  Film,
  Hash,
  Heart,
  MessageCircle,
  Bookmark,
  Star,
  ArrowRight,
  CheckCircle2,
  Users,
  Target,
  Crown,
  Flame,
} from 'lucide-react';
import toast from 'react-hot-toast';

const SHOWCASE_REELS_ROW1 = [
  { gradient: 'from-pink-500 via-rose-500 to-red-500', hook: '3 mistakes killing your IG growth', views: '24.5K', likes: '1.2K', emoji: '🔥' },
  { gradient: 'from-violet-500 via-purple-500 to-indigo-500', hook: 'How I gained 5K followers in 30 days', views: '42.1K', likes: '3.4K', emoji: '🚀' },
  { gradient: 'from-amber-500 via-orange-500 to-red-500', hook: 'The caption formula that went viral', views: '18.7K', likes: '2.1K', emoji: '✍️' },
  { gradient: 'from-emerald-500 via-teal-500 to-cyan-500', hook: 'Stop scrolling. Start creating.', views: '31.2K', likes: '2.8K', emoji: '💡' },
  { gradient: 'from-blue-500 via-indigo-500 to-violet-500', hook: 'My morning routine as a creator', views: '15.3K', likes: '987', emoji: '📱' },
  { gradient: 'from-rose-500 via-pink-500 to-fuchsia-500', hook: 'My exact content strategy 2026', views: '56.8K', likes: '4.7K', emoji: '🎯' },
  { gradient: 'from-cyan-500 via-blue-500 to-indigo-500', hook: 'POV: Your Reel hits 1M views', views: '89.2K', likes: '7.3K', emoji: '🤯' },
  { gradient: 'from-yellow-500 via-amber-500 to-orange-500', hook: 'Hook formula that gets saves', views: '37.4K', likes: '5.1K', emoji: '🪝' },
];

const SHOWCASE_REELS_ROW2 = [
  { gradient: 'from-fuchsia-500 via-purple-500 to-violet-500', hook: 'Why your Reels flop (fix this)', views: '63.1K', likes: '5.9K', emoji: '👀' },
  { gradient: 'from-teal-500 via-emerald-500 to-green-500', hook: '5 niches exploding in 2026', views: '28.7K', likes: '3.2K', emoji: '📈' },
  { gradient: 'from-red-500 via-rose-500 to-pink-500', hook: 'This CTA doubled my DMs', views: '45.3K', likes: '4.1K', emoji: '💬' },
  { gradient: 'from-indigo-500 via-blue-500 to-sky-500', hook: 'Building 10K audience from zero', views: '71.8K', likes: '6.4K', emoji: '🏗️' },
  { gradient: 'from-orange-500 via-red-500 to-rose-500', hook: 'Hashtag hack nobody talks about', views: '22.4K', likes: '1.8K', emoji: '#️⃣' },
  { gradient: 'from-lime-500 via-green-500 to-emerald-500', hook: 'How I monetized at 3K followers', views: '52.6K', likes: '4.8K', emoji: '💰' },
  { gradient: 'from-sky-500 via-cyan-500 to-teal-500', hook: 'Content batching: full workflow', views: '19.5K', likes: '2.3K', emoji: '⚡' },
  { gradient: 'from-purple-500 via-fuchsia-500 to-pink-500', hook: 'Algorithm secrets revealed', views: '94.7K', likes: '8.9K', emoji: '🤫' },
];

const TESTIMONIALS = [
  {
    name: 'Sarah K.',
    handle: '@sarah.creates',
    avatar: 'S',
    color: 'from-pink-400 to-rose-500',
    text: 'Went from 2K to 18K followers in 3 months. The AI scripts are insanely good — saves me hours every week.',
    followers: '18K',
  },
  {
    name: 'Alex M.',
    handle: '@alexfitness',
    avatar: 'A',
    color: 'from-violet-400 to-purple-500',
    text: 'My Reels started getting 10x more views after using the hook templates. Total game-changer for my fitness brand.',
    followers: '45K',
  },
  {
    name: 'Priya D.',
    handle: '@priya.designs',
    avatar: 'P',
    color: 'from-amber-400 to-orange-500',
    text: 'I used to spend 4 hours planning content. Now it takes 15 minutes. The weekly plans are perfectly tailored to my niche.',
    followers: '12K',
  },
];

function MiniReelCard({ reel }: { reel: typeof SHOWCASE_REELS_ROW1[0] }) {
  return (
    <div className="flex-shrink-0 w-36 h-56 relative rounded-2xl overflow-hidden group cursor-pointer shadow-lg">
      <div className={`absolute inset-0 bg-gradient-to-br ${reel.gradient}`} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      <div className="absolute top-2 right-2 text-sm">{reel.emoji}</div>
      <div className="absolute right-2 bottom-16 flex flex-col items-center gap-2 opacity-70">
        <Heart className="w-3.5 h-3.5 text-white" />
        <MessageCircle className="w-3.5 h-3.5 text-white" />
        <Bookmark className="w-3.5 h-3.5 text-white" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-2.5">
        <p className="text-white text-[10px] font-bold leading-snug mb-1 line-clamp-2">{reel.hook}</p>
        <span className="text-white/50 text-[8px]">▶ {reel.views}</span>
      </div>
    </div>
  );
}

export default function Login() {
  const { signIn, signInWithGoogle, enterDemoMode } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(email, password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      await signInWithGoogle();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Google login failed';
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* ═══════════════════════════════════════════════════════════ */}
      {/* SECTION 1 — Hero with Login Form                          */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen overflow-hidden">
        {/* Light abstract background */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-pink-50" />
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #7c3aed 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }} />
        {/* Soft glow blobs */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-violet-200/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-pink-200/30 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-amber-100/30 rounded-full blur-[100px]" />

        {/* Top nav */}
        <div className="relative z-20 flex items-center justify-between px-6 md:px-12 py-5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-extrabold text-slate-900 tracking-tight">CreatorCanvas</span>
          </div>
          <Link
            to="/signup"
            className="hidden sm:inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-all"
          >
            Get Started Free <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Hero content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-8 md:pt-16 pb-20 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left — text & features */}
          <div className="flex-1 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-100 text-brand-700 text-xs font-semibold mb-6">
              <Zap className="w-3 h-3" /> AI-Powered Instagram Growth
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.1] mb-6 tracking-tight">
              Grow your
              <br />
              Instagram.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-purple-500 to-pink-500">
                Powered by AI.
              </span>
            </h1>
            <p className="text-lg text-slate-500 leading-relaxed mb-8 max-w-md">
              Weekly content plans, viral Reel scripts, killer captions, and smart growth insights — all tailored to your niche.
            </p>

            {/* Feature chips */}
            <div className="flex flex-wrap gap-2.5 mb-10">
              {[
                { icon: Film, label: 'Reel Scripts' },
                { icon: Hash, label: 'Smart Hashtags' },
                { icon: TrendingUp, label: 'Growth Insights' },
                { icon: Zap, label: 'AI Plans' },
              ].map((f) => (
                <div key={f.label} className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white border border-slate-200 shadow-sm text-sm text-slate-700 font-medium">
                  <f.icon className="w-3.5 h-3.5 text-brand-500" />
                  {f.label}
                </div>
              ))}
            </div>

            {/* Social proof mini */}
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                {['from-pink-400 to-rose-500', 'from-violet-400 to-purple-500', 'from-amber-400 to-orange-500', 'from-emerald-400 to-teal-500'].map((c, i) => (
                  <div key={i} className={`w-8 h-8 rounded-full bg-gradient-to-br ${c} border-2 border-white flex items-center justify-center text-white text-[10px] font-bold`}>
                    {['S', 'A', 'P', 'M'][i]}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">2,500+ creators</p>
                <p className="text-xs text-slate-400">are already growing</p>
              </div>
            </div>
          </div>

          {/* Right — Login form card */}
          <div className="w-full max-w-md flex-shrink-0">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-slate-200/60 border border-white/60 p-8">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-900">Welcome back</h2>
                <p className="text-slate-500 text-sm mt-1">Sign in to your creator dashboard.</p>
              </div>

              {/* Google */}
              <button
                onClick={handleGoogle}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium text-sm transition-all hover:shadow-md"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </button>

              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
                <div className="relative flex justify-center text-xs"><span className="bg-white/80 px-3 text-slate-400">or sign in with email</span></div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all bg-white" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all bg-white" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 cursor-pointer hover:text-brand-600">Forgot password?</span>
                </div>
                <button type="submit" disabled={loading} className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-pink-500 text-white font-semibold text-sm hover:opacity-90 disabled:opacity-50 transition-all hover:shadow-lg hover:shadow-brand-500/25">
                  {loading ? 'Signing in…' : 'Sign in'}
                </button>
              </form>

              {/* Demo */}
              <button
                onClick={() => { enterDemoMode(); toast.success('Welcome to demo mode!'); navigate('/dashboard'); }}
                className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-brand-200 text-brand-600 font-medium text-sm hover:bg-brand-50 transition-all"
              >
                <Play className="w-4 h-4" /> Try Demo — no login needed
              </button>
            </div>

            <p className="text-center mt-5 text-sm text-slate-500">
              Don&apos;t have an account?{' '}
              <Link to="/signup" className="text-brand-600 font-semibold hover:underline">Sign up free</Link>
            </p>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center animate-bounce">
          <span className="text-xs text-slate-400 font-medium mb-1">Scroll to explore</span>
          <div className="w-5 h-8 rounded-full border-2 border-slate-300 flex justify-center pt-1.5">
            <div className="w-1 h-2 bg-slate-400 rounded-full" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* SECTION 2 — Infinite Reel Showcase Marquee                */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50 overflow-hidden">
        <div className="text-center mb-12 px-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-100 text-pink-700 text-xs font-semibold mb-4">
            <Film className="w-3 h-3" /> Trending Content
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
            See what creators are making
          </h2>
          <p className="text-slate-500 max-w-md mx-auto">
            Every day, thousands of creators generate viral content with CreatorCanvas. Here&apos;s a glimpse.
          </p>
        </div>

        {/* Marquee Row 1 */}
        <div className="relative mb-5">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
          <div className="flex gap-4 animate-marquee-left hover:[animation-play-state:paused]">
            {[...SHOWCASE_REELS_ROW1, ...SHOWCASE_REELS_ROW1].map((reel, idx) => (
              <MiniReelCard key={`lr1-${idx}`} reel={reel} />
            ))}
          </div>
        </div>

        {/* Marquee Row 2 */}
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
          <div className="flex gap-4 animate-marquee-right hover:[animation-play-state:paused]">
            {[...SHOWCASE_REELS_ROW2, ...SHOWCASE_REELS_ROW2].map((reel, idx) => (
              <MiniReelCard key={`lr2-${idx}`} reel={reel} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* SECTION 3 — Features                                      */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-white px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-100 text-violet-700 text-xs font-semibold mb-4">
              <Sparkles className="w-3 h-3" /> Features
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
              Everything you need to grow
            </h2>
            <p className="text-slate-500 max-w-md mx-auto">
              From content planning to growth insights — one platform for your entire creator workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Zap, title: 'AI Weekly Plans', desc: 'Get 3–7 post ideas every week, perfectly tailored to your niche, audience, and goals.', color: 'from-violet-500 to-purple-600', bg: 'bg-violet-50' },
              { icon: Film, title: 'Reel Script Generator', desc: 'Viral hooks, shot guidance, and on-screen text — scripted in seconds by AI.', color: 'from-pink-500 to-rose-600', bg: 'bg-pink-50' },
              { icon: Hash, title: 'Video Generation & Caption', desc: 'Generate AI videos with Sora + get matching captions and hashtag packs.', color: 'from-amber-500 to-orange-600', bg: 'bg-amber-50' },
              { icon: Target, title: 'Niche Optimization', desc: 'Personalized to your niche — fitness, SaaS, design, coaching, and more.', color: 'from-rose-500 to-pink-600', bg: 'bg-rose-50' },
            ].map((f) => (
              <div key={f.title} className="group bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-xl hover:shadow-slate-200/50 transition-all hover:-translate-y-1">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg`}>
                  <f.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* SECTION 4 — How It Works                                  */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold mb-4">
              <Flame className="w-3 h-3" /> Simple
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
              3 steps to creator success
            </h2>
            <p className="text-slate-500 max-w-md mx-auto">
              Set up once, get AI-powered content forever.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Tell us your niche', desc: 'Complete a quick onboarding — your niche, goals, audience, and posting style.', gradient: 'from-violet-500 to-purple-600' },
              { step: '02', title: 'Generate content', desc: 'AI creates weekly plans, Reel scripts, captions, and hashtags instantly.', gradient: 'from-pink-500 to-rose-600' },
              { step: '03', title: 'Post & grow', desc: 'Copy your content, post it, and watch your audience grow.', gradient: 'from-amber-500 to-orange-600' },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className={`w-16 h-16 bg-gradient-to-br ${s.gradient} rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-xl`}>
                  <span className="text-white text-xl font-extrabold">{s.step}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{s.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed max-w-xs mx-auto">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* SECTION 5 — Testimonials                                  */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-white px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold mb-4">
              <Star className="w-3 h-3" /> Loved by Creators
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
              Creators love CreatorCanvas
            </h2>
            <p className="text-slate-500 max-w-md mx-auto">
              Don&apos;t take our word for it — see what real creators are saying.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:shadow-lg transition-all">
                {/* Stars */}
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-700 text-sm leading-relaxed mb-5 italic">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white text-sm font-bold`}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{t.name}</p>
                    <p className="text-xs text-slate-400">{t.handle} • {t.followers} followers</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* SECTION 6 — Stats banner                                  */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-gradient-to-r from-brand-600 via-purple-600 to-pink-500 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }} />
        <div className="relative z-10 max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
          {[
            { value: '2,500+', label: 'Active Creators' },
            { value: '50K+', label: 'Scripts Generated' },
            { value: '120K+', label: 'Captions Created' },
            { value: '98%', label: 'Satisfaction Rate' },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-3xl md:text-4xl font-extrabold mb-1">{s.value}</p>
              <p className="text-white/60 text-sm font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* SECTION 7 — Pricing / Free plan highlight                 */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-slate-50 px-6">
        <div className="max-w-lg mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-100 text-brand-700 text-xs font-semibold mb-4">
            <Crown className="w-3 h-3" /> Pricing
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
            Start free. Grow fast.
          </h2>
          <p className="text-slate-500 mb-10">
            Everything you need is free to get started. No credit card required.
          </p>

          <div className="bg-white rounded-3xl border-2 border-brand-200 p-8 shadow-xl shadow-brand-100/50">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100 text-brand-700 text-xs font-bold mb-4">
              <Sparkles className="w-3 h-3" /> Most Popular
            </div>
            <div className="flex items-baseline justify-center gap-1 mb-2">
              <span className="text-5xl font-extrabold text-slate-900">$0</span>
              <span className="text-slate-400 text-lg">/month</span>
            </div>
            <p className="text-slate-500 text-sm mb-6">Free forever for early creators</p>
            <div className="space-y-3 text-left max-w-xs mx-auto mb-8">
              {[
                'AI Weekly Content Plans',
                'Reel Script Generator',
                'Video Generation & Captions',
              ].map((item) => (
                <div key={item} className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-500 flex-shrink-0" />
                  <span className="text-sm text-slate-700">{item}</span>
                </div>
              ))}
            </div>
            <Link
              to="/signup"
              className="block w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-pink-500 text-white font-bold text-sm hover:opacity-90 transition-all hover:shadow-lg hover:shadow-brand-500/25 text-center"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* SECTION 8 — Final CTA                                     */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <Sparkles className="w-10 h-10 text-brand-500 mx-auto mb-5" />
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
            Ready to become a top creator?
          </h2>
          <p className="text-slate-500 max-w-lg mx-auto mb-8">
            Join 2,500+ creators already using AI to grow their Instagram. Your first week&apos;s content plan is waiting.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-brand-600 to-pink-500 text-white rounded-xl text-sm font-bold hover:opacity-90 transition-all hover:shadow-lg hover:shadow-brand-500/25"
            >
              <Sparkles className="w-4 h-4" /> Sign Up Free
            </Link>
            <button
              onClick={() => { enterDemoMode(); toast.success('Welcome to demo mode!'); navigate('/dashboard'); }}
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border border-slate-200 bg-white text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all"
            >
              <Play className="w-4 h-4" /> Try Demo
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* Footer                                                     */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <footer className="py-8 border-t border-slate-100 bg-white px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-brand-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-bold text-slate-700">CreatorCanvas</span>
          </div>
          <p className="text-xs text-slate-400">&copy; 2026 CreatorCanvas. Built for creators, by creators.</p>
          <div className="flex gap-4 text-xs text-slate-400">
            <span className="hover:text-slate-600 cursor-pointer">Privacy</span>
            <span className="hover:text-slate-600 cursor-pointer">Terms</span>
            <span className="hover:text-slate-600 cursor-pointer">Support</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
