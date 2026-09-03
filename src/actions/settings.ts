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
};

export async function getSiteSettings() {
  try {
    await dbConnect();
    let settings = await SiteSettings.findOne().lean();
    if (!settings) {
      settings = await SiteSettings.create(DEFAULT_SETTINGS);
      settings = settings.toObject();
    }
    return JSON.parse(JSON.stringify(settings));
  } catch (err) {
    console.error("Failed to get site settings, using defaults:", err);
    return DEFAULT_SETTINGS;
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
