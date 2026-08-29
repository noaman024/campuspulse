"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Trash2,
  GripVertical,
  Star,
  List,
  AlignLeft,
  ThumbsUp,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";

export interface FormQuestion {
  questionId: string;
  prompt: string;
  type: "rating" | "mcq" | "text" | "likert";
  options: string[];
  isRequired: boolean;
}

interface FeedbackFormBuilderProps {
  questions: FormQuestion[];
  onChange: (questions: FormQuestion[]) => void;
}

const questionTypeIcons = {
  rating: Star,
  mcq: List,
  text: AlignLeft,
  likert: ThumbsUp,
};

const questionTypeLabels = {
  rating: "Star Rating",
  mcq: "Multiple Choice",
  text: "Text Answer",
  likert: "Likert Scale",
};

const defaultLikertOptions = [
  "Strongly Disagree",
  "Disagree",
  "Neutral",
  "Agree",
  "Strongly Agree",
];

export default function FeedbackFormBuilder({ questions, onChange }: FeedbackFormBuilderProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const addQuestion = (type: FormQuestion["type"]) => {
    const newQuestion: FormQuestion = {
      questionId: uuidv4(),
      prompt: "",
      type,
      options: type === "mcq" ? ["Option 1", "Option 2"] : type === "likert" ? [...defaultLikertOptions] : [],
      isRequired: true,
    };
    onChange([...questions, newQuestion]);
    setExpandedId(newQuestion.questionId);
  };

  const updateQuestion = (questionId: string, updates: Partial<FormQuestion>) => {
    onChange(
      questions.map((q) =>
        q.questionId === questionId ? { ...q, ...updates } : q
      )
    );
  };

  const removeQuestion = (questionId: string) => {
    onChange(questions.filter((q) => q.questionId !== questionId));
  };

  const moveQuestion = (index: number, direction: "up" | "down") => {
    const newQuestions = [...questions];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newQuestions.length) return;
    [newQuestions[index], newQuestions[targetIndex]] = [newQuestions[targetIndex], newQuestions[index]];
    onChange(newQuestions);
  };

  const addOption = (questionId: string) => {
    const q = questions.find((q) => q.questionId === questionId);
    if (!q) return;
    updateQuestion(questionId, {
      options: [...q.options, `Option ${q.options.length + 1}`],
    });
  };

  const updateOption = (questionId: string, optIndex: number, value: string) => {
    const q = questions.find((q) => q.questionId === questionId);
    if (!q) return;
    const newOptions = [...q.options];
    newOptions[optIndex] = value;
    updateQuestion(questionId, { options: newOptions });
  };

  const removeOption = (questionId: string, optIndex: number) => {
    const q = questions.find((q) => q.questionId === questionId);
    if (!q || q.options.length <= 2) return;
    updateQuestion(questionId, {
      options: q.options.filter((_, i) => i !== optIndex),
    });
  };

  return (
    <div className="space-y-4">
      {/* Questions List */}
      {questions.map((question, index) => {
        const Icon = questionTypeIcons[question.type];
        const isExpanded = expandedId === question.questionId;

        return (
          <motion.div
            key={question.questionId}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass-card p-4"
          >
            {/* Question Header */}
            <div className="flex items-center gap-3">
              <div className="flex flex-col gap-0.5">
                <button
                  onClick={() => moveQuestion(index, "up")}
                  disabled={index === 0}
                  className="p-0.5 rounded hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-30"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => moveQuestion(index, "down")}
                  disabled={index === questions.length - 1}
                  className="p-0.5 rounded hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-30"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>

              <GripVertical className="w-4 h-4 flex-shrink-0" style={{ color: "hsl(var(--muted-foreground))" }} />

              <span
                className="text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  background: "hsl(var(--primary) / 0.1)",
                  color: "hsl(var(--primary))",
                }}
              >
                {index + 1}
              </span>

              <div className="flex-1 min-w-0">
                <button
                  onClick={() => setExpandedId(isExpanded ? null : question.questionId)}
                  className="text-left w-full"
                >
                  <p className="text-sm font-medium truncate" style={{ color: "hsl(var(--foreground))" }}>
                    {question.prompt || "Untitled Question"}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Icon className="w-3 h-3" style={{ color: "hsl(var(--muted-foreground))" }} />
                    <span className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
                      {questionTypeLabels[question.type]}
                    </span>
                    {question.isRequired && (
                      <span className="text-xs text-red-500">• Required</span>
                    )}
                  </div>
                </button>
              </div>

              <button
                onClick={() => removeQuestion(question.questionId)}
                className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex-shrink-0"
                style={{ color: "hsl(var(--destructive))" }}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Expanded Editor */}
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                className="mt-4 pt-4 border-t space-y-4"
                style={{ borderColor: "hsl(var(--border))" }}
              >
                <div>
                  <label className="text-xs font-medium mb-1 block" style={{ color: "hsl(var(--muted-foreground))" }}>
                    Question Text
                  </label>
                  <input
                    type="text"
                    value={question.prompt}
                    onChange={(e) => updateQuestion(question.questionId, { prompt: e.target.value })}
                    placeholder="Enter your question..."
                    className="input-field"
                  />
                </div>

                {/* Options for MCQ */}
                {question.type === "mcq" && (
                  <div>
                    <label className="text-xs font-medium mb-2 block" style={{ color: "hsl(var(--muted-foreground))" }}>
                      Options
                    </label>
                    <div className="space-y-2">
                      {question.options.map((opt, optIdx) => (
                        <div key={optIdx} className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded-full border-2 flex-shrink-0"
                            style={{ borderColor: "hsl(var(--border))" }}
                          />
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) => updateOption(question.questionId, optIdx, e.target.value)}
                            className="input-field flex-1"
                          />
                          {question.options.length > 2 && (
                            <button
                              onClick={() => removeOption(question.questionId, optIdx)}
                              className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                              style={{ color: "hsl(var(--destructive))" }}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        onClick={() => addOption(question.questionId)}
                        className="text-sm font-medium flex items-center gap-1 mt-1"
                        style={{ color: "hsl(var(--primary))" }}
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Option
                      </button>
                    </div>
                  </div>
                )}

                {/* Likert preview */}
                {question.type === "likert" && (
                  <div>
                    <label className="text-xs font-medium mb-2 block" style={{ color: "hsl(var(--muted-foreground))" }}>
                      Scale Labels
                    </label>
                    <div className="flex gap-2 flex-wrap">
                      {question.options.map((opt, idx) => (
                        <span key={idx} className="badge badge-primary text-xs">{opt}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Rating preview */}
                {question.type === "rating" && (
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-6 h-6" style={{ color: "hsl(var(--warning))" }} />
                    ))}
                    <span className="text-xs ml-2" style={{ color: "hsl(var(--muted-foreground))" }}>
                      5-star scale
                    </span>
                  </div>
                )}

                {/* Required toggle */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuestion(question.questionId, { isRequired: !question.isRequired })}
                    className="relative w-10 h-5 rounded-full transition-colors"
                    style={{
                      background: question.isRequired ? "hsl(var(--primary))" : "hsl(var(--muted))",
                    }}
                  >
                    <span
                      className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform"
                      style={{
                        left: question.isRequired ? "calc(100% - 18px)" : "2px",
                      }}
                    />
                  </button>
                  <span className="text-sm" style={{ color: "hsl(var(--foreground))" }}>Required</span>
                </div>
              </motion.div>
            )}
          </motion.div>
        );
      })}

      {/* Add Question Buttons */}
      <div
        className="p-4 rounded-xl border-2 border-dashed flex flex-wrap gap-2 justify-center"
        style={{ borderColor: "hsl(var(--border))" }}
      >
        {(Object.keys(questionTypeIcons) as FormQuestion["type"][]).map((type) => {
          const Icon = questionTypeIcons[type];
          return (
            <button
              key={type}
              onClick={() => addQuestion(type)}
              className="btn-secondary py-2 px-3 text-xs gap-1.5"
            >
              <Icon className="w-3.5 h-3.5" />
              {questionTypeLabels[type]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
