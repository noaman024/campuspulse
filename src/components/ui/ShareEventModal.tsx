"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Share2,
  Copy,
  Check,
  Mail,
  Send,
  QrCode,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import QRCode from "qrcode";

interface ShareEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: {
    title: string;
    description?: string;
    venue?: string;
    eventDate?: string | Date;
    slug?: string;
  };
}

export default function ShareEventModal({
  isOpen,
  onClose,
  event,
}: ShareEventModalProps) {
  const [copied, setCopied] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");
  const [eventUrl, setEventUrl] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}/events/${event.slug || ""}`;
      setEventUrl(url);

      QRCode.toDataURL(url, {
        width: 200,
        margin: 2,
        color: {
          dark: "#0b0f19",
          light: "#ffffff",
        },
      })
        .then((dataUrl) => setQrCodeDataUrl(dataUrl))
        .catch((err) => console.error(err));
    }
  }, [event.slug]);

  if (!isOpen) return null;

  const dateFormatted = event.eventDate
    ? new Date(event.eventDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Upcoming";

  const shareText = `🔥 Check out "${event.title}" on CampusPulse!\n📅 Date: ${dateFormatted}\n📍 Venue: ${
    event.venue || "Campus Auditorium"
  }\n\n👉 For more details & RSVP tickets, visit:\n${eventUrl}`;

  const encodedText = encodeURIComponent(shareText);
  const encodedUrl = encodeURIComponent(eventUrl);
  const encodedTitle = encodeURIComponent(`Campus Event: ${event.title}`);

  const sharePlatforms = [
    {
      name: "WhatsApp",
      icon: "💬",
      color: "from-emerald-500 to-green-600",
      href: `https://api.whatsapp.com/send?text=${encodedText}`,
    },
    {
      name: "Telegram",
      icon: "✈️",
      color: "from-sky-400 to-blue-600",
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodeURIComponent(
        `🔥 ${event.title} on CampusPulse\n📅 ${dateFormatted} • 📍 ${event.venue}`
      )}`,
    },
    {
      name: "LinkedIn",
      icon: "💼",
      color: "from-blue-600 to-indigo-700",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      name: "Twitter / X",
      icon: "🐦",
      color: "from-neutral-700 to-neutral-900",
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        `Excited for "${event.title}" at ${event.venue}! Join me on CampusPulse:`
      )}&url=${encodedUrl}`,
    },
    {
      name: "Email Invite",
      icon: "✉️",
      color: "from-purple-500 to-indigo-600",
      href: `mailto:?subject=${encodedTitle}&body=${encodedText}`,
    },
  ];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(eventUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: shareText,
          url: eventUrl,
        });
      } catch {
        // User cancelled share
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="glass-card rounded-3xl w-full max-w-lg overflow-hidden border shadow-2xl space-y-5 flex flex-col my-auto"
          style={{
            background: "hsl(var(--card))",
            borderColor: "hsl(var(--border))",
          }}
        >
          {/* Header */}
          <div
            className="p-5 border-b flex items-center justify-between"
            style={{ borderColor: "hsl(var(--border))" }}
          >
            <div className="flex items-center gap-2.5">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md"
                style={{
                  background: "hsl(var(--primary) / 0.15)",
                  color: "hsl(var(--primary))",
                }}
              >
                <Share2 className="w-5 h-5" />
              </div>
              <div>
                <h3
                  className="font-bold text-base text-foreground"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  Share Campus Event
                </h3>
                <p className="text-xs text-muted-foreground">
                  Invite classmates, peers & club members
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 pt-0 space-y-6">
            {/* Event Preview Pill */}
            <div
              className="p-3.5 rounded-2xl border flex items-center gap-3 text-xs"
              style={{
                background: "hsl(var(--surface))",
                borderColor: "hsl(var(--border))",
              }}
            >
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-white font-bold flex-shrink-0">
                📅
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-sm text-foreground truncate">
                  {event.title}
                </p>
                <p className="text-muted-foreground text-[11px] truncate mt-0.5">
                  {dateFormatted} • {event.venue || "Campus Venue"}
                </p>
              </div>
            </div>

            {/* Sharing Platforms Grid */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                Share directly via:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {sharePlatforms.map((platform) => (
                  <a
                    key={platform.name}
                    href={platform.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl border flex items-center gap-2.5 text-xs font-semibold text-foreground hover:border-primary/50 transition-all group shadow-sm"
                    style={{
                      background: "hsl(var(--surface))",
                      borderColor: "hsl(var(--border))",
                    }}
                  >
                    <span className="text-lg group-hover:scale-110 transition-transform">
                      {platform.icon}
                    </span>
                    <span>{platform.name}</span>
                  </a>
                ))}

                {/* Native Web Share for Mobile */}
                <button
                  onClick={handleNativeShare}
                  className="p-3 rounded-xl border flex items-center gap-2.5 text-xs font-semibold text-primary hover:border-primary/50 transition-all group shadow-sm col-span-2 sm:col-span-1"
                  style={{
                    background: "hsl(var(--primary) / 0.08)",
                    borderColor: "hsl(var(--primary) / 0.3)",
                  }}
                >
                  <Share2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>More Options</span>
                </button>
              </div>
            </div>

            {/* Link Copy Box */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                Direct Event Link:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={eventUrl}
                  className="input-field text-xs flex-1 truncate bg-muted/40 font-mono py-2.5"
                />
                <button
                  onClick={handleCopyLink}
                  className="btn-primary py-2.5 px-4 text-xs flex items-center gap-1.5 whitespace-nowrap shadow-md"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-white" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy Link
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Event QR Code for Mobile Scanning */}
            {qrCodeDataUrl && (
              <div
                className="p-4 rounded-2xl border flex flex-col sm:flex-row items-center gap-4 text-xs"
                style={{
                  background: "hsl(var(--surface))",
                  borderColor: "hsl(var(--border))",
                }}
              >
                <div className="bg-white p-2 rounded-xl border shadow-sm flex-shrink-0">
                  <img
                    src={qrCodeDataUrl}
                    alt="Event QR Code"
                    className="w-20 h-20"
                  />
                </div>
                <div className="space-y-1 text-center sm:text-left">
                  <p className="font-bold text-foreground flex items-center justify-center sm:justify-start gap-1">
                    <QrCode className="w-3.5 h-3.5 text-primary" /> Instant Mobile Scan
                  </p>
                  <p className="text-muted-foreground text-[11px] leading-relaxed">
                    Classmates can scan this QR code with any phone camera to directly open the event on CampusPulse and RSVP!
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
