import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Zap, Film, CheckCircle2, Crown, Loader2, ArrowLeft } from 'lucide-react';
import { apiPost } from '../lib/api';
import { useAuth } from '../context/AuthContext';

export default function Pricing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [yearlyBilling, setYearlyBilling] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState<'basic' | 'plus' | null>(null);

  const handleCheckout = async (plan: 'basic' | 'plus') => {
    setCheckoutLoading(plan);
    try {
      const data = await apiPost<{ url: string }>('/api/payments/checkout', { plan });
      if (data.url) window.location.href = data.url;
    } catch {
      // Not logged in — send to signup
      navigate(`/signup?plan=${plan}`);
    } finally {
      setCheckoutLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090f]">
      {/* Minimal header */}
      <header className="sticky top-0 z-50 bg-[#09090f]/80 backdrop-blur-md border-b border-white/[0.07]">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-pink-500 rounded-xl flex items-center justify-center shadow-md shadow-brand-500/30 group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-extrabold text-white tracking-tight">CreatorCanvas</span>
          </Link>

          {user ? (
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-400 hover:text-brand-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Link>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-sm font-semibold text-slate-400 hover:text-white transition-colors">
                Log in
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-pink-500 text-white text-sm font-semibold hover:opacity-90 transition-all shadow-md shadow-brand-500/30"
              >
                Sign Up Free
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Glow blobs */}
      <div className="relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-brand-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[250px] bg-pink-500/8 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 pt-14 pb-20">
          {/* Heading */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-semibold mb-4">
              <Crown className="w-3 h-3" /> Simple, transparent pricing
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3 tracking-tight">
              Choose your plan
            </h1>
            <p className="text-slate-400 text-sm max-w-sm mx-auto">
              No contracts. Cancel anytime. Start creating viral content today.
            </p>

            {/* Monthly / Yearly toggle */}
            <div className="inline-flex items-center gap-3 mt-8 bg-[#13131f] border border-white/10 rounded-full px-4 py-2">
              <span className={`text-sm font-semibold transition-colors ${!yearlyBilling ? 'text-white' : 'text-slate-500'}`}>
                Monthly
              </span>
              <button
                onClick={() => setYearlyBilling(v => !v)}
                className={`relative w-11 h-6 rounded-full transition-colors ${yearlyBilling ? 'bg-brand-500' : 'bg-white/10'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${yearlyBilling ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
              <span className={`text-sm font-semibold transition-colors ${yearlyBilling ? 'text-white' : 'text-slate-500'}`}>
                Yearly <span className="ml-1 text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full">–20%</span>
              </span>
            </div>
          </div>

          {/* Plan cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Basic */}
            <div className="relative rounded-3xl border border-white/10 bg-[#13131f] p-8 flex flex-col shadow-xl shadow-black/40">
              <div className="mb-6">
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-1">Basic</p>
                <p className="text-slate-500 text-sm mb-5">For creators just starting out</p>
                <div className="flex items-end gap-1.5 mb-1">
                  {yearlyBilling && (
                    <span className="text-slate-600 text-xl font-bold line-through mb-0.5">$19</span>
                  )}
                  <span className="text-5xl font-extrabold text-white">${yearlyBilling ? '15' : '19'}</span>
                  <span className="text-slate-500 text-sm mb-1.5">USD / mo</span>
                </div>
                {yearlyBilling && <p className="text-xs text-slate-500">Billed annually · save $48/yr</p>}
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-semibold">
                  <Zap className="w-3 h-3 text-yellow-400" /> 400 Credits / mo
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-semibold">
                  <Film className="w-3 h-3 text-pink-400" /> 40 Short Videos / mo
                </span>
              </div>
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest mb-3">What's included</p>
              <ul className="space-y-2.5 mb-8 flex-1">
                {[
                  'AI Reel Script Generator',
                  'Caption & Hashtag Generator',
                  'Content Calendar',
                  'AI Weekly Content Plans',
                  '40 AI Short Videos / month',
                  '400 AI credits / month',
                  'Download Videos',
                  'No watermark',
                ].map(f => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-400 flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleCheckout('basic')}
                disabled={checkoutLoading !== null}
                className="w-full py-3 rounded-xl border border-white/15 text-slate-300 font-semibold text-sm hover:border-brand-500/50 hover:text-brand-400 hover:bg-brand-500/5 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {checkoutLoading === 'basic'
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing…</>
                  : 'Get Started →'}
              </button>
            </div>

            {/* Plus */}
            <div className="relative rounded-3xl border border-brand-500/40 bg-gradient-to-b from-brand-500/[0.08] to-[#13131f] p-8 flex flex-col shadow-xl shadow-brand-500/10">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <span className="px-4 py-1 rounded-full bg-slate-600 text-white text-[11px] font-bold shadow-lg whitespace-nowrap">
                  COMING SOON
                </span>
              </div>
              <div className="mb-6">
                <p className="text-brand-400 text-xs font-semibold uppercase tracking-widest mb-1">Plus</p>
                <p className="text-slate-400 text-sm mb-5">For serious short-form creators</p>
                <div className="flex items-end gap-1.5 mb-1">
                  {yearlyBilling && (
                    <span className="text-slate-600 text-xl font-bold line-through mb-0.5">$59</span>
                  )}
                  <span className="text-5xl font-extrabold text-white">${yearlyBilling ? '47' : '59'}</span>
                  <span className="text-slate-500 text-sm mb-1.5">USD / mo</span>
                </div>
                {yearlyBilling && <p className="text-xs text-slate-500">Billed annually · save $144/yr</p>}
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-semibold">
                  <Zap className="w-3 h-3 text-yellow-400" /> 1200 Credits / mo
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-300 text-xs font-semibold">
                  <Film className="w-3 h-3 text-pink-400" /> 120 Short Videos / mo
                </span>
              </div>
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest mb-3">Everything in Basic, plus</p>
              <ul className="space-y-2.5 mb-8 flex-1">
                {[
                  'Everything in Basic',
                  '120 AI Short Videos / month',
                  '1200 AI credits / month',
                  'Priority AI generation',
                  'Advanced analytics & insights',
                  'Early access to new features',
                ].map(f => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-400 flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <button
                disabled
                className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-slate-500 font-bold text-sm cursor-not-allowed"
              >
                Coming Soon
              </button>
            </div>
          </div>

          <p className="text-center text-slate-600 text-xs mt-8">
            No contracts · Cancel anytime · Prices in USD
          </p>
        </div>
      </div>
    </div>
  );
}
