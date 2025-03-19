import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


//routes import
import userRouter from './routes/user.routes.js'

// import bookmarkRoutes from "./routes/bookmarkRoutes.js";
import bookmarkRoutes from "./routes/bookmark.routes.js";
import contestRoutes from "./routes/contest.routes.js";
import solutionRoutes from "./routes/solution.routes.js";

//routes declaration
app.use("/api/users", userRouter);

app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/contests", contestRoutes);
app.use("/api/solutions", solutionRoutes);

// http://localhost:8000/api/v1/users/register

export { app }