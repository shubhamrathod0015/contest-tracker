import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

const auth = async (req, res, next) => {
    try {
      console.log("🔍 Incoming Headers:", req.headers); // Log all headers
      const token = req.header("Authorization")?.replace("Bearer ", "");
  
      if (!token) {
        console.log("❌ No token found in headers");
        return res.status(401).json({ message: "No token, authorization denied" });
      }
  
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch (error) {
        console.error("❌ JWT Verification Failed:", error.message);
        return res.status(401).json({ message: "Invalid or expired token" });
      }
  
      console.log("✅ Decoded token:", decoded);
  
      const user = await User.findById(decoded.id || decoded.userId);
      if (!user) {
        console.log("❌ User not found for ID:", decoded.id || decoded.userId);
        return res.status(401).json({ message: "User not found" });
      }
  
      req.user = user;
      req.token = token;
      next();
    } catch (error) {
      console.error("❌ Authentication error:", error.message);
      res.status(500).json({ message: "Server error during authentication" });
    }
  };
  

export default auth;
