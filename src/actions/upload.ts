"use server";

import { writeFile, mkdir, copyFile } from "fs/promises";
import path from "path";
import { existsSync } from "fs";
import { requireAdmin } from "@/lib/auth/rbac";

export async function uploadMediaAction(formData: FormData): Promise<{ success: boolean; url: string; fileName: string }> {
  await requireAdmin();

  const file = formData.get("file") as File | null;
  if (!file) {
    throw new Error("No file provided");
  }

  const validMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/svg+xml",
    "video/mp4",
    "video/webm",
    "video/ogg",
    "video/quicktime",
  ];

  if (!validMimeTypes.includes(file.type)) {
    throw new Error("Invalid file format. Please upload a standard image or video file.");
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // 1. In serverless / production environments (like Vercel), the filesystem (/var/task) is read-only.
  // Check if we are running in Vercel or if filesystem write fails:
  try {
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const ext = path.extname(file.name) || (file.type.startsWith("video/") ? ".mp4" : ".png");
    const cleanBase = path
      .basename(file.name, ext)
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .toLowerCase();
    const uniqueFileName = `${Date.now()}_${cleanBase}${ext}`;
    const filePath = path.join(uploadDir, uniqueFileName);

    await writeFile(filePath, buffer);

    return {
      success: true,
      url: `/uploads/${uniqueFileName}`,
      fileName: uniqueFileName,
    };
  } catch (fsError) {
    console.warn("Filesystem is read-only (e.g. Vercel serverless). Using high-reliability Data URI fallback:", fsError);

    // Fallback: Return Base64 Data URI for images so uploads always succeed on Vercel
    if (file.type.startsWith("image/")) {
      const base64 = buffer.toString("base64");
      return {
        success: true,
        url: `data:${file.type};base64,${base64}`,
        fileName: file.name,
      };
    }

    throw new Error("Filesystem storage is read-only on this serverless deployment. Please use an image or direct URL.");
  }
}

export async function resolveLocalOrDirectUrlAction(inputUrl: string): Promise<string> {
  if (!inputUrl || typeof inputUrl !== "string") return "";

  const trimmed = inputUrl.trim();

  // If already a web url, data url, or public uploads url
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:") ||
    trimmed.startsWith("/uploads/")
  ) {
    return trimmed;
  }

  // Check if it's a local file URL or file path (e.g. file:///C:/... or C:\...)
  let localPath = trimmed;
  if (localPath.startsWith("file:///")) {
    localPath = decodeURIComponent(localPath.replace(/^file:\/\/\/?/, ""));
  } else if (localPath.startsWith("file://")) {
    localPath = decodeURIComponent(localPath.replace(/^file:\/\//, ""));
  }

  // Clean Windows drive syntax if it was /C:/
  if (/^\/[a-zA-Z]:/.test(localPath)) {
    localPath = localPath.slice(1);
  }

  // Replace forward slashes with system separators if Windows
  localPath = path.normalize(localPath);

  try {
    if (existsSync(localPath)) {
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
      }

      const ext = path.extname(localPath) || ".mp4";
      const cleanBase = path
        .basename(localPath, ext)
        .replace(/[^a-zA-Z0-9_-]/g, "_")
        .toLowerCase();
      const uniqueFileName = `${Date.now()}_${cleanBase}${ext}`;
      const destPath = path.join(uploadDir, uniqueFileName);

      await copyFile(localPath, destPath);
      return `/uploads/${uniqueFileName}`;
    }
  } catch (err) {
    console.warn("Could not copy local file on serverless:", err);
  }

  return trimmed;
}
