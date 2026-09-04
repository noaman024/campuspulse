export const DEFAULT_CATEGORY_BANNERS: Record<string, string> = {
  Technical: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80",
  Cultural: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
  Sports: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80",
  Workshop: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80",
};

export const BANNER_PRESETS = [
  {
    category: "Technical",
    label: "Code & Hackathon",
    url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80",
  },
  {
    category: "Technical",
    label: "Robotics & Tech",
    url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    category: "Technical",
    label: "Cloud & Dev",
    url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
  },
  {
    category: "Cultural",
    label: "Rangeela & Fest",
    url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
  },
  {
    category: "Cultural",
    label: "Concert & Music",
    url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80",
  },
  {
    category: "Cultural",
    label: "Stage & Lights",
    url: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1200&q=80",
  },
  {
    category: "Sports",
    label: "Cricket & Field",
    url: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    category: "Sports",
    label: "Athletics & Track",
    url: "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=1200&q=80",
  },
  {
    category: "Sports",
    label: "Football & Stadium",
    url: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80",
  },
  {
    category: "Workshop",
    label: "Masterclass & Seminar",
    url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80",
  },
  {
    category: "Workshop",
    label: "Lecture & Training",
    url: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80",
  },
  {
    category: "Workshop",
    label: "Career & Mock Tests",
    url: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
  },
];

export function getEventDisplayBanner(event?: {
  bannerUrl?: string | null;
  category?: string;
  mediaGallery?: { photos?: string[] } | null;
}): string {
  if (!event) return DEFAULT_CATEGORY_BANNERS.Technical;

  // 1. Check direct bannerUrl (if valid and not local file://)
  if (event.bannerUrl && typeof event.bannerUrl === "string") {
    const trimmed = event.bannerUrl.trim();
    if (trimmed && !trimmed.startsWith("file://")) {
      return trimmed;
    }
  }

  // 2. Check media gallery photos
  const photos = event.mediaGallery?.photos;
  if (Array.isArray(photos) && photos.length > 0) {
    const firstValid = photos.find((p) => typeof p === "string" && p.trim() && !p.startsWith("file://"));
    if (firstValid) return firstValid.trim();
  }

  // 3. Fall back to category default banner
  const cat = event.category || "Technical";
  return DEFAULT_CATEGORY_BANNERS[cat] || DEFAULT_CATEGORY_BANNERS.Technical;
}
