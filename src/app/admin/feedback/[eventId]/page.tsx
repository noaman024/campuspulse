"use client";

import { useState, useEffect, use } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Save, AlertCircle, CheckCircle, Eye } from "lucide-react";
import { getFeedbackFormByEvent, createFeedbackForm, updateFeedbackForm } from "@/actions/feedback";
import { getEventById } from "@/actions/events";
import FeedbackFormBuilder, { FormQuestion } from "@/components/ui/FeedbackFormBuilder";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Link from "next/link";

export default function EditFeedbackFormPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = use(params);

  const [event, setEvent] = useState<Record<string, unknown> | null>(null);
  const [formId, setFormId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [instructions, setInstructions] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [acceptingResponses, setAcceptingResponses] = useState(true);
  const [questions, setQuestions] = useState<FormQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const [ev, form] = await Promise.all([
          getEventById(eventId),
          getFeedbackFormByEvent(eventId),
        ]);
        setEvent(ev);
        if (form) {
          setFormId(form._id);
          setTitle(form.title);
          setInstructions(form.instructions || "");
          setIsPublished(form.isPublished);
          setAcceptingResponses(form.acceptingResponses);
          setQuestions(form.questions || []);
        } else if (ev) {
          setTitle(`Feedback for ${ev.title}`);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [eventId]);

  const handleSave = async () => {
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      if (formId) {
        await updateFeedbackForm(formId, {
          title,
          instructions,
          isPublished,
          acceptingResponses,
          questions: questions.map((q) => ({
            questionId: q.questionId,
            prompt: q.prompt,
            type: q.type,
            options: q.options,
            isRequired: q.isRequired,
          })),
        });
      } else {
        const created = await createFeedbackForm({
          eventId,
          title,
          instructions,
          questions: questions.map((q) => ({
            prompt: q.prompt,
            type: q.type,
            options: q.options,
            isRequired: q.isRequired,
          })),
        });
        setFormId(created._id);
      }
      setSuccess("Form saved successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner size="lg" text="Loading form builder..." fullPage />;

  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      <Link href="/admin/feedback" className="inline-flex items-center gap-1 text-sm mb-6 transition-colors" style={{ color: "hsl(var(--muted-foreground))" }}>
        <ArrowLeft className="w-4 h-4" /> Back to Feedback Forms
      </Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "hsl(var(--foreground))" }}>
              {formId ? "Edit" : "Create"} Feedback Form
            </h1>
            {event && (
              <p className="text-sm mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>
                For: {event.title as string}
              </p>
            )}
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-lg text-sm" style={{ background: "hsl(var(--destructive) / 0.1)", color: "hsl(var(--destructive))" }}>
            <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 p-3 rounded-lg text-sm" style={{ background: "hsl(var(--success) / 0.1)", color: "hsl(var(--success))" }}>
            <CheckCircle className="w-4 h-4 flex-shrink-0" />{success}
          </div>
        )}

        {/* Form Settings */}
        <div className="glass-card p-6 rounded-xl space-y-4">
          <h2 className="text-sm font-semibold" style={{ color: "hsl(var(--foreground))" }}>Form Settings</h2>
          <div>
            <label className="text-xs font-medium mb-1.5 block" style={{ color: "hsl(var(--muted-foreground))" }}>Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="text-xs font-medium mb-1.5 block" style={{ color: "hsl(var(--muted-foreground))" }}>Instructions (optional)</label>
            <textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} className="input-field resize-none" rows={2} placeholder="Add instructions for respondents..." />
          </div>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <button
                type="button"
                onClick={() => setIsPublished(!isPublished)}
                className="relative w-10 h-5 rounded-full transition-colors"
                style={{ background: isPublished ? "hsl(var(--success))" : "hsl(var(--muted))" }}
              >
                <span className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform" style={{ left: isPublished ? "calc(100% - 18px)" : "2px" }} />
              </button>
              <span className="text-sm flex items-center gap-1" style={{ color: "hsl(var(--foreground))" }}>
                <Eye className="w-4 h-4" /> Published
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <button
                type="button"
                onClick={() => setAcceptingResponses(!acceptingResponses)}
                className="relative w-10 h-5 rounded-full transition-colors"
                style={{ background: acceptingResponses ? "hsl(var(--primary))" : "hsl(var(--muted))" }}
              >
                <span className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform" style={{ left: acceptingResponses ? "calc(100% - 18px)" : "2px" }} />
              </button>
              <span className="text-sm" style={{ color: "hsl(var(--foreground))" }}>Accepting Responses</span>
            </label>
          </div>
        </div>

        {/* Questions Builder */}
        <div>
          <h2 className="text-sm font-semibold mb-4" style={{ color: "hsl(var(--foreground))" }}>
            Questions ({questions.length})
          </h2>
          <FeedbackFormBuilder questions={questions} onChange={setQuestions} />
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <button onClick={handleSave} disabled={saving} className="btn-primary py-2.5 px-6 disabled:opacity-50">
            {saving ? (
              <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</span>
            ) : (
              <span className="flex items-center gap-2"><Save className="w-4 h-4" />Save Form</span>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
