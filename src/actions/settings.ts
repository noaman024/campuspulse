"use server";

import dbConnect from "@/lib/db/connection";
import SiteSettings, { ISiteSettings } from "@/models/SiteSettings";
import { requireAdmin } from "@/lib/auth/rbac";
import { revalidatePath } from "next/cache";

const DEFAULT_SETTINGS = {
  siteName: "CampusPulse",
  tagline: "SMART CAMPUS HUB",
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
  aboutSettings: {
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
  },
};

export async function getSiteSettings() {
  try {
    await dbConnect();
    let settings = await SiteSettings.findOne().lean();
    if (!settings) {
      settings = await SiteSettings.create(DEFAULT_SETTINGS);
      settings = settings.toObject();
    }
    // Ensure aboutSettings is populated if DB document was created before this feature
    if (!settings.aboutSettings) {
      settings.aboutSettings = DEFAULT_SETTINGS.aboutSettings;
    }
    return JSON.parse(JSON.stringify(settings));
  } catch (err) {
    console.error("Failed to get site settings, using defaults:", err);
    return DEFAULT_SETTINGS;
  }
}

export async function getAboutSettings() {
  try {
    await dbConnect();
    const settings = await SiteSettings.findOne().select("aboutSettings").lean();
    if (settings && settings.aboutSettings) {
      return JSON.parse(JSON.stringify(settings.aboutSettings));
    }
    return DEFAULT_SETTINGS.aboutSettings;
  } catch (err) {
    console.error("Failed to get about settings:", err);
    return DEFAULT_SETTINGS.aboutSettings;
  }
}

export async function updateSiteSettings(data: Partial<ISiteSettings>) {
  await requireAdmin();
  await dbConnect();

  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = new SiteSettings({ ...DEFAULT_SETTINGS, ...data });
    } else {
      Object.assign(settings, data);
    }
    await settings.save();

    revalidatePath("/", "layout");
    revalidatePath("/about");
    revalidatePath("/admin/settings");

    return {
      success: true,
      message: "Site settings updated successfully!",
      settings: JSON.parse(JSON.stringify(settings)),
    };
  } catch (err) {
    console.error("Error updating site settings:", err);
    throw new Error(
      err instanceof Error ? err.message : "Failed to update site settings"
    );
  }
}
