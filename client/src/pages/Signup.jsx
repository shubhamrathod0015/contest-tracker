import React, { useContext, useState } from "react";
import {
    TextField, Button, Container, Typography, Card,
    Snackbar, Alert, Box, InputAdornment, IconButton
} from "@mui/material";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { AuthContext } from "../context/AuthContext";

export default function Signup() {
    const { signup } = useContext(AuthContext);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");

    const [nameError, setNameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const navigate = useNavigate();

    // Validation Functions
    const validateName = (name) => name.length >= 3;
    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const validatePassword = (password) =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);

    const handleSignup = async () => {
        // Reset errors
        setNameError("");
        setEmailError("");
        setPasswordError("");

        let isValid = true;

        if (!name) {
            setNameError("Full name is required");
            isValid = false;
        } else if (!validateName(name)) {
            setNameError("Full name must be at least 3 characters");
            isValid = false;
        }

        if (!email) {
            setEmailError("Email is required");
            isValid = false;
        } else if (!validateEmail(email)) {
            setEmailError("Invalid email format");
            isValid = false;
        }

        if (!password) {
            setPasswordError("Password is required");
            isValid = false;
        } else if (!validatePassword(password)) {
            setPasswordError("Password must have 8+ chars, 1 uppercase, 1 number & 1 special char");
            isValid = false;
        }

        if (!isValid) return;

        try {

            await signup(name,email, password);
            setSnackbarMessage("✅ Signup Successful! Redirecting...");
            setSnackbarSeverity("success");
            setOpenSnackbar(true);
            setTimeout(() => navigate("/"), 1500);
        } catch (err) {
            console.error("Signup Error:", err.response ? err.response.data : err);
            setSnackbarMessage("❌ Signup Failed! User may already exist.");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Card sx={{ p: 4, borderRadius: 3, boxShadow: 5, textAlign: "center" }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
                    ✨ Create an Account
                </Typography>

                <Typography variant="body2" color="textSecondary" mb={3}>
                    Sign up to track upcoming contests and bookmark them easily.
                </Typography>

                {/* Name Input */}
                <TextField
                    label="Full Name"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    error={!!nameError}
                    helperText={nameError}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <PersonIcon color="primary" />
                            </InputAdornment>
                        ),
                    }}
                />

                {/* Email Input */}
                <TextField
                    label="Email"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={!!emailError}
                    helperText={emailError}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <EmailIcon color="primary" />
                            </InputAdornment>
                        ),
                    }}
                />

                {/* Password Input with Toggle Visibility */}
                <TextField
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={!!passwordError}
                    helperText={passwordError}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <LockIcon color="primary" />
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

                {/* Signup Button */}
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 3, borderRadius: 2, py: 1.5, fontSize: "1rem" }}
                    onClick={handleSignup}
                >
                    Signup
                </Button>

                {/* Snackbar for Success/Error Messages */}
                <Snackbar
                    open={openSnackbar}
                    autoHideDuration={3000}
                    onClose={() => setOpenSnackbar(false)}
                    anchorOrigin={{ vertical: "top", horizontal: "center" }}
                >
                    <Alert severity={snackbarSeverity} sx={{ width: "100%" }}>
                        {snackbarMessage}
                    </Alert>
                </Snackbar>

                {/* Login Suggestion */}
                <Box mt={2}>
                    <Typography variant="body2">
                        Already have an account?{" "}
                        <Button variant="text" color="secondary" onClick={() => navigate("/login")}>
                            Login
                        </Button>
                    </Typography>
                </Box>
            </Card>
        </Container>
    );
}
