import mongoose, { Schema, Document, Model } from "mongoose";

export interface IRegisteredUser {
  userId: mongoose.Types.ObjectId;
  registeredAt: Date;
  attended: boolean;
  qrCodeToken: string;
}

export interface IMediaGallery {
  photos: string[];
  rawClips: string[];
  generatedHighlightVideoUrl?: string;
}

export interface IReportData {
  chiefGuest?: string;
  objectives?: string;
  outcomes?: string;
  facultyCoordinator?: string;
  generatedPdfUrl?: string;
}

export type EventCategory = "Technical" | "Cultural" | "Sports" | "Workshop";
export type EventStatus =
  | "draft"
  | "upcoming"
  | "ongoing"
  | "completed"
  | "cancelled";

export interface IEvent extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  description: string;
  category: EventCategory;
  tags: string[];
  bannerUrl?: string;
  eventDate: Date;
  venue: string;
  organizerId: mongoose.Types.ObjectId;
  status: EventStatus;
  maxCapacity: number;
  registeredUsers: IRegisteredUser[];
  mediaGallery: IMediaGallery;
  reportData: IReportData;
  createdAt: Date;
  updatedAt: Date;
}

const RegisteredUserSubSchema = new Schema<IRegisteredUser>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    registeredAt: { type: Date, default: Date.now },
    attended: { type: Boolean, default: false },
    qrCodeToken: { type: String, required: true },
  },
  { _id: false }
);

const MediaGallerySubSchema = new Schema<IMediaGallery>(
  {
    photos: [{ type: String }],
    rawClips: [{ type: String }],
    generatedHighlightVideoUrl: { type: String },
  },
  { _id: false }
);

const ReportDataSubSchema = new Schema<IReportData>(
  {
    chiefGuest: { type: String },
    objectives: { type: String },
    outcomes: { type: String },
    facultyCoordinator: { type: String },
    generatedPdfUrl: { type: String },
  },
  { _id: false }
);

const EventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Event description is required"],
      maxlength: [5000, "Description cannot exceed 5000 characters"],
    },
    category: {
      type: String,
      enum: ["Technical", "Cultural", "Sports", "Workshop"],
      required: [true, "Category is required"],
    },
    tags: [{ type: String, trim: true }],
    bannerUrl: { type: String },
    eventDate: {
      type: Date,
      required: [true, "Event date is required"],
    },
    venue: {
      type: String,
      required: [true, "Venue is required"],
      trim: true,
    },
    organizerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "upcoming", "ongoing", "completed", "cancelled"],
      default: "upcoming",
    },
    maxCapacity: {
      type: Number,
      required: true,
      min: [1, "Capacity must be at least 1"],
    },
    registeredUsers: [RegisteredUserSubSchema],
    mediaGallery: {
      type: MediaGallerySubSchema,
      default: { photos: [], rawClips: [] },
    },
    reportData: {
      type: ReportDataSubSchema,
      default: {},
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

EventSchema.virtual("registrationCount").get(function () {
  return this.registeredUsers?.length ?? 0;
});

EventSchema.index({ eventDate: 1, status: 1 });
EventSchema.index({ category: 1 });
EventSchema.index({ slug: 1 });

const Event: Model<IEvent> =
  mongoose.models.Event || mongoose.model<IEvent>("Event", EventSchema);

export default Event;
