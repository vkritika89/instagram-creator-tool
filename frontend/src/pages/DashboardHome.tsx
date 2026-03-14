import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiGet } from '../lib/api';
import {
  CalendarDays,
  Film,
  MessageSquareText,
  Sparkles,
  ArrowRight,
  Zap,
  Heart,
  MessageCircle,
  Bookmark,
  Play,
  Eye,
  Target,
  Flame,
  Clock,
  Users,
  Star,
  CheckCircle2,
  Hash,
} from 'lucide-react';

interface Stats {
  weeklyPlansCount: number;
  reelScriptsCount: number;
  captionsCount: number;
}

// Big pool of creator reels for the infinite marquee
const CREATOR_REELS_ROW1 = [
  { gradient: 'from-pink-500 via-rose-500 to-red-500', hook: '3 mistakes killing your IG growth', creator: 'Sarah K.', avatar: 'S', views: '24.5K', likes: '1.2K', type: 'Reel', emoji: '🔥' },
  { gradient: 'from-violet-500 via-purple-500 to-indigo-500', hook: 'How I gained 5K followers in 30 days', creator: 'Alex M.', avatar: 'A', views: '42.1K', likes: '3.4K', type: 'Reel', emoji: '🚀' },
  { gradient: 'from-amber-500 via-orange-500 to-red-500', hook: 'The caption formula that went viral', creator: 'Priya D.', avatar: 'P', views: '18.7K', likes: '2.1K', type: 'Carousel', emoji: '✍️' },
  { gradient: 'from-emerald-500 via-teal-500 to-cyan-500', hook: 'Stop scrolling. Start creating.', creator: 'Mike J.', avatar: 'M', views: '31.2K', likes: '2.8K', type: 'Reel', emoji: '💡' },
  { gradient: 'from-blue-500 via-indigo-500 to-violet-500', hook: 'My morning routine as a creator', creator: 'Luna W.', avatar: 'L', views: '15.3K', likes: '987', type: 'Story', emoji: '📱' },
  { gradient: 'from-rose-500 via-pink-500 to-fuchsia-500', hook: 'My exact content strategy for 2026', creator: 'Dev R.', avatar: 'D', views: '56.8K', likes: '4.7K', type: 'Carousel', emoji: '🎯' },
  { gradient: 'from-cyan-500 via-blue-500 to-indigo-500', hook: 'POV: Your Reel hits 1M views', creator: 'Zara N.', avatar: 'Z', views: '89.2K', likes: '7.3K', type: 'Reel', emoji: '🤯' },
  { gradient: 'from-yellow-500 via-amber-500 to-orange-500', hook: 'Hook formula that gets saves', creator: 'Tom H.', avatar: 'T', views: '37.4K', likes: '5.1K', type: 'Reel', emoji: '🪝' },
];

const CREATOR_REELS_ROW2 = [
  { gradient: 'from-fuchsia-500 via-purple-500 to-violet-500', hook: 'Why your Reels are not getting views', creator: 'Nina C.', avatar: 'N', views: '63.1K', likes: '5.9K', type: 'Reel', emoji: '👀' },
  { gradient: 'from-teal-500 via-emerald-500 to-green-500', hook: '5 niches that are exploding in 2026', creator: 'James P.', avatar: 'J', views: '28.7K', likes: '3.2K', type: 'Carousel', emoji: '📈' },
  { gradient: 'from-red-500 via-rose-500 to-pink-500', hook: 'This CTA doubled my DMs overnight', creator: 'Aisha B.', avatar: 'A', views: '45.3K', likes: '4.1K', type: 'Reel', emoji: '💬' },
  { gradient: 'from-indigo-500 via-blue-500 to-sky-500', hook: 'Building 10K audience from zero', creator: 'Chris L.', avatar: 'C', views: '71.8K', likes: '6.4K', type: 'Reel', emoji: '🏗️' },
  { gradient: 'from-orange-500 via-red-500 to-rose-500', hook: 'The hashtag hack nobody talks about', creator: 'Eva S.', avatar: 'E', views: '22.4K', likes: '1.8K', type: 'Story', emoji: '#️⃣' },
  { gradient: 'from-lime-500 via-green-500 to-emerald-500', hook: 'How I monetized at 3K followers', creator: 'Raj T.', avatar: 'R', views: '52.6K', likes: '4.8K', type: 'Carousel', emoji: '💰' },
  { gradient: 'from-sky-500 via-cyan-500 to-teal-500', hook: 'Content batching: my full workflow', creator: 'Mia K.', avatar: 'M', views: '19.5K', likes: '2.3K', type: 'Reel', emoji: '⚡' },
  { gradient: 'from-purple-500 via-fuchsia-500 to-pink-500', hook: 'Algorithm secrets Instagram won\'t tell', creator: 'Omar F.', avatar: 'O', views: '94.7K', likes: '8.9K', type: 'Reel', emoji: '🤫' },
];

const TIPS = [
  { icon: Flame, text: 'Post Reels between 7-9 AM for max reach', color: 'text-rose-500', bg: 'bg-rose-50' },
  { icon: Hash, text: 'Use 5-10 niche hashtags, not 30 random ones', color: 'text-violet-500', bg: 'bg-violet-50' },
  { icon: Clock, text: 'First 3 seconds of your Reel determine 80% of retention', color: 'text-amber-500', bg: 'bg-amber-50' },
  { icon: Users, text: 'Reply to every comment in the first hour', color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { icon: Star, text: 'Carousel posts get 3x more saves than single images', color: 'text-blue-500', bg: 'bg-blue-50' },
  { icon: Target, text: 'Use a clear CTA — "Save this" gets 2x more engagement', color: 'text-pink-500', bg: 'bg-pink-50' },
];

function ReelCard({ reel }: { reel: typeof CREATOR_REELS_ROW1[0] }) {
  return (
    <div className="flex-shrink-0 w-44 h-72 relative rounded-2xl overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl transition-shadow">
      <div className={`absolute inset-0 bg-gradient-to-br ${reel.gradient}`} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Play overlay */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="w-12 h-12 bg-white/25 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 scale-90 group-hover:scale-100 transition-transform">
          <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
        </div>
      </div>

      {/* Badge */}
      <div className="absolute top-2.5 left-2.5">
        <span className="px-2 py-0.5 bg-black/40 backdrop-blur-sm text-white text-[9px] font-bold rounded-full uppercase tracking-wider">
          {reel.type}
        </span>
      </div>
      <div className="absolute top-2.5 right-2.5 text-lg">{reel.emoji}</div>

      {/* Side icons */}
      <div className="absolute right-2 bottom-20 flex flex-col items-center gap-3 opacity-80">
        <Heart className="w-4 h-4 text-white" />
        <MessageCircle className="w-4 h-4 text-white" />
        <Bookmark className="w-4 h-4 text-white" />
      </div>

      {/* Bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <p className="text-white text-xs font-bold leading-snug mb-1.5 line-clamp-2 drop-shadow-lg">
          {reel.hook}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-white/30 flex items-center justify-center text-[8px] text-white font-bold">
              {reel.avatar}
            </div>
            <span className="text-white/70 text-[9px] font-medium">{reel.creator}</span>
          </div>
          <div className="flex items-center gap-1 text-white/60">
            <Eye className="w-2.5 h-2.5" />
            <span className="text-[8px]">{reel.views}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardHome() {
  const { user, profile, demoMode } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);

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
    apiGet<Stats>('/api/stats')
      .then(setStats)
      .catch(() => setStats({ weeklyPlansCount: 0, reelScriptsCount: 0, captionsCount: 0 }));
  }, [demoMode]);

  const quickActions = [
    { title: 'Weekly Plan', description: 'AI content ideas for this week', icon: CalendarDays, to: '/dashboard/weekly-plan', color: 'from-violet-500 to-purple-600' },
    { title: 'Reel Scripts', description: 'Viral scripts with hooks & CTAs', icon: Film, to: '/dashboard/reel-scripts', color: 'from-pink-500 to-rose-600' },
    { title: 'Video & Caption', description: 'Generate videos + captions', icon: MessageSquareText, to: '/dashboard/captions', color: 'from-amber-500 to-orange-600' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-12">
      {/* ── Welcome banner ── */}
      <div className="relative overflow-hidden bg-gradient-to-r from-brand-600 via-purple-600 to-pink-500 rounded-3xl p-8 md:p-10 text-white">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/3 translate-x-1/4" />
          <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-white/5 rounded-full translate-y-1/3" />
          <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-pink-400/20 rounded-full" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-white/60 text-sm mb-3">
            <Zap className="w-4 h-4 text-yellow-300" />
            <span>Welcome back</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2">Hey, {displayName}! 👋</h1>
          <p className="text-white/70 max-w-lg mb-6">
            {profile?.niche ? (
              <>Your <span className="text-yellow-300 font-semibold">{profile.niche}</span> content hub is ready. Let&apos;s create something that goes viral today.</>
            ) : (
              "Your content hub is ready. Let's create something that goes viral today."
            )}
          </p>
          <Link
            to="/dashboard/weekly-plan"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-brand-700 rounded-xl text-sm font-bold hover:bg-white/90 transition-all hover:shadow-lg shadow-black/10"
          >
            <Sparkles className="w-4 h-4" /> Generate this week&apos;s plan <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* ── Stats row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Weekly Plans', value: stats?.weeklyPlansCount ?? 0, icon: CalendarDays, color: 'text-violet-600', bg: 'bg-violet-50' },
          { label: 'Reel Scripts', value: stats?.reelScriptsCount ?? 0, icon: Film, color: 'text-pink-600', bg: 'bg-pink-50' },
          { label: 'Captions', value: stats?.captionsCount ?? 0, icon: MessageSquareText, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-lg transition-all">
            <div className={`w-9 h-9 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* ── Quick Actions ── */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-brand-500" /> Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.to}
              to={action.to}
              className="group bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-xl hover:shadow-slate-200/50 transition-all hover:-translate-y-1"
            >
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <action.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-slate-900 mb-1">{action.title}</h3>
              <p className="text-xs text-slate-500">{action.description}</p>
              <div className="mt-3 flex items-center gap-1 text-brand-600 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                Open <ArrowRight className="w-3 h-3" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Infinite Marquee — Creator Reels Row 1 (left to right) ── */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Film className="w-5 h-5 text-pink-500" /> Trending Creator Reels
          </h2>
          <Link to="/dashboard/reel-scripts" className="text-sm text-brand-600 font-semibold hover:underline flex items-center gap-1">
            Create yours <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Marquee Row 1 — scrolls left */}
        <div className="relative overflow-hidden mb-5">
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />
          <div className="flex gap-4 animate-marquee-left hover:[animation-play-state:paused]">
            {[...CREATOR_REELS_ROW1, ...CREATOR_REELS_ROW1].map((reel, idx) => (
              <ReelCard key={`r1-${idx}`} reel={reel} />
            ))}
          </div>
        </div>

        {/* Marquee Row 2 — scrolls right */}
        <div className="relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />
          <div className="flex gap-4 animate-marquee-right hover:[animation-play-state:paused]">
            {[...CREATOR_REELS_ROW2, ...CREATOR_REELS_ROW2].map((reel, idx) => (
              <ReelCard key={`r2-${idx}`} reel={reel} />
            ))}
          </div>
        </div>
      </div>

      {/* ── Content calendar ── */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-brand-500" /> This Week&apos;s Focus
        </h3>
        <div className="space-y-3">
          {[
            { day: 'Mon', type: 'Reel', title: 'Hook-based educational content', color: 'bg-pink-500', done: true },
            { day: 'Tue', type: 'Carousel', title: 'Value-packed tips carousel', color: 'bg-violet-500', done: true },
            { day: 'Wed', type: 'Story', title: 'Behind-the-scenes + poll', color: 'bg-amber-500', done: false },
            { day: 'Thu', type: 'Reel', title: 'Trending audio + niche twist', color: 'bg-emerald-500', done: false },
            { day: 'Fri', type: 'Static', title: 'Motivational quote post', color: 'bg-blue-500', done: false },
          ].map((item) => (
            <div key={item.day} className={`flex items-center gap-4 p-3 rounded-xl transition-colors ${item.done ? 'bg-slate-50' : 'hover:bg-slate-50'}`}>
              <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                <span className="text-xs font-bold text-slate-600">{item.day}</span>
              </div>
              <div className={`w-2 h-2 rounded-full ${item.color}`} />
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${item.done ? 'text-slate-400 line-through' : 'text-slate-800'}`}>{item.title}</p>
                <span className="text-[10px] text-slate-400 uppercase tracking-wide">{item.type}</span>
              </div>
              {item.done && <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">Done</span>}
            </div>
          ))}
        </div>
        <Link to="/dashboard/weekly-plan" className="mt-4 inline-flex items-center gap-1 text-sm text-brand-600 font-semibold hover:underline">
          View full plan <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* ── Growth Tips — Scrollable Row ── */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-500" /> Pro Growth Tips
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TIPS.map((tip, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-slate-100 p-5 flex items-start gap-4 hover:shadow-lg transition-all hover:-translate-y-0.5">
              <div className={`w-10 h-10 ${tip.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <tip.icon className={`w-5 h-5 ${tip.color}`} />
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">{tip.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Top Performing Content Ideas ── */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-500" /> Content Ideas by Category
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              category: 'Hook Ideas',
              color: 'from-pink-500 to-rose-600',
              items: [
                'Stop doing this if you want to grow…',
                'Nobody talks about this trick…',
                'I went from 0 to 10K doing this one thing.',
                'Here\'s what changed everything for me.',
              ],
            },
            {
              category: 'CTA Templates',
              color: 'from-violet-500 to-indigo-600',
              items: [
                'Save this for later 🔖',
                'DM me "START" to get the free guide',
                'Follow for daily tips like this',
                'Tag someone who needs to see this',
              ],
            },
            {
              category: 'Trending Formats',
              color: 'from-amber-500 to-orange-600',
              items: [
                'POV: [relatable scenario]',
                'Things I wish I knew when I started…',
                'Day in the life of a [niche]',
                'Unpopular opinion: [hot take]',
              ],
            },
          ].map((col) => (
            <div key={col.category} className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg transition-all">
              <div className={`bg-gradient-to-r ${col.color} px-5 py-3`}>
                <h3 className="text-white font-bold text-sm">{col.category}</h3>
              </div>
              <div className="p-5 space-y-3">
                {col.items.map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-slate-600 leading-snug">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA bottom banner ── */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 md:p-10 text-white">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(139,92,246,0.3) 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }} />
        <div className="absolute top-0 right-0 w-72 h-72 bg-brand-500/10 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="relative z-10 text-center max-w-xl mx-auto">
          <Sparkles className="w-8 h-8 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-extrabold mb-3">Ready to go viral?</h2>
          <p className="text-white/60 mb-6 text-sm">
            Generate your first AI-powered content plan in seconds. Scripts, captions, hashtags — all tailored to your niche.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/dashboard/weekly-plan"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-500 to-pink-500 rounded-xl text-sm font-bold hover:opacity-90 transition-all hover:shadow-lg shadow-brand-500/20"
            >
              <CalendarDays className="w-4 h-4" /> Generate Weekly Plan
            </Link>
            <Link
              to="/dashboard/reel-scripts"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 border border-white/20 rounded-xl text-sm font-bold hover:bg-white/20 transition-all"
            >
              <Film className="w-4 h-4" /> Write a Reel Script
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
