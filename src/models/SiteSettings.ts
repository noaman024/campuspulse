import mongoose, { Schema, Document } from "mongoose";

export interface ILinkItem {
  label: string;
  href: string;
}

export interface ICreatorMember {
  id: string;
  name: string;
  role: string;
  department?: string;
  college?: string;
  bio?: string;
  avatarUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  email?: string;
  portfolioUrl?: string;
  highlights?: string[];
}

export interface ISupportMember {
  id: string;
  name: string;
  role: string;
  department?: string;
  avatarUrl?: string;
  email?: string;
  phone?: string;
  linkedinUrl?: string;
  notes?: string;
}

export interface IAboutSettings {
  badge?: string;
  title?: string;
  subtitle?: string;
  projectStory?: string;
  techStack?: string[];
  creators: ICreatorMember[];
  supportMembers?: ISupportMember[];
}

export interface ISiteSettings extends Document {
  siteName: string;
  tagline: string;
  description: string;
  officeName: string;
  officeLocation: string;
  contactEmail: string;
  contactPhone?: string;
  departments: ILinkItem[];
  portalLinks: ILinkItem[];
  policyLinks: ILinkItem[];
  copyrightText: string;
  councilNote: string;
  aboutSettings?: IAboutSettings;
  socialSettings?: {
    geminiApiKey?: string;
    socialWebhookUrl?: string;
    defaultHashtags?: string;
    accounts?: {
      instagram?: {
        enabled: boolean;
        status: "connected" | "disconnected" | "error";
        handle?: string;
        accountId?: string;
        accessToken?: string;
        lastTested?: Date;
      };
      facebook?: {
        enabled: boolean;
        status: "connected" | "disconnected" | "error";
        pageName?: string;
        pageId?: string;
        accessToken?: string;
        lastTested?: Date;
      };
      twitter?: {
        enabled: boolean;
        status: "connected" | "disconnected" | "error";
        handle?: string;
        apiKey?: string;
        apiSecret?: string;
        accessToken?: string;
        accessSecret?: string;
        bearerToken?: string;
        lastTested?: Date;
      };
      linkedin?: {
        enabled: boolean;
        status: "connected" | "disconnected" | "error";
        orgName?: string;
        orgUrn?: string;
        accessToken?: string;
        lastTested?: Date;
      };
      telegram?: {
        enabled: boolean;
        status: "connected" | "disconnected" | "error";
        channelHandle?: string;
        botToken?: string;
        chatId?: string;
        lastTested?: Date;
      };
      universal?: {
        enabled: boolean;
        status: "connected" | "disconnected" | "error";
        provider?: "ayrshare" | "buffer" | "webhook";
        apiKey?: string;
        webhookUrl?: string;
        lastTested?: Date;
      };
    };
  };
  updatedAt: Date;
}

const LinkItemSchema = new Schema<ILinkItem>(
  {
    label: { type: String, required: true },
    href: { type: String, required: true, default: "#" },
  },
  { _id: false }
);

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    siteName: { type: String, default: "CampusPulse" },
    tagline: { type: String, default: "SMART CAMPUS HUB" },
    description: {
      type: String,
      default:
        "Official university event management system for symposiums, hackathons, cultural fests, sports meets, and verified digital entry passes.",
    },
    officeName: { type: String, default: "Office of Student Affairs" },
    officeLocation: { type: String, default: "Main Academic Block, North Campus" },
    contactEmail: { type: String, default: "events@campuspulse.edu" },
    contactPhone: { type: String, default: "+91 98765 43210" },
    departments: {
      type: [LinkItemSchema],
      default: [
        { label: "Computer Science & Engg", href: "/events?search=Computer" },
        { label: "Information Technology", href: "/events?search=Information" },
        { label: "Mechanical Engineering", href: "/events?search=Mechanical" },
        { label: "Cultural Council", href: "/events?category=Cultural" },
      ],
    },
    portalLinks: {
      type: [LinkItemSchema],
      default: [
        { label: "All Events", href: "/events" },
        { label: "Feedback Forms", href: "/portal/feedback" },
        { label: "Live Q&A", href: "/portal/qna" },
        { label: "Student Login", href: "/login" },
        { label: "About Us", href: "/about" },
      ],
    },
    policyLinks: {
      type: [LinkItemSchema],
      default: [
        { label: "Privacy Policy", href: "/legal/privacy-policy" },
        { label: "Terms of Service", href: "/legal/terms-of-service" },
        { label: "Code of Conduct", href: "/legal/community-guidelines" },
        { label: "Help & FAQs", href: "/help" },
      ],
    },
    copyrightText: {
      type: String,
      default: "CampusPulse. All rights reserved. University Event Portal.",
    },
    councilNote: {
      type: String,
      default: "Student Affairs & Technical Council",
    },
    aboutSettings: {
      type: Schema.Types.Mixed,
      default: {
        badge: "PROJECT DEVELOPERS & ARCHITECTS",
        title: "Meet the Creators Behind CampusPulse",
        subtitle: "Built with passion by university engineering students for modern, paperless campus events.",
        projectStory: "CampusPulse was engineered to solve real campus challenges — replacing manual registration queues, physical paper tickets, and fragmented feedback with an all-in-one digital platform featuring instant QR verification, interactive live Q&A, and direct event media showcases.",
        techStack: [
          "Next.js 16 (App Router)",
          "TypeScript",
          "Tailwind CSS v4",
          "MongoDB & Mongoose",
          "NextAuth.js",
          "Framer Motion",
          "Capacitor Android Native",
        ],
        creators: [
          {
            id: "creator-1",
            name: "Mohd Noaman",
            role: "Lead Full-Stack Developer & Project Architect",
            department: "Dept. of Computer Science & Engineering",
            college: "P. R. Pote Patil College of Engineering, Amravati",
            bio: "Passionate engineer specializing in full-stack architecture, building intuitive, modern web apps and high-performance digital systems for educational institutions.",
            avatarUrl: "",
            githubUrl: "https://github.com/noaman024",
            linkedinUrl: "",
            email: "mdnoaman024@gmail.com",
            portfolioUrl: "",
            highlights: ["System Architecture", "Next.js & React 19", "MongoDB Database", "Capacitor Mobile APK"],
          },
        ],
        supportMembers: [
          {
            id: "support-1",
            name: "Student Technical Council",
            role: "Campus Ambassador & Technical Support",
            department: "Computer Science & Engineering",
            avatarUrl: "",
            email: "support@campuspulse.edu",
            phone: "+91 98765 43210",
            linkedinUrl: "",
            notes: "Assisting students with event queries, ticket verification, and digital feedback.",
          },
        ],
      },
    },
    socialSettings: {
      geminiApiKey: { type: String, default: "" },
      socialWebhookUrl: { type: String, default: "" },
      defaultHashtags: { type: String, default: "#CampusPulse #CollegeLife #CampusEvents #University" },
      accounts: {
        type: Schema.Types.Mixed,
        default: {},
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.SiteSettings ||
  mongoose.model<ISiteSettings>("SiteSettings", SiteSettingsSchema);
