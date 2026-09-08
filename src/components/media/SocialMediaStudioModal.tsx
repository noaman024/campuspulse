"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Sparkles,
  Share2,
  Copy,
  Check,
  Upload,
  Image as ImageIcon,
  Film,
  ExternalLink,
  RefreshCw,
  Eye,
  Send,
  Download,
  AlertCircle,
  HelpCircle,
  Clock,
  Layers,
  CheckCircle2,
  Settings,
  Link as LinkIcon,
} from "lucide-react";
import {
  generateSocialCaptionsAction,
  publishSocialBroadcastAction,
  getConnectedAccountsAction,
  CaptionGenerationResult,
  ConnectedAccountSummary,
} from "@/actions/social";
import { uploadMediaAction } from "@/actions/upload";
import ConnectedAccountsManager from "@/components/media/ConnectedAccountsManager";

interface EventItem {
  _id: string;
  title: string;
  slug?: string;
  category?: string;
  venue?: string;
  eventDate?: string;
  bannerUrl?: string;
  mediaGallery?: {
    photos?: string[];
    rawClips?: string[];
  };
}

interface SocialMediaStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  events: EventItem[];
  preselectedEventId?: string;
  preselectedMediaUrl?: string;
  preselectedMediaType?: "photo" | "video";
}

type SocialPlatform = "instagram" | "facebook" | "twitter" | "linkedin" | "whatsapp";

const PLATFORMS: { id: SocialPlatform; name: string; icon: string; color: string }[] = [
  { id: "instagram", name: "Instagram", icon: "📸", color: "from-pink-500 via-purple-500 to-amber-500" },
  { id: "facebook", name: "Facebook", icon: "📘", color: "from-blue-600 to-indigo-700" },
  { id: "twitter", name: "Twitter / X", icon: "🐦", color: "from-neutral-800 to-black" },
  { id: "linkedin", name: "LinkedIn", icon: "💼", color: "from-blue-700 to-sky-700" },
  { id: "whatsapp", name: "WhatsApp", icon: "💬", color: "from-emerald-500 to-green-600" },
];

const TONES = [
  { label: "🔥 Hype & Fest", value: "Hype & Energetic 🔥" },
  { label: "🎓 Formal & Academic", value: "Formal & Academic 🎓" },
  { label: "⚡ Short & Viral", value: "Short & Punchy ⚡" },
  { label: "🎉 Fun & Casual", value: "Fun & Casual 🎉" },
];

export default function SocialMediaStudioModal({
  isOpen,
  onClose,
  events,
  preselectedEventId,
  preselectedMediaUrl,
  preselectedMediaType = "photo",
}: SocialMediaStudioModalProps) {
  // Media Source State
  const [mediaSource, setMediaSource] = useState<"existing" | "custom">("existing");
  const [selectedEventId, setSelectedEventId] = useState<string>(preselectedEventId || "");
  const [selectedMediaUrl, setSelectedMediaUrl] = useState<string>(preselectedMediaUrl || "");
  const [mediaType, setMediaType] = useState<"photo" | "video">(preselectedMediaType);

  // Custom Upload State
  const [uploadingCustom, setUploadingCustom] = useState(false);
  const [customFilePreview, setCustomFilePreview] = useState<string>("");

  // Prompt / Details State
  const [customEventTitle, setCustomEventTitle] = useState<string>("");
  const [highlights, setHighlights] = useState<string>("");
  const [tone, setTone] = useState<string>("Hype & Energetic 🔥");

  // Captions State
  const [captions, setCaptions] = useState<Record<SocialPlatform, string>>({
    instagram: "",
    facebook: "",
    twitter: "",
    linkedin: "",
    whatsapp: "",
  });
  const [suggestedHashtags, setSuggestedHashtags] = useState<string[]>([]);
  const [activePlatform, setActivePlatform] = useState<SocialPlatform>("instagram");
  const [providerUsed, setProviderUsed] = useState<string>("");

  // UI States
  const [generating, setGenerating] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [previewMode, setPreviewMode] = useState<"mockup" | "editor">("editor");
  const [copied, setCopied] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);

  // Connected Accounts State
  const [connectedAccounts, setConnectedAccounts] = useState<Record<string, ConnectedAccountSummary>>({});
  const [showAccountsModal, setShowAccountsModal] = useState(false);

  const refreshAccounts = async () => {
    try {
      const data = await getConnectedAccountsAction();
      setConnectedAccounts(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    refreshAccounts();
  }, []);

  // Sync initial selection
  useEffect(() => {
    if (preselectedEventId) setSelectedEventId(preselectedEventId);
    if (preselectedMediaUrl) {
      setSelectedMediaUrl(preselectedMediaUrl);
      setCustomFilePreview(preselectedMediaUrl);
    }
    if (preselectedMediaType) setMediaType(preselectedMediaType);

    if (events.length > 0 && !selectedEventId) {
      setSelectedEventId(events[0]._id);
    }
  }, [preselectedEventId, preselectedMediaUrl, preselectedMediaType, events]);

  // Selected event object
  const activeEvent = events.find((e) => e._id === selectedEventId);

  // Auto-fill title when event changes
  useEffect(() => {
    if (activeEvent && mediaSource === "existing") {
      setCustomEventTitle(activeEvent.title);
      // Auto-pick first photo if no media selected yet
      if (!selectedMediaUrl) {
        const firstPhoto = activeEvent.mediaGallery?.photos?.[0] || activeEvent.bannerUrl || "";
        if (firstPhoto) setSelectedMediaUrl(firstPhoto);
      }
    }
  }, [activeEvent, mediaSource]);

  if (!isOpen) return null;

  // Handle custom file upload by admin
  const handleCustomFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith("video/");
    setMediaType(isVideo ? "video" : "photo");

    // Local object preview
    const localUrl = URL.createObjectURL(file);
    setCustomFilePreview(localUrl);

    setUploadingCustom(true);
    setStatusMessage({ text: "Uploading media to server...", type: "info" });

    try {
      const formData = new FormData();
      formData.append("file", file);

      let uploadedUrl = "";
      try {
        const res = await uploadMediaAction(formData);
        if (res.success && res.url) uploadedUrl = res.url;
      } catch {
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload failed");
        uploadedUrl = data.url;
      }

      setSelectedMediaUrl(uploadedUrl);
      setCustomFilePreview(uploadedUrl);
      setStatusMessage({ text: "Media uploaded successfully!", type: "success" });
    } catch (err) {
      setStatusMessage({ text: err instanceof Error ? err.message : "Upload failed", type: "error" });
    } finally {
      setUploadingCustom(false);
    }
  };

  // Generate captions using Gemini AI
  const handleGenerateCaptions = async () => {
    const eventTitleToUse = customEventTitle.trim() || activeEvent?.title || "Campus Spotlight";
    if (!eventTitleToUse) {
      setStatusMessage({ text: "Please enter or select an event title first.", type: "error" });
      return;
    }

    setGenerating(true);
    setStatusMessage(null);

    try {
      const res: CaptionGenerationResult = await generateSocialCaptionsAction({
        eventTitle: eventTitleToUse,
        eventDetails: highlights,
        category: activeEvent?.category,
        venue: activeEvent?.venue,
        eventDate: activeEvent?.eventDate
          ? new Date(activeEvent.eventDate).toLocaleDateString()
          : undefined,
        tone,
        mediaType,
      });

      setCaptions({
        instagram: res.instagram,
        facebook: res.facebook,
        twitter: res.twitter,
        linkedin: res.linkedin,
        whatsapp: res.whatsapp,
      });
      setSuggestedHashtags(res.suggestedHashtags || []);
      setProviderUsed(res.provider);

      setStatusMessage({
        text:
          res.provider === "gemini"
            ? "✨ Generated with Google Gemini AI!"
            : "⚡ Generated with Smart AI Engine (Add Gemini API key in Settings for deeper models)!",
        type: "success",
      });
    } catch (err) {
      setStatusMessage({
        text: err instanceof Error ? err.message : "Caption generation failed",
        type: "error",
      });
    } finally {
      setGenerating(false);
    }
  };

  // Copy current active caption
  const handleCopyCaption = () => {
    const text = captions[activePlatform];
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Launch platform with intent
  const handleLaunchPlatform = (plat: SocialPlatform) => {
    const text = encodeURIComponent(captions[plat]);
    const url = encodeURIComponent(window.location.origin);

    let launchUrl = "";
    if (plat === "whatsapp") {
      launchUrl = `https://api.whatsapp.com/send?text=${text}`;
    } else if (plat === "twitter") {
      launchUrl = `https://twitter.com/intent/tweet?text=${text}`;
    } else if (plat === "facebook") {
      launchUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`;
    } else if (plat === "linkedin") {
      launchUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
    } else if (plat === "instagram") {
      // Instagram web doesn't support pre-filling caption URL, so copy + open
      handleCopyCaption();
      window.open("https://instagram.com", "_blank");
      return;
    }

    if (launchUrl) {
      window.open(launchUrl, "_blank");
    }
  };

  // Publish to Webhook (Zapier / Buffer / Make / Meta API)
  const handlePublishWebhook = async () => {
    if (!selectedMediaUrl) {
      setStatusMessage({ text: "Please select or upload a media file first.", type: "error" });
      return;
    }

    setPublishing(true);
    setStatusMessage(null);

    try {
      const res = await publishSocialBroadcastAction({
        eventId: activeEvent?._id,
        eventTitle: customEventTitle.trim() || activeEvent?.title || "Campus Media Post",
        mediaUrl: selectedMediaUrl,
        mediaType,
        captions,
        tone,
        platforms: ["Instagram", "Facebook", "Twitter", "LinkedIn", "WhatsApp"],
        triggerWebhook: true,
      });

      if (res.webhookStatus === "success") {
        setStatusMessage({ text: "🚀 Broadcast posted to Webhook successfully!", type: "success" });
      } else if (res.webhookStatus === "skipped") {
        setStatusMessage({
          text: "Saved to Broadcast Log! (Configure your Webhook URL in Settings to auto-post to Buffer/Zapier).",
          type: "info",
        });
      } else {
        setStatusMessage({ text: `Webhook note: ${res.webhookResponse}`, type: "info" });
      }
    } catch (err) {
      setStatusMessage({
        text: err instanceof Error ? err.message : "Broadcast failed",
        type: "error",
      });
    } finally {
      setPublishing(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-5xl rounded-3xl border border-white/10 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden z-10"
          style={{
            background: "linear-gradient(180deg, #0f1523 0%, #090d16 100%)",
            boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.9)",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-900/50 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                    AI Social Media Broadcast Studio
                  </h2>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    Admin Exclusive
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Auto-generate platform-tailored captions with Google Gemini & publish across social channels
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Status Alert Banner */}
          {statusMessage && (
            <div
              className={`px-6 py-2.5 text-xs font-medium flex items-center justify-between border-b ${
                statusMessage.type === "success"
                  ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
                  : statusMessage.type === "error"
                  ? "bg-red-500/15 border-red-500/30 text-red-300"
                  : "bg-blue-500/15 border-blue-500/30 text-blue-300"
              }`}
            >
              <div className="flex items-center gap-2">
                {statusMessage.type === "success" && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                {statusMessage.type === "error" && <AlertCircle className="w-4 h-4 text-red-400" />}
                {statusMessage.type === "info" && <HelpCircle className="w-4 h-4 text-blue-400" />}
                <span>{statusMessage.text}</span>
              </div>
              <button onClick={() => setStatusMessage(null)} className="text-xs opacity-70 hover:opacity-100">
                Dismiss
              </button>
            </div>
          )}

          {/* Body Content: 2-Column Grid */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* ─── LEFT COLUMN: MEDIA & AI PROMPT (5 COLS) ─── */}
            <div className="lg:col-span-5 space-y-5">
              {/* Media Selection Mode Toggle */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
                  <span>1. Choose Media Source</span>
                  <span className="text-[10px] text-blue-400 font-normal">Photo / Video</span>
                </label>

                <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-slate-900 border border-white/10">
                  <button
                    type="button"
                    onClick={() => setMediaSource("existing")}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      mediaSource === "existing"
                        ? "bg-blue-600 text-white shadow-md"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    Event Gallery
                  </button>
                  <button
                    type="button"
                    onClick={() => setMediaSource("custom")}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      mediaSource === "custom"
                        ? "bg-blue-600 text-white shadow-md"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Upload Custom
                  </button>
                </div>
              </div>

              {/* Source A: Existing Event Gallery */}
              {mediaSource === "existing" && (
                <div className="space-y-3 p-3.5 rounded-2xl bg-slate-900/60 border border-white/10">
                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1.5">
                      Select Campus Event:
                    </label>
                    <select
                      value={selectedEventId}
                      onChange={(e) => {
                        setSelectedEventId(e.target.value);
                        setSelectedMediaUrl("");
                      }}
                      className="input-field text-xs bg-slate-950 border-white/10"
                    >
                      {events.map((ev) => (
                        <option key={ev._id} value={ev._id}>
                          {ev.title} ({ev.category || "Event"})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Thumbnail Strip */}
                  {activeEvent && (
                    <div>
                      <label className="text-[11px] font-medium text-slate-400 block mb-2">
                        Pick Photo or Video:
                      </label>
                      <div className="flex gap-2 overflow-x-auto pb-1 max-h-32">
                        {/* Event Banner */}
                        {activeEvent.bannerUrl && (
                          <div
                            onClick={() => {
                              setSelectedMediaUrl(activeEvent.bannerUrl || "");
                              setMediaType("photo");
                            }}
                            className={`relative w-20 h-16 rounded-lg overflow-hidden cursor-pointer border-2 flex-shrink-0 transition-all ${
                              selectedMediaUrl === activeEvent.bannerUrl
                                ? "border-blue-500 ring-2 ring-blue-500/40"
                                : "border-white/10 opacity-70 hover:opacity-100"
                            }`}
                          >
                            <img
                              src={activeEvent.bannerUrl}
                              alt="Banner"
                              className="w-full h-full object-cover"
                            />
                            <span className="absolute bottom-1 left-1 text-[8px] font-bold px-1 bg-black/70 text-white rounded">
                              Banner
                            </span>
                          </div>
                        )}

                        {/* Gallery Photos */}
                        {activeEvent.mediaGallery?.photos?.map((ph, idx) => (
                          <div
                            key={idx}
                            onClick={() => {
                              setSelectedMediaUrl(ph);
                              setMediaType("photo");
                            }}
                            className={`relative w-20 h-16 rounded-lg overflow-hidden cursor-pointer border-2 flex-shrink-0 transition-all ${
                              selectedMediaUrl === ph
                                ? "border-blue-500 ring-2 ring-blue-500/40"
                                : "border-white/10 opacity-70 hover:opacity-100"
                            }`}
                          >
                            <img src={ph} alt={`Photo ${idx}`} className="w-full h-full object-cover" />
                          </div>
                        ))}

                        {/* Raw Clips */}
                        {activeEvent.mediaGallery?.rawClips?.map((clip, idx) => (
                          <div
                            key={`clip-${idx}`}
                            onClick={() => {
                              setSelectedMediaUrl(clip);
                              setMediaType("video");
                            }}
                            className={`relative w-20 h-16 rounded-lg overflow-hidden cursor-pointer border-2 flex-shrink-0 bg-slate-950 flex items-center justify-center transition-all ${
                              selectedMediaUrl === clip
                                ? "border-blue-500 ring-2 ring-blue-500/40"
                                : "border-white/10 opacity-70 hover:opacity-100"
                            }`}
                          >
                            <Film className="w-5 h-5 text-indigo-400" />
                            <span className="absolute bottom-1 left-1 text-[8px] font-bold px-1 bg-indigo-600 text-white rounded">
                              Clip
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Source B: Custom Upload */}
              {mediaSource === "custom" && (
                <div className="space-y-3 p-3.5 rounded-2xl bg-slate-900/60 border border-white/10">
                  <label className="text-xs font-medium text-slate-300 block">
                    Upload New Photo or Video Clip:
                  </label>
                  <label className="border-2 border-dashed border-white/20 hover:border-blue-500/60 rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-950/50 group">
                    <Upload className="w-6 h-6 text-slate-400 group-hover:text-blue-400 mb-2 transition-colors" />
                    <span className="text-xs font-semibold text-slate-300">
                      {uploadingCustom ? "Uploading file..." : "Click or Drag photo / video here"}
                    </span>
                    <span className="text-[10px] text-slate-500 mt-0.5">JPG, PNG, MP4, WebM (up to 50MB)</span>
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleCustomFileUpload}
                      className="hidden"
                      disabled={uploadingCustom}
                    />
                  </label>
                </div>
              )}

              {/* Active Selected Media Preview */}
              {selectedMediaUrl && (
                <div className="relative rounded-xl overflow-hidden border border-white/10 h-32 bg-black flex items-center justify-center group">
                  {mediaType === "photo" ? (
                    <img src={selectedMediaUrl} alt="Selected" className="w-full h-full object-cover" />
                  ) : (
                    <video src={selectedMediaUrl} controls className="w-full h-full object-cover" />
                  )}
                  <div className="absolute top-2 left-2 flex items-center gap-1.5">
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-black/70 text-white flex items-center gap-1 backdrop-blur-sm">
                      {mediaType === "photo" ? <ImageIcon className="w-2.5 h-2.5 text-blue-400" /> : <Film className="w-2.5 h-2.5 text-purple-400" />}
                      {mediaType.toUpperCase()}
                    </span>
                  </div>
                </div>
              )}

              {/* Step 2: Event Details & Prompt */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                  2. Caption Highlights & Details
                </label>

                <div>
                  <input
                    type="text"
                    value={customEventTitle}
                    onChange={(e) => setCustomEventTitle(e.target.value)}
                    placeholder="Event Title (e.g. HackPulse 2026 Concluded!)"
                    className="input-field text-xs bg-slate-900 border-white/10"
                  />
                </div>

                <div>
                  <textarea
                    rows={3}
                    value={highlights}
                    onChange={(e) => setHighlights(e.target.value)}
                    placeholder="Key highlights: Winners, student turnouts, guest speakers, memorable moments..."
                    className="input-field text-xs bg-slate-900 border-white/10 resize-none"
                  />
                </div>

                {/* Tone Selectors */}
                <div>
                  <label className="text-[11px] font-medium text-slate-400 block mb-1.5">Tone of Post:</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {TONES.map((t) => (
                      <button
                        key={t.value}
                        type="button"
                        onClick={() => setTone(t.value)}
                        className={`py-1.5 px-2.5 rounded-lg text-xs font-medium border text-left transition-all ${
                          tone === t.value
                            ? "bg-blue-600/25 border-blue-500 text-white font-semibold"
                            : "bg-slate-900/60 border-white/10 text-slate-400 hover:text-white"
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Generate Button */}
                <button
                  type="button"
                  onClick={handleGenerateCaptions}
                  disabled={generating || (!customEventTitle && !activeEvent)}
                  className="w-full btn-primary py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 disabled:opacity-50"
                >
                  {generating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Writing Captions with Gemini AI...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-white" />
                      <span>Generate AI Captions & Hashtags</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* ─── RIGHT COLUMN: CAPTIONS & LIVE MOCKUP PREVIEW (7 COLS) ─── */}
            <div className="lg:col-span-7 flex flex-col space-y-4">
              {/* Platform Selector Tabs + Mode Toggle */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                {/* Tabs */}
                <div className="flex items-center gap-1 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
                  {PLATFORMS.map((plat) => {
                    const isSelected = activePlatform === plat.id;
                    return (
                      <button
                        key={plat.id}
                        type="button"
                        onClick={() => setActivePlatform(plat.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                          isSelected
                            ? "bg-white/10 text-white border border-white/20 shadow-sm"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        <span>{plat.icon}</span>
                        <span>{plat.name}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Editor / Mockup Toggle */}
                <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-white/10 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => setPreviewMode("editor")}
                    className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                      previewMode === "editor" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Edit Text
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewMode("mockup")}
                    className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                      previewMode === "mockup" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Live Preview
                  </button>
                </div>
              </div>

              {/* Main Display Area: Editor OR Mockup */}
              <div className="flex-1 flex flex-col justify-between space-y-4">
                {previewMode === "editor" ? (
                  /* ─── TABBED CAPTION TEXTAREA ─── */
                  <div className="space-y-3 flex-1 flex flex-col">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="font-semibold text-white capitalize">{activePlatform} Caption:</span>
                      <span className="font-mono text-[11px]">
                        {captions[activePlatform]?.length || 0} characters
                        {activePlatform === "twitter" && ` / 280`}
                      </span>
                    </div>

                    <textarea
                      rows={10}
                      value={captions[activePlatform]}
                      onChange={(e) =>
                        setCaptions({ ...captions, [activePlatform]: e.target.value })
                      }
                      placeholder={`AI generated caption for ${activePlatform} will appear here. Click "Generate AI Captions" to begin!`}
                      className="input-field text-xs bg-slate-900/80 border-white/10 flex-1 min-h-[220px] font-sans leading-relaxed resize-none p-3.5"
                    />

                    {/* Suggested Hashtags Bar */}
                    {suggestedHashtags.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          Suggested Trending Hashtags (Click to append):
                        </span>
                        <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
                          {suggestedHashtags.map((tag) => (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => {
                                const current = captions[activePlatform] || "";
                                if (!current.includes(tag)) {
                                  setCaptions({
                                    ...captions,
                                    [activePlatform]: `${current} ${tag}`,
                                  });
                                }
                              }}
                              className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-300 hover:bg-blue-500/20 transition-colors"
                            >
                              {tag}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* ─── LIVE SOCIAL FEED MOCKUP PREVIEW ─── */
                  <div className="flex-1 flex items-center justify-center p-2 bg-slate-950/60 rounded-2xl border border-white/10 min-h-[260px] overflow-y-auto max-h-[380px]">
                    {/* INSTAGRAM CARD MOCKUP */}
                    {activePlatform === "instagram" && (
                      <div className="w-full max-w-sm bg-black border border-white/15 rounded-2xl overflow-hidden text-white text-xs shadow-2xl">
                        {/* IG Header */}
                        <div className="flex items-center justify-between p-3 border-b border-white/10">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-fuchsia-600 p-[1.5px]">
                              <div className="w-full h-full bg-black rounded-full flex items-center justify-center font-bold text-[9px]">
                                CP
                              </div>
                            </div>
                            <div>
                              <p className="font-bold text-[11px] leading-tight">campuspulse_official</p>
                              <p className="text-[9px] text-slate-400">University Campus</p>
                            </div>
                          </div>
                          <span className="text-slate-400 font-bold">•••</span>
                        </div>

                        {/* IG Media */}
                        <div className="relative aspect-video sm:aspect-square bg-slate-900 overflow-hidden flex items-center justify-center">
                          {selectedMediaUrl ? (
                            <img src={selectedMediaUrl} alt="Preview" className="w-full h-full object-cover" />
                          ) : (
                            <p className="text-slate-500 text-xs">No media selected yet</p>
                          )}
                        </div>

                        {/* IG Caption */}
                        <div className="p-3 space-y-1.5">
                          <p className="text-[11px] font-bold">482 likes</p>
                          <p className="text-[11px] leading-relaxed line-clamp-4 whitespace-pre-wrap">
                            <span className="font-bold mr-1">campuspulse_official</span>
                            {captions.instagram || "Your Instagram caption will preview here..."}
                          </p>
                          <p className="text-[9px] text-slate-500 uppercase">2 hours ago</p>
                        </div>
                      </div>
                    )}

                    {/* TWITTER / X CARD MOCKUP */}
                    {activePlatform === "twitter" && (
                      <div className="w-full max-w-sm bg-black border border-neutral-800 rounded-2xl p-3.5 text-white text-xs shadow-2xl space-y-2.5">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-[10px]">
                            CP
                          </div>
                          <div>
                            <div className="flex items-center gap-1">
                              <span className="font-bold text-xs">CampusPulse</span>
                              <span className="text-blue-400 font-bold text-[10px]">✓</span>
                            </div>
                            <span className="text-[10px] text-neutral-500">@CampusPulseUniv</span>
                          </div>
                        </div>

                        <p className="text-[11px] leading-relaxed whitespace-pre-wrap">
                          {captions.twitter || "Your Tweet will preview here..."}
                        </p>

                        {selectedMediaUrl && (
                          <div className="rounded-xl overflow-hidden border border-neutral-800 aspect-video bg-neutral-950">
                            <img src={selectedMediaUrl} alt="Twitter Media" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                    )}

                    {/* LINKEDIN MOCKUP */}
                    {activePlatform === "linkedin" && (
                      <div className="w-full max-w-sm bg-slate-900 border border-slate-700/50 rounded-2xl p-4 text-white text-xs shadow-2xl space-y-2.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded bg-blue-700 flex items-center justify-center font-bold text-xs">
                            in
                          </div>
                          <div>
                            <p className="font-bold text-xs">CampusPulse University Portal</p>
                            <p className="text-[10px] text-slate-400">12,400 followers • Just now • 🌐</p>
                          </div>
                        </div>

                        <p className="text-[11px] leading-relaxed whitespace-pre-wrap line-clamp-4">
                          {captions.linkedin || "Your LinkedIn post will preview here..."}
                        </p>

                        {selectedMediaUrl && (
                          <div className="rounded-xl overflow-hidden border border-white/10 aspect-video">
                            <img src={selectedMediaUrl} alt="LinkedIn Media" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                    )}

                    {/* FACEBOOK & WHATSAPP FALLBACK MOCKUP */}
                    {(activePlatform === "facebook" || activePlatform === "whatsapp") && (
                      <div className="w-full max-w-sm bg-slate-900 border border-white/10 rounded-2xl p-4 text-white text-xs shadow-2xl space-y-2">
                        <p className="text-xs font-bold capitalize">{activePlatform} Preview:</p>
                        <p className="text-[11px] whitespace-pre-wrap leading-relaxed text-slate-300">
                          {captions[activePlatform] || `Your ${activePlatform} caption will preview here...`}
                        </p>
                        {selectedMediaUrl && (
                          <div className="rounded-xl overflow-hidden border border-white/10 aspect-video">
                            <img src={selectedMediaUrl} alt="Media" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Connected Accounts Status Bar */}
                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-[11px] font-semibold">Active Channels:</span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {Object.entries(connectedAccounts).filter(([, a]) => a.status === "connected").length === 0 ? (
                        <span className="text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                          No direct accounts linked yet
                        </span>
                      ) : (
                        Object.entries(connectedAccounts)
                          .filter(([, a]) => a.status === "connected")
                          .map(([plat, a]) => (
                            <span
                              key={plat}
                              className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 flex items-center gap-1"
                            >
                              <Check className="w-2.5 h-2.5 text-emerald-400" />
                              <span className="capitalize">{plat}</span>
                              {a.displayName && <span className="opacity-70">({a.displayName})</span>}
                            </span>
                          ))
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowAccountsModal(true)}
                    className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 hover:underline"
                  >
                    <Settings className="w-3 h-3" />
                    <span>Manage Connected Accounts</span>
                  </button>
                </div>

                {/* Action Button Bar */}
                <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2">
                    {/* Copy Button */}
                    <button
                      type="button"
                      onClick={handleCopyCaption}
                      disabled={!captions[activePlatform]}
                      className="py-2 px-3 rounded-xl border border-white/10 hover:border-white/20 bg-slate-900 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors disabled:opacity-40"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                      <span>{copied ? "Copied!" : "Copy Caption"}</span>
                    </button>

                    {/* Direct Platform Launcher */}
                    <button
                      type="button"
                      onClick={() => handleLaunchPlatform(activePlatform)}
                      disabled={!captions[activePlatform]}
                      className="py-2 px-3 rounded-xl border border-white/10 hover:border-white/20 bg-slate-900 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors disabled:opacity-40"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
                      <span>Open {PLATFORMS.find((p) => p.id === activePlatform)?.name}</span>
                    </button>
                  </div>

                  {/* Publish via Webhook / Connected Accounts Button */}
                  <button
                    type="button"
                    onClick={handlePublishWebhook}
                    disabled={publishing || !selectedMediaUrl}
                    className="btn-primary py-2 px-4 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-600/30 disabled:opacity-50"
                  >
                    {publishing ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Posting to Channels...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5 text-white" />
                        <span>
                          Post to Connected Accounts & Webhook
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Inline Connected Accounts Modal */}
          {showAccountsModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto">
              <div
                className="relative w-full max-w-3xl rounded-3xl border border-white/15 p-5 sm:p-7 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto"
                style={{ background: "#0b0f19" }}
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-white">Connect & Manage Social Accounts</h3>
                    <p className="text-xs text-slate-400">
                      Link your real campus accounts (Instagram, FB Page, Twitter/X, Telegram, LinkedIn)
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAccountsModal(false);
                      refreshAccounts();
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <ConnectedAccountsManager />

                <div className="flex justify-end pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAccountsModal(false);
                      refreshAccounts();
                    }}
                    className="btn-primary py-2 px-6 rounded-xl text-xs font-bold"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
