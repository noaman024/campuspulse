"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  ClipboardList,
  BarChart3,
  QrCode,
  Users,
  ArrowRight,
  ShieldCheck,
  Share2,
  Building2,
  GraduationCap,
  Sparkles,
  ChevronRight,
  Search,
  CheckCircle2,
  MapPin,
  Clock,
  Ticket,
} from "lucide-react";

const categoryHighlights = [
  { name: "Technical", count: "12 Events", icon: "💻", color: "from-blue-600 to-cyan-600", desc: "Hackathons, Coding Duels & Robotics" },
  { name: "Cultural", count: "8 Events", icon: "🎭", color: "from-rose-600 to-pink-600", desc: "Fests, Concerts & Drama Battles" },
  { name: "Sports", count: "6 Tournaments", icon: "🏏", color: "from-emerald-600 to-teal-600", desc: "Cricket, Football & Athletics" },
  { name: "Workshops", count: "15 Sessions", icon: "💡", color: "from-amber-600 to-orange-600", desc: "Career, Cloud, AI & Placement Bootcamps" },
];

const campusModules = [
  {
    icon: QrCode,
    title: "100% Scannable Digital QR Passes",
    description: "Instant 1-click registration generating official digital passes. Gate security and auditorium volunteers scan in milliseconds for attendance verification.",
    tag: "Verified Entry",
  },
  {
    icon: Share2,
    title: "Multi-Platform Instant Sharing",
    description: "Broadcast campus announcements directly to WhatsApp batches, Telegram student groups, and LinkedIn with pre-formatted invite summaries.",
    tag: "Social Broadcast",
  },
  {
    icon: ClipboardList,
    title: "Post-Event Student Feedback & Ratings",
    description: "Google-Forms-style questionnaires with star ratings, Likert scales, and verified student feedback for institutional NAAC/NBA accreditation records.",
    tag: "Accreditation",
  },
  {
    icon: Users,
    title: "Live Keynote & Speaker Q&A Board",
    description: "Interactive real-time question board where attendees upvote queries and receive pinned official responses from guest dignitaries.",
    tag: "Live Interaction",
  },
];

export default function HomePage() {
  const [heroSearch, setHeroSearch] = useState("");

  return (
    <div className="relative overflow-hidden bg-background">
      {/* ─── Modern Split Hero Section ─── */}
      <section className="relative pt-8 pb-16 md:pt-16 md:pb-24 border-b border-border/70 gradient-mesh">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Hero Content (7 Cols) */}
            <div className="lg:col-span-7 text-left">
              {/* University Badge */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-5 border border-primary/25 bg-primary/10 text-primary text-xs font-bold tracking-wide"
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>OFFICE OF STUDENT AFFAIRS • CENTRAL EVENT PORTAL</span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15] mb-5"
              >
                Discover Campus Events & Get <span className="gradient-text">Instant QR Passes</span>
              </motion.h1>

              {/* Sub-headline */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-8 max-w-xl"
              >
                The official university hub for registering for departmental symposiums, national hackathons, cultural fests, athletic leagues, and digital attendee passes.
              </motion.p>

              {/* Search & Quick Filter Bar */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.25 }}
                className="p-2 rounded-2xl bg-card border border-border shadow-md max-w-xl mb-6"
              >
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      value={heroSearch}
                      onChange={(e) => setHeroSearch(e.target.value)}
                      placeholder="Search Hackathons, Fests, Workshops, Sports..."
                      className="w-full pl-10 pr-3 py-2 text-xs sm:text-sm bg-transparent border-0 focus:outline-none text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                  <Link
                    href={heroSearch ? `/events?search=${encodeURIComponent(heroSearch)}` : "/events"}
                    className="btn-primary py-2.5 px-4 text-xs font-bold rounded-xl whitespace-nowrap"
                  >
                    Find Events
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>

              {/* Quick Tags */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="flex items-center gap-2 flex-wrap text-xs text-muted-foreground"
              >
                <span className="font-semibold text-foreground">Popular:</span>
                <Link href="/events?category=Technical" className="px-2.5 py-1 rounded-lg bg-muted/60 hover:bg-muted text-foreground transition-colors font-medium">
                  💻 HackPulse 2026
                </Link>
                <Link href="/events?category=Cultural" className="px-2.5 py-1 rounded-lg bg-muted/60 hover:bg-muted text-foreground transition-colors font-medium">
                  🎭 Tarang 2026
                </Link>
                <Link href="/events?category=Workshop" className="px-2.5 py-1 rounded-lg bg-muted/60 hover:bg-muted text-foreground transition-colors font-medium">
                  ☁️ Cloud Masterclass
                </Link>
              </motion.div>
            </div>

            {/* Right Hero: Live Interactive Ticket Pass Card (5 Cols) */}
            <div className="lg:col-span-5">
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative rounded-3xl border border-primary/30 bg-card p-6 shadow-2xl overflow-hidden"
              >
                {/* Holographic Header Strip */}
                <div className="flex items-center justify-between pb-4 border-b border-border/80 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-white font-bold text-xs">
                      CP
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground leading-tight">OFFICIAL EVENT PASS</p>
                      <p className="text-[10px] text-muted-foreground font-mono">PASS #CP-2026-TKT-8942</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 rounded-full uppercase">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified Pass
                  </span>
                </div>

                {/* Event Highlights inside Pass */}
                <div className="space-y-3 mb-5">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-primary tracking-wider bg-primary/10 px-2 py-0.5 rounded">
                      Technical Hackathon
                    </span>
                    <h3 className="text-lg font-extrabold text-foreground mt-1.5 leading-snug">
                      HackPulse 2026: 24-Hour National Hackathon
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs py-2 bg-muted/40 rounded-xl p-3 border border-border/50">
                    <div>
                      <span className="text-[10px] text-muted-foreground font-semibold uppercase block">Date & Time</span>
                      <span className="font-bold text-foreground">Sep 18, 2026 • 09:00 AM</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground font-semibold uppercase block">Venue</span>
                      <span className="font-bold text-foreground truncate block">Computing Labs, Block 4</span>
                    </div>
                  </div>
                </div>

                {/* Scannable Pass Barcode & QR Box */}
                <div className="p-3.5 rounded-2xl bg-muted/60 border border-border flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-foreground">Digital Hall Ticket QR</p>
                    <p className="text-[11px] text-muted-foreground">Scan with any phone camera to verify attendance at gate.</p>
                  </div>
                  <div className="w-14 h-14 rounded-xl bg-white p-1 border border-border shadow-sm flex items-center justify-center flex-shrink-0">
                    <QrCode className="w-11 h-11 text-slate-900" />
                  </div>
                </div>

                {/* Bottom Pass Action */}
                <div className="mt-4 pt-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Ticket className="w-3.5 h-3.5 text-primary" />
                    <span>Seat Reserved: <strong>A-42</strong></span>
                  </div>
                  <Link
                    href="/events/hackpulse-2026"
                    className="text-primary hover:underline font-bold inline-flex items-center gap-1"
                  >
                    View Full Pass Details →
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Category Discovery Cards ─── */}
      <section className="py-16 bg-surface/50 dark:bg-card/20 border-b border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="badge badge-primary text-[10px] uppercase font-bold tracking-wider mb-2">
                ACADEMIC & CULTURAL STREAMS
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                Browse Events by Department & Category
              </h2>
            </div>
            <Link href="/events" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
              View All Campus Events <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {categoryHighlights.map((cat, idx) => (
              <Link
                key={idx}
                href={`/events?category=${cat.name}`}
                className="glass-card p-5 rounded-2xl hover:border-primary/50 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="text-2xl mb-3">{cat.icon}</div>
                  <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                    {cat.name} Events
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {cat.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-xs font-bold text-primary">
                  <span>{cat.count}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── University Platform Capabilities ─── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="badge badge-primary text-[10px] uppercase font-bold tracking-wider mb-3">
              OPERATIONS & ACCREDITATION
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
              Designed for Student Councils & Faculty Organizers
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Complete digital infrastructure for managing university events from proposal and ticketing to gate validation and feedback evaluation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {campusModules.map((mod, i) => {
              const Icon = mod.icon;
              return (
                <div
                  key={i}
                  className="glass-card p-6 rounded-2xl border border-border flex gap-4 items-start hover:border-primary/40 transition-all"
                >
                  <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <h3 className="text-base font-bold text-foreground">{mod.title}</h3>
                      <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        {mod.tag}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {mod.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
