import express from "express";
import { getContests} from "../controllers/contest.controller.js";
// import auth from "../middleware/auth.js";
// import admin from "../middleware/admin.js";

const router = express.Router();

router.get("/all", getContests); // Get contests (filtered by platform)
// router.put("/:contestId/solution", auth, admin, updateSolutionLink); // Admin: Add/update solution link

export default router;