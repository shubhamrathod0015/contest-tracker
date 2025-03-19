import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  refreshAccessToken,
  getCurrentUser,
} from "../controllers/user.controller.js";
import { verifyJWT, verifyAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

// Public routes
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

// Protected routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route('/refresh-token').post(refreshAccessToken); 
router.route("/me").get(verifyJWT, getCurrentUser);


// Admin-only route example
router.route("/admin-check")
  .get(verifyJWT, verifyAdmin, (req, res) => {
    res.status(200).json({ message: "Admin access granted" });
  });

export default router;
