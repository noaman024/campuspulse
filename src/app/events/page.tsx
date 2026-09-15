"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Search, Calendar } from "lucide-react";
import { getEvents } from "@/actions/events";
import EventCard from "@/components/ui/EventCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";

const CATEGORIES = ["All", "Technical", "Cultural", "Sports", "Workshop"];

type EventItem = {
  _id: string; title: string; slug: string; description: string;
  category: string; tags: string[]; bannerUrl?: string; eventDate: string;
  venue: string; status: string; maxCapacity: number;
  registeredUsers: { userId: string }[];
};

function EventsContent() {
  const params = useSearchParams();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(params.get("category") || "All");
  const [search, setSearch] = useState(params.get("search") || "");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const r = await getEvents({
        category: category === "All" ? undefined : category,
        search: search || undefined,
        page,
        limit: 9,
      });
      setEvents(r.events as EventItem[]);
      setTotalPages(r.pages);
    } finally {
      setLoading(false);
    }
  }, [category, search, page]);

  useEffect(() => { fetch(); }, [fetch]);
  useEffect(() => { setPage(1); }, [category, search]);

  return (
    <div className="min-h-screen" style={{ background: "hsl(var(--bg))" }}>
      {/* Header */}
      <div className="border-b" style={{ background: "hsl(var(--surface))", borderColor: "hsl(var(--border))" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "hsl(var(--primary))" }}>
              University Event Directory
            </p>
            <h1 className="text-2xl font-extrabold text-foreground mb-1">Campus Events</h1>
            <p className="text-sm" style={{ color: "hsl(var(--fg-muted))" }}>
              Register and get your digital QR pass instantly.
            </p>
          </motion.div>

          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="mt-5 flex flex-col sm:flex-row gap-3"
          >
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "hsl(var(--fg-subtle))" }} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search events, venues, speakers..."
                className="input-field input-with-icon-left text-sm"
              />
            </div>

            {/* Category Pills */}
            <div
              className="flex items-center gap-1 p-1 rounded-xl overflow-x-auto flex-shrink-0"
              style={{ background: "hsl(var(--muted))", scrollbarWidth: "none" }}
            >
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all duration-150"
                  style={{
                    background: category === cat ? "hsl(var(--primary))" : "transparent",
                    color: category === cat ? "white" : "hsl(var(--fg-muted))",
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {loading ? (
          <LoadingSpinner size="lg" text="Loading events..." fullPage />
        ) : events.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="No Events Found"
            description={
              search || category !== "All"
                ? "Try different filters or search terms."
                : "No events scheduled right now. Check back soon!"
            }
          />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {events.map((ev, i) => (
                <EventCard key={ev._id ?? i} event={ev} index={i} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className="w-9 h-9 rounded-xl text-xs font-bold transition-all"
                    style={{
                      background: page === p ? "hsl(var(--primary))" : "hsl(var(--surface-raised))",
                      color: page === p ? "white" : "hsl(var(--fg))",
                      border: `1px solid ${page === p ? "transparent" : "hsl(var(--border))"}`,
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function EventsPage() {
  return (
    <Suspense fallback={<LoadingSpinner size="lg" text="Loading..." fullPage />}>
      <EventsContent />
    </Suspense>
  );
}
