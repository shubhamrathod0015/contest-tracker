import React, { useEffect, useState, useContext } from "react";
import {
  Container, Typography, Select, MenuItem,
  Card, CardContent, Button, Box, IconButton,
  Grid, CircularProgress, Tooltip, Snackbar, Alert
} from "@mui/material";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { ContestContext } from "../context/ContestContext";

export default function Home() {
  // const [contests, setContests] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [timeLeft, setTimeLeft] = useState({});
  const [bookmarked, setBookmarked] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState(""); // Snackbar message

  const { user } = useContext(AuthContext);
  const { contests, loading, fetchContests } = useContext(ContestContext);


  const fetchBookmarks = async () => {
    if (!user) return;

    try {
      const res = await API.get("/bookmarks");
      const bookmarksData = res.data.reduce((acc, contest) => {
        acc[contest.contestId] = contest; // Store full contest data
        return acc;
      }, {});
      setBookmarked(bookmarksData);
    } catch (err) {
      console.error("Error fetching bookmarks", err);
    }
  };
  // Fetch when user logs in
  useEffect(() => {
    if (user) {
      fetchBookmarks();
    }
  }, [user]);

  useEffect(() => {
    const platform = platforms.length > 0 ? platforms.join(",") : "";
    // console.log("in", platform)
    fetchContests("upcoming", platform); // Fetch contests when platforms change
  }, [platforms]);


  useEffect(() => {
    const updateCountdown = () => {
      const updatedTimeLeft = {};
      contests.forEach((contest) => {
        updatedTimeLeft[contest.id] = getRemainingTime(contest.start);
      });
      setTimeLeft(updatedTimeLeft);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000); // Update every second
    return () => clearInterval(interval); // Cleanup on unmount
  }, [contests]);


  const getRemainingTime = (startTime) => {
    const now = new Date();
    const contestStart = new Date(startTime);
    const diff = contestStart - now; // Difference in milliseconds

    if (diff <= 0) return "Started"; // If the contest has already started

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `${hours}h : ${minutes}m : ${seconds}s`;
  };


  const toggleBookmark = async (contest) => {
    if (!user ) {
      setSnackbarMessage("Please sign in to bookmark contests.");
      setOpenSnackbar(true);
      return;
    }
  
    try {
      const contestId = contest.id;
      const isBookmarked = !!bookmarked[contestId]; // Convert to boolean
  
      if (isBookmarked) {
        // Remove bookmark from API
        await API.delete(`/bookmarks/${contestId}` , { headers: { Authorization: `Bearer ${user.token}`} });
        setSnackbarMessage("Bookmark removed ");
  
        // Update local state
        setBookmarked((prev) => {
          const updated = { ...prev };
          delete updated[contestId];
          return updated;
        });
      } else {
        // Add bookmark to API
        await API.post("/bookmarks", {
          contestId: contest.id,
          name: contest.event,
          platform: platformNames[contest.host]?.name,
          startTime: new Date(contest.start).toISOString(),
          duration: contest.duration,
        }, {headers: { Authorization: `Bearer ${user.token}`} });
  
        setSnackbarMessage("Contest bookmarked! ✅");
  
        // Update local state
        setBookmarked((prev) => ({
          ...prev,
          [contestId]: contest, // Store full contest data
        }));
      }
  
      setOpenSnackbar(true);
    } catch (err) {
      console.error("Error toggling bookmark:", err);
      setSnackbarMessage("Something went wrong. Try again.");
      setOpenSnackbar(true);
    }
  };
  

  const formatDuration = (durationMs) => {
    const hours = Math.floor(durationMs / 3600000);
    const minutes = Math.floor((durationMs % 3600000) / 60000);
    return `${hours}h : ${minutes}m`;
  };

  const platformNames = {
    "codeforces.com": { name: "Codeforces", color: "blue" },
    "leetcode.com": { name: "Leetcode", color: "orange" },
    "codechef.com": { name: "CodeChef", color: "Brown" },
  };
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom align="center">
      🚀 Upcoming Challenges
      </Typography>

      <Box display="flex" justifyContent="right" mb={3}>
        <Select
          multiple
          value={platforms}  // platforms state should be an array of selected platforms
          onChange={(e) => setPlatforms(e.target.value)}  // Update with selected values directly
          displayEmpty
          variant="outlined"
          sx={{ width: 300, borderRadius: 2 }}
          renderValue={(selected) =>
            selected.length === 0
              ? "All Platforms" // Default display when nothing is selected
              : selected.map((value) => (
                <span key={value} style={{ color: platformNames[value]?.color }}>
                  {platformNames[value]?.name || value}
                </span>
              ))
          }
        >

          {Object.entries(platformNames).map(([value, { name, color }]) => (
            <MenuItem key={value} value={value}>
              <span style={{ color }}>{name}</span>
            </MenuItem>
          ))}
        </Select>

      </Box>

      {/* Loading Indicator */}
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
          <CircularProgress size={50} />
        </div>
      ) :
        (contests.length > 0 ? (
          <Grid container spacing={3}>
            {contests.map((contest) => (

              <Grid item xs={12} key={contest.id}>
                <Card sx={{ p: 2, borderRadius: 3, boxShadow: 3 }}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="h6" fontWeight="bold">
                        {contest.event}
                      </Typography>

                      <Box display="flex" alignItems="center">
                        {/* ⏳ Duration */}
                        <Typography variant="body2" color="textSecondary" sx={{ mr: 2 }}>
                          ⏳ {formatDuration(contest.duration * 1000)}
                        </Typography>

                        {/* Bookmark Icon */}
                        <Tooltip title={bookmarked[contest.id] ? "Bookmarked" : "Bookmark"}>
                          <IconButton onClick={() => toggleBookmark(contest)}>
                            {bookmarked[contest.id] ? (
                              <FavoriteIcon color="error" />
                            ) : (
                              <FavoriteBorderIcon />
                            )}
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>

                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <Typography variant="body2" color="textSecondary" mt={1}>
                        📅 Date: {new Date(contest.start).toLocaleDateString()}
                      </Typography>
                      <Typography key={contest.id} variant="h6" sx={{ color: platformNames[contest.host].color, fontWeight: "bold", align: "right" }}>
                        {platformNames[contest.host]?.name}{/* Convert platform name */}
                      </Typography>
                    </Box>


                    <Box display="flex" alignItems="center" mt={1}>
                      <AccessTimeIcon sx={{ color: "primary.main", mr: 1 }} />
                      <Typography
                        variant="body1"
                        color={timeLeft[contest.id] === "Started" ? "error" : "primary"}
                        fontWeight="bold"
                      >
                        {timeLeft[contest.id] || <CircularProgress size={20} />}
                      </Typography>
                    </Box>


                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      sx={{ mt: 2, borderRadius: 2 }}
                      href={contest.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Join Contest
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="body2" align="center" mt={3}>
            No contests available for the selected platforms.
          </Typography>
        ))}

      {/* Snackbar for Bookmark Messages */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={user ? "success" : "warning"} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}
