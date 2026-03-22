import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Sparkles, Crown, Zap, Film } from 'lucide-react';

const PLAN_DETAILS = {
  basic: {
    name: 'Basic',
    price: '$19/mo',
    color: 'from-slate-700 to-slate-900',
    badge: 'bg-slate-100 text-slate-700',
    perks: ['150 AI credits / month', '20 Short Videos / month', 'Reel Script Generator', 'Caption & Hashtag AI', 'Content Calendar'],
  },
  plus: {
    name: 'Plus',
    price: '$49/mo',
    color: 'from-brand-600 to-pink-500',
    badge: 'bg-brand-100 text-brand-700',
    perks: ['500 AI credits / month', '120 Short Videos / month', 'Everything in Basic', 'Priority AI generation', 'Advanced analytics'],
  },
};

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const plan = (params.get('plan') ?? 'basic') as 'basic' | 'plus';
  const details = PLAN_DETAILS[plan] ?? PLAN_DETAILS.basic;

  const [dots, setDots] = useState('');
  useEffect(() => {
    const id = setInterval(() => setDots(d => d.length >= 3 ? '' : d + '.'), 500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-pink-50 flex flex-col items-center justify-center px-6 py-16">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 mb-12">
        <div className="w-9 h-9 bg-gradient-to-br from-brand-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <span className="text-lg font-extrabold text-slate-900 tracking-tight">CreatorCanvas</span>
      </Link>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl shadow-slate-200/60 border border-white/60 p-10 text-center">
        {/* Success icon */}
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 className="w-9 h-9 text-emerald-500" />
        </div>

        <h1 className="text-2xl font-extrabold text-slate-900 mb-1">Payment successful!</h1>
        <p className="text-slate-500 text-sm mb-6">
          Welcome to CreatorCanvas {details.name}. Your subscription is now active.
        </p>

        {/* Plan badge */}
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${details.color} text-white text-sm font-bold shadow-lg mb-6`}>
          <Crown className="w-4 h-4 text-yellow-300" />
          {details.name} Plan · {details.price}
        </div>

        {/* Perks list */}
        <ul className="text-left space-y-2.5 mb-8">
          {details.perks.map(p => (
            <li key={p} className="flex items-center gap-2.5 text-sm text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-brand-500 flex-shrink-0" />
              {p}
            </li>
          ))}
        </ul>

        {/* Note about processing */}
        <p className="text-xs text-slate-400 mb-6">
          Your plan will be reflected in the dashboard shortly{dots}
        </p>

        <Link
          to="/dashboard"
          className="block w-full py-3 rounded-xl bg-gradient-to-r from-brand-600 to-pink-500 text-white font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-brand-500/25"
        >
          Go to Dashboard
        </Link>
      </div>

      {/* Quick feature icons */}
      <div className="flex items-center gap-6 mt-10 text-slate-400">
        <div className="flex flex-col items-center gap-1.5 text-xs">
          <div className="w-10 h-10 bg-white rounded-xl border border-slate-100 shadow-sm flex items-center justify-center">
            <Zap className="w-4 h-4 text-brand-500" />
          </div>
          AI Credits
        </div>
        <div className="flex flex-col items-center gap-1.5 text-xs">
          <div className="w-10 h-10 bg-white rounded-xl border border-slate-100 shadow-sm flex items-center justify-center">
            <Film className="w-4 h-4 text-pink-500" />
          </div>
          Short Videos
        </div>
        <div className="flex flex-col items-center gap-1.5 text-xs">
          <div className="w-10 h-10 bg-white rounded-xl border border-slate-100 shadow-sm flex items-center justify-center">
            <Crown className="w-4 h-4 text-amber-500" />
          </div>
          Premium
        </div>
      </div>
    </div>
  );
}
