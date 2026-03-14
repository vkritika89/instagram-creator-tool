import { useEffect, useState } from 'react';
import { apiGet } from '../lib/api';
import { TrendingUp, AlertTriangle, RefreshCw, Award } from 'lucide-react';
import toast from 'react-hot-toast';

interface AuthorityData {
  score: number;
  weaknesses: string[];
}

export default function AuthorityScore() {
  const [data, setData] = useState<AuthorityData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchScore = async () => {
    setLoading(true);
    try {
      const result = await apiGet<AuthorityData>('/api/authority-score');
      setData(result);
    } catch {
      toast.error('Failed to load authority score');
      setData({ score: 0, weaknesses: ['Unable to calculate score yet. Generate more content!'] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScore();
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 50) return 'text-amber-500';
    return 'text-red-500';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Average';
    if (score >= 20) return 'Needs Work';
    return 'Getting Started';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-emerald-400 to-teal-500';
    if (score >= 50) return 'from-amber-400 to-orange-500';
    return 'from-red-400 to-rose-500';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <RefreshCw className="w-6 h-6 animate-spin text-brand-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-emerald-500" />
            Authority Score & Insights
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Track your content consistency and get actionable feedback.
          </p>
        </div>
        <button
          onClick={fetchScore}
          className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {data && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Score card */}
          <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center">
            <Award className="w-8 h-8 text-brand-500 mx-auto mb-4" />
            <h2 className="text-sm font-medium text-slate-500 mb-4">Your Authority Score</h2>

            {/* Score circle */}
            <div className="relative w-40 h-40 mx-auto mb-6">
              <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 160 160">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="#e2e8f0"
                  strokeWidth="12"
                  fill="none"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="url(#scoreGradient)"
                  strokeWidth="12"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${(data.score / 100) * 440} 440`}
                />
                <defs>
                  <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-4xl font-bold ${getScoreColor(data.score)}`}>
                  {data.score}
                </span>
                <span className="text-xs text-slate-400 mt-1">out of 100</span>
              </div>
            </div>

            <div
              className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r ${getScoreGradient(
                data.score
              )}`}
            >
              {getScoreLabel(data.score)}
            </div>
          </div>

          {/* Weaknesses / feedback */}
          <div className="bg-white rounded-2xl border border-slate-100 p-8">
            <h2 className="text-sm font-medium text-slate-500 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Areas for Improvement
            </h2>
            <div className="space-y-3">
              {data.weaknesses.map((w, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 bg-amber-50 rounded-xl"
                >
                  <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-semibold text-amber-600">{i + 1}</span>
                  </div>
                  <p className="text-sm text-amber-800">{w}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-brand-50 rounded-xl">
              <p className="text-sm text-brand-700">
                <strong>Tip:</strong> Generate more weekly plans and reel scripts to
                improve your consistency score. Aim to create at least 3 pieces of content
                per week.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

