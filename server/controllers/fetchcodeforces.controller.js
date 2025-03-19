import axios from "axios";
import Contest from "../models/Contest.js"; // Ensure correct model import

export const fetchCodeforcesContests = async () => {
    try {
        console.log("Fetching Codeforces contests...");

        const response = await axios.get("https://codeforces.com/api/contest.list");

        if (response.data.status !== "OK") {
            console.error("Failed to fetch Codeforces contests.");
            return [];
        }

    

        const now = new Date();

        const contests = response.data.result.map((contest) => ({
            title: contest.name,
            platform: "Codeforces",
            startTime: new Date(contest.startTimeSeconds * 1000),
            endTime: new Date((contest.startTimeSeconds + contest.durationSeconds) * 1000),
            url: "https://codeforces.com/contest/${contest.id}",
            status: contest.phase === "BEFORE" ? "UPCOMING" : "PAST",
        }));

        const upcomingContests = contests.filter((c) => c.status === "UPCOMING");
        const pastContests = contests.filter((c) => c.status === "PAST");

        // ✅ Step 1: Store past contests if not already stored
        const existingPastContest = await Contest.findOne({ platform: "Codeforces", status: "PAST" });
        if (!existingPastContest) {
            await Contest.insertMany(pastContests);
            console.log(` Stored ${pastContests.length} past contests.`);
        } else {
            console.log("Past contests already stored. Skipping...");
        }

        // ✅ Step 2: Update ended contests to "PAST"
        const updatedCount = await Contest.updateMany(
            { status: "UPCOMING", endTime: { $lte: now } },
            { $set: { status: "PAST" } }
        );
        console.log(`Updated ${updatedCount.modifiedCount} contests from UPCOMING to PAST.`);

        // ✅ Step 3: Insert new upcoming contests
        for (let contest of upcomingContests) {
            const existingContest = await Contest.findOne({ title: contest.title, platform: "Codeforces" });

            if (!existingContest) {
                await Contest.create(contest);
            }
        }
        console.log("Stored/updated ${upcomingContests.length} upcoming contests.");

        return [...upcomingContests, ...pastContests];

    } catch (error) {
        console.error("Error fetching Codeforces contests:", error.message);
        return [];
    }
};