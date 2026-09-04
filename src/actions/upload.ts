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
}

export async function resolveLocalOrDirectUrlAction(inputUrl: string): Promise<string> {
  if (!inputUrl || typeof inputUrl !== "string") return "";

  const trimmed = inputUrl.trim();

  // If already a web url or public uploads url
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("/uploads/")) {
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

  return trimmed;
}
