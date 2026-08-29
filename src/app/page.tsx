"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Zap,
  Calendar,
  ClipboardList,
  BarChart3,
  QrCode,
  Users,
  ArrowRight,
  Star,
  Shield,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: Calendar,
    title: "Event Discovery",
    description: "Browse, search, and filter campus events by category, date, and tags. Never miss what matters.",
    color: "252 85% 63%",
  },
  {
    icon: QrCode,
    title: "QR Ticketing & RSVP",
    description: "One-click RSVP with auto-generated QR codes for seamless check-in and attendance tracking.",
    color: "173 80% 40%",
  },
  {
    icon: ClipboardList,
    title: "Smart Feedback",
    description: "Google-Forms-like feedback builder with ratings, MCQs, Likert scales, and anonymous submissions.",
    color: "330 85% 60%",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Real-time charts for attendance, feedback scores, and event performance at a glance.",
    color: "38 92% 50%",
  },
  {
    icon: Users,
    title: "Live Q&A",
    description: "Students ask questions, upvote, and get real-time answers from organizers during events.",
    color: "152 69% 45%",
  },
  {
    icon: Shield,
    title: "Role-Based Access",
    description: "Student and Admin roles with dedicated portals, secure auth, and fine-grained permissions.",
    color: "210 70% 50%",
  },
];

const stats = [
  { label: "Events Managed", value: "500+" },
  { label: "Active Users", value: "2K+" },
  { label: "Feedback Collected", value: "10K+" },
  { label: "Departments", value: "25+" },
];

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      {/* ─── Hero Section ─── */}
      <section className="relative min-h-[92vh] flex items-center gradient-mesh">
        {/* Floating orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full opacity-20 animate-float" style={{ background: "radial-gradient(circle, hsl(252 85% 63% / 0.3), transparent)" }} />
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full opacity-15 animate-float" style={{ background: "radial-gradient(circle, hsl(173 80% 40% / 0.3), transparent)", animationDelay: "3s" }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8" style={{ background: "hsl(var(--primary) / 0.08)", border: "1px solid hsl(var(--primary) / 0.2)" }}>
                <Sparkles className="w-4 h-4" style={{ color: "hsl(var(--primary))" }} />
                <span className="text-sm font-medium" style={{ color: "hsl(var(--primary))" }}>
                  The future of campus event management
                </span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              <span style={{ color: "hsl(var(--foreground))" }}>Your Campus,</span>
              <br />
              <span className="gradient-text">One Pulse Away</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              Discover events, RSVP with QR tickets, share feedback, and explore analytics — all in one beautiful, centralized platform built for campus communities.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href="/events" className="btn-primary py-3 px-8 text-base rounded-xl">
                <Calendar className="w-5 h-5" />
                Explore Events
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/register" className="btn-secondary py-3 px-8 text-base rounded-xl">
                Get Started Free
              </Link>
            </motion.div>
          </div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-20 glass-card p-6 rounded-2xl max-w-3xl mx-auto"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-2xl sm:text-3xl font-bold gradient-text">{stat.value}</p>
                  <p className="text-xs sm:text-sm mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Features Section ─── */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="badge badge-primary mb-4 text-xs">FEATURES</span>
            <h2
              className="text-3xl sm:text-4xl font-bold mb-4"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "hsl(var(--foreground))" }}
            >
              Everything Your Campus Needs
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: "hsl(var(--muted-foreground))" }}>
              From event discovery to post-event analytics, CampusPulse covers the entire lifecycle.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card p-6 group"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                    style={{ background: `hsl(${feature.color} / 0.12)` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: `hsl(${feature.color})` }} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2" style={{ color: "hsl(var(--foreground))" }}>
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── CTA Section ─── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden p-12 sm:p-16 text-center"
            style={{ background: "linear-gradient(135deg, hsl(252 85% 63%), hsl(252 85% 45%))" }}
          >
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full" style={{ background: "radial-gradient(circle, white, transparent)" }} />
              <div className="absolute bottom-0 right-1/4 w-48 h-48 rounded-full" style={{ background: "radial-gradient(circle, white, transparent)" }} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-center gap-2 mb-6">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Ready to Pulse Your Campus?
              </h2>
              <p className="text-lg text-white/80 max-w-xl mx-auto mb-8">
                Join thousands of students and organizers who are transforming how campus events are managed.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 py-3 px-8 rounded-xl bg-white font-semibold text-base transition-all hover:bg-white/90 hover:scale-105"
                  style={{ color: "hsl(252 85% 50%)" }}
                >
                  <Star className="w-5 h-5" />
                  Create Account
                </Link>
                <Link
                  href="/events"
                  className="inline-flex items-center gap-2 py-3 px-8 rounded-xl bg-white/15 text-white font-semibold text-base border border-white/30 transition-all hover:bg-white/25"
                >
                  Browse Events
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
