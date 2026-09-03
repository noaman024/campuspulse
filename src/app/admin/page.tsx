"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Users,
  ClipboardList,
  BarChart3,
  TrendingUp,
  MessageSquare,
  CheckCircle,
  Clock,
  Plus,
  Upload,
  FileText,
  Eye,
  Edit,
  UserCheck,
  Check,
  X,
  Settings,
} from "lucide-react";
import {
  getDashboardStats,
  getRecentEvents,
  getCategoryDistribution,
  getRecentRegistrations,
} from "@/actions/analytics";
import { toggleAttendance } from "@/actions/events";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { format } from "date-fns";
import Link from "next/link";
import Toast from "@/components/ui/Toast";

interface RegistrationItem {
  eventId: string;
  eventTitle: string;
  eventSlug: string;
  eventCategory: string;
  eventDate: string;
  userId: string;
  userName: string;
  userEmail: string;
  userDepartment: string;
  registeredAt: string;
  attended: boolean;
  qrCodeToken: string;
}

const CAT_COLORS: Record<string, string> = {
  Technical: "214 89% 52%",
  Cultural:  "346 80% 50%",
  Sports:    "158 64% 38%",
  Workshop:  "35 92% 45%",
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Record<string, unknown> | null>(null);
  const [recent, setRecent] = useState<Record<string, unknown>[]>([]);
  const [categories, setCategories] = useState<{ category: string; count: number }[]>([]);
  const [registrations, setRegistrations] = useState<RegistrationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [togglingUser, setTogglingUser] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const loadData = async () => {
    try {
      const [s, r, c, regs] = await Promise.all([
        getDashboardStats(),
        getRecentEvents(5),
        getCategoryDistribution(),
        getRecentRegistrations(8),
      ]);
      setStats(s);
      setRecent(r);
      setCategories(c);
      setRegistrations(regs);
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleToggleAttendance = async (eventId: string, userId: string) => {
    setTogglingUser(userId);
    try {
      const res = await toggleAttendance(eventId, userId);
      setRegistrations((prev) =>
        prev.map((reg) =>
          reg.eventId === eventId && reg.userId === userId
            ? { ...reg, attended: res.attended }
            : reg
        )
      );
      setToast({ message: res.message, type: "success" });
    } catch (err) {
      setToast({ message: err instanceof Error ? err.message : "Failed to toggle attendance", type: "error" });
    } finally {
      setTogglingUser(null);
    }
  };

  if (loading) return <LoadingSpinner size="lg" text="Loading dashboard..." fullPage />;

  const statCards = [
    { label: "Total Events",        value: stats?.totalEvents       ?? 0, icon: Calendar,     color: "214 89% 52%" },
    { label: "Upcoming Events",     value: stats?.upcomingEvents    ?? 0, icon: Clock,        color: "35 92% 45%"  },
    { label: "Total Users",         value: stats?.totalUsers        ?? 0, icon: Users,        color: "199 89% 48%" },
    { label: "Total Registrations", value: stats?.totalRegistrations ?? 0, icon: TrendingUp,   color: "158 64% 38%" },
    { label: "Attendance Rate",     value: `${stats?.attendanceRate ?? 0}%`, icon: CheckCircle, color: "346 80% 50%" },
    { label: "Feedback Surveys",    value: stats?.totalFeedbackForms ?? 0, icon: ClipboardList, color: "214 89% 52%" },
    { label: "Student Responses",   value: stats?.totalFeedbackSubmissions ?? 0, icon: MessageSquare, color: "35 92% 45%" },
    { label: "Completed Events",    value: stats?.completedEvents   ?? 0, icon: BarChart3,    color: "158 64% 38%" },
  ];

  return (
    <div className="p-5 lg:p-7 space-y-6 min-h-screen" style={{ background: "hsl(var(--bg))" }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-foreground tracking-tight">Admin Dashboard</h1>
          <p className="text-xs mt-0.5" style={{ color: "hsl(var(--fg-muted))" }}>
            Real-time overview — events, registrations, and attendance
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/admin/events/new" className="btn-primary py-2 px-4 text-xs">
            <Plus className="w-3.5 h-3.5" /> Create Event
          </Link>
          <Link href="/admin/feedback" className="btn-secondary py-2 px-3.5 text-xs">
            <ClipboardList className="w-3.5 h-3.5" /> Feedback
          </Link>
          <Link href="/admin/media" className="btn-secondary py-2 px-3.5 text-xs">
            <Upload className="w-3.5 h-3.5" /> Media
          </Link>
          <Link href="/admin/reports" className="btn-secondary py-2 px-3.5 text-xs">
            <FileText className="w-3.5 h-3.5" /> Reports
          </Link>
          <Link href="/admin/settings" className="btn-secondary py-2 px-3.5 text-xs">
            <Settings className="w-3.5 h-3.5" /> Site Settings
          </Link>
        </div>
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.03 }}
              className="rounded-xl flex flex-col justify-between"
              style={{
                padding: "1.1rem 1.25rem",
                minHeight: "96px",
                background: "hsl(var(--surface-raised))",
                border: "1px solid hsla(var(--border-strong), 0.9)",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.2)",
              }}
            >
              {/* Icon + Label row */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium truncate" style={{ color: "hsl(var(--fg-muted))" }}>
                  {card.label}
                </span>
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: `hsl(${card.color} / 0.15)` }}
                >
                  <Icon className="w-3.5 h-3.5" style={{ color: `hsl(${card.color})` }} />
                </div>
              </div>

              {/* Value */}
              <div className="mt-2 flex items-baseline">
                <p className="text-2xl font-bold tracking-tight text-foreground" style={{ lineHeight: 1.2 }}>
                  {String(card.value)}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Registrations Table ── */}
      <div
        className="rounded-2xl border overflow-hidden"
        style={{ background: "hsl(var(--surface-raised))", borderColor: "hsl(var(--border))" }}
      >
        {/* Table Header */}
        <div
          className="flex items-center justify-between px-5 py-4 border-b"
          style={{ borderColor: "hsl(var(--border))" }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: "hsl(var(--primary) / 0.10)" }}
            >
              <UserCheck className="w-4 h-4" style={{ color: "hsl(var(--primary))" }} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground">Recent Registrations</h2>
              <p className="text-[11px]" style={{ color: "hsl(var(--fg-subtle))" }}>
                Live student registrations with attendance control
              </p>
            </div>
          </div>
          <span
            className="text-[10px] font-bold px-2.5 py-1 rounded-full"
            style={{ background: "hsl(var(--primary) / 0.10)", color: "hsl(var(--primary))" }}
          >
            {registrations.length} Records
          </span>
        </div>

        {registrations.length === 0 ? (
          <p className="text-xs text-center py-10" style={{ color: "hsl(var(--fg-muted))" }}>
            No registrations yet. Students will appear here automatically.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr
                  className="border-b text-left"
                  style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--surface))" }}
                >
                  {["Student", "Department", "Event", "Registered At", "Attendance", "Action"].map((h) => (
                    <th key={h} className="px-5 py-3 text-[11px] font-bold uppercase tracking-wide"
                      style={{ color: "hsl(var(--fg-muted))" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {registrations.map((reg, idx) => (
                  <tr
                    key={`${reg.eventId}-${reg.userId}-${idx}`}
                    className="border-b transition-colors"
                    style={{ borderColor: "hsl(var(--border))" }}
                    onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.background = "hsl(var(--surface))"}
                    onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.background = "transparent"}
                  >
                    <td className="px-5 py-3">
                      <p className="font-semibold text-foreground">{reg.userName}</p>
                      <p className="text-[10px] mt-0.5" style={{ color: "hsl(var(--fg-subtle))" }}>{reg.userEmail}</p>
                    </td>
                    <td className="px-5 py-3" style={{ color: "hsl(var(--fg-muted))" }}>{reg.userDepartment}</td>
                    <td className="px-5 py-3">
                      <Link
                        href={`/events/${reg.eventSlug}`}
                        target="_blank"
                        className="font-medium text-foreground hover:text-primary transition-colors line-clamp-1 max-w-[180px] block"
                      >
                        {reg.eventTitle}
                      </Link>
                      <span
                        className="inline-block mt-1 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide"
                        style={{
                          background: `hsl(${CAT_COLORS[reg.eventCategory] || "214 89% 52%"} / 0.12)`,
                          color: `hsl(${CAT_COLORS[reg.eventCategory] || "214 89% 52%"})`,
                        }}
                      >
                        {reg.eventCategory}
                      </span>
                    </td>
                    <td className="px-5 py-3" style={{ color: "hsl(var(--fg-muted))" }}>
                      {format(new Date(reg.registeredAt), "MMM dd, hh:mm a")}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full"
                        style={
                          reg.attended
                            ? { background: "hsl(var(--success) / 0.12)", color: "hsl(var(--success))" }
                            : { background: "hsl(var(--border) / 0.7)", color: "hsl(var(--fg-subtle))" }
                        }
                      >
                        {reg.attended ? <Check className="w-2.5 h-2.5" /> : <X className="w-2.5 h-2.5" />}
                        {reg.attended ? "Attended" : "Not Marked"}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => handleToggleAttendance(reg.eventId, reg.userId)}
                        disabled={togglingUser === reg.userId}
                        className="py-1.5 px-3 rounded-lg text-[10px] font-bold transition-all disabled:opacity-50"
                        style={
                          reg.attended
                            ? { background: "hsl(var(--danger) / 0.10)", color: "hsl(var(--danger))" }
                            : { background: "hsl(var(--primary))", color: "white" }
                        }
                      >
                        {togglingUser === reg.userId ? "Saving..." : reg.attended ? "Mark Absent" : "Mark Present"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Bottom: Events + Categories ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Active Events */}
        <div
          className="lg:col-span-2 rounded-2xl border overflow-hidden"
          style={{ background: "hsl(var(--surface-raised))", borderColor: "hsl(var(--border))" }}
        >
          <div
            className="flex items-center justify-between px-5 py-4 border-b"
            style={{ borderColor: "hsl(var(--border))" }}
          >
            <div>
              <h2 className="text-sm font-bold text-foreground">Active Campus Events</h2>
              <p className="text-[11px] mt-0.5" style={{ color: "hsl(var(--fg-subtle))" }}>Manage details, media, and registrations</p>
            </div>
            <Link href="/admin/events" className="text-xs font-semibold" style={{ color: "hsl(var(--primary))" }}>
              View All ({String(stats?.totalEvents ?? recent.length)}) →
            </Link>
          </div>

          <div className="divide-y" style={{ borderColor: "hsl(var(--border))" }}>
            {recent.length === 0 ? (
              <p className="text-xs text-center py-10" style={{ color: "hsl(var(--fg-muted))" }}>No events found.</p>
            ) : (
              recent.map((event, i) => {
                const color = CAT_COLORS[event.category as string] || "214 89% 52%";
                return (
                  <motion.div
                    key={event._id as string}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="flex items-center justify-between gap-4 px-5 py-3.5 transition-colors"
                    onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.background = "hsl(var(--surface))"}
                    onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.background = "transparent"}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: `hsl(${color} / 0.12)` }}
                      >
                        <Calendar className="w-4 h-4" style={{ color: `hsl(${color})` }} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-foreground truncate">{event.title as string}</p>
                        <p className="text-[11px] mt-0.5 truncate" style={{ color: "hsl(var(--fg-subtle))" }}>
                          {format(new Date(event.eventDate as string), "MMM dd, yyyy")} · {event.venue as string}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide"
                        style={{ background: `hsl(${color} / 0.12)`, color: `hsl(${color})` }}
                      >
                        {event.category as string}
                      </span>
                      <span className="text-[11px] font-medium flex items-center gap-0.5 mx-1" style={{ color: "hsl(var(--fg-muted))" }}>
                        <Users className="w-3 h-3" />
                        {(event.registeredUsers as unknown[])?.length ?? 0}/{event.maxCapacity as number}
                      </span>
                      <Link
                        href={`/admin/events/${event._id}/edit`}
                        className="p-1.5 rounded-lg transition-colors"
                        style={{ color: "hsl(var(--fg-subtle))" }}
                        onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.color = "hsl(var(--fg))"}
                        onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.color = "hsl(var(--fg-subtle))"}
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Link>
                      <Link
                        href={`/events/${event.slug}`}
                        target="_blank"
                        className="p-1.5 rounded-lg transition-colors"
                        style={{ color: "hsl(var(--fg-subtle))" }}
                        onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.color = "hsl(var(--fg))"}
                        onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.color = "hsl(var(--fg-subtle))"}
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>

        {/* Category Distribution */}
        <div
          className="rounded-2xl border flex flex-col"
          style={{ background: "hsl(var(--surface-raised))", borderColor: "hsl(var(--border))" }}
        >
          <div
            className="px-5 py-4 border-b"
            style={{ borderColor: "hsl(var(--border))" }}
          >
            <h2 className="text-sm font-bold text-foreground">Event Categories</h2>
            <p className="text-[11px] mt-0.5" style={{ color: "hsl(var(--fg-subtle))" }}>Distribution across campus</p>
          </div>

          <div className="flex-1 p-5 space-y-4">
            {categories.length === 0 ? (
              <p className="text-xs text-center py-8" style={{ color: "hsl(var(--fg-muted))" }}>No category data.</p>
            ) : (
              categories.map((cat, i) => {
                const total = categories.reduce((s, c) => s + c.count, 0);
                const pct = total > 0 ? Math.round((cat.count / total) * 100) : 0;
                const color = CAT_COLORS[cat.category] || "214 89% 52%";
                return (
                  <div key={cat.category}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold text-foreground">{cat.category}</span>
                      <span className="text-xs font-bold" style={{ color: `hsl(${color})` }}>
                        {cat.count} ({pct}%)
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "hsl(var(--border))" }}>
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: `hsl(${color})` }}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.7, delay: i * 0.1 }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="px-5 pb-5 pt-2">
            <Link href="/admin/analytics" className="btn-secondary w-full py-2 text-xs justify-center">
              <BarChart3 className="w-3.5 h-3.5" /> View Analytics
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
