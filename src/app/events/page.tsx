"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Calendar, Sparkles } from "lucide-react";
import { getEvents } from "@/actions/events";
import EventCard from "@/components/ui/EventCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";

const categories = ["All", "Technical", "Cultural", "Sports", "Workshop"];

export default function EventsPage() {
  const [events, setEvents] = useState<Array<Record<string, unknown>>>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getEvents({
        category: category === "All" ? undefined : category,
        search: search || undefined,
        page,
        limit: 9,
      });
      setEvents(result.events);
      setTotalPages(result.pages);
    } catch (err) {
      console.error("Failed to fetch events:", err);
    } finally {
      setLoading(false);
    }
  }, [category, search, page]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    setPage(1);
  }, [category, search]);

  return (
    <div className="min-h-screen gradient-mesh">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4" style={{ background: "hsl(var(--primary) / 0.08)" }}>
            <Sparkles className="w-3.5 h-3.5" style={{ color: "hsl(var(--primary))" }} />
            <span className="text-xs font-semibold" style={{ color: "hsl(var(--primary))" }}>DISCOVER</span>
          </div>
          <h1
            className="text-3xl sm:text-4xl font-bold mb-3"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "hsl(var(--foreground))" }}
          >
            Campus Events
          </h1>
          <p className="text-base max-w-lg mx-auto" style={{ color: "hsl(var(--muted-foreground))" }}>
            Discover, explore, and register for events happening across campus
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "hsl(var(--muted-foreground))" }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search events, tags..."
              className="input-field input-with-icon-left"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-xl overflow-x-auto" style={{ background: "hsl(var(--muted))" }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all"
                style={{
                  background: category === cat ? "hsl(var(--surface))" : "transparent",
                  color: category === cat ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
                  boxShadow: category === cat ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Events Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {loading ? (
          <LoadingSpinner size="lg" text="Loading events..." fullPage />
        ) : events.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="No Events Found"
            description={
              search || category !== "All"
                ? "Try adjusting your filters or search query"
                : "No events have been published yet. Check back soon!"
            }
          />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event, index) => (
                <EventCard
                  key={(event._id as string) || index}
                  event={event as EventCardEvent}
                  index={index}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className="w-10 h-10 rounded-lg text-sm font-medium transition-all"
                    style={{
                      background: page === p ? "hsl(var(--primary))" : "hsl(var(--surface))",
                      color: page === p ? "white" : "hsl(var(--foreground))",
                      border: page === p ? "none" : "1px solid hsl(var(--border))",
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

// Type helper for EventCard compatibility
type EventCardEvent = {
  _id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  tags: string[];
  bannerUrl?: string;
  eventDate: string;
  venue: string;
  status: string;
  maxCapacity: number;
  registeredUsers: { userId: string }[];
};
