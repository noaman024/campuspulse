"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import {
  Calendar,
  LogIn,
  ArrowRight,
  QrCode,
  MessageSquare,
  ClipboardList,
  Sparkles,
  Shield,
  Users,
  Image as ImageIcon,
  Star,
  CheckCircle,
  BarChart3,
  Globe,
  Zap,
  ChevronRight,
  Compass,
  Check,
  Building2,
  MapPin,
} from "lucide-react";

/* ─── Animated Counter Hook ─── */
function useCounter(end: number, duration: number = 2000, shouldStart: boolean = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!shouldStart) return;
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [end, duration, shouldStart]);
  return count;
}

/* ─── Platform Workflow & Digital Pass Preview ─── */
function HeroPlatformPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.55, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full max-w-4xl mx-auto mt-12 sm:mt-16"
    >
      {/* Outer ambient glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/25 via-blue-500/10 to-indigo-600/25 rounded-3xl blur-xl opacity-60 pointer-events-none" />

      <div
        className="relative rounded-2xl border p-5 sm:p-7 backdrop-blur-xl overflow-hidden shadow-2xl"
        style={{
          background: "linear-gradient(180deg, rgba(16, 22, 34, 0.95) 0%, rgba(10, 14, 23, 0.98) 100%)",
          borderColor: "rgba(255, 255, 255, 0.10)",
        }}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b pb-4 mb-6" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
              <Zap className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold uppercase tracking-wider text-white">CampusPulse Entry & Verification System</p>
              <p className="text-[11px] text-slate-400">Contactless QR Passes & Centralized Management</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Portal Active
          </span>
        </div>

        {/* 2-Column Interface Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center text-left">
          {/* Left Column: Platform Feature Highlights */}
          <div className="md:col-span-7 space-y-4">
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">
                Instant Access
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                Discover, Register & Enter in Seconds
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Click Explore Events to browse technical hackathons, cultural festivals, sports tournaments, and masterclasses organized across all departments.
              </p>
            </div>

            {/* Feature Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {[
                "1-Tap Contactless QR Ticket",
                "Instant Faculty Verification",
                "Live Coordinator Q&A Thread",
                "Post-Event Survey & Analytics",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-xs text-slate-300">
                  <div className="w-4 h-4 rounded-full bg-blue-500/20 border border-blue-400/40 flex items-center justify-center flex-shrink-0">
                    <Check className="w-2.5 h-2.5 text-blue-400" />
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* Direct Link to Explore Events */}
            <div className="pt-2">
              <Link
                href="/events"
                className="btn-primary py-2.5 px-6 text-xs font-semibold rounded-xl inline-flex items-center gap-2 shadow-lg shadow-blue-600/30"
              >
                <Compass className="w-4 h-4" />
                <span>Explore Events Directory</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Column: Live Student Digital Pass Mockup */}
          <div className="md:col-span-5 bg-slate-900/90 rounded-xl p-4 border border-white/10 flex flex-col justify-between space-y-3.5 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Digital University Pass</p>
                <p className="text-sm font-bold text-white">Aarav Sharma</p>
                <p className="text-[11px] text-blue-400">B.Tech CSE • Verified Student</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-blue-600/30 border border-blue-400/40 flex items-center justify-center font-bold text-xs text-blue-300">
                AS
              </div>
            </div>

            {/* Pass QR Section with Laser Scan */}
            <div className="bg-black/60 rounded-xl p-3.5 border border-white/10 flex items-center gap-3.5 relative">
              <div className="w-16 h-16 bg-white rounded-lg p-1.5 flex-shrink-0 flex items-center justify-center relative overflow-hidden">
                <QrCode className="w-full h-full text-slate-900" />
                {/* Laser animation */}
                <motion.div
                  className="absolute inset-x-0 h-0.5 bg-blue-500 shadow-[0_0_8px_#3b82f6]"
                  animate={{ top: ["5%", "90%", "5%"] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
              <div className="space-y-1">
                <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 inline-block">
                  Verified & Active
                </span>
                <p className="text-xs font-mono font-bold text-white">PASS-2026-8941</p>
                <p className="text-[10px] text-slate-400">Scan at Venue Gate for Contactless Check-in</p>
              </div>
            </div>

            <p className="text-[10px] text-center text-slate-400">
              Passes are generated instantly upon event registration.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN HOMEPAGE COMPONENT
   ═══════════════════════════════════════════════════════ */
export default function HomePage() {
  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-80px" });

  const features = [
    {
      icon: QrCode,
      title: "Contactless QR Hall Passes",
      desc: "Instant digital entry passes on your device. 0.5-second venue gate verification eliminates manual attendance and paper tickets.",
      badge: "Fast Entry",
    },
    {
      icon: Calendar,
      title: "Unified Department Calendar",
      desc: "All symposiums, technical hackathons, sports championships, and cultural nights across all 12 academic departments in one place.",
      badge: "Centralized",
    },
    {
      icon: MessageSquare,
      title: "Live Coordinator Q&A",
      desc: "Ask questions directly to faculty heads and student leads. Upvote urgent questions and receive pinned official replies in real time.",
      badge: "Interactive",
    },
    {
      icon: ClipboardList,
      title: "Audience Feedback & Polls",
      desc: "Dynamic post-event survey forms with star ratings, Likert scales, and verified feedback to improve future campus events.",
      badge: "Feedback",
    },
    {
      icon: ImageIcon,
      title: "Curated Media Vault",
      desc: "Preserve college memories. Browse verified high-resolution photo galleries and official event after-movie highlight reels.",
      badge: "Memories",
    },
    {
      icon: BarChart3,
      title: "Executive Faculty Reports",
      desc: "Dean-level analytics on student participation, department turnout, and downloadable official event documentation in one click.",
      badge: "Admin Suite",
    },
  ];

  const testimonials = [
    {
      name: "Rohan Kulkarni",
      role: "CSE, 3rd Year",
      quote:
        "Managing event entries used to be complete chaos. With CampusPulse, clicking Explore Events and scanning our QR pass at the entrance took under 5 seconds!",
    },
    {
      name: "Ananya Deshmukh",
      role: "Cultural Committee Lead",
      quote:
        "The live Q&A section and centralized event hub transformed our fest organization. Every student knew exactly where to go and when.",
    },
    {
      name: "Dr. K. S. Verma",
      role: "Head of Student Affairs",
      quote:
        "CampusPulse provides verified student attendance data and automated reports for institutional approvals. An exceptional platform.",
    },
  ];

  // Stats Counters
  const studentsCount = useCounter(2800, 1800, statsInView);
  const eventsCount = useCounter(85, 1800, statsInView);
  const deptsCount = useCounter(12, 1800, statsInView);
  const accuracyCount = useCounter(99, 1800, statsInView);

  return (
    <main className="overflow-hidden">
      {/* ═══════════════════════════════════════════════════════
          1. HERO SECTION WITH COLLEGE GATE BACKGROUND
          ═══════════════════════════════════════════════════════ */}
      <section
        className="relative pt-16 sm:pt-24 pb-20 px-4 sm:px-6 overflow-hidden"
      >
        {/* Full-Bleed College Gate Hero Background */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src="/college-gate.jpg"
            alt="P. R. Pote Patil College Campus Gate"
            className="w-full h-full object-cover object-center"
          />
          {/* Pure neutral dark scrim - preserves natural colors & sharpness with zero theme haze or blur */}
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-8 text-xs font-bold backdrop-blur-md bg-black/60 border-blue-400/40 text-blue-300 shadow-lg"
          >
            <Building2 className="w-3.5 h-3.5 text-blue-400" />
            <span>P. R. POTE PATIL COLLEGE CAMPUS • OFFICIAL EVENT PORTAL</span>
          </motion.div>

          {/* Main Hero Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="text-white mb-6 drop-shadow-xl"
            style={{
              fontSize: "clamp(2.5rem, 6.5vw, 4.75rem)",
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.04em",
            }}
          >
            Campus Life, <br className="hidden sm:inline" />
            <span className="gradient-text">Electrified.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.16 }}
            className="text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed font-normal text-slate-200 drop-shadow-md"
          >
            One unified hub for university event discovery, digital QR hall passes, live coordinator Q&A, and campus feedback. Click below to explore all live events.
          </motion.p>

          {/* Primary Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.24 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3.5"
          >
            <Link
              href="/events"
              className="btn-primary py-3.5 px-8 text-sm rounded-xl font-semibold w-full sm:w-auto shadow-xl shadow-blue-600/40 flex items-center justify-center gap-2"
            >
              <Compass className="w-4 h-4 text-white" />
              <span>Explore Events</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/register"
              className="py-3.5 px-8 text-sm rounded-xl font-semibold w-full sm:w-auto flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/25 transition-all shadow-lg"
            >
              <Users className="w-4 h-4" />
              <span>Join as Student</span>
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.32 }}
            className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 mt-8 text-xs font-medium text-slate-200 drop-shadow"
          >
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-blue-400" />
              100% Verified QR Digital Passes
            </span>
            <span className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              12 University Academic Departments
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-blue-400" />
              Contactless Gate Check-In
            </span>
          </motion.div>

          {/* Platform Workflow Preview */}
          <HeroPlatformPreview />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          2. EXPLORE EVENTS INVITATION BANNER
          ═══════════════════════════════════════════════════════ */}
      <section className="py-16 px-4 sm:px-6 border-y" style={{ background: "hsl(var(--surface))", borderColor: "hsl(var(--border))" }}>
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-500 inline-block">
            Event Directory
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground" style={{ letterSpacing: "-0.03em" }}>
            Ready to Find Upcoming Events?
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto leading-relaxed">
            Browse symposiums, hackathons, cultural festivals, sports tournaments, and masterclasses across all university departments.
          </p>
          <div className="pt-3">
            <Link
              href="/events"
              className="btn-primary py-3.5 px-8 text-sm rounded-xl font-semibold inline-flex items-center gap-2 shadow-lg shadow-blue-600/25"
            >
              <Compass className="w-4 h-4 text-white" />
              <span>Click Here to Explore All Events</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          3. BENTO GRID PLATFORM FEATURES
          ═══════════════════════════════════════════════════════ */}
      <section className="py-24 px-4 sm:px-6" style={{ background: "hsl(var(--bg))" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider mb-2 text-blue-500 inline-block">
              Platform Features
            </span>
            <h2
              className="text-2xl sm:text-3.5xl font-extrabold text-foreground mb-3"
              style={{ letterSpacing: "-0.03em" }}
            >
              Built for Modern Campus Life
            </h2>
            <p className="text-sm sm:text-base font-normal" style={{ color: "hsl(var(--fg-muted))" }}>
              Replace chaotic paperwork, endless WhatsApp forwards, and lost entry tickets with a single integrated system.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  whileHover={{ y: -4, transition: { duration: 0.18 } }}
                  className="group relative p-6 rounded-2xl border transition-all duration-200"
                  style={{
                    background: "hsl(var(--surface-raised))",
                    borderColor: "hsl(var(--border))",
                    boxShadow: "var(--shadow-sm)",
                  }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center border transition-colors group-hover:border-blue-500/40 group-hover:bg-blue-500/15"
                      style={{
                        background: "hsl(var(--surface))",
                        borderColor: "hsl(var(--border))",
                      }}
                    >
                      <Icon className="w-5 h-5 text-blue-500" />
                    </div>
                    <span
                      className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border"
                      style={{
                        background: "rgba(59, 130, 246, 0.08)",
                        borderColor: "rgba(59, 130, 246, 0.2)",
                        color: "#60A5FA",
                      }}
                    >
                      {f.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-foreground mb-2 group-hover:text-blue-400 transition-colors">
                    {f.title}
                  </h3>

                  <p className="text-sm leading-relaxed" style={{ color: "hsl(var(--fg-muted))" }}>
                    {f.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          4. CAMPUS STATS SECTION
          ═══════════════════════════════════════════════════════ */}
      <section
        ref={statsRef}
        className="py-20 px-4 sm:px-6 border-y"
        style={{
          background: "hsl(var(--surface))",
          borderColor: "hsl(var(--border))",
        }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2
              className="text-2xl sm:text-3xl font-extrabold text-foreground mb-2"
              style={{ letterSpacing: "-0.025em" }}
            >
              Trusted Across Campus
            </h2>
            <p className="text-sm font-normal" style={{ color: "hsl(var(--fg-muted))" }}>
              Powering university hackathons, fests, and conferences every semester.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div
              className="p-6 rounded-2xl border text-center"
              style={{
                background: "hsl(var(--surface-raised))",
                borderColor: "hsl(var(--border))",
              }}
            >
              <div className="text-3xl sm:text-4xl font-extrabold text-foreground mb-1 tracking-tight">
                {studentsCount}+
              </div>
              <p className="text-xs sm:text-sm font-medium" style={{ color: "hsl(var(--fg-muted))" }}>
                Active Student Users
              </p>
            </div>

            <div
              className="p-6 rounded-2xl border text-center"
              style={{
                background: "hsl(var(--surface-raised))",
                borderColor: "hsl(var(--border))",
              }}
            >
              <div className="text-3xl sm:text-4xl font-extrabold text-foreground mb-1 tracking-tight">
                {eventsCount}+
              </div>
              <p className="text-xs sm:text-sm font-medium" style={{ color: "hsl(var(--fg-muted))" }}>
                Events Organized
              </p>
            </div>

            <div
              className="p-6 rounded-2xl border text-center"
              style={{
                background: "hsl(var(--surface-raised))",
                borderColor: "hsl(var(--border))",
              }}
            >
              <div className="text-3xl sm:text-4xl font-extrabold text-foreground mb-1 tracking-tight">
                {deptsCount}
              </div>
              <p className="text-xs sm:text-sm font-medium" style={{ color: "hsl(var(--fg-muted))" }}>
                Academic Departments
              </p>
            </div>

            <div
              className="p-6 rounded-2xl border text-center"
              style={{
                background: "hsl(var(--surface-raised))",
                borderColor: "hsl(var(--border))",
              }}
            >
              <div className="text-3xl sm:text-4xl font-extrabold text-foreground mb-1 tracking-tight">
                {accuracyCount}.9%
              </div>
              <p className="text-xs sm:text-sm font-medium" style={{ color: "hsl(var(--fg-muted))" }}>
                Entry Scan Accuracy
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          5. HOW IT WORKS (3 SIMPLE STEPS)
          ═══════════════════════════════════════════════════════ */}
      <section className="py-20 px-4 sm:px-6" style={{ background: "hsl(var(--bg))" }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-wider mb-2 text-blue-500 inline-block">
              Quick Setup
            </span>
            <h2
              className="text-2xl sm:text-3xl font-extrabold text-foreground"
              style={{ letterSpacing: "-0.025em" }}
            >
              How CampusPulse Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "Sign Up as Student",
                desc: "Register with your university student ID & official email in under 30 seconds.",
              },
              {
                step: "02",
                title: "Explore Events & RSVP",
                desc: "Click Explore Events, filter by your department or interests, and reserve your free pass.",
              },
              {
                step: "03",
                title: "Scan Pass & Enter",
                desc: "Show your verified digital QR hall pass at the venue entrance for 0.5-second contactless entry.",
              },
            ].map((s) => (
              <div
                key={s.step}
                className="p-7 rounded-2xl border text-center"
                style={{
                  background: "hsl(var(--surface-raised))",
                  borderColor: "hsl(var(--border))",
                }}
              >
                <div className="w-10 h-10 rounded-xl mx-auto mb-4 flex items-center justify-center font-extrabold text-sm bg-blue-500/10 text-blue-400 border border-blue-500/25">
                  {s.step}
                </div>
                <h3 className="text-base font-bold text-foreground mb-2">{s.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "hsl(var(--fg-muted))" }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          6. TESTIMONIALS
          ═══════════════════════════════════════════════════════ */}
      <section className="py-20 px-4 sm:px-6" style={{ background: "hsl(var(--surface))" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-wider mb-2 text-blue-500 inline-block">
              Student Experiences
            </span>
            <h2
              className="text-2xl sm:text-3xl font-extrabold text-foreground"
              style={{ letterSpacing: "-0.025em" }}
            >
              Voices from the Campus
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="p-6 rounded-2xl border flex flex-col justify-between"
                style={{
                  background: "hsl(var(--surface-raised))",
                  borderColor: "hsl(var(--border))",
                }}
              >
                <div>
                  <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed mb-6" style={{ color: "hsl(var(--fg-muted))" }}>
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-4 border-t" style={{ borderColor: "hsl(var(--border))" }}>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold bg-blue-600">
                    {t.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t.name}</p>
                    <p className="text-xs" style={{ color: "hsl(var(--fg-subtle))" }}>
                      {t.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          7. HIGH-IMPACT FINAL CTA
          ═══════════════════════════════════════════════════════ */}
      <section className="py-24 px-4 sm:px-6" style={{ background: "hsl(var(--bg))" }}>
        <div className="max-w-4xl mx-auto">
          <div
            className="rounded-3xl p-10 sm:p-16 text-center border relative overflow-hidden shadow-2xl"
            style={{
              background: "linear-gradient(180deg, rgba(20, 26, 40, 0.95) 0%, rgba(10, 14, 23, 0.98) 100%)",
              borderColor: "rgba(59, 130, 246, 0.3)",
            }}
          >
            {/* Ambient inner glow */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center mx-auto mb-6">
                <Zap className="w-6 h-6 text-blue-400" />
              </div>

              <h2
                className="text-2xl sm:text-4xl font-extrabold text-white mb-4"
                style={{ letterSpacing: "-0.03em" }}
              >
                Ready to Experience CampusPulse?
              </h2>

              <p className="text-sm sm:text-base max-w-lg mx-auto mb-8 leading-relaxed text-slate-300 font-normal">
                Click Explore Events to view all live hackathons, fests, and workshops, or create your account to claim verified digital passes.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
                <Link
                  href="/events"
                  className="btn-primary py-3.5 px-8 text-sm rounded-xl font-semibold w-full sm:w-auto shadow-lg shadow-blue-600/40 flex items-center justify-center gap-2"
                >
                  <Compass className="w-4 h-4 text-white" />
                  <span>Explore Events</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/login"
                  className="btn-secondary py-3.5 px-8 text-sm rounded-xl font-semibold w-full sm:w-auto flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
