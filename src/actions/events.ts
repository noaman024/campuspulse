"use server";

import dbConnect from "@/lib/db/connection";
import Event, { IEvent } from "@/models/Event";
import { requireAdmin, getCurrentUser } from "@/lib/auth/rbac";
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
}) {
  await requireAdmin();
  await dbConnect();

  const user = await getCurrentUser();
  if (!user) throw new Error("User not found");

  const baseSlug = slugify(data.title);
  let slug = baseSlug;
  let counter = 1;
  while (await Event.findOne({ slug })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  const event = await Event.create({
    title: data.title,
    description: data.description,
    category: data.category as "Technical" | "Cultural" | "Sports" | "Workshop",
    tags: data.tags,
    bannerUrl: data.bannerUrl,
    venue: data.venue,
    maxCapacity: data.maxCapacity,
    slug,
    organizerId: user.id,
    eventDate: new Date(data.eventDate),
    status: (data.status || "upcoming") as "draft" | "upcoming" | "ongoing" | "completed" | "cancelled",
    mediaGallery: {
      photos: [],
      rawClips: [],
      generatedHighlightVideoUrl: data.videoUrl || undefined,
    },
    reportData: {
      chiefGuest: data.chiefGuest || undefined,
      facultyCoordinator: data.facultyCoordinator || undefined,
      objectives: data.objectives || undefined,
      outcomes: data.outcomes || undefined,
    },
  });

  return JSON.parse(JSON.stringify(event));
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

  if (data.videoUrl !== undefined) {
    updateData["mediaGallery.generatedHighlightVideoUrl"] = data.videoUrl;
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
      .sort({ eventDate: -1 })
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
    .sort({ createdAt: -1 })
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

  if (media.photos && media.photos.length > 0) {
    const existingPhotos = new Set(event.mediaGallery.photos || []);
    media.photos.forEach((p) => {
      if (p && !existingPhotos.has(p)) {
        event.mediaGallery.photos.push(p);
      }
    });
  }

  if (media.rawClips && media.rawClips.length > 0) {
    const existingClips = new Set(event.mediaGallery.rawClips || []);
    media.rawClips.forEach((c) => {
      if (c && !existingClips.has(c)) {
        event.mediaGallery.rawClips.push(c);
      }
    });
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
  }

  if (media.clipUrl && event.mediaGallery?.rawClips) {
    event.mediaGallery.rawClips = event.mediaGallery.rawClips.filter(
      (c) => c !== media.clipUrl
    );
  }

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

