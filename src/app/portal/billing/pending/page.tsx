"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, RefreshCw } from "lucide-react";

export default function PaymentPendingPage() {
  return (
    <div className="min-h-screen gradient-mesh flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-8 rounded-3xl border shadow-2xl w-full max-w-md text-center space-y-6"
        style={{ borderColor: "hsl(var(--border))" }}
      >
        <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto shadow-lg animate-pulse">
          <Clock className="w-10 h-10" />
        </div>

        <div className="space-y-1">
          <span className="badge badge-warning text-[10px]">Awaiting Bank Confirmation</span>
          <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Payment Pending
          </h1>
          <p className="text-xs text-muted-foreground leading-relaxed">
            We are awaiting confirmation from your UPI app or banking partner. This typically takes 1–3 minutes.
          </p>
        </div>

        <div className="p-4 rounded-xl border text-xs text-left space-y-2" style={{ background: "hsl(var(--surface))", borderColor: "hsl(var(--border))" }}>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Order Reference:</span>
            <span className="font-mono text-foreground">ORD-7719-PENDING</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Status:</span>
            <span className="text-amber-400 font-semibold">Processing with Gateway</span>
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <button
            onClick={() => window.location.reload()}
            className="btn-primary w-full py-2.5 text-xs flex items-center justify-center gap-1.5 shadow-md"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Check Status Now
          </button>
          <Link href="/events" className="btn-secondary w-full py-2 text-xs">
            Return to Events
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
