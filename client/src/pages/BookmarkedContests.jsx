
import React, { useEffect, useState, useContext } from "react";
import {
    Container, Typography, Card, CardContent, Button, Box,
    IconButton, Grid, Snackbar, Alert, Tooltip, Stack, Dialog,
    DialogTitle, DialogContent, DialogActions, TextField
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import API from "../services/api";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function BookmarkedContests() {
    const [bookmarks, setBookmarks] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedContestId, setSelectedContestId] = useState(null);
    const [solutionURL, setSolutionURL] = useState("");

    useEffect(() => {
        if (!user) {
            setSnackbarMessage("Please log in to view bookmarks!");
            setOpenSnackbar(true);

            setTimeout(() => {
                navigate("/login");
            }, 1500); // Redirect after 1.5 seconds
            return;
        }

        async function fetchBookmarkedContests() {
            try {
                const res = await API.get("/bookmarks");
                setBookmarks(res.data); // Assuming the API returns an array of contests
            } catch (err) {
                console.error("Error fetching bookmarks:", err);
                setSnackbarMessage("Failed to load bookmarks.");
                setOpenSnackbar(true);
            }
        }
        fetchBookmarkedContests();
    }, [user, navigate]);

    const removeBookmark = async (contestId) => {
        try {
            await API.delete(`/bookmarks/${contestId}`);
            setBookmarks(bookmarks.filter((contest) => contest.contestId !== contestId));
            setSnackbarMessage("Bookmark removed ❌");
            setOpenSnackbar(true);
        } catch (err) {
            console.error("Error removing bookmark:", err);
            setSnackbarMessage("Something went wrong. Try again.");
            setOpenSnackbar(true);
        }
    };

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
            setSnackbarMessage("Please enter a valid solution link.");
            setOpenSnackbar(true);
            return;
        }

        try {
            await API.post("/solutions", {
                contestId: selectedContestId,
                solutionLink: solutionURL,
            });
            setSnackbarMessage("Solution added successfully ✅");
            setOpenSnackbar(true);
            setDialogOpen(false);
        } catch (err) {
            console.error("Error adding solution:", err);
            setSnackbarMessage("Failed to add solution.");
            setOpenSnackbar(true);
        }
    };

    const formatDuration = (durationMs) => {
        const hours = Math.floor(durationMs / 3600000);
        const minutes = Math.floor((durationMs % 3600000) / 60000);
        return `${hours}h ${minutes}m`;
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom align="center">
                📌 Bookmarked Contests
            </Typography>

            {bookmarks.length > 0 ? (
                <Grid container spacing={3}>
                    {bookmarks.map((contest) => (
                        <Grid item xs={12} key={contest.contestId}>
                            <Card sx={{ p: 2, borderRadius: 3, boxShadow: 3 }}>
                                <CardContent>
                                    <Box display="flex" justifyContent="space-between" alignItems="center">
                                        <Typography variant="h6" fontWeight="bold">
                                            {contest.name}
                                        </Typography>

                                        <Box display="flex" alignItems="center">
                                            {/* ⏳ Duration */}
                                            <Typography variant="body2" color="textSecondary" sx={{ mr: 2 }}>
                                                ⏳ {formatDuration(contest.duration*1000)}
                                            </Typography>

                                            {/* Bookmark Icon */}
                                            <Tooltip title="Remove Bookmark">
                                                <IconButton onClick={() => removeBookmark(contest.contestId)}>
                                                    <FavoriteIcon color="error" />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>

                                    </Box>

                                    <Typography variant="body2" color="textSecondary" mt={1}>
                                        📅 Date: {new Date(contest.startTime).toLocaleDateString()}
                                    </Typography>
                                    <Stack
                                        direction={{ xs: "column", sm: "row" }}
                                        spacing={2}
                                        sx={{ mt: 2 }}
                                    >
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            href={contest.platform === "Codeforces"
                                                ? "https://codeforces.com/contests"
                                                : contest.platform === "Leetcode"
                                                    ? "https://leetcode.com/contest/"
                                                    : "https://www.codechef.com/contests"}
                                            target="_blank"
                                            fullWidth
                                            sx={{ borderRadius: 2, flex: 1 }}
                                        >
                                            Go to Contest
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => fetchSolution(contest.contestId)}
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
                                                onClick={() => openSolutionDialog(contest.contestId)}
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
                    No contests bookmarked yet.
                </Typography>
            )}

            {/* Add Solution Dialog */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle>Add Solution Link</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Solution URL"
                        fullWidth
                        variant="outlined"
                        value={solutionURL}
                        onChange={(e) => setSolutionURL(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleAddSolution} color="primary">
                        Add
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar Notification */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={2000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert severity="info" sx={{ width: "100%" }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
}
