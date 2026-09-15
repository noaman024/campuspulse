"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { XCircle, RefreshCw } from "lucide-react";

export default function PaymentFailedPage() {
  return (
    <div className="min-h-screen gradient-mesh flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-8 rounded-3xl border shadow-2xl w-full max-w-md text-center space-y-6"
        style={{ borderColor: "hsl(var(--border))" }}
      >
        <div className="w-16 h-16 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto shadow-lg">
          <XCircle className="w-10 h-10" />
        </div>

        <div className="space-y-1">
          <span className="badge badge-destructive text-[10px]">Payment Declined</span>
          <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Payment Failed
          </h1>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Your bank or payment gateway declined this transaction. No funds were deducted from your account.
          </p>
        </div>

        <div className="p-4 rounded-xl border text-xs text-left space-y-2" style={{ background: "hsl(var(--surface))", borderColor: "hsl(var(--border))" }}>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Error Code:</span>
            <span className="font-mono text-red-400">ERR_CARD_DECLINED_402</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Reason:</span>
            <span className="text-foreground">Insufficient funds or bank timeout</span>
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <Link href="/portal/billing" className="btn-primary w-full py-2.5 text-xs flex items-center justify-center gap-1.5 shadow-md">
            <RefreshCw className="w-3.5 h-3.5" /> Retry Payment
          </Link>
          <Link href="/help" className="btn-secondary w-full py-2 text-xs">
            Contact Support Desk
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
