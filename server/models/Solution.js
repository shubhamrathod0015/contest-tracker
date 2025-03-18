import mongoose from "mongoose";

const SolutionSchema = new mongoose.Schema(
  {
    contest_name: { type: String, required: true },
    site: { type: String, required: true },
    youtube_link: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Solution", SolutionSchema);
