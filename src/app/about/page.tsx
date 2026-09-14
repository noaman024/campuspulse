"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  Users,
  QrCode,
  ClipboardList,
  Zap,
  Target,
  HeartHandshake,
  Mail,
  Phone,
  Globe,
  Sparkles,
  ExternalLink,
  Code2,
  Edit,
  GraduationCap,
  Layers,
} from "lucide-react";
import { getAboutSettings } from "@/actions/settings";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ICreatorMember, ISupportMember, IAboutSettings } from "@/models/SiteSettings";

function GithubIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function LinkedinIcon({ className = "w-3.5 h-3.5 text-blue-400" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  );
}

const DEFAULT_ABOUT: IAboutSettings = {
  badge: "PROJECT ARCHITECTS & DEVELOPERS",
  title: "Meet the Creators Behind CampusPulse",
  subtitle: "Designed and engineered with passion for modern, paperless campus event experiences.",
  projectStory:
    "CampusPulse was engineered to solve real campus challenges — replacing manual registration queues, physical paper tickets, and fragmented feedback with an all-in-one digital platform featuring instant QR verification, interactive live Q&A, and direct event media showcases.",
  techStack: [
    "Next.js 16 (App Router)",
    "TypeScript",
    "Tailwind CSS v4",
    "MongoDB & Mongoose",
    "NextAuth.js",
    "Framer Motion",
    "Capacitor Android Native",
    "HTML5 MediaRecorder & Canvas",
  ],
  creators: [
    {
      id: "creator-1",
      name: "Mohd Noaman",
      role: "Lead Full-Stack Developer & Project Architect",
      department: "Dept. of Computer Science & Engineering",
      college: "P. R. Pote Patil College of Engineering & Management, Amravati",
      bio: "Passionate engineer specializing in full-stack architecture, building intuitive, modern web apps and high-performance digital systems for educational institutions.",
      avatarUrl: "",
      githubUrl: "https://github.com/noaman024",
      linkedinUrl: "",
      email: "mdnoaman024@gmail.com",
      portfolioUrl: "",
      highlights: ["System Architecture", "Next.js & React 19", "MongoDB Database", "Capacitor Mobile APK"],
    },
  ],
  supportMembers: [
    {
      id: "support-1",
      name: "Student Technical Council",
      role: "Campus Ambassador & Technical Support",
      department: "Computer Science & Engineering",
      avatarUrl: "",
      email: "support@campuspulse.edu",
      phone: "+91 98765 43210",
      linkedinUrl: "",
      notes: "Assisting students with event queries, ticket verification, and digital feedback.",
    },
  ],
};

const STATS = [
  { value: "100%", label: "Paperless QR Passes" },
  { value: "12+", label: "Academic Departments" },
  { value: "35+", label: "Active Student Clubs" },
  { value: "Instant", label: "Verification Speed" },
];

export default function AboutPage() {
  const { data: session } = useSession();
  const [aboutData, setAboutData] = useState<IAboutSettings>(DEFAULT_ABOUT);
  const [loading, setLoading] = useState(true);

  const isAdmin = session?.user?.role === "admin";

  useEffect(() => {
    getAboutSettings()
      .then((data) => {
        if (data) setAboutData(data);
      })
      .catch((err) => console.error("Failed to load about data:", err))
      .finally(() => setLoading(false));
  }, []);

  const creators = aboutData.creators && aboutData.creators.length > 0 ? aboutData.creators : DEFAULT_ABOUT.creators;
  const supportMembers =
    aboutData.supportMembers && aboutData.supportMembers.length > 0
      ? aboutData.supportMembers
      : DEFAULT_ABOUT.supportMembers || [];
  const techStack = aboutData.techStack && aboutData.techStack.length > 0 ? aboutData.techStack : DEFAULT_ABOUT.techStack!;

  return (
    <main className="min-h-screen pb-16" style={{ background: "hsl(var(--bg))" }}>
      {/* ── Hero Section ── */}
      <section
        className="py-16 md:py-24 border-b relative overflow-hidden"
        style={{ background: "hsl(var(--surface))", borderColor: "hsl(var(--border))" }}
      >
        {/* Glow backdrop effects */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-32 w-72 h-72 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border mb-5 shadow-sm"
              style={{
                background: "hsl(var(--primary) / 0.08)",
                borderColor: "hsl(var(--primary) / 0.25)",
                color: "hsl(var(--primary))",
              }}
            >
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              {aboutData.badge || "PROJECT DEVELOPERS & ARCHITECTS"}
            </div>

            <h1
              className="font-extrabold tracking-tight text-foreground mb-4"
              style={{ fontSize: "clamp(2rem, 5vw, 3.25rem)", lineHeight: 1.15, letterSpacing: "-0.025em" }}
            >
              {aboutData.title || "Meet the Creators Behind CampusPulse"}
            </h1>

            <p className="text-sm sm:text-base leading-relaxed max-w-2xl mx-auto text-muted-foreground">
              {aboutData.subtitle ||
                "Designed and engineered with passion for modern, paperless campus event experiences."}
            </p>

            {/* Admin Customize Shortcut */}
            {isAdmin && (
              <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
                <Link
                  href="/admin/settings#creators"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-all shadow-sm"
                >
                  <Edit className="w-3.5 h-3.5" /> Customize Creators
                </Link>
                <Link
                  href="/admin/settings#support-members"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition-all shadow-sm"
                >
                  <Users className="w-3.5 h-3.5" /> Manage Support Members
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* ── Stats Strip ── */}
      <section className="py-8 border-b" style={{ borderColor: "hsl(var(--border))" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
              >
                <p className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-1 gradient-text">{s.value}</p>
                <p className="text-xs font-semibold text-muted-foreground">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 🌟 Project Creators Showcase ("Project Banane Wale") ── */}
      <section className="py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              Lead Development & Engineering
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Project Creator & Architect</h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto">
              Get to know the mind behind the platform architecture, UI engineering, and mobile experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-1 gap-8 max-w-3xl mx-auto">
            {creators.map((creator, idx) => {
              const initials = creator.name
                ? creator.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()
                : "DEV";

              return (
                <motion.div
                  key={creator.id || idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                  className="glass-card rounded-3xl p-6 sm:p-8 border relative overflow-hidden shadow-xl"
                  style={{
                    background: "hsl(var(--surface))",
                    borderColor: "hsl(var(--border))",
                  }}
                >
                  {/* Decorative background glow */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 relative z-10">
                    {/* Creator Avatar with Glowing Frame */}
                    <div className="relative group shrink-0">
                      <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border-2 border-primary/40 p-1 bg-surface-raised shadow-lg shadow-primary/10">
                        {creator.avatarUrl ? (
                          <img
                            src={creator.avatarUrl}
                            alt={creator.name}
                            className="w-full h-full object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
                            onError={(e) => {
                              // If image fails to load, fallback to avatar placeholder
                              (e.target as HTMLElement).style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="w-full h-full rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-3xl font-extrabold tracking-wider shadow-inner">
                            {initials}
                          </div>
                        )}
                      </div>
                      <div className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1 backdrop-blur-md">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Active Developer
                      </div>
                    </div>

                    {/* Creator Details */}
                    <div className="flex-1 text-center sm:text-left space-y-3">
                      <div>
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                          <h3 className="text-xl sm:text-2xl font-extrabold text-foreground">{creator.name}</h3>
                          <span className="badge bg-primary/15 text-primary border border-primary/25 text-xs font-semibold">
                            {creator.role}
                          </span>
                        </div>

                        {(creator.department || creator.college) && (
                          <p className="text-xs font-medium text-muted-foreground flex items-center justify-center sm:justify-start gap-1.5 mt-0.5">
                            <GraduationCap className="w-4 h-4 text-primary shrink-0" />
                            <span>
                              {[creator.department, creator.college].filter(Boolean).join(" • ")}
                            </span>
                          </p>
                        )}
                      </div>

                      {/* Bio */}
                      <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                        {creator.bio ||
                          "Passionate software engineer building innovative modern web applications with focus on usability and performance."}
                      </p>

                      {/* Skill Highlights */}
                      {creator.highlights && creator.highlights.length > 0 && (
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 pt-1">
                          {creator.highlights.map((h, i) => (
                            <span
                              key={i}
                              className="px-2.5 py-0.5 rounded-lg text-[11px] font-semibold bg-surface-raised border border-border text-foreground/90"
                            >
                              ⚡ {h}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Social & Contact Links */}
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-2">
                        {creator.githubUrl && (
                          <a
                            href={creator.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="btn-secondary py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5 hover:border-primary/50 transition-all"
                          >
                            <GithubIcon className="w-3.5 h-3.5" /> GitHub
                          </a>
                        )}

                        {creator.linkedinUrl && (
                          <a
                            href={creator.linkedinUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="btn-secondary py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5 hover:border-primary/50 transition-all"
                          >
                            <LinkedinIcon className="w-3.5 h-3.5 text-blue-400" /> LinkedIn
                          </a>
                        )}

                        {creator.email && (
                          <a
                            href={`mailto:${creator.email}`}
                            className="btn-secondary py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5 hover:border-primary/50 transition-all"
                          >
                            <Mail className="w-3.5 h-3.5 text-emerald-400" /> Contact Email
                          </a>
                        )}

                        {creator.portfolioUrl && (
                          <a
                            href={creator.portfolioUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="btn-secondary py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5 hover:border-primary/50 transition-all"
                          >
                            <Globe className="w-3.5 h-3.5 text-primary" /> Portfolio
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Support Team & Volunteers Section (Multiply / Dynamic) ── */}
      {supportMembers && supportMembers.length > 0 && (
        <section
          id="support-team"
          className="py-14 border-t"
          style={{
            background: "radial-gradient(ellipse at top, hsl(150 60% 35% / 0.05), transparent 70%)",
            borderColor: "hsl(var(--border))",
          }}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Users className="w-3.5 h-3.5" />
                <span>SUPPORT & ORGANIZING TEAM</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-foreground">
                Project Support & Student Coordinators
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
                Dedicated student leaders, ambassadors, and volunteers assisting with on-ground coordination and campus outreach.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {supportMembers.map((member, idx) => {
                const initials = member.name
                  ? member.name
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()
                  : "SUP";

                return (
                  <motion.div
                    key={member.id || idx}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: idx * 0.06 }}
                    className="glass-card p-5 rounded-2xl border flex flex-col justify-between hover:border-emerald-500/40 transition-all group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                          {member.avatarUrl ? (
                            <img
                              src={member.avatarUrl}
                              alt={member.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-emerald-400 font-bold text-sm">
                              {initials}
                            </span>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm font-bold text-foreground truncate">
                            {member.name}
                          </h3>
                          <span className="inline-block text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 truncate max-w-full">
                            {member.role}
                          </span>
                        </div>
                      </div>

                      {member.department && (
                        <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 truncate">
                          <Building2 className="w-3 h-3 flex-shrink-0 text-emerald-400" />
                          <span className="truncate">{member.department}</span>
                        </p>
                      )}

                      {member.notes && (
                        <p className="text-[11px] text-foreground/80 leading-relaxed line-clamp-3 bg-surface-raised/40 p-2 rounded-lg border border-border/50">
                          {member.notes}
                        </p>
                      )}
                    </div>

                    {/* Contact links */}
                    {(member.email || member.phone || member.linkedinUrl) && (
                      <div className="pt-3 mt-3 border-t border-border flex items-center gap-2 flex-wrap">
                        {member.email && (
                          <a
                            href={`mailto:${member.email}`}
                            title={`Email ${member.name}`}
                            className="p-1.5 rounded-lg bg-surface-raised border border-border hover:border-emerald-500/40 text-muted-foreground hover:text-emerald-400 text-xs transition-colors flex items-center gap-1"
                          >
                            <Mail className="w-3.5 h-3.5" />
                            <span className="text-[10px]">Email</span>
                          </a>
                        )}

                        {member.phone && (
                          <a
                            href={`tel:${member.phone}`}
                            title={`Call ${member.phone}`}
                            className="p-1.5 rounded-lg bg-surface-raised border border-border hover:border-emerald-500/40 text-muted-foreground hover:text-emerald-400 text-xs transition-colors flex items-center gap-1"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span className="text-[10px]">Phone</span>
                          </a>
                        )}

                        {member.linkedinUrl && (
                          <a
                            href={member.linkedinUrl}
                            target="_blank"
                            rel="noreferrer"
                            title="LinkedIn Profile"
                            className="p-1.5 rounded-lg bg-surface-raised border border-border hover:border-blue-500/40 text-muted-foreground hover:text-blue-400 text-xs transition-colors flex items-center gap-1"
                          >
                            <LinkedinIcon className="w-3.5 h-3.5 text-blue-400" />
                            <span className="text-[10px]">LinkedIn</span>
                          </a>
                        )}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Project Story & Vision ── */}
      <section
        className="py-14 border-t border-b"
        style={{ background: "hsl(var(--surface))", borderColor: "hsl(var(--border))" }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Behind The Code</span>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">Why CampusPulse Was Created</h2>
          </div>

          <div className="glass-card p-6 sm:p-8 rounded-2xl border space-y-4">
            <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
              {aboutData.projectStory ||
                "CampusPulse was built to solve real-world university event challenges — eliminating manual registration sheets, paper passes, and disconnected feedback forms with an all-in-one digital ecosystem."}
            </p>
          </div>

          {/* Tech Stack Pills */}
          <div className="space-y-3 pt-2">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground text-center flex items-center justify-center gap-1.5">
              <Code2 className="w-4 h-4 text-primary" /> Engineered With Modern Technologies
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {techStack.map((tech, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-surface-raised border border-border text-foreground shadow-sm flex items-center gap-1.5"
                >
                  <Layers className="w-3.5 h-3.5 text-primary" /> {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Mission Pillars ── */}
      <section className="py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              {
                icon: Target,
                title: "Complete Event Lifecycle",
                text: "From draft creation, promo video showcasing, and online registration to attendance verification and report generation.",
              },
              {
                icon: HeartHandshake,
                title: "Student-First Architecture",
                text: "Engineered specifically for university communities with instant scannable QR tickets, live Q&A forums, and verified feedback.",
              },
              {
                icon: Zap,
                title: "100% Paperless Campus",
                text: "Zero printed paper tickets. All passes are digital, verifiable in 1 tap, and linked directly to institutional accounts.",
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
                  className="glass-card p-6 rounded-2xl border"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: "hsl(var(--primary) / 0.10)", color: "hsl(var(--primary))" }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground mb-2">{item.title}</h3>
                  <p className="text-xs leading-relaxed text-muted-foreground">{item.text}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
