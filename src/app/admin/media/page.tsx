"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Image as ImageIcon,
  Film,
  Calendar,
  Eye,
  Plus,
  Upload,
  Trash2,
  Copy,
  Check,
  X,
  ExternalLink,
  Filter,
  Star,
} from "lucide-react";
import { getAdminEvents, addEventMedia, removeEventMedia, setEventBanner } from "@/actions/events";
import { uploadMediaAction } from "@/actions/upload";
import { BANNER_PRESETS } from "@/lib/constants/event-presets";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";
import Toast from "@/components/ui/Toast";

export default function MediaPage() {
  const [events, setEvents] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [mediaType, setMediaType] = useState<"photo" | "video">("photo");
  const [directUrl, setDirectUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  // Active filter
  const [filterEvent, setFilterEvent] = useState<string>("all");
  const [filterType, setFilterType] = useState<"all" | "photos" | "videos">("all");

  // Lightbox preview
  const [activeMedia, setActiveMedia] = useState<{ url: string; type: "photo" | "video"; title: string } | null>(null);

  const loadData = async () => {
    try {
      const data = await getAdminEvents();
      setEvents(data);
      if (data.length > 0 && !selectedEventId) {
        setSelectedEventId(data[0]._id as string);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0 || !selectedEventId) return;

    setUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append("file", files[i]);

        let fileUrl = "";
        try {
          const sRes = await uploadMediaAction(formData);
          if (sRes.success && sRes.url) fileUrl = sRes.url;
        } catch {
          const res = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Upload failed");
          fileUrl = data.url;
        }
        uploadedUrls.push(fileUrl);
      }

      if (mediaType === "photo") {
        await addEventMedia(selectedEventId, { photos: uploadedUrls });
      } else {
        await addEventMedia(selectedEventId, { rawClips: uploadedUrls });
      }

      setToast({ message: `${uploadedUrls.length} file(s) uploaded successfully!`, type: "success" });
      setIsUploadModalOpen(false);
      await loadData();
    } catch (err) {
      setToast({ message: err instanceof Error ? err.message : "Upload failed", type: "error" });
    } finally {
      setUploading(false);
    }
  };

  const handleAddDirectUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!directUrl || !selectedEventId) return;

    if (directUrl.startsWith("file://")) {
      setToast({
        message: "Local file:/// paths cannot be viewed in web browsers. Please upload the file instead.",
        type: "error",
      });
      return;
    }

    setUploading(true);
    try {
      if (mediaType === "photo") {
        await addEventMedia(selectedEventId, { photos: [directUrl] });
      } else {
        await addEventMedia(selectedEventId, { rawClips: [directUrl] });
      }
      setToast({ message: "Media added successfully!", type: "success" });
      setDirectUrl("");
      setIsUploadModalOpen(false);
      await loadData();
    } catch (err) {
      setToast({ message: err instanceof Error ? err.message : "Failed to add media", type: "error" });
    } finally {
      setUploading(false);
    }
  };

  const handleSetBanner = async (eventId: string, url: string) => {
    try {
      await setEventBanner(eventId, url);
      setToast({ message: "Event banner updated successfully!", type: "success" });
      await loadData();
    } catch (err) {
      setToast({ message: err instanceof Error ? err.message : "Failed to set banner", type: "error" });
    }
  };

  const handleDeleteMedia = async (eventId: string, url: string, type: "photo" | "video") => {
    if (!confirm("Are you sure you want to remove this media asset?")) return;
    try {
      if (type === "photo") {
        await removeEventMedia(eventId, { photoUrl: url });
      } else {
        await removeEventMedia(eventId, { clipUrl: url });
      }
      setToast({ message: "Media asset deleted", type: "success" });
      await loadData();
    } catch (err) {
      setToast({ message: "Failed to delete media", type: "error" });
    }
  };

  const copyToClipboard = (url: string) => {
    const fullUrl = url.startsWith("http") ? url : window.location.origin + url;
    navigator.clipboard.writeText(fullUrl);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  if (loading) return <LoadingSpinner size="lg" text="Loading media gallery..." fullPage />;

  const allPhotosCount = events.reduce(
    (s, e) => s + ((e.mediaGallery as Record<string, unknown>)?.photos as string[] || []).length,
    0
  );
  const allClipsCount = events.reduce(
    (s, e) => s + ((e.mediaGallery as Record<string, unknown>)?.rawClips as string[] || []).length,
    0
  );

  const filteredEvents = events.filter((e) => {
    if (filterEvent !== "all" && e._id !== filterEvent) return false;
    const photos = ((e.mediaGallery as Record<string, unknown>)?.photos as string[]) || [];
    const clips = ((e.mediaGallery as Record<string, unknown>)?.rawClips as string[]) || [];
    if (filterType === "photos") return photos.length > 0;
    if (filterType === "videos") return clips.length > 0;
    return photos.length > 0 || clips.length > 0;
  });

  return (
    <div className="p-3.5 sm:p-5 lg:p-8 space-y-4 sm:space-y-6 max-w-7xl mx-auto overflow-x-hidden">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground break-words">
            Media Gallery & Uploads
          </h1>
          <p className="text-xs sm:text-sm mt-0.5 sm:mt-1 text-muted-foreground break-words">
            Upload, preview, and manage high-resolution photos and video clips for campus events
          </p>
        </div>
        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="btn-primary py-2.5 px-4 text-xs sm:text-sm flex items-center justify-center gap-2 w-full sm:w-auto flex-shrink-0"
        >
          <Upload className="w-4 h-4" /> Upload Media
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="glass-card p-4 sm:p-5 rounded-xl flex items-center gap-3.5">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "hsl(var(--primary) / 0.1)" }}>
            <ImageIcon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xl sm:text-2xl font-bold text-foreground">{allPhotosCount}</p>
            <p className="text-xs text-muted-foreground truncate">Total Event Photos</p>
          </div>
        </div>
        <div className="glass-card p-4 sm:p-5 rounded-xl flex items-center gap-3.5">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "hsl(var(--accent) / 0.1)" }}>
            <Film className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xl sm:text-2xl font-bold text-foreground">{allClipsCount}</p>
            <p className="text-xs text-muted-foreground truncate">Total Video Clips</p>
          </div>
        </div>
        <div className="glass-card p-4 sm:p-5 rounded-xl flex items-center gap-3.5">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "hsl(var(--success) / 0.1)" }}>
            <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-success" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xl sm:text-2xl font-bold text-foreground">
              {events.filter((e) => {
                const g = e.mediaGallery as Record<string, unknown>;
                return ((g?.photos as string[]) || []).length > 0 || ((g?.rawClips as string[]) || []).length > 0;
              }).length}
            </p>
            <p className="text-xs text-muted-foreground truncate">Events with Media</p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-3 glass-card p-3 sm:p-3.5 rounded-xl overflow-hidden">
        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground flex-shrink-0">
          <Filter className="w-3.5 h-3.5" /> Filter by:
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-1 min-w-0">
          <select
            value={filterEvent}
            onChange={(e) => setFilterEvent(e.target.value)}
            className="input-field py-1.5 px-2.5 text-xs w-full sm:w-auto sm:max-w-xs truncate"
          >
            <option value="all">All Events ({events.length})</option>
            {events.map((e) => (
              <option key={e._id as string} value={e._id as string}>
                {e.title as string}
              </option>
            ))}
          </select>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 sm:pb-0" style={{ scrollbarWidth: "none" }}>
            <button
              onClick={() => setFilterType("all")}
              className={`py-1.5 px-3 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                filterType === "all" ? "btn-primary" : "btn-secondary"
              }`}
            >
              All Media
            </button>
            <button
              onClick={() => setFilterType("photos")}
              className={`py-1.5 px-3 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                filterType === "photos" ? "btn-primary" : "btn-secondary"
              }`}
            >
              Photos Only
            </button>
            <button
              onClick={() => setFilterType("videos")}
              className={`py-1.5 px-3 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                filterType === "videos" ? "btn-primary" : "btn-secondary"
              }`}
            >
              Videos Only
            </button>
          </div>
        </div>
      </div>

      {/* Media Gallery Grid */}
      {filteredEvents.length === 0 ? (
        <EmptyState
          icon={ImageIcon}
          title="No Media Found"
          description="Upload event photos and promo clips to create a lively campus gallery."
          action={{
            label: "Upload Your First Media",
            onClick: () => setIsUploadModalOpen(true),
          }}
        />
      ) : (
        <div className="space-y-6">
          {filteredEvents.map((event, i) => {
            const gallery = event.mediaGallery as Record<string, unknown>;
            const photos = (gallery?.photos as string[]) || [];
            const clips = (gallery?.rawClips as string[]) || [];

            return (
              <motion.div
                key={event._id as string}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card p-4 sm:p-6 rounded-xl space-y-3 sm:space-y-4 overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4 border-b pb-3" style={{ borderColor: "hsl(var(--border))" }}>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-sm sm:text-base text-foreground break-words">
                      {event.title as string}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5 break-words">
                      {photos.length} photos • {clips.length} videos • {event.venue as string}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedEventId(event._id as string);
                      setIsUploadModalOpen(true);
                    }}
                    className="btn-secondary py-1.5 px-3 text-xs flex items-center justify-center gap-1.5 w-full sm:w-auto flex-shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Media to Event
                  </button>
                </div>

                {/* Photos Grid */}
                {filterType !== "videos" && photos.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1">
                      <ImageIcon className="w-3.5 h-3.5 text-primary" /> Photos ({photos.length})
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                      {photos.map((photo, pi) => {
                        const isCurrentBanner = (event.bannerUrl as string) === photo;
                        return (
                          <div
                            key={pi}
                            className="relative aspect-square rounded-xl overflow-hidden group border shadow-sm"
                            style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--muted))" }}
                          >
                            <img
                              src={photo}
                              alt={`Photo ${pi + 1}`}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              loading="lazy"
                            />
                            {/* Current Banner Badge */}
                            {isCurrentBanner && (
                              <div className="absolute top-1.5 left-1.5 z-10 px-2 py-0.5 rounded bg-primary text-white text-[10px] font-semibold flex items-center gap-1 shadow-md">
                                <Star className="w-2.5 h-2.5 fill-white" /> Banner
                              </div>
                            )}
                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                              <button
                                onClick={() => setActiveMedia({ url: photo, type: "photo", title: event.title as string })}
                                className="p-1.5 rounded-full bg-white/20 hover:bg-white text-white hover:text-black transition-colors"
                                title="View Fullsize"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => handleSetBanner(event._id as string, photo)}
                                  className={`p-1.5 rounded-full transition-colors ${
                                    isCurrentBanner
                                      ? "bg-primary text-white"
                                      : "bg-amber-500/30 hover:bg-amber-500 text-white"
                                  }`}
                                  title={isCurrentBanner ? "Current Event Banner" : "Set as Event Banner"}
                                >
                                  <Star className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => copyToClipboard(photo)}
                                  className="p-1.5 rounded-full bg-white/20 hover:bg-white text-white hover:text-black transition-colors"
                                  title="Copy Link"
                                >
                                  {copiedUrl === photo ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                </button>
                                <button
                                  onClick={() => handleDeleteMedia(event._id as string, photo, "photo")}
                                  className="p-1.5 rounded-full bg-red-500/30 hover:bg-red-500 text-white transition-colors"
                                  title="Delete Photo"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Videos Grid */}
                {filterType !== "photos" && clips.length > 0 && (
                  <div className="pt-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1">
                      <Film className="w-3.5 h-3.5 text-accent" /> Video Clips ({clips.length})
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {clips.map((clip, ci) => (
                        <div
                          key={ci}
                          className="rounded-xl overflow-hidden border p-2 space-y-2"
                          style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--surface))" }}
                        >
                          <div className="relative aspect-video rounded-lg overflow-hidden bg-black flex items-center justify-center">
                            {clip.includes("youtube.com") || clip.includes("youtu.be") ? (
                              <iframe
                                src={
                                  clip.includes("youtu.be/")
                                    ? `https://www.youtube.com/embed/${clip.split("youtu.be/")[1]?.split("?")[0]}`
                                    : `https://www.youtube.com/embed/${clip.split("v=")[1]?.split("&")[0]}`
                                }
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            ) : (
                              <video src={clip} controls className="w-full h-full object-cover" />
                            )}
                          </div>
                          <div className="flex items-center justify-between pt-1">
                            <span className="text-xs text-muted-foreground truncate flex-1">Clip #{ci + 1}</span>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => copyToClipboard(clip)}
                                className="p-1 text-muted-foreground hover:text-foreground"
                                title="Copy Video Link"
                              >
                                {copiedUrl === clip ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                              <button
                                onClick={() => handleDeleteMedia(event._id as string, clip, "video")}
                                className="p-1 text-muted-foreground hover:text-red-400"
                                title="Delete Clip"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Upload Media Modal */}
      <AnimatePresence>
        {isUploadModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card rounded-2xl w-full max-w-lg overflow-hidden flex flex-col my-auto border shadow-2xl"
              style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
            >
              <div className="p-5 border-b flex items-center justify-between" style={{ borderColor: "hsl(var(--border))" }}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "hsl(var(--primary) / 0.15)", color: "hsl(var(--primary))" }}>
                    <Upload className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-bold text-base" style={{ color: "hsl(var(--foreground))" }}>
                      Upload Event Media
                    </h2>
                    <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
                      Add photos or video clips to campus events
                    </p>
                  </div>
                </div>
                <button onClick={() => setIsUploadModalOpen(false)} className="p-1 rounded-lg hover:bg-muted text-muted-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-5">
                {/* Select Event */}
                <div>
                  <label className="text-xs font-semibold block mb-1.5" style={{ color: "hsl(var(--foreground))" }}>
                    Target Event *
                  </label>
                  <select
                    value={selectedEventId}
                    onChange={(e) => setSelectedEventId(e.target.value)}
                    className="input-field"
                    required
                  >
                    {events.map((e) => (
                      <option key={e._id as string} value={e._id as string}>
                        {e.title as string} ({e.category as string})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Media Type Toggle */}
                <div>
                  <label className="text-xs font-semibold block mb-1.5" style={{ color: "hsl(var(--foreground))" }}>
                    Media Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setMediaType("photo")}
                      className={`py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-colors ${
                        mediaType === "photo" ? "btn-primary" : "btn-secondary"
                      }`}
                    >
                      <ImageIcon className="w-4 h-4" /> Photo(s)
                    </button>
                    <button
                      type="button"
                      onClick={() => setMediaType("video")}
                      className={`py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-colors ${
                        mediaType === "video" ? "btn-primary" : "btn-secondary"
                      }`}
                    >
                      <Film className="w-4 h-4" /> Video Clip(s)
                    </button>
                  </div>
                </div>

                {/* File Dropzone */}
                <div
                  className="border-2 border-dashed rounded-xl p-6 text-center hover:border-primary transition-colors cursor-pointer"
                  style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--surface))" }}
                  onClick={() => document.getElementById("file-upload-input")?.click()}
                >
                  <Upload className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <p className="text-sm font-semibold text-foreground">Click or Drag & Drop to Upload</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {mediaType === "photo" ? "Supports PNG, JPG, WEBP, GIF (Multiple files allowed)" : "Supports MP4, WEBM, MOV video clips"}
                  </p>
                  <input
                    id="file-upload-input"
                    type="file"
                    multiple={mediaType === "photo"}
                    accept={mediaType === "photo" ? "image/*" : "video/*"}
                    onChange={(e) => handleFileUpload(e.target.files)}
                    className="hidden"
                    disabled={uploading}
                  />
                </div>

                {/* Direct URL Alternative */}
                <form onSubmit={handleAddDirectUrl} className="pt-2 border-t space-y-2" style={{ borderColor: "hsl(var(--border))" }}>
                  <label className="text-xs font-semibold text-muted-foreground block">
                    Or Add from Direct URL:
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={directUrl}
                      onChange={(e) => setDirectUrl(e.target.value)}
                      placeholder="https://example.com/photo.jpg"
                      className="input-field text-xs flex-1 min-w-0"
                    />
                    <button
                      type="submit"
                      disabled={!directUrl || uploading}
                      className="btn-secondary py-2 px-4 text-xs whitespace-nowrap justify-center disabled:opacity-50"
                    >
                      Add URL
                    </button>
                  </div>
                </form>
              </div>

              <div className="p-4 border-t flex justify-end" style={{ borderColor: "hsl(var(--border))" }}>
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="btn-secondary py-2 px-4 text-xs"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeMedia && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
            onClick={() => setActiveMedia(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-4xl max-h-[85vh] overflow-hidden rounded-2xl flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveMedia(null)}
                className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-white hover:text-black transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {activeMedia.type === "photo" ? (
                <img src={activeMedia.url} alt={activeMedia.title} className="max-w-full max-h-[80vh] object-contain rounded-xl" />
              ) : activeMedia.url.includes("youtube.com") || activeMedia.url.includes("youtu.be") ? (
                <iframe
                  src={
                    activeMedia.url.includes("youtu.be/")
                      ? `https://www.youtube.com/embed/${activeMedia.url.split("youtu.be/")[1]?.split("?")[0]}?autoplay=1`
                      : `https://www.youtube.com/embed/${activeMedia.url.split("v=")[1]?.split("&")[0]}?autoplay=1`
                  }
                  className="w-[80vw] max-w-3xl aspect-video rounded-xl"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video src={activeMedia.url} controls autoPlay className="max-w-full max-h-[80vh] rounded-xl" />
              )}
              <p className="text-white text-xs mt-2">{activeMedia.title}</p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

