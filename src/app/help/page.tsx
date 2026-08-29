"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  HelpCircle,
  Search,
  MessageSquare,
  Mail,
  FileText,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Send,
} from "lucide-react";
import Toast from "@/components/ui/Toast";

interface FAQItem {
  question: string;
  answer: string;
  category: "General" | "Events & Tickets" | "Feedback" | "Account & Security";
}

const faqs: FAQItem[] = [
  {
    category: "Events & Tickets",
    question: "How do I register for a campus event and get my QR code ticket?",
    answer:
      "Simply browse the Events page, click on any active event, and tap the 'RSVP Now' button. A unique digital QR token will be generated instantly and linked to your student account for venue check-in.",
  },
  {
    category: "Events & Tickets",
    question: "Can I cancel my event registration if my schedule changes?",
    answer:
      "Yes. Open the event page and click 'Cancel Registration'. Your seat will be immediately released for other waitlisted peers.",
  },
  {
    category: "Feedback",
    question: "How do feedback surveys work and is my response anonymous?",
    answer:
      "When answering a feedback survey, you can toggle 'Submit Anonymously' if you prefer your name and email not to be associated with your ratings and comments.",
  },
  {
    category: "Feedback",
    question: "Where can student council members view feedback survey results?",
    answer:
      "Organizers and administrators can navigate to the Admin Feedback Center to view live question breakdowns, star rating distributions, and download executive reports.",
  },
  {
    category: "Account & Security",
    question: "How do I change my department or update my profile details?",
    answer:
      "Head to your Account Settings page from the user menu to edit your academic department, update your bio, or change your account password.",
  },
  {
    category: "General",
    question: "Can I access CampusPulse from my mobile phone or tablet?",
    answer:
      "Yes! CampusPulse is fully responsive and supports Progressive Web App (PWA) installation. Simply open the website in Chrome or Safari on your phone and tap 'Add to Home Screen'.",
  },
];

export default function HelpCenterPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const categories = ["all", "General", "Events & Tickets", "Feedback", "Account & Security"];

  const filteredFaqs = faqs.filter((faq) => {
    if (selectedCategory !== "all" && faq.category !== selectedCategory) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return faq.question.toLowerCase().includes(q) || faq.answer.toLowerCase().includes(q);
    }
    return true;
  });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setContactForm({ name: "", email: "", message: "" });
      setToast({
        message: "Support ticket received! Our team will respond within 24 hours.",
        type: "success",
      });
    }, 700);
  };

  return (
    <div className="min-h-screen gradient-mesh py-12 px-4 sm:px-6 lg:px-8">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header with Search */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CAMPUSPULSE HELP & SUPPORT</span>
          </div>
          <h1
            className="text-3xl sm:text-4xl font-extrabold text-foreground"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            How Can We Assist You?
          </h1>
          <p className="text-sm text-muted-foreground">
            Search frequently asked questions or submit an inquiry to our student support desk.
          </p>

          <div className="relative max-w-md mx-auto pt-2">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search FAQs (e.g. QR code, feedback, password)..."
              className="input-field input-with-icon-left text-xs py-2.5 shadow-md"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`py-1.5 px-4 rounded-xl text-xs font-semibold transition-all capitalize ${
                selectedCategory === cat
                  ? "btn-primary shadow-md"
                  : "btn-secondary"
              }`}
            >
              {cat === "all" ? "All Questions" : cat}
            </button>
          ))}
        </div>

        {/* FAQs Accordion */}
        <div className="space-y-3">
          {filteredFaqs.length === 0 ? (
            <p className="text-center py-8 text-sm text-muted-foreground">
              No matching questions found for &ldquo;{search}&rdquo;. Try another search term or contact us below.
            </p>
          ) : (
            filteredFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className="glass-card rounded-2xl border transition-colors overflow-hidden"
                  style={{ borderColor: isOpen ? "hsl(var(--primary) / 0.5)" : "hsl(var(--border))" }}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm text-foreground hover:text-primary transition-colors"
                  >
                    <span>{faq.question}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-primary flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      className="px-5 pb-5 pt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t"
                      style={{ borderColor: "hsl(var(--border))" }}
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Contact Support Form */}
        <div className="glass-card p-8 rounded-3xl border shadow-xl space-y-6" style={{ borderColor: "hsl(var(--border))" }}>
          <div className="border-b pb-4">
            <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Still Need Help? Contact Student Support
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Send us your issue details and our campus support team will assist you shortly.
            </p>
          </div>

          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold block mb-1 text-foreground">Your Name</label>
                <input
                  type="text"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  placeholder="e.g. Alex Johnson"
                  className="input-field text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1 text-foreground">Your Email Address</label>
                <input
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  placeholder="alex@college.edu"
                  className="input-field text-xs"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold block mb-1 text-foreground">Message / Question</label>
              <textarea
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                rows={4}
                placeholder="Describe your question or issue in detail..."
                className="input-field text-xs resize-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={sending}
              className="btn-primary py-2.5 px-6 text-xs flex items-center gap-1.5 shadow-md"
            >
              <Send className="w-3.5 h-3.5" /> {sending ? "Sending..." : "Submit Inquiry"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
