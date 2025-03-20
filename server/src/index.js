require("dotenv").config();
const mongoose = require("mongoose");
const passport = require("./config/passport");
const session = require("express-session");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const express = require("express");
const cors = require("cors");
const cron = require("node-cron");

const app = express();
// Connect to DB and Start Server
connectDB();

// Run every 12 hours
cron.schedule("0 */12 * * *", async () => {
  console.log("Fetching latest contest solutions...");
  const contests = await fetchContests();
  await fetchSolutions(contests);
});

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"], // allow both ports
    credentials: true,
  })
);

app.get("/", (req, res) => {
    res.send("Contest Tracker API is running...");
});


app.use(
    session({ secret: "secret", resave: false, saveUninitialized: true ,cookie: { secure: false },})
);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/auth", authRoutes);

const contestRoutes = require("./routes/contest");
app.use("/api/contests", contestRoutes);

const bookmarkRoutes = require("./routes/bookmark");
app.use("/api/bookmarks", bookmarkRoutes);

const solutionRoutes = require("./routes/solution");
app.use("/api/solutions", solutionRoutes);

app.get("/session-check", (req, res) => {
  res.json({ user: req.user || "No session stored" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));






