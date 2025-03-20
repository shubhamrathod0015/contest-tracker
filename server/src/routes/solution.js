const express = require("express");
const Solution = require("../models/Solution");

const router = express.Router();

// Get solution for a contest
router.get("/:contestId", async (req, res) => {
  try {
    const solution = await Solution.findOne({ contestId: req.params.contestId });
    if (!solution) return res.status(404).json({ message: "Solution not found" });

    res.json(solution);
  } catch (error) {
    res.status(500).json({ message: "Error fetching solution" });
  }
});

// Add a new solution
router.post("/:contestId", async (req, res) => {
  try {
    const {  solutionLink } = req.body;
    // console.log("vfv",solutionLink)
    const contestId =req.params.contestId
    let solution = await Solution.findOne({ contestId });
    if (solution) {
      return res.status(400).json({ message: "Solution already exists for this contest" });
    }

    solution = new Solution({ contestId, solutionLink });
    await solution.save();

    res.status(201).json({ message: "Solution added successfully", solution });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
