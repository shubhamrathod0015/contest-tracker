import fs from "fs";
import path from "path";
import axios from "axios";

const DATA_FILE_PATH = path.join(process.cwd(), "server", "utils", "data.json");

const fetchContestData = async () => {
  try {
    const { data } = await axios.get(
      "http://codechef.com/api/list/contests/all?sort_by=START&sorting_order=asc&offset=0&mode=all"
    );

    if (data.status === "success") {
      fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2));
      console.log("✅ Contest data saved successfully.");
    } else {
      console.error("❌ Failed to fetch contest data.");
    }
  } catch (error) {
    console.error("❌ Error fetching contest data:", error.message);
  }
};

// Run the function to fetch and save data
fetchContestData();

export { fetchContestData, DATA_FILE_PATH };
