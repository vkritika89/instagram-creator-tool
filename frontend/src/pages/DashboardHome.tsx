import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiGet } from '../lib/api';
import {
  CalendarDays, Film, MessageSquareText, Sparkles, ArrowRight,
  Heart, MessageCircle, Bookmark, Eye, Flame, Clock, Users, Hash,
  ChevronLeft, ChevronRight, Share2, Mic,
} from 'lucide-react';

interface Stats {
  weeklyPlansCount: number;
  reelScriptsCount: number;
  captionsCount: number;
}

// Google's publicly hosted sample videos — no CORS, guaranteed to play
// Hooks are written to match the actual visual content of each video
const REELS = [
  {
    video: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    // Video: fire/explosion action scene
    hook: 'Make your content this 🔥 — here\'s the formula',
    creator: 'Dev R.',
    handle: '@dev.r.digital',
    views: '56.8K',
    likes: '4.7K',
    comments: '381',
    type: 'Creator Tips',
    audio: 'Trending Sound – Viral Beat',
  },
  {
    video: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    // Video: adventure/outdoor escape scene
    hook: 'Filmed this whole trip with just my phone 🌍',
    creator: 'Zara N.',
    handle: '@zara.travels',
    views: '89.2K',
    likes: '7.3K',
    comments: '612',
    type: 'Travel',
    audio: 'Adventure Awaits – Indie Mix',
  },
  {
    video: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    // Video: fun/energetic entertainment
    hook: 'Creating content should feel THIS good 🎉',
    creator: 'Luna W.',
    handle: '@luna.creates',
    views: '31.2K',
    likes: '2.8K',
    comments: '203',
    type: 'Lifestyle',
    audio: 'Good Vibes – Upbeat Mix',
  },
  {
    video: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    // Video: joyride / driving lifestyle
    hook: 'I create all my content during this daily drive 🚗',
    creator: 'Mike J.',
    handle: '@mikej.onthego',
    views: '24.5K',
    likes: '1.9K',
    comments: '147',
    type: 'Vlog',
    audio: 'Road Trip Vibes – Chill FM',
  },
  {
    video: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    // Video: dramatic/intense action
    hook: 'When your reel flops… watch this 💀',
    creator: 'Alex M.',
    handle: '@alexm.creates',
    views: '42.1K',
    likes: '3.4K',
    comments: '214',
    type: 'Creator Tips',
    audio: 'Original Audio – Alex M.',
  },
  {
    video: 'https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
    // Video: off-road / outdoor adventure drive
    hook: 'Day in my life as a full-time creator 📍',
    creator: 'Tom H.',
    handle: '@tomh.outdoor',
    views: '37.4K',
    likes: '5.1K',
    comments: '299',
    type: 'Day-in-Life',
    audio: 'Wanderlust – Ambient Mix',
  },
  {
    video: 'https://storage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
    // Video: car review / test drive vlog
    hook: 'POV: You finally quit your job to create content 🎬',
    creator: 'Chris L.',
    handle: '@chrisl.reviews',
    views: '71.8K',
    likes: '6.4K',
    comments: '488',
    type: 'Vlog',
    audio: 'Dreaming Big – Motivational',
  },
  {
    video: 'https://storage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    // Video: group of people on an adventure/road trip together
    hook: 'How I built a community of 50K from zero 🙌',
    creator: 'Sarah K.',
    handle: '@sarahk.community',
    views: '53.2K',
    likes: '4.1K',
    comments: '376',
    type: 'Community',
    audio: 'Together We Rise – Collab Mix',
  },
];

const TYPE_COLORS: Record<string, string> = {
  'Creator Tips': 'bg-violet-500/20 text-violet-300 border-violet-500/30',
  Travel: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
  Lifestyle: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
  Vlog: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  'Day-in-Life': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  Community: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
};

const TIPS = [
  { icon: Flame, text: 'Post Reels between 7–9 AM for max reach', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
  { icon: Hash, text: 'Use 5–10 niche hashtags, not 30 random ones', color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
  { icon: Clock, text: 'First 3 seconds determine 80% of retention', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  { icon: Users, text: 'Reply to every comment in the first hour', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  { icon: Bookmark, text: 'Carousels get 3× more saves than single images', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  { icon: Sparkles, text: 'Clear CTA — "Save this" gets 2× more engagement', color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/20' },
];

function VideoCard({
  reel,
  isActive,
  isSmall,
  onClick,
}: {
  reel: (typeof REELS)[0];
  isActive?: boolean;
  isSmall?: boolean;
  onClick?: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isActive || isSmall) {
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [isActive, isSmall]);

  if (isSmall) {
    return (
      <button
        onClick={onClick}
        className={`relative aspect-[9/16] rounded-xl overflow-hidden transition-all duration-300 group ${
          isActive ? 'ring-2 ring-brand-500 scale-[0.93]' : 'opacity-60 hover:opacity-100 hover:scale-[0.93]'
        }`}
      >
        <video
          ref={videoRef}
          src={reel.video}
          muted
          loop
          playsInline
          preload="metadata"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <span className="absolute bottom-1.5 left-1.5 right-1.5 text-[9px] text-white font-semibold leading-tight line-clamp-2">
          {reel.hook}
        </span>
        {isActive && (
          <div className="absolute top-1.5 right-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 block animate-pulse" />
          </div>
        )}
      </button>
    );
  }

  return (
    <div className="relative w-full h-full rounded-3xl overflow-hidden bg-slate-900">
      <video
        ref={videoRef}
        src={reel.video}
        muted
        loop
        playsInline
        autoPlay
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-black/20" />

      {/* Type badge */}
      <div className="absolute top-4 left-4">
        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border backdrop-blur-sm ${TYPE_COLORS[reel.type] || 'bg-white/20 text-white border-white/30'}`}>
          {reel.type}
        </span>
      </div>

      {/* Right actions */}
      <div className="absolute right-4 bottom-28 flex flex-col items-center gap-5">
        <div className="flex flex-col items-center gap-1">
          <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <span className="text-white text-[10px] font-semibold">{reel.likes}</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <span className="text-white text-[10px] font-semibold">{reel.comments}</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center">
            <Share2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-white text-[10px] font-semibold">Share</span>
        </div>
        <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center">
          <Bookmark className="w-5 h-5 text-white" />
        </div>
      </div>

      {/* Bottom info */}
      <div className="absolute bottom-5 left-4 right-16">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-pink-500 to-brand-600 flex items-center justify-center text-white text-[10px] font-extrabold ring-2 ring-white/20">
            {reel.creator.charAt(0)}
          </div>
          <span className="text-white text-xs font-bold">{reel.handle}</span>
          <span className="text-white/60 text-[10px] border border-white/25 px-2 py-0.5 rounded-full">Follow</span>
        </div>
        <p className="text-white text-sm font-semibold leading-snug mb-2.5 drop-shadow-md">
          {reel.hook}
        </p>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full border-2 border-white/40 flex items-center justify-center">
            <Mic className="w-2 h-2 text-white/70" />
          </div>
          <span className="text-white/60 text-[10px] truncate">{reel.audio}</span>
        </div>
      </div>

      {/* View count */}
      <div className="absolute top-4 right-4 flex items-center gap-1 bg-black/30 backdrop-blur-sm rounded-full px-2 py-0.5">
        <Eye className="w-3 h-3 text-white/70" />
        <span className="text-white/70 text-[10px] font-semibold">{reel.views}</span>
      </div>
    </div>
  );
}

export default function DashboardHome() {
  const { user, profile, demoMode } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [activeReel, setActiveReel] = useState(0);
  const [liked, setLiked] = useState<Set<number>>(new Set());

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split('@')[0] ||
    'Creator';

  useEffect(() => {
    if (demoMode) {
      setStats({ weeklyPlansCount: 4, reelScriptsCount: 12, captionsCount: 8 });
      return;
    }
    const t = setTimeout(() => setStats({ weeklyPlansCount: 0, reelScriptsCount: 0, captionsCount: 0 }), 5000);
    apiGet<Stats>('/api/stats')
      .then((d) => { clearTimeout(t); setStats(d); })
      .catch(() => { clearTimeout(t); setStats({ weeklyPlansCount: 0, reelScriptsCount: 0, captionsCount: 0 }); });
    return () => clearTimeout(t);
  }, [demoMode]);

  const reel = REELS[activeReel];
  const prev = () => setActiveReel((i) => (i - 1 + REELS.length) % REELS.length);
  const next = () => setActiveReel((i) => (i + 1) % REELS.length);
  const toggleLike = () =>
    setLiked((s) => { const n = new Set(s); n.has(activeReel) ? n.delete(activeReel) : n.add(activeReel); return n; });

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-12">

      {/* ── Welcome bar ── */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500 font-medium">
            {new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 17 ? 'Good afternoon' : 'Good evening'}
          </p>
          <h1 className="text-2xl font-extrabold text-white mt-0.5">Hey, {displayName} 👋</h1>
          {profile?.niche && (
            <p className="text-sm text-slate-400 mt-1">
              Your <span className="text-brand-400 font-semibold">{profile.niche}</span> content hub
            </p>
          )}
        </div>
        <Link
          to="/dashboard/reel-scripts"
          className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-brand-600 to-pink-500 text-white rounded-2xl text-sm font-bold hover:opacity-90 transition-opacity shadow-lg shadow-brand-500/30"
        >
          <Sparkles className="w-4 h-4" /> Create Reel Script
        </Link>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Reel Scripts', value: stats?.reelScriptsCount ?? '—', icon: Film, color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/20' },
          { label: 'Captions', value: stats?.captionsCount ?? '—', icon: MessageSquareText, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
          { label: 'Scheduled', value: stats?.weeklyPlansCount ?? '—', icon: CalendarDays, color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
        ].map((s) => (
          <div key={s.label} className={`bg-[#13131f] border ${s.border} rounded-2xl p-4 flex items-center gap-3`}>
            <div className={`w-9 h-9 ${s.bg} rounded-xl flex items-center justify-center shrink-0`}>
              <s.icon className={`w-4 h-4 ${s.color}`} />
            </div>
            <div>
              <p className="text-xl font-extrabold text-white leading-none">{s.value}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Creator Reel Showcase ── */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Film className="w-5 h-5 text-pink-400" /> Trending Creator Reels
          </h2>
          <Link to="/dashboard/reel-scripts" className="text-sm text-brand-400 font-semibold hover:underline flex items-center gap-1">
            Create yours <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5">

          {/* ── Featured reel (video, no phone frame) ── */}
          <div className="flex flex-col gap-4">
            <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl shadow-slate-900/25">
              <VideoCard reel={reel} isActive key={activeReel} />
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between px-1">
              <button
                onClick={prev}
                className="w-10 h-10 bg-[#13131f] border border-white/10 rounded-full flex items-center justify-center hover:bg-white/10 transition-all"
              >
                <ChevronLeft className="w-4 h-4 text-slate-400" />
              </button>
              <div className="flex gap-2">
                {REELS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveReel(i)}
                    className={`rounded-full transition-all duration-300 ${
                      i === activeReel ? 'w-6 h-2.5 bg-brand-500' : 'w-2.5 h-2.5 bg-white/15 hover:bg-white/30'
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={next}
                className="w-10 h-10 bg-[#13131f] border border-white/10 rounded-full flex items-center justify-center hover:bg-white/10 transition-all"
              >
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>

          {/* ── Right panel ── */}
          <div className="flex flex-col gap-4">
            {/* Active reel info */}
            <div className="bg-[#13131f] border border-white/[0.07] rounded-2xl p-5">
              <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full mb-3 bg-pink-500/10 text-pink-400">
                {reel.type}
              </span>
              <h3 className="text-sm font-bold text-white leading-snug mb-3">{reel.hook}</h3>
              <div className="flex items-center gap-3 text-xs text-slate-500 mb-4 flex-wrap">
                <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {reel.views}</span>
                <span
                  className={`flex items-center gap-1 cursor-pointer transition-colors ${liked.has(activeReel) ? 'text-red-400' : ''}`}
                  onClick={toggleLike}
                >
                  <Heart className={`w-3.5 h-3.5 ${liked.has(activeReel) ? 'fill-red-400 text-red-400' : ''}`} />
                  {reel.likes}
                </span>
                <span className="flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5" /> {reel.comments}</span>
              </div>
              <Link
                to="/dashboard/reel-scripts"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-pink-500 text-white text-xs font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5" /> Write a script like this
              </Link>
            </div>

            {/* Thumbnail grid — small videos */}
            <div className="bg-[#13131f] border border-white/[0.07] rounded-2xl p-4 flex-1">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">All Reels</p>
              <div className="grid grid-cols-4 gap-2">
                {REELS.map((r, i) => (
                  <VideoCard
                    key={i}
                    reel={r}
                    isSmall
                    isActive={i === activeReel}
                    onClick={() => setActiveReel(i)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <div>
        <h2 className="text-base font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              title: 'My Calendar',
              description: 'Schedule & track your posts',
              icon: CalendarDays,
              to: '/dashboard/calendar',
              from: 'from-violet-500',
              to_: 'to-purple-600',
              img: 'https://images.unsplash.com/photo-1506784365847-bbad939e9335?w=400&h=200&fit=crop&q=80',
            },
            {
              title: 'Reel Scripts',
              description: 'Viral scripts with hooks & CTAs',
              icon: Film,
              to: '/dashboard/reel-scripts',
              from: 'from-pink-500',
              to_: 'to-rose-600',
              img: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=200&fit=crop&q=80',
            },
            {
              title: 'Video & Caption',
              description: 'Generate videos + captions',
              icon: MessageSquareText,
              to: '/dashboard/captions',
              from: 'from-amber-500',
              to_: 'to-orange-600',
              img: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&h=200&fit=crop&q=80',
            },
          ].map((action) => (
            <Link
              key={action.to}
              to={action.to}
              className="group relative bg-[#13131f] rounded-2xl border border-white/[0.07] overflow-hidden hover:shadow-xl hover:shadow-black/40 hover:border-white/15 transition-all hover:-translate-y-1"
            >
              <div className="h-28 relative overflow-hidden">
                <img
                  src={action.img}
                  alt=""
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className={`absolute inset-0 bg-gradient-to-br ${action.from} ${action.to_} opacity-70`} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <action.icon className="w-8 h-8 text-white drop-shadow-lg" />
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-white text-sm mb-0.5">{action.title}</h3>
                <p className="text-xs text-slate-500">{action.description}</p>
                <div className="mt-2 flex items-center gap-1 text-brand-400 text-xs font-semibold">
                  Open <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Growth Tips ── */}
      <div>
        <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <Flame className="w-4 h-4 text-orange-400" /> Pro Growth Tips
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {TIPS.map((tip, idx) => (
            <div
              key={idx}
              className={`bg-[#13131f] border ${tip.border} rounded-2xl p-4 flex items-start gap-3 hover:border-white/15 transition-all`}
            >
              <div className={`w-9 h-9 ${tip.bg} rounded-xl flex items-center justify-center shrink-0`}>
                <tip.icon className={`w-4 h-4 ${tip.color}`} />
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">{tip.text}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
