"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import {
  MessageSquare,
  ChevronUp,
  Send,
  Pin,
  User,
  Calendar,
  Sparkles,
} from "lucide-react";
import { getAllQuestions, askQuestion, upvoteQuestion } from "@/actions/qna";
import { getEvents } from "@/actions/events";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";

export default function QnAPage() {
  const { data: session } = useSession();
  const [questions, setQuestions] = useState<Record<string, unknown>[]>([]);
  const [events, setEvents] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [newQuestion, setNewQuestion] = useState("");
  const [asking, setAsking] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [qData, eData] = await Promise.all([
          getAllQuestions(),
          getEvents({ limit: 50 }),
        ]);
        setQuestions(qData);
        setEvents(eData.events);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim() || !selectedEvent) return;
    setAsking(true);
    try {
      const q = await askQuestion({ eventId: selectedEvent, question: newQuestion });
      setQuestions((prev) => [q, ...prev]);
      setNewQuestion("");
      setSelectedEvent("");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed");
    } finally {
      setAsking(false);
    }
  };

  const handleUpvote = async (qId: string) => {
    if (!session) return;
    try {
      const updated = await upvoteQuestion(qId);
      setQuestions((prev) => prev.map((q) => (q._id === qId ? updated : q)));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <LoadingSpinner size="lg" text="Loading Q&A..." fullPage />;

  return (
    <div className="min-h-screen gradient-mesh">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4" style={{ background: "hsl(var(--primary) / 0.08)" }}>
            <Sparkles className="w-3.5 h-3.5" style={{ color: "hsl(var(--primary))" }} />
            <span className="text-xs font-semibold" style={{ color: "hsl(var(--primary))" }}>Q&A</span>
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "hsl(var(--foreground))" }}>
            Questions & Answers
          </h1>
          <p className="text-base" style={{ color: "hsl(var(--muted-foreground))" }}>
            Ask questions about events and get answers from organizers
          </p>
        </motion.div>

        {/* Ask Question Form */}
        {session && (
          <motion.form
            onSubmit={handleAsk}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6 rounded-xl mb-8 space-y-4"
          >
            <h3 className="text-sm font-semibold" style={{ color: "hsl(var(--foreground))" }}>Ask a Question</h3>
            <select
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
              className="input-field"
              required
            >
              <option value="">Select an event...</option>
              {events.map((ev) => (
                <option key={ev._id as string} value={ev._id as string}>
                  {ev.title as string}
                </option>
              ))}
            </select>
            <textarea
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="What would you like to know?"
              className="input-field resize-none"
              rows={3}
              required
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={asking || !newQuestion.trim() || !selectedEvent}
                className="btn-primary py-2 px-5 text-sm disabled:opacity-50"
              >
                <Send className="w-4 h-4" /> {asking ? "Posting..." : "Post Question"}
              </button>
            </div>
          </motion.form>
        )}

        {/* Questions List */}
        {questions.length === 0 ? (
          <EmptyState
            icon={MessageSquare}
            title="No Questions Yet"
            description="Be the first to ask a question about a campus event!"
          />
        ) : (
          <div className="space-y-4">
            {questions.map((q, i) => (
              <motion.div
                key={q._id as string}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card p-4 rounded-xl"
              >
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
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      {(q.isPinned as boolean) && <Pin className="w-3.5 h-3.5" style={{ color: "hsl(var(--primary))" }} />}
                      <span className="text-xs font-medium flex items-center gap-1" style={{ color: "hsl(var(--muted-foreground))" }}>
                        <User className="w-3 h-3" />
                        {(q.studentId as Record<string, unknown>)?.name as string || "Anonymous"}
                      </span>
                      {!!q.eventId && (
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" }}>
                          <Calendar className="w-3 h-3 inline mr-1" />
                          {String((q.eventId as Record<string, unknown>)?.title || "")}
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-medium mb-2" style={{ color: "hsl(var(--foreground))" }}>
                      {q.question as string}
                    </p>
                    {!!q.answer && (
                      <div className="p-3 rounded-lg" style={{ background: "hsl(var(--primary) / 0.06)" }}>
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
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
