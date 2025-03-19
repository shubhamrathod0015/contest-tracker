import express from 'express';
import auth from '../middlewares/auth.js';
import Bookmark from '../models/Bookmark.js';

const router = express.Router();

// Create a bookmark - POST /api/bookmarks
router.post('/', auth, async (req, res) => {
  try {
    const { _id, title, platform, startTime, url } = req.body;
    
    // Check if bookmark already exists
    const existingBookmark = await Bookmark.exists({ 
      userId: req.user.id,
      contestId: _id
    });

    if (existingBookmark) {
      return res.status(400).json({ msg: 'Contest already bookmarked' });
    }
    
    const newBookmark = new Bookmark({
      userId: req.user.id,
      contestId: _id,
      title,
      platform,
      startTime,
      url
    });

    const bookmark = await newBookmark.save();
    res.json(bookmark);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get all bookmarks - GET /api/bookmarks
router.get('/', auth, async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ userId: req.user.id });
    res.json(bookmarks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Delete a bookmark - DELETE /api/bookmarks/:id
// Delete a bookmark - DELETE /api/bookmarks/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBookmark = await Bookmark.findByIdAndDelete(id);

    if (!deletedBookmark) {
      return res.status(404).json({ message: "Bookmark not found" });
    }

    res.json({ message: "Bookmark removed successfully" });
  } catch (error) {
    console.error("Error deleting bookmark:", error);
    res.status(500).json({ message: "Server error" });
  }
});



export default router;
