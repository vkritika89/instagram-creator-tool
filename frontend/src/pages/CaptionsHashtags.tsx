import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiPost, apiGet } from '../lib/api';
import { MessageSquareText, Sparkles, Copy, Check, Hash, Film, Video, Loader2, Download, Play, CalendarPlus, Lock, Crown } from 'lucide-react';
import toast from 'react-hot-toast';
import AddToCalendarModal from '../components/AddToCalendarModal';

interface CaptionResult {
  id: string;
  topic: string;
  variants: string[];
  hashtags: string[];
  created_at: string;
}

interface VideoResult {
  videoUrl?: string;
  videoId?: string;
  status: 'generating' | 'completed' | 'failed';
  message?: string;
}

interface Usage {
  used: number;
  limit: number;
  isPaid: boolean;
  canGenerate: boolean;
}

export default function CaptionsHashtags() {
  const navigate = useNavigate();
  const [videoDescription, setVideoDescription] = useState('');
  const [captionTopic, setCaptionTopic] = useState('');
  const [length, setLength] = useState<'short' | 'medium' | 'long'>('medium');
  const [videoResult, setVideoResult] = useState<VideoResult | null>(null);
  const [captionResult, setCaptionResult] = useState<CaptionResult | null>(null);
  const [videoLoading, setVideoLoading] = useState(false);
  const [captionLoading, setCaptionLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [hashtagsCopied, setHashtagsCopied] = useState(false);
  const [showVideoCalendar, setShowVideoCalendar] = useState(false);
  const [showCaptionCalendar, setShowCaptionCalendar] = useState(false);
  const [usage, setUsage] = useState<Usage | null>(null);

  useEffect(() => {
    apiGet<Usage>('/api/video/usage')
      .then(setUsage)
      .catch(() => {});
  }, []);

  const handleGenerateVideo = async () => {
    if (!videoDescription.trim()) {
      toast.error('Please enter a video description');
      return;
    }
    if (usage && !usage.canGenerate) return;

    setVideoLoading(true);
    setVideoResult({ status: 'generating', message: 'Generating your video with Sora AI...' });

    try {
      await apiPost('/api/video/generate', { description: videoDescription.trim() });

      // Update usage count locally
      setUsage(prev => prev ? {
        ...prev,
        used: prev.used + 1,
        canGenerate: prev.isPaid || (prev.used + 1) < prev.limit,
      } : null);

      // Simulate video generation (replace with real Sora/video API when ready)
      await new Promise(resolve => setTimeout(resolve, 3000));
      setVideoResult({ status: 'completed', videoId: 'generated', message: 'Video generation queued!' });
      toast.success('Video generation queued successfully!');
    } catch (err: unknown) {
      const apiErr = err as { status?: number; message?: string };
      if (apiErr?.status === 403) {
        // Refetch to get latest state
        apiGet<Usage>('/api/video/usage').then(setUsage).catch(() => {});
        toast.error('Free limit reached. Please upgrade to continue.');
        setVideoResult(null);
      } else {
        const message = apiErr?.message || 'Failed to generate video';
        setVideoResult({ status: 'failed', message });
        toast.error(message);
      }
    } finally {
      setVideoLoading(false);
    }
  };

  const handleGenerateCaptions = async () => {
    const topic = captionTopic.trim() || videoDescription.trim();
    if (!topic) {
      toast.error('Please enter a topic or generate a video first');
      return;
    }
    setCaptionLoading(true);
    try {
      const data = await apiPost<CaptionResult>('/api/captions/generate', {
        topic,
        length,
      });
      setCaptionResult(data);
      toast.success('Captions generated!');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to generate captions';
      toast.error(message);
    } finally {
      setCaptionLoading(false);
    }
  };

  const copyCaption = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    toast.success('Caption copied!');
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const copyHashtags = () => {
    if (!captionResult) return;
    navigator.clipboard.writeText(captionResult.hashtags.join(' '));
    setHashtagsCopied(true);
    toast.success('Hashtags copied!');
    setTimeout(() => setHashtagsCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Video className="w-6 h-6 text-pink-400" />
          Video Generation & Caption
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Generate AI-powered videos with Sora and get matching captions & hashtags.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── Left: Video Generation ── */}
        <div className="space-y-6">
          {/* Video Description Input */}
          <div className="bg-[#13131f] rounded-2xl border border-white/[0.07] p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Film className="w-5 h-5 text-pink-400" />
                <h2 className="text-lg font-bold text-white">Generate Video</h2>
              </div>
              {/* Usage meter */}
              {usage && !usage.isPaid && (
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {Array.from({ length: usage.limit }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-2.5 h-2.5 rounded-full ${i < usage.used ? 'bg-pink-500' : 'bg-white/15'}`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-slate-500 font-medium">
                    {usage.used}/{usage.limit} free
                  </span>
                </div>
              )}
              {usage?.isPaid && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-300 bg-brand-500/10 border border-brand-500/20 px-2.5 py-1 rounded-full">
                  <Crown className="w-3 h-3 text-amber-400" /> Unlimited
                </span>
              )}
            </div>

            {/* Locked state */}
            {usage && !usage.canGenerate ? (
              <div className="text-center py-8 px-4">
                <div className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                  <Lock className="w-6 h-6 text-slate-500" />
                </div>
                <p className="text-sm font-semibold text-white mb-1">Free limit reached</p>
                <p className="text-xs text-slate-500 mb-5">
                  You've used all {usage.limit} free video generations. Upgrade to keep creating.
                </p>
                <button
                  onClick={() => navigate('/pricing')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-pink-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-md shadow-brand-500/30"
                >
                  <Crown className="w-4 h-4" /> View Plans
                </button>
              </div>
            ) : (
              <>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Video Description
                </label>
                <textarea
                  value={videoDescription}
                  onChange={(e) => setVideoDescription(e.target.value)}
                  placeholder="e.g., 'A fitness coach demonstrating a morning workout routine in a bright, modern gym. Show energy, motivation, and clear exercise movements.'"
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl border border-white/10 bg-[#1c1c2e] text-white placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/30 focus:border-pink-500/60 resize-none transition-colors"
                />
                <p className="text-xs text-slate-500 mt-2">
                  Describe your video in detail. The more specific, the better the result.
                  {usage && !usage.isPaid && (
                    <span className="text-pink-400 font-medium ml-1">
                      {usage.limit - usage.used} generation{usage.limit - usage.used !== 1 ? 's' : ''} remaining.
                    </span>
                  )}
                </p>
                <button
                  onClick={handleGenerateVideo}
                  disabled={videoLoading || !videoDescription.trim()}
                  className="w-full mt-4 px-5 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2"
                >
                  {videoLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating video...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Generate Video with Sora AI
                    </>
                  )}
                </button>
              </>
            )}
          </div>

          {/* Video Preview */}
          {(videoResult || videoLoading) && (
            <div className="bg-[#13131f] rounded-2xl border border-white/[0.07] p-6">
              <div className="flex items-center gap-2 mb-4">
                <Video className="w-5 h-5 text-pink-400" />
                <h3 className="text-sm font-semibold text-slate-300">Video Preview</h3>
              </div>
              
              {videoLoading || videoResult?.status === 'generating' ? (
                <div className="aspect-video bg-pink-500/10 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-pink-500/30">
                  <Loader2 className="w-12 h-12 text-pink-400 animate-spin mb-3" />
                  <p className="text-sm font-medium text-pink-300">Generating your video...</p>
                  <p className="text-xs text-pink-500 mt-1">This may take a few moments</p>
                </div>
              ) : videoResult?.status === 'completed' ? (
                <div className="space-y-3">
                  {videoResult.videoUrl ? (
                    <div className="aspect-video bg-black rounded-xl overflow-hidden">
                      <video
                        src={videoResult.videoUrl}
                        controls
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-pink-500/10 rounded-xl flex flex-col items-center justify-center border border-pink-500/20">
                      <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-3 shadow-lg border border-white/10">
                        <Play className="w-8 h-8 text-pink-400 ml-1" fill="currentColor" />
                      </div>
                      <p className="text-sm font-medium text-white mb-1">Video Generated!</p>
                      <p className="text-xs text-slate-500">Video URL will appear here when backend is ready</p>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <button className="flex-1 px-4 py-2 bg-pink-500/10 border border-pink-500/20 text-pink-400 rounded-lg text-sm font-medium hover:bg-pink-500/20 transition-colors flex items-center justify-center gap-2">
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                    <button
                      onClick={() => {
                        setCaptionTopic(videoDescription);
                        toast.success('Video description copied to caption field');
                      }}
                      className="flex-1 px-4 py-2 bg-white/5 border border-white/10 text-slate-300 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors"
                    >
                      Use for Captions
                    </button>
                  </div>
                  <button
                    onClick={() => setShowVideoCalendar(true)}
                    className="w-full mt-2 px-4 py-2 rounded-lg bg-gradient-to-r from-brand-600 to-pink-500 text-white text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  >
                    <CalendarPlus className="w-4 h-4" />
                    Add to Calendar
                  </button>
                </div>
              ) : videoResult?.status === 'failed' ? (
                <div className="aspect-video bg-red-500/10 rounded-xl flex flex-col items-center justify-center border border-red-500/20">
                  <p className="text-sm font-medium text-red-400 mb-1">Generation Failed</p>
                  <p className="text-xs text-red-500">{videoResult.message}</p>
                </div>
              ) : null}
            </div>
          )}
        </div>

        {/* ── Right: Caption & Hashtag Generation ── */}
        <div className="space-y-6">
          {/* Caption Input */}
          <div className="bg-[#13131f] rounded-2xl border border-white/[0.07] p-6">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquareText className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-bold text-white">Generate Captions</h2>
            </div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Post topic or use video description
            </label>
            <textarea
              value={captionTopic}
              onChange={(e) => setCaptionTopic(e.target.value)}
              placeholder={videoDescription || "e.g., 'A transformation photo of my client's fitness journey'"}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-white/10 bg-[#1c1c2e] text-white placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/60 resize-none transition-colors"
            />

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-4 gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-400">Length:</span>
                {(['short', 'medium', 'long'] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLength(l)}
                    className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors capitalize ${
                      length === l
                        ? 'bg-amber-500/15 border border-amber-500/30 text-amber-400'
                        : 'bg-white/5 border border-white/10 text-slate-500 hover:bg-white/10 hover:text-slate-300'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
              <button
                onClick={handleGenerateCaptions}
                disabled={captionLoading || (!captionTopic.trim() && !videoDescription.trim())}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center gap-2"
              >
                <Sparkles className={`w-4 h-4 ${captionLoading ? 'animate-spin' : ''}`} />
                {captionLoading ? 'Generating…' : 'Generate captions'}
              </button>
            </div>
          </div>

          {/* Caption Results */}
          {captionResult && (
            <div className="space-y-4">
              {/* Caption variants */}
              <div className="bg-[#13131f] rounded-2xl border border-white/[0.07] p-6">
                <h3 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
                  <MessageSquareText className="w-4 h-4 text-amber-400" />
                  Caption Variants
                </h3>
                <div className="space-y-3">
                  {captionResult.variants.map((caption, idx) => (
                    <div
                      key={idx}
                      className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4 hover:bg-white/[0.06] transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-slate-500 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">
                          Variant {idx + 1}
                        </span>
                        <button
                          onClick={() => copyCaption(caption, idx)}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-500 hover:bg-amber-500/10 hover:text-amber-400 transition-colors"
                        >
                          {copiedIdx === idx ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-green-400" /> Copied
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" /> Copy
                            </>
                          )}
                        </button>
                      </div>
                      <p className="text-slate-300 text-sm whitespace-pre-line leading-relaxed">
                        {caption}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hashtag pack */}
              <div className="bg-[#13131f] rounded-2xl border border-white/[0.07] p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Hash className="w-4 h-4 text-brand-400" />
                    <span className="text-sm font-semibold text-slate-300">
                      Hashtag Pack ({captionResult.hashtags.length} hashtags)
                    </span>
                  </div>
                  <button
                    onClick={copyHashtags}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:bg-brand-500/10 hover:text-brand-400 transition-colors"
                  >
                    {hashtagsCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-green-400" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy all
                      </>
                    )}
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {captionResult.hashtags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-xs bg-brand-500/10 border border-brand-500/20 text-brand-400 px-2.5 py-1 rounded-lg cursor-pointer hover:bg-brand-500/20 transition-colors"
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

              {/* Add caption to calendar */}
              <button
                onClick={() => setShowCaptionCalendar(true)}
                className="w-full px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <CalendarPlus className="w-4 h-4" />
                Add to Calendar
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Calendar modals */}
      <AddToCalendarModal
        isOpen={showVideoCalendar}
        onClose={() => setShowVideoCalendar(false)}
        contentType="video"
        contentId={videoResult?.videoId}
        defaultTitle={videoDescription}
        contentPreview={videoDescription}
      />
      <AddToCalendarModal
        isOpen={showCaptionCalendar}
        onClose={() => setShowCaptionCalendar(false)}
        contentType="caption"
        contentId={captionResult?.id}
        defaultTitle={captionResult?.topic || captionTopic}
        contentPreview={captionResult?.variants?.[0]?.slice(0, 150) || ''}
      />

      {/* ── Quick Tips ── */}
      <div className="mt-8 bg-gradient-to-r from-pink-500/10 to-amber-500/10 rounded-2xl border border-pink-500/20 p-6">
        <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-pink-400" />
          Pro Tips
        </h3>
        <ul className="space-y-2 text-sm text-slate-400">
          <li className="flex items-start gap-2">
            <span className="text-pink-400 mt-0.5">•</span>
            <span><strong className="text-slate-300">Video descriptions:</strong> Be specific about scenes, actions, mood, and style for best results.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-pink-400 mt-0.5">•</span>
            <span><strong className="text-slate-300">Captions:</strong> Use the video description to auto-generate matching captions, or write your own topic.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-pink-400 mt-0.5">•</span>
            <span><strong className="text-slate-300">Hashtags:</strong> Generated based on your niche and content topic for maximum reach.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
