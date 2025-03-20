const mongoose = require("mongoose");

const SolutionSchema = new mongoose.Schema(
  {
    contestId: { type: String, required: true },
    solutionLink: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Solution", SolutionSchema);

