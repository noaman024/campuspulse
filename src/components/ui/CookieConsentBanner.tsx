"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, X, Check, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CookieConsentBanner() {
  const [show, setShow] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true,
    analytics: true,
    marketing: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem("campuspulse_cookie_consent");
    if (!consent) {
      const timer = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem("campuspulse_cookie_consent", "all");
    setShow(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem(
      "campuspulse_cookie_consent",
      JSON.stringify(preferences)
    );
    setShow(false);
    setShowPreferences(false);
  };

  const handleDeclineNonEssential = () => {
    localStorage.setItem("campuspulse_cookie_consent", "essential_only");
    setShow(false);
  };

  return (
    <>
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 glass-card p-5 rounded-2xl border shadow-2xl space-y-4"
            style={{
              background: "hsl(var(--card) / 0.95)",
              borderColor: "hsl(var(--border))",
            }}
          >
            <div className="flex items-start gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: "hsl(var(--primary) / 0.15)",
                  color: "hsl(var(--primary))",
                }}
              >
                <Cookie className="w-5 h-5" />
              </div>
              <div className="flex-1 text-xs">
                <h3 className="font-bold text-sm text-foreground mb-1">
                  Cookie & Privacy Preferences
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  We use cookies and similar technologies to enhance your campus event experience, analyze platform traffic, and personalize feedback forms. Read our{" "}
                  <Link
                    href="/legal/cookie-policy"
                    className="text-primary underline hover:text-primary/80"
                  >
                    Cookie Policy
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/legal/privacy-policy"
                    className="text-primary underline hover:text-primary/80"
                  >
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t text-xs" style={{ borderColor: "hsl(var(--border))" }}>
              <button
                onClick={() => setShowPreferences(true)}
                className="text-muted-foreground hover:text-foreground flex items-center gap-1 font-medium"
              >
                <Settings className="w-3.5 h-3.5" /> Preferences
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDeclineNonEssential}
                  className="btn-secondary py-1.5 px-3 text-xs"
                >
                  Essential Only
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="btn-primary py-1.5 px-3 text-xs flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" /> Accept All
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preferences Modal */}
      <AnimatePresence>
        {showPreferences && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card rounded-2xl w-full max-w-md p-6 space-y-4 border shadow-2xl"
              style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
            >
              <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: "hsl(var(--border))" }}>
                <h3 className="font-bold text-sm">Customize Cookie Settings</h3>
                <button onClick={() => setShowPreferences(false)} className="p-1 text-muted-foreground hover:text-foreground">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-lg border flex items-center justify-between" style={{ borderColor: "hsl(var(--border))" }}>
                  <div>
                    <p className="font-semibold text-foreground">Strictly Necessary</p>
                    <p className="text-muted-foreground text-[11px]">Required for login, sessions & security</p>
                  </div>
                  <span className="badge badge-primary text-[10px]">Always Active</span>
                </div>

                <div className="p-3 rounded-lg border flex items-center justify-between" style={{ borderColor: "hsl(var(--border))" }}>
                  <div>
                    <p className="font-semibold text-foreground">Performance & Analytics</p>
                    <p className="text-muted-foreground text-[11px]">Helps us measure event engagement</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                    className="accent-primary w-4 h-4 cursor-pointer"
                  />
                </div>

                <div className="p-3 rounded-lg border flex items-center justify-between" style={{ borderColor: "hsl(var(--border))" }}>
                  <div>
                    <p className="font-semibold text-foreground">Event Reminders & Personalization</p>
                    <p className="text-muted-foreground text-[11px]">Tailored event recommendations</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.marketing}
                    onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                    className="accent-primary w-4 h-4 cursor-pointer"
                  />
                </div>
              </div>

              <div className="pt-3 border-t flex justify-end gap-2 text-xs" style={{ borderColor: "hsl(var(--border))" }}>
                <button onClick={() => setShowPreferences(false)} className="btn-secondary py-1.5 px-3">
                  Cancel
                </button>
                <button onClick={handleSavePreferences} className="btn-primary py-1.5 px-4">
                  Save Preferences
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
