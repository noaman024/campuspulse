"use client";

import { useState, useEffect, use } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, BarChart3, Users, Star, FileText } from "lucide-react";
import { getFeedbackResponses } from "@/actions/feedback";
import { getEventById } from "@/actions/events";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";
import Link from "next/link";

interface Question {
  questionId: string;
  prompt: string;
  type: string;
  options: string[];
}

export default function FeedbackResponsesPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = use(params);
  const [event, setEvent] = useState<Record<string, unknown> | null>(null);
  const [form, setForm] = useState<Record<string, unknown> | null>(null);
  const [submissions, setSubmissions] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [ev, data] = await Promise.all([
          getEventById(eventId),
          getFeedbackResponses(eventId),
        ]);
        setEvent(ev);
        setForm(data.form);
        setSubmissions(data.submissions);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [eventId]);

  if (loading) return <LoadingSpinner size="lg" text="Loading responses..." fullPage />;

  const questions = ((form?.questions || []) as Question[]);

  // Compute stats per question
  const questionStats = questions.map((q) => {
    const answers = submissions
      .flatMap((s) => (s.answers as { questionId: string; value: unknown }[]) || [])
      .filter((a) => a.questionId === q.questionId);

    if (q.type === "rating" || q.type === "likert") {
      const nums = answers.map((a) => Number(a.value)).filter((v) => !isNaN(v));
      const avg = nums.length > 0 ? nums.reduce((s, v) => s + v, 0) / nums.length : 0;
      return { ...q, avg: Math.round(avg * 10) / 10, count: nums.length };
    }

    if (q.type === "mcq") {
      const dist: Record<string, number> = {};
      q.options.forEach((o) => (dist[o] = 0));
      answers.forEach((a) => {
        const val = String(a.value);
        if (dist[val] !== undefined) dist[val]++;
      });
      return { ...q, distribution: dist, count: answers.length };
    }

    return { ...q, textAnswers: answers.map((a) => String(a.value)), count: answers.length };
  });

  return (
    <div className="p-3.5 sm:p-5 lg:p-8 max-w-4xl mx-auto overflow-x-hidden">
      <Link href="/admin/feedback" className="inline-flex items-center gap-1 text-sm mb-4 sm:mb-6 transition-colors" style={{ color: "hsl(var(--muted-foreground))" }}>
        <ArrowLeft className="w-4 h-4" /> Back to Forms
      </Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 sm:space-y-6">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground break-words">
              Feedback Responses
            </h1>
            <p className="text-xs sm:text-sm mt-0.5 sm:mt-1 text-muted-foreground break-words">
              {event?.title as string} — {submissions.length} responses
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="glass-card p-4 rounded-xl text-center">
            <Users className="w-6 h-6 mx-auto mb-2" style={{ color: "hsl(var(--primary))" }} />
            <p className="text-2xl font-bold" style={{ color: "hsl(var(--foreground))" }}>{submissions.length}</p>
            <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>Total Responses</p>
          </div>
          <div className="glass-card p-4 rounded-xl text-center">
            <FileText className="w-6 h-6 mx-auto mb-2" style={{ color: "hsl(var(--accent))" }} />
            <p className="text-2xl font-bold" style={{ color: "hsl(var(--foreground))" }}>{questions.length}</p>
            <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>Questions</p>
          </div>
          <div className="glass-card p-4 rounded-xl text-center">
            <Star className="w-6 h-6 mx-auto mb-2" style={{ color: "hsl(var(--warning))" }} />
            <p className="text-2xl font-bold" style={{ color: "hsl(var(--foreground))" }}>
              {(() => {
                const ratingQs = questionStats.filter((q) => "avg" in q);
                if (ratingQs.length === 0) return "N/A";
                const overall = ratingQs.reduce((s, q) => s + (q as { avg: number }).avg, 0) / ratingQs.length;
                return (Math.round(overall * 10) / 10).toString();
              })()}
            </p>
            <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>Avg Rating</p>
          </div>
        </div>

        {submissions.length === 0 ? (
          <EmptyState icon={BarChart3} title="No Responses Yet" description="Responses will appear here once students fill the feedback form." />
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {questionStats.map((q, idx) => (
              <motion.div
                key={q.questionId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="glass-card p-4 sm:p-6 rounded-xl overflow-hidden"
              >
                <div className="flex items-start gap-2.5 mb-4">
                  <span className="text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: "hsl(var(--primary) / 0.1)", color: "hsl(var(--primary))" }}>
                    {idx + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground break-words">{q.prompt}</p>
                    <p className="text-xs mt-0.5 text-muted-foreground">{q.count} responses • {q.type}</p>
                  </div>
                </div>

                {/* Rating/Likert visualization */}
                {"avg" in q && (
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className="w-6 h-6"
                          style={{
                            color: (q as { avg: number }).avg >= star ? "hsl(var(--warning))" : "hsl(var(--muted))",
                            fill: (q as { avg: number }).avg >= star ? "hsl(var(--warning))" : "transparent",
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-lg font-bold" style={{ color: "hsl(var(--foreground))" }}>
                      {(q as { avg: number }).avg} / 5
                    </span>
                  </div>
                )}

                {/* MCQ distribution */}
                {"distribution" in q && (
                  <div className="space-y-2">
                    {Object.entries((q as { distribution: Record<string, number> }).distribution).map(([opt, count]) => {
                      const total = q.count || 1;
                      const pct = Math.round((count / total) * 100);
                      return (
                        <div key={opt}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm" style={{ color: "hsl(var(--foreground))" }}>{opt}</span>
                            <span className="text-xs font-medium" style={{ color: "hsl(var(--muted-foreground))" }}>{count} ({pct}%)</span>
                          </div>
                          <div className="h-2 rounded-full overflow-hidden" style={{ background: "hsl(var(--muted))" }}>
                            <motion.div
                              className="h-full rounded-full"
                              style={{ background: "hsl(var(--primary))" }}
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ duration: 0.6, delay: 0.2 }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Text answers */}
                {"textAnswers" in q && (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {(q as { textAnswers: string[] }).textAnswers.map((text, ti) => (
                      <div key={ti} className="p-3 rounded-lg text-sm" style={{ background: "hsl(var(--muted))", color: "hsl(var(--foreground))" }}>
                        {text}
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
