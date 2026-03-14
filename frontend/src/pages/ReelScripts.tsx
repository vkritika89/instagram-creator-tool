import { useState } from 'react';
import { apiPost } from '../lib/api';
import { Film, Sparkles, Copy, Check, Clapperboard, Type, Camera } from 'lucide-react';
import toast from 'react-hot-toast';

interface ReelScript {
  id: string;
  topic: string;
  script: string;
  on_screen_text: string;
  shot_guidance: string;
  created_at: string;
}

export default function ReelScripts() {
  const [prompt, setPrompt] = useState('');
  const [script, setScript] = useState<ReelScript | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please describe your Reel idea');
      return;
    }
    setLoading(true);
    try {
      const data = await apiPost<ReelScript>('/api/reel-script/generate', {
        prompt: prompt.trim(),
      });
      setScript(data);
      toast.success('Script generated!');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to generate script';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const copySection = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopied(section);
    toast.success('Copied!');
    setTimeout(() => setCopied(null), 2000);
  };

  const copyAll = () => {
    if (!script) return;
    const text = `REEL SCRIPT: ${script.topic}\n\n--- Script ---\n${script.script}\n\n--- On-Screen Text ---\n${script.on_screen_text}\n\n--- Shot Guidance ---\n${script.shot_guidance}`;
    navigator.clipboard.writeText(text);
    setCopied('all');
    toast.success('All copied!');
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Film className="w-6 h-6 text-pink-500" />
          Reel Script Generator
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Describe your Reel idea and get a ready-to-shoot script with on-screen text and shot guidance.
        </p>
      </div>

      {/* Input */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-6">
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Describe your Reel idea
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., 'How I help fitness clients lose 10 lbs in 30 days' or '3 mistakes SaaS founders make on Instagram'"
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 resize-none transition-colors"
        />
        <div className="flex justify-end mt-3">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center gap-2"
          >
            <Sparkles className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Generating…' : 'Generate script'}
          </button>
        </div>
      </div>

      {/* Output */}
      {script && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={copyAll}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2"
            >
              {copied === 'all' ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              Copy all
            </button>
          </div>

          {/* Script */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-brand-700">
                <Clapperboard className="w-4 h-4" />
                <span className="text-sm font-semibold">Script</span>
              </div>
              <button
                onClick={() => copySection(script.script, 'script')}
                className="text-slate-400 hover:text-brand-600 transition-colors"
              >
                {copied === 'script' ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
            <div className="text-slate-700 text-sm whitespace-pre-line leading-relaxed">
              {script.script}
            </div>
          </div>

          {/* On-screen text */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-amber-600">
                <Type className="w-4 h-4" />
                <span className="text-sm font-semibold">On-Screen Text</span>
              </div>
              <button
                onClick={() => copySection(script.on_screen_text, 'onscreen')}
                className="text-slate-400 hover:text-brand-600 transition-colors"
              >
                {copied === 'onscreen' ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
            <div className="text-slate-700 text-sm whitespace-pre-line leading-relaxed">
              {script.on_screen_text}
            </div>
          </div>

          {/* Shot guidance */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-emerald-600">
                <Camera className="w-4 h-4" />
                <span className="text-sm font-semibold">Shot Guidance</span>
              </div>
              <button
                onClick={() => copySection(script.shot_guidance, 'shots')}
                className="text-slate-400 hover:text-brand-600 transition-colors"
              >
                {copied === 'shots' ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
            <div className="text-slate-700 text-sm whitespace-pre-line leading-relaxed">
              {script.shot_guidance}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

