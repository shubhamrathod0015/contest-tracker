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
