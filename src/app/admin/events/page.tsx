"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Plus,
  Calendar,
  Users,
  Search,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";
import { getAdminEvents, deleteEvent } from "@/actions/events";
import { format } from "date-fns";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";
import Modal from "@/components/ui/Modal";
import { getEventDisplayBanner } from "@/lib/constants/event-presets";

const statusStyles: Record<string, { bg: string; color: string }> = {
  upcoming: { bg: "hsl(var(--primary) / 0.1)", color: "hsl(var(--primary))" },
  ongoing: { bg: "hsl(var(--success) / 0.1)", color: "hsl(var(--success))" },
  completed: { bg: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" },
  draft: { bg: "hsl(var(--warning) / 0.1)", color: "hsl(var(--warning))" },
  cancelled: { bg: "hsl(var(--destructive) / 0.1)", color: "hsl(var(--destructive))" },
};

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteModal, setDeleteModal] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await getAdminEvents();
        setEvents(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleDelete = async () => {
    if (!deleteModal) return;
    setDeleting(true);
    try {
      await deleteEvent(deleteModal);
      setEvents((prev) =>
        prev.map((e) =>
          e._id === deleteModal ? { ...e, status: "cancelled" } : e
        )
      );
      setDeleteModal(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete");
    } finally {
      setDeleting(false);
    }
  };

  const filtered = events.filter((e) =>
    (e.title as string).toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <LoadingSpinner size="lg" text="Loading events..." fullPage />;

  return (
    <div className="p-3.5 sm:p-5 lg:p-7 space-y-4 sm:space-y-6 max-w-7xl mx-auto overflow-x-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground break-words">
            Manage Events
          </h1>
          <p className="text-xs sm:text-sm mt-0.5 sm:mt-1 text-muted-foreground break-words">
            {events.length} total events
          </p>
        </div>
        <Link href="/admin/events/new" className="btn-primary py-2.5 px-4 text-xs sm:text-sm flex items-center justify-center gap-2 w-full sm:w-auto flex-shrink-0">
          <Plus className="w-4 h-4" /> Create Event
        </Link>
      </div>

      {/* Search */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "hsl(var(--muted-foreground))" }} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search events..."
          className="input-field pl-10 text-xs sm:text-sm w-full"
        />
      </div>

      {/* Events Table */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No Events Found"
          description={search ? "Try a different search term" : "Create your first event to get started"}
          action={!search ? { label: "Create Event", onClick: () => window.location.href = "/admin/events/new" } : undefined}
        />
      ) : (
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr style={{ borderBottom: "1px solid hsl(var(--border))" }}>
                  {["Event", "Date", "Category", "Status", "Registrations", "Actions"].map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider"
                      style={{ color: "hsl(var(--muted-foreground))" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((event, i) => {
                  const status = event.status as string;
                  const style = statusStyles[status] || statusStyles.upcoming;
                  return (
                    <motion.tr
                      key={event._id as string}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="transition-colors"
                      style={{ borderBottom: "1px solid hsl(var(--border))" }}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0 border"
                            style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--primary) / 0.1)" }}
                          >
                            {getEventDisplayBanner(event as any) ? (
                              <img
                                src={getEventDisplayBanner(event as any)}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Calendar className="w-4 h-4" style={{ color: "hsl(var(--primary))" }} />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate max-w-[200px]" style={{ color: "hsl(var(--foreground))" }}>
                              {event.title as string}
                            </p>
                            <p className="text-xs truncate" style={{ color: "hsl(var(--muted-foreground))" }}>
                              {event.venue as string}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
                        {format(new Date(event.eventDate as string), "MMM dd, yyyy")}
                      </td>
                      <td className="px-4 py-3">
                        <span className="badge badge-primary text-xs">{event.category as string}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="badge text-xs capitalize" style={{ background: style.bg, color: style.color }}>
                          {status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm" style={{ color: "hsl(var(--foreground))" }}>
                        <div className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" style={{ color: "hsl(var(--muted-foreground))" }} />
                          {(event.registeredUsers as unknown[])?.length || 0}/{event.maxCapacity as number}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Link
                            href={`/events/${event.slug}`}
                            className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                            style={{ color: "hsl(var(--muted-foreground))" }}
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/admin/events/${event._id}/edit`}
                            className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                            style={{ color: "hsl(var(--primary))" }}
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          {status !== "cancelled" && (
                            <button
                              onClick={() => setDeleteModal(event._id as string)}
                              className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                              style={{ color: "hsl(var(--destructive))" }}
                              title="Cancel"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteModal}
        onClose={() => setDeleteModal(null)}
        title="Cancel Event"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
            Are you sure you want to cancel this event? This action will mark the event as cancelled.
          </p>
          <div className="flex gap-3 justify-end">
            <button onClick={() => setDeleteModal(null)} className="btn-secondary py-2 px-4 text-sm">
              Keep Event
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="inline-flex items-center gap-2 py-2 px-4 rounded-lg text-sm font-semibold text-white transition-colors disabled:opacity-50"
              style={{ background: "hsl(var(--destructive))" }}
            >
              {deleting ? "Cancelling..." : "Cancel Event"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
