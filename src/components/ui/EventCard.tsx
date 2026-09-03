"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, MapPin, Users, ArrowRight, Share2 } from "lucide-react";
import { format } from "date-fns";
import ShareEventModal from "./ShareEventModal";

interface EventCardProps {
  event: {
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
  index?: number;
}

const CAT_COLOR: Record<string, string> = {
  Technical: "214 89% 52%",
  Cultural:  "346 80% 50%",
  Sports:    "158 64% 38%",
  Workshop:  "35 92% 45%",
};

export default function EventCard({ event, index = 0 }: EventCardProps) {
  const [imgError, setImgError] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const color = CAT_COLOR[event.category] || "214 89% 52%";
  const regCount = event.registeredUsers?.length ?? 0;
  const isFull = regCount >= event.maxCapacity;
  const fillPct = Math.min(100, Math.round((regCount / (event.maxCapacity || 1)) * 100));

  const hasBanner =
    Boolean(event.bannerUrl) && !imgError && !event.bannerUrl?.startsWith("file://");

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
        className="h-full"
      >
        <Link href={`/events/${event.slug}`} className="block group h-full">
          <div
            className="h-full flex flex-col rounded-2xl border overflow-hidden transition-all duration-200 bg-card"
            style={{
              borderColor: "hsl(var(--border))",
              boxShadow: "var(--shadow-sm)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = `hsl(${color} / 0.40)`;
              (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-md)";
              (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "hsl(var(--border))";
              (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-sm)";
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
            }}
          >
            {/* ── Banner ── */}
            <div
              className="relative h-40 overflow-hidden flex items-end p-4"
              style={{ background: `linear-gradient(145deg, hsl(${color} / 0.80), hsl(${color} / 0.40))` }}
            >
              {hasBanner && (
                <img
                  src={event.bannerUrl}
                  alt={event.title}
                  onError={() => setImgError(true)}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

              {/* Top badges */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
                <span
                  className="text-[10px] font-bold text-white px-2 py-0.5 rounded-full uppercase tracking-wide"
                  style={{ background: `hsl(${color})` }}
                >
                  {event.category}
                </span>
                {event.status === "ongoing" && (
                  <span className="text-[10px] font-bold text-white bg-emerald-500 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse inline-block" />
                    Live
                  </span>
                )}
                {isFull && (
                  <span className="text-[10px] font-bold text-white bg-red-500 px-2 py-0.5 rounded-full">
                    Full
                  </span>
                )}
              </div>

              {/* Share button */}
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShareOpen(true); }}
                className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-black/40 hover:bg-white hover:text-black text-white transition-colors backdrop-blur-sm"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>

              {/* Title */}
              <h3 className="relative z-10 text-white font-bold text-sm sm:text-base leading-snug line-clamp-2 group-hover:text-blue-200 transition-colors">
                {event.title}
              </h3>
            </div>

            {/* ── Body ── */}
            <div className="p-4 flex-1 flex flex-col gap-3">
              <p className="text-xs leading-relaxed line-clamp-2" style={{ color: "hsl(var(--fg-muted))" }}>
                {event.description}
              </p>

              <div className="space-y-1.5 text-xs" style={{ color: "hsl(var(--fg-muted))" }}>
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 flex-shrink-0" style={{ color: `hsl(${color})` }} />
                  <span>
                    {event.eventDate
                      ? format(new Date(event.eventDate), "EEE, MMM d • h:mm a")
                      : "Date TBA"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0" style={{ color: `hsl(${color})` }} />
                  <span className="truncate">{event.venue}</span>
                </div>
              </div>

              {/* Capacity bar */}
              <div className="pt-1">
                <div className="flex justify-between text-[11px] mb-1" style={{ color: "hsl(var(--fg-subtle))" }}>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" style={{ color: `hsl(${color})` }} />
                    {regCount} / {event.maxCapacity} seats
                  </span>
                  <span className="font-semibold text-foreground">{fillPct}%</span>
                </div>
                <div className="h-1 rounded-full overflow-hidden" style={{ background: "hsl(var(--border))" }}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${fillPct}%`,
                      background: fillPct >= 90 ? "hsl(var(--danger))" : `hsl(${color})`,
                    }}
                  />
                </div>
              </div>

              {/* Footer link */}
              <div
                className="flex items-center justify-end pt-2 border-t text-xs font-semibold transition-all group-hover:gap-1.5"
                style={{ borderColor: "hsl(var(--border))", color: `hsl(${color})` }}
              >
                View & Register
                <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>
        </Link>
      </motion.div>

      <ShareEventModal
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        event={{
          title: event.title,
          venue: event.venue,
          eventDate: event.eventDate,
          slug: event.slug,
          description: event.description,
        }}
      />
    </>
  );
}
