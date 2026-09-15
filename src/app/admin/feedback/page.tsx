"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardList,
  Calendar,
  Eye,
  Plus,
  BarChart3,
  CheckCircle,
  Trash2,
  X,
  Star,
  AlignLeft,
  List,
  Sliders,
  Sparkles,
} from "lucide-react";
import {
  getAllFeedbackForms,
  createFeedbackForm,
  deleteFeedbackForm,
  updateFeedbackForm,
} from "@/actions/feedback";
import { getAdminEvents } from "@/actions/events";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";
import Toast from "@/components/ui/Toast";

interface QuestionItem {
  prompt: string;
  type: "rating" | "mcq" | "text" | "likert";
  options: string[];
  isRequired: boolean;
}

export default function AdminFeedbackPage() {
  const [forms, setForms] = useState<Record<string, unknown>[]>([]);
  const [events, setEvents] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Form Builder state
  const [selectedEventId, setSelectedEventId] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [formInstructions, setFormInstructions] = useState("");
  const [questions, setQuestions] = useState<QuestionItem[]>([
    { prompt: "Overall, how satisfied were you with this event?", type: "rating", options: [], isRequired: true },
    { prompt: "What was the most valuable part of the event?", type: "text", options: [], isRequired: false },
  ]);

  const loadData = useCallback(async () => {
    try {
      const [formsData, eventsData] = await Promise.all([
        getAllFeedbackForms(),
        getAdminEvents(),
      ]);
      setForms(formsData);
      setEvents(eventsData);
      if (eventsData.length > 0 && !selectedEventId) {
        setSelectedEventId(eventsData[0]._id as string);
        setFormTitle(`${eventsData[0].title} — Participant Feedback`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedEventId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleEventChange = (eventId: string) => {
    setSelectedEventId(eventId);
    const event = events.find((e) => e._id === eventId);
    if (event) {
      setFormTitle(`${event.title} — Participant Feedback`);
    }
  };

  const addQuestion = (type: "rating" | "text" | "mcq" | "likert") => {
    const defaults: Record<string, { prompt: string; options: string[] }> = {
      rating: { prompt: "Rate your overall experience (1-5 stars)", options: [] },
      text: { prompt: "Any suggestions for future improvements?", options: [] },
      mcq: { prompt: "How did you hear about this event?", options: ["Campus Posters", "WhatsApp / Telegram", "Friends / Peers", "Faculty Announcement"] },
      likert: { prompt: "The session objectives were clearly met", options: [] },
    };

    setQuestions((prev) => [
      ...prev,
      {
        prompt: defaults[type].prompt,
        type,
        options: defaults[type].options,
        isRequired: true,
      },
    ]);
  };

  const updateQuestion = (index: number, field: keyof QuestionItem, value: unknown) => {
    setQuestions((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const removeQuestion = (index: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const addOption = (questionIndex: number) => {
    setQuestions((prev) => {
      const updated = [...prev];
      const currentOpts = updated[questionIndex].options || [];
      updated[questionIndex].options = [...currentOpts, `Option ${currentOpts.length + 1}`];
      return updated;
    });
  };

  const updateOption = (questionIndex: number, optionIndex: number, text: string) => {
    setQuestions((prev) => {
      const updated = [...prev];
      const opts = [...updated[questionIndex].options];
      opts[optionIndex] = text;
      updated[questionIndex].options = opts;
      return updated;
    });
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    setQuestions((prev) => {
      const updated = [...prev];
      updated[questionIndex].options = updated[questionIndex].options.filter((_, i) => i !== optionIndex);
      return updated;
    });
  };

  const handleCreateForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEventId) {
      setToast({ message: "Please select an event", type: "error" });
      return;
    }
    if (questions.length === 0) {
      setToast({ message: "Please add at least one question", type: "error" });
      return;
    }

    setSaving(true);
    try {
      await createFeedbackForm({
        eventId: selectedEventId,
        title: formTitle || "Event Feedback Form",
        instructions: formInstructions,
        questions,
      });
      setToast({ message: "Feedback form created successfully!", type: "success" });
      setIsModalOpen(false);
      await loadData();
    } catch (err) {
      setToast({
        message: err instanceof Error ? err.message : "Failed to create feedback form",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (formId: string) => {
    if (!confirm("Are you sure you want to delete this feedback form? All student responses for it will be removed.")) return;
    try {
      await deleteFeedbackForm(formId);
      setToast({ message: "Feedback form deleted", type: "success" });
      setForms((prev) => prev.filter((f) => f._id !== formId));
    } catch {
      setToast({ message: "Failed to delete form", type: "error" });
    }
  };

  const toggleAccepting = async (form: Record<string, unknown>) => {
    try {
      const updated = await updateFeedbackForm(form._id as string, {
        acceptingResponses: !form.acceptingResponses,
      });
      setForms((prev) => prev.map((f) => (f._id === form._id ? updated : f)));
      setToast({
        message: updated.acceptingResponses ? "Form opened for responses" : "Form closed for responses",
        type: "success",
      });
    } catch {
      setToast({ message: "Failed to update form status", type: "error" });
    }
  };

  if (loading) return <LoadingSpinner size="lg" text="Loading feedback forms..." fullPage />;

  return (
    <div className="p-3.5 sm:p-5 lg:p-7 space-y-4 sm:space-y-6 max-w-7xl mx-auto overflow-x-hidden">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header with Create Form Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground break-words">
            Feedback Forms
          </h1>
          <p className="text-xs sm:text-sm mt-0.5 sm:mt-1 text-muted-foreground break-words">
            Create and manage participant feedback surveys for campus events
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary py-2.5 px-4 text-xs sm:text-sm flex items-center justify-center gap-2 w-full sm:w-auto flex-shrink-0"
        >
          <Plus className="w-4 h-4" /> Create Feedback Form
        </button>
      </div>

      {forms.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No Feedback Forms Created Yet"
          description="Create custom feedback surveys with star ratings, multiple choice, and open-ended questions to gather student insights."
          action={{
            label: "Create First Feedback Form",
            onClick: () => setIsModalOpen(true),
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {forms.map((form, i) => {
            const event = form.eventId as Record<string, unknown> | null;
            const qCount = (form.questions as unknown[])?.length || 0;
            const isAccepting = form.acceptingResponses as boolean;

            return (
              <motion.div
                key={form._id as string}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card p-4 sm:p-5 rounded-xl flex flex-col justify-between gap-3 sm:gap-4 hover:border-primary/40 transition-colors overflow-hidden"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-sm line-clamp-2 break-words flex-1 min-w-0" style={{ color: "hsl(var(--foreground))" }}>
                      {form.title as string}
                    </h3>
                    <button
                      onClick={() => handleDelete(form._id as string)}
                      className="text-muted-foreground hover:text-red-400 p-1 transition-colors flex-shrink-0"
                      title="Delete form"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {event ? (
                    <p className="text-xs truncate mt-1 flex items-center gap-1 min-w-0" style={{ color: "hsl(var(--primary))" }}>
                      <Calendar className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{event.title as string}</span>
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground mt-1">Standalone Form</p>
                  )}

                  <div className="flex flex-wrap items-center gap-2 text-xs mt-3">
                    <span className="badge badge-primary text-[11px]">
                      {qCount} Questions
                    </span>
                    <button
                      onClick={() => toggleAccepting(form)}
                      className={`badge text-[11px] cursor-pointer ${
                        isAccepting ? "badge-success" : "badge-neutral opacity-60"
                      }`}
                    >
                      {isAccepting ? "● Accepting" : "○ Closed"}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-3 border-t" style={{ borderColor: "hsl(var(--border))" }}>
                  <Link
                    href={`/portal/feedback/${form._id}`}
                    target="_blank"
                    className="btn-secondary py-1.5 px-3 text-xs flex-1 justify-center flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <Eye className="w-3.5 h-3.5" /> Preview Form
                  </Link>
                  <Link
                    href={`/admin/feedback/${event?._id || form.eventId}/responses`}
                    className="btn-primary py-1.5 px-3 text-xs flex-1 justify-center flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <BarChart3 className="w-3.5 h-3.5" /> Responses
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Form Builder Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col my-auto border shadow-2xl"
              style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
            >
              {/* Modal Header */}
              <div className="p-5 border-b flex items-center justify-between" style={{ borderColor: "hsl(var(--border))" }}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "hsl(var(--primary) / 0.15)", color: "hsl(var(--primary))" }}>
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-bold text-base" style={{ color: "hsl(var(--foreground))" }}>
                      Create Feedback Form
                    </h2>
                    <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
                      Configure questions and link to an event
                    </p>
                  </div>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg hover:bg-muted text-muted-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleCreateForm} className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Select Event */}
                <div>
                  <label className="text-xs font-semibold block mb-1.5" style={{ color: "hsl(var(--foreground))" }}>
                    Select Event *
                  </label>
                  <select
                    value={selectedEventId}
                    onChange={(e) => handleEventChange(e.target.value)}
                    className="input-field"
                    required
                  >
                    <option value="" disabled>Select an event to attach feedback</option>
                    {events.map((e) => (
                      <option key={e._id as string} value={e._id as string}>
                        {e.title as string} ({e.category as string})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Form Title */}
                <div>
                  <label className="text-xs font-semibold block mb-1.5" style={{ color: "hsl(var(--foreground))" }}>
                    Form Title *
                  </label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. AI Workshop Participant Feedback"
                    className="input-field"
                    required
                  />
                </div>

                {/* Instructions */}
                <div>
                  <label className="text-xs font-semibold block mb-1.5" style={{ color: "hsl(var(--foreground))" }}>
                    Instructions / Description (Optional)
                  </label>
                  <textarea
                    value={formInstructions}
                    onChange={(e) => setFormInstructions(e.target.value)}
                    placeholder="e.g. Please take 2 minutes to rate this event. Your feedback helps us improve future editions."
                    className="input-field resize-none text-xs"
                    rows={2}
                  />
                </div>

                {/* Questions Builder */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "hsl(var(--muted-foreground))" }}>
                      Form Questions ({questions.length})
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {questions.map((q, qIndex) => (
                      <div
                        key={qIndex}
                        className="p-4 rounded-xl border space-y-3 relative group"
                        style={{ background: "hsl(var(--surface))", borderColor: "hsl(var(--border))" }}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold px-2 py-0.5 rounded capitalize" style={{ background: "hsl(var(--primary) / 0.15)", color: "hsl(var(--primary))" }}>
                            Q{qIndex + 1}: {q.type}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeQuestion(qIndex)}
                            className="text-muted-foreground hover:text-red-400 p-1"
                            title="Remove question"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <input
                          type="text"
                          value={q.prompt}
                          onChange={(e) => updateQuestion(qIndex, "prompt", e.target.value)}
                          placeholder="Question prompt..."
                          className="input-field text-sm"
                          required
                        />

                        {/* MCQ Options */}
                        {q.type === "mcq" && (
                          <div className="pl-4 space-y-2 border-l-2" style={{ borderColor: "hsl(var(--primary))" }}>
                            <p className="text-[11px] font-semibold text-muted-foreground">Multiple Choice Options:</p>
                            {q.options.map((opt, optIndex) => (
                              <div key={optIndex} className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">●</span>
                                <input
                                  type="text"
                                  value={opt}
                                  onChange={(e) => updateOption(qIndex, optIndex, e.target.value)}
                                  className="input-field text-xs py-1.5 flex-1"
                                  required
                                />
                                {q.options.length > 2 && (
                                  <button
                                    type="button"
                                    onClick={() => removeOption(qIndex, optIndex)}
                                    className="text-xs text-muted-foreground hover:text-red-400"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={() => addOption(qIndex)}
                              className="text-xs text-primary font-medium hover:underline flex items-center gap-1 pt-1"
                            >
                              <Plus className="w-3 h-3" /> Add Choice
                            </button>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-2 text-xs">
                          <label className="flex items-center gap-2 cursor-pointer text-muted-foreground">
                            <input
                              type="checkbox"
                              checked={q.isRequired}
                              onChange={(e) => updateQuestion(qIndex, "isRequired", e.target.checked)}
                              className="rounded accent-primary"
                            />
                            Required question
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Question Buttons */}
                  <div className="pt-2">
                    <p className="text-xs font-semibold mb-2" style={{ color: "hsl(var(--muted-foreground))" }}>
                      + Add Question:
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <button
                        type="button"
                        onClick={() => addQuestion("rating")}
                        className="btn-secondary py-2 px-3 text-xs flex items-center justify-center gap-1.5"
                      >
                        <Star className="w-3.5 h-3.5 text-amber-400" /> Star Rating
                      </button>
                      <button
                        type="button"
                        onClick={() => addQuestion("text")}
                        className="btn-secondary py-2 px-3 text-xs flex items-center justify-center gap-1.5"
                      >
                        <AlignLeft className="w-3.5 h-3.5 text-blue-400" /> Text Answer
                      </button>
                      <button
                        type="button"
                        onClick={() => addQuestion("mcq")}
                        className="btn-secondary py-2 px-3 text-xs flex items-center justify-center gap-1.5"
                      >
                        <List className="w-3.5 h-3.5 text-emerald-400" /> MCQ Choice
                      </button>
                      <button
                        type="button"
                        onClick={() => addQuestion("likert")}
                        className="btn-secondary py-2 px-3 text-xs flex items-center justify-center gap-1.5"
                      >
                        <Sliders className="w-3.5 h-3.5 text-purple-400" /> Likert Scale
                      </button>
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="pt-4 border-t flex justify-end gap-3" style={{ borderColor: "hsl(var(--border))" }}>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="btn-secondary py-2.5 px-4 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn-primary py-2.5 px-5 text-xs flex items-center gap-2 disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Saving Form...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" /> Save & Publish Form
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

