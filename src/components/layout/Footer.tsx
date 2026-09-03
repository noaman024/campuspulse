"use client";

import Link from "next/link";
import { Zap, Mail, MapPin, Building2, Phone } from "lucide-react";
import { useState, useEffect } from "react";
import { getSiteSettings } from "@/actions/settings";

interface LinkItem {
  label: string;
  href: string;
}

interface FooterSettings {
  siteName: string;
  description: string;
  officeName: string;
  officeLocation: string;
  contactEmail: string;
  contactPhone?: string;
  departments: LinkItem[];
  portalLinks: LinkItem[];
  policyLinks: LinkItem[];
  copyrightText: string;
  councilNote: string;
}

const DEFAULT_FOOTER: FooterSettings = {
  siteName: "CampusPulse",
  description:
    "Official university event management system for symposiums, hackathons, cultural fests, sports meets, and verified digital entry passes.",
  officeName: "Office of Student Affairs",
  officeLocation: "Main Academic Block, North Campus",
  contactEmail: "events@campuspulse.edu",
  contactPhone: "+91 98765 43210",
  departments: [
    { label: "Computer Science & Engg", href: "/events?search=Computer" },
    { label: "Information Technology", href: "/events?search=Information" },
    { label: "Mechanical Engineering", href: "/events?search=Mechanical" },
    { label: "Cultural Council", href: "/events?category=Cultural" },
  ],
  portalLinks: [
    { label: "All Events", href: "/events" },
    { label: "Feedback Forms", href: "/portal/feedback" },
    { label: "Live Q&A", href: "/portal/qna" },
    { label: "Student Login", href: "/login" },
    { label: "About Us", href: "/about" },
  ],
  policyLinks: [
    { label: "Privacy Policy", href: "/legal/privacy-policy" },
    { label: "Terms of Service", href: "/legal/terms-of-service" },
    { label: "Code of Conduct", href: "/legal/community-guidelines" },
    { label: "Help & FAQs", href: "/help" },
  ],
  copyrightText: "CampusPulse. All rights reserved. University Event Portal.",
  councilNote: "Student Affairs & Technical Council",
};

export default function Footer() {
  const [data, setData] = useState<FooterSettings>(DEFAULT_FOOTER);

  useEffect(() => {
    let mounted = true;
    getSiteSettings()
      .then((res) => {
        if (mounted && res) {
          setData({
            siteName: res.siteName || DEFAULT_FOOTER.siteName,
            description: res.description || DEFAULT_FOOTER.description,
            officeName: res.officeName || DEFAULT_FOOTER.officeName,
            officeLocation: res.officeLocation || DEFAULT_FOOTER.officeLocation,
            contactEmail: res.contactEmail || DEFAULT_FOOTER.contactEmail,
            contactPhone: res.contactPhone,
            departments: res.departments?.length ? res.departments : DEFAULT_FOOTER.departments,
            portalLinks: res.portalLinks?.length ? res.portalLinks : DEFAULT_FOOTER.portalLinks,
            policyLinks: res.policyLinks?.length ? res.policyLinks : DEFAULT_FOOTER.policyLinks,
            copyrightText: res.copyrightText || DEFAULT_FOOTER.copyrightText,
            councilNote: res.councilNote || DEFAULT_FOOTER.councilNote,
          });
        }
      })
      .catch((err) => console.error("Could not fetch footer settings:", err));

    return () => {
      mounted = false;
    };
  }, []);

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
          {/* Brand & About */}
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
                {data.siteName.includes("CampusPulse") ? (
                  <>
                    Campus<span className="gradient-text">Pulse</span>
                  </>
                ) : (
                  data.siteName
                )}
              </span>
            </Link>

            <p className="text-xs leading-relaxed" style={{ color: "hsl(var(--fg-muted))" }}>
              {data.description}
            </p>

            <div className="space-y-1.5 text-xs" style={{ color: "hsl(var(--fg-subtle))" }}>
              {data.officeName && (
                <p className="flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "hsl(var(--primary))" }} />
                  {data.officeName}
                </p>
              )}
              {data.officeLocation && (
                <p className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "hsl(var(--primary))" }} />
                  {data.officeLocation}
                </p>
              )}
              {data.contactEmail && (
                <p className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "hsl(var(--primary))" }} />
                  <a href={`mailto:${data.contactEmail}`} className="hover:underline">
                    {data.contactEmail}
                  </a>
                </p>
              )}
              {data.contactPhone && (
                <p className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "hsl(var(--primary))" }} />
                  <a href={`tel:${data.contactPhone}`} className="hover:underline">
                    {data.contactPhone}
                  </a>
                </p>
              )}
            </div>
          </div>

          {/* Portal Column */}
          <div className="space-y-3">
            <h4
              className="text-[11px] font-bold uppercase tracking-widest"
              style={{ color: "hsl(var(--fg-muted))" }}
            >
              Portal
            </h4>
            <ul className="space-y-2">
              {data.portalLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-xs transition-colors hover:text-primary"
                    style={{ color: "hsl(var(--fg-subtle))" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Departments Column */}
          <div className="space-y-3">
            <h4
              className="text-[11px] font-bold uppercase tracking-widest"
              style={{ color: "hsl(var(--fg-muted))" }}
            >
              Departments
            </h4>
            <ul className="space-y-2">
              {data.departments.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-xs transition-colors hover:text-primary"
                    style={{ color: "hsl(var(--fg-subtle))" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policy Column */}
          <div className="space-y-3">
            <h4
              className="text-[11px] font-bold uppercase tracking-widest"
              style={{ color: "hsl(var(--fg-muted))" }}
            >
              Policy & Legal
            </h4>
            <ul className="space-y-2">
              {data.policyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-xs transition-colors hover:text-primary"
                    style={{ color: "hsl(var(--fg-subtle))" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-10 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
          style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--fg-subtle))" }}
        >
          <p>© {new Date().getFullYear()} {data.copyrightText}</p>
          <p>{data.councilNote}</p>
        </div>
      </div>
    </footer>
  );
}
