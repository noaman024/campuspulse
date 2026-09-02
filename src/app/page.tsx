"use client";

import Link from "next/link";
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
  FileCheck2,
  GraduationCap,
  Sparkles,
  Layers,
  ChevronRight,
} from "lucide-react";

const campusModules = [
  {
    icon: Calendar,
    title: "Departmental Event Bulletin",
    description: "Real-time calendar covering technical symposiums, hackathons, guest lectures, cultural fests, and inter-college sports tournaments.",
    badge: "Active Bulletin",
    badgeColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  },
  {
    icon: QrCode,
    title: "Digital QR Passes & Check-In",
    description: "One-click registration generating official digital entry passes with high-resolution QR verification for gate and auditorium access.",
    badge: "Contactless Entry",
    badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
  {
    icon: Share2,
    title: "Multi-Platform Event Sharing",
    description: "Broadcast campus events across WhatsApp batches, Telegram channels, LinkedIn, and email with pre-formatted invite summaries.",
    badge: "Viral Outreach",
    badgeColor: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
  },
  {
    icon: ClipboardList,
    title: "Student Feedback & Surveys",
    description: "Structured post-event feedback forms with star ratings, Likert scales, and verified student responses for quality evaluation.",
    badge: "Quality Audit",
    badgeColor: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  },
  {
    icon: Users,
    title: "Live Keynote & Speaker Q&A",
    description: "Interactive session question boards where students post queries, upvote key topics, and receive direct answers from guest speakers.",
    badge: "Interactive Sessions",
    badgeColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
  {
    icon: BarChart3,
    title: "Accreditation & Event Reports",
    description: "Automated executive summary reports recording chief guests, faculty coordinators, learning objectives, and verified attendee rosters.",
    badge: "Official Records",
    badgeColor: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20",
  },
];

const campusStats = [
  { label: "Academic Departments", value: "12+", sub: "Engineering, Science, Arts & Management" },
  { label: "Active Student Clubs", value: "35+", sub: "Technical, Cultural & Social Societies" },
  { label: "Verified QR Passes", value: "100%", sub: "Instant Gate & Hall Validation" },
  { label: "Paperless Operations", value: "0", sub: "Fully Digital Event Lifecycle" },
];

export default function HomePage() {
  return (
    <div className="relative overflow-hidden bg-background">
      {/* ─── Hero Section ─── */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 border-b border-border/60 gradient-mesh">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            {/* Collegiate Header Chip */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-6 border border-primary/20 bg-primary/5 text-primary text-xs font-semibold tracking-wide"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>OFFICE OF STUDENT AFFAIRS & EVENT COORDINATION</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15] mb-6"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Campus Events, Registrations & <span className="gradient-text">Verified QR Passes</span>
            </motion.h1>

            {/* Sub-text */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-10"
            >
              The official centralized platform for university symposiums, departmental hackathons, cultural festivals, sports leagues, and verified digital attendee passes.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3.5"
            >
              <Link
                href="/events"
                className="btn-primary w-full sm:w-auto py-3 px-6 text-sm font-semibold rounded-xl shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Browse Campus Events
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/login"
                className="btn-secondary w-full sm:w-auto py-3 px-6 text-sm font-semibold rounded-xl border border-border flex items-center justify-center gap-2"
              >
                <GraduationCap className="w-4 h-4 text-muted-foreground" />
                Student & Faculty Login
              </Link>
            </motion.div>
          </div>

          {/* Institutional Stats Strip */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto"
          >
            {campusStats.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm text-center"
              >
                <p className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                  {item.value}
                </p>
                <p className="text-xs font-bold text-primary mt-1">
                  {item.label}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {item.sub}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── Platform Capabilities ─── */}
      <section className="py-20 bg-surface/50 dark:bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="badge badge-primary text-xs uppercase font-bold tracking-wider mb-3">
              CAMPUS OPERATIONS
            </span>
            <h2
              className="text-2xl sm:text-3xl font-bold text-foreground mb-3"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Built for Student Councils, Faculty & Organizers
            </h2>
            <p className="text-sm text-muted-foreground">
              End-to-end management for college fests, academic conferences, student council elections, and sports tournaments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campusModules.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="glass-card p-6 rounded-2xl flex flex-col justify-between hover:border-primary/40 transition-all group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-foreground mb-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                  <div className="mt-5 pt-3 border-t border-border/40 flex items-center justify-between text-xs font-semibold text-primary">
                    <span>Learn how it works</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Ready to Publish Banner ─── */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-8 sm:p-12 border border-border/40 shadow-xl relative overflow-hidden">
            <div className="max-w-2xl relative z-10">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-300 bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-400/30 mb-4">
                <ShieldCheck className="w-3.5 h-3.5" />
                OFFICIAL UNIVERSITY SYSTEM
              </span>
              <h3
                className="text-2xl sm:text-3xl font-extrabold text-white mb-3"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Organizing a College Event or Workshop?
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                Create event listings, issue scannable QR passes, configure customized feedback questionnaires, and generate institutional reports with the CampusPulse administration suite.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/login"
                  className="py-2.5 px-5 bg-white text-slate-900 text-xs font-bold rounded-xl hover:bg-slate-100 transition-colors inline-flex items-center gap-2"
                >
                  Admin & Organizer Portal
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/events"
                  className="py-2.5 px-5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl border border-white/20 transition-colors inline-flex items-center gap-2"
                >
                  View Event Calendar
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
