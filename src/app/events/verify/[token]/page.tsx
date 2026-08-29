"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  Calendar,
  MapPin,
  User,
  Mail,
  Building,
  Hash,
  ShieldCheck,
  Zap,
  Printer,
  ArrowLeft,
  Sparkles,
  Clock,
  UserCheck,
} from "lucide-react";
import { format } from "date-fns";
import { verifyTicketPass, checkInAttendee } from "@/actions/events";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Toast from "@/components/ui/Toast";

export default function TicketVerificationPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const { data: session } = useSession();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [checkingIn, setCheckingIn] = useState(false);
  const [attended, setAttended] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await verifyTicketPass(token);
        if (res.valid) {
          setData(res);
          setAttended(res.registration?.attended || false);
        } else {
          setData({ valid: false, message: res.message });
        }
      } catch {
        setData({ valid: false, message: "Failed to verify ticket pass." });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [token]);

  const handleAdminCheckIn = async () => {
    setCheckingIn(true);
    try {
      await checkInAttendee(token);
      setAttended(true);
      setToast({ message: "Attendee successfully checked in!", type: "success" });
    } catch (err) {
      setToast({
        message: err instanceof Error ? err.message : "Check-in failed. Admin access required.",
        type: "error",
      });
    } finally {
      setCheckingIn(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Verifying digital pass..." fullPage />;
  }

  if (!data || !data.valid) {
    return (
      <div className="min-h-screen gradient-mesh flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-8 rounded-3xl border shadow-2xl w-full max-w-md text-center space-y-6"
          style={{ borderColor: "hsl(var(--destructive) / 0.4)" }}
        >
          <div className="w-16 h-16 rounded-full bg-red-500/15 text-red-400 flex items-center justify-center mx-auto shadow-lg">
            <XCircle className="w-10 h-10" />
          </div>
          <div className="space-y-1">
            <span className="badge badge-destructive text-xs">Invalid Ticket</span>
            <h1
              className="text-2xl font-bold text-foreground"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Ticket Verification Failed
            </h1>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {data?.message || "This QR code does not match any active student event registration."}
            </p>
          </div>

          <div className="p-4 rounded-xl border text-xs font-mono break-all text-muted-foreground bg-muted/40">
            Token: {token}
          </div>

          <Link href="/events" className="btn-primary w-full py-2.5 text-xs flex items-center justify-center gap-2">
            <ArrowLeft className="w-3.5 h-3.5" /> Browse Campus Events
          </Link>
        </motion.div>
      </div>
    );
  }

  const { event, attendee, registration } = data;
  const isAdmin = session?.user?.role === "admin";

  return (
    <div className="min-h-screen gradient-mesh py-12 px-4 sm:px-6 lg:px-8">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="max-w-xl mx-auto space-y-6">
        {/* Top bar back link */}
        <div className="flex items-center justify-between">
          <Link
            href={`/events/${event.slug}`}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to {event.title}
          </Link>

          <button
            onClick={() => window.print()}
            className="btn-secondary py-1.5 px-3 text-xs flex items-center gap-1.5 print:hidden"
          >
            <Printer className="w-3.5 h-3.5" /> Print Pass
          </button>
        </div>

        {/* Digital Boarding Pass Ticket Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-3xl overflow-hidden border shadow-2xl relative"
          style={{ borderColor: "hsl(var(--border))" }}
        >
          {/* Header Strip */}
          <div className="p-6 bg-gradient-to-r from-primary via-indigo-600 to-purple-600 text-white space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-sm tracking-wide">CampusPulse Official Pass</span>
              </div>
              <span className="badge text-[10px] bg-white/20 text-white font-semibold capitalize">
                {event.category}
              </span>
            </div>

            <h1
              className="text-2xl font-bold pt-1 leading-tight"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              {event.title}
            </h1>
          </div>

          {/* Verification Badge Bar */}
          <div className="p-4 bg-emerald-500/10 border-b flex items-center justify-between gap-3 text-xs" style={{ borderColor: "hsl(var(--border))" }}>
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <ShieldCheck className="w-5 h-5" />
              <span>VERIFIED VALID TICKET</span>
            </div>
            <div className="flex items-center gap-1.5">
              {attended ? (
                <span className="badge badge-success text-[10px] flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Attended / Checked In
                </span>
              ) : (
                <span className="badge badge-warning text-[10px] flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Admission Confirmed
                </span>
              )}
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6 space-y-6">
            {/* Event Logistics */}
            <div className="grid grid-cols-2 gap-4 pb-5 border-b text-xs" style={{ borderColor: "hsl(var(--border))" }}>
              <div className="space-y-1">
                <p className="text-muted-foreground font-semibold flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-primary" /> Date & Time
                </p>
                <p className="font-bold text-sm text-foreground">
                  {format(new Date(event.eventDate), "EEE, MMM dd, yyyy")}
                </p>
                <p className="text-muted-foreground text-[11px]">
                  {format(new Date(event.eventDate), "hh:mm a")}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-muted-foreground font-semibold flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-accent" /> Venue Location
                </p>
                <p className="font-bold text-sm text-foreground">{event.venue}</p>
                <p className="text-muted-foreground text-[11px]">Campus Venue</p>
              </div>
            </div>

            {/* Attendee Profile Details */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Registered Attendee Information
              </h3>
              <div className="p-4 rounded-2xl border space-y-2.5 text-xs" style={{ background: "hsl(var(--surface))", borderColor: "hsl(var(--border))" }}>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-primary" /> Full Name:
                  </span>
                  <span className="font-bold text-foreground text-sm">{attendee.name}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-primary" /> University Email:
                  </span>
                  <span className="font-medium text-foreground">{attendee.email}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-primary" /> Department:
                  </span>
                  <span className="font-medium text-foreground">{attendee.department}</span>
                </div>

                {attendee.rollNumber && attendee.rollNumber !== "N/A" && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Hash className="w-3.5 h-3.5 text-primary" /> Roll Number:
                    </span>
                    <span className="font-mono font-semibold text-foreground">{attendee.rollNumber}</span>
                  </div>
                )}

                <div className="flex justify-between items-center pt-2 border-t text-[11px]" style={{ borderColor: "hsl(var(--border))" }}>
                  <span className="text-muted-foreground">Registered On:</span>
                  <span className="text-muted-foreground">
                    {format(new Date(registration.registeredAt), "MMM dd, yyyy • hh:mm a")}
                  </span>
                </div>
              </div>
            </div>

            {/* Security Token Barcode Representation */}
            <div className="pt-2">
              <div className="p-3 rounded-xl border bg-muted/30 text-center space-y-1" style={{ borderColor: "hsl(var(--border))" }}>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Security Pass Token ID
                </p>
                <p className="font-mono text-xs font-semibold text-foreground break-all">
                  {registration.qrCodeToken}
                </p>
              </div>
            </div>

            {/* Organizer Check-In Action (If scanned by Admin/Organizer) */}
            {isAdmin && !attended && (
              <div className="pt-2 border-t space-y-2 print:hidden" style={{ borderColor: "hsl(var(--border))" }}>
                <p className="text-xs text-muted-foreground text-center">
                  Organizer Access Detected: You can mark this student as present directly.
                </p>
                <button
                  onClick={handleAdminCheckIn}
                  disabled={checkingIn}
                  className="btn-primary w-full py-3 text-xs flex items-center justify-center gap-2 shadow-lg"
                >
                  <UserCheck className="w-4 h-4" />
                  {checkingIn ? "Recording Attendance..." : "Mark Present / Check In Attendee"}
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
