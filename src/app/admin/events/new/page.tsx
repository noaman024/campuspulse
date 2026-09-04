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
import { uploadMediaAction } from "@/actions/upload";
import { BANNER_PRESETS } from "@/lib/constants/event-presets";
import DragDropUpload from "@/components/ui/DragDropUpload";
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
      let fileUrl = "";
      try {
        const res = await uploadMediaAction(formData);
        if (res.success && res.url) {
          fileUrl = res.url;
        }
      } catch {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload failed");
        fileUrl = data.url;
      }

      if (type === "image") {
        updateField("bannerUrl", fileUrl);
      } else {
        updateField("videoUrl", fileUrl);
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
            <DragDropUpload
              type="image"
              value={form.bannerUrl}
              onChange={(url) => updateField("bannerUrl", url)}
              label="Event Banner Image"
              description="Drag & drop a banner photo here (PNG, JPG, WEBP) or click to browse"
            />

            {/* Quick Presets */}
            <div className="space-y-1.5 pt-1">
              <p className="text-[11px] font-medium text-muted-foreground">
                Or choose a quick preset banner:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {BANNER_PRESETS.filter((p) => p.category === form.category).map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => updateField("bannerUrl", preset.url)}
                    className={`text-[11px] px-2.5 py-1 rounded-md border transition-all ${
                      form.bannerUrl === preset.url
                        ? "bg-primary text-primary-foreground border-primary font-medium"
                        : "bg-background/80 hover:bg-muted text-muted-foreground border-border"
                    }`}
                  >
                    ✨ {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Promo Video Section */}
          <div className="p-4 rounded-xl border space-y-3" style={{ background: "hsl(var(--surface))", borderColor: "hsl(var(--border))" }}>
            <DragDropUpload
              type="video"
              value={form.videoUrl}
              onChange={(url) => updateField("videoUrl", url)}
              label="Promo Video Clip / Teaser (Optional)"
              description="Drag & drop a video file (MP4, WEBM, MOV) or paste YouTube / direct link"
            />
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

