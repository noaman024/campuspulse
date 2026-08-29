import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAnswer {
  text: string;
  answeredBy: mongoose.Types.ObjectId;
  answeredAt: Date;
}

export interface IEventQnA extends Document {
  _id: mongoose.Types.ObjectId;
  eventId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  question: string;
  upvotes: mongoose.Types.ObjectId[];
  answer?: IAnswer;
  isPinned: boolean;
  isModerated: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AnswerSubSchema = new Schema<IAnswer>(
  {
    text: { type: String, required: true },
    answeredBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    answeredAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const EventQnASchema = new Schema<IEventQnA>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    question: {
      type: String,
      required: [true, "Question is required"],
      trim: true,
      maxlength: [1000, "Question cannot exceed 1000 characters"],
    },
    upvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    answer: AnswerSubSchema,
    isPinned: {
      type: Boolean,
      default: false,
    },
    isModerated: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

EventQnASchema.index({ eventId: 1, isPinned: -1, createdAt: -1 });

const EventQnA: Model<IEventQnA> =
  mongoose.models.EventQnA ||
  mongoose.model<IEventQnA>("EventQnA", EventQnASchema);

export default EventQnA;
