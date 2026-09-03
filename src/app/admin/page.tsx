"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Search,
  User,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  MapPin,
  Tag,
} from "lucide-react";
import {
  getDashboardStats,
  getRecentEvents,
  getCategoryDistribution,
  getRecentRegistrations,
  getAllUsersDirectory,
  UserDirectoryItem,
  getEventsRegistrationDetails,
  EventRegistrationDetail,
} from "@/actions/analytics";
import { getAdminEvents, toggleAttendance } from "@/actions/events";
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

  // Modals & Interactive Breakdown State
  const [activeStatModal, setActiveStatModal] = useState<
    | "total-events"
    | "upcoming-events"
    | "total-users"
    | "total-registrations"
    | "attendance-rate"
    | "feedback-surveys"
    | "student-responses"
    | "completed-events"
    | null
  >(null);

  // Users Directory State
  const [userDirectory, setUserDirectory] = useState<{
    totalCount: number;
    students: UserDirectoryItem[];
    admins: UserDirectoryItem[];
    studentCount: number;
    adminCount: number;
  }>({ totalCount: 0, students: [], admins: [], studentCount: 0, adminCount: 0 });
  const [userTab, setUserTab] = useState<"student" | "admin">("student");
  const [userSearch, setUserSearch] = useState("");

  // Event Registrations Breakdown State
  const [eventsWithRegs, setEventsWithRegs] = useState<EventRegistrationDetail[]>([]);
  const [regEventSearch, setRegEventSearch] = useState("");
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);

  // All Events for modal browsing
  const [allEvents, setAllEvents] = useState<Record<string, unknown>[]>([]);

  const loadData = async () => {
    try {
      const [s, r, c, regs, usersDir, evRegs, allEvs] = await Promise.all([
        getDashboardStats(),
        getRecentEvents(5),
        getCategoryDistribution(),
        getRecentRegistrations(8),
        getAllUsersDirectory().catch(() => ({ totalCount: 0, students: [], admins: [], studentCount: 0, adminCount: 0 })),
        getEventsRegistrationDetails().catch(() => []),
        getAdminEvents().catch(() => []),
      ]);
      setStats(s);
      setRecent(r);
      setCategories(c);
      setRegistrations(regs);
      if (usersDir) setUserDirectory(usersDir);
      if (evRegs) setEventsWithRegs(evRegs);
      if (allEvs) setAllEvents(allEvs);
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
      // Also update eventsWithRegs
      setEventsWithRegs((prev) =>
        prev.map((ev) => {
          if (ev.id !== eventId) return ev;
          const updatedAttendees = ev.attendees.map((a) =>
            a.userId === userId ? { ...a, attended: res.attended } : a
          );
          const attendedCount = updatedAttendees.filter((a) => a.attended).length;
          const turnoutRate = ev.totalRegistrations > 0 ? Math.round((attendedCount / ev.totalRegistrations) * 100) : 0;
          return {
            ...ev,
            attendees: updatedAttendees,
            attendedCount,
            turnoutRate,
          };
        })
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
    {
      id: "total-events",
      label: "Total Events",
      value: stats?.totalEvents ?? 0,
      icon: Calendar,
      color: "214 89% 52%",
      actionHint: "Click to view all events",
    },
    {
      id: "upcoming-events",
      label: "Upcoming Events",
      value: stats?.upcomingEvents ?? 0,
      icon: Clock,
      color: "35 92% 45%",
      actionHint: "Click to view schedule",
    },
    {
      id: "total-users",
      label: "Total Users",
      value: stats?.totalUsers ?? 0,
      icon: Users,
      color: "199 89% 48%",
      actionHint: "Click for Students & Admins",
    },
    {
      id: "total-registrations",
      label: "Total Registrations",
      value: stats?.totalRegistrations ?? 0,
      isSpecialRegistrationCard: true,
      icon: TrendingUp,
      color: "158 64% 38%",
      actionHint: "Click to view per-event count",
    },
    {
      id: "attendance-rate",
      label: "Attendance Rate",
      value: `${stats?.attendanceRate ?? 0}%`,
      icon: CheckCircle,
      color: "346 80% 50%",
      actionHint: "Click for turnout details",
    },
    {
      id: "feedback-surveys",
      label: "Feedback Surveys",
      value: stats?.totalFeedbackForms ?? 0,
      icon: ClipboardList,
      color: "214 89% 52%",
      actionHint: "Click to manage surveys",
    },
    {
      id: "student-responses",
      label: "Student Responses",
      value: stats?.totalFeedbackSubmissions ?? 0,
      icon: MessageSquare,
      color: "35 92% 45%",
      actionHint: "Click for survey responses",
    },
    {
      id: "completed-events",
      label: "Completed Events",
      value: stats?.completedEvents ?? 0,
      icon: BarChart3,
      color: "158 64% 38%",
      actionHint: "Click for past summaries",
    },
  ];

  return (
    <div className="p-3.5 sm:p-5 lg:p-7 space-y-4 sm:space-y-6 min-h-screen" style={{ background: "hsl(var(--bg))" }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-extrabold text-foreground tracking-tight">Admin Dashboard</h1>
          <p className="text-xs mt-0.5" style={{ color: "hsl(var(--fg-muted))" }}>
            Real-time overview — events, registrations, and attendance
          </p>
        </div>

        {/* Quick Actions (Swipeable on mobile, flex-wrap on desktop) */}
        <div
          className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 sm:pb-0 sm:flex-wrap"
          style={{ scrollbarWidth: "none" }}
        >
          <Link href="/admin/events/new" className="btn-primary py-2 px-3.5 text-xs whitespace-nowrap flex-shrink-0">
            <Plus className="w-3.5 h-3.5" /> Create Event
          </Link>
          <Link href="/admin/feedback" className="btn-secondary py-2 px-3 text-xs whitespace-nowrap flex-shrink-0">
            <ClipboardList className="w-3.5 h-3.5" /> Feedback
          </Link>
          <Link href="/admin/media" className="btn-secondary py-2 px-3 text-xs whitespace-nowrap flex-shrink-0">
            <Upload className="w-3.5 h-3.5" /> Media
          </Link>
          <Link href="/admin/reports" className="btn-secondary py-2 px-3 text-xs whitespace-nowrap flex-shrink-0">
            <FileText className="w-3.5 h-3.5" /> Reports
          </Link>
          <Link href="/admin/settings" className="btn-secondary py-2 px-3 text-xs whitespace-nowrap flex-shrink-0">
            <Settings className="w-3.5 h-3.5" /> Site Settings
          </Link>
        </div>
      </div>

      {/* ── Stats Grid (All 8 Cards Interactive) ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          const isRegCard = card.isSpecialRegistrationCard;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.03 }}
              onClick={() => setActiveStatModal(card.id as any)}
              className="rounded-xl flex flex-col justify-between p-3 sm:p-4 cursor-pointer hover:border-primary/60 hover:shadow-md transition-all group overflow-hidden"
              style={{
                minHeight: "88px",
                background: "hsl(var(--surface-raised))",
                border: "1px solid hsla(var(--border-strong), 0.9)",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.2)",
              }}
              title={`Click to explore ${card.label} details`}
            >
              {/* Icon + Label row */}
              <div className="flex items-center justify-between gap-1.5">
                <span className="text-[11px] sm:text-xs font-medium truncate group-hover:text-foreground transition-colors" style={{ color: "hsl(var(--fg-muted))" }}>
                  {card.label}
                </span>
                <div
                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"
                  style={{ background: `hsl(${card.color} / 0.15)` }}
                >
                  <Icon className="w-3.5 h-3.5" style={{ color: `hsl(${card.color})` }} />
                </div>
              </div>

              {/* Value or Action */}
              {isRegCard ? (
                <div className="mt-1.5 sm:mt-2">
                  <span className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-emerald-400 group-hover:underline">
                    View Events Breakdown <TrendingUp className="w-3 h-3" />
                  </span>
                  <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
                    Click to view per-event count
                  </p>
                </div>
              ) : (
                <div className="mt-1.5 sm:mt-2 flex items-baseline justify-between">
                  <p className="text-xl sm:text-2xl font-bold tracking-tight text-foreground" style={{ lineHeight: 1.2 }}>
                    {String(card.value)}
                  </p>
                  <span className="text-[10px] font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity hidden sm:inline">
                    Details →
                  </span>
                </div>
              )}
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

      {/* ── Stat Modals (AnimatePresence) ── */}
      <AnimatePresence>
        {activeStatModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
            onClick={() => {
              setActiveStatModal(null);
              setExpandedEventId(null);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="glass-card rounded-2xl w-full max-w-2xl max-h-[88vh] overflow-hidden flex flex-col my-auto border shadow-2xl"
              style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* ── Modal 1: Total Users Directory (Students & Admins) ── */}
              {activeStatModal === "total-users" && (
                <>
                  <div className="p-4 sm:p-5 border-b flex items-center justify-between" style={{ borderColor: "hsl(var(--border))" }}>
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "hsl(199 89% 48% / 0.15)", color: "hsl(199 89% 48%)" }}>
                        <Users className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h2 className="text-base font-bold text-foreground truncate">Registered Users Directory</h2>
                        <p className="text-xs text-muted-foreground truncate">
                          Total {userDirectory.totalCount} registered users on CampusPulse
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveStatModal(null)}
                      className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors ml-2"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Filter Tabs & Search */}
                  <div className="p-4 sm:p-5 border-b space-y-3" style={{ borderColor: "hsl(var(--border))" }}>
                    {/* 2 Category Tabs: Students vs Admins */}
                    <div className="grid grid-cols-2 gap-2 p-1 rounded-xl" style={{ background: "hsl(var(--surface))" }}>
                      <button
                        type="button"
                        onClick={() => setUserTab("student")}
                        className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                          userTab === "student"
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <User className="w-3.5 h-3.5" />
                        Students ({userDirectory.studentCount})
                      </button>
                      <button
                        type="button"
                        onClick={() => setUserTab("admin")}
                        className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                          userTab === "admin"
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Administrators ({userDirectory.adminCount})
                      </button>
                    </div>

                    {/* Search Bar */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="text"
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                        placeholder={`Search ${userTab === "student" ? "students" : "administrators"} by name, email, department, roll...`}
                        className="input-field text-xs pl-9 w-full"
                      />
                    </div>
                  </div>

                  {/* Users List Body */}
                  <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-2.5">
                    {(() => {
                      const list = userTab === "student" ? userDirectory.students : userDirectory.admins;
                      const q = userSearch.toLowerCase();
                      const filtered = list.filter(
                        (u) =>
                          u.name.toLowerCase().includes(q) ||
                          u.email.toLowerCase().includes(q) ||
                          u.department.toLowerCase().includes(q) ||
                          (u.rollNumber && u.rollNumber.toLowerCase().includes(q))
                      );

                      if (filtered.length === 0) {
                        return (
                          <div className="py-10 text-center text-muted-foreground">
                            <p className="text-sm font-medium">No {userTab === "student" ? "students" : "administrators"} found</p>
                            <p className="text-xs mt-1">Try another search query</p>
                          </div>
                        );
                      }

                      return filtered.map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center justify-between p-3 rounded-xl border bg-card/60 gap-3 hover:border-primary/40 transition-colors"
                          style={{ borderColor: "hsl(var(--border))" }}
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div
                              className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0"
                              style={{
                                background: user.role === "admin" ? "hsl(var(--primary) / 0.15)" : "hsl(var(--accent) / 0.15)",
                                color: user.role === "admin" ? "hsl(var(--primary))" : "hsl(var(--accent))",
                              }}
                            >
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="text-xs sm:text-sm font-bold text-foreground truncate">{user.name}</p>
                                {user.role === "admin" ? (
                                  <span className="badge badge-primary text-[10px] font-bold">Administrator</span>
                                ) : user.rollNumber ? (
                                  <span className="badge badge-neutral text-[10px] font-mono">{user.rollNumber}</span>
                                ) : null}
                              </div>
                              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                              <p className="text-[11px] text-primary/90 truncate">{user.department}</p>
                            </div>
                          </div>
                          <span className="text-[10px] text-muted-foreground whitespace-nowrap flex-shrink-0">
                            Joined {format(new Date(user.createdAt), "MMM dd, yyyy")}
                          </span>
                        </div>
                      ));
                    })()}
                  </div>
                </>
              )}

              {/* ── Modal 2: Total Registrations Breakdown (Per Event) ── */}
              {activeStatModal === "total-registrations" && (
                <>
                  <div className="p-4 sm:p-5 border-b flex items-center justify-between" style={{ borderColor: "hsl(var(--border))" }}>
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "hsl(158 64% 38% / 0.15)", color: "hsl(158 64% 38%)" }}>
                        <TrendingUp className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h2 className="text-base font-bold text-foreground truncate">Event-Wise Registrations Breakdown</h2>
                        <p className="text-xs text-muted-foreground truncate">
                          See exactly how many student registrations and attendees each event has received
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setActiveStatModal(null);
                        setExpandedEventId(null);
                      }}
                      className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors ml-2"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Search Bar */}
                  <div className="p-4 sm:p-5 border-b" style={{ borderColor: "hsl(var(--border))" }}>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="text"
                        value={regEventSearch}
                        onChange={(e) => setRegEventSearch(e.target.value)}
                        placeholder="Search events by title, category, venue..."
                        className="input-field text-xs pl-9 w-full"
                      />
                    </div>
                  </div>

                  {/* Events with Registrations List */}
                  <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
                    {(() => {
                      const q = regEventSearch.toLowerCase();
                      const filtered = eventsWithRegs.filter(
                        (ev) =>
                          ev.title.toLowerCase().includes(q) ||
                          ev.category.toLowerCase().includes(q) ||
                          ev.venue.toLowerCase().includes(q)
                      );

                      if (filtered.length === 0) {
                        return (
                          <div className="py-10 text-center text-muted-foreground">
                            <p className="text-sm font-medium">No events found matching your search</p>
                          </div>
                        );
                      }

                      return filtered.map((ev) => {
                        const isExpanded = expandedEventId === ev.id;
                        return (
                          <div
                            key={ev.id}
                            className="rounded-xl border p-4 bg-card/60 space-y-3 transition-all"
                            style={{ borderColor: "hsl(var(--border))" }}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h3 className="text-sm font-bold text-foreground break-words">{ev.title}</h3>
                                  <span className="badge badge-primary text-[10px]">{ev.category}</span>
                                  <span className="badge badge-neutral text-[10px] capitalize">{ev.status}</span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-0.5 break-words">
                                  {format(new Date(ev.eventDate), "MMM dd, yyyy")} • {ev.venue}
                                </p>
                              </div>

                              <Link
                                href={`/events/${ev.slug}`}
                                target="_blank"
                                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 self-start sm:self-auto"
                              >
                                View Event <ExternalLink className="w-3 h-3" />
                              </Link>
                            </div>

                            {/* Registration Count & Turnout Pills */}
                            <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg text-center" style={{ background: "hsl(var(--surface))" }}>
                              <div>
                                <p className="text-[10px] text-muted-foreground uppercase font-bold">Total Signups</p>
                                <p className="text-sm font-extrabold text-foreground mt-0.5">
                                  {ev.totalRegistrations} <span className="text-[10px] font-normal text-muted-foreground">/ {ev.maxCapacity}</span>
                                </p>
                              </div>
                              <div>
                                <p className="text-[10px] text-muted-foreground uppercase font-bold">Attended</p>
                                <p className="text-sm font-extrabold text-emerald-400 mt-0.5">
                                  {ev.attendedCount}
                                </p>
                              </div>
                              <div>
                                <p className="text-[10px] text-muted-foreground uppercase font-bold">Turnout Rate</p>
                                <p className="text-sm font-extrabold text-primary mt-0.5">
                                  {ev.turnoutRate}%
                                </p>
                              </div>
                            </div>

                            {/* Expandable Attendees List */}
                            <div>
                              {ev.totalRegistrations > 0 ? (
                                <button
                                  type="button"
                                  onClick={() => setExpandedEventId(isExpanded ? null : ev.id)}
                                  className="text-xs font-semibold text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
                                >
                                  {isExpanded ? (
                                    <>
                                      <ChevronUp className="w-3.5 h-3.5" /> Hide Registered Students
                                    </>
                                  ) : (
                                    <>
                                      <ChevronDown className="w-3.5 h-3.5" /> View {ev.totalRegistrations} Registered Student{ev.totalRegistrations === 1 ? "" : "s"}
                                    </>
                                  )}
                                </button>
                              ) : (
                                <span className="text-xs text-muted-foreground italic">No student registrations for this event yet</span>
                              )}

                              {/* Expanded Attendee Roster */}
                              {isExpanded && ev.attendees.length > 0 && (
                                <div className="mt-3 pt-3 border-t space-y-2" style={{ borderColor: "hsl(var(--border))" }}>
                                  <p className="text-[11px] font-bold uppercase text-muted-foreground tracking-wider">
                                    Registered Participant Roster:
                                  </p>
                                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                                    {ev.attendees.map((attendee, ai) => (
                                      <div
                                        key={ai}
                                        className="flex items-center justify-between p-2 rounded-lg bg-surface text-xs gap-2"
                                      >
                                        <div className="min-w-0 flex-1">
                                          <div className="flex items-center gap-1.5">
                                            <span className="font-bold text-foreground truncate">{attendee.name}</span>
                                            {attendee.rollNumber && (
                                              <span className="text-[10px] font-mono text-muted-foreground">({attendee.rollNumber})</span>
                                            )}
                                          </div>
                                          <p className="text-[11px] text-muted-foreground truncate">{attendee.email} • {attendee.department}</p>
                                        </div>
                                        <button
                                          type="button"
                                          onClick={() => handleToggleAttendance(ev.id, attendee.userId)}
                                          disabled={togglingUser === attendee.userId}
                                          className={`badge text-[10px] cursor-pointer whitespace-nowrap transition-colors ${
                                            attendee.attended ? "badge-success" : "badge-neutral opacity-60"
                                          }`}
                                          title="Click to toggle attendance"
                                        >
                                          {attendee.attended ? "✓ Attended" : "○ Not Checked In"}
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </>
              )}

              {/* ── Modal 3: Total Events & Upcoming Events ── */}
              {(activeStatModal === "total-events" || activeStatModal === "upcoming-events") && (
                <>
                  <div className="p-4 sm:p-5 border-b flex items-center justify-between" style={{ borderColor: "hsl(var(--border))" }}>
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "hsl(214 89% 52% / 0.15)", color: "hsl(214 89% 52%)" }}>
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h2 className="text-base font-bold text-foreground truncate">
                          {activeStatModal === "upcoming-events" ? "Upcoming Campus Events" : "All Campus Events"}
                        </h2>
                        <p className="text-xs text-muted-foreground truncate">
                          {activeStatModal === "upcoming-events" ? "Scheduled events coming up next" : "Full catalog of campus activities and symposiums"}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveStatModal(null)}
                      className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors ml-2"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
                    {(() => {
                      const eventsToShow = activeStatModal === "upcoming-events"
                        ? allEvents.filter((e) => e.status === "upcoming")
                        : allEvents;

                      if (eventsToShow.length === 0) {
                        return <p className="text-center py-10 text-muted-foreground text-sm">No events found in this category.</p>;
                      }

                      return eventsToShow.map((ev) => (
                        <div
                          key={ev._id as string}
                          className="flex items-center justify-between p-3.5 rounded-xl border bg-card/60 gap-3"
                          style={{ borderColor: "hsl(var(--border))" }}
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-xs sm:text-sm font-bold text-foreground break-words">{ev.title as string}</h3>
                              <span className="badge badge-primary text-[10px]">{ev.category as string}</span>
                              <span className="badge badge-neutral text-[10px] capitalize">{ev.status as string}</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {format(new Date(ev.eventDate as string), "MMM dd, yyyy")} • {ev.venue as string}
                            </p>
                          </div>
                          <Link
                            href={`/events/${ev.slug as string}`}
                            target="_blank"
                            className="btn-secondary py-1 px-2.5 text-xs flex items-center gap-1 flex-shrink-0"
                          >
                            View <ExternalLink className="w-3 h-3" />
                          </Link>
                        </div>
                      ));
                    })()}
                  </div>
                  <div className="p-4 border-t flex justify-end" style={{ borderColor: "hsl(var(--border))" }}>
                    <Link href="/admin/events" className="btn-primary py-2 px-4 text-xs">
                      Go to Events Management →
                    </Link>
                  </div>
                </>
              )}

              {/* ── Modal 4: Attendance Rate ── */}
              {activeStatModal === "attendance-rate" && (
                <>
                  <div className="p-4 sm:p-5 border-b flex items-center justify-between" style={{ borderColor: "hsl(var(--border))" }}>
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "hsl(346 80% 50% / 0.15)", color: "hsl(346 80% 50%)" }}>
                        <CheckCircle className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h2 className="text-base font-bold text-foreground truncate">Attendance Rate & Student Turnout</h2>
                        <p className="text-xs text-muted-foreground truncate">
                          Overall platform attendance rate: {String(stats?.attendanceRate ?? 0)}%
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveStatModal(null)}
                      className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors ml-2"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
                    <div className="glass-card p-4 rounded-xl text-center">
                      <p className="text-3xl font-extrabold text-foreground">{String(stats?.attendanceRate ?? 0)}%</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Total {Number(stats?.totalAttended ?? 0)} students verified attended out of {Number(stats?.totalRegistrations ?? 0)} total signups
                      </p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-bold uppercase text-muted-foreground">Per Event Turnout Breakdown:</p>
                      {eventsWithRegs.map((ev) => (
                        <div key={ev.id} className="p-3 rounded-xl border bg-card/60 space-y-1.5" style={{ borderColor: "hsl(var(--border))" }}>
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-foreground truncate flex-1 pr-2">{ev.title}</span>
                            <span className="font-bold text-primary flex-shrink-0">{ev.turnoutRate}% Turnout</span>
                          </div>
                          <div className="h-2 rounded-full overflow-hidden bg-muted">
                            <div className="h-full rounded-full bg-primary" style={{ width: `${ev.turnoutRate}%` }} />
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                            <span>{ev.attendedCount} Attended</span>
                            <span>{ev.totalRegistrations} Registered</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* ── Modal 5: Feedback Surveys & Student Responses ── */}
              {(activeStatModal === "feedback-surveys" || activeStatModal === "student-responses") && (
                <>
                  <div className="p-4 sm:p-5 border-b flex items-center justify-between" style={{ borderColor: "hsl(var(--border))" }}>
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "hsl(214 89% 52% / 0.15)", color: "hsl(214 89% 52%)" }}>
                        <ClipboardList className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h2 className="text-base font-bold text-foreground truncate">Feedback Surveys & Student Insights</h2>
                        <p className="text-xs text-muted-foreground truncate">
                          {Number(stats?.totalFeedbackForms ?? 0)} Surveys Created • {Number(stats?.totalFeedbackSubmissions ?? 0)} Total Responses
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveStatModal(null)}
                      className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors ml-2"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-center py-8">
                    <p className="text-sm font-semibold text-foreground">Manage and view real-time student survey responses</p>
                    <p className="text-xs text-muted-foreground max-w-md mx-auto">
                      Access star ratings, open suggestions, and multiple choice question analytics for all campus events.
                    </p>
                    <div className="flex justify-center gap-3 pt-2">
                      <Link href="/admin/feedback" className="btn-primary py-2.5 px-6 text-xs">
                        Open Feedback Section →
                      </Link>
                    </div>
                  </div>
                </>
              )}

              {/* ── Modal 6: Completed Events ── */}
              {activeStatModal === "completed-events" && (
                <>
                  <div className="p-4 sm:p-5 border-b flex items-center justify-between" style={{ borderColor: "hsl(var(--border))" }}>
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "hsl(158 64% 38% / 0.15)", color: "hsl(158 64% 38%)" }}>
                        <BarChart3 className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h2 className="text-base font-bold text-foreground truncate">Completed Events Archive</h2>
                        <p className="text-xs text-muted-foreground truncate">
                          {Number(stats?.completedEvents ?? 0)} events successfully conducted
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveStatModal(null)}
                      className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors ml-2"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
                    {(() => {
                      const completed = allEvents.filter((e) => e.status === "completed");
                      if (completed.length === 0) {
                        return (
                          <div className="text-center py-10 text-muted-foreground space-y-2">
                            <p className="text-sm font-semibold">No completed events yet</p>
                            <p className="text-xs">Once an event finishes, you can mark its status as Completed to generate official documentation.</p>
                          </div>
                        );
                      }

                      return completed.map((ev) => (
                        <div key={ev._id as string} className="p-3.5 rounded-xl border bg-card/60 flex items-center justify-between gap-3" style={{ borderColor: "hsl(var(--border))" }}>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-sm font-bold text-foreground truncate">{ev.title as string}</h3>
                            <p className="text-xs text-muted-foreground">{format(new Date(ev.eventDate as string), "MMM dd, yyyy")} • {ev.venue as string}</p>
                          </div>
                          <Link href="/admin/reports" className="btn-secondary py-1 px-3 text-xs flex items-center gap-1">
                            View Report
                          </Link>
                        </div>
                      ));
                    })()}
                  </div>
                </>
              )}

              {/* Modal Footer */}
              <div className="p-3.5 sm:p-4 border-t flex justify-end" style={{ borderColor: "hsl(var(--border))" }}>
                <button
                  type="button"
                  onClick={() => {
                    setActiveStatModal(null);
                    setExpandedEventId(null);
                  }}
                  className="btn-secondary py-1.5 px-4 text-xs"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

