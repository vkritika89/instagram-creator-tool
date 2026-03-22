import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  ArrowRight,
  Film,
  Zap,
  Hash,
  TrendingUp,
  Star,
} from 'lucide-react';
import toast from 'react-hot-toast';

// ─── Scroll-reveal wrapper ────────────────────────────────────────────────────
function RevealOnScroll({
  children,
  delay = 0,
  direction = 'up',
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'left' | 'right' | 'fade';
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { setVisible(entry.isIntersecting); },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  const initialTransform =
    direction === 'up'    ? 'translateY(40px)' :
    direction === 'left'  ? 'translateX(-40px)' :
    direction === 'right' ? 'translateX(40px)' : 'none';
  return (
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translate(0,0)' : initialTransform,
      transition: `opacity 0.65s cubic-bezier(.22,1,.36,1) ${delay}ms, transform 0.65s cubic-bezier(.22,1,.36,1) ${delay}ms`,
    }}>
      {children}
    </div>
  );
}
// ─────────────────────────────────────────────────────────────────────────────


export default function Signup() {
  const { signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const passwordStrength = (() => {
    if (password.length === 0) return { label: '', color: '', width: '0%' };
    if (password.length < 6) return { label: 'Too short', color: 'bg-red-500', width: '20%' };
    if (password.length < 8) return { label: 'Weak', color: 'bg-orange-500', width: '40%' };
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    const score = [hasUpper, hasNumber, hasSpecial].filter(Boolean).length;
    if (score >= 2) return { label: 'Strong', color: 'bg-green-500', width: '100%' };
    return { label: 'Medium', color: 'bg-yellow-500', width: '60%' };
  })();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const result = await signUp(email, password);
      if (result?.needsConfirmation) {
        toast.success('Account created! Please check your email to confirm your account before signing in.');
        // Optionally redirect to login or show a message
        setTimeout(() => navigate('/login'), 2000);
      } else {
        toast.success('Account created! Redirecting...');
        navigate('/dashboard');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Signup failed';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      await signInWithGoogle();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Google signup failed';
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090f]">
      {/* ─── Hero Section with Signup Form ─── */}
      <section className="relative min-h-screen overflow-hidden">
        {/* Dark abstract bg */}
        <div className="absolute inset-0 bg-[#09090f]" />
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #a78bfa 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }} />
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-pink-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-brand-500/10 rounded-full blur-[120px]" />

        {/* Nav */}
        <div className="relative z-20 flex items-center justify-between px-6 md:px-12 py-5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/30">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-extrabold text-white tracking-tight">CreatorCanvas</span>
          </div>
          <Link
            to="/login"
            className="hidden sm:inline-flex items-center gap-1.5 px-5 py-2 rounded-xl border border-white/10 bg-white/5 text-slate-300 text-sm font-semibold hover:bg-white/10 transition-all"
          >
            Sign in <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-8 md:pt-16 pb-20 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left text */}
          <div className="flex-1 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-semibold mb-6">
              <Sparkles className="w-3 h-3" /> Free to get started
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] mb-6 tracking-tight">
              Start creating
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-400 to-violet-400">
                content that converts.
              </span>
            </h1>
            <p className="text-lg text-slate-400 leading-relaxed mb-8 max-w-md">
              Join thousands of creators who use AI to plan, script, and grow their audience on Instagram, TikTok, and YouTube faster than ever.
            </p>

            {/* Features */}
            <div className="space-y-3 mb-10">
              {[
                { icon: Zap, text: 'AI-powered weekly content plans' },
                { icon: Film, text: 'Viral Reel scripts in seconds' },
                { icon: Hash, text: 'Niche-specific hashtag packs' },
                { icon: TrendingUp, text: 'Growth tracking & insights' },
              ].map((f) => (
                <div key={f.text} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
                    <f.icon className="w-4 h-4 text-brand-400" />
                  </div>
                  <span className="text-sm text-slate-300 font-medium">{f.text}</span>
                </div>
              ))}
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                {['from-pink-400 to-rose-500', 'from-violet-400 to-purple-500', 'from-amber-400 to-orange-500', 'from-emerald-400 to-teal-500'].map((c, i) => (
                  <div key={i} className={`w-8 h-8 rounded-full bg-gradient-to-br ${c} border-2 border-[#09090f] flex items-center justify-center text-white text-[10px] font-bold`}>
                    {['S', 'A', 'P', 'M'][i]}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-sm font-bold text-white">2,500+ creators</p>
                <p className="text-xs text-slate-500">are already growing</p>
              </div>
            </div>
          </div>

          {/* Right — Signup form */}
          <div className="w-full max-w-md flex-shrink-0">
            <div className="bg-[#13131f] rounded-3xl shadow-2xl shadow-black/50 border border-white/10 p-8">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-white">Create your account</h2>
                <p className="text-slate-400 text-sm mt-1">Start your growth journey — it&apos;s free.</p>
              </div>

              {/* Google */}
              <button
                onClick={handleGoogle}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-200 font-medium text-sm transition-all"
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
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div>
                <div className="relative flex justify-center text-xs"><span className="bg-[#13131f] px-3 text-slate-500">or sign up with email</span></div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/10 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500/60 transition-all bg-[#1c1c2e]" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a strong password" required className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-white/10 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500/60 transition-all bg-[#1c1c2e]" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {password.length > 0 && (
                    <div className="mt-2">
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className={`h-full ${passwordStrength.color} rounded-full transition-all duration-300`} style={{ width: passwordStrength.width }} />
                      </div>
                      <p className="text-xs mt-1 text-slate-500">Strength: <span className="font-medium text-slate-400">{passwordStrength.label}</span></p>
                    </div>
                  )}
                </div>

                <button type="submit" disabled={loading} className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-pink-500 text-white font-semibold text-sm hover:opacity-90 disabled:opacity-50 transition-all hover:shadow-lg hover:shadow-brand-500/30">
                  {loading ? 'Creating account…' : 'Create free account'}
                </button>
              </form>
            </div>

            <p className="text-center mt-5 text-sm text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="text-brand-400 font-semibold hover:underline">Sign in</Link>
            </p>
          </div>
        </div>

      </section>

      {/* ─── Why Join ─── */}
      <section className="py-16 bg-[#0f0f1b] px-6">
        <div className="max-w-4xl mx-auto">
          <RevealOnScroll className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">Why creators choose CreatorCanvas</h2>
            <p className="text-slate-400 text-sm">Everything you need to go from posting randomly to growing strategically.</p>
          </RevealOnScroll>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { icon: Zap, title: 'Save 5+ hours/week', desc: 'Stop staring at a blank screen. AI generates your entire week\'s content.', color: 'from-violet-500 to-purple-600', dir: 'left' as const },
              { icon: Film, title: 'Scripts that go viral', desc: 'Hooks, talking points, CTAs — all written to keep viewers watching.', color: 'from-pink-500 to-rose-600', dir: 'right' as const },
              { icon: Hash, title: 'Hashtags that reach', desc: 'Niche-aware packs that actually get your content discovered.', color: 'from-amber-500 to-orange-600', dir: 'left' as const },
              { icon: TrendingUp, title: 'Track your growth', desc: 'Authority Score shows your progress and what to improve.', color: 'from-emerald-500 to-teal-600', dir: 'right' as const },
            ].map((f, i) => (
              <RevealOnScroll key={f.title} delay={i * 100} direction={f.dir}>
                <div className="flex gap-4 p-5 bg-[#13131f] rounded-2xl border border-white/[0.07] hover:border-white/15 hover:shadow-lg hover:shadow-black/30 transition-all hover:-translate-y-0.5 h-full">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                    <f.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-1">{f.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Testimonial ─── */}
      <section className="py-16 bg-[#09090f] px-6">
        <RevealOnScroll direction="fade" className="max-w-2xl mx-auto text-center">
          <div className="flex justify-center gap-0.5 mb-5">
            {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />)}
          </div>
          <p className="text-xl md:text-2xl font-bold text-slate-200 leading-relaxed mb-6 italic">
            &ldquo;CreatorCanvas helped me go from 2K to 18K followers in 3 months. The AI scripts save me hours every single week.&rdquo;
          </p>
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white font-bold text-lg">S</div>
            <div className="text-left">
              <p className="font-bold text-white">Sarah K.</p>
              <p className="text-sm text-slate-500">Fitness Creator • 18K followers</p>
            </div>
          </div>
        </RevealOnScroll>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-16 bg-gradient-to-r from-brand-600 via-purple-600 to-pink-500 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }} />
        <RevealOnScroll direction="up" className="relative z-10 max-w-2xl mx-auto text-center text-white">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-3">Ready to start growing?</h2>
          <p className="text-white/70 mb-8">Create your free account in 30 seconds. No credit card needed.</p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-brand-700 rounded-xl font-bold text-sm hover:bg-white/90 transition-all hover:shadow-lg"
          >
            <Sparkles className="w-4 h-4" /> Sign Up Now <ArrowRight className="w-4 h-4" />
          </button>
        </RevealOnScroll>
      </section>

      {/* ─── Footer ─── */}
      <footer className="py-8 border-t border-white/[0.07] bg-[#09090f] px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-brand-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-bold text-slate-400">CreatorCanvas</span>
          </div>
          <p className="text-xs text-slate-600">&copy; 2026 CreatorCanvas. Built for creators, by creators.</p>
        </div>
      </footer>
    </div>
  );
}
