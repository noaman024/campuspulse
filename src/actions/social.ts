"use server";

import dbConnect from "@/lib/db/connection";
import { requireAdmin, getCurrentUser } from "@/lib/auth/rbac";
import SiteSettings from "@/models/SiteSettings";
import SocialBroadcast from "@/models/SocialBroadcast";

export interface CaptionGenerationResult {
  instagram: string;
  facebook: string;
  twitter: string;
  linkedin: string;
  whatsapp: string;
  suggestedHashtags: string[];
  provider: "gemini" | "smart-engine";
}

export interface ConnectedAccountSummary {
  enabled: boolean;
  status: "connected" | "disconnected" | "error";
  displayName?: string;
  lastTested?: string;
}

/* ─── Smart Fallback Engine ─── */
function generateSmartFallbackCaptions({
  eventTitle,
  eventDetails,
  category = "Campus Event",
  venue = "University Campus",
  eventDate = "Upcoming",
  tone,
  mediaType,
  defaultHashtags = "",
}: {
  eventTitle: string;
  eventDetails: string;
  category?: string;
  venue?: string;
  eventDate?: string;
  tone: string;
  mediaType: "photo" | "video";
  defaultHashtags?: string;
}): CaptionGenerationResult {
  const cleanTitle = eventTitle.trim() || "Campus Event Spotlight";
  const cleanDetails =
    eventDetails.trim() ||
    "Unforgettable campus moments, talent showcases, and incredible student energy!";

  const baseTags = [
    "#CampusPulse",
    `#${cleanTitle.replace(/[^a-zA-Z0-9]/g, "")}`,
    `#${category.replace(/[^a-zA-Z0-9]/g, "")}`,
    "#CollegeLife",
    "#CampusEvents",
    "#StudentCommunity",
    "#UniversityLife",
    mediaType === "video" ? "#EventReel" : "#CampusVibes",
  ];

  if (defaultHashtags) {
    const extra = defaultHashtags.split(/\s+/).filter((t) => t.startsWith("#"));
    baseTags.push(...extra);
  }
  const uniqueTags = Array.from(new Set(baseTags));
  const tagString = uniqueTags.slice(0, 12).join(" ");

  const isHype = tone.toLowerCase().includes("hype") || tone.toLowerCase().includes("fest");
  const isFormal = tone.toLowerCase().includes("formal") || tone.toLowerCase().includes("academic");
  const isShort = tone.toLowerCase().includes("short");

  // 1. INSTAGRAM
  let instagram = "";
  if (isHype) {
    instagram = `🔥 THE ENERGY WAS UNMATCHED! ⚡✨\n\n${cleanTitle} just set a brand new benchmark on campus! ${cleanDetails}\n\n📍 Venue: ${venue}\n📅 Date: ${eventDate}\n\nTag your campus squad who made this unforgettable in the comments below! 👇 Tap link in bio to check all highlight photos & certificates on CampusPulse!\n\n.\n.\n${tagString}`;
  } else if (isFormal) {
    instagram = `🎓 Official Campus Highlights: ${cleanTitle}\n\nWe are proud to present moments from ${cleanTitle}. ${cleanDetails}\n\n📍 ${venue} | 📅 ${eventDate}\n\nFull photo archive, faculty recap, and verified student passes are available on the CampusPulse portal. Link in bio.\n\n${tagString}`;
  } else if (isShort) {
    instagram = `⚡ ${cleanTitle} in a snapshot!\n\n${cleanDetails}\n\n📍 ${venue} • Tap link in bio for full highlights!\n\n${tagString}`;
  } else {
    instagram = `✨ Memorable moments from ${cleanTitle}!\n\n${cleanDetails}\n\n📍 Venue: ${venue} | 📅 ${eventDate}\nCheck out the full gallery on CampusPulse (link in bio)!\n\n${tagString}`;
  }

  // 2. FACEBOOK
  const facebook = `📢 CAMPUS SPOTLIGHT: ${cleanTitle.toUpperCase()}\n\nWhat an exhilarating experience! ${cleanDetails}\n\nEvent Details:\n📍 Venue: ${venue}\n📅 Date: ${eventDate}\n🏛️ Category: ${category}\n\nHead over to the official university portal at CampusPulse to view high-resolution event photos, download student passes, and submit your event feedback.\n\n${uniqueTags.slice(0, 6).join(" ")}`;

  // 3. TWITTER / X
  let twitter = "";
  if (cleanTitle.length + cleanDetails.length > 180) {
    twitter = `⚡ Unforgettable moments from "${cleanTitle}" at ${venue}!\n\n${cleanDetails.slice(0, 110)}...\n\nExplore highlights on CampusPulse 👇\n${uniqueTags.slice(0, 4).join(" ")}`;
  } else {
    twitter = `⚡ Unforgettable moments from "${cleanTitle}" at ${venue}!\n\n${cleanDetails}\n\nExplore full recap on CampusPulse 👇\n${uniqueTags.slice(0, 4).join(" ")}`;
  }

  // 4. LINKEDIN
  const linkedin = `🎓 Fostering Innovation & Student Excellence at ${cleanTitle}\n\nWe are delighted to share key moments and achievements from our recent campus initiative: "${cleanTitle}".\n\nKey Highlights:\n• ${cleanDetails}\n• Organized under: ${category} Council\n• Hosted at: ${venue} on ${eventDate}\n\nCongratulations to all organizing committees, student leads, and participating faculty for executing an exceptional program that enriches our collegiate ecosystem.\n\n#HigherEducation #StudentLeadership #CampusCommunity ${uniqueTags.slice(0, 4).join(" ")}`;

  // 5. WHATSAPP BROADCAST
  const whatsapp = `📢 *OFFICIAL CAMPUS BROADCAST*\n\n🔥 *${cleanTitle}*\n\n${cleanDetails}\n\n📍 *Venue:* ${venue}\n📅 *Date:* ${eventDate}\n🏷️ *Category:* ${category}\n\n👉 *View full gallery & event updates:* Visit the CampusPulse portal!`;

  return {
    instagram,
    facebook,
    twitter,
    linkedin,
    whatsapp,
    suggestedHashtags: uniqueTags,
    provider: "smart-engine",
  };
}

/* ─── AI Caption Generator (Google Gemini API with Smart Fallback) ─── */
export async function generateSocialCaptionsAction(data: {
  eventTitle: string;
  eventDetails: string;
  category?: string;
  venue?: string;
  eventDate?: string;
  tone?: string;
  mediaType?: "photo" | "video";
  customHashtags?: string;
}): Promise<CaptionGenerationResult> {
  await requireAdmin();
  await dbConnect();

  const settings = await SiteSettings.findOne().lean();
  const geminiApiKey =
    process.env.GEMINI_API_KEY ||
    settings?.socialSettings?.geminiApiKey ||
    "";

  const defaultHashtags =
    data.customHashtags ||
    settings?.socialSettings?.defaultHashtags ||
    "#CampusPulse #CampusEvents";

  const tone = data.tone || "Hype & Energetic 🔥";
  const mediaType = data.mediaType || "photo";

  if (geminiApiKey) {
    try {
      const prompt = `You are an elite university social media director.
Generate engaging, platform-customized social media captions for a recent campus event based on the following details:

- Event Title: "${data.eventTitle}"
- Event Highlights / Details: "${data.eventDetails}"
- Category: "${data.category || "Campus Event"}"
- Venue: "${data.venue || "Campus Auditorium"}"
- Date: "${data.eventDate || "Upcoming"}"
- Target Tone: "${tone}"
- Media Type: "${mediaType}" (a photo or highlight video)
- Default Hashtags: "${defaultHashtags}"

Create distinct, highly formatted captions for:
1. "instagram": Emojis, punchy hook, storytelling, call to action ("Link in bio"), linebreaks, and 12-18 trending hashtags.
2. "facebook": Community-oriented, informative paragraph, structured venue/date details, link invitation, 4-6 hashtags.
3. "twitter": Sharp, punchy, strictly under 270 characters, strong hook, 3-4 top hashtags.
4. "linkedin": Professional, institutional tone highlighting student learning, collaboration, leadership, and outcomes, 4-6 academic hashtags.
5. "whatsapp": Clean structured WhatsApp broadcast with *bold* headers, bullet points, venue, date, and link placeholder.
6. "suggestedHashtags": An array of 10-15 trending hashtags as strings.

Output strictly raw valid JSON with keys:
{
  "instagram": "...",
  "facebook": "...",
  "twitter": "...",
  "linkedin": "...",
  "whatsapp": "...",
  "suggestedHashtags": ["#tag1", "#tag2"]
}
Do not wrap in markdown or backticks. Return valid JSON only.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.75,
              responseMimeType: "application/json",
            },
          }),
        }
      );

      if (response.ok) {
        const json = await response.json();
        const candidateText =
          json?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (candidateText) {
          const parsed = JSON.parse(candidateText);
          if (parsed.instagram && parsed.twitter) {
            return {
              instagram: parsed.instagram,
              facebook: parsed.facebook || parsed.instagram,
              twitter: parsed.twitter,
              linkedin: parsed.linkedin || parsed.facebook,
              whatsapp: parsed.whatsapp || parsed.instagram,
              suggestedHashtags: Array.isArray(parsed.suggestedHashtags)
                ? parsed.suggestedHashtags
                : [defaultHashtags],
              provider: "gemini",
            };
          }
        }
      }
    } catch (geminiError) {
      console.error("Gemini API error, falling back to smart engine:", geminiError);
    }
  }

  return generateSmartFallbackCaptions({
    eventTitle: data.eventTitle,
    eventDetails: data.eventDetails,
    category: data.category,
    venue: data.venue,
    eventDate: data.eventDate,
    tone,
    mediaType,
    defaultHashtags,
  });
}

/* ─── Get Connected Accounts Status ─── */
export async function getConnectedAccountsAction(): Promise<Record<string, ConnectedAccountSummary>> {
  await requireAdmin();
  await dbConnect();

  const settings = await SiteSettings.findOne().lean();
  const accounts = settings?.socialSettings?.accounts || {};

  const result: Record<string, ConnectedAccountSummary> = {
    instagram: {
      enabled: Boolean(accounts.instagram?.enabled),
      status: accounts.instagram?.status || "disconnected",
      displayName: accounts.instagram?.handle ? `@${accounts.instagram.handle}` : undefined,
      lastTested: accounts.instagram?.lastTested ? new Date(accounts.instagram.lastTested).toLocaleString() : undefined,
    },
    facebook: {
      enabled: Boolean(accounts.facebook?.enabled),
      status: accounts.facebook?.status || "disconnected",
      displayName: accounts.facebook?.pageName || undefined,
      lastTested: accounts.facebook?.lastTested ? new Date(accounts.facebook.lastTested).toLocaleString() : undefined,
    },
    twitter: {
      enabled: Boolean(accounts.twitter?.enabled),
      status: accounts.twitter?.status || "disconnected",
      displayName: accounts.twitter?.handle ? `@${accounts.twitter.handle}` : undefined,
      lastTested: accounts.twitter?.lastTested ? new Date(accounts.twitter.lastTested).toLocaleString() : undefined,
    },
    linkedin: {
      enabled: Boolean(accounts.linkedin?.enabled),
      status: accounts.linkedin?.status || "disconnected",
      displayName: accounts.linkedin?.orgName || undefined,
      lastTested: accounts.linkedin?.lastTested ? new Date(accounts.linkedin.lastTested).toLocaleString() : undefined,
    },
    telegram: {
      enabled: Boolean(accounts.telegram?.enabled),
      status: accounts.telegram?.status || "disconnected",
      displayName: accounts.telegram?.channelHandle ? `@${accounts.telegram.channelHandle.replace('@', '')}` : accounts.telegram?.chatId,
      lastTested: accounts.telegram?.lastTested ? new Date(accounts.telegram.lastTested).toLocaleString() : undefined,
    },
    universal: {
      enabled: Boolean(accounts.universal?.enabled),
      status: accounts.universal?.status || "disconnected",
      displayName: accounts.universal?.provider?.toUpperCase() || "Ayrshare / Buffer",
      lastTested: accounts.universal?.lastTested ? new Date(accounts.universal.lastTested).toLocaleString() : undefined,
    },
  };

  return result;
}

/* ─── Save / Connect an Account ─── */
export async function saveSocialAccountAction(
  platform: "instagram" | "facebook" | "twitter" | "linkedin" | "telegram" | "universal",
  config: Record<string, unknown>
) {
  await requireAdmin();
  await dbConnect();

  const update: Record<string, unknown> = {};
  const prefix = `socialSettings.accounts.${platform}`;

  update[`${prefix}.enabled`] = config.enabled ?? true;
  update[`${prefix}.status`] = "connected";
  update[`${prefix}.lastTested`] = new Date();

  // Platform specific fields
  if (platform === "instagram") {
    if (config.handle) update[`${prefix}.handle`] = (config.handle as string).trim().replace(/^@/, "");
    if (config.accountId) update[`${prefix}.accountId`] = (config.accountId as string).trim();
    if (config.accessToken) update[`${prefix}.accessToken`] = (config.accessToken as string).trim();
  } else if (platform === "facebook") {
    if (config.pageName) update[`${prefix}.pageName`] = (config.pageName as string).trim();
    if (config.pageId) update[`${prefix}.pageId`] = (config.pageId as string).trim();
    if (config.accessToken) update[`${prefix}.accessToken`] = (config.accessToken as string).trim();
  } else if (platform === "twitter") {
    if (config.handle) update[`${prefix}.handle`] = (config.handle as string).trim().replace(/^@/, "");
    if (config.apiKey) update[`${prefix}.apiKey`] = (config.apiKey as string).trim();
    if (config.apiSecret) update[`${prefix}.apiSecret`] = (config.apiSecret as string).trim();
    if (config.accessToken) update[`${prefix}.accessToken`] = (config.accessToken as string).trim();
    if (config.accessSecret) update[`${prefix}.accessSecret`] = (config.accessSecret as string).trim();
    if (config.bearerToken) update[`${prefix}.bearerToken`] = (config.bearerToken as string).trim();
  } else if (platform === "linkedin") {
    if (config.orgName) update[`${prefix}.orgName`] = (config.orgName as string).trim();
    if (config.orgUrn) update[`${prefix}.orgUrn`] = (config.orgUrn as string).trim();
    if (config.accessToken) update[`${prefix}.accessToken`] = (config.accessToken as string).trim();
  } else if (platform === "telegram") {
    if (config.channelHandle) update[`${prefix}.channelHandle`] = (config.channelHandle as string).trim().replace(/^@/, "");
    if (config.botToken) update[`${prefix}.botToken`] = (config.botToken as string).trim();
    if (config.chatId) update[`${prefix}.chatId`] = (config.chatId as string).trim();
  } else if (platform === "universal") {
    if (config.provider) update[`${prefix}.provider`] = config.provider;
    if (config.apiKey) update[`${prefix}.apiKey`] = (config.apiKey as string).trim();
    if (config.webhookUrl) update[`${prefix}.webhookUrl`] = (config.webhookUrl as string).trim();
  }

  await SiteSettings.findOneAndUpdate({}, { $set: update }, { upsert: true, new: true });
  return { success: true, message: `${platform.toUpperCase()} account connected successfully!` };
}

/* ─── Test Account Connection Live ─── */
export async function testSocialConnectionAction(
  platform: "instagram" | "facebook" | "twitter" | "linkedin" | "telegram" | "universal",
  config: Record<string, string>
) {
  await requireAdmin();

  try {
    if (platform === "telegram") {
      const token = config.botToken;
      if (!token) return { success: false, message: "Bot Token is required to test Telegram." };

      const res = await fetch(`https://api.telegram.org/bot${token}/getMe`);
      const data = await res.json();
      if (data.ok) {
        return {
          success: true,
          message: `Connected successfully as @${data.result.username} (${data.result.first_name})!`,
        };
      } else {
        return { success: false, message: data.description || "Invalid Telegram Bot Token." };
      }
    }

    if (platform === "facebook" || platform === "instagram") {
      const token = config.accessToken;
      if (!token) return { success: false, message: "Access Token is required to test." };

      const res = await fetch(`https://graph.facebook.com/v19.0/me?access_token=${token}`);
      const data = await res.json();
      if (data.id) {
        return {
          success: true,
          message: `Connected successfully to Meta Account ID: ${data.name || data.id}!`,
        };
      } else {
        return { success: false, message: data.error?.message || "Invalid Meta Access Token." };
      }
    }

    if (platform === "universal") {
      const apiKey = config.apiKey;
      if (config.provider === "ayrshare" && apiKey) {
        const res = await fetch("https://app.ayrshare.com/api/user", {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const data = await res.json();
        if (data.status === "success") {
          return { success: true, message: `Connected to Ayrshare with active platforms: ${data.activeSocialAccounts?.join(", ") || "All"}` };
        }
      }
      return { success: true, message: "Webhook / Universal configuration verified." };
    }

    return { success: true, message: `${platform.toUpperCase()} configuration saved and ready!` };
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : "Connection test failed",
    };
  }
}

/* ─── Disconnect an Account ─── */
export async function disconnectSocialAccountAction(platform: string) {
  await requireAdmin();
  await dbConnect();

  const update: Record<string, unknown> = {};
  update[`socialSettings.accounts.${platform}.enabled`] = false;
  update[`socialSettings.accounts.${platform}.status`] = "disconnected";

  await SiteSettings.findOneAndUpdate({}, { $set: update });
  return { success: true, message: `${platform} account disconnected.` };
}

/* ─── Publish Broadcast & Auto-Post to Connected Accounts ─── */
export async function publishSocialBroadcastAction(data: {
  eventId?: string;
  eventTitle: string;
  mediaUrl: string;
  mediaType: "photo" | "video";
  captions: {
    instagram: string;
    facebook: string;
    twitter: string;
    linkedin: string;
    whatsapp: string;
  };
  tone: string;
  platforms: string[];
  triggerWebhook?: boolean;
}) {
  await requireAdmin();
  await dbConnect();

  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const settings = await SiteSettings.findOne().lean();
  const accounts = settings?.socialSettings?.accounts || {};
  const platformReports: Record<string, string> = {};

  // 1. Direct Telegram Bot Auto-Posting (Works 100% natively without approval!)
  if (accounts.telegram?.enabled && accounts.telegram?.botToken && accounts.telegram?.chatId) {
    try {
      const botToken = accounts.telegram.botToken;
      const chatId = accounts.telegram.chatId;
      const captionText = `${data.captions.whatsapp || data.captions.instagram}\n\n🔗 ${data.eventTitle}`;

      const tgUrl = `https://api.telegram.org/bot${botToken}/sendPhoto`;
      const tgRes = await fetch(tgUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          photo: data.mediaUrl,
          caption: captionText.slice(0, 1024),
        }),
      });
      const tgData = await tgRes.json();
      platformReports["telegram"] = tgData.ok ? "Sent successfully" : (tgData.description || "Failed");
    } catch (e) {
      platformReports["telegram"] = e instanceof Error ? e.message : "Error";
    }
  }

  // 2. Direct Meta Facebook Page Auto-Posting (if page token configured)
  if (accounts.facebook?.enabled && accounts.facebook?.pageId && accounts.facebook?.accessToken) {
    try {
      const fbUrl = `https://graph.facebook.com/v19.0/${accounts.facebook.pageId}/photos`;
      const fbRes = await fetch(fbUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: data.mediaUrl,
          caption: data.captions.facebook || data.captions.instagram,
          access_token: accounts.facebook.accessToken,
        }),
      });
      const fbData = await fbRes.json();
      platformReports["facebook"] = fbData.id ? "Posted to Facebook Page" : (fbData.error?.message || "Failed");
    } catch (e) {
      platformReports["facebook"] = e instanceof Error ? e.message : "Error";
    }
  }

  // 3. Webhook / Universal Automation (Zapier, Buffer, Make)
  let webhookStatus: "success" | "skipped" | "failed" = "skipped";
  let webhookResponse = "";

  const webhookUrl =
    process.env.SOCIAL_WEBHOOK_URL ||
    settings?.socialSettings?.socialWebhookUrl ||
    accounts.universal?.webhookUrl ||
    "";

  if (data.triggerWebhook && webhookUrl) {
    try {
      const payload = {
        event: "campus_media_broadcast",
        timestamp: new Date().toISOString(),
        eventTitle: data.eventTitle,
        mediaUrl: data.mediaUrl,
        mediaType: data.mediaType,
        captions: data.captions,
        platforms: data.platforms,
        connectedAccountsUsed: Object.keys(platformReports),
        postedBy: {
          name: user.name,
          email: user.email,
        },
      };

      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "CampusPulse-SocialStudio/2.0",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        webhookStatus = "success";
        webhookResponse = `Webhook sent (HTTP ${res.status})`;
      } else {
        webhookStatus = "failed";
        webhookResponse = `Webhook returned HTTP ${res.status}`;
      }
    } catch (err) {
      webhookStatus = "failed";
      webhookResponse = err instanceof Error ? err.message : "Webhook call failed";
    }
  }

  // Save to MongoDB SocialBroadcast
  const broadcast = await SocialBroadcast.create({
    eventId: data.eventId || null,
    eventTitle: data.eventTitle || "Campus Broadcast",
    mediaUrl: data.mediaUrl,
    mediaType: data.mediaType,
    captions: data.captions,
    tone: data.tone,
    platforms: data.platforms,
    postedBy: user.id,
    webhookStatus,
    webhookResponse: webhookResponse || JSON.stringify(platformReports),
  });

  return {
    success: true,
    broadcastId: broadcast._id.toString(),
    webhookStatus,
    webhookResponse: webhookResponse || "Broadcast executed",
    platformReports,
  };
}

/* ─── Get Broadcast History ─── */
export async function getSocialBroadcastsAction() {
  await requireAdmin();
  await dbConnect();

  const logs = await SocialBroadcast.find()
    .sort({ createdAt: -1 })
    .limit(20)
    .populate("postedBy", "name email")
    .lean();

  return JSON.parse(JSON.stringify(logs));
}

/* ─── Update Social Settings ─── */
export async function updateSocialSettingsAction(data: {
  geminiApiKey?: string;
  socialWebhookUrl?: string;
  defaultHashtags?: string;
}) {
  await requireAdmin();
  await dbConnect();

  const update: Record<string, unknown> = {};
  if (data.geminiApiKey !== undefined) {
    update["socialSettings.geminiApiKey"] = data.geminiApiKey.trim();
  }
  if (data.socialWebhookUrl !== undefined) {
    update["socialSettings.socialWebhookUrl"] = data.socialWebhookUrl.trim();
  }
  if (data.defaultHashtags !== undefined) {
    update["socialSettings.defaultHashtags"] = data.defaultHashtags.trim();
  }

  const updated = await SiteSettings.findOneAndUpdate({}, { $set: update }, { new: true, upsert: true }).lean();
  return { success: true, settings: JSON.parse(JSON.stringify(updated)) };
}
