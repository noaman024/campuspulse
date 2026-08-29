"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, MapPin, Users, ArrowRight, Sparkles, Share2 } from "lucide-react";
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
  Technical: "252 85% 63%",
  Cultural: "330 85% 60%",
  Sports: "152 69% 45%",
  Workshop: "38 92% 50%",
};

export default function EventCard({ event, index = 0 }: EventCardProps) {
  const [imgError, setImgError] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const catColor = categoryColors[event.category] || "252 85% 63%";
  const regCount = event.registeredUsers?.length || 0;
  const isFull = regCount >= event.maxCapacity;

  // Check if bannerUrl is valid and not a local file:/// protocol which browser blocks
  const hasValidBanner =
    Boolean(event.bannerUrl) &&
    !imgError &&
    !event.bannerUrl?.startsWith("file://");

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.08 }}
        className="h-full"
      >
        <Link href={`/events/${event.slug}`} className="block group h-full">
          <div className="glass-card overflow-hidden h-full flex flex-col rounded-2xl border transition-all duration-300 hover:border-primary/50 hover:shadow-xl">
            {/* Banner Container */}
            <div
              className="relative h-48 overflow-hidden flex items-end p-4"
              style={{
                background: `linear-gradient(135deg, hsl(${catColor} / 0.85), hsl(${catColor} / 0.45))`,
              }}
            >
              {/* Real Image with error fallback */}
              {hasValidBanner && (
                <img
                  src={event.bannerUrl}
                  alt={event.title}
                  onError={() => setImgError(true)}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              )}

              {/* Subtle Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

              {/* Badges Top Left & Right */}
              <div className="absolute top-3 left-3 flex gap-2 z-10">
                <span
                  className="badge text-white text-xs font-semibold shadow-sm"
                  style={{ background: `hsl(${catColor})` }}
                >
                  {event.category}
                </span>
                {event.status === "ongoing" && (
                  <span className="badge badge-success flex items-center gap-1 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                    Live
                  </span>
                )}
              </div>

              <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
                {isFull && (
                  <span className="badge badge-destructive shadow-sm">Full</span>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsShareOpen(true);
                  }}
                  className="p-1.5 rounded-full bg-black/50 hover:bg-white text-white hover:text-black transition-colors backdrop-blur-sm"
                  title="Share Event"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Title Inside Banner */}
              <div className="relative z-10 w-full">
                <h3 className="text-white font-bold text-lg leading-tight line-clamp-2 drop-shadow-md group-hover:text-primary-foreground transition-colors">
                  {event.title}
                </h3>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 flex-1 flex flex-col justify-between gap-4">
              <p
                className="text-xs line-clamp-2 leading-relaxed"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                {event.description}
              </p>

              <div className="space-y-2.5 pt-2">
                <div
                  className="flex items-center gap-2 text-xs"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  <Calendar className="w-3.5 h-3.5 flex-shrink-0" style={{ color: `hsl(${catColor})` }} />
                  <span>
                    {event.eventDate
                      ? format(new Date(event.eventDate), "MMM dd, yyyy • hh:mm a")
                      : "Date TBA"}
                  </span>
                </div>
                <div
                  className="flex items-center gap-2 text-xs"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0" style={{ color: `hsl(${catColor})` }} />
                  <span className="truncate">{event.venue}</span>
                </div>

                <div
                  className="flex items-center justify-between pt-3 border-t text-xs"
                  style={{ borderColor: "hsl(var(--border))" }}
                >
                  <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
                    <Users className="w-3.5 h-3.5" />
                    <span>
                      {regCount} / {event.maxCapacity} Registered
                    </span>
                  </div>
                  <span
                    className="flex items-center gap-1 font-semibold group-hover:gap-1.5 transition-all"
                    style={{ color: `hsl(${catColor})` }}
                  >
                    View Details
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

