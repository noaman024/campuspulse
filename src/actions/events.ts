"use server";

import dbConnect from "@/lib/db/connection";
import Event from "@/models/Event";
import { requireAdmin, getCurrentUser } from "@/lib/auth/rbac";
import { resolveLocalOrDirectUrlAction } from "@/actions/upload";
import { v4 as uuidv4 } from "uuid";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export async function createEvent(data: {
  title: string;
  description: string;
  category: string;
  tags: string[];
  bannerUrl?: string;
  videoUrl?: string;
  eventDate: string;
  venue: string;
  maxCapacity: number;
  status?: string;
  chiefGuest?: string;
  facultyCoordinator?: string;
  objectives?: string;
  outcomes?: string;
}): Promise<{ success: boolean; event?: any; error?: string }> {
  try {
    await requireAdmin();
    await dbConnect();

    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "User session not found. Please log in again." };
    }

    if (!data.title || !data.title.trim()) {
      return { success: false, error: "Event title is required." };
    }
    if (!data.description || !data.description.trim()) {
      return { success: false, error: "Event description is required." };
    }

    const baseSlug = slugify(data.title.trim()) || `event-${Date.now()}`;
    let slug = baseSlug;
    let counter = 1;
    while (await Event.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const resolvedBanner = data.bannerUrl ? await resolveLocalOrDirectUrlAction(data.bannerUrl) : undefined;
    const resolvedVideo = data.videoUrl ? await resolveLocalOrDirectUrlAction(data.videoUrl) : undefined;

    // Resilient Date parsing: If empty or invalid, fallback to 7 days from now
    let parsedDate = new Date(data.eventDate);
    if (!data.eventDate || isNaN(parsedDate.getTime())) {
      parsedDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    }

    const event = await Event.create({
      title: data.title.trim(),
      description: data.description.trim(),
      category: (data.category as "Technical" | "Cultural" | "Sports" | "Workshop") || "Technical",
      tags: Array.isArray(data.tags) ? data.tags : [],
      bannerUrl: resolvedBanner,
      venue: (data.venue && data.venue.trim()) || "Campus Main Auditorium",
      maxCapacity: Number(data.maxCapacity) > 0 ? Number(data.maxCapacity) : 100,
      slug,
      organizerId: user.id,
      eventDate: parsedDate,
      status: (data.status || "upcoming") as "draft" | "upcoming" | "ongoing" | "completed" | "cancelled",
      mediaGallery: {
        photos: resolvedBanner ? [resolvedBanner] : [],
        rawClips: resolvedVideo ? [resolvedVideo] : [],
        generatedHighlightVideoUrl: resolvedVideo || undefined,
      },
      reportData: {
        chiefGuest: data.chiefGuest || undefined,
        facultyCoordinator: data.facultyCoordinator || undefined,
        objectives: data.objectives || undefined,
        outcomes: data.outcomes || undefined,
      },
    });

    return {
      success: true,
      event: JSON.parse(JSON.stringify(event)),
    };
  } catch (err) {
    console.error("Error creating event:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to create event. Please verify all details.",
    };
  }
}

export async function updateEvent(
  eventId: string,
  data: Partial<{
    title: string;
    description: string;
    category: string;
    tags: string[];
    bannerUrl: string;
    videoUrl: string;
    eventDate: string;
    venue: string;
    maxCapacity: number;
    status: string;
    chiefGuest: string;
    facultyCoordinator: string;
    objectives: string;
    outcomes: string;
  }>
) {
  await requireAdmin();
  await dbConnect();

  const updateData: Record<string, unknown> = { ...data };
  if (data.eventDate) {
    updateData.eventDate = new Date(data.eventDate);
  }

  if (data.bannerUrl !== undefined) {
    const resolved = await resolveLocalOrDirectUrlAction(data.bannerUrl);
    updateData.bannerUrl = resolved;
    if (resolved) {
      await Event.findByIdAndUpdate(eventId, {
        $addToSet: { "mediaGallery.photos": resolved },
      });
    }
  }

  if (data.videoUrl !== undefined) {
    const resolved = await resolveLocalOrDirectUrlAction(data.videoUrl);
    updateData["mediaGallery.generatedHighlightVideoUrl"] = resolved;
    if (resolved) {
      await Event.findByIdAndUpdate(eventId, {
        $addToSet: { "mediaGallery.rawClips": resolved },
      });
    }
  }

  if (data.chiefGuest !== undefined) updateData["reportData.chiefGuest"] = data.chiefGuest;
  if (data.facultyCoordinator !== undefined) updateData["reportData.facultyCoordinator"] = data.facultyCoordinator;
  if (data.objectives !== undefined) updateData["reportData.objectives"] = data.objectives;
  if (data.outcomes !== undefined) updateData["reportData.outcomes"] = data.outcomes;

  const event = await Event.findByIdAndUpdate(eventId, updateData, { new: true });
  if (!event) throw new Error("Event not found");

  return JSON.parse(JSON.stringify(event));
}

export async function deleteEvent(eventId: string) {
  await requireAdmin();
  await dbConnect();

  const event = await Event.findByIdAndUpdate(
    eventId,
    { status: "cancelled" },
    { new: true }
  );
  if (!event) throw new Error("Event not found");

  return JSON.parse(JSON.stringify(event));
}

export async function getEvents(filters?: {
  category?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  await dbConnect();

  const query: Record<string, unknown> = {};

  if (filters?.category) query.category = filters.category;
  if (filters?.status) query.status = filters.status;
  else query.status = { $ne: "cancelled" };

  if (filters?.search) {
    query.$or = [
      { title: { $regex: filters.search, $options: "i" } },
      { description: { $regex: filters.search, $options: "i" } },
      { tags: { $in: [new RegExp(filters.search, "i")] } },
    ];
  }

  const page = filters?.page || 1;
  const limit = filters?.limit || 12;
  const skip = (page - 1) * limit;

  const [events, total] = await Promise.all([
    Event.find(query)
      .sort({ createdAt: -1, _id: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Event.countDocuments(query),
  ]);

  return {
    events: JSON.parse(JSON.stringify(events)),
    total,
    pages: Math.ceil(total / limit),
    page,
  };
}

export async function getEventBySlug(slug: string) {
  await dbConnect();
  const event = await Event.findOne({ slug }).populate("organizerId", "name email department").lean();
  if (!event) return null;
  return JSON.parse(JSON.stringify(event));
}

export async function getEventById(eventId: string) {
  await dbConnect();
  const event = await Event.findById(eventId).lean();
  if (!event) return null;
  return JSON.parse(JSON.stringify(event));
}

export async function rsvpEvent(eventId: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Authentication required");

  await dbConnect();

  const event = await Event.findById(eventId);
  if (!event) throw new Error("Event not found");

  if (event.status !== "upcoming" && event.status !== "ongoing") {
    throw new Error("Event is not accepting registrations");
  }

  const alreadyRegistered = event.registeredUsers.some(
    (r) => r.userId.toString() === user.id
  );
  if (alreadyRegistered) throw new Error("Already registered for this event");

  if (event.registeredUsers.length >= event.maxCapacity) {
    throw new Error("Event is at full capacity");
  }

  const qrCodeToken = uuidv4();

  event.registeredUsers.push({
    userId: user.id as unknown as import("mongoose").Types.ObjectId,
    registeredAt: new Date(),
    attended: false,
    qrCodeToken,
  });

  await event.save();

  return { qrCodeToken, message: "Successfully registered!" };
}

export async function cancelRsvp(eventId: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Authentication required");

  await dbConnect();

  await Event.findByIdAndUpdate(eventId, {
    $pull: { registeredUsers: { userId: user.id } },
  });

  return { message: "Registration cancelled" };
}

export async function markAttendance(eventId: string, qrCodeToken: string) {
  await requireAdmin();
  await dbConnect();

  const event = await Event.findOneAndUpdate(
    { _id: eventId, "registeredUsers.qrCodeToken": qrCodeToken },
    { $set: { "registeredUsers.$.attended": true } },
    { new: true }
  );

  if (!event) throw new Error("Invalid QR code or event not found");

  return { message: "Attendance marked successfully" };
}

export async function verifyTicketPass(qrCodeToken: string) {
  await dbConnect();

  const event = await Event.findOne({ "registeredUsers.qrCodeToken": qrCodeToken })
    .populate("organizerId", "name email department")
    .populate("registeredUsers.userId", "name email department rollNumber")
    .lean();

  if (!event) {
    return { valid: false, message: "Invalid or unrecognized ticket pass QR code." };
  }

  const reg = (event.registeredUsers as Array<any>)?.find(
    (r) => r.qrCodeToken === qrCodeToken
  );

  if (!reg) {
    return { valid: false, message: "Ticket registration record not found." };
  }

  const attendee = reg.userId || {};

  return {
    valid: true,
    event: {
      _id: String(event._id),
      title: event.title,
      slug: event.slug,
      venue: event.venue,
      eventDate: event.eventDate,
      category: event.category,
      status: event.status,
      bannerUrl: event.bannerUrl,
    },
    attendee: {
      id: String(attendee._id || ""),
      name: attendee.name || "Student Attendee",
      email: attendee.email || "student@campus.edu",
      department: attendee.department || "General",
      rollNumber: attendee.rollNumber || "N/A",
    },
    registration: {
      registeredAt: reg.registeredAt,
      attended: reg.attended || false,
      qrCodeToken: reg.qrCodeToken,
    },
    organizer: event.organizerId
      ? {
          name: (event.organizerId as any).name,
          email: (event.organizerId as any).email,
        }
      : null,
  };
}

export async function checkInAttendee(qrCodeToken: string) {
  await requireAdmin();
  await dbConnect();

  const event = await Event.findOneAndUpdate(
    { "registeredUsers.qrCodeToken": qrCodeToken },
    { $set: { "registeredUsers.$.attended": true } },
    { new: true }
  );

  if (!event) throw new Error("Ticket not found or could not be updated.");

  return { success: true, message: "Attendee successfully checked in!" };
}

export async function getAdminEvents() {
  await requireAdmin();
  await dbConnect();

  const events = await Event.find({})
    .populate("organizerId", "name email")
    .sort({ createdAt: -1, _id: -1 })
    .lean();

  return JSON.parse(JSON.stringify(events));
}

export async function addEventMedia(
  eventId: string,
  media: { photos?: string[]; rawClips?: string[] }
) {
  await requireAdmin();
  await dbConnect();

  const event = await Event.findById(eventId);
  if (!event) throw new Error("Event not found");

  if (!event.mediaGallery) {
    event.mediaGallery = { photos: [], rawClips: [] };
  }
  if (!Array.isArray(event.mediaGallery.photos)) {
    event.mediaGallery.photos = [];
  }
  if (!Array.isArray(event.mediaGallery.rawClips)) {
    event.mediaGallery.rawClips = [];
  }

  if (media.photos && media.photos.length > 0) {
    const resolvedPhotos = await Promise.all(
      media.photos.map((p) => resolveLocalOrDirectUrlAction(p))
    );
    const existingPhotos = new Set(event.mediaGallery.photos || []);
    resolvedPhotos.forEach((p) => {
      if (p && typeof p === "string" && !existingPhotos.has(p)) {
        event.mediaGallery.photos.push(p);
      }
    });

    // If event has no banner or banner is empty, auto-set to the first uploaded photo
    if (!event.bannerUrl || event.bannerUrl.trim() === "" || event.bannerUrl.startsWith("file://")) {
      event.bannerUrl = resolvedPhotos[0];
    }
  }

  if (media.rawClips && media.rawClips.length > 0) {
    const resolvedClips = await Promise.all(
      media.rawClips.map((c) => resolveLocalOrDirectUrlAction(c))
    );
    const existingClips = new Set(event.mediaGallery.rawClips || []);
    resolvedClips.forEach((c) => {
      if (c && typeof c === "string" && !existingClips.has(c)) {
        event.mediaGallery.rawClips.push(c);
      }
    });

    if (!event.mediaGallery.generatedHighlightVideoUrl || event.mediaGallery.generatedHighlightVideoUrl.startsWith("file://")) {
      event.mediaGallery.generatedHighlightVideoUrl = resolvedClips[0];
    }
  }

  event.markModified("mediaGallery");
  await event.save();
  return JSON.parse(JSON.stringify(event));
}

export async function setEventBanner(eventId: string, bannerUrl: string) {
  await requireAdmin();
  await dbConnect();

  const event = await Event.findById(eventId);
  if (!event) throw new Error("Event not found");

  event.bannerUrl = bannerUrl;

  if (!event.mediaGallery) {
    event.mediaGallery = { photos: [], rawClips: [] };
  }
  if (!Array.isArray(event.mediaGallery.photos)) {
    event.mediaGallery.photos = [];
  }

  // Ensure this photo is also in the photos list
  if (bannerUrl && !event.mediaGallery.photos.includes(bannerUrl)) {
    event.mediaGallery.photos.unshift(bannerUrl);
    event.markModified("mediaGallery");
  }

  await event.save();
  return JSON.parse(JSON.stringify(event));
}

export async function removeEventMedia(
  eventId: string,
  media: { photoUrl?: string; clipUrl?: string }
) {
  await requireAdmin();
  await dbConnect();

  const event = await Event.findById(eventId);
  if (!event) throw new Error("Event not found");

  if (media.photoUrl && event.mediaGallery?.photos) {
    event.mediaGallery.photos = event.mediaGallery.photos.filter(
      (p) => p !== media.photoUrl
    );
    // If the banner being removed is this photo, switch to the next available photo or clear
    if (event.bannerUrl === media.photoUrl) {
      event.bannerUrl = event.mediaGallery.photos[0] || "";
    }
  }

  if (media.clipUrl && event.mediaGallery?.rawClips) {
    event.mediaGallery.rawClips = event.mediaGallery.rawClips.filter(
      (c) => c !== media.clipUrl
    );
  }

  event.markModified("mediaGallery");
  await event.save();
  return JSON.parse(JSON.stringify(event));
}

export async function updateEventReport(
  eventId: string,
  reportData: {
    chiefGuest?: string;
    objectives?: string;
    outcomes?: string;
    facultyCoordinator?: string;
    generatedPdfUrl?: string;
  }
) {
  await requireAdmin();
  await dbConnect();

  const event = await Event.findByIdAndUpdate(
    eventId,
    { $set: { reportData } },
    { new: true }
  );
  if (!event) throw new Error("Event not found");

  return JSON.parse(JSON.stringify(event));
}

export async function toggleAttendance(eventId: string, userId: string) {
  await requireAdmin();
  await dbConnect();

  const event = await Event.findById(eventId);
  if (!event) throw new Error("Event not found");

  const reg = event.registeredUsers.find(
    (r) => r.userId.toString() === userId.toString()
  );
  if (!reg) throw new Error("Registration not found");

  reg.attended = !reg.attended;
  await event.save();

  return { attended: reg.attended, message: `Attendance updated to ${reg.attended ? 'Attended' : 'Unattended'}` };
}

