"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Star,
  Send,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  EyeOff,
} from "lucide-react";
import { getFeedbackFormById, submitFeedback } from "@/actions/feedback";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Link from "next/link";

interface Question {
  questionId: string;
  prompt: string;
  type: "rating" | "mcq" | "text" | "likert";
  options: string[];
  isRequired: boolean;
  order: number;
}

const likertValues = [
  { label: "Strongly Disagree", value: 1 },
  { label: "Disagree", value: 2 },
  { label: "Neutral", value: 3 },
  { label: "Agree", value: 4 },
  { label: "Strongly Agree", value: 5 },
];

export default function FillFeedbackPage({ params }: { params: Promise<{ formId: string }> }) {
  const { formId } = use(params);
  const router = useRouter();

  const [form, setForm] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string | number | string[]>>({});
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await getFeedbackFormById(formId);
        setForm(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [formId]);

  const setAnswer = (questionId: string, value: string | number | string[]) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const questions = (form?.questions || []) as Question[];
    for (const q of questions) {
      if (q.isRequired && !answers[q.questionId] && answers[q.questionId] !== 0) {
        setError(`Please answer: "${q.prompt}"`);
        return;
      }
    }

    setSubmitting(true);
    try {
      await submitFeedback({
        formId,
        eventId: form?.eventId as string,
        isAnonymous,
        answers: Object.entries(answers).map(([questionId, value]) => ({
          questionId,
          value,
        })),
      });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner size="lg" text="Loading form..." fullPage />;

  if (submitted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ background: "hsl(var(--success) / 0.1)" }}>
            <CheckCircle className="w-10 h-10" style={{ color: "hsl(var(--success))" }} />
          </div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: "hsl(var(--foreground))" }}>Thank You!</h2>
          <p className="text-base mb-6" style={{ color: "hsl(var(--muted-foreground))" }}>
            Your feedback has been submitted successfully.
          </p>
          <Link href="/portal/feedback" className="btn-primary">
            <ArrowLeft className="w-4 h-4" /> Back to Feedback
          </Link>
        </motion.div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <AlertCircle className="w-16 h-16" style={{ color: "hsl(var(--destructive))" }} />
        <h2 className="text-xl font-bold">Form Not Found</h2>
        <Link href="/portal/feedback" className="btn-primary">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
      </div>
    );
  }

  const questions = ((form.questions || []) as Question[]).sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen gradient-mesh">
      <div className="max-w-2xl mx-auto px-3.5 sm:px-6 py-6 sm:py-10 overflow-x-hidden">
        <Link href="/portal/feedback" className="inline-flex items-center gap-1 text-sm mb-4 sm:mb-6 transition-colors" style={{ color: "hsl(var(--muted-foreground))" }}>
          <ArrowLeft className="w-4 h-4" /> Back to forms
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="glass-card p-4 sm:p-8 rounded-2xl overflow-hidden">
            <h1 className="text-xl sm:text-2xl font-bold mb-2 break-words" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "hsl(var(--foreground))" }}>
              {form.title as string}
            </h1>
            {!!form.instructions && (
              <p className="text-xs sm:text-sm mb-4 sm:mb-6 break-words" style={{ color: "hsl(var(--muted-foreground))" }}>
                {String(form.instructions)}
              </p>
            )}

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg mb-6 text-sm" style={{ background: "hsl(var(--destructive) / 0.1)", color: "hsl(var(--destructive))" }}>
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span className="break-words">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              {questions.map((q, idx) => (
                <motion.div
                  key={q.questionId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="space-y-3 overflow-hidden"
                >
                  <label className="text-sm font-semibold flex items-start gap-1.5 break-words" style={{ color: "hsl(var(--foreground))" }}>
                    <span className="text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: "hsl(var(--primary) / 0.1)", color: "hsl(var(--primary))" }}>
                      {idx + 1}
                    </span>
                    <span className="min-w-0 flex-1 break-words">
                      {q.prompt}
                      {q.isRequired && <span className="text-red-500 ml-1">*</span>}
                    </span>
                  </label>

                  {/* Rating */}
                  {q.type === "rating" && (
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setAnswer(q.questionId, star)}
                          className="p-1 transition-transform hover:scale-110"
                        >
                          <Star
                            className="w-8 h-8"
                            style={{
                              color: (answers[q.questionId] as number) >= star ? "hsl(var(--warning))" : "hsl(var(--muted))",
                              fill: (answers[q.questionId] as number) >= star ? "hsl(var(--warning))" : "transparent",
                            }}
                          />
                        </button>
                      ))}
                      {answers[q.questionId] && (
                        <span className="ml-2 text-sm font-medium" style={{ color: "hsl(var(--warning))" }}>
                          {answers[q.questionId]}/5
                        </span>
                      )}
                    </div>
                  )}

                  {/* MCQ */}
                  {q.type === "mcq" && (
                    <div className="space-y-2">
                      {q.options.map((opt, oi) => (
                        <label
                          key={oi}
                          className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all"
                          style={{
                            background: answers[q.questionId] === opt ? "hsl(var(--primary) / 0.08)" : "hsl(var(--surface))",
                            border: `1px solid ${answers[q.questionId] === opt ? "hsl(var(--primary) / 0.3)" : "hsl(var(--border))"}`,
                          }}
                        >
                          <div
                            className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                            style={{ borderColor: answers[q.questionId] === opt ? "hsl(var(--primary))" : "hsl(var(--border))" }}
                          >
                            {answers[q.questionId] === opt && (
                              <div className="w-2 h-2 rounded-full" style={{ background: "hsl(var(--primary))" }} />
                            )}
                          </div>
                          <span className="text-sm break-words flex-1 min-w-0" style={{ color: "hsl(var(--foreground))" }}>{opt}</span>
                          <input
                            type="radio"
                            name={q.questionId}
                            value={opt}
                            checked={answers[q.questionId] === opt}
                            onChange={() => setAnswer(q.questionId, opt)}
                            className="hidden"
                          />
                        </label>
                      ))}
                    </div>
                  )}

                  {/* Text */}
                  {q.type === "text" && (
                    <textarea
                      value={(answers[q.questionId] as string) || ""}
                      onChange={(e) => setAnswer(q.questionId, e.target.value)}
                      placeholder="Type your answer..."
                      className="input-field resize-none"
                      rows={3}
                    />
                  )}

                  {/* Likert */}
                  {q.type === "likert" && (
                    <div className="flex gap-2 flex-wrap">
                      {likertValues.map((lv) => (
                        <button
                          key={lv.value}
                          type="button"
                          onClick={() => setAnswer(q.questionId, lv.value)}
                          className="px-3 py-2 rounded-lg text-xs font-medium transition-all"
                          style={{
                            background: answers[q.questionId] === lv.value ? "hsl(var(--primary))" : "hsl(var(--surface))",
                            color: answers[q.questionId] === lv.value ? "white" : "hsl(var(--foreground))",
                            border: `1px solid ${answers[q.questionId] === lv.value ? "hsl(var(--primary))" : "hsl(var(--border))"}`,
                          }}
                        >
                          {lv.label}
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Anonymous Toggle */}
              <div className="flex items-center gap-3 p-4 rounded-lg" style={{ background: "hsl(var(--muted))" }}>
                <button
                  type="button"
                  onClick={() => setIsAnonymous(!isAnonymous)}
                  className="relative w-10 h-5 rounded-full transition-colors flex-shrink-0"
                  style={{ background: isAnonymous ? "hsl(var(--primary))" : "hsl(var(--border))" }}
                >
                  <span
                    className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform"
                    style={{ left: isAnonymous ? "calc(100% - 18px)" : "2px" }}
                  />
                </button>
                <div>
                  <div className="flex items-center gap-1.5">
                    <EyeOff className="w-4 h-4" style={{ color: "hsl(var(--muted-foreground))" }} />
                    <span className="text-sm font-medium" style={{ color: "hsl(var(--foreground))" }}>Submit anonymously</span>
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>
                    Your name won&apos;t be linked to your responses
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full py-3 text-base rounded-xl disabled:opacity-50"
              >
                {submitting ? (
                  <span className="flex items-center gap-2 justify-center">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Submitting...
                  </span>
                ) : (
                  <span className="flex items-center gap-2 justify-center">
                    <Send className="w-5 h-5" /> Submit Feedback
                  </span>
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
