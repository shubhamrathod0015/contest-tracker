import express from "express";
import Solution from "../models/Solution.js";

const router = express.Router();

// Get all solutions
router.get("/", async (req, res) => {
  try {
    const solutions = await Solution.find().sort({ createdAt: -1 });
    res.json(solutions);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Add a new solution
router.post("/", async (req, res) => {
  try {
    const { contest_name, site, youtube_link } = req.body;
    if (!contest_name || !site || !youtube_link) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newSolution = new Solution({ contest_name, site, youtube_link });
    await newSolution.save();
    res.status(201).json(newSolution);
  } catch (error) {
    res.status(500).json({ message: "Error saving solution", error });
  }
});

export default router;
