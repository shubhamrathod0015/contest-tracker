import { createContext, useState, useEffect } from "react";
import API from "../services/api";

const ContestContext = createContext();

const ContestProvider = ({ children }) => {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchContests = async (type, platform ) => {
    setLoading(true);
    setError("");
    try {
      // console.log("context",type,platform)
      const response = await API.get(`/contests?type=${type}&platforms=${platform}`);
      setContests(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch contests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContests(); // Fetch upcoming contests on mount
  }, []);

  return (
    <ContestContext.Provider value={{ contests, loading, error, fetchContests }}>
      {children}
    </ContestContext.Provider>
  );
};

export { ContestContext, ContestProvider };
