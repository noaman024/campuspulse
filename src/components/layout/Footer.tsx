import Link from "next/link";
import { Zap, ExternalLink, Mail, Heart, Shield, HelpCircle, FileText } from "lucide-react";

export default function Footer() {
  return (
    <footer
      className="border-t mt-auto w-full"
      style={{
        borderColor: "hsla(var(--border), 0.5)",
        background: "hsla(var(--surface), 0.6)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Brand */}
          <div className="sm:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center shadow-md">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span
                className="text-lg font-bold"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Campus<span className="gradient-text">Pulse</span>
              </span>
            </Link>
            <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
              Centralized campus event discovery, dynamic feedback surveys, media showcases, and institutional report generation built for modern university communities.
            </p>
          </div>

          {/* Platform */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Platform
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="/events" className="hover:text-primary transition-colors">
                  Campus Events
                </Link>
              </li>
              <li>
                <Link href="/portal/feedback" className="hover:text-primary transition-colors">
                  Feedback Surveys
                </Link>
              </li>
              <li>
                <Link href="/portal/qna" className="hover:text-primary transition-colors">
                  Live Q&A Forum
                </Link>
              </li>
              <li>
                <Link href="/portal/billing" className="hover:text-primary transition-colors">
                  VIP & Club Passes
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Legal & Trust
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="/legal/privacy-policy" className="hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/legal/terms-of-service" className="hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/legal/cookie-policy" className="hover:text-primary transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/legal" className="text-primary hover:underline font-semibold">
                  Trust & Legal Hub →
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Account */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Support
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="/help" className="hover:text-primary transition-colors">
                  Help Center & FAQs
                </Link>
              </li>
              <li>
                <Link href="/settings" className="hover:text-primary transition-colors">
                  Account Settings
                </Link>
              </li>
              <li>
                <Link href="/onboarding" className="hover:text-primary transition-colors">
                  Student Guide
                </Link>
              </li>
              <li>
                <a
                  href="mailto:team@campuspulse.dev"
                  className="hover:text-primary transition-colors inline-flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5" /> Support Desk
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className="mt-12 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground"
          style={{ borderColor: "hsla(var(--border), 0.5)" }}
        >
          <div className="flex items-center gap-1.5 flex-wrap justify-center sm:justify-start">
            <span>© {new Date().getFullYear()} CampusPulse Platform.</span>
            <span className="flex items-center gap-1">
              Made with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline mx-0.5" /> for campus communities.
            </span>
          </div>
          <div className="flex items-center gap-4 flex-wrap justify-center text-xs">
            <Link href="/legal/accessibility-statement" className="hover:text-foreground transition-colors">
              Accessibility
            </Link>
            <span className="text-muted-foreground/40">•</span>
            <Link href="/legal/security-policy" className="hover:text-foreground transition-colors">
              Security
            </Link>
            <span className="text-muted-foreground/40">•</span>
            <Link href="/legal/community-guidelines" className="hover:text-foreground transition-colors">
              Community Guidelines
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

