import fs from "fs";
import path from "path";
import axios from "axios";
import { fileURLToPath } from "url";
import cron from "node-cron";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.join(__dirname, "data.json");

const fetchAndSaveContests = async () => {
  try {
    // Ensure data.json exists
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify({}));
    }

    const response = await axios.get(
      "http://codechef.com/api/list/contests/all?sort_by=START&sorting_order=asc&offset=0&mode=all"
    );

    const contestData = response.data;

    fs.writeFileSync(DATA_FILE, JSON.stringify(contestData, null, 2));
    console.log("Contest data saved successfully.");
  } catch (error) {
    console.error(" Error fetching contest data:", error.message);
  }
};


cron.schedule("0 * * * *", fetchAndSaveContests);


export default fetchAndSaveContests;



// import fs from "fs/promises";
// import path from "path";
// import axios from "axios";
// import { fileURLToPath } from "url";
// import cron from "node-cron";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const DATA_FILE_PATH = path.join(__dirname, "data.json");

// // Constants for error messages and logging
// const ERROR_MESSAGES = {
//   FETCH_FAILED: "Failed to fetch contest data",
//   FILE_WRITE_FAILED: "Failed to write data to file",
//   FILE_READ_FAILED: "Failed to read data file"
// };

// const LOG_MESSAGES = {
//   SUCCESS: " Contest data updated successfully",
//   INITIAL_FETCH: "Initial contest data fetched"
// };

// const fetchContestData = async () => {
//   try {
//     const { data } = await axios.get(
//       "https://www.codechef.com/api/list/contests/all", {
//         params: {
//           sort_by: "START",
//           sorting_order: "asc",
//           offset: 0,
//           mode: "all"
//         },
//         timeout: 10000
//       });

//     if (!data) throw new Error(ERROR_MESSAGES.FETCH_FAILED);
//     return data;
//   } catch (error) {
//     console.error(`${ERROR_MESSAGES.FETCH_FAILED}: ${error.message}`);
//     throw error;
//   }
// };

// const initializeDataFile = async () => {
//   try {
//     await fs.access(DATA_FILE_PATH);
//   } catch {
//     await fs.writeFile(DATA_FILE_PATH, JSON.stringify({}));
//     console.log(LOG_MESSAGES.INITIAL_FETCH);
//   }
// };

// const saveContestData = async (data) => {
//   try {
//     await fs.writeFile(DATA_FILE_PATH, JSON.stringify(data, null, 2), { flag: 'wx' });
//   } catch (error) {
//     if (error.code === 'EEXIST') {
//       await fs.writeFile(DATA_FILE_PATH, JSON.stringify(data, null, 2));
//       return;
//     }
//     console.error(`${ERROR_MESSAGES.FILE_WRITE_FAILED}: ${error.message}`);
//     throw error;
//   }
// };

// const fetchAndUpdateContests = async () => {
//   try {
//     await initializeDataFile();
//     const contestData = await fetchContestData();
//     await saveContestData(contestData);
//     console.log(LOG_MESSAGES.SUCCESS);
//   } catch (error) {
//     console.error(" Data update failed:", error.message);
//   }
// };

// // Schedule hourly updates with cron
// cron.schedule("0 */1 * * *", () => {
//   console.log(" Running scheduled contest data update...");
//   fetchAndUpdateContests();
// });

// // Initial fetch on module load
// fetchAndUpdateContests().catch(error => {
//   console.error(" Critical initialization error:", error);
//   process.exit(1);
// });

// export default fetchAndUpdateContests;