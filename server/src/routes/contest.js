const express = require("express");
require("dotenv").config();
const axios = require("axios");

const router = express.Router();

// Clist API Credentials
const CLIST_BASE_URL = process.env.CLIST_BASE_URL
const CLIST_API_KEY = process.env.CLIST_API_KEY;
const USER_NAME = process.env.USER_NAME;


router.get("/", async (req, res) => {
  try {
    const { type, platforms } = req.query;
    console.log("ddd",type,platforms)
    const selectedPlatforms = platforms ? platforms.split(",") : ["leetcode.com", "codeforces.com", "codechef.com"];
    console.log('hello')
    
    console.log("ENV VARS:", process.env.CLIST_API_KEY, process.env.USER_NAME); // Add this
    console.log("Query params:", req.query); // Add this
    // Fetch contests from Clist API
    const response = await axios.get(`${CLIST_BASE_URL}`, {
      params: {
        username: USER_NAME,
        api_key:  CLIST_API_KEY,
        upcoming: (type === "upcoming" ? "true" : "false"),
        order_by: "-start"
      },
    });

    // console.log(process.env.CLIST_API_KEY);
  

    console.log("API URL:", response.config.url); 

    console.log("data", response.data.objects); 

    // Filter based on selected platforms 
    const filteredContests = response.data.objects.filter(contest =>
      selectedPlatforms.includes(contest.resource)
    );

// console.log("filtered data",filteredContests); 

    res.json(filteredContests);
  } catch (error) {
    console.error("Error fetching contests:", error);
    res.status(500).json({ error: "Failed to fetch contests" });
  }
});


module.exports = router;
