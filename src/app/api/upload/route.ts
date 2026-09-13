import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { existsSync } from "fs";
import { requireAdmin } from "@/lib/auth/rbac";

export async function POST(request: NextRequest) {
  try {
    // Require admin session for uploads
    await requireAdmin();

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate mime types: images and videos
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
      return NextResponse.json(
        { error: "Invalid file format. Please upload an image or video." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    try {
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
      }

      // Clean file name
      const ext = path.extname(file.name) || (file.type.startsWith("video/") ? ".mp4" : ".png");
      const cleanBase = path
        .basename(file.name, ext)
        .replace(/[^a-zA-Z0-9_-]/g, "_")
        .toLowerCase();
      const uniqueFileName = `${Date.now()}_${cleanBase}${ext}`;
      const filePath = path.join(uploadDir, uniqueFileName);

      await writeFile(filePath, buffer);

      const publicUrl = `/uploads/${uniqueFileName}`;

      return NextResponse.json({
        success: true,
        url: publicUrl,
        fileName: uniqueFileName,
        fileSize: file.size,
        mimeType: file.type,
      });
    } catch (fsError) {
      console.warn("Read-only filesystem in api/upload. Using Data URI fallback:", fsError);

      if (file.type.startsWith("image/")) {
        const base64 = buffer.toString("base64");
        return NextResponse.json({
          success: true,
          url: `data:${file.type};base64,${base64}`,
          fileName: file.name,
          fileSize: file.size,
          mimeType: file.type,
        });
      }

      throw fsError;
    }
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to upload file" },
      { status: 500 }
    );
  }
}
