import React, { useState, useEffect } from "react";

const AdminPanel = () => {
  const [contestName, setContestName] = useState("");
  const [solutionLink, setSolutionLink] = useState("");
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch existing solutions from backend
  useEffect(() => {
    const fetchSolutions = async () => {
      try {
        const response = await fetch("https://tle-tracker.onrender.com/api/solutions");
        if (!response.ok) throw new Error("Failed to fetch solutions");
        const data = await response.json();
        setSolutions(data);
      } catch (err) {
        setError("Error loading solutions");
      } finally {
        setLoading(false);
      }
    };

    fetchSolutions();
  }, []);

  const addSolution = async () => {
    if (!contestName || !solutionLink) {
      setError("Contest name and YouTube link are required");
      return;
    }

    // Prevent duplicate entries
    if (solutions.some((s) => s.contest_name === contestName && s.youtube_link === solutionLink)) {
      setError("This solution already exists!");
      return;
    }

    const newSolution = { contest_name: contestName, site: "Codeforces", youtube_link: solutionLink };

    try {
      const response = await fetch("https://tle-tracker.onrender.com/api/solutions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSolution),
      });

      if (!response.ok) throw new Error("Failed to save solution");

      const savedSolution = await response.json();
      setSolutions([...solutions, savedSolution]);
      setContestName("");
      setSolutionLink("");
      setError(""); // Clear any previous error
    } catch (err) {
      setError("Error saving solution");
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto rounded-sm shadow-lg mt-6">
      <h2 className="text-xl font-bold ">Admin Panel - Add Solutions</h2>

      <div className="flex flex-wrap gap-2 my-4">
        <input
          type="text"
          placeholder="Contest Name"
          value={contestName}
          onChange={(e) => setContestName(e.target.value)}
          className="p-2 border rounded-md shadow-md bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-600 w-full sm:w-auto"
        />
        <input
          type="text"
          placeholder="YouTube Link"
          value={solutionLink}
          onChange={(e) => setSolutionLink(e.target.value)}
          className="p-2 border rounded-md shadow-md bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-600 w-full sm:w-auto"
        />
        <button onClick={addSolution} className="p-2 bg-purple-500 text-white rounded-md w-full sm:w-auto">
          Add Solution
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <h3 className="text-lg font-bold mb-2">Existing Solutions</h3>
      {loading ? (
        <p>Loading solutions...</p>
      ) : (
        <ul className="space-y-2">
          {solutions.map((s, index) => (
            <li key={index} className="p-2 border rounded-lg flex flex-col sm:flex-row justify-between items-center">
              <span className="font-semibold">{s.contest_name}</span>
              <a href={s.youtube_link} className="text-green-600 hover:underline" target="_blank" rel="noreferrer">
                Watch Solution
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminPanel;
