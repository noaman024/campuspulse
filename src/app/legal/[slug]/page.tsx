import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  HelpCircle,
} from "lucide-react";

const policyDetails: Record<
  string,
  {
    title: string;
    lastUpdated: string;
    category: string;
    summary: string;
    sections: { heading: string; content: string }[];
  }
> = {
  "privacy-policy": {
    title: "Privacy Policy",
    lastUpdated: "August 2026",
    category: "Privacy & Data Protection",
    summary:
      "This Privacy Policy describes how CampusPulse collects, uses, encrypts, and discloses information gathered from students, faculty, and administrators.",
    sections: [
      {
        heading: "1. Information We Collect",
        content:
          "We collect personal information you provide when registering an account, including your full name, institutional email address, department, roll number, and student role. When you register for events, we generate unique QR codes and record your attendance logs, feedback responses, and Q&A interactions.",
      },
      {
        heading: "2. How We Use Your Information",
        content:
          "Your data is used strictly for campus event administration, attendance verification, issuing participation reports, anonymous/identified feedback analytics, and facilitating event coordination between organizers and students.",
      },
      {
        heading: "3. Data Encryption & Security",
        content:
          "All passwords are encrypted with bcrypt hashing. Communication with the database is secured using TLS/SSL encryption. We implement role-based access control (RBAC) to ensure only authorized university administrators can view consolidated reports.",
      },
      {
        heading: "4. Your Rights & Data Deletion",
        content:
          "Students retain the right to review their registered events, export their participation records, and request full account and data deletion through our support desk.",
      },
    ],
  },
  "terms-of-service": {
    title: "Terms of Service",
    lastUpdated: "August 2026",
    category: "Legal Agreement",
    summary:
      "These Terms of Service govern your access to and use of CampusPulse web applications, mobile interfaces, and campus discovery tools.",
    sections: [
      {
        heading: "1. Acceptance of Terms",
        content:
          "By creating an account or accessing CampusPulse, you agree to comply with these terms, university bylaws, and all applicable digital laws.",
      },
      {
        heading: "2. User Accounts & Responsibilities",
        content:
          "You are responsible for maintaining the confidentiality of your account credentials. Sharing QR code event tickets or misrepresenting attendance constitutes a violation of university academic integrity rules.",
      },
      {
        heading: "3. Event Management & Host Guidelines",
        content:
          "Event organizers must ensure that all published event agendas, guest speaker details, and venue schedules are accurate and adhere to campus safety guidelines.",
      },
      {
        heading: "4. Limitation of Liability",
        content:
          "CampusPulse provides scheduling and feedback tools on an 'as-is' basis and is not liable for event cancellations caused by weather, external speakers, or unforeseen college administration directives.",
      },
    ],
  },
  "cookie-policy": {
    title: "Cookie Policy",
    lastUpdated: "August 2026",
    category: "Privacy & Tracking",
    summary:
      "Learn about the cookies and local storage tokens we use to keep you logged in and optimize your experience.",
    sections: [
      {
        heading: "1. Essential Session Cookies",
        content:
          "We use HTTP-only, secure NextAuth session tokens to maintain your authentication state, protect against CSRF attacks, and verify user permissions across pages.",
      },
      {
        heading: "2. Performance & Preference Storage",
        content:
          "Local storage is used to remember your dark/light theme preferences and cookie consent status across browser sessions without tracking external browsing activity.",
      },
      {
        heading: "3. Managing Your Cookies",
        content:
          "You can configure or revoke cookie preferences at any time via our interactive Cookie Preferences modal or browser settings.",
      },
    ],
  },
  "cancellation-policy": {
    title: "Event RSVP & Cancellation Policy",
    lastUpdated: "August 2026",
    category: "Campus Events",
    summary:
      "Guidelines for RSVP cancellations by student attendees and schedule modifications or postponements by organizers.",
    sections: [
      {
        heading: "1. Student RSVP Cancellation",
        content:
          "Students may cancel their event registrations at any time through the event page to release limited seats for waitlisted peers.",
      },
      {
        heading: "2. Organizer Cancellation & Rescheduling",
        content:
          "If an organizer must cancel or postpone a campus event, instant notifications are broadcast to all registered participants, and attendance rosters are adjusted automatically.",
      },
      {
        heading: "3. Waitlist Progression",
        content:
          "When a registered student cancels their ticket, the system automatically promotes the next student on the waitlist and sends them an instant RSVP confirmation.",
      },
    ],
  },
  "disclaimer": {
    title: "Disclaimer",
    lastUpdated: "August 2026",
    category: "Legal Disclosures",
    summary:
      "General liability disclaimers regarding student-submitted feedback and external speaker views.",
    sections: [
      {
        heading: "1. Speaker & Participant Views",
        content:
          "Opinions expressed by keynote speakers, panelists, or students during Q&A sessions do not necessarily represent the official stance of the university administration.",
      },
      {
        heading: "2. Schedule & Venue Adjustments",
        content:
          "Organizers reserve the right to modify speaker line-ups or assign alternate lecture halls when required for logistics.",
      },
    ],
  },
  "accessibility-statement": {
    title: "Accessibility Statement",
    lastUpdated: "August 2026",
    category: "Universal Access",
    summary:
      "Our commitment to providing an inclusive, accessible digital platform for all campus members.",
    sections: [
      {
        heading: "1. WCAG 2.1 AA Compliance",
        content:
          "CampusPulse is built adhering to Web Content Accessibility Guidelines (WCAG) 2.1 Level AA, featuring high-contrast color palettes, readable typography, and screen-reader accessible ARIA labels.",
      },
      {
        heading: "2. Keyboard Navigation",
        content:
          "All interactive components including feedback rating selectors, modal builders, and media players are fully navigable using keyboard shortcuts and tab order.",
      },
    ],
  },
  "data-processing-agreement": {
    title: "Data Processing Agreement (DPA)",
    lastUpdated: "August 2026",
    category: "Institutional Compliance",
    summary:
      "Governing student data processing for academic departments, colleges, and audit authorities.",
    sections: [
      {
        heading: "1. Scope & Purpose",
        content:
          "This Agreement outlines data processing standards in compliance with FERPA and relevant regional data protection frameworks.",
      },
      {
        heading: "2. Security & Sub-Processors",
        content:
          "CampusPulse does not sell student data. All storage is maintained on ISO 27001 / SOC2 certified MongoDB Atlas cloud infrastructure with dedicated tenant isolation.",
      },
    ],
  },
  "acceptable-use-policy": {
    title: "Acceptable Use Policy",
    lastUpdated: "August 2026",
    category: "Community Standards",
    summary:
      "Prohibited behaviors and rules for maintaining a safe digital environment.",
    sections: [
      {
        heading: "1. Prohibited Content",
        content:
          "Users may not upload obscene, hateful, defamatory, or copyright-infringing media, nor submit spam feedback responses.",
      },
      {
        heading: "2. System Abuse",
        content:
          "Automated scraping, denial of service attacks, or unauthorized penetration testing of the platform is strictly prohibited.",
      },
    ],
  },
  "security-policy": {
    title: "Security Policy",
    lastUpdated: "August 2026",
    category: "Information Security",
    summary:
      "Comprehensive overview of our technical, administrative, and physical security controls.",
    sections: [
      {
        heading: "1. Infrastructure Security",
        content:
          "Our servers enforce HTTPS encryption with TLS 1.3, strict Content Security Policies (CSP), and automated DDoS mitigation.",
      },
      {
        heading: "2. Access Control",
        content:
          "Administrative functions require verified role permissions and session authorization checks at both middleware and API layer.",
      },
    ],
  },
  "responsible-disclosure": {
    title: "Responsible Disclosure",
    lastUpdated: "August 2026",
    category: "Security Research",
    summary:
      "Guidelines for security researchers to responsibly report vulnerabilities.",
    sections: [
      {
        heading: "1. Reporting Procedure",
        content:
          "If you discover a security vulnerability, please report it privately to security@campuspulse.dev with proof of concept and replication steps.",
      },
      {
        heading: "2. Safe Harbor",
        content:
          "We will not pursue legal action against researchers who act in good faith, avoid data destruction, and give reasonable time to patch issues before public disclosure.",
      },
    ],
  },
  "community-guidelines": {
    title: "Community Guidelines",
    lastUpdated: "August 2026",
    category: "Campus Culture",
    summary:
      "Fostering an inclusive, respectful, and supportive campus event ecosystem.",
    sections: [
      {
        heading: "1. Respect & Inclusion",
        content:
          "Treat all peers, organizers, faculty, and guests with mutual respect. Constructive feedback in surveys is encouraged; targeted harassment will lead to account suspension.",
      },
      {
        heading: "2. Academic Integrity",
        content:
          "Honest participation in event check-ins and hackathon submissions maintains the value of campus achievements for everyone.",
      },
    ],
  },
};

export default async function LegalDocumentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const policy = policyDetails[slug];

  if (!policy) notFound();

  return (
    <div className="min-h-screen gradient-mesh py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link
          href="/legal"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Trust & Legal Center
        </Link>

        {/* Header Banner */}
        <div className="glass-card p-8 rounded-2xl border space-y-3">
          <div className="flex items-center gap-2">
            <span className="badge badge-primary text-xs font-semibold">
              {policy.category}
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Last Updated: {policy.lastUpdated}
            </span>
          </div>
          <h1
            className="text-3xl font-extrabold text-foreground"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            {policy.title}
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {policy.summary}
          </p>
        </div>

        {/* Policy Content Sections */}
        <div className="space-y-6">
          {policy.sections.map((sec, idx) => (
            <div
              key={idx}
              className="glass-card p-6 rounded-xl border space-y-2"
              style={{ borderColor: "hsl(var(--border))" }}
            >
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary" /> {sec.heading}
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed pl-6">
                {sec.content}
              </p>
            </div>
          ))}
        </div>

        {/* Questions & Contact */}
        <div className="glass-card p-6 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <HelpCircle className="w-6 h-6 text-primary flex-shrink-0" />
            <div>
              <p className="font-semibold text-foreground">Have questions regarding this policy?</p>
              <p className="text-muted-foreground">Our institutional compliance team is here to assist.</p>
            </div>
          </div>
          <a
            href="mailto:legal@campuspulse.dev"
            className="btn-secondary py-2 px-4 whitespace-nowrap"
          >
            Contact Legal Team
          </a>
        </div>
      </div>
    </div>
  );
}
