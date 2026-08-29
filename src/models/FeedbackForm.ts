import mongoose, { Schema, Document, Model } from "mongoose";

export type QuestionType = "rating" | "mcq" | "text" | "likert";

export interface IQuestion {
  questionId: string;
  prompt: string;
  type: QuestionType;
  options: string[];
  isRequired: boolean;
  order: number;
}

export interface IFeedbackForm extends Document {
  _id: mongoose.Types.ObjectId;
  eventId: mongoose.Types.ObjectId;
  title: string;
  instructions?: string;
  isPublished: boolean;
  acceptingResponses: boolean;
  questions: IQuestion[];
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSubSchema = new Schema<IQuestion>(
  {
    questionId: {
      type: String,
      required: true,
    },
    prompt: {
      type: String,
      required: [true, "Question prompt is required"],
      trim: true,
    },
    type: {
      type: String,
      enum: ["rating", "mcq", "text", "likert"],
      required: [true, "Question type is required"],
    },
    options: [{ type: String, trim: true }],
    isRequired: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const FeedbackFormSchema = new Schema<IFeedbackForm>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: [true, "Form title is required"],
      trim: true,
    },
    instructions: {
      type: String,
      trim: true,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    acceptingResponses: {
      type: Boolean,
      default: true,
    },
    questions: [QuestionSubSchema],
  },
  {
    timestamps: true,
  }
);

FeedbackFormSchema.index({ eventId: 1 });

const FeedbackForm: Model<IFeedbackForm> =
  mongoose.models.FeedbackForm ||
  mongoose.model<IFeedbackForm>("FeedbackForm", FeedbackFormSchema);

export default FeedbackForm;
