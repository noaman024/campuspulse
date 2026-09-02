"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Search, Calendar, Sparkles, Building2, SlidersHorizontal } from "lucide-react";
import { getEvents } from "@/actions/events";
import EventCard from "@/components/ui/EventCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";

const categories = ["All", "Technical", "Cultural", "Sports", "Workshop"];

function EventsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";
  const initialSearch = searchParams.get("search") || "";

  const [events, setEvents] = useState<Array<Record<string, unknown>>>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(initialCategory);
  const [search, setSearch] = useState(initialSearch);
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
    <div className="min-h-screen bg-background gradient-mesh">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-2xl mx-auto mb-8"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-3 border border-primary/20 bg-primary/10 text-primary text-xs font-bold tracking-wide">
            <Building2 className="w-3.5 h-3.5" />
            <span>CAMPUS EVENT DIRECTORY</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-2.5">
            Official University Events & Symposia
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Explore and reserve your digital entry pass for academic hackathons, cultural fests, tournaments, and career workshops.
          </p>
        </motion.div>

        {/* Filter Controls */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col md:flex-row gap-3.5 mb-8 items-center"
        >
          {/* Search Box */}
          <div className="relative w-full md:flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by event title, speaker, department, venue..."
              className="input-field input-with-icon-left"
            />
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-card border border-border overflow-x-auto w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  category === cat
                    ? "bg-primary text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Events Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {loading ? (
          <LoadingSpinner size="lg" text="Fetching campus events..." fullPage />
        ) : events.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="No Events Found"
            description={
              search || category !== "All"
                ? "No events match the selected category or search term. Try resetting filters."
                : "No active campus events are scheduled at the moment. Please check back soon!"
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

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                      page === p
                        ? "bg-primary text-white shadow-sm"
                        : "bg-card border border-border text-foreground hover:bg-muted"
                    }`}
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
    <Suspense fallback={<LoadingSpinner size="lg" text="Loading Events Directory..." fullPage />}>
      <EventsContent />
    </Suspense>
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
