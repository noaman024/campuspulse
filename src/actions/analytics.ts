"use server";

import dbConnect from "@/lib/db/connection";
import Event from "@/models/Event";
import User from "@/models/User";
import FeedbackForm from "@/models/FeedbackForm";
import FeedbackSubmission from "@/models/FeedbackSubmission";
import EventQnA from "@/models/EventQnA";
import { requireAdmin } from "@/lib/auth/rbac";

export async function getDashboardStats() {
  await requireAdmin();
  await dbConnect();

  const [
    totalEvents,
    upcomingEvents,
    completedEvents,
    totalUsers,
    totalFeedbackForms,
    totalFeedbackSubmissions,
    totalQuestions,
  ] = await Promise.all([
    Event.countDocuments({ status: { $ne: "cancelled" } }),
    Event.countDocuments({ status: "upcoming" }),
    Event.countDocuments({ status: "completed" }),
    User.countDocuments(),
    FeedbackForm.countDocuments(),
    FeedbackSubmission.countDocuments(),
    EventQnA.countDocuments(),
  ]);

  // Get total registrations across all events
  const events = await Event.find({ status: { $ne: "cancelled" } })
    .select("registeredUsers")
    .lean();
  const totalRegistrations = events.reduce(
    (sum, e) => sum + (e.registeredUsers?.length || 0),
    0
  );

  const totalAttended = events.reduce(
    (sum, e) =>
      sum +
      (e.registeredUsers?.filter((r) => r.attended).length || 0),
    0
  );

  return {
    totalEvents,
    upcomingEvents,
    completedEvents,
    totalUsers,
    totalRegistrations,
    totalAttended,
    totalFeedbackForms,
    totalFeedbackSubmissions,
    totalQuestions,
    attendanceRate: totalRegistrations > 0
      ? Math.round((totalAttended / totalRegistrations) * 100)
      : 0,
  };
}

export async function getCategoryDistribution() {
  await requireAdmin();
  await dbConnect();

  const result = await Event.aggregate([
    { $match: { status: { $ne: "cancelled" } } },
    { $group: { _id: "$category", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  return result.map((r) => ({
    category: r._id,
    count: r.count,
  }));
}

export async function getMonthlyEventData() {
  await requireAdmin();
  await dbConnect();

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const result = await Event.aggregate([
    { $match: { eventDate: { $gte: sixMonthsAgo }, status: { $ne: "cancelled" } } },
    {
      $group: {
        _id: {
          year: { $year: "$eventDate" },
          month: { $month: "$eventDate" },
        },
        events: { $sum: 1 },
        registrations: { $sum: { $size: "$registeredUsers" } },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  return result.map((r) => ({
    month: months[r._id.month - 1],
    events: r.events,
    registrations: r.registrations,
  }));
}

export async function getRecentEvents(limit: number = 5) {
  await requireAdmin();
  await dbConnect();

  const events = await Event.find({})
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  return JSON.parse(JSON.stringify(events));
}

export async function getFeedbackStats(eventId: string) {
  await requireAdmin();
  await dbConnect();

  const form = await FeedbackForm.findOne({ eventId }).lean();
  if (!form) return null;

  const submissions = await FeedbackSubmission.find({ eventId }).lean();

  // Calculate average ratings for rating-type questions
  const ratingStats = form.questions
    .filter((q) => q.type === "rating" || q.type === "likert")
    .map((question) => {
      const answers = submissions
        .flatMap((s) => s.answers)
        .filter((a) => a.questionId === question.questionId)
        .map((a) => Number(a.value))
        .filter((v) => !isNaN(v));

      const avg = answers.length > 0
        ? answers.reduce((sum, v) => sum + v, 0) / answers.length
        : 0;

      return {
        questionId: question.questionId,
        prompt: question.prompt,
        average: Math.round(avg * 10) / 10,
        count: answers.length,
      };
    });

  return {
    formTitle: form.title,
    totalSubmissions: submissions.length,
    ratingStats,
  };
}

export async function getRecentRegistrations(limit: number = 10) {
  await requireAdmin();
  await dbConnect();

  const events = await Event.find({ "registeredUsers.0": { $exists: true } })
    .populate("registeredUsers.userId", "name email department rollNumber")
    .select("title slug category eventDate registeredUsers")
    .lean();

  interface RegistrationItem {
    eventId: string;
    eventTitle: string;
    eventSlug: string;
    eventCategory: string;
    eventDate: Date;
    userId: string;
    userName: string;
    userEmail: string;
    userDepartment: string;
    registeredAt: Date;
    attended: boolean;
    qrCodeToken: string;
  }

  const registrations: RegistrationItem[] = [];

  for (const event of events) {
    if (event.registeredUsers && Array.isArray(event.registeredUsers)) {
      for (const reg of event.registeredUsers) {
        const user = reg.userId as unknown as {
          _id: import("mongoose").Types.ObjectId;
          name?: string;
          email?: string;
          department?: string;
        } | null;

        registrations.push({
          eventId: event._id.toString(),
          eventTitle: event.title,
          eventSlug: event.slug,
          eventCategory: event.category,
          eventDate: event.eventDate,
          userId: user?._id ? user._id.toString() : (reg.userId?.toString() || ""),
          userName: user?.name || "Student",
          userEmail: user?.email || "student@campus.com",
          userDepartment: user?.department || "General",
          registeredAt: reg.registeredAt || new Date(),
          attended: !!reg.attended,
          qrCodeToken: reg.qrCodeToken || "",
        });
      }
    }
  }

  // Sort latest first
  registrations.sort(
    (a, b) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime()
  );

  return JSON.parse(JSON.stringify(registrations.slice(0, limit)));
}

export interface UserDirectoryItem {
  id: string;
  name: string;
  email: string;
  role: "student" | "admin";
  department: string;
  rollNumber?: string;
  createdAt: string;
}

export async function getAllUsersDirectory() {
  await requireAdmin();
  await dbConnect();

  const rawUsers = await User.find({})
    .select("_id name email role department rollNumber createdAt")
    .sort({ createdAt: -1 })
    .lean();

  const students: UserDirectoryItem[] = [];
  const admins: UserDirectoryItem[] = [];

  for (const u of rawUsers) {
    const item: UserDirectoryItem = {
      id: u._id.toString(),
      name: u.name || "Unnamed",
      email: u.email,
      role: (u.role === "admin" ? "admin" : "student"),
      department: u.department || "General",
      rollNumber: u.rollNumber || "",
      createdAt: u.createdAt ? new Date(u.createdAt).toISOString() : new Date().toISOString(),
    };

    if (item.role === "admin") {
      admins.push(item);
    } else {
      students.push(item);
    }
  }

  return {
    totalCount: rawUsers.length,
    students,
    admins,
    studentCount: students.length,
    adminCount: admins.length,
  };
}

export interface EventRegistrationDetail {
  id: string;
  title: string;
  slug: string;
  category: string;
  eventDate: string;
  venue: string;
  status: string;
  maxCapacity: number;
  totalRegistrations: number;
  attendedCount: number;
  turnoutRate: number;
  attendees: {
    userId: string;
    name: string;
    email: string;
    department: string;
    rollNumber?: string;
    attended: boolean;
    registeredAt: string;
  }[];
}

export async function getEventsRegistrationDetails() {
  await requireAdmin();
  await dbConnect();

  const events = await Event.find({ status: { $ne: "cancelled" } })
    .populate("registeredUsers.userId", "name email department rollNumber")
    .select("title slug category eventDate venue status maxCapacity registeredUsers")
    .sort({ createdAt: -1, _id: -1 })
    .lean();

  const result: EventRegistrationDetail[] = events.map((ev) => {
    const attendees = (ev.registeredUsers || []).map((r) => {
      const u = r.userId as unknown as {
        _id?: import("mongoose").Types.ObjectId;
        name?: string;
        email?: string;
        department?: string;
        rollNumber?: string;
      } | null;

      return {
        userId: u?._id ? u._id.toString() : (r.userId?.toString() || ""),
        name: u?.name || "Student",
        email: u?.email || "N/A",
        department: u?.department || "General",
        rollNumber: u?.rollNumber || "",
        attended: !!r.attended,
        registeredAt: r.registeredAt ? new Date(r.registeredAt).toISOString() : new Date().toISOString(),
      };
    });

    const totalReg = attendees.length;
    const attended = attendees.filter((a) => a.attended).length;
    const turnout = totalReg > 0 ? Math.round((attended / totalReg) * 100) : 0;

    return {
      id: ev._id.toString(),
      title: ev.title,
      slug: ev.slug,
      category: ev.category,
      eventDate: ev.eventDate ? new Date(ev.eventDate).toISOString() : new Date().toISOString(),
      venue: ev.venue,
      status: ev.status,
      maxCapacity: ev.maxCapacity || 100,
      totalRegistrations: totalReg,
      attendedCount: attended,
      turnoutRate: turnout,
      attendees,
    };
  });

  return JSON.parse(JSON.stringify(result));
}


