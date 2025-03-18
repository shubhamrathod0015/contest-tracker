import mongoose from "mongoose";

const contestSchema = new mongoose.Schema({
  contest_id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  start_time: { type: Date, required: true },
  url: { type: String, required: true }
}, { timestamps: true });

const Contest = mongoose.model("Contest", contestSchema);

export default Contest;
