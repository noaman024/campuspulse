import mongoose, { Schema, Document } from "mongoose";

export interface ILinkItem {
  label: string;
  href: string;
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
