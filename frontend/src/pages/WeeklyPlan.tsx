import { useEffect, useState } from 'react';
import { apiGet, apiPost } from '../lib/api';
import {
  CalendarDays,
  RefreshCw,
  Copy,
  Check,
  Film,
  Image,
  BookOpen,
  Smartphone,
  Download,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Post {
  type: string;
  hook: string;
  body: string;
  cta: string;
  hashtags: string[];
}

interface WeeklyPlanData {
  id: string;
  week_start: string;
  posts: Post[];
  created_at: string;
}

const typeIcons: Record<string, React.ElementType> = {
  Reel: Film,
  Carousel: Image,
  Static: BookOpen,
  Story: Smartphone,
};

export default function WeeklyPlan() {
  const [plan, setPlan] = useState<WeeklyPlanData | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  useEffect(() => {
    apiGet<WeeklyPlanData | null>('/api/weekly-plan/latest')
      .then((data) => setPlan(data))
      .catch(() => setPlan(null))
      .finally(() => setFetching(false));
  }, []);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const data = await apiPost<WeeklyPlanData>('/api/weekly-plan/generate', {});
      setPlan(data);
      toast.success('New weekly plan generated!');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to generate plan';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const copyPost = (post: Post, idx: number) => {
    const text = `[${post.type}]\n\nHook: ${post.hook}\n\n${post.body}\n\nCTA: ${post.cta}\n\nHashtags: ${post.hashtags.join(' ')}`;
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const exportAsText = () => {
    if (!plan) return;
    const text = plan.posts
      .map(
        (p, i) =>
          `--- Post ${i + 1}: ${p.type} ---\nHook: ${p.hook}\n\n${p.body}\n\nCTA: ${p.cta}\n\nHashtags: ${p.hashtags.join(' ')}`
      )
      .join('\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `weekly-plan-${plan.week_start || 'current'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-20">
        <RefreshCw className="w-6 h-6 animate-spin text-brand-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-brand-500" />
            This week's plan
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            AI-powered content ideas personalized for your niche.
          </p>
        </div>
        <div className="flex gap-2">
          {plan && (
            <button
              onClick={exportAsText}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" /> Export .txt
            </button>
          )}
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-pink-500 text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Generating…' : plan ? 'Regenerate plan' : 'Generate plan'}
          </button>
        </div>
      </div>

      {!plan ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
          <CalendarDays className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-700 mb-2">No plan yet</h3>
          <p className="text-slate-500 text-sm mb-6">
            Click "Generate plan" to create your first weekly content plan.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {plan.posts.map((post, idx) => {
            const Icon = typeIcons[post.type] || BookOpen;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-brand-50 text-brand-700 text-xs font-medium rounded-lg flex items-center gap-1">
                      <Icon className="w-3.5 h-3.5" />
                      {post.type}
                    </span>
                    <span className="text-xs text-slate-400">Post {idx + 1}</span>
                  </div>
                  <button
                    onClick={() => copyPost(post, idx)}
                    className="text-slate-400 hover:text-brand-600 transition-colors"
                  >
                    {copiedIdx === idx ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <h3 className="font-semibold text-slate-900 mb-2 text-lg">🪝 {post.hook}</h3>

                <div className="text-slate-600 text-sm whitespace-pre-line mb-3">
                  {post.body}
                </div>

                <div className="bg-emerald-50 text-emerald-700 px-3 py-2 rounded-lg text-sm font-medium mb-3">
                  CTA: {post.cta}
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {post.hashtags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md cursor-pointer hover:bg-brand-50 hover:text-brand-600 transition-colors"
                      onClick={() => {
                        navigator.clipboard.writeText(tag);
                        toast.success(`Copied ${tag}`);
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

