import Link from "next/link";
import { Zap, Mail, Phone, MapPin, Shield, Building2, Calendar, ClipboardList, HelpCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer
      className="border-t mt-auto w-full bg-surface/80 dark:bg-card/50"
      style={{
        borderColor: "hsla(var(--border), 0.7)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Brand & University Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center text-white shadow-sm">
                <Zap className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span
                  className="text-lg font-bold tracking-tight leading-none"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  Campus<span className="gradient-text">Pulse</span>
                </span>
                <span className="text-[10px] text-muted-foreground font-semibold tracking-wider mt-0.5">
                  UNIVERSITY EVENT MANAGEMENT SYSTEM
                </span>
              </div>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
              The official centralized platform for university symposiums, departmental hackathons, cultural festivals, sports championships, and verified digital QR passes.
            </p>
            <div className="space-y-1.5 text-xs text-muted-foreground pt-1">
              <p className="flex items-center gap-2">
                <Building2 className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                <span>Office of Student Affairs & Technical Council</span>
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                <span>Main Academic Block, Campus North Campus</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                <span>studentaffairs@campuspulse.edu</span>
              </p>
            </div>
          </div>

          {/* Academic Wings & Councils */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Campus Portals
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="/events" className="hover:text-primary transition-colors flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> All Campus Events
                </Link>
              </li>
              <li>
                <Link href="/portal/feedback" className="hover:text-primary transition-colors flex items-center gap-1.5">
                  <ClipboardList className="w-3.5 h-3.5" /> Event Feedback Forms
                </Link>
              </li>
              <li>
                <Link href="/portal/qna" className="hover:text-primary transition-colors">
                  Live Speaker Q&A
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-primary transition-colors font-medium text-foreground">
                  Student & Organizer Login →
                </Link>
              </li>
            </ul>
          </div>

          {/* Student Council & Clubs */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Committees & Cells
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <span className="hover:text-foreground transition-colors cursor-default">
                  Technical Events Council
                </span>
              </li>
              <li>
                <span className="hover:text-foreground transition-colors cursor-default">
                  Cultural Affairs Committee
                </span>
              </li>
              <li>
                <span className="hover:text-foreground transition-colors cursor-default">
                  Department Sports Board
                </span>
              </li>
              <li>
                <span className="hover:text-foreground transition-colors cursor-default">
                  Training & Placement Cell
                </span>
              </li>
              <li>
                <Link href="/help" className="text-primary hover:underline font-medium">
                  Help Desk & FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Compliance & Verification */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Verification & Policies
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
                <Link href="/legal/security-policy" className="hover:text-primary transition-colors">
                  Security & Data Privacy
                </Link>
              </li>
              <li>
                <Link href="/legal/community-guidelines" className="hover:text-primary transition-colors">
                  Campus Code of Conduct
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className="mt-10 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground"
          style={{ borderColor: "hsla(var(--border), 0.7)" }}
        >
          <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
            <span>© {new Date().getFullYear()} CampusPulse. All rights reserved.</span>
            <span>•</span>
            <span>University Student Affairs & Event Operations</span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <Link href="/legal" className="hover:text-foreground transition-colors">
              Trust & Transparency
            </Link>
            <span>•</span>
            <Link href="/help" className="hover:text-foreground transition-colors">
              Student Grievance & Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
