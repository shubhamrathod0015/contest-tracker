import React, { useContext, useState } from "react";
import {
    TextField, Button, Container, Typography, Card,
    Snackbar, Alert, Box, InputAdornment, IconButton, useMediaQuery
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { AuthContext } from "../context/AuthContext";

export default function Signup() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const { signup } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        showPassword: false,
    });
    const [errors, setErrors] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const navigate = useNavigate();

    // Validation Functions
    const validateName = (name) => name.length >= 3;
    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const validatePassword = (password) =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);

    const handleSignup = async () => {
        // Reset errors
        setErrors({ name: "", email: "", password: "" });

        let isValid = true;
        const newErrors = {};

        if (!formData.name) {
            newErrors.name = "Full name is required";
            isValid = false;
        } else if (!validateName(formData.name)) {
            newErrors.name = "Full name must be at least 3 characters";
            isValid = false;
        }

        if (!formData.email) {
            newErrors.email = "Email is required";
            isValid = false;
        } else if (!validateEmail(formData.email)) {
            newErrors.email = "Invalid email format";
            isValid = false;
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
            isValid = false;
        } else if (!validatePassword(formData.password)) {
            newErrors.password = "Password must have 8+ chars, 1 uppercase, 1 number & 1 special char";
            isValid = false;
        }

        if (!isValid) return setErrors(newErrors);

        try {
            await signup(formData.name, formData.email, formData.password);
            setSnackbar({
                open: true,
                message: "🎉 Account created! Redirecting...",
                severity: "success"
            });
            setTimeout(() => navigate("/"), 1500);
        } catch (err) {
            setSnackbar({
                open: true,
                message: "⚠️ Signup failed. Email may be taken.",
                severity: "error"
            });
        }
    };

    return (
        <Container maxWidth="md" sx={{ 
            py: isMobile ? 4 : 8,
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <Card sx={{ 
                p: isMobile ? 2 : 4,
                width: '100%',
                maxWidth: 600,
                borderRadius: 4,
                boxShadow: '0px 10px 25px rgba(90, 87, 235, 0.1)',
                background: 'linear-gradient(145deg, #f8f9ff, #ffffff)',
                transition: 'transform 0.3s ease',
                '&:hover': {
                    transform: 'translateY(-5px)'
                }
            }}>
                <Typography variant="h3" sx={{ 
                    fontWeight: 700,
                    textAlign: 'center',
                    color: '#5A57EB',
                    fontSize: isMobile ? '1.75rem' : '2.25rem',
                    mb: 2
                }}>
                    Join Our Community
                </Typography>

                <Typography variant="body1" sx={{ 
                    textAlign: 'center',
                    color: '#6B7280',
                    mb: 4,
                    px: isMobile ? 1 : 3
                }}>
                    Create your account to track coding contests and bookmark favorites.
                </Typography>

                {/* Name Input */}
                <TextField
                    label="Full Name"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    error={!!errors.name}
                    helperText={errors.name}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <PersonIcon sx={{ color: '#5A57EB' }} />
                            </InputAdornment>
                        ),
                        sx: { borderRadius: 3 }
                    }}
                />

                {/* Email Input */}
                <TextField
                    label="Email"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    error={!!errors.email}
                    helperText={errors.email}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <EmailIcon sx={{ color: '#5A57EB' }} />
                            </InputAdornment>
                        ),
                        sx: { borderRadius: 3 }
                    }}
                />

                {/* Password Input */}
                <TextField
                    label="Password"
                    type={formData.showPassword ? "text" : "password"}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    error={!!errors.password}
                    helperText={errors.password}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <LockIcon sx={{ color: '#5A57EB' }} />
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton 
                                    onClick={() => setFormData({ ...formData, showPassword: !formData.showPassword })}
                                    sx={{ color: '#5A57EB' }}
                                >
                                    {formData.showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                        sx: { borderRadius: 3 }
                    }}
                />

                <Button
                    fullWidth
                    variant="contained"
                    onClick={handleSignup}
                    sx={{
                        mt: 3,
                        py: 1.5,
                        borderRadius: 3,
                        fontSize: '1rem',
                        fontWeight: 600,
                        background: '#5A57EB',
                        '&:hover': {
                            background: '#4F46E5',
                            transform: 'translateY(-2px)'
                        },
                        transition: 'all 0.3s ease'
                    }}
                >
                    Create Account
                </Button>

                <Box mt={2} sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ color: '#6B7280' }}>
                        Already have an account? {' '}
                        <Button 
                            onClick={() => navigate('/login')}
                            sx={{ 
                                color: '#EE4B82',
                                fontWeight: 600,
                                textTransform: 'none',
                                '&:hover': { background: 'none' }
                            }}
                        >
                            Sign In
                        </Button>
                    </Typography>
                </Box>

                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={4000}
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert 
                        severity={snackbar.severity}
                        sx={{ 
                            borderRadius: 3,
                            fontWeight: 500,
                            background: snackbar.severity === 'error' ? '#FEE2E2' : '#DCFCE7',
                            color: snackbar.severity === 'error' ? '#991B1B' : '#166534'
                        }}
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Card>
        </Container>
    );
}