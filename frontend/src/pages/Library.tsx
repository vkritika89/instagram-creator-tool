import { useEffect, useState } from 'react';
import { apiGet, apiDelete } from '../lib/api';
import {
  FolderOpen,
  CalendarDays,
  Film,
  MessageSquareText,
  Copy,
  Trash2,
  Search,
  RefreshCw,
} from 'lucide-react';
import toast from 'react-hot-toast';

type Tab = 'plans' | 'scripts' | 'captions';

interface PlanItem {
  id: string;
  week_start: string;
  posts: unknown[];
  created_at: string;
}

interface ScriptItem {
  id: string;
  topic: string;
  script: string;
  on_screen_text: string;
  shot_guidance: string;
  created_at: string;
}

interface CaptionItem {
  id: string;
  topic: string;
  variants: string[];
  hashtags: string[];
  created_at: string;
}

const tabs = [
  { id: 'plans' as Tab, label: 'Plans', icon: CalendarDays },
  { id: 'scripts' as Tab, label: 'Reel Scripts', icon: Film },
  { id: 'captions' as Tab, label: 'Captions', icon: MessageSquareText },
];

export default function Library() {
  const [activeTab, setActiveTab] = useState<Tab>('plans');
  const [plans, setPlans] = useState<PlanItem[]>([]);
  const [scripts, setScripts] = useState<ScriptItem[]>([]);
  const [captions, setCaptions] = useState<CaptionItem[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [p, s, c] = await Promise.all([
        apiGet<PlanItem[]>('/api/library/plans').catch(() => []),
        apiGet<ScriptItem[]>('/api/library/scripts').catch(() => []),
        apiGet<CaptionItem[]>('/api/library/captions').catch(() => []),
      ]);
      setPlans(p);
      setScripts(s);
      setCaptions(c);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (type: string, id: string) => {
    try {
      await apiDelete(`/api/library/${type}/${id}`);
      toast.success('Deleted!');
      fetchAll();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

  const filteredPlans = plans.filter(
    (p) =>
      !search ||
      p.week_start?.toLowerCase().includes(search.toLowerCase()) ||
      p.created_at?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredScripts = scripts.filter(
    (s) =>
      !search || s.topic.toLowerCase().includes(search.toLowerCase())
  );

  const filteredCaptions = captions.filter(
    (c) =>
      !search || c.topic.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <RefreshCw className="w-6 h-6 animate-spin text-brand-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <FolderOpen className="w-6 h-6 text-brand-500" />
          Content Library
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          All your saved plans, scripts, and captions in one place.
        </p>
      </div>

      {/* Tabs + search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-brand-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search…"
            className="pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 w-full sm:w-60"
          />
        </div>
      </div>

      {/* Plans tab */}
      {activeTab === 'plans' && (
        <div className="space-y-3">
          {filteredPlans.length === 0 ? (
            <EmptyState label="No plans saved yet" />
          ) : (
            filteredPlans.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-2xl border border-slate-100 p-5 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-slate-800">
                    Weekly Plan — {p.week_start || formatDate(p.created_at)}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {(p.posts as unknown[]).length} posts • Created {formatDate(p.created_at)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(p.posts, null, 2));
                      toast.success('Copied!');
                    }}
                    className="p-2 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-brand-600 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete('plans', p.id)}
                    className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Scripts tab */}
      {activeTab === 'scripts' && (
        <div className="space-y-3">
          {filteredScripts.length === 0 ? (
            <EmptyState label="No scripts saved yet" />
          ) : (
            filteredScripts.map((s) => (
              <div
                key={s.id}
                className="bg-white rounded-2xl border border-slate-100 p-5 flex items-center justify-between"
              >
                <div className="min-w-0 flex-1 mr-4">
                  <p className="font-medium text-slate-800 truncate">{s.topic}</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Created {formatDate(s.created_at)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `Script: ${s.script}\n\nOn-Screen: ${s.on_screen_text}\n\nShots: ${s.shot_guidance}`
                      );
                      toast.success('Copied!');
                    }}
                    className="p-2 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-brand-600 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete('scripts', s.id)}
                    className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Captions tab */}
      {activeTab === 'captions' && (
        <div className="space-y-3">
          {filteredCaptions.length === 0 ? (
            <EmptyState label="No captions saved yet" />
          ) : (
            filteredCaptions.map((c) => (
              <div
                key={c.id}
                className="bg-white rounded-2xl border border-slate-100 p-5 flex items-center justify-between"
              >
                <div className="min-w-0 flex-1 mr-4">
                  <p className="font-medium text-slate-800 truncate">{c.topic}</p>
                  <p className="text-xs text-slate-400 mt-1">
                    {c.variants.length} variants • {c.hashtags.length} hashtags • {formatDate(c.created_at)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        c.variants.join('\n\n---\n\n') + '\n\n' + c.hashtags.join(' ')
                      );
                      toast.success('Copied!');
                    }}
                    className="p-2 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-brand-600 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete('captions', c.id)}
                    className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
      <FolderOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
      <p className="text-slate-500 text-sm">{label}</p>
    </div>
  );
}

