"use client";

import { useState, useEffect, use } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { format } from "date-fns";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  ArrowLeft,
  Share2,
  QrCode,
  CheckCircle,
  XCircle,
  MessageSquare,
  ChevronUp,
  Send,
  Pin,
  User,
  ClipboardList,
  Sparkles,
} from "lucide-react";
import { getEventBySlug, rsvpEvent, cancelRsvp } from "@/actions/events";
import { getEventQuestions, askQuestion, upvoteQuestion } from "@/actions/qna";
import { getFeedbackFormByEvent } from "@/actions/feedback";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Link from "next/link";
import QRCode from "qrcode";
import ShareEventModal from "@/components/ui/ShareEventModal";

const categoryColors: Record<string, string> = {
  Technical: "252 85% 63%",
  Cultural: "330 85% 60%",
  Sports: "152 69% 45%",
  Workshop: "38 92% 50%",
};

export default function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { data: session } = useSession();
  const router = useRouter();

  const [event, setEvent] = useState<Record<string, unknown> | null>(null);
  const [questions, setQuestions] = useState<Record<string, unknown>[]>([]);
  const [feedbackForm, setFeedbackForm] = useState<Record<string, unknown> | null>(null);
  const [bannerError, setBannerError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [qrToken, setQrToken] = useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [askingQuestion, setAskingQuestion] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "qna">("details");

  useEffect(() => {
    if (qrToken && typeof window !== "undefined") {
      const verifyUrl = `${window.location.origin}/events/verify/${qrToken}`;
      QRCode.toDataURL(verifyUrl, {
        width: 260,
        margin: 2,
        color: {
          dark: "#0b0f19",
          light: "#ffffff",
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error("QR generation error:", err));
    }
  }, [qrToken]);

  useEffect(() => {
    async function load() {
      try {
        const eventData = await getEventBySlug(slug);
        setEvent(eventData);
        if (eventData) {
          const [qnaData, fForm] = await Promise.all([
            getEventQuestions(eventData._id),
            getFeedbackFormByEvent(eventData._id),
          ]);
          setQuestions(qnaData);
          setFeedbackForm(fForm);
          // Check if user already registered
          if (session?.user?.id) {
            const reg = (eventData.registeredUsers as Array<Record<string, unknown>>)?.find(
              (r) => r.userId === session.user.id || (r.userId as Record<string, unknown>)?._id === session.user.id
            );
            if (reg) setQrToken(reg.qrCodeToken as string);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug, session?.user?.id]);

  const handleRsvp = async () => {
    if (!session) {
      router.push(`/login?callbackUrl=/events/${slug}`);
      return;
    }
    setRsvpLoading(true);
    try {
      const result = await rsvpEvent(event?._id as string);
      setQrToken(result.qrCodeToken);
      setEvent((prev) => prev ? {
        ...prev,
        registeredUsers: [...(prev.registeredUsers as Array<Record<string, unknown>>), { userId: session.user.id }],
      } : prev);
    } catch (err) {
      alert(err instanceof Error ? err.message : "RSVP failed");
    } finally {
      setRsvpLoading(false);
    }
  };

  const handleCancelRsvp = async () => {
    setRsvpLoading(true);
    try {
      await cancelRsvp(event?._id as string);
      setQrToken(null);
      setEvent((prev) => prev ? {
        ...prev,
        registeredUsers: (prev.registeredUsers as Array<Record<string, unknown>>).filter(
          (r) => r.userId !== session?.user?.id
        ),
      } : prev);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to cancel");
    } finally {
      setRsvpLoading(false);
    }
  };

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim() || !session) return;
    setAskingQuestion(true);
    try {
      const q = await askQuestion({ eventId: event?._id as string, question: newQuestion });
      setQuestions((prev) => [q, ...prev]);
      setNewQuestion("");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to ask question");
    } finally {
      setAskingQuestion(false);
    }
  };

  const handleUpvote = async (questionId: string) => {
    if (!session) return;
    try {
      const updated = await upvoteQuestion(questionId);
      setQuestions((prev) => prev.map((q) => (q._id === questionId ? updated : q)));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <LoadingSpinner size="lg" text="Loading event..." fullPage />;
  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <XCircle className="w-16 h-16" style={{ color: "hsl(var(--destructive))" }} />
        <h2 className="text-xl font-bold">Event Not Found</h2>
        <Link href="/events" className="btn-primary">
          <ArrowLeft className="w-4 h-4" /> Back to Events
        </Link>
      </div>
    );
  }

  const catColor = categoryColors[(event.category as string)] || "252 85% 63%";
  const regCount = (event.registeredUsers as Array<unknown>)?.length || 0;
  const isRegistered = !!qrToken;
  const isFull = regCount >= (event.maxCapacity as number);
  const canRsvp = (event.status === "upcoming" || event.status === "ongoing") && !isFull && !isRegistered;

  const hasValidBanner =
    Boolean(event.bannerUrl) &&
    !bannerError &&
    !String(event.bannerUrl).startsWith("file://");

  const mediaGallery = (event.mediaGallery || {}) as Record<string, unknown>;
  const photos = (mediaGallery.photos || []) as string[];
  const rawClips = (mediaGallery.rawClips || []) as string[];
  const highlightVideo = (mediaGallery.generatedHighlightVideoUrl || "") as string;
  const reportData = (event.reportData || {}) as Record<string, unknown>;

  return (
    <div className="min-h-screen gradient-mesh">
      {/* Banner */}
      <div
        className="relative h-64 sm:h-80 overflow-hidden flex items-end"
        style={{
          background: `linear-gradient(135deg, hsl(${catColor} / 0.9), hsl(${catColor} / 0.45))`,
        }}
      >
        {hasValidBanner && (
          <img
            src={event.bannerUrl as string}
            alt={event.title as string}
            onError={() => setBannerError(true)}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none" />

        <div className="relative z-10 p-6 sm:p-8 max-w-7xl mx-auto w-full">
          <Link href="/events" className="inline-flex items-center gap-1 text-white/80 hover:text-white text-sm mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Events
          </Link>
          <div className="flex items-start gap-3 flex-wrap">
            <span className="badge text-white text-xs" style={{ background: `hsl(${catColor})` }}>
              {event.category as string}
            </span>
            <span className="badge text-white text-xs capitalize" style={{ background: "rgba(255,255,255,0.2)" }}>
              {event.status as string}
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold text-white mt-3 drop-shadow-md" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {event.title as string}
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="flex gap-1 p-1 rounded-xl" style={{ background: "hsl(var(--muted))" }}>
              {(["details", "qna"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all"
                  style={{
                    background: activeTab === tab ? "hsl(var(--surface))" : "transparent",
                    color: activeTab === tab ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
                    boxShadow: activeTab === tab ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                  }}
                >
                  {tab === "details" ? <Calendar className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
                  {tab === "details" ? "Details" : `Q&A (${questions.length})`}
                </button>
              ))}
            </div>

            {/* Details Tab */}
            {activeTab === "details" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="glass-card p-6 rounded-xl">
                  <h2 className="text-lg font-semibold mb-4" style={{ color: "hsl(var(--foreground))" }}>About this Event</h2>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "hsl(var(--muted-foreground))" }}>
                    {event.description as string}
                  </p>
                </div>

                {/* Speaker & Coordinator Card */}
                {Boolean(reportData.chiefGuest || reportData.facultyCoordinator || reportData.objectives) && (
                  <div className="glass-card p-6 rounded-xl space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                      Event Coordination & Objectives
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      {typeof reportData.chiefGuest === "string" && reportData.chiefGuest ? (
                        <div className="p-3 rounded-lg border" style={{ background: "hsl(var(--surface))", borderColor: "hsl(var(--border))" }}>
                          <p className="text-muted-foreground font-semibold">Chief Guest / Speaker</p>
                          <p className="font-bold text-sm text-foreground mt-0.5">{reportData.chiefGuest}</p>
                        </div>
                      ) : null}
                      {typeof reportData.facultyCoordinator === "string" && reportData.facultyCoordinator ? (
                        <div className="p-3 rounded-lg border" style={{ background: "hsl(var(--surface))", borderColor: "hsl(var(--border))" }}>
                          <p className="text-muted-foreground font-semibold">Faculty Coordinator</p>
                          <p className="font-bold text-sm text-foreground mt-0.5">{reportData.facultyCoordinator}</p>
                        </div>
                      ) : null}
                    </div>
                    {typeof reportData.objectives === "string" && reportData.objectives ? (
                      <div className="text-xs text-muted-foreground">
                        <p className="font-semibold text-foreground mb-1">Key Objectives:</p>
                        <p className="leading-relaxed">{reportData.objectives}</p>
                      </div>
                    ) : null}
                  </div>
                )}

                {/* Promo Video Showcase */}
                {(highlightVideo || rawClips.length > 0) && (
                  <div className="glass-card p-6 rounded-xl space-y-4">
                    <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                      🎬 Event Promo Video & Highlights
                    </h3>
                    <div className="rounded-xl overflow-hidden border bg-black flex items-center justify-center">
                      {(highlightVideo || rawClips[0]).includes("youtube.com") || (highlightVideo || rawClips[0]).includes("youtu.be") ? (
                        <iframe
                          src={
                            (highlightVideo || rawClips[0]).includes("youtu.be/")
                              ? `https://www.youtube.com/embed/${(highlightVideo || rawClips[0]).split("youtu.be/")[1]?.split("?")[0]}`
                              : `https://www.youtube.com/embed/${(highlightVideo || rawClips[0]).split("v=")[1]?.split("&")[0]}`
                          }
                          className="w-full aspect-video"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : (
                        <video src={highlightVideo || rawClips[0]} controls className="w-full max-h-96 object-contain" />
                      )}
                    </div>
                  </div>
                )}

                {/* Photos Gallery Showcase */}
                {photos.length > 0 && (
                  <div className="glass-card p-6 rounded-xl space-y-4">
                    <h3 className="text-base font-bold text-foreground">📸 Event Photo Gallery</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {photos.map((photo, pIdx) => (
                        <div key={pIdx} className="relative aspect-video rounded-xl overflow-hidden border bg-muted group">
                          <img
                            src={photo}
                            alt={`Event Photo ${pIdx + 1}`}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(event.tags as string[])?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {(event.tags as string[]).map((tag, i) => (
                      <span key={i} className="badge badge-primary">{tag}</span>
                    ))}
                  </div>
                )}

                {!!event.organizerId && (
                  <div className="glass-card p-4 rounded-xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white font-bold">
                      {String(((event.organizerId as Record<string, unknown>).name as string) || "")[0]}
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: "hsl(var(--foreground))" }}>
                        {String((event.organizerId as Record<string, unknown>).name || "")}
                      </p>
                      <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>Organizer</p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Q&A Tab */}
            {activeTab === "qna" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                {session && (
                  <form onSubmit={handleAskQuestion} className="glass-card p-4 rounded-xl">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {session.user.name?.[0]}
                      </div>
                      <div className="flex-1">
                        <textarea
                          value={newQuestion}
                          onChange={(e) => setNewQuestion(e.target.value)}
                          placeholder="Ask a question about this event..."
                          className="input-field resize-none"
                          rows={2}
                        />
                        <div className="flex justify-end mt-2">
                          <button
                            type="submit"
                            disabled={askingQuestion || !newQuestion.trim()}
                            className="btn-primary py-2 px-4 text-sm disabled:opacity-50"
                          >
                            <Send className="w-4 h-4" /> Ask
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                )}

                {questions.length === 0 ? (
                  <div className="text-center py-12" style={{ color: "hsl(var(--muted-foreground))" }}>
                    <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-40" />
                    <p className="font-medium">No questions yet</p>
                    <p className="text-sm">Be the first to ask!</p>
                  </div>
                ) : (
                  questions.map((q) => (
                    <div key={q._id as string} className="glass-card p-4 rounded-xl">
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleUpvote(q._id as string)}
                          className="flex flex-col items-center gap-0.5 pt-1 flex-shrink-0"
                          style={{
                            color: (q.upvotes as string[])?.includes(session?.user?.id || "")
                              ? "hsl(var(--primary))"
                              : "hsl(var(--muted-foreground))",
                          }}
                        >
                          <ChevronUp className="w-5 h-5" />
                          <span className="text-xs font-bold">{(q.upvotes as string[])?.length || 0}</span>
                        </button>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {(q.isPinned as boolean) && <Pin className="w-3.5 h-3.5" style={{ color: "hsl(var(--primary))" }} />}
                            <span className="text-xs font-medium" style={{ color: "hsl(var(--muted-foreground))" }}>
                              <User className="w-3 h-3 inline mr-1" />
                              {(q.studentId as Record<string, unknown>)?.name as string || "Anonymous"}
                            </span>
                          </div>
                          <p className="text-sm font-medium mb-2" style={{ color: "hsl(var(--foreground))" }}>
                            {q.question as string}
                          </p>
                          {!!q.answer && (
                            <div className="p-3 rounded-lg mt-2" style={{ background: "hsl(var(--primary) / 0.06)" }}>
                              <p className="text-xs font-semibold mb-1" style={{ color: "hsl(var(--primary))" }}>
                                Answer by {String(((q.answer as Record<string, unknown>).answeredBy as Record<string, unknown>)?.name || "Admin")}
                              </p>
                              <p className="text-sm" style={{ color: "hsl(var(--foreground))" }}>
                                {String((q.answer as Record<string, unknown>).text || "")}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Event Info Card */}
            <div className="glass-card p-6 rounded-xl space-y-4 sticky top-20">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm" style={{ color: "hsl(var(--foreground))" }}>
                  <Calendar className="w-5 h-5 flex-shrink-0" style={{ color: `hsl(${catColor})` }} />
                  <div>
                    <p className="font-medium">{format(new Date(event.eventDate as string), "EEEE, MMMM dd, yyyy")}</p>
                    <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
                      {format(new Date(event.eventDate as string), "hh:mm a")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm" style={{ color: "hsl(var(--foreground))" }}>
                  <MapPin className="w-5 h-5 flex-shrink-0" style={{ color: `hsl(${catColor})` }} />
                  <span>{event.venue as string}</span>
                </div>
                <div className="flex items-center gap-3 text-sm" style={{ color: "hsl(var(--foreground))" }}>
                  <Users className="w-5 h-5 flex-shrink-0" style={{ color: `hsl(${catColor})` }} />
                  <span>{regCount} / {event.maxCapacity as number} registered</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-2 rounded-full overflow-hidden" style={{ background: "hsl(var(--muted))" }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: `hsl(${catColor})` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((regCount / (event.maxCapacity as number)) * 100, 100)}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>

              {/* RSVP Button & Scannable QR Code */}
              {isRegistered ? (
                <div className="space-y-3">
                  <div
                    className="flex items-center gap-2 p-3 rounded-xl text-xs font-bold"
                    style={{ background: "hsl(var(--success) / 0.12)", color: "hsl(var(--success))" }}
                  >
                    <CheckCircle className="w-4 h-4" />
                    You&apos;re Registered! (Admission Confirmed)
                  </div>

                  {/* Scannable Real QR Pass Card */}
                  <div
                    className="p-4 rounded-2xl border text-center space-y-3 shadow-inner"
                    style={{ background: "hsl(var(--surface))", borderColor: "hsl(var(--border))" }}
                  >
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Your Digital QR Ticket Pass
                    </p>

                    {qrDataUrl ? (
                      <div className="bg-white p-3 rounded-2xl border shadow-md inline-block mx-auto">
                        <img
                          src={qrDataUrl}
                          alt="Ticket Verification QR Code"
                          className="w-44 h-44 object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-44 h-44 bg-muted/40 rounded-2xl animate-pulse mx-auto flex items-center justify-center">
                        <QrCode className="w-12 h-12 text-muted-foreground" />
                      </div>
                    )}

                    <div className="space-y-1.5 pt-1">
                      <p className="text-[11px] text-muted-foreground">
                        Scan with any phone camera or Google Lens to verify admission
                      </p>
                      {qrToken && (
                        <Link
                          href={`/events/verify/${qrToken}`}
                          className="btn-primary py-2 px-4 text-xs inline-flex items-center gap-1.5 shadow-sm w-full justify-center"
                        >
                          <Sparkles className="w-3.5 h-3.5" /> View / Verify Pass Details →
                        </Link>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={handleCancelRsvp}
                    disabled={rsvpLoading}
                    className="btn-secondary w-full py-2 text-xs hover:border-red-500 hover:text-red-400"
                  >
                    {rsvpLoading ? "Cancelling..." : "Cancel Registration"}
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleRsvp}
                  disabled={rsvpLoading || !canRsvp}
                  className="btn-primary w-full py-3 text-base rounded-xl disabled:opacity-50 shadow-lg"
                >
                  {rsvpLoading ? (
                    <span className="flex items-center gap-2 justify-center">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Registering...
                    </span>
                  ) : isFull ? (
                    "Event Full"
                  ) : (
                    <span className="flex items-center gap-2 justify-center">
                      <QrCode className="w-5 h-5" /> RSVP Now (Instant Ticket)
                    </span>
                  )}
                </button>
              )}

              {/* Share Event Button */}
              <button
                onClick={() => setIsShareModalOpen(true)}
                className="btn-secondary w-full py-2.5 text-xs flex items-center justify-center gap-2 font-semibold"
              >
                <Share2 className="w-4 h-4 text-primary" /> Share Event (WhatsApp, Telegram & More)
              </button>

              {/* Event Feedback Survey Prompt */}
              {feedbackForm && (feedbackForm.isPublished !== false) && (
                <div
                  className="p-4 rounded-xl border space-y-2 mt-4"
                  style={{
                    background: "hsl(var(--primary) / 0.08)",
                    borderColor: "hsl(var(--primary) / 0.3)",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <ClipboardList className="w-4 h-4 text-primary" />
                    <span className="text-xs font-bold text-foreground">Participant Feedback</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Have you attended or participated in this event? Share your ratings & thoughts!
                  </p>
                  <Link
                    href={`/portal/feedback/${feedbackForm._id}`}
                    className="btn-primary w-full py-2 text-xs flex items-center justify-center gap-1.5 shadow-sm mt-1"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Give Event Feedback
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Share Event Modal Popup */}
      <ShareEventModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        event={{
          title: event.title as string,
          venue: event.venue as string,
          eventDate: event.eventDate as string,
          slug: event.slug as string,
          description: event.description as string,
        }}
      />
    </div>
  );
}
