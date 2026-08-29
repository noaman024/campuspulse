"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle, Calendar, ArrowRight, Download, Zap } from "lucide-react";

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen gradient-mesh flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-8 rounded-3xl border shadow-2xl w-full max-w-md text-center space-y-6"
        style={{ borderColor: "hsl(var(--border))" }}
      >
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-lg">
          <CheckCircle className="w-10 h-10" />
        </div>

        <div className="space-y-1">
          <span className="badge badge-success text-[10px]">Transaction Confirmed</span>
          <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Payment Successful!
          </h1>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Your payment was processed securely. Your pass & digital QR access ticket have been activated on your student profile.
          </p>
        </div>

        <div className="p-4 rounded-xl border text-xs text-left space-y-2" style={{ background: "hsl(var(--surface))", borderColor: "hsl(var(--border))" }}>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Transaction ID:</span>
            <span className="font-mono font-semibold text-foreground">TXN-8942-CMP</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Amount Paid:</span>
            <span className="font-bold text-emerald-400">$12.00</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Payment Mode:</span>
            <span className="text-foreground">Campus UPI / Debit</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Status:</span>
            <span className="font-semibold text-emerald-400">Completed (Instant)</span>
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <Link href="/events" className="btn-primary w-full py-2.5 text-xs flex items-center justify-center gap-1.5 shadow-md">
            <Calendar className="w-3.5 h-3.5" /> Go to Events
          </Link>
          <Link href="/portal/billing" className="btn-secondary w-full py-2 text-xs">
            Back to Billing
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
