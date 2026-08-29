"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  CreditCard,
  CheckCircle,
  Zap,
  Sparkles,
  Shield,
  ArrowRight,
  Clock,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import Toast from "@/components/ui/Toast";

export default function BillingPortalPage() {
  const [currentPlan, setCurrentPlan] = useState<"free" | "pro" | "club">("free");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const plans = [
    {
      id: "free",
      name: "Student Free Pass",
      price: "$0",
      period: "forever",
      desc: "Standard access for all enrolled college students",
      features: [
        "Unlimited Event Discovery & Browsing",
        "RSVP & Instant QR Code Passes",
        "Live Q&A Inquiries & Upvoting",
        "Submit Dynamic Feedback Surveys",
      ],
      cta: "Current Active Plan",
      current: currentPlan === "free",
    },
    {
      id: "pro",
      name: "Campus VIP / All-Access Pass",
      price: "$12",
      period: "per semester",
      desc: "Priority entry for hackathons, certification workshops & annual fests",
      features: [
        "Everything in Student Free Pass",
        "Priority VIP Seating at Keynote Summits",
        "Exclusive Free Workshop Hardware / Swag Kits",
        "Verified Certificate of Participation Badges",
        "Early 48-Hour Registration Window",
      ],
      cta: "Upgrade to VIP Pass",
      current: currentPlan === "pro",
      popular: true,
    },
    {
      id: "club",
      name: "Club Organizer Lead",
      price: "$29",
      period: "per academic year",
      desc: "Advanced tooling for student council heads & club presidents",
      features: [
        "Unlimited Event Creation & Publishing",
        "Custom Form Builder with Unlimited Questions",
        "Executive PDF Report Generator & Print",
        "Dedicated Media Showcase & Photo Vault",
        "Direct Attendance Verification Scanner",
      ],
      cta: "Activate Organizer Plan",
      current: currentPlan === "club",
    },
  ];

  const handlePlanAction = (planId: "free" | "pro" | "club") => {
    if (planId === currentPlan) return;
    if (planId === "free") {
      setCurrentPlan("free");
      setToast({ message: "Subscription downgraded to Free Plan.", type: "success" });
    } else {
      window.location.href = `/portal/billing/success?plan=${planId}`;
    }
  };

  return (
    <div className="min-h-screen gradient-mesh py-12 px-4 sm:px-6 lg:px-8">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="max-w-6xl mx-auto space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
            <CreditCard className="w-3.5 h-3.5" />
            <span>CAMPUS PASSES & SUBSCRIPTIONS</span>
          </div>
          <h1
            className="text-3xl sm:text-4xl font-extrabold text-foreground"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Flexible Passes for Every Campus Need
          </h1>
          <p className="text-sm text-muted-foreground">
            Explore free student passes, VIP fest access, and student club management tiers.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`glass-card p-6 sm:p-8 rounded-3xl border flex flex-col justify-between relative transition-all duration-300 ${
                plan.popular
                  ? "border-primary shadow-2xl scale-[1.02]"
                  : "hover:border-primary/40"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-accent text-white text-[10px] font-bold uppercase tracking-wider py-1 px-3 rounded-full shadow-md">
                  Most Popular on Campus
                </span>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-lg text-foreground">{plan.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{plan.desc}</p>
                </div>

                <div className="flex items-baseline gap-1 pt-2">
                  <span className="text-3xl sm:text-4xl font-extrabold text-foreground">{plan.price}</span>
                  <span className="text-xs text-muted-foreground">/ {plan.period}</span>
                </div>

                <div className="space-y-2.5 pt-4 border-t" style={{ borderColor: "hsl(var(--border))" }}>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Features included:</p>
                  {plan.features.map((feat, fi) => (
                    <div key={fi} className="flex items-start gap-2 text-xs text-foreground">
                      <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-6 border-t" style={{ borderColor: "hsl(var(--border))" }}>
                <button
                  onClick={() => handlePlanAction(plan.id as any)}
                  disabled={plan.current}
                  className={`w-full py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    plan.current
                      ? "btn-secondary opacity-60 cursor-default"
                      : plan.popular
                      ? "btn-primary shadow-lg"
                      : "btn-secondary hover:btn-primary"
                  }`}
                >
                  {plan.current ? "Active Plan" : plan.cta}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Payment Status Previews */}
        <div className="glass-card p-6 rounded-2xl border space-y-3 text-xs" style={{ borderColor: "hsl(var(--border))" }}>
          <h3 className="font-bold text-sm text-foreground">Transaction & Checkout Simulator</h3>
          <p className="text-muted-foreground">
            Test how checkout lifecycle responses appear for student registrations:
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <Link href="/portal/billing/success" className="btn-secondary py-1.5 px-3 flex items-center gap-1.5 text-emerald-400">
              <CheckCircle className="w-3.5 h-3.5" /> View Payment Success
            </Link>
            <Link href="/portal/billing/failed" className="btn-secondary py-1.5 px-3 flex items-center gap-1.5 text-red-400">
              <XCircle className="w-3.5 h-3.5" /> View Payment Failed
            </Link>
            <Link href="/portal/billing/pending" className="btn-secondary py-1.5 px-3 flex items-center gap-1.5 text-amber-400">
              <Clock className="w-3.5 h-3.5" /> View Payment Pending
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
