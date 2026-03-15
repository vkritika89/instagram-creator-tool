import { useState, useRef } from 'react';
import { apiPost, apiGet, apiGetVideoBlobUrl, ensureSession } from '../lib/api';
import { MessageSquareText, Sparkles, Copy, Check, Hash, Film, Video, Loader2, Download, Play } from 'lucide-react';
import toast from 'react-hot-toast';

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

export default function CaptionsHashtags() {
  const [videoDescription, setVideoDescription] = useState('');
  const [captionTopic, setCaptionTopic] = useState('');
  const [length, setLength] = useState<'short' | 'medium' | 'long'>('medium');
  const [videoResult, setVideoResult] = useState<VideoResult | null>(null);
  const [captionResult, setCaptionResult] = useState<CaptionResult | null>(null);
  const [videoLoading, setVideoLoading] = useState(false);
  const [captionLoading, setCaptionLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [hashtagsCopied, setHashtagsCopied] = useState(false);

  const pollAbortRef = useRef<AbortController | null>(null);

  const handleGenerateVideo = async () => {
    if (!videoDescription.trim()) {
      toast.error('Please enter a video description');
      return;
    }
    try {
      await ensureSession();
    } catch {
      toast.error('Please log in to continue.');
      return;
    }
    if (videoResult?.videoUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(videoResult.videoUrl);
    }
    setVideoLoading(true);
    setVideoResult({ status: 'generating', message: 'Generating your video with Sora AI...' });
    pollAbortRef.current = new AbortController();

    try {
      const data = await apiPost<VideoResult & { progress?: number }>('/api/video/generate', {
        description: videoDescription.trim(),
      });

      if (data.status === 'failed') {
        setVideoResult({ status: 'failed', message: data.message });
        toast.error(data.message ?? 'Video generation failed');
        return;
      }

      if (data.status === 'completed' && data.videoUrl) {
        const blobUrl = await apiGetVideoBlobUrl(`/api/video/content/${data.videoId}`);
        setVideoResult({
          status: 'completed',
          videoId: data.videoId,
          videoUrl: blobUrl,
          message: 'Video generated successfully!',
        });
        toast.success('Video generated successfully!');
        setVideoLoading(false);
        return;
      }

      let current = { ...data };
      const poll = async (): Promise<void> => {
        if (pollAbortRef.current?.signal.aborted) return;
        const statusData = await apiGet<VideoResult & { progress?: number }>(
          `/api/video/status/${current.videoId}`
        );
        if (pollAbortRef.current?.signal.aborted) return;

        if (statusData.status === 'completed' && statusData.videoId) {
          const blobUrl = await apiGetVideoBlobUrl(`/api/video/content/${statusData.videoId}`);
          setVideoResult({
            status: 'completed',
            videoId: statusData.videoId,
            videoUrl: blobUrl,
            message: 'Video generated successfully!',
          });
          toast.success('Video generated successfully!');
          return;
        }
        if (statusData.status === 'failed') {
          setVideoResult({ status: 'failed', message: statusData.message });
          toast.error(statusData.message ?? 'Video generation failed');
          return;
        }
        setVideoResult({
          status: 'generating',
          videoId: statusData.videoId,
          message: `Generating... ${statusData.progress ?? 0}%`,
        });
        setTimeout(() => poll(), 2500);
      };
      setVideoResult({
        status: 'generating',
        videoId: data.videoId,
        message: data.message ?? 'Generating your video with Sora AI...',
      });
      await poll();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to generate video';
      setVideoResult({ status: 'failed', message });
      toast.error(message);
    } finally {
      setVideoLoading(false);
      pollAbortRef.current = null;
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
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Video className="w-6 h-6 text-pink-500" />
          Video Generation & Caption
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Generate AI-powered videos with Sora and get matching captions & hashtags.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── Left: Video Generation ── */}
        <div className="space-y-6">
          {/* Video Description Input */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Film className="w-5 h-5 text-pink-500" />
              <h2 className="text-lg font-bold text-slate-900">Generate Video</h2>
            </div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Video Description
            </label>
            <textarea
              value={videoDescription}
              onChange={(e) => setVideoDescription(e.target.value)}
              placeholder="e.g., 'A fitness coach demonstrating a morning workout routine in a bright, modern gym. Show energy, motivation, and clear exercise movements.'"
              rows={5}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 resize-none transition-colors"
            />
            <p className="text-xs text-slate-400 mt-2">
              Describe your video in detail. The more specific, the better the result.
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
          </div>

          {/* Video Preview */}
          {(videoResult || videoLoading) && (
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Video className="w-5 h-5 text-pink-500" />
                <h3 className="text-sm font-semibold text-slate-700">Video Preview</h3>
              </div>
              
              {videoLoading || videoResult?.status === 'generating' ? (
                <div className="aspect-video bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-pink-200">
                  <Loader2 className="w-12 h-12 text-pink-400 animate-spin mb-3" />
                  <p className="text-sm font-medium text-pink-600">Generating your video...</p>
                  <p className="text-xs text-pink-400 mt-1">This may take a few moments</p>
                </div>
              ) : videoResult?.status === 'completed' ? (
                <div className="space-y-3">
                  {videoResult.videoUrl ? (
                    <div className="aspect-video bg-slate-900 rounded-xl overflow-hidden">
                      <video
                        src={videoResult.videoUrl}
                        controls
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-gradient-to-br from-pink-100 to-rose-100 rounded-xl flex flex-col items-center justify-center border border-pink-200">
                      <div className="w-16 h-16 bg-white/80 rounded-full flex items-center justify-center mb-3 shadow-lg">
                        <Play className="w-8 h-8 text-pink-500 ml-1" fill="currentColor" />
                      </div>
                      <p className="text-sm font-medium text-slate-700 mb-1">Video generated</p>
                      <p className="text-xs text-slate-500">Loading playback…</p>
                    </div>
                  )}
                  <div className="flex gap-2">
                    {videoResult.videoUrl && (
                      <a
                        href={videoResult.videoUrl}
                        download="sora-video.mp4"
                        className="flex-1 px-4 py-2 bg-pink-50 text-pink-600 rounded-lg text-sm font-medium hover:bg-pink-100 transition-colors flex items-center justify-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </a>
                    )}
                    <button
                      onClick={() => {
                        setCaptionTopic(videoDescription);
                        toast.success('Video description copied to caption field');
                      }}
                      className="flex-1 px-4 py-2 bg-slate-50 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors"
                    >
                      Use for Captions
                    </button>
                  </div>
                </div>
              ) : videoResult?.status === 'failed' ? (
                <div className="aspect-video bg-red-50 rounded-xl flex flex-col items-center justify-center border border-red-200">
                  <p className="text-sm font-medium text-red-600 mb-1">Generation Failed</p>
                  <p className="text-xs text-red-400">{videoResult.message}</p>
                </div>
              ) : null}
            </div>
          )}
        </div>

        {/* ── Right: Caption & Hashtag Generation ── */}
        <div className="space-y-6">
          {/* Caption Input */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquareText className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-bold text-slate-900">Generate Captions</h2>
            </div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Post topic or use video description
            </label>
            <textarea
              value={captionTopic}
              onChange={(e) => setCaptionTopic(e.target.value)}
              placeholder={videoDescription || "e.g., 'A transformation photo of my client's fitness journey'"}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 resize-none transition-colors"
            />

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-4 gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600">Length:</span>
                {(['short', 'medium', 'long'] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLength(l)}
                    className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors capitalize ${
                      length === l
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
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
              <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                  <MessageSquareText className="w-4 h-4 text-amber-500" />
                  Caption Variants
                </h3>
                <div className="space-y-3">
                  {captionResult.variants.map((caption, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-50 rounded-xl p-4 hover:bg-slate-100 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-slate-400 bg-white px-2.5 py-1 rounded-full">
                          Variant {idx + 1}
                        </span>
                        <button
                          onClick={() => copyCaption(caption, idx)}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-500 hover:bg-amber-50 hover:text-amber-600 transition-colors"
                        >
                          {copiedIdx === idx ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-green-500" /> Copied
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" /> Copy
                            </>
                          )}
                        </button>
                      </div>
                      <p className="text-slate-700 text-sm whitespace-pre-line leading-relaxed">
                        {caption}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hashtag pack */}
              <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Hash className="w-4 h-4 text-brand-500" />
                    <span className="text-sm font-semibold text-slate-700">
                      Hashtag Pack ({captionResult.hashtags.length} hashtags)
                    </span>
                  </div>
                  <button
                    onClick={copyHashtags}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:bg-brand-50 hover:text-brand-600 transition-colors"
                  >
                    {hashtagsCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-green-500" /> Copied
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
                      className="text-xs bg-brand-50 text-brand-600 px-2.5 py-1 rounded-lg cursor-pointer hover:bg-brand-100 transition-colors"
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
            </div>
          )}
        </div>
      </div>

      {/* ── Quick Tips ── */}
      <div className="mt-8 bg-gradient-to-r from-pink-50 to-amber-50 rounded-2xl border border-pink-100 p-6">
        <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-pink-500" />
          Pro Tips
        </h3>
        <ul className="space-y-2 text-sm text-slate-600">
          <li className="flex items-start gap-2">
            <span className="text-pink-500 mt-0.5">•</span>
            <span><strong>Video descriptions:</strong> Be specific about scenes, actions, mood, and style for best results.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-pink-500 mt-0.5">•</span>
            <span><strong>Captions:</strong> Use the video description to auto-generate matching captions, or write your own topic.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-pink-500 mt-0.5">•</span>
            <span><strong>Hashtags:</strong> Generated based on your niche and content topic for maximum reach.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
