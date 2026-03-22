import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sparkles,
  Play,
  Zap,
  TrendingUp,
  Film,
  Hash,
  Heart,
  MessageCircle,
  Bookmark,
  Star,
  ArrowRight,
  CheckCircle2,
  Target,
  Crown,
  Flame,
  ChevronDown,
  Calendar,
  Users,
  Loader2,
} from "lucide-react";
import { apiPost } from "../lib/api";

// ─── Video data ───────────────────────────────────────────────────────────────
const SHOWCASE_ROW1 = [
  {
    video:
      "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    hook: "Stop scrolling. Start creating. 💡",
    views: "31.2K",
  },
  {
    video:
      "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    hook: "Make your content this 🔥 — here's how",
    views: "24.5K",
  },
  {
    video:
      "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    hook: "My exact content strategy for 2026 🎯",
    views: "56.8K",
  },
  {
    video:
      "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    hook: "Filmed this entire trip on my phone 🌍",
    views: "42.1K",
  },
  {
    video: "https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    hook: "The caption formula that went viral ✍️",
    views: "18.7K",
  },
  {
    video:
      "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    hook: "This CTA doubled my DMs overnight 💬",
    views: "45.3K",
  },
  {
    video:
      "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    hook: "POV: You finally become a full-time creator 🎬",
    views: "89.2K",
  },
  {
    video:
      "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    hook: "Day in the life of a full-time creator 📍",
    views: "71.8K",
  },
  {
    video:
      "https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
    hook: "How I batch 2 weeks of content in one day ⚡",
    views: "19.5K",
  },
  {
    video:
      "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    hook: "When your Reel flops… do this instead 💀",
    views: "63.1K",
  },
  {
    video:
      "https://storage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
    hook: "Hook formula that gets 5× more saves 🪝",
    views: "37.4K",
  },
  {
    video:
      "https://storage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
    hook: "How creators build a community of 50K 🙌",
    views: "53.2K",
  },
  {
    video:
      "https://storage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanDo.mp4",
    hook: "5 niches exploding on social media right now 📈",
    views: "28.7K",
  },
];

const SHOWCASE_ROW2 = [
  {
    video:
      "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    hook: "Algorithm secrets no one talks about 🤫",
    views: "94.7K",
  },
  {
    video:
      "https://storage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
    hook: "How I built 10K followers from zero 🏗️",
    views: "52.6K",
  },
  {
    video:
      "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    hook: "I posted every day for 30 days — here's what happened",
    views: "38.1K",
  },
  {
    video:
      "https://storage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanDo.mp4",
    hook: "The hashtag strategy that 10× my reach #️⃣",
    views: "22.4K",
  },
  {
    video: "https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    hook: "How I monetized at 3K followers 💰",
    views: "57.6K",
  },
  {
    video:
      "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    hook: "POV: Your Reel hits 1 million views 🤯",
    views: "89.2K",
  },
  {
    video:
      "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    hook: "Why your Reels flop (and the simple fix) 👀",
    views: "63.1K",
  },
  {
    video:
      "https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
    hook: "Building 10K audience completely from scratch 🏗️",
    views: "71.8K",
  },
  {
    video:
      "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    hook: "Content batching: my full weekly workflow ⚡",
    views: "19.5K",
  },
  {
    video:
      "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    hook: "3 mistakes that kill your Reel reach 🔥",
    views: "24.5K",
  },
  {
    video:
      "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    hook: "Travel content that gets 500K views 🌍",
    views: "48.9K",
  },
  {
    video:
      "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    hook: "How I grew from 0 to 20K in 60 days 🚀",
    views: "76.3K",
  },
  {
    video:
      "https://storage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
    hook: "Gear I use to film cinematic Reels 🎬",
    views: "33.7K",
  },
];

const TESTIMONIALS = [
  {
    name: "Sarah K.",
    handle: "@sarah.creates",
    avatar: "S",
    color: "from-pink-400 to-rose-500",
    text: "Went from 2K to 18K followers in 3 months. The AI scripts are insanely good — saves me hours every week.",
    followers: "18K",
  },
  {
    name: "Alex M.",
    handle: "@alexfitness",
    avatar: "A",
    color: "from-violet-400 to-purple-500",
    text: "My Reels started getting 10x more views after using the hook templates. Total game-changer for my fitness brand.",
    followers: "45K",
  },
  {
    name: "Priya D.",
    handle: "@priya.designs",
    avatar: "P",
    color: "from-amber-400 to-orange-500",
    text: "I used to spend 4 hours planning content. Now it takes 15 minutes. The weekly plans are perfectly tailored to my niche.",
    followers: "12K",
  },
];

// ─── Scroll reveal ────────────────────────────────────────────────────────────
function RevealOnScroll({
  children,
  delay = 0,
  direction = "up",
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "left" | "right" | "fade";
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => setVisible(e.isIntersecting),
      { threshold: 0.12 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  const t =
    direction === "up"
      ? "translateY(40px)"
      : direction === "left"
        ? "translateX(-40px)"
        : direction === "right"
          ? "translateX(40px)"
          : "none";
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translate(0,0)" : t,
        transition: `opacity 0.65s cubic-bezier(.22,1,.36,1) ${delay}ms, transform 0.65s cubic-bezier(.22,1,.36,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ─── Mini video card ──────────────────────────────────────────────────────────
function MiniVideoCard({
  reel,
}: {
  reel: { video: string; hook: string; views: string };
}) {
  return (
    <div className="flex-shrink-0 w-36 h-60 relative rounded-2xl overflow-hidden shadow-xl group">
      <video
        src={reel.video}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/20" />
      <div className="absolute right-2 bottom-16 flex flex-col items-center gap-2.5 opacity-80">
        <Heart className="w-3.5 h-3.5 text-white" />
        <MessageCircle className="w-3.5 h-3.5 text-white" />
        <Bookmark className="w-3.5 h-3.5 text-white" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-2.5">
        <p className="text-white text-[10px] font-bold leading-snug mb-1.5 line-clamp-2 drop-shadow">
          {reel.hook}
        </p>
        <div className="flex items-center gap-1 text-white/50">
          <Play className="w-2.5 h-2.5" fill="currentColor" />
          <span className="text-[8px] font-semibold">{reel.views}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Sticky header ────────────────────────────────────────────────────────────
function Header() {
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setSolutionsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const solutions = [
    {
      icon: Film,
      label: "Reel Script Generator",
      desc: "Storytelling scripts that go viral",
    },
    {
      icon: Zap,
      label: "AI Video Generation",
      desc: "Create short-form videos with AI",
    },
    {
      icon: Calendar,
      label: "Content Calendar",
      desc: "Plan and schedule your content",
    },
  ];

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? "bg-[#09090f]/95 backdrop-blur-md shadow-lg shadow-black/20 border-b border-white/[0.07]" : "bg-[#09090f]/80 backdrop-blur-sm"}`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-pink-500 rounded-xl flex items-center justify-center shadow-md shadow-brand-500/30 group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-extrabold text-white tracking-tight">
            CreatorCanvas
          </span>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-7">
          {/* Solutions dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setSolutionsOpen((v) => !v)}
              className="flex items-center gap-1 text-sm font-medium text-slate-400 hover:text-white transition-colors"
            >
              Solutions
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform ${solutionsOpen ? "rotate-180" : ""}`}
              />
            </button>
            {solutionsOpen && (
              <div className="absolute top-10 left-0 w-64 bg-[#13131f] rounded-2xl shadow-2xl shadow-black/60 border border-white/10 p-2 z-50">
                {solutions.map((item) => (
                  <Link
                    key={item.label}
                    to="/signup"
                    onClick={() => setSolutionsOpen(false)}
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-brand-500/20 transition-colors">
                      <item.icon className="w-4 h-4 text-brand-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {item.label}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <a
            href="#pricing"
            onClick={() => setSolutionsOpen(false)}
            className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
          >
            Pricing
          </a>
        </nav>

        {/* Auth buttons */}
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors">
            Log in
          </Link>
          <Link
            to="/signup"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-pink-500 text-white text-sm font-semibold hover:opacity-90 transition-all shadow-md shadow-brand-500/30"
          >
            Sign Up Free <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </header>
  );
}

// ─── Main landing page ────────────────────────────────────────────────────────
export default function LandingPage() {
  const navigate = useNavigate();
  const [yearlyBilling, setYearlyBilling] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState<
    "basic" | "plus" | null
  >(null);

  const handleCheckout = async (plan: "basic" | "plus") => {
    setCheckoutLoading(plan);
    try {
      const data = await apiPost<{ url: string }>("/api/payments/checkout", {
        plan,
      });
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      // Not logged in — send to signup with plan hint
      navigate(`/signup?plan=${plan}`);
    } finally {
      setCheckoutLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090f]">
      <Header />

      {/* ══════════════════════════════════════════ */}
      {/* HERO                                       */}
      {/* ══════════════════════════════════════════ */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-[#09090f]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #7c3aed 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-violet-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-pink-500/10 rounded-full blur-[120px]" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-semibold mb-6">
            <Zap className="w-3 h-3" /> AI-Powered Creator Growth
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.08] mb-6 tracking-tight">
            Grow your audience.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-purple-400 to-pink-400">
              Powered by AI.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 leading-relaxed mb-10 max-w-2xl mx-auto">
            Weekly content plans, viral short-form scripts, AI video generation,
            and smart growth insights — for Instagram, TikTok, and YouTube
            Shorts.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-brand-600 to-pink-500 text-white font-bold text-sm hover:opacity-90 transition-all shadow-xl shadow-brand-500/30"
            >
              <Sparkles className="w-4 h-4" /> Start for Free
            </Link>
            <a
              href="#pricing"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl border border-white/15 bg-white/5 text-slate-300 font-semibold text-sm hover:bg-white/10 transition-all"
            >
              View Pricing
            </a>
          </div>

          {/* Feature chips */}
          <div className="flex flex-wrap justify-center gap-2.5 mb-10">
            {[
              { icon: Film, label: "Reel Scripts" },
              { icon: Hash, label: "Smart Hashtags" },
              { icon: TrendingUp, label: "Growth Insights" },
              { icon: Zap, label: "AI Video" },
              { icon: Calendar, label: "Content Calendar" },
            ].map((f) => (
              <div
                key={f.label}
                className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-slate-300 font-medium"
              >
                <f.icon className="w-3.5 h-3.5 text-brand-400" />
                {f.label}
              </div>
            ))}
          </div>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-4">
            <div className="flex -space-x-2">
              {[
                "from-pink-400 to-rose-500",
                "from-violet-400 to-purple-500",
                "from-amber-400 to-orange-500",
                "from-emerald-400 to-teal-500",
              ].map((c, i) => (
                <div
                  key={i}
                  className={`w-8 h-8 rounded-full bg-gradient-to-br ${c} border-2 border-[#09090f] flex items-center justify-center text-white text-[10px] font-bold`}
                >
                  {["S", "A", "P", "M"][i]}
                </div>
              ))}
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-white">
                2,500+ creators
              </p>
              <p className="text-xs text-slate-500">are already growing</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════ */}
      {/* VIDEO MARQUEE                              */}
      {/* ══════════════════════════════════════════ */}
      <section className="py-20 bg-[#0f0f1b] overflow-hidden">
        <RevealOnScroll className="text-center mb-12 px-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-semibold mb-4">
            <Film className="w-3 h-3" /> Trending Content
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
            See what creators are making
          </h2>
          <p className="text-slate-400 max-w-md mx-auto">
            Every day, thousands of creators generate viral content with
            CreatorCanvas.
          </p>
        </RevealOnScroll>
        <div className="relative mb-4">
          <div className="absolute left-0 top-0 bottom-0 w-28 bg-gradient-to-r from-[#0f0f1b] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-28 bg-gradient-to-l from-[#0f0f1b] to-transparent z-10 pointer-events-none" />
          <div className="flex gap-4 animate-marquee-left hover:[animation-play-state:paused]">
            {[...SHOWCASE_ROW1, ...SHOWCASE_ROW1].map((reel, idx) => (
              <MiniVideoCard key={`r1-${idx}`} reel={reel} />
            ))}
          </div>
        </div>
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-28 bg-gradient-to-r from-[#0f0f1b] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-28 bg-gradient-to-l from-[#0f0f1b] to-transparent z-10 pointer-events-none" />
          <div className="flex gap-4 animate-marquee-right hover:[animation-play-state:paused]">
            {[...SHOWCASE_ROW2, ...SHOWCASE_ROW2].map((reel, idx) => (
              <MiniVideoCard key={`r2-${idx}`} reel={reel} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════ */}
      {/* SOLUTIONS / FEATURES                       */}
      {/* ══════════════════════════════════════════ */}
      <section className="py-20 bg-[#09090f] px-6">
        <div className="max-w-6xl mx-auto">
          <RevealOnScroll className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold mb-4">
              <Sparkles className="w-3 h-3" /> Solutions
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
              Everything you need to grow
            </h2>
            <p className="text-slate-400 max-w-md mx-auto">
              From content planning to growth insights — one platform for your
              entire creator workflow.
            </p>
          </RevealOnScroll>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Film,
                title: "Reel Script Generator",
                desc: "Storytelling-first scripts with hooks, retention moments, and CTAs — written like a human, not a robot.",
                color: "from-pink-500 to-rose-600",
              },
              {
                icon: Zap,
                title: "AI Video Generation",
                desc: "Turn your scripts into short-form videos automatically. Perfect for Reels, Shorts, and TikToks.",
                color: "from-violet-500 to-purple-600",
              },
              {
                icon: Calendar,
                title: "Content Calendar",
                desc: "Schedule your Reels, videos, and captions with date & time. Never miss a posting slot again.",
                color: "from-amber-500 to-orange-600",
              },
              {
                icon: Hash,
                title: "Caption & Hashtag AI",
                desc: "Generate captions and hashtag packs matched to your niche for maximum discovery and engagement.",
                color: "from-emerald-500 to-teal-600",
              },
              {
                icon: TrendingUp,
                title: "AI Weekly Plans",
                desc: "Get 3–7 post ideas every week, tailored to your niche, audience, and growth goals.",
                color: "from-blue-500 to-indigo-600",
              },
              {
                icon: Target,
                title: "Niche Optimization",
                desc: "Personalized to your niche — fitness, lifestyle, SaaS, design, coaching, food, travel, and more.",
                color: "from-rose-500 to-pink-600",
              },
            ].map((f, i) => (
              <RevealOnScroll key={f.title} delay={i * 80} direction="up">
                <div className="group bg-[#13131f] rounded-2xl border border-white/[0.07] p-6 hover:shadow-xl hover:shadow-black/40 hover:border-white/15 transition-all hover:-translate-y-1 h-full">
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg`}
                  >
                    <f.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    {f.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════ */}
      {/* HOW IT WORKS                               */}
      {/* ══════════════════════════════════════════ */}
      <section className="py-20 bg-[#0f0f1b] px-6">
        <div className="max-w-5xl mx-auto">
          <RevealOnScroll className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-4">
              <Flame className="w-3 h-3" /> Simple
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
              3 steps to creator success
            </h2>
            <p className="text-slate-400 max-w-md mx-auto">
              Set up once, get AI-powered content forever.
            </p>
          </RevealOnScroll>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Tell us your niche",
                desc: "Complete a quick onboarding — your niche, goals, audience, and posting style.",
                gradient: "from-violet-500 to-purple-600",
                dir: "left" as const,
              },
              {
                step: "02",
                title: "Generate content",
                desc: "AI creates weekly plans, Reel scripts, captions, and hashtags instantly.",
                gradient: "from-pink-500 to-rose-600",
                dir: "up" as const,
              },
              {
                step: "03",
                title: "Post & grow",
                desc: "Copy your content, schedule it in the calendar, and watch your audience grow.",
                gradient: "from-amber-500 to-orange-600",
                dir: "right" as const,
              },
            ].map((s, i) => (
              <RevealOnScroll key={s.step} delay={i * 120} direction={s.dir}>
                <div className="text-center">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${s.gradient} rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-xl`}
                  >
                    <span className="text-white text-xl font-extrabold">
                      {s.step}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    {s.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed max-w-xs mx-auto">
                    {s.desc}
                  </p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════ */}
      {/* TESTIMONIALS                               */}
      {/* ══════════════════════════════════════════ */}
      <section className="py-20 bg-[#09090f] px-6">
        <div className="max-w-6xl mx-auto">
          <RevealOnScroll className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-4">
              <Star className="w-3 h-3" /> Loved by Creators
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
              Creators love CreatorCanvas
            </h2>
            <p className="text-slate-400 max-w-md mx-auto">
              Don&apos;t take our word for it — see what real creators are
              saying.
            </p>
          </RevealOnScroll>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <RevealOnScroll key={t.name} delay={i * 130} direction="up">
                <div className="bg-[#13131f] rounded-2xl p-6 border border-white/[0.07] hover:shadow-lg hover:shadow-black/40 hover:border-white/15 transition-all h-full">
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <Star
                        key={j}
                        className="w-4 h-4 text-yellow-400 fill-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed mb-5 italic">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white text-sm font-bold`}
                    >
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">
                        {t.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {t.handle} · {t.followers} followers
                      </p>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════ */}
      {/* STATS BANNER                               */}
      {/* ══════════════════════════════════════════ */}
      <section className="py-16 bg-gradient-to-r from-brand-600 via-purple-600 to-pink-500 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative z-10 max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
          {[
            { value: "2,500+", label: "Active Creators" },
            { value: "50K+", label: "Scripts Generated" },
            { value: "120K+", label: "Captions Created" },
            { value: "98%", label: "Satisfaction Rate" },
          ].map((s, i) => (
            <RevealOnScroll key={s.label} delay={i * 80} direction="up">
              <p className="text-3xl md:text-4xl font-extrabold mb-1">
                {s.value}
              </p>
              <p className="text-white/60 text-sm font-medium">{s.label}</p>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════ */}
      {/* PRICING                                    */}
      {/* ══════════════════════════════════════════ */}
      <section
        id="pricing"
        className="py-24 bg-[#0f0f1b] relative overflow-hidden px-6"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-brand-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[250px] bg-pink-500/8 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto">
          <RevealOnScroll className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-semibold mb-4">
              <Crown className="w-3 h-3" /> Pricing
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-3 tracking-tight">
              Simple, transparent pricing
            </h2>
            <p className="text-slate-400 max-w-md mx-auto text-sm">
              Pick a plan. Start creating viral content today.
            </p>
            {/* Toggle */}
            <div className="inline-flex items-center gap-3 mt-8 bg-[#1c1c2e] border border-white/10 rounded-full px-4 py-2">
              <span
                className={`text-sm font-semibold transition-colors ${!yearlyBilling ? "text-white" : "text-slate-500"}`}
              >
                Monthly
              </span>
              <button
                onClick={() => setYearlyBilling((v) => !v)}
                className={`relative w-11 h-6 rounded-full transition-colors ${yearlyBilling ? "bg-brand-500" : "bg-white/10"}`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${yearlyBilling ? "translate-x-5" : "translate-x-0"}`}
                />
              </button>
              <span
                className={`text-sm font-semibold transition-colors ${yearlyBilling ? "text-white" : "text-slate-500"}`}
              >
                Yearly{" "}
                <span className="ml-1 text-[10px] font-bold bg-emerald-500/15 text-emerald-400 px-1.5 py-0.5 rounded-full border border-emerald-500/20">
                  –20%
                </span>
              </span>
            </div>
          </RevealOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Basic */}
            <RevealOnScroll delay={0} direction="up">
              <div className="relative rounded-3xl border border-white/10 bg-[#13131f] p-8 flex flex-col h-full shadow-lg shadow-black/40">
                <div className="mb-6">
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-1">
                    Basic
                  </p>
                  <p className="text-slate-500 text-sm mb-5">
                    For creators just starting out
                  </p>
                  <div className="flex items-end gap-1.5 mb-1">
                    {yearlyBilling && (
                      <span className="text-slate-600 text-xl font-bold line-through mb-0.5">
                        $19
                      </span>
                    )}
                    <span className="text-5xl font-extrabold text-white">
                      ${yearlyBilling ? "15" : "19"}
                    </span>
                    <span className="text-slate-400 text-sm mb-1.5">
                      USD / mo
                    </span>
                  </div>
                  {yearlyBilling && (
                    <p className="text-xs text-slate-500">
                      Billed annually · save $48/yr
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-semibold">
                    <Zap className="w-3 h-3 text-yellow-400" /> 400 Credits / mo
                  </span>
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-semibold">
                    <Film className="w-3 h-3 text-pink-400" /> 40 Short Videos / mo
                  </span>
                </div>
                <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest mb-3">
                  What&apos;s included
                </p>
                <ul className="space-y-2.5 mb-8 flex-1">
                  {[
                    "AI Reel Script Generator",
                    "Caption & Hashtag Generator",
                    "Content Calendar",
                    "AI Weekly Content Plans",
                    "40 AI Short Videos / month",
                    "400 AI credits / month",
                    "Download Videos",
                    "No watermark",
                  ].map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2.5 text-sm text-slate-300"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-400 flex-shrink-0" />{" "}
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleCheckout("basic")}
                  disabled={checkoutLoading !== null}
                  className="w-full py-3 rounded-xl border border-white/15 text-slate-300 font-semibold text-sm text-center hover:border-brand-500/50 hover:text-brand-400 hover:bg-brand-500/5 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {checkoutLoading === "basic" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Processing…
                    </>
                  ) : (
                    "Get Started →"
                  )}
                </button>
              </div>
            </RevealOnScroll>

            {/* Plus */}
            <RevealOnScroll delay={100} direction="up">
              <div className="relative rounded-3xl border-2 border-brand-500/50 bg-gradient-to-b from-brand-500/10 to-[#13131f] p-8 flex flex-col h-full shadow-xl shadow-brand-500/10">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1 rounded-full bg-slate-600 text-white text-[11px] font-bold shadow-lg whitespace-nowrap">
                    COMING SOON
                  </span>
                </div>
                <div className="mb-6">
                  <p className="text-brand-400 text-xs font-semibold uppercase tracking-widest mb-1">
                    Plus
                  </p>
                  <p className="text-slate-400 text-sm mb-5">
                    For serious short-form creators
                  </p>
                  <div className="flex items-end gap-1.5 mb-1">
                    {yearlyBilling && (
                      <span className="text-slate-600 text-xl font-bold line-through mb-0.5">
                        $59
                      </span>
                    )}
                    <span className="text-5xl font-extrabold text-white">
                      ${yearlyBilling ? "47" : "59"}
                    </span>
                    <span className="text-slate-400 text-sm mb-1.5">
                      USD / mo
                    </span>
                  </div>
                  {yearlyBilling && (
                    <p className="text-xs text-slate-500">
                      Billed annually · save $144/yr
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-semibold">
                    <Zap className="w-3 h-3 text-yellow-400" /> 1200 Credits / mo
                  </span>
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-300 text-xs font-semibold">
                    <Film className="w-3 h-3 text-pink-400" /> 120 Short Videos / mo
                  </span>
                </div>
                <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest mb-3">
                  Everything in Basic, plus
                </p>
                <ul className="space-y-2.5 mb-8 flex-1">
                  {[
                    "Everything in Basic",
                    "120 AI Short Videos / month",
                    "1200 AI credits / month",
                    "Priority AI generation",
                    "Advanced analytics & insights",
                    "Early access to new features",
                  ].map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2.5 text-sm text-slate-300"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-400 flex-shrink-0" />{" "}
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  disabled
                  className="w-full py-3 rounded-xl bg-white/5 text-slate-500 font-bold text-sm text-center cursor-not-allowed border border-white/5"
                >
                  Coming Soon
                </button>
              </div>
            </RevealOnScroll>
          </div>

          <RevealOnScroll className="text-center mt-8">
            <p className="text-slate-500 text-xs">
              No contracts. Cancel anytime. Prices in USD.
            </p>
          </RevealOnScroll>
        </div>
      </section>

      {/* ══════════════════════════════════════════ */}
      {/* FINAL CTA                                  */}
      {/* ══════════════════════════════════════════ */}
      <section className="py-20 bg-[#09090f] px-6">
        <RevealOnScroll
          direction="fade"
          className="max-w-3xl mx-auto text-center"
        >
          <Sparkles className="w-10 h-10 text-brand-400 mx-auto mb-5" />
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            Ready to become a top creator?
          </h2>
          <p className="text-slate-400 max-w-lg mx-auto mb-8">
            Join 2,500+ creators already using AI to grow on Instagram, TikTok,
            and YouTube. Your first week&apos;s content plan is waiting.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-brand-600 to-pink-500 text-white rounded-xl text-sm font-bold hover:opacity-90 transition-all hover:shadow-lg hover:shadow-brand-500/30"
          >
            <Sparkles className="w-4 h-4" /> Sign Up Free
          </Link>
        </RevealOnScroll>
      </section>

      {/* ══════════════════════════════════════════ */}
      {/* FOOTER                                     */}
      {/* ══════════════════════════════════════════ */}
      <footer className="py-8 border-t border-white/[0.07] bg-[#09090f] px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-brand-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-bold text-slate-300">
              CreatorCanvas
            </span>
          </div>
          <p className="text-xs text-slate-500">
            &copy; 2026 CreatorCanvas. Built for creators, by creators.
          </p>
          <div className="flex gap-4 text-xs text-slate-500">
            <span className="hover:text-slate-300 cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-slate-300 cursor-pointer transition-colors">Terms</span>
            <span className="hover:text-slate-300 cursor-pointer transition-colors">Support</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
