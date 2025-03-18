import mongoose from "mongoose";

const BookmarkSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    contestId: { type: String, required: true },
    title: { type: String, required: true },
    platform: { type: String, required: true },
    startTime: { type: Date, required: true },
    url: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Bookmark", BookmarkSchema);
