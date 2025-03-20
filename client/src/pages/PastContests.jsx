import React, { useEffect, useState, useContext } from "react";
import {
    Container, Typography, Select, MenuItem, Card, CardContent,
    Button, Box, IconButton, Grid, Tooltip, Snackbar, Alert,
    Stack, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
    CircularProgress
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { ContestContext } from "../context/ContestContext";

export default function PastContests() {
    const [platforms, setPlatforms] = useState([]);
    const [bookmarked, setBookmarked] = useState({});
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [solutionURL, setSolutionURL] = useState("");
    const [selectedContestId, setSelectedContestId] = useState(null);

    const { user } = useContext(AuthContext);
    const { contests, loading, fetchContests } = useContext(ContestContext);


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
            setSnackbarMessage("Bookmark removed ❌");
      
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
        console.log("past", platform)
        fetchContests("past", platform); // Fetch contests when platforms change
    }, [platforms]);

    const fetchSolution = async (contestId) => {
        try {
            const res = await API.get(`/solutions/${contestId}`);
            if (res.data.solutionLink) {
                window.open(res.data.solutionLink, "_blank");
            } else {
                setSnackbarMessage("No solution available for this contest.");
                setOpenSnackbar(true);
            }
        } catch (err) {
            setSnackbarMessage("No solution available for this contest.");
            setOpenSnackbar(true);
        }
    };

    const openSolutionDialog = (contestId) => {
        setSelectedContestId(contestId);
        setSolutionURL("");
        setDialogOpen(true);
    };

    const handleAddSolution = async () => {
        if (!solutionURL.trim()) {
            setSnackbarMessage("Please enter a valid solution URL.");
            setOpenSnackbar(true);
            return;
        }

        try {
            await API.post(`/solutions/${selectedContestId}`, { solutionLink: solutionURL });
            setSnackbarMessage("Solution added successfully! ✅");
            setDialogOpen(false);
        } catch (err) {
            console.error("Error adding solution:", err);
            setSnackbarMessage("Failed to add solution. Try again.");
        }
        setOpenSnackbar(true);
    };

    const formatDuration = (durationMs) => {
        const hours = Math.floor(durationMs / 3600000);
        const minutes = Math.floor((durationMs % 3600000) / 60000);
        return `${hours}h:${minutes}m`;
    };

    const platformNames = {
        "codeforces.com": { name: "Codeforces", color: "blue" },
        "leetcode.com": { name: "Leetcode", color: "orange" },
        "codechef.com": { name: "CodeChef", color: "Brown" },
    };
    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom align="center">
            🏁 Past Contests
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
                                <span key={value} style={{ color: platformNames[value]?.color  }}>
                                    {platformNames[value]?.name  || value}
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

                                        <Typography variant="body2" color="textSecondary" mt={1}>
                                            📅 Ended on: {new Date(contest.startTime).toLocaleDateString()}
                                        </Typography>

                                        <Stack
                                            direction={{ xs: "column", sm: "row" }}
                                            spacing={2}
                                            sx={{ mt: 2 }}
                                        >
                                            <Button variant="contained" color="primary" href={contest.href} target="_blank" sx={{ borderRadius: 2, flex: 1 }}>
                                                Go to Contest
                                            </Button>

                                            <Button
                                                variant="contained"
                                                color="secondary"
                                                onClick={() => fetchSolution(contest.id)}
                                                startIcon={<PlayCircleOutlineIcon />}
                                                sx={{ borderRadius: 2, flex: 1 }}
                                            >
                                                View Solution
                                            </Button>

                                            {user?.role === "ADMIN" && (
                                                <Button
                                                    variant="outlined"
                                                    color="success"
                                                    startIcon={<AddCircleOutlineIcon />}
                                                    onClick={() => openSolutionDialog(contest.id)}
                                                    sx={{ borderRadius: 2, flex: 1 }}
                                                >
                                                    Add Solution
                                                </Button>
                                            )}
                                        </Stack>
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

<Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle>Add Solution Link</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Solution URL"
                        fullWidth
                        margin="dense"
                        value={solutionURL}
                        onChange={(e) => setSolutionURL(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddSolution} variant="contained" color="primary">
                        Add Solution
                    </Button>
                </DialogActions>
            </Dialog>

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



// import React, { useEffect, useState, useContext } from "react";
// import {
//   Container, Typography, Select, MenuItem, Card, CardContent,
//   Button, Box, IconButton, Grid, Tooltip, Snackbar, Alert,
//   CircularProgress, useMediaQuery, Chip
// } from "@mui/material";
// import { useTheme } from "@mui/material/styles";
// import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
// import FavoriteIcon from "@mui/icons-material/Favorite";
// import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
// import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
// import API from "../services/api";
// import { AuthContext } from "../context/AuthContext";
// import { ContestContext } from "../context/ContestContext";

// const platformConfig = {
//   "codeforces.com": { name: "Codeforces", color: "#6D28D9", bgColor: "#EDE9FE" },
//   "leetcode.com": { name: "LeetCode", color: "#DB2777", bgColor: "#FCE7F3" },
//   "codechef.com": { name: "CodeChef", color: "#0D9488", bgColor: "#CCFBF1" }
// };

// export default function PastContests() {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
//   const [state, setState] = useState({
//     platforms: [],
//     bookmarked: {},
//     dialogOpen: false,
//     solutionURL: "",
//     selectedContestId: null,
//     snackbar: { open: false, message: "" }
//   });

//   const { user } = useContext(AuthContext);
//   const { contests, loading, fetchContests } = useContext(ContestContext);

//   // Keep existing useEffect and logic functions

//   return (
//     <Container maxWidth="lg" sx={{ py: isMobile ? 3 : 5 }}>
//       <Typography variant="h3" sx={{
//         fontWeight: 800,
//         color: '#1E1B4B',
//         textAlign: 'center',
//         mb: 4,
//         fontSize: isMobile ? '2rem' : '2.5rem'
//       }}>
//         🏁 Past Contests
//       </Typography>

//       <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
//         <Select
//           multiple
//           value={state.platforms}
//           onChange={(e) => setState(prev => ({ ...prev, platforms: e.target.value }))}
//           displayEmpty
//           variant="outlined"
//           sx={{
//             width: isMobile ? '100%' : 400,
//             borderRadius: 3,
//             bgcolor: 'white',
//             boxShadow: 2
//           }}
//           renderValue={(selected) => (
//             selected.length === 0 ? 'All Platforms' :
//             selected.map(value => (
//               <Chip
//                 key={value}
//                 label={platformConfig[value].name}
//                 sx={{
//                   m: 0.5,
//                   bgcolor: platformConfig[value].bgColor,
//                   color: platformConfig[value].color
//                 }}
//               />
//             ))
//           }
//         >
//           {Object.entries(platformConfig).map(([value, { name, color }]) => (
//             <MenuItem key={value} value={value}>
//               <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
//                 <Box sx={{
//                   width: 12,
//                   height: 12,
//                   borderRadius: '50%',
//                   bgcolor: color
//                 }} />
//                 {name}
//               </Box>
//             </MenuItem>
//           ))}
//         </Select>
//       </Box>

//       {loading ? (
//         <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
//           <CircularProgress size={60} thickness={4} sx={{ color: '#6D28D9' }} />
//         </Box>
//       ) : contests.length > 0 ? (
//         <Grid container spacing={3}>
//           {contests.map((contest) => (
//             <Grid item xs={12} key={contest.id}>
//               <Card sx={{
//                 borderRadius: 4,
//                 boxShadow: '0 4px 20px rgba(109,40,217,0.1)',
//                 transition: 'transform 0.3s ease',
//                 '&:hover': { transform: 'translateY(-5px)' }
//               }}>
//                 <CardContent>
//                   <Box sx={{
//                     display: 'flex',
//                     flexDirection: isMobile ? 'column' : 'row',
//                     justifyContent: 'space-between',
//                     gap: 2
//                   }}>
//                     {/* Contest Details */}
//                     <Box sx={{ flex: 1 }}>
//                       <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
//                         <Typography variant="h6" sx={{ fontWeight: 700, color: '#1E1B4B' }}>
//                           {contest.event}
//                         </Typography>
//                         <Tooltip title={state.bookmarked[contest.id] ? "Bookmarked" : "Bookmark"}>
//                           <IconButton onClick={() => toggleBookmark(contest)}>
//                             {state.bookmarked[contest.id] ? (
//                               <FavoriteIcon sx={{ color: '#DB2777' }} />
//                             ) : (
//                               <FavoriteBorderIcon sx={{ color: '#6B7280' }} />
//                             )}
//                           </IconButton>
//                         </Tooltip>
//                       </Box>

//                       <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 1 }}>
//                         <Typography variant="body2" sx={{ color: '#6B7280' }}>
//                           📅 Ended on: {new Date(contest.startTime).toLocaleDateString()}
//                         </Typography>
//                         <Typography variant="body2" sx={{ color: '#6B7280' }}>
//                           ⏳ {formatDuration(contest.duration * 1000)}
//                         </Typography>
//                       </Box>
//                     </Box>

//                     {/* Action Buttons */}
//                     <Box sx={{
//                       display: 'flex',
//                       flexDirection: isMobile ? 'column' : 'row',
//                       gap: 2,
//                       minWidth: isMobile ? '100%' : 300
//                     }}>
//                       <Button
//                         variant="contained"
//                         href={contest.href}
//                         target="_blank"
//                         sx={{
//                           bgcolor: '#6D28D9',
//                           '&:hover': { bgcolor: '#5B21B6' },
//                           borderRadius: 3,
//                           py: 1.5
//                         }}
//                       >
//                         Contest Details
//                       </Button>
//                       <Button
//                         variant="outlined"
//                         onClick={() => fetchSolution(contest.id)}
//                         startIcon={<PlayCircleOutlineIcon />}
//                         sx={{
//                           borderColor: '#6D28D9',
//                           color: '#6D28D9',
//                           borderRadius: 3,
//                           py: 1.5
//                         }}
//                       >
//                         Solutions
//                       </Button>
//                       {user?.role === "ADMIN" && (
//                         <Button
//                           variant="text"
//                           onClick={() => openSolutionDialog(contest.id)}
//                           startIcon={<AddCircleOutlineIcon />}
//                           sx={{ color: '#0D9488', borderRadius: 3 }}
//                         >
//                           Add Solution
//                         </Button>
//                       )}
//                     </Box>
//                   </Box>
//                 </CardContent>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>
//       ) : (
//         <Typography variant="body1" align="center" sx={{ color: '#64748B', mt: 4 }}>
//           No past contests found for selected platforms
//         </Typography>
//       )}

//       {/* Keep dialog and snackbar components from original */}

//       <Snackbar
//         open={state.snackbar.open}
//         autoHideDuration={4000}
//         onClose={() => setState(prev => ({ ...prev, snackbar: { ...prev.snackbar, open: false }))}
//         anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
//       >
//         <Alert
//           severity={state.snackbar.severity}
//           sx={{
//             borderRadius: 3,
//             bgcolor: state.snackbar.severity === 'error' ? '#FEE2E2' : '#DCFCE7',
//             color: state.snackbar.severity === 'error' ? '#991B1B' : '#166534'
//           }}
//         >
//           {state.snackbar.message}
//         </Alert>
//       </Snackbar>
//     </Container>
//   );
// }

// const formatDuration = (durationMs) => {
//   const hours = Math.floor(durationMs / 3600000);
//   const minutes = Math.floor((durationMs % 3600000) / 60000);
//   return `${hours}h ${minutes}m`;
// };