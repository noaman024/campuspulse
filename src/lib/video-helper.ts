/**
 * Universal video embed helper
 * Supports YouTube (standard, shorts, embed, youtu.be), Google Drive, Vimeo, and direct video links
 */
export function getVideoEmbedInfo(url?: string | null): { isEmbed: boolean; embedUrl: string } {
  if (!url || typeof url !== "string") return { isEmbed: false, embedUrl: "" };
  const trimmed = url.trim();

  // YouTube Shorts: https://www.youtube.com/shorts/XYZ
  const shortsMatch = trimmed.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/i);
  if (shortsMatch && shortsMatch[1]) {
    return { isEmbed: true, embedUrl: `https://www.youtube.com/embed/${shortsMatch[1]}` };
  }

  // YouTube youtu.be/XYZ
  const youtuBeMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]+)/i);
  if (youtuBeMatch && youtuBeMatch[1]) {
    return { isEmbed: true, embedUrl: `https://www.youtube.com/embed/${youtuBeMatch[1]}` };
  }

  // YouTube watch?v=XYZ
  const ytWatchMatch = trimmed.match(/[?&]v=([a-zA-Z0-9_-]+)/i);
  if (ytWatchMatch && ytWatchMatch[1]) {
    return { isEmbed: true, embedUrl: `https://www.youtube.com/embed/${ytWatchMatch[1]}` };
  }

  // YouTube /embed/XYZ
  const ytEmbedMatch = trimmed.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/i);
  if (ytEmbedMatch && ytEmbedMatch[1]) {
    return { isEmbed: true, embedUrl: `https://www.youtube.com/embed/${ytEmbedMatch[1]}` };
  }

  // Google Drive: https://drive.google.com/file/d/XYZ/view or /open?id=XYZ
  const gDriveMatch =
    trimmed.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/i) ||
    trimmed.match(/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/i);
  if (gDriveMatch && gDriveMatch[1]) {
    return { isEmbed: true, embedUrl: `https://drive.google.com/file/d/${gDriveMatch[1]}/preview` };
  }

  // Vimeo: https://vimeo.com/123456
  const vimeoMatch = trimmed.match(/vimeo\.com\/([0-9]+)/i);
  if (vimeoMatch && vimeoMatch[1]) {
    return { isEmbed: true, embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}` };
  }

  // Direct video URL, CDN, or Base64 Data URI
  return { isEmbed: false, embedUrl: trimmed };
}
