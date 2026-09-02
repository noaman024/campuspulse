"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, MapPin, Users, ArrowRight, Share2, CheckCircle2 } from "lucide-react";
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

const categoryColors: Record<string, string> = {
  Technical: "200 95% 42%",
  Cultural: "346 80% 50%",
  Sports: "158 75% 38%",
  Workshop: "35 92% 45%",
};

export default function EventCard({ event, index = 0 }: EventCardProps) {
  const [imgError, setImgError] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const catColor = categoryColors[event.category] || "160 84% 36%";
  const regCount = event.registeredUsers?.length || 0;
  const isFull = regCount >= event.maxCapacity;
  const percentFilled = Math.min(100, Math.round((regCount / (event.maxCapacity || 1)) * 100));

  const hasValidBanner =
    Boolean(event.bannerUrl) &&
    !imgError &&
    !event.bannerUrl?.startsWith("file://");

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className="h-full"
      >
        <Link href={`/events/${event.slug}`} className="block group h-full">
          <div className="glass-card overflow-hidden h-full flex flex-col rounded-2xl border border-border/80 bg-card hover:border-primary/50 transition-all duration-200">
            {/* Banner Header */}
            <div
              className="relative h-44 overflow-hidden flex items-end p-4"
              style={{
                background: `linear-gradient(135deg, hsl(${catColor} / 0.85), hsl(${catColor} / 0.4))`,
              }}
            >
              {hasValidBanner && (
                <img
                  src={event.bannerUrl}
                  alt={event.title}
                  onError={() => setImgError(true)}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              )}

              {/* Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent pointer-events-none" />

              {/* Badges */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
                <span
                  className="text-[11px] font-bold text-white px-2.5 py-0.5 rounded-full shadow-sm uppercase tracking-wide"
                  style={{ background: `hsl(${catColor})` }}
                >
                  {event.category}
                </span>
                {event.status === "ongoing" && (
                  <span className="badge bg-emerald-500 text-white text-[11px] font-bold flex items-center gap-1 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    Live Now
                  </span>
                )}
              </div>

              <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
                {isFull && (
                  <span className="text-[10px] font-bold bg-rose-600 text-white px-2 py-0.5 rounded-full shadow-sm uppercase">
                    Housefull
                  </span>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsShareOpen(true);
                  }}
                  className="p-1.5 rounded-full bg-black/50 hover:bg-white text-white hover:text-black transition-colors backdrop-blur-md"
                  title="Share Event"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Title in Header */}
              <div className="relative z-10 w-full">
                <h3 className="text-white font-bold text-base sm:text-lg leading-snug line-clamp-2 drop-shadow group-hover:text-emerald-300 transition-colors">
                  {event.title}
                </h3>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-4 flex-1 flex flex-col justify-between gap-3">
              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                {event.description}
              </p>

              <div className="space-y-2 pt-1">
                <div className="flex items-center gap-2 text-xs text-foreground/80 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                  <span>
                    {event.eventDate
                      ? format(new Date(event.eventDate), "EEE, MMM dd • hh:mm a")
                      : "Date TBA"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                  <span className="truncate">{event.venue}</span>
                </div>

                {/* Capacity Progress Bar */}
                <div className="pt-2">
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1">
                    <span className="flex items-center gap-1 font-semibold">
                      <Users className="w-3 h-3 text-primary" />
                      {regCount} / {event.maxCapacity} Seats
                    </span>
                    <span className="font-bold text-foreground">{percentFilled}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${percentFilled}%`,
                        background: percentFilled >= 90 ? 'hsl(var(--destructive))' : `hsl(${catColor})`,
                      }}
                    />
                  </div>
                </div>

                {/* Footer Action */}
                <div className="flex items-center justify-between pt-3 border-t border-border/60 text-xs mt-2">
                  <span className="text-[11px] font-semibold text-muted-foreground">
                    Free Entry
                  </span>
                  <span
                    className="flex items-center gap-1 font-bold group-hover:gap-1.5 transition-all"
                    style={{ color: `hsl(${catColor})` }}
                  >
                    View Details & Pass
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>

      {/* Share Modal */}
      <ShareEventModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
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
