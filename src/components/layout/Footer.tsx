import Link from "next/link";
import { Zap, Mail, MapPin, Building2 } from "lucide-react";

const LINKS = {
  Portal: [
    { label: "All Events", href: "/events" },
    { label: "Feedback Forms", href: "/portal/feedback" },
    { label: "Live Q&A", href: "/portal/qna" },
    { label: "Student Login", href: "/login" },
  ],
  Departments: [
    { label: "Computer Science & Engg", href: "#" },
    { label: "Information Technology", href: "#" },
    { label: "Mechanical Engineering", href: "#" },
    { label: "Cultural Council", href: "#" },
  ],
  Policy: [
    { label: "Privacy Policy", href: "/legal/privacy-policy" },
    { label: "Terms of Service", href: "/legal/terms-of-service" },
    { label: "Code of Conduct", href: "/legal/community-guidelines" },
    { label: "Help & FAQs", href: "/help" },
  ],
};

export default function Footer() {
  return (
    <footer
      className="border-t mt-auto"
      style={{
        background: "hsl(var(--surface))",
        borderColor: "hsl(var(--border))",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center text-white"
                style={{
                  background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))",
                }}
              >
                <Zap className="w-4 h-4" strokeWidth={2.5} />
              </div>
              <span className="text-base font-extrabold tracking-tight text-foreground">
                Campus<span className="gradient-text">Pulse</span>
              </span>
            </Link>

            <p className="text-xs leading-relaxed" style={{ color: "hsl(var(--fg-muted))" }}>
              Official university event management system for symposiums, hackathons, cultural fests, sports meets, and verified digital entry passes.
            </p>

            <div className="space-y-1.5 text-xs" style={{ color: "hsl(var(--fg-subtle))" }}>
              <p className="flex items-center gap-2">
                <Building2 className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "hsl(var(--primary))" }} />
                Office of Student Affairs
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "hsl(var(--primary))" }} />
                Main Academic Block, North Campus
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "hsl(var(--primary))" }} />
                events@campuspulse.edu
              </p>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(LINKS).map(([section, links]) => (
            <div key={section} className="space-y-3">
              <h4
                className="text-[11px] font-bold uppercase tracking-widest"
                style={{ color: "hsl(var(--fg-muted))" }}
              >
                {section}
              </h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-xs transition-colors"
                      style={{ color: "hsl(var(--fg-subtle))" }}
                      onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "hsl(var(--primary))")}
                      onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "hsl(var(--fg-subtle))")}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="mt-10 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
          style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--fg-subtle))" }}
        >
          <p>© {new Date().getFullYear()} CampusPulse. All rights reserved. University Event Portal.</p>
          <p>Student Affairs & Technical Council</p>
        </div>
      </div>
    </footer>
  );
}
