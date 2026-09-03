"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Calendar,
  QrCode,
  ArrowRight,
  Users,
  BarChart3,
  ClipboardList,
  Zap,
  Building2,
  Search,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import { useState } from "react";

/* ─── Staggered fade-up helper ─── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay, ease: "easeOut" },
});

const CATEGORY_LINKS = [
  { label: "💻 Technical", sub: "Hackathons, Robotics, Coding", href: "/events?category=Technical", color: "hsl(214 89% 52%)" },
  { label: "🎭 Cultural",  sub: "Fests, Drama, Music, Art",    href: "/events?category=Cultural",  color: "hsl(346 80% 50%)" },
  { label: "🏅 Sports",    sub: "Cricket, Football, Athletics", href: "/events?category=Sports",    color: "hsl(158 64% 38%)" },
  { label: "💡 Workshops", sub: "Career, Cloud, AI, Placement", href: "/events?category=Workshop",  color: "hsl(35 92% 45%)" },
];

const FEATURES = [
  {
    icon: QrCode,
    title: "Instant Digital QR Pass",
    desc: "One-click RSVP generates a scannable gate pass. No printing needed — just show at entry.",
  },
  {
    icon: ClipboardList,
    title: "Post-Event Feedback Forms",
    desc: "Rate sessions with star ratings, Likert scales, and structured questionnaires for accreditation records.",
  },
  {
    icon: Users,
    title: "Live Keynote Q&A Board",
    desc: "Students submit and upvote questions during events. Organisers pin official answers in real-time.",
  },
  {
    icon: BarChart3,
    title: "Attendance Analytics",
    desc: "Real-time registration counts, turnout percentages, and feedback scores for every event.",
  },
];

export default function HomePage() {
  const [search, setSearch] = useState("");

  return (
    <main className="min-h-screen bg-background overflow-x-hidden">

      {/* ═══════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════ */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 gradient-mesh">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">

          {/* Top label */}
          <motion.div {...fadeUp(0)} className="flex justify-center mb-6">
            <span
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide border"
              style={{
                background: "hsl(var(--primary) / 0.08)",
                borderColor: "hsl(var(--primary) / 0.20)",
                color: "hsl(var(--primary))",
              }}
            >
              <Building2 className="w-3 h-3" />
              OFFICE OF STUDENT AFFAIRS — OFFICIAL EVENT PORTAL
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            {...fadeUp(0.05)}
            className="text-center font-extrabold tracking-tight text-foreground mb-5"
            style={{
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
            }}
          >
            All Campus Events,<br />
            <span className="gradient-text">One Place.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            {...fadeUp(0.1)}
            className="text-center text-sm sm:text-base leading-relaxed max-w-xl mx-auto mb-10"
            style={{ color: "hsl(var(--fg-muted))" }}
          >
            Register for departmental hackathons, cultural fests, sports tournaments, and
            placement workshops — get instant digital QR passes for entry.
          </motion.p>

          {/* Search + CTA */}
          <motion.div {...fadeUp(0.15)} className="max-w-xl mx-auto">
            <div
              className="flex items-center gap-2 p-1.5 rounded-2xl border"
              style={{
                background: "hsl(var(--surface-raised))",
                borderColor: "hsl(var(--border-strong))",
                boxShadow: "var(--shadow-md)",
              }}
            >
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "hsl(var(--fg-subtle))" }} />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search events, workshops, fests..."
                  className="w-full pl-9 pr-3 py-2.5 bg-transparent text-sm text-foreground outline-none placeholder:text-foreground/40"
                />
              </div>
              <Link
                href={search ? `/events?search=${encodeURIComponent(search)}` : "/events"}
                className="btn-primary text-sm py-2.5 px-5 rounded-xl flex-shrink-0"
              >
                Find Events
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Popular tags */}
            <div className="flex items-center gap-2 flex-wrap justify-center mt-4">
              <span className="text-xs font-semibold" style={{ color: "hsl(var(--fg-subtle))" }}>Popular:</span>
              {["HackPulse 2026", "Tarang Fest", "Placement Bootcamp", "RoboWars"].map((tag) => (
                <Link
                  key={tag}
                  href={`/events?search=${encodeURIComponent(tag)}`}
                  className="text-xs px-2.5 py-1 rounded-lg transition-colors font-medium"
                  style={{
                    background: "hsl(var(--border) / 0.6)",
                    color: "hsl(var(--fg-muted))",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "hsl(var(--primary) / 0.10)";
                    (e.currentTarget as HTMLElement).style.color = "hsl(var(--primary))";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "hsl(var(--border) / 0.6)";
                    (e.currentTarget as HTMLElement).style.color = "hsl(var(--fg-muted))";
                  }}
                >
                  {tag}
                </Link>
              ))}
            </div>
          </motion.div>

        </div>
      </section>

      {/* ═══════════════════════════════════════
          CATEGORY CARDS
      ═══════════════════════════════════════ */}
      <section
        className="py-14 border-y"
        style={{ background: "hsl(var(--surface))", borderColor: "hsl(var(--border))" }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "hsl(var(--primary))" }}>
                Browse by Stream
              </p>
              <h2 className="text-xl font-bold text-foreground">Department Categories</h2>
            </div>
            <Link
              href="/events"
              className="text-xs font-semibold flex items-center gap-1 transition-colors"
              style={{ color: "hsl(var(--primary))" }}
            >
              All Events <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {CATEGORY_LINKS.map((cat, i) => (
              <motion.div
                key={cat.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.35, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  href={cat.href}
                  className="glass-card p-5 rounded-2xl flex flex-col gap-3 group block"
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-base transition-transform duration-200 group-hover:scale-110"
                    style={{ background: `${cat.color}18` }}
                  >
                    <span>{cat.label.split(" ")[0]}</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground mb-0.5">{cat.label.split(" ").slice(1).join(" ")}</p>
                    <p className="text-xs leading-relaxed" style={{ color: "hsl(var(--fg-subtle))" }}>{cat.sub}</p>
                  </div>
                  <div
                    className="flex items-center justify-between text-xs font-semibold pt-2 border-t group-hover:gap-2 transition-all"
                    style={{ borderColor: "hsl(var(--border))", color: cat.color }}
                  >
                    <span>View Events</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          PLATFORM FEATURES
      ═══════════════════════════════════════ */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "hsl(var(--primary))" }}>
              Platform Capabilities
            </p>
            <h2 className="text-2xl font-bold text-foreground">
              Built for Organisers & Students
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.35, delay: i * 0.07 }}
                  className="glass-card p-6 rounded-2xl flex gap-4 items-start"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: "hsl(var(--primary) / 0.10)",
                      color: "hsl(var(--primary))",
                    }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground mb-1">{f.title}</h3>
                    <p className="text-xs leading-relaxed" style={{ color: "hsl(var(--fg-muted))" }}>{f.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          BOTTOM CTA BANNER
      ═══════════════════════════════════════ */}
      <section className="pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="rounded-3xl overflow-hidden relative"
            style={{
              background: "linear-gradient(135deg, hsl(214 89% 38%), hsl(199 89% 36%))",
              padding: "3rem 2.5rem",
            }}
          >
            {/* subtle pattern */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-5 h-5 text-blue-200" />
                  <span className="text-xs font-bold text-blue-200 uppercase tracking-wider">
                    For Event Organisers
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white mb-2">
                  Creating a campus event?
                </h3>
                <p className="text-sm text-blue-100 leading-relaxed max-w-sm">
                  Publish listings, set capacity, issue QR passes, collect structured feedback, and generate official attendance reports.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white font-bold text-sm transition-all hover:bg-blue-50"
                  style={{ color: "hsl(214 89% 38%)" }}
                >
                  Admin Login
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/events"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/30 text-white font-semibold text-sm transition-all hover:bg-white/10"
                >
                  Browse Events
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </main>
  );
}
