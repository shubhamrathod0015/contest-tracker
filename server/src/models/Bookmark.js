const mongoose = require("mongoose");

const BookmarkSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  contestId: { type: Number, required: true },
  name: { type: String, required: true },
  platform: { type: String, required: true },
  startTime: { type: String, required: true },
  duration: { type: Number, required: true },
});

module.exports = mongoose.model("Bookmark", BookmarkSchema);
