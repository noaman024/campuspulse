"use client";

import { motion } from "framer-motion";
import { Building2, Users, QrCode, ClipboardList, Zap, Target, HeartHandshake } from "lucide-react";

const TEAM = [
  { name: "Dr. A. K. Sharma", role: "Dean of Student Affairs", dept: "Administration" },
  { name: "Prof. S. K. Gupta", role: "Faculty Coordinator — Technical", dept: "Dept. of CSE" },
  { name: "Dr. Shalini Verma", role: "Cultural Council Secretary", dept: "Student Affairs" },
  { name: "Prof. M. R. Iyer", role: "Faculty Coordinator — Workshops", dept: "Dept. of IT" },
  { name: "Coach Ramesh Patil", role: "Sports Council Head", dept: "Physical Education" },
  { name: "Prof. Sunita Deshmukh", role: "Training & Placement Officer", dept: "T&P Cell" },
];

const STATS = [
  { value: "12+", label: "Departments" },
  { value: "35+", label: "Active Clubs" },
  { value: "100%", label: "Paperless QR" },
  { value: "500+", label: "Events Hosted" },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen" style={{ background: "hsl(var(--bg))" }}>

      {/* ── Hero ── */}
      <section
        className="py-16 md:py-20 border-b"
        style={{ background: "hsl(var(--surface))", borderColor: "hsl(var(--border))" }}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border mb-5"
              style={{
                background: "hsl(var(--primary) / 0.08)",
                borderColor: "hsl(var(--primary) / 0.20)",
                color: "hsl(var(--primary))",
              }}
            >
              <Building2 className="w-3 h-3" />
              OFFICE OF STUDENT AFFAIRS
            </div>

            <h1
              className="font-extrabold tracking-tight text-foreground mb-4"
              style={{ fontSize: "clamp(1.8rem, 4vw, 2.75rem)", lineHeight: 1.15, letterSpacing: "-0.025em" }}
            >
              About <span className="gradient-text">CampusPulse</span>
            </h1>

            <p className="text-sm sm:text-base leading-relaxed" style={{ color: "hsl(var(--fg-muted))" }}>
              CampusPulse is the official university platform for managing, discovering, and registering
              for campus events — from national hackathons and cultural fests to placement workshops
              and inter-department sports tournaments.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Stats Strip ── */}
      <section className="py-10 border-b" style={{ borderColor: "hsl(var(--border))" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
              >
                <p
                  className="text-3xl font-extrabold tracking-tight mb-1 gradient-text"
                >
                  {s.value}
                </p>
                <p className="text-xs font-semibold" style={{ color: "hsl(var(--fg-muted))" }}>
                  {s.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              {
                icon: Target,
                title: "Our Mission",
                text: "To digitise the complete university event lifecycle — from creation and registration to attendance verification and post-event reporting.",
              },
              {
                icon: HeartHandshake,
                title: "Student-First",
                text: "Built for students, by the technical council. Instant QR passes, live Q&A boards, and feedback forms make participation seamless.",
              },
              {
                icon: Zap,
                title: "Paperless Campus",
                text: "Zero printed tickets. All passes are digital, verified by QR scan, and linked to each student's university account.",
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.07 }}
                  className="glass-card p-6 rounded-2xl"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: "hsl(var(--primary) / 0.10)", color: "hsl(var(--primary))" }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground mb-2">{item.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: "hsl(var(--fg-muted))" }}>{item.text}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Team / Faculty ── */}
      <section
        className="py-14 border-t"
        style={{ background: "hsl(var(--surface))", borderColor: "hsl(var(--border))" }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <p className="text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "hsl(var(--primary))" }}>
              Faculty & Council
            </p>
            <h2 className="text-xl font-bold text-foreground">The Team Behind CampusPulse</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {TEAM.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="glass-card p-5 rounded-2xl flex items-start gap-3"
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))" }}
                >
                  {member.name.split(" ").slice(-1)[0][0]}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-foreground truncate">{member.name}</p>
                  <p className="text-[11px] mt-0.5 leading-relaxed" style={{ color: "hsl(var(--fg-muted))" }}>
                    {member.role}
                  </p>
                  <span
                    className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: "hsl(var(--primary) / 0.10)", color: "hsl(var(--primary))" }}
                  >
                    {member.dept}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
