import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAnswer {
  questionId: string;
  value: string | number | string[];
}

export interface IFeedbackSubmission extends Document {
  _id: mongoose.Types.ObjectId;
  formId: mongoose.Types.ObjectId;
  eventId: mongoose.Types.ObjectId;
  studentId?: mongoose.Types.ObjectId | null;
  isAnonymous: boolean;
  answers: IAnswer[];
  submittedAt: Date;
}

const AnswerSubSchema = new Schema<IAnswer>(
  {
    questionId: {
      type: String,
      required: true,
    },
    value: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  { _id: false }
);

const FeedbackSubmissionSchema = new Schema<IFeedbackSubmission>({
  formId: {
    type: Schema.Types.ObjectId,
    ref: "FeedbackForm",
    required: true,
  },
  eventId: {
    type: Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  studentId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  isAnonymous: {
    type: Boolean,
    default: false,
  },
  answers: [AnswerSubSchema],
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound index: enforces single submission per student per form (when not anonymous)
FeedbackSubmissionSchema.index(
  { formId: 1, studentId: 1 },
  {
    unique: true,
    partialFilterExpression: {
      isAnonymous: false,
      studentId: { $ne: null },
    },
  }
);

FeedbackSubmissionSchema.index({ eventId: 1 });

const FeedbackSubmission: Model<IFeedbackSubmission> =
  mongoose.models.FeedbackSubmission ||
  mongoose.model<IFeedbackSubmission>(
    "FeedbackSubmission",
    FeedbackSubmissionSchema
  );

export default FeedbackSubmission;
