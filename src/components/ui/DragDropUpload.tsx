"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { Upload, Image as ImageIcon, Video, X, CheckCircle, Loader2, Play } from "lucide-react";
import { uploadMediaAction, resolveLocalOrDirectUrlAction } from "@/actions/upload";
import { getVideoEmbedInfo } from "@/lib/video-helper";

interface DragDropUploadProps {
  type: "image" | "video";
  value: string;
  onChange: (url: string) => void;
  label?: string;
  description?: string;
  placeholder?: string;
}

export default function DragDropUpload({
  type,
  value,
  onChange,
  label,
  description,
  placeholder,
}: DragDropUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [inputVal, setInputVal] = useState(value);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync internal input state if value prop changes externally (e.g. preset chosen)
  if (value !== inputVal && !uploading) {
    setInputVal(value);
  }

  const handleFileProcess = async (file: File) => {
    setError("");
    setUploading(true);

    try {
      let publicUrl = "";

      // 1. If file is <= 4.5 MB, attempt standard server upload
      if (file.size <= 4.5 * 1024 * 1024) {
        try {
          const formData = new FormData();
          formData.append("file", file);
          const res = await uploadMediaAction(formData);
          if (res.success && res.url) {
            publicUrl = res.url;
          }
        } catch {
          try {
            const formData = new FormData();
            formData.append("file", file);
            const res = await fetch("/api/upload", {
              method: "POST",
              body: formData,
            });

            const rawText = await res.text();
            try {
              const data = JSON.parse(rawText);
              if (res.ok && data.url) {
                publicUrl = String(data.url);
              }
            } catch {
              // Ignore parse error and proceed to client FileReader
            }
          } catch {
            // Ignore fetch error and proceed to client FileReader
          }
        }
      }

      // 2. High-reliability fallback: Read file directly on client as Data URI / Object URL
      // This ensures ANY video file or photo selected from mobile/desktop is 100% accepted without failure!
      if (!publicUrl) {
        if (file.size <= 16 * 1024 * 1024) {
          publicUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => reject(new Error("Failed to process file"));
            reader.readAsDataURL(file);
          });
        } else {
          // For very large files (>16 MB), generate a local object URL for instant preview
          publicUrl = URL.createObjectURL(file);
          setError(
            `Large file (${(file.size / (1024 * 1024)).toFixed(1)} MB) loaded locally. For permanent online streaming, pasting a YouTube link is recommended.`
          );
        }
      }

      setInputVal(publicUrl);
      onChange(publicUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not process file. Please paste a direct URL.");
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (type === "image" && !file.type.startsWith("image/")) {
        setError("Please drop an image file (PNG, JPG, WEBP, GIF).");
        return;
      }
      if (type === "video" && !file.type.startsWith("video/")) {
        setError("Please drop a video file (MP4, WEBM, MOV).");
        return;
      }
      await handleFileProcess(file);
    }
  };

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await handleFileProcess(files[0]);
    }
  };

  const handleManualUrlBlur = async () => {
    if (!inputVal.trim()) {
      onChange("");
      return;
    }

    // Auto-resolve local paths or file:/// if pasted
    if (inputVal.startsWith("file://") || /^[a-zA-Z]:[/\\]/.test(inputVal)) {
      setUploading(true);
      try {
        const resolved = await resolveLocalOrDirectUrlAction(inputVal);
        setInputVal(resolved);
        onChange(resolved);
      } catch {
        onChange(inputVal);
      } finally {
        setUploading(false);
      }
    } else {
      onChange(inputVal);
    }
  };

  const handleRemove = () => {
    setInputVal("");
    onChange("");
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const hasValue = Boolean(value) && !value.startsWith("file://");

  return (
    <div className="space-y-2">
      {/* Label and remove button */}
      <div className="flex items-center justify-between">
        <label className="text-xs sm:text-sm font-semibold flex items-center gap-1.5 text-foreground">
          {type === "image" ? (
            <ImageIcon className="w-4 h-4 text-primary" />
          ) : (
            <Video className="w-4 h-4 text-accent" />
          )}
          {label || (type === "image" ? "Event Image" : "Promo Video")}
        </label>
        {hasValue && (
          <button
            type="button"
            onClick={handleRemove}
            className="text-xs text-red-400 hover:text-red-300 hover:underline flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" /> Remove
          </button>
        )}
      </div>

      {/* Drag & Drop Area */}
      <div
        onDragOver={handleDragOver}
        onDragEnter={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`relative rounded-xl border-2 border-dashed p-4 transition-all duration-200 cursor-pointer overflow-hidden ${
          isDragging
            ? "border-primary bg-primary/10 scale-[1.01] ring-4 ring-primary/20"
            : hasValue
            ? "border-border bg-surface hover:border-primary/50"
            : "border-border hover:border-primary/60 bg-muted/20 hover:bg-muted/40"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={type === "image" ? "image/*" : "video/*"}
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />

        {/* Uploading overlay */}
        {uploading && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-xs font-semibold text-foreground">
              Uploading {type === "image" ? "image" : "video"}...
            </p>
          </div>
        )}

        {/* Preview or Dropzone placeholder */}
        {hasValue ? (
          <div className="space-y-3">
            {type === "image" ? (
              <div className="relative w-full h-48 rounded-lg overflow-hidden border border-border bg-muted/40 group">
                <img
                  src={value}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-medium">
                  <Upload className="w-4 h-4" /> Drop new photo or click to change
                </div>
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 text-white text-[10px] font-medium backdrop-blur-sm flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-emerald-400" /> Active Image
                </div>
              </div>
            ) : (
              <div className="relative w-full h-56 rounded-lg overflow-hidden border border-border bg-black flex items-center justify-center group">
                {(() => {
                  const info = getVideoEmbedInfo(value);
                  if (info.isEmbed) {
                    return (
                      <iframe
                        src={info.embedUrl}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    );
                  }
                  return (
                    <video
                      src={info.embedUrl}
                      controls
                      playsInline
                      className="w-full h-full max-h-56 object-contain"
                    />
                  );
                })()}
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 text-white text-[10px] font-medium backdrop-blur-sm flex items-center gap-1 pointer-events-none">
                  <Play className="w-3 h-3 text-accent fill-accent" /> Active Video Preview
                </div>
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
              <span className="truncate max-w-[80%]">{value}</span>
              <span className="text-primary font-medium flex items-center gap-1 hover:underline">
                <Upload className="w-3 h-3" /> Change File
              </span>
            </div>
          </div>
        ) : (
          <div className="py-6 sm:py-8 flex flex-col items-center justify-center text-center space-y-2">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                isDragging ? "bg-primary text-white scale-110" : "bg-primary/10 text-primary"
              }`}
            >
              {type === "image" ? <ImageIcon className="w-6 h-6" /> : <Video className="w-6 h-6" />}
            </div>
            <div>
              <p className="text-xs sm:text-sm font-semibold text-foreground">
                {isDragging
                  ? `Drop your ${type} here!`
                  : `Drag & Drop your ${type} here or Browse`}
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {description ||
                  (type === "image"
                    ? "Supports PNG, JPG, WEBP, GIF (Up to 25MB)"
                    : "Supports any video file (MP4, WEBM, MOV) or any video link")}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Manual URL input with real-time auto-resolve */}
      <div className="flex gap-2">
        <input
          type="text"
          value={inputVal}
          onChange={(e) => {
            const val = e.target.value;
            setInputVal(val);
            setError("");
            onChange(val.trim());
          }}
          onBlur={handleManualUrlBlur}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleManualUrlBlur())}
          placeholder={
            placeholder ||
            (type === "image"
              ? "Paste image URL or local path..."
              : "Paste YouTube, Google Drive, MP4, or any video link...")
          }
          className="input-field text-xs flex-1"
        />
        {inputVal !== value && (
          <button
            type="button"
            onClick={handleManualUrlBlur}
            className="btn-secondary py-1.5 px-3 text-xs whitespace-nowrap"
          >
            Apply
          </button>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-400 bg-red-500/10 p-2 rounded-lg border border-red-500/20">
          ⚠️ {error}
        </p>
      )}

      {type === "video" && (
        <div className="flex flex-wrap items-center gap-1.5 pt-0.5 text-[11px] text-muted-foreground">
          <span>💡 Or test with sample video:</span>
          <button
            type="button"
            onClick={() => {
              const url = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";
              setInputVal(url);
              onChange(url);
              setError("");
            }}
            className="px-2 py-0.5 rounded bg-surface hover:bg-surface-raised border border-border text-foreground transition-all hover:border-primary/40"
          >
            🎬 Campus Teaser
          </button>
          <button
            type="button"
            onClick={() => {
              const url = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4";
              setInputVal(url);
              onChange(url);
              setError("");
            }}
            className="px-2 py-0.5 rounded bg-surface hover:bg-surface-raised border border-border text-foreground transition-all hover:border-primary/40"
          >
            ⚡ Fest Highlight
          </button>
        </div>
      )}
    </div>
  );
}
