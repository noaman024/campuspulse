"use server";

import { writeFile, mkdir } from "fs/promises";
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
