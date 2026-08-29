"use server";

import dbConnect from "@/lib/db/connection";
import EventQnA from "@/models/EventQnA";
import { requireAdmin, getCurrentUser, requireAuth } from "@/lib/auth/rbac";

export async function askQuestion(data: { eventId: string; question: string }) {
  await requireAuth();
  const user = await getCurrentUser();
  if (!user) throw new Error("User not found");

  await dbConnect();

  const qna = await EventQnA.create({
    eventId: data.eventId,
    studentId: user.id,
    question: data.question,
  });

  return JSON.parse(JSON.stringify(qna));
}

export async function answerQuestion(questionId: string, answerText: string) {
  await requireAdmin();
  const user = await getCurrentUser();
  if (!user) throw new Error("User not found");

  await dbConnect();

  const qna = await EventQnA.findByIdAndUpdate(
    questionId,
    {
      answer: {
        text: answerText,
        answeredBy: user.id,
        answeredAt: new Date(),
      },
    },
    { new: true }
  )
    .populate("studentId", "name department")
    .populate("answer.answeredBy", "name");

  if (!qna) throw new Error("Question not found");

  return JSON.parse(JSON.stringify(qna));
}

export async function upvoteQuestion(questionId: string) {
  await requireAuth();
  const user = await getCurrentUser();
  if (!user) throw new Error("User not found");

  await dbConnect();

  const qna = await EventQnA.findById(questionId);
  if (!qna) throw new Error("Question not found");

  const alreadyUpvoted = qna.upvotes.some(
    (id) => id.toString() === user.id
  );

  if (alreadyUpvoted) {
    await EventQnA.findByIdAndUpdate(questionId, {
      $pull: { upvotes: user.id },
    });
  } else {
    await EventQnA.findByIdAndUpdate(questionId, {
      $addToSet: { upvotes: user.id },
    });
  }

  const updated = await EventQnA.findById(questionId)
    .populate("studentId", "name department")
    .populate("answer.answeredBy", "name")
    .lean();

  return JSON.parse(JSON.stringify(updated));
}

export async function pinQuestion(questionId: string) {
  await requireAdmin();
  await dbConnect();

  const qna = await EventQnA.findById(questionId);
  if (!qna) throw new Error("Question not found");

  qna.isPinned = !qna.isPinned;
  await qna.save();

  return JSON.parse(JSON.stringify(qna));
}

export async function moderateQuestion(questionId: string, isModerated: boolean) {
  await requireAdmin();
  await dbConnect();

  const qna = await EventQnA.findByIdAndUpdate(
    questionId,
    { isModerated },
    { new: true }
  );

  if (!qna) throw new Error("Question not found");

  return JSON.parse(JSON.stringify(qna));
}

export async function getEventQuestions(eventId: string) {
  await dbConnect();

  const questions = await EventQnA.find({ eventId, isModerated: true })
    .populate("studentId", "name department")
    .populate("answer.answeredBy", "name")
    .sort({ isPinned: -1, createdAt: -1 })
    .lean();

  return JSON.parse(JSON.stringify(questions));
}

export async function getAllQuestions() {
  await dbConnect();

  const questions = await EventQnA.find({ isModerated: true })
    .populate("studentId", "name department")
    .populate("eventId", "title slug")
    .populate("answer.answeredBy", "name")
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  return JSON.parse(JSON.stringify(questions));
}
