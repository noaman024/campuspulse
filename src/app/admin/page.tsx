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
  Sparkles,
} from "lucide-react";
import {
  getDashboardStats,
  getRecentEvents,
  getCategoryDistribution,
  getRecentRegistrations,
} from "@/actions/analytics";
import { toggleAttendance } from "@/actions/events";
import StatsCard from "@/components/ui/StatsCard";
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

  useEffect(() => {
    loadData();
  }, []);

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
      setToast({
        message: err instanceof Error ? err.message : "Failed to toggle attendance",
        type: "error",
      });
    } finally {
      setTogglingUser(null);
    }
  };

  if (loading) return <LoadingSpinner size="lg" text="Loading dashboard data..." fullPage />;

  const statCards = [
    { title: "Total Events", value: stats?.totalEvents || 0, icon: Calendar, color: "252 85% 63%" },
    { title: "Upcoming Events", value: stats?.upcomingEvents || 0, icon: Clock, color: "38 92% 50%" },
    { title: "Total Users", value: stats?.totalUsers || 0, icon: Users, color: "173 80% 40%" },
    { title: "Total Registrations", value: stats?.totalRegistrations || 0, icon: TrendingUp, color: "152 69% 45%" },
    { title: "Attendance Turnout", value: `${stats?.attendanceRate || 0}%`, icon: CheckCircle, color: "330 85% 60%" },
    { title: "Feedback Surveys", value: stats?.totalFeedbackForms || 0, icon: ClipboardList, color: "210 70% 50%" },
    { title: "Student Responses", value: stats?.totalFeedbackSubmissions || 0, icon: MessageSquare, color: "280 70% 55%" },
    { title: "Completed Events", value: stats?.completedEvents || 0, icon: BarChart3, color: "152 69% 45%" },
  ];

  const categoryColors: Record<string, string> = {
    Technical: "252 85% 63%",
    Cultural: "330 85% 60%",
    Sports: "152 69% 45%",
    Workshop: "38 92% 50%",
  };

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header & Quick Action Buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1
            className="text-2xl font-bold"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "hsl(var(--foreground))" }}
          >
            Admin Management Dashboard
          </h1>
          <p className="text-sm mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>
            Real-time analytics, event coordination, student registrations, and reports
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/admin/events/new"
            className="btn-primary py-2 px-3.5 text-xs flex items-center gap-1.5 shadow-md"
          >
            <Plus className="w-4 h-4" /> Create Event
          </Link>
          <Link
            href="/admin/feedback"
            className="btn-secondary py-2 px-3.5 text-xs flex items-center gap-1.5"
          >
            <ClipboardList className="w-4 h-4 text-primary" /> Feedback Forms
          </Link>
          <Link
            href="/admin/media"
            className="btn-secondary py-2 px-3.5 text-xs flex items-center gap-1.5"
          >
            <Upload className="w-4 h-4 text-accent" /> Upload Media
          </Link>
          <Link
            href="/admin/reports"
            className="btn-secondary py-2 px-3.5 text-xs flex items-center gap-1.5"
          >
            <FileText className="w-4 h-4 text-emerald-400" /> Event Reports
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <StatsCard
            key={card.title}
            title={card.title}
            value={card.value as string | number}
            icon={card.icon}
            color={card.color}
            index={i}
          />
        ))}
      </div>

      {/* Live Registrations Table */}
      <div className="glass-card rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-primary" />
            <div>
              <h2 className="text-base font-bold" style={{ color: "hsl(var(--foreground))" }}>
                Recent Student Registrations & Attendance
              </h2>
              <p className="text-xs text-muted-foreground">
                Live registrations linked to student accounts with 1-click attendance toggle
              </p>
            </div>
          </div>
          <span className="badge badge-primary text-xs">
            {registrations.length} Active Records
          </span>
        </div>

        {registrations.length === 0 ? (
          <p className="text-sm text-center py-6 text-muted-foreground">
            No registrations yet. Students registering for events will appear here automatically.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="border-b" style={{ borderColor: "hsl(var(--border))" }}>
                <tr className="text-muted-foreground font-semibold">
                  <th className="pb-3">Student</th>
                  <th className="pb-3">Department</th>
                  <th className="pb-3">Event Registered</th>
                  <th className="pb-3">Date Registered</th>
                  <th className="pb-3">Attendance</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: "hsl(var(--border))" }}>
                {registrations.map((reg, idx) => (
                  <tr key={`${reg.eventId}-${reg.userId}-${idx}`} className="hover:bg-muted/40 transition-colors">
                    <td className="py-3">
                      <p className="font-semibold text-foreground">{reg.userName}</p>
                      <p className="text-[11px] text-muted-foreground">{reg.userEmail}</p>
                    </td>
                    <td className="py-3 text-muted-foreground">{reg.userDepartment}</td>
                    <td className="py-3">
                      <Link
                        href={`/events/${reg.eventSlug}`}
                        target="_blank"
                        className="font-medium hover:underline text-foreground"
                      >
                        {reg.eventTitle}
                      </Link>
                      <span className="badge badge-primary text-[10px] ml-2">{reg.eventCategory}</span>
                    </td>
                    <td className="py-3 text-muted-foreground">
                      {format(new Date(reg.registeredAt), "MMM dd, hh:mm a")}
                    </td>
                    <td className="py-3">
                      <span
                        className={`badge text-[11px] ${
                          reg.attended ? "badge-success" : "badge-neutral opacity-60"
                        }`}
                      >
                        {reg.attended ? "✓ Attended" : "○ Not Marked"}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => handleToggleAttendance(reg.eventId, reg.userId)}
                        disabled={togglingUser === reg.userId}
                        className={`py-1 px-2.5 rounded-lg text-xs font-medium transition-colors ${
                          reg.attended ? "btn-secondary text-red-400" : "btn-primary"
                        }`}
                      >
                        {togglingUser === reg.userId
                          ? "Saving..."
                          : reg.attended
                          ? "Mark Absent"
                          : "Mark Present"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Events List */}
        <div className="lg:col-span-2 glass-card rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold" style={{ color: "hsl(var(--foreground))" }}>
                Active Campus Events
              </h2>
              <p className="text-xs text-muted-foreground">Manage details, media, and feedback</p>
            </div>
            <Link
              href="/admin/events"
              className="text-xs font-semibold hover:underline"
              style={{ color: "hsl(var(--primary))" }}
            >
              View All ({String(stats?.totalEvents ?? recent.length)}) →
            </Link>
          </div>

          <div className="space-y-3">
            {recent.length === 0 ? (
              <p className="text-sm text-center py-8" style={{ color: "hsl(var(--muted-foreground))" }}>
                No events found
              </p>
            ) : (
              recent.map((event, i) => (
                <motion.div
                  key={event._id as string}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl transition-colors border"
                  style={{ background: "hsl(var(--surface))", borderColor: "hsl(var(--border))" }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: `hsl(${categoryColors[event.category as string] || "252 85% 63%"} / 0.15)` }}
                    >
                      <Calendar
                        className="w-5 h-5"
                        style={{ color: `hsl(${categoryColors[event.category as string] || "252 85% 63%"})` }}
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: "hsl(var(--foreground))" }}>
                        {event.title as string}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {format(new Date(event.eventDate as string), "MMM dd, yyyy")} • {event.venue as string}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
                    <span className="badge badge-primary text-[11px] capitalize">
                      {event.category as string}
                    </span>
                    <span className="text-xs text-muted-foreground font-medium flex items-center gap-1 mr-2">
                      <Users className="w-3.5 h-3.5" />
                      {(event.registeredUsers as unknown[])?.length || 0} / {event.maxCapacity as number}
                    </span>
                    <Link
                      href={`/admin/events/${event._id}/edit`}
                      className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                      title="Edit Event"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`/events/${event.slug}`}
                      target="_blank"
                      className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                      title="View Public Page"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Category Distribution */}
        <div className="glass-card rounded-xl p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold mb-1" style={{ color: "hsl(var(--foreground))" }}>
              Event Categories
            </h2>
            <p className="text-xs text-muted-foreground mb-6">Distribution across campus clubs</p>

            <div className="space-y-4">
              {categories.length === 0 ? (
                <p className="text-sm text-center py-8" style={{ color: "hsl(var(--muted-foreground))" }}>
                  No category data
                </p>
              ) : (
                categories.map((cat, i) => {
                  const total = categories.reduce((s, c) => s + c.count, 0);
                  const pct = total > 0 ? Math.round((cat.count / total) * 100) : 0;
                  const color = categoryColors[cat.category] || "252 85% 63%";
                  return (
                    <motion.div
                      key={cat.category}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-semibold" style={{ color: "hsl(var(--foreground))" }}>
                          {cat.category}
                        </span>
                        <span className="text-xs font-bold" style={{ color: `hsl(${color})` }}>
                          {cat.count} ({pct}%)
                        </span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden" style={{ background: "hsl(var(--muted))" }}>
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: `hsl(${color})` }}
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.8, delay: i * 0.1 }}
                        />
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>

          <div className="pt-6 mt-6 border-t" style={{ borderColor: "hsl(var(--border))" }}>
            <Link
              href="/admin/analytics"
              className="btn-secondary w-full py-2 text-xs flex items-center justify-center gap-1.5"
            >
              <BarChart3 className="w-3.5 h-3.5" /> View Advanced Analytics
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

