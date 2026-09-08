import mongoose, { Schema, Document } from "mongoose";

export interface ISocialBroadcast extends Document {
  eventId?: mongoose.Types.ObjectId;
  eventTitle: string;
  mediaUrl: string;
  mediaType: "photo" | "video";
  captions: {
    instagram: string;
    facebook: string;
    twitter: string;
    linkedin: string;
    whatsapp: string;
  };
  tone: string;
  platforms: string[];
  postedBy: mongoose.Types.ObjectId;
  webhookStatus: "success" | "skipped" | "failed";
  webhookResponse?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SocialBroadcastSchema = new Schema<ISocialBroadcast>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      default: null,
    },
    eventTitle: {
      type: String,
      required: true,
      default: "Campus Announcement",
    },
    mediaUrl: {
      type: String,
      required: true,
    },
    mediaType: {
      type: String,
      enum: ["photo", "video"],
      default: "photo",
    },
    captions: {
      instagram: { type: String, default: "" },
      facebook: { type: String, default: "" },
      twitter: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      whatsapp: { type: String, default: "" },
    },
    tone: {
      type: String,
      default: "Hype & Energetic 🔥",
    },
    platforms: {
      type: [String],
      default: ["Instagram", "Facebook", "Twitter", "LinkedIn", "WhatsApp"],
    },
    postedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    webhookStatus: {
      type: String,
      enum: ["success", "skipped", "failed"],
      default: "skipped",
    },
    webhookResponse: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.models.SocialBroadcast ||
  mongoose.model<ISocialBroadcast>("SocialBroadcast", SocialBroadcastSchema);
