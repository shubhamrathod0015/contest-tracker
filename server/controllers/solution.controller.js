// import Solution from "../models/Solution.js";
// import Contest from "../models/Contest.js";
// import youtubeUtils from "../utils/youtubeUtil.js";

// // Get all solutions
// export const getAllSolutions = async (req, res) => {
//   try {
//     const solutions = await Solution.find();
//     res.json(solutions);
//   } catch (error) {
//     console.error("Error fetching solutions:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // Get solution for a specific contest
// export const getSolutionByContestId = async (req, res) => {
//   try {
//     const solution = await Solution.findOne({ contestId: req.params.contestId });
//     if (!solution) {
//       return res.status(404).json({ message: "No solution found for this contest" });
//     }
//     res.json(solution);
//   } catch (error) {
//     console.error("Error fetching solution:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // Add or update a solution manually
// export const addOrUpdateSolution = async (req, res) => {
//   try {
//     const { contestId, youtubeUrl } = req.body;

//     // Find the contest to get its details
//     const contest = await Contest.findById(contestId);
//     if (!contest) {
//       return res.status(404).json({ message: "Contest not found" });
//     }

//     // Check if a solution already exists for this contest
//     let solution = await Solution.findOne({ contestId });

//     if (solution) {
//       // Update existing solution
//       solution.youtubeUrl = youtubeUrl;
//       solution.addedBy = req.user.id;
//       solution.addedAt = Date.now();
//       await solution.save();
//       res.json({ message: "Solution updated successfully", solution });
//     } else {
//       // Create new solution
//       solution = new Solution({
//         contestId,
//         contestTitle: contest.title,
//         platform: contest.platform,
//         youtubeUrl,
//         addedBy: req.user.id,
//       });
//       await solution.save();
//       res.status(201).json({ message: "Solution added successfully", solution });
//     }
//   } catch (error) {
//     console.error("Error adding/updating solution:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // Delete a solution
// export const deleteSolution = async (req, res) => {
//   try {
//     const solution = await Solution.findById(req.params.id);

//     if (!solution) {
//       return res.status(404).json({ message: "Solution not found" });
//     }

//     await Solution.deleteOne({ _id: solution._id });
//     res.json({ message: "Solution removed" });
//   } catch (error) {
//     console.error("Error deleting solution:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // Auto-fetch YouTube solution based on contest title
// export const autoFetchSolution = async (req, res) => {
//   try {
//     const { contestId } = req.params;

//     // Find the contest
//     const contest = await Contest.findById(contestId);
//     if (!contest) {
//       return res.status(404).json({ message: "Contest not found" });
//     }

//     // Find video in the appropriate playlist
//     const video = await youtubeUtils.findVideoByContestTitle(contest.platform, contest.title);

//     if (!video) {
//       return res.status(404).json({ message: "No matching video found in YouTube playlist" });
//     }

//     // Save or update the solution
//     let solution = await Solution.findOne({ contestId });

//     if (solution) {
//       solution.youtubeUrl = video.url;
//       solution.addedBy = req.user.id;
//       solution.addedAt = Date.now();
//       await solution.save();
//     } else {
//       solution = new Solution({
//         contestId,
//         contestTitle: contest.title,
//         platform: contest.platform,
//         youtubeUrl: video.url,
//         addedBy: req.user.id,
//       });
//       await solution.save();
//     }

//     res.json({
//       message: "Solution auto-fetched successfully",
//       solution,
//       videoDetails: {
//         title: video.title,
//         url: video.url,
//       },
//     });
//   } catch (error) {
//     console.error("Error auto-fetching solution:", error);
//     res.status(500).json({
//       message: error.message || "Error auto-fetching solution",
//       error: error.toString(),
//     });
//   }
// };


// export default {
//     getAllSolutions,
//     getSolutionByContestId,
//     addOrUpdateSolution,
//     deleteSolution,
//     autoFetchSolution
//   };


import Solution from "../models/Solution.js";
import Contest from "../models/Contest.js";
import youtubeUtils from "../utils/youtubeUtil.js";
import { NotFoundError, ValidationError, DatabaseError } from "../utils/errors.js";

// Get all solutions
export const getAllSolutions = async (req, res) => {
  try {
    const solutions = await Solution.find().populate('addedBy', 'username email');
    res.json(solutions);
  } catch (error) {
    console.error("Error fetching solutions:", error);
    throw new DatabaseError('Failed to retrieve solutions');
  }
};

// Get solution for a specific contest
export const getSolutionByContestId = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.contestId)) {
      throw new ValidationError('Invalid contest ID format');
    }

    const solution = await Solution.findOne({ contestId: req.params.contestId })
      .populate('addedBy', 'username email');

    if (!solution) {
      throw new NotFoundError('No solution found for this contest');
    }

    res.json(solution);
  } catch (error) {
    next(error);
  }
};

// Add or update a solution manually
export const addOrUpdateSolution = async (req, res) => {
  try {
    const { contestId, youtubeUrl } = req.body;

    if (!contestId || !youtubeUrl) {
      throw new ValidationError('Missing required fields: contestId and youtubeUrl');
    }

    if (!isValidYouTubeUrl(youtubeUrl)) {
      throw new ValidationError('Invalid YouTube URL format');
    }

    const contest = await Contest.findById(contestId);
    if (!contest) {
      throw new NotFoundError('Contest not found');
    }

    const existingSolution = await Solution.findOne({ contestId });
    const solutionData = {
      contestId,
      contestTitle: contest.title,
      platform: contest.platform,
      youtubeUrl,
      addedBy: req.user.id,
    };

    let solution;
    if (existingSolution) {
      solution = await Solution.findByIdAndUpdate(
        existingSolution._id,
        solutionData,
        { new: true, runValidators: true }
      );
    } else {
      solution = new Solution(solutionData);
      await solution.save();
    }

    res.status(existingSolution ? 200 : 201).json({
      status: 'success',
      data: solution
    });
  } catch (error) {
    next(error);
  }
};

// Delete a solution
export const deleteSolution = async (req, res) => {
  try {
    const solution = await Solution.findById(req.params.id);
    
    if (!solution) {
      throw new NotFoundError('Solution not found');
    }

    if (!req.user.isAdmin && solution.addedBy.toString() !== req.user.id) {
      throw new AuthorizationError('Not authorized to delete this solution');
    }

    await solution.remove();
    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    next(error);
  }
};

// Auto-fetch YouTube solution
export const autoFetchSolution = async (req, res) => {
  try {
    const { contestId } = req.params;

    const contest = await Contest.findById(contestId);
    if (!contest) {
      throw new NotFoundError('Contest not found');
    }

    const video = await youtubeUtils.findVideoByContestTitle(contest.platform, contest.title);
    if (!video) {
      throw new NotFoundError('No matching video found in YouTube playlist');
    }

    const solution = await Solution.findOneAndUpdate(
      { contestId },
      {
        contestId,
        contestTitle: contest.title,
        platform: contest.platform,
        youtubeUrl: video.url,
        addedBy: req.user.id,
      },
      { upsert: true, new: true }
    );

    res.json({
      status: 'success',
      data: {
        solution,
        videoDetails: video
      }
    });
  } catch (error) {
    next(error);
  }
};

// Helper function
const isValidYouTubeUrl = (url) => {
  const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+/;
  return pattern.test(url);
};
  