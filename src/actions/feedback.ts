"use server";

import dbConnect from "@/lib/db/connection";
import FeedbackForm from "@/models/FeedbackForm";
import FeedbackSubmission from "@/models/FeedbackSubmission";
import Event from "@/models/Event";
import { requireAdmin, getCurrentUser } from "@/lib/auth/rbac";
import { v4 as uuidv4 } from "uuid";

export async function createFeedbackForm(data: {
  eventId: string;
  title: string;
  instructions?: string;
  questions: {
    prompt: string;
    type: "rating" | "mcq" | "text" | "likert";
    options: string[];
    isRequired: boolean;
  }[];
}) {
  await requireAdmin();
  await dbConnect();

  const event = await Event.findById(data.eventId);
  if (!event) throw new Error("Event not found");

  const existingForm = await FeedbackForm.findOne({ eventId: data.eventId });
  if (existingForm) throw new Error("Feedback form already exists for this event");

  const questions = data.questions.map((q, index) => ({
    ...q,
    questionId: uuidv4(),
    order: index,
  }));

  const form = await FeedbackForm.create({
    eventId: data.eventId,
    title: data.title,
    instructions: data.instructions,
    isPublished: true,
    acceptingResponses: true,
    questions,
  });

  return JSON.parse(JSON.stringify(form));
}

export async function updateFeedbackForm(
  formId: string,
  data: {
    title?: string;
    instructions?: string;
    isPublished?: boolean;
    acceptingResponses?: boolean;
    questions?: {
      questionId?: string;
      prompt: string;
      type: "rating" | "mcq" | "text" | "likert";
      options: string[];
      isRequired: boolean;
    }[];
  }
) {
  await requireAdmin();
  await dbConnect();

  const updateData: Record<string, unknown> = {};
  if (data.title !== undefined) updateData.title = data.title;
  if (data.instructions !== undefined) updateData.instructions = data.instructions;
  if (data.isPublished !== undefined) updateData.isPublished = data.isPublished;
  if (data.acceptingResponses !== undefined) updateData.acceptingResponses = data.acceptingResponses;

  if (data.questions) {
    updateData.questions = data.questions.map((q, index) => ({
      ...q,
      questionId: q.questionId || uuidv4(),
      order: index,
    }));
  }

  const form = await FeedbackForm.findByIdAndUpdate(formId, updateData, { new: true });
  if (!form) throw new Error("Feedback form not found");

  return JSON.parse(JSON.stringify(form));
}

export async function deleteFeedbackForm(formId: string) {
  await requireAdmin();
  await dbConnect();

  await FeedbackSubmission.deleteMany({ formId });
  await FeedbackForm.findByIdAndDelete(formId);

  return { message: "Form deleted successfully" };
}

export async function getFeedbackFormByEvent(eventId: string) {
  await dbConnect();
  const form = await FeedbackForm.findOne({ eventId }).lean();
  if (!form) return null;
  return JSON.parse(JSON.stringify(form));
}

export async function getFeedbackFormById(formId: string) {
  await dbConnect();
  const form = await FeedbackForm.findById(formId).lean();
  if (!form) return null;
  return JSON.parse(JSON.stringify(form));
}

export async function getAllFeedbackForms() {
  await requireAdmin();
  await dbConnect();

  const forms = await FeedbackForm.find({})
    .populate("eventId", "title slug category eventDate")
    .sort({ createdAt: -1 })
    .lean();

  return JSON.parse(JSON.stringify(forms));
}

export async function submitFeedback(data: {
  formId: string;
  eventId: string;
  isAnonymous: boolean;
  answers: { questionId: string; value: string | number | string[] }[];
}) {
  await dbConnect();

  const form = await FeedbackForm.findById(data.formId);
  if (!form) throw new Error("Feedback form not found");
  if (!form.isPublished) throw new Error("Form is not published");
  if (!form.acceptingResponses) throw new Error("Form is no longer accepting responses");

  const user = await getCurrentUser();
  const studentId = data.isAnonymous ? null : user?.id;

  if (!data.isAnonymous && user) {
    const existing = await FeedbackSubmission.findOne({
      formId: data.formId,
      studentId: user.id,
      isAnonymous: false,
    });
    if (existing) throw new Error("You have already submitted feedback for this event");
  }

  const submission = await FeedbackSubmission.create({
    formId: data.formId,
    eventId: data.eventId,
    studentId,
    isAnonymous: data.isAnonymous,
    answers: data.answers,
  });

  return JSON.parse(JSON.stringify(submission));
}

export async function getFeedbackResponses(eventId: string) {
  await requireAdmin();
  await dbConnect();

  const form = await FeedbackForm.findOne({ eventId }).lean();
  if (!form) return { form: null, submissions: [] };

  const submissions = await FeedbackSubmission.find({ eventId })
    .populate("studentId", "name email department")
    .sort({ submittedAt: -1 })
    .lean();

  return {
    form: JSON.parse(JSON.stringify(form)),
    submissions: JSON.parse(JSON.stringify(submissions)),
  };
}

export async function getAvailableFeedbackForms() {
  await dbConnect();

  const user = await getCurrentUser();

  const forms = await FeedbackForm.find({
    isPublished: { $ne: false },
    acceptingResponses: { $ne: false },
  })
    .populate("eventId", "title slug category eventDate venue bannerUrl status")
    .sort({ createdAt: -1 })
    .lean();

  if (!user) {
    return JSON.parse(JSON.stringify(forms));
  }

  // Check submissions by this student
  const submissions = await FeedbackSubmission.find({
    studentId: user.id,
  })
    .select("formId submittedAt")
    .lean();

  const submittedFormIds = new Set(submissions.map((s) => s.formId.toString()));

  const formsWithStatus = forms.map((form) => ({
    ...form,
    hasSubmitted: submittedFormIds.has(form._id.toString()),
  }));

  return JSON.parse(JSON.stringify(formsWithStatus));
}
