"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ClipboardList,
  Calendar,
  ArrowRight,
  CheckCircle,
  Sparkles,
  MapPin,
  HelpCircle,
  Check,
} from "lucide-react";
import { getAvailableFeedbackForms } from "@/actions/feedback";
import { format } from "date-fns";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";
import { useSession } from "next-auth/react";

export default function FeedbackListPage() {
  const { data: session } = useSession();
  const [forms, setForms] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getAvailableFeedbackForms();
        setForms(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <LoadingSpinner size="lg" text="Loading feedback surveys..." fullPage />;

  return (
    <div className="min-h-screen gradient-mesh">
      <div className="max-w-5xl mx-auto px-3.5 sm:px-6 lg:px-8 py-6 sm:py-10 overflow-x-hidden">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 sm:mb-8">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-3"
            style={{ background: "hsl(var(--primary) / 0.1)" }}
          >
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-semibold text-primary">STUDENT FEEDBACK PORTAL</span>
          </div>
          <h1
            className="text-2xl sm:text-3xl font-bold mb-2 break-words"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "hsl(var(--foreground))" }}
          >
            Campus Event Feedback Surveys
          </h1>
          <p className="text-xs sm:text-sm break-words" style={{ color: "hsl(var(--muted-foreground))" }}>
            {session?.user?.name
              ? `Welcome ${session.user.name}! Share your ratings and suggestions for events you attended.`
              : "Share your genuine experience to help student clubs and faculty organize better events."}
          </p>
        </motion.div>

        {forms.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="No Active Feedback Forms"
            description="There are no active feedback forms open right now. Feedback forms will appear here once published by organizers."
            action={{
              label: "Explore Upcoming Events",
              onClick: () => {
                window.location.href = "/events";
              },
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {forms.map((form, i) => {
              const event = form.eventId as Record<string, unknown> | null;
              const hasSubmitted = !!form.hasSubmitted;
              const questionCount = (form.questions as unknown[])?.length || 0;

              return (
                <motion.div
                  key={form._id as string}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Link href={`/portal/feedback/${form._id}`} className="block group h-full">
                    <div
                      className={`glass-card p-4 sm:p-6 h-full flex flex-col justify-between gap-4 rounded-2xl border transition-all duration-200 overflow-hidden ${
                        hasSubmitted
                          ? "border-emerald-500/30 hover:border-emerald-500/50"
                          : "hover:border-primary/50 hover:shadow-lg"
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <div
                              className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                              style={{
                                background: hasSubmitted
                                  ? "hsl(var(--success) / 0.15)"
                                  : "hsl(var(--primary) / 0.15)",
                                color: hasSubmitted ? "hsl(var(--success))" : "hsl(var(--primary))",
                              }}
                            >
                              {hasSubmitted ? (
                                <Check className="w-5 h-5" />
                              ) : (
                                <ClipboardList className="w-5 h-5" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                {typeof event?.category === "string" ? (
                                  <span className="badge badge-primary text-[10px]">
                                    {event.category}
                                  </span>
                                ) : null}
                                {hasSubmitted ? (
                                  <span className="badge badge-success text-[10px] flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3" /> Submitted
                                  </span>
                                ) : (
                                  <span className="badge badge-warning text-[10px]">
                                    ● Open for Response
                                  </span>
                                )}
                              </div>
                              <h3
                                className="font-bold text-sm sm:text-base mt-1.5 line-clamp-2 break-words"
                                style={{ color: "hsl(var(--foreground))" }}
                              >
                                {String(form.title || "")}
                              </h3>
                            </div>
                          </div>
                        </div>

                        {event && (
                          <div className="text-xs text-muted-foreground space-y-1 pt-1 min-w-0">
                            <p className="flex items-center gap-1.5 font-medium text-foreground break-words min-w-0">
                              <Calendar className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                              <span className="truncate">{String(event.title || "")}</span>
                            </p>
                            {typeof event.eventDate === "string" ? (
                              <p className="text-[11px] pl-5 break-words">
                                {format(new Date(event.eventDate), "MMMM dd, yyyy")}
                                {typeof event.venue === "string" ? ` • ${event.venue}` : ""}
                              </p>
                            ) : null}
                          </div>
                        )}

                        {!!form.instructions && (
                          <p
                            className="text-xs line-clamp-2 pt-1 break-words"
                            style={{ color: "hsl(var(--muted-foreground))" }}
                          >
                            {String(form.instructions)}
                          </p>
                        )}
                      </div>

                      <div
                        className="flex items-center justify-between pt-3 border-t text-xs"
                        style={{ borderColor: "hsl(var(--border))" }}
                      >
                        <span className="text-muted-foreground">
                          {questionCount} Questions
                        </span>
                        <span
                          className={`font-semibold flex items-center gap-1 group-hover:gap-2 transition-all ${
                            hasSubmitted ? "text-emerald-400" : "text-primary"
                          }`}
                        >
                          {hasSubmitted ? "Review Response" : "Fill Feedback"}{" "}
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

