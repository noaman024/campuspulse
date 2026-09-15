import Link from "next/link";
import {
  Shield,
  FileText,
  Cookie,
  XCircle,
  AlertTriangle,
  Eye,
  Database,
  CheckSquare,
  Lock,
  Bug,
  Users,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export const legalDocuments = [
  {
    slug: "privacy-policy",
    title: "Privacy Policy",
    icon: Shield,
    category: "Privacy & Data",
    description:
      "How CampusPulse collects, uses, encrypts, and protects your personal and academic information.",
  },
  {
    slug: "terms-of-service",
    title: "Terms of Service",
    icon: FileText,
    category: "Legal Agreements",
    description:
      "The terms and conditions governing student, faculty, and administrator usage of our platform.",
  },
  {
    slug: "cookie-policy",
    title: "Cookie Policy",
    icon: Cookie,
    category: "Privacy & Data",
    description:
      "Details regarding essential, analytical, and preference cookies utilized across the application.",
  },
  {
    slug: "cancellation-policy",
    title: "Event RSVP & Cancellation Policy",
    icon: XCircle,
    category: "Campus Events",
    description:
      "Rules regarding student RSVP cancellations, event rescheduling, and organizer updates.",
  },
  {
    slug: "disclaimer",
    title: "Disclaimer",
    icon: AlertTriangle,
    category: "Legal Disclosures",
    description:
      "Platform liability limits, student feedback notices, and academic disclaimers.",
  },
  {
    slug: "accessibility-statement",
    title: "Accessibility Statement",
    icon: Eye,
    category: "Compliance",
    description:
      "Our commitment to WCAG 2.1 AA accessibility standards for screen readers and keyboard navigation.",
  },
  {
    slug: "data-processing-agreement",
    title: "Data Processing Agreement (DPA)",
    icon: Database,
    category: "Compliance",
    description:
      "Institutional data processing agreement tailored for universities, student bodies, and compliance officers.",
  },
  {
    slug: "acceptable-use-policy",
    title: "Acceptable Use Policy",
    icon: CheckSquare,
    category: "Compliance",
    description:
      "Prohibited behaviors, system integrity rules, and guidelines for publishing events and Q&A questions.",
  },
  {
    slug: "security-policy",
    title: "Security Policy",
    icon: Lock,
    category: "Security",
    description:
      "Infrastructure security measures, database encryption, SSL/TLS, and authentication protocols.",
  },
  {
    slug: "responsible-disclosure",
    title: "Responsible Disclosure",
    icon: Bug,
    category: "Security",
    description:
      "Vulnerability reporting guidelines and security research coordination for white-hat researchers.",
  },
  {
    slug: "community-guidelines",
    title: "Community Guidelines",
    icon: Users,
    category: "Community",
    description:
      "Code of conduct promoting respectful, inclusive, and collaborative interactions across campus.",
  },
];

export default function LegalIndexPage() {
  return (
    <div className="min-h-screen gradient-mesh py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CAMPUSPULSE TRUST & LEGAL CENTER</span>
          </div>
          <h1
            className="text-3xl sm:text-4xl font-extrabold text-foreground"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Policies, Terms & Institutional Compliance
          </h1>
          <p className="text-sm text-muted-foreground">
            Explore our platform guidelines, data protection standards, terms of service, and user safety policies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {legalDocuments.map((doc) => {
            const Icon = doc.icon;
            return (
              <Link
                key={doc.slug}
                href={`/legal/${doc.slug}`}
                className="glass-card p-6 rounded-2xl border transition-all duration-200 hover:border-primary/50 hover:shadow-lg flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="badge badge-primary text-[10px]">
                      {doc.category}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors">
                      {doc.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {doc.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t flex items-center justify-between text-xs font-semibold text-primary" style={{ borderColor: "hsl(var(--border))" }}>
                  <span>Read Full Policy</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
