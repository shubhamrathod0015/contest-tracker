import React, { useEffect, useState } from "react";

const CodeChefContests = () => {
  const [contests, setContests] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchContests();
  }, []);

  const fetchContests = async () => {
    setLoading(true);
    setError(null);

    try {
      const backendUrl = "/api/contests/full-data";
      console.log("Fetching contests from:", backendUrl);

      const response = await fetch(backendUrl);
      if (!response.ok) throw new Error(`Failed to fetch contests (Status: ${response.status})`);

      const data = await response.json();
      console.log("Fetched Data:", data);

      if (!data || !data.future_contests) {
        throw new Error("Invalid API response structure: Expected 'future_contests' key");
      }

      setContests(processCodeChefData(data));
    } catch (error) {
      console.error("Error fetching contests:", error);
      setError(`Failed to fetch contests: ${error.message}`);
      setContests([]); // Ensure contests state is an empty array on error
    } finally {
      setLoading(false);
    }
  };

  const processCodeChefData = (data) => {
    if (!data || !data.future_contests || !Array.isArray(data.future_contests)) {
      console.error("processCodeChefData: Invalid API response structure", data);
      return [];
    }

    return data.future_contests.map((contest) => ({
      id: contest.contest_code,
      name: contest.contest_name,
      start_time: new Date(contest.contest_start_date_iso),
      duration: contest.duration || "Unknown",
      url: `https://www.codechef.com/${contest.contest_code}`,
      status: "upcoming",
    }))
    .sort((a, b) => a.start_time - b.start_time);
  };

  return (
    <div className="p-4 md:mx-12 mt-3 rounded-md shadow-lg bg-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">CodeChef Contests</h2>
        <button
          onClick={fetchContests}
          className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Refresh
        </button>
      </div>

      {loading && <p className="text-blue-500">Fetching contests...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {contests.length > 0 ? (
        <ul className="divide-y divide-gray-300">
          {contests.map((contest) => (
            <li key={contest.id} className="py-3">
              <a
                href={contest.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline font-semibold"
              >
                {contest.name}
              </a>
              <div className="text-sm text-gray-600">
                <span>{contest.start_time.toLocaleString()}</span>
                <span> - {contest.duration} minutes</span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No upcoming contests found.</p>
      )}
    </div>
  );
};

export default CodeChefContests;
