"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Tag,
  FileText,
  Save,
  AlertCircle,
  Image as ImageIcon,
  Video,
  Upload,
  UserCheck,
  Target,
  Sparkles,
  X,
} from "lucide-react";
import { createEvent } from "@/actions/events";
import Link from "next/link";

const categories = ["Technical", "Cultural", "Sports", "Workshop"];
const statuses = ["draft", "upcoming", "ongoing"];

export default function NewEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Technical",
    tags: "",
    bannerUrl: "",
    videoUrl: "",
    eventDate: "",
    venue: "",
    maxCapacity: 100,
    status: "upcoming",
    chiefGuest: "",
    facultyCoordinator: "",
    objectives: "",
    outcomes: "",
  });

  const updateField = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (file: File, type: "image" | "video") => {
    const formData = new FormData();
    formData.append("file", file);

    if (type === "image") setUploadingImage(true);
    else setUploadingVideo(true);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      if (type === "image") {
        updateField("bannerUrl", data.url);
      } else {
        updateField("videoUrl", data.url);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload file");
    } finally {
      if (type === "image") setUploadingImage(false);
      else setUploadingVideo(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await createEvent({
        title: form.title,
        description: form.description,
        category: form.category,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        bannerUrl: form.bannerUrl,
        videoUrl: form.videoUrl,
        eventDate: form.eventDate,
        venue: form.venue,
        maxCapacity: Number(form.maxCapacity),
        status: form.status,
        chiefGuest: form.chiefGuest,
        facultyCoordinator: form.facultyCoordinator,
        objectives: form.objectives,
        outcomes: form.outcomes,
      });
      router.push("/admin/events");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      <Link
        href="/admin/events"
        className="inline-flex items-center gap-1.5 text-sm mb-6 transition-colors"
        style={{ color: "hsl(var(--muted-foreground))" }}
      >
        <ArrowLeft className="w-4 h-4" /> Back to Events
      </Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1
          className="text-2xl font-bold mb-2"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "hsl(var(--foreground))" }}
        >
          Create New Event
        </h1>
        <p className="text-sm mb-6" style={{ color: "hsl(var(--muted-foreground))" }}>
          Publish a new campus event with banner image, video promo, and agenda
        </p>

        {error && (
          <div
            className="flex items-center gap-2 p-3 rounded-lg mb-6 text-sm"
            style={{ background: "hsl(var(--destructive) / 0.1)", color: "hsl(var(--destructive))" }}
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="glass-card p-6 rounded-xl space-y-6">
          {/* Title */}
          <div>
            <label className="text-sm font-medium mb-2 block" style={{ color: "hsl(var(--foreground))" }}>
              <FileText className="w-4 h-4 inline mr-1.5" /> Event Title *
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="e.g. AI & Robotics Symposium 2026"
              className="input-field"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium mb-2 block" style={{ color: "hsl(var(--foreground))" }}>
              Description *
            </label>
            <textarea
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Detailed description of the event, eligibility, agenda..."
              className="input-field resize-none"
              rows={4}
              required
            />
          </div>

          {/* Category & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block" style={{ color: "hsl(var(--foreground))" }}>
                Category *
              </label>
              <select
                value={form.category}
                onChange={(e) => updateField("category", e.target.value)}
                className="input-field"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block" style={{ color: "hsl(var(--foreground))" }}>
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) => updateField("status", e.target.value)}
                className="input-field capitalize"
              >
                {statuses.map((s) => (
                  <option key={s} value={s} className="capitalize">
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date & Venue */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block" style={{ color: "hsl(var(--foreground))" }}>
                <Calendar className="w-4 h-4 inline mr-1.5" /> Date & Time *
              </label>
              <input
                type="datetime-local"
                value={form.eventDate}
                onChange={(e) => updateField("eventDate", e.target.value)}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block" style={{ color: "hsl(var(--foreground))" }}>
                <MapPin className="w-4 h-4 inline mr-1.5" /> Venue *
              </label>
              <input
                type="text"
                value={form.venue}
                onChange={(e) => updateField("venue", e.target.value)}
                placeholder="e.g. Main Auditorium / Seminar Hall B"
                className="input-field"
                required
              />
            </div>
          </div>

          {/* Capacity & Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block" style={{ color: "hsl(var(--foreground))" }}>
                <Users className="w-4 h-4 inline mr-1.5" /> Max Capacity *
              </label>
              <input
                type="number"
                value={form.maxCapacity}
                onChange={(e) => updateField("maxCapacity", e.target.value)}
                min={1}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block" style={{ color: "hsl(var(--foreground))" }}>
                <Tag className="w-4 h-4 inline mr-1.5" /> Tags
              </label>
              <input
                type="text"
                value={form.tags}
                onChange={(e) => updateField("tags", e.target.value)}
                placeholder="coding, AI, hackathon (comma separated)"
                className="input-field"
              />
            </div>
          </div>

          {/* Banner Image Section */}
          <div className="p-4 rounded-xl border space-y-3" style={{ background: "hsl(var(--surface))", borderColor: "hsl(var(--border))" }}>
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold flex items-center gap-1.5" style={{ color: "hsl(var(--foreground))" }}>
                <ImageIcon className="w-4 h-4 text-primary" /> Event Banner Image
              </label>
              {form.bannerUrl && (
                <button
                  type="button"
                  onClick={() => updateField("bannerUrl", "")}
                  className="text-xs text-red-400 hover:underline flex items-center gap-1"
                >
                  <X className="w-3 h-3" /> Remove
                </button>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 items-start">
              <input
                type="text"
                value={form.bannerUrl}
                onChange={(e) => updateField("bannerUrl", e.target.value)}
                placeholder="Image URL or upload file below..."
                className="input-field flex-1 text-xs"
              />
              <label className="btn-secondary py-2 px-3 text-xs cursor-pointer flex items-center gap-1.5 whitespace-nowrap">
                <Upload className="w-3.5 h-3.5" />
                {uploadingImage ? "Uploading..." : "Upload File"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], "image")}
                  className="hidden"
                  disabled={uploadingImage}
                />
              </label>
            </div>

            {form.bannerUrl && form.bannerUrl.startsWith("file://") && (
              <p className="text-xs text-amber-400 bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20">
                ⚠️ Local <code>file:///</code> paths cannot be loaded by web browsers. Please click &apos;Upload File&apos; to upload this image to the server.
              </p>
            )}

            {form.bannerUrl && !form.bannerUrl.startsWith("file://") && (
              <div className="relative w-full h-40 rounded-lg overflow-hidden border mt-2 bg-muted/40">
                <img
                  src={form.bannerUrl}
                  alt="Banner Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              </div>
            )}
          </div>

          {/* Promo Video Section */}
          <div className="p-4 rounded-xl border space-y-3" style={{ background: "hsl(var(--surface))", borderColor: "hsl(var(--border))" }}>
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold flex items-center gap-1.5" style={{ color: "hsl(var(--foreground))" }}>
                <Video className="w-4 h-4 text-accent" /> Promo Video Clip / Teaser (Optional)
              </label>
              {form.videoUrl && (
                <button
                  type="button"
                  onClick={() => updateField("videoUrl", "")}
                  className="text-xs text-red-400 hover:underline flex items-center gap-1"
                >
                  <X className="w-3 h-3" /> Remove
                </button>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 items-start">
              <input
                type="text"
                value={form.videoUrl}
                onChange={(e) => updateField("videoUrl", e.target.value)}
                placeholder="Video URL (MP4, YouTube, or direct upload)..."
                className="input-field flex-1 text-xs"
              />
              <label className="btn-secondary py-2 px-3 text-xs cursor-pointer flex items-center gap-1.5 whitespace-nowrap">
                <Upload className="w-3.5 h-3.5" />
                {uploadingVideo ? "Uploading..." : "Upload Video"}
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], "video")}
                  className="hidden"
                  disabled={uploadingVideo}
                />
              </label>
            </div>

            {form.videoUrl && (
              <div className="relative w-full h-52 rounded-lg overflow-hidden border mt-2 bg-black/60 flex items-center justify-center">
                {form.videoUrl.includes("youtube.com") || form.videoUrl.includes("youtu.be") ? (
                  <iframe
                    src={
                      form.videoUrl.includes("youtu.be/")
                        ? `https://www.youtube.com/embed/${form.videoUrl.split("youtu.be/")[1]?.split("?")[0]}`
                        : `https://www.youtube.com/embed/${form.videoUrl.split("v=")[1]?.split("&")[0]}`
                    }
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video src={form.videoUrl} controls className="w-full h-full max-h-52 object-contain" />
                )}
              </div>
            )}
          </div>

          {/* Report Pre-Configuration Details */}
          <div className="p-4 rounded-xl border space-y-4" style={{ background: "hsl(var(--surface))", borderColor: "hsl(var(--border))" }}>
            <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5" style={{ color: "hsl(var(--muted-foreground))" }}>
              <Sparkles className="w-3.5 h-3.5 text-primary" /> Report & Coordinator Details (Optional)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: "hsl(var(--foreground))" }}>
                  <UserCheck className="w-3.5 h-3.5 inline mr-1" /> Chief Guest / Keynote Speaker
                </label>
                <input
                  type="text"
                  value={form.chiefGuest}
                  onChange={(e) => updateField("chiefGuest", e.target.value)}
                  placeholder="e.g. Dr. A. Sharma (Head of AI)"
                  className="input-field text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: "hsl(var(--foreground))" }}>
                  <UserCheck className="w-3.5 h-3.5 inline mr-1" /> Faculty Coordinator
                </label>
                <input
                  type="text"
                  value={form.facultyCoordinator}
                  onChange={(e) => updateField("facultyCoordinator", e.target.value)}
                  placeholder="e.g. Prof. R. Verma"
                  className="input-field text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: "hsl(var(--foreground))" }}>
                  <Target className="w-3.5 h-3.5 inline mr-1" /> Objectives
                </label>
                <input
                  type="text"
                  value={form.objectives}
                  onChange={(e) => updateField("objectives", e.target.value)}
                  placeholder="e.g. Hands-on learning of neural networks"
                  className="input-field text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: "hsl(var(--foreground))" }}>
                  <Target className="w-3.5 h-3.5 inline mr-1" /> Expected Outcomes
                </label>
                <input
                  type="text"
                  value={form.outcomes}
                  onChange={(e) => updateField("outcomes", e.target.value)}
                  placeholder="e.g. Students built 3 live AI applications"
                  className="input-field text-xs"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t" style={{ borderColor: "hsl(var(--border))" }}>
            <Link href="/admin/events" className="btn-secondary py-2.5 px-5 text-sm">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading || uploadingImage || uploadingVideo}
              className="btn-primary py-2.5 px-6 text-sm disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating Event...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Create & Publish Event
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

