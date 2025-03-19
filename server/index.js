// require('dotenv').config({path: './env'})
import dotenv from "dotenv"
import cron from "node-cron";
import connectDB from "./db/index.js";
import {app} from './app.js'
import fetchAndSaveContests from "./utils/scrapper.js";
import { fetchCodeChefContests } from "./controllers/fetchcodechef.controller.js";
import { fetchCodeforcesContests } from "./controllers/fetchcodeforces.controller.js";
import { fetchLeetCodeContests } from "./controllers/fetchleetcode.controller.js";

dotenv.config({
    path: './.env'
})



connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(` Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})

// Run scrapers on startup
fetchCodeChefContests();
fetchCodeforcesContests();
fetchLeetCodeContests();

// Set up cron jobs to fetch contest data every hour
cron.schedule("0 * * * *", fetchAndSaveContests);
cron.schedule("0 * * * *", fetchCodeChefContests);
cron.schedule("0 * * * *", fetchCodeforcesContests);










/*
import express from "express"
const app = express()
( async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("errror", (error) => {
            console.log("ERRR: ", error);
            throw error
        })

        app.listen(process.env.PORT, () => {
            console.log(`App is listening on port ${process.env.PORT}`);
        })

    } catch (error) {
        console.error("ERROR: ", error)
        throw err
    }
})()

*/