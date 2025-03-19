import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { AiOutlineBook, AiFillBook, AiOutlineYoutube } from "react-icons/ai";
import { toast } from "react-hot-toast";

const ContestList = () => {
  const { user, token } = useContext(AuthContext);
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookmarked, setBookmarked] = useState([]);
  const [solutions, setSolutions] = useState({});
  const [selectedPlatforms, setSelectedPlatforms] = useState([
    "Codeforces",
    "CodeChef",
    "LeetCode",
  ]);

  useEffect(() => {
    const fetchContests = async () => {
      try {
        // const { data } = await axios.get("/api/contests/all");
        const { data } = await axios.get("/api/contests/all");
        const updatedContests = data.map((contest) => ({
          ...contest,
          timeRemaining: Math.max(
            0,
            Math.floor((new Date(contest.startTime) - new Date()) / 1000)
          ),
        }));
        setContests(updatedContests);
      } catch (error) {
        console.error("Error fetching contests:", error);
        toast.error("Failed to fetch contests.");
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchSolutions = async () => {
      try {
        const { data } = await axios.get("/api/solutions");
        const solutionsMap = {};
        
        // Map solutions to contests by matching contest_name to title
        data.forEach((solution) => {
          // Find a matching contest based on the title
          const matchingContest = contests.find(
            contest => contest.title.toLowerCase() === solution.contest_name.toLowerCase()
          );
          
          if (matchingContest) {
            solutionsMap[matchingContest._id] = solution.youtube_link;
          }
        });
        
        setSolutions(solutionsMap);
      } catch (error) {
        console.error("Error fetching solutions:", error);
      }
    };

    const fetchBookmarks = async () => {
      if (user && token) {
        try {
          const { data } = await axios.get("/api/bookmarks", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setBookmarked(data.map(({ contestId }) => contestId));
        } catch (error) {
          console.error("Error fetching bookmarks:", error);
        }
      }
    };

    fetchContests();
    fetchBookmarks();

    const interval = setInterval(() => {
      setContests((prevContests) =>
        prevContests.map((contest) => ({
          ...contest,
          timeRemaining: Math.max(0, contest.timeRemaining - 1),
        }))
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [user, token]);

  // Call fetchSolutions after contests are loaded
  useEffect(() => {
    if (contests.length > 0) {
      const fetchSolutions = async () => {
        try {
          const { data } = await axios.get("/api/solutions");
          const solutionsMap = {};
          
          // Map solutions to contests by matching contest_name to title
          data.forEach((solution) => {
            // Find a matching contest based on the title
            const matchingContest = contests.find(
              contest => contest.title.toLowerCase() === solution.contest_name.toLowerCase()
            );
            
            if (matchingContest) {
              solutionsMap[matchingContest._id] = solution.youtube_link;
            }
          });
          
          setSolutions(solutionsMap);
        } catch (error) {
          console.error("Error fetching solutions:", error);
        }
      };
      
      fetchSolutions();
    }
  }, [contests]);

  const filteredContests = contests.filter((contest) =>
    selectedPlatforms.includes(contest.platform)
  );

  const upcomingContests = filteredContests.filter((contest) => contest.timeRemaining > 0);
  const completedContests = filteredContests.filter((contest) => contest.timeRemaining === 0);

  const togglePlatform = (platform) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]
    );
  };

  const toggleBookmark = async (contest) => {
    if (!user) {
      toast.error("Please log in to bookmark contests.");
      return;
    }
    const isBookmarked = bookmarked.includes(contest._id);
    try {
      if (isBookmarked) {
        await axios.delete(`/api/bookmarks/${contest._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookmarked((prev) => prev.filter((id) => id !== contest._id));
        toast.success("Bookmark removed.");
      } else {
        await axios.post(
          "/api/bookmarks",
          {
            _id: contest._id,
            title: contest.title,
            platform: contest.platform,
            startTime: contest.startTime,
            url: contest.url,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setBookmarked((prev) => [...prev, contest._id]);
        toast.success("Contest bookmarked!");
      }
    } catch (error) {
      toast.error("Failed to update bookmark.");
      console.error("Error toggling bookmark:", error);
    }
  };

  if (loading)
    return <div className="flex justify-center items-center h-screen"><div className="w-[90px] h-[90px] border-4 border-blue-500 border-dashed rounded-full animate-spin"></div></div>;

  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-4 md:mx-12 mt-3 rounded-md shadow-lg">
      <h2 className="text-xl font-bold">Upcoming & Completed Contests</h2>
      <div className="flex gap-2 my-4">
        {["Codeforces", "CodeChef", "LeetCode"].map((platform) => (
          <button
            key={platform}
            onClick={() => togglePlatform(platform)}
            className={`p-2 rounded-md ${selectedPlatforms.includes(platform) ? "bg-purple-500 text-white" : "bg-gray-500"}`}
          >
            {platform}
          </button>
        ))}
      </div>

      <h3 className="text-lg font-semibold mt-4">Upcoming Contests</h3>
      {upcomingContests.map((contest) => (
        <div key={contest._id} className="mt-2 p-2 border flex justify-between items-center">
          <div>
            <a href={contest.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              <strong>{contest.title}</strong>
            </a>
            <span> - {new Date(contest.startTime).toLocaleString()}</span>
            <span className="text-green-500 block text-[12px]">Starts in: {Math.floor(contest.timeRemaining / 86400)}d {Math.floor((contest.timeRemaining % 86400) / 3600)}h {Math.floor((contest.timeRemaining % 3600) / 60)}m {contest.timeRemaining % 60}s</span>
          </div>
          <button onClick={() => toggleBookmark(contest)} className="p-2 rounded-md bg-yellow-400">
            {bookmarked.includes(contest._id) ? <AiFillBook /> : <AiOutlineBook />}
          </button>
        </div>
      ))}

      <h3 className="text-lg font-semibold mt-6">Completed Contests</h3>
      <ul>
        {completedContests.length > 0 ? (
          completedContests.map((contest) => (
            <li key={contest._id} className="mt-2 p-2 border flex justify-between items-center">
              <div>
                <a href={contest.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  <strong>{contest.title}</strong>
                </a>
                <span> - {new Date(contest.startTime).toLocaleString()}</span>
              </div>
              <div className="flex gap-2">
                {solutions[contest._id] ? (
                  <a 
                    href={solutions[contest._id]} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="p-2 rounded-md bg-red-600 text-white flex items-center gap-2"
                    title="Watch solution video"
                  >
                    <AiOutlineYoutube />
                  </a>
                ) : (
                  <span className="p-2 rounded-md bg-red-300 text-gray-600 flex items-center gap-2 cursor-not-allowed">
                    <AiOutlineYoutube />
                  </span>
                )}
                <button onClick={() => toggleBookmark(contest)} className="p-2 rounded-md bg-yellow-400">
                  {bookmarked.includes(contest._id) ? <AiFillBook /> : <AiOutlineBook />}
                </button>
              </div>
            </li>
          ))
        ) : (
          <p>No completed contests.</p>
        )}
      </ul>
    </div>
  );
};

export default ContestList;