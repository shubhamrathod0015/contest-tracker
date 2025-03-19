import express from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import Bookmark from '../models/Bookmark.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const router = express.Router();

router.use(verifyJWT);

// Create/Delete Bookmark
router.route('/:contestId')
  .post(async (req, res) => {
    try {
      const bookmark = await Bookmark.findOneAndUpdate(
        { user: req.user._id, contest: req.params.contestId },
        { $setOnInsert: { 
          title: req.body.title,
          platform: req.body.platform,
          startTime: req.body.startTime,
          url: req.body.url
        }},
        { upsert: true, new: true }
      );
      
      return res
        .status(201)
        .json(new ApiResponse(201, bookmark, "Bookmark added"));
        
    } catch (error) {
      return res.status(500).json(new ApiResponse(500, null, error.message));
    }
  })
  .delete(async (req, res) => {
    try {
      await Bookmark.findOneAndDelete({
        user: req.user._id,
        contest: req.params.contestId
      });
      
      return res
        .status(200)
        .json(new ApiResponse(200, null, "Bookmark removed"));
        
    } catch (error) {
      return res.status(500).json(new ApiResponse(500, null, error.message));
    }
  });

// Get All Bookmarks
router.get('/', async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ user: req.user._id });
    return res
      .status(200)
      .json(new ApiResponse(200, bookmarks, "Bookmarks retrieved"));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, null, error.message));
  }
});

export default router;