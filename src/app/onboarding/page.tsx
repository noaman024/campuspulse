"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Calendar,
  ClipboardList,
  CheckCircle,
  ArrowRight,
  Zap,
  PartyPopper,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedClubs, setSelectedClubs] = useState<string[]>(["Technical", "Cultural"]);

  const clubOptions = [
    { id: "Technical", label: "💻 Coding, AI & Robotics", desc: "Hackathons, ML workshops, web tech" },
    { id: "Cultural", label: "🎭 Music, Drama & Dance", desc: "Campus fests, theatricals, open mics" },
    { id: "Sports", label: "🏏 Cricket, Football & E-Sports", desc: "Inter-college tournaments & matches" },
    { id: "Workshop", label: "🛠️ Skill Bootcamps & Seminars", desc: "Resume building, design, entrepreneurship" },
  ];

  const toggleClub = (id: string) => {
    if (selectedClubs.includes(id)) {
      setSelectedClubs(selectedClubs.filter((c) => c !== id));
    } else {
      setSelectedClubs([...selectedClubs, id]);
    }
  };

  const handleFinish = () => {
    router.push("/events");
  };

  return (
    <div className="min-h-screen gradient-mesh flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-8 rounded-3xl border shadow-2xl w-full max-w-xl space-y-6"
        style={{ borderColor: "hsl(var(--border))" }}
      >
        {/* Progress indicator */}
        <div className="flex items-center justify-between text-xs text-muted-foreground border-b pb-4">
          <span className="font-semibold text-primary">Student Onboarding Guide</span>
          <span>Step {step} of 3</span>
        </div>

        {/* Step 1: Welcome */}
        {step === 1 && (
          <div className="space-y-5 text-center py-2">
            <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center text-white mx-auto shadow-lg">
              <Sparkles className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Welcome to CampusPulse!
              </h2>
              <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
                Your centralized gateway for discovering campus events, RSVPing with instant digital QR tickets, and sharing your direct feedback.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 text-left pt-2">
              <div className="p-3 rounded-xl border text-xs" style={{ background: "hsl(var(--surface))" }}>
                <Calendar className="w-4 h-4 text-primary mb-1" />
                <p className="font-semibold text-foreground">Discover</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Explore 20+ live college events</p>
              </div>
              <div className="p-3 rounded-xl border text-xs" style={{ background: "hsl(var(--surface))" }}>
                <Zap className="w-4 h-4 text-accent mb-1" />
                <p className="font-semibold text-foreground">RSVP Fast</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">1-click seat booking & QR passes</p>
              </div>
              <div className="p-3 rounded-xl border text-xs" style={{ background: "hsl(var(--surface))" }}>
                <ClipboardList className="w-4 h-4 text-emerald-400 mb-1" />
                <p className="font-semibold text-foreground">Share Feedback</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Rate events & earn badges</p>
              </div>
            </div>

            <button onClick={() => setStep(2)} className="btn-primary w-full py-2.5 text-xs flex items-center justify-center gap-1.5">
              Next: Select Interests <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Step 2: Choose Interests */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-foreground">Select Your Event Interests</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                We will personalize your campus feed based on your choices.
              </p>
            </div>

            <div className="space-y-2.5">
              {clubOptions.map((club) => {
                const isSelected = selectedClubs.includes(club.id);
                return (
                  <div
                    key={club.id}
                    onClick={() => toggleClub(club.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? "border-primary bg-primary/10 shadow-sm"
                        : "hover:border-primary/40 bg-surface"
                    }`}
                  >
                    <div>
                      <p className="font-semibold text-xs text-foreground">{club.label}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{club.desc}</p>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                        isSelected ? "bg-primary border-primary text-white" : "border-muted-foreground/40"
                      }`}
                    >
                      {isSelected && <CheckCircle className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-2 pt-2">
              <button onClick={() => setStep(1)} className="btn-secondary py-2.5 px-4 text-xs">
                Back
              </button>
              <button onClick={() => setStep(3)} className="btn-primary flex-1 py-2.5 text-xs flex items-center justify-center gap-1.5">
                Continue <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: All Set */}
        {step === 3 && (
          <div className="space-y-5 text-center py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <PartyPopper className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">You&apos;re All Set!</h2>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                Your profile is active and personalized. Jump straight into exploring upcoming campus events!
              </p>
            </div>

            <button onClick={handleFinish} className="btn-primary w-full py-3 text-xs font-semibold shadow-lg">
              Explore Live Campus Events Now
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
