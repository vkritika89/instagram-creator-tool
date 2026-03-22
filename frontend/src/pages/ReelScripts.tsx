import { useState } from 'react';
import { apiPost } from '../lib/api';
import { Film, Sparkles, Copy, Check, Type, Camera, Zap, BookOpen, Lightbulb, Brain, Megaphone, ChevronRight, CalendarPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import AddToCalendarModal from '../components/AddToCalendarModal';

interface ScriptSections {
  hook: string;
  story: string;
  transformation: string;
  retention: string;
  cta: string;
  psychology_note: string;
}

interface ReelScript {
  id: string;
  topic: string;
  script: string;
  on_screen_text: string;
  shot_guidance: string;
  sections: ScriptSections;
  created_at: string;
}

const SECTION_CONFIG = [
  {
    key: 'hook' as const,
    label: 'Hook',
    subtitle: 'First 2-3 seconds — stop the scroll',
    icon: Zap,
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/25',
    accent: 'from-red-500 to-rose-500',
    badge: 'bg-red-500/15 text-red-400 border border-red-500/20',
    timing: '0-3s',
    emoji: '🎯',
  },
  {
    key: 'story' as const,
    label: 'Story / Pain Point',
    subtitle: 'Build relatability — make it personal',
    icon: BookOpen,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/25',
    accent: 'from-blue-500 to-indigo-500',
    badge: 'bg-blue-500/15 text-blue-400 border border-blue-500/20',
    timing: '3-15s',
    emoji: '📖',
  },
  {
    key: 'transformation' as const,
    label: 'Transformation / Solution',
    subtitle: 'The main value — insight, lesson, or punchline',
    icon: Lightbulb,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/25',
    accent: 'from-amber-500 to-orange-500',
    badge: 'bg-amber-500/15 text-amber-400 border border-amber-500/20',
    timing: '15-40s',
    emoji: '💡',
  },
  {
    key: 'retention' as const,
    label: 'Retention Moment',
    subtitle: 'The twist — keep them watching till the end',
    icon: Brain,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/25',
    accent: 'from-purple-500 to-violet-500',
    badge: 'bg-purple-500/15 text-purple-400 border border-purple-500/20',
    timing: '40-50s',
    emoji: '🧠',
  },
  {
    key: 'cta' as const,
    label: 'Call to Action',
    subtitle: 'Drive engagement — follow, save, comment, share',
    icon: Megaphone,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/25',
    accent: 'from-emerald-500 to-green-500',
    badge: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20',
    timing: '50-60s',
    emoji: '📣',
  },
];

export default function ReelScripts() {
  const [prompt, setPrompt] = useState('');
  const [script, setScript] = useState<ReelScript | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);

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
      let message = 'Failed to generate script';
      if (err instanceof Error) {
        message = err.message;
        if (message.includes('API key not configured')) {
          message = 'OpenAI API key not set. Please configure it in backend/.env';
        } else if (message.includes('Invalid OpenAI API key')) {
          message = 'Invalid OpenAI API key. Please check your API key.';
        } else if (message.includes('rate limit')) {
          message = 'OpenAI rate limit exceeded. Please try again in a moment.';
        }
      }
      console.error('Reel script generation error:', err);
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
    const s = script.sections;
    const parts = [
      `REEL SCRIPT: ${script.topic}`,
      s?.hook ? `🎯 HOOK:\n${s.hook}` : '',
      s?.story ? `📖 STORY:\n${s.story}` : '',
      s?.transformation ? `💡 TRANSFORMATION:\n${s.transformation}` : '',
      s?.retention ? `🧠 RETENTION:\n${s.retention}` : '',
      s?.cta ? `📣 CTA:\n${s.cta}` : '',
      `\n--- On-Screen Text ---\n${script.on_screen_text}`,
      `\n--- Shot Guidance ---\n${script.shot_guidance}`,
    ].filter(Boolean);
    navigator.clipboard.writeText(parts.join('\n\n'));
    setCopied('all');
    toast.success('All copied!');
    setTimeout(() => setCopied(null), 2000);
  };

  const hasSections = script?.sections && Object.values(script.sections).some(v => v);

  const onScreenLines = script?.on_screen_text
    ?.split('\n')
    .map(l => l.trim())
    .filter(Boolean) || [];

  const shotLines = script?.shot_guidance
    ?.split('\n')
    .map(l => l.trim())
    .filter(Boolean) || [];

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Film className="w-6 h-6 text-pink-400" />
          Reel Script Generator
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Describe your Reel idea and get a human-crafted script with hooks, storytelling, psychology, and a strong CTA.
        </p>
      </div>

      {/* Input */}
      <div className="bg-[#13131f] rounded-2xl border border-white/[0.07] p-6 mb-6">
        <label className="block text-sm font-semibold text-slate-300 mb-2">
          Describe your Reel idea
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., 'Funny husband wife argument over TV remote' or 'Why Indian moms are the real CEOs' or '3 mistakes new gym bros make'"
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-white/10 bg-[#1c1c2e] text-white placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500/60 resize-none transition-colors"
        />
        <div className="flex justify-end mt-3">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center gap-2"
          >
            <Sparkles className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Crafting your script…' : 'Generate script'}
          </button>
        </div>
      </div>

      {/* Output */}
      {script && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Your Reel Script</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowCalendar(true)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-pink-500 text-white text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                <CalendarPlus className="w-4 h-4" />
                Add to Calendar
              </button>
              <button
                onClick={copyAll}
                className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-slate-300 text-sm font-medium hover:bg-white/10 transition-colors flex items-center gap-2"
              >
                {copied === 'all' ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
                Copy all
              </button>
            </div>
          </div>

          {/* Script Sections */}
          {hasSections ? (
            <div className="space-y-4">
              {/* Flow indicator */}
              <div className="flex items-center gap-1.5 px-1 overflow-x-auto pb-1">
                {SECTION_CONFIG.map((section, i) => (
                  <div key={section.key} className="flex items-center gap-1.5 shrink-0">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${section.badge}`}>
                      {section.label}
                    </span>
                    {i < SECTION_CONFIG.length - 1 && (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                    )}
                  </div>
                ))}
              </div>

              {/* Section cards */}
              {SECTION_CONFIG.map((config) => {
                const text = script.sections[config.key];
                if (!text) return null;
                const Icon = config.icon;

                return (
                  <div
                    key={config.key}
                    className={`bg-[#13131f] rounded-2xl border ${config.border} overflow-hidden`}
                  >
                    <div className={`${config.bg} px-5 py-3 flex items-center justify-between border-b ${config.border}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${config.accent} flex items-center justify-center`}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-bold ${config.color}`}>{config.label}</span>
                            <span className="text-[10px] font-mono font-medium text-slate-500 bg-white/5 border border-white/10 px-1.5 py-0.5 rounded">
                              {config.timing}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">{config.subtitle}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => copySection(text, config.key)}
                        className="text-slate-500 hover:text-slate-300 transition-colors p-1"
                      >
                        {copied === config.key ? (
                          <Check className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    <div className="px-5 py-4">
                      <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                        {text}
                      </p>
                    </div>
                  </div>
                );
              })}

              {/* Psychology insight */}
              {script.sections.psychology_note && (
                <div className="bg-indigo-500/10 rounded-2xl border border-indigo-500/25 p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shrink-0 mt-0.5">
                      <Brain className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-indigo-300">Why This Script Works</span>
                      <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                        {script.sections.psychology_note}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Fallback: show raw script if sections aren't available */
            <div className="bg-[#13131f] rounded-2xl border border-white/[0.07] p-6">
              <div className="text-slate-300 text-sm whitespace-pre-line leading-relaxed bg-white/[0.03] p-4 rounded-xl border border-white/[0.07]">
                {script.script}
              </div>
            </div>
          )}

          {/* On-Screen Text — individual overlay cards */}
          {onScreenLines.length > 0 && (
            <div className="bg-[#13131f] rounded-2xl border border-white/[0.07] p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-amber-400">
                  <Type className="w-4 h-4" />
                  <span className="text-sm font-semibold">On-Screen Text Overlays</span>
                </div>
                <button
                  onClick={() => copySection(script.on_screen_text, 'onscreen')}
                  className="text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {copied === 'onscreen' ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
              <div className="grid gap-2">
                {onScreenLines.map((line, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3"
                  >
                    <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-sm text-slate-300 font-medium">{line}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Shot Guidance — step-by-step filming guide */}
          {shotLines.length > 0 && (
            <div className="bg-[#13131f] rounded-2xl border border-white/[0.07] p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-emerald-400">
                  <Camera className="w-4 h-4" />
                  <span className="text-sm font-semibold">Shot-by-Shot Filming Guide</span>
                </div>
                <button
                  onClick={() => copySection(script.shot_guidance, 'shots')}
                  className="text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {copied === 'shots' ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
              <div className="space-y-2">
                {shotLines.map((shot, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3"
                  >
                    <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-sm text-slate-300">{shot}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {script && (
        <AddToCalendarModal
          isOpen={showCalendar}
          onClose={() => setShowCalendar(false)}
          contentType="reel_script"
          contentId={script.id}
          defaultTitle={script.topic}
          contentPreview={script.sections?.hook || script.script?.slice(0, 150)}
        />
      )}
    </div>
  );
}
