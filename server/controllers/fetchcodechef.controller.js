import axios from "axios";
import Contest from "../models/Contest.js"; // Ensure correct model import

export const fetchCodeChefContests = async () => {
    try {
        console.log("Fetching CodeChef contests...");

        const response = await axios.get(
            "https://www.codechef.com/api/list/contests/all?sort_by=START&sorting_order=asc&offset=0&mode=all"
        );

        if (!response.data?.future_contests || !response.data?.past_contests) {
            console.error("Invalid response format from CodeChef API");
            return [];
        }

        console.log("✅ API response received.");

        const now = new Date();

        const upcomingContests = response.data.future_contests.map((contest) => {
            const startTime = new Date(contest.contest_start_date_iso);
            return {
                title: contest.contest_name,
                platform: "CodeChef",
                startTime,
                endTime: new Date(contest.contest_end_date_iso),
                url: `https://www.codechef.com/${contest.contest_code}`,
                status: "UPCOMING",
                timeRemaining: Math.floor((startTime - new Date()) / 1000) // Calculate time in seconds
            };
        });
        

        const pastContests = response.data.past_contests.map((contest) => ({
            title: contest.contest_name,
            platform: "CodeChef",
            startTime: new Date(contest.contest_start_date_iso),
            endTime: new Date(contest.contest_end_date_iso),
            url: `https://www.codechef.com/${contest.contest_code}`,
            status: "PAST",
        }));

        // ✅ Step 1: Store past contests if not already stored
        const existingPastContest = await Contest.findOne({ platform: "CodeChef", status: "PAST" });
        if (!existingPastContest) {
            await Contest.insertMany(pastContests);
            console.log(`✅ Stored ${pastContests.length} past contests.`);
        } else {
            console.log("✅ Past contests already stored. Skipping...");
        }

        // ✅ Step 2: Update ended contests to "PAST"
        const updatedCount = await Contest.updateMany(
            { status: "UPCOMING", endTime: { $lte: now } },
            { $set: { status: "PAST" } }
        );
        console.log(`✅ Updated ${updatedCount.modifiedCount} contests from UPCOMING to PAST.`);

        // ✅ Step 3: Insert new upcoming contests
        for (let contest of upcomingContests) {
            const existingContest = await Contest.findOne({ title: contest.title, platform: "CodeChef" });

            if (!existingContest) {
                await Contest.create(contest);
            }
        }
        console.log(`✅ Stored/updated ${upcomingContests.length} upcoming contests.`);

        return [...upcomingContests, ...pastContests];

    } catch (error) {
        console.error("❌ Error fetching CodeChef contests:", error.message);
        return [];
    }
};