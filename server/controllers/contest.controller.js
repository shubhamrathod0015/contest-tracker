import Contest from "../models/Contest.js";

// Get contests filtered by platform
export const getContests = async (req, res) => {
    try {
        let { platform } = req.query;
        let filter = {}; // Default: Fetch all contests

        // If a platform filter is provided, apply it
        if (platform && platform.trim() !== "") {
            const platformsArray = platform.split(",").map(p => p.trim()); // Convert to an array
            filter.platform = { $in: platformsArray };
        }

        // Sort by latest contest first (descending order)
        const contests = await Contest.find(filter).sort({ startTime: -1 });

        res.json(contests);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// Admin-only: Upload or update solution link for a contest
export const updateSolutionLink = async (req, res) => {
    try {
        const { contestId } = req.params;
        const { solutionUrl } = req.body;

        // console.log(`Updating contest: ${contestId} with URL: ${solutionUrl}`); // Debugging

        if (!contestId) {
            console.error("Contest ID is missing");
            return res.status(400).json({ message: "Contest ID is required" });
        }

        if (!solutionUrl) {
            console.error("Solution URL is missing");
            return res.status(400).json({ message: "Solution URL is required" });
        }

        const updatedContest = await Contest.findByIdAndUpdate(
            contestId,
            { solutionLink: solutionUrl }, // Ensure field name matches model
            { new: true }
        );

        if (!updatedContest) {
            console.error(`Contest not found with ID: ${contestId}`);
            return res.status(404).json({ message: "Contest not found" });
        }


        res.json(updatedContest);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};