const express = require("express");
const Bookmark = require("../models/Bookmark");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Add a bookmark
router.post("/", authMiddleware, async (req, res) => {
  const { contestId, name, platform, startTime, duration } = req.body;
  const userId = req.user.userId;
  
  try {
    const existingBookmark = await Bookmark.findOne({ userId, contestId });
    if (existingBookmark) {
      return res.status(400).json({ message: "Already bookmarked" });
    }
    
    const newBookmark = new Bookmark({ userId, contestId, name, platform, startTime, duration });
    // console.log("user book ",newBookmark )
    await newBookmark.save();

    res.status(201).json(newBookmark);
  } catch (error) {
    res.status(500).json({ message: "Error saving bookmark" });
  }
});

// Get user's bookmarks
router.get("/", authMiddleware, async (req, res) => {
  const userId = req.user.userId;

  try {
    const bookmarks = await Bookmark.find({ userId });
    res.json(bookmarks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookmarks" });
  }
});

// Remove a bookmark
router.delete("/:contestId", authMiddleware, async (req, res) => {
  const { contestId } = req.params;
  const userId = req.user.userId;

  try {
    const deleted = await Bookmark.findOneAndDelete({ userId, contestId });
    if (!deleted) return res.status(404).json({ message: "Bookmark not found" });

    res.json({ message: "Bookmark removed" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting bookmark" });
  }
});

module.exports = router;
