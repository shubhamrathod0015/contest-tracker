import React, { useState, useContext } from "react";
import {
  TextField, Button, Container, Typography, Card,
  Snackbar, Alert, Box, InputAdornment, IconButton, useMediaQuery
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function Login() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    showPassword: false,
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const navigate = useNavigate();

  // Validation functions
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) => 
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);

  const handleInputChange = (field) => (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    let newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!validatePassword(formData.password)) {
      newErrors.password = "Password must have 8+ chars, 1 uppercase, 1 number & 1 special char";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await login(formData.email, formData.password);
      setSnackbar({
        open: true,
        message: "🎉 Login Successful! Redirecting...",
        severity: "success"
      });
      setTimeout(() => navigate("/"), 1200);
    } catch (err) {
      setSnackbar({
        open: true,
        message: "⚠️ Login Failed! Please check credentials",
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
        maxWidth: 500,
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
          Welcome Back!
        </Typography>

        <Typography variant="body1" sx={{
          textAlign: 'center',
          color: '#6B7280',
          mb: 4,
          px: isMobile ? 1 : 3
        }}>
          Sign in to manage your coding contests and bookmarks
        </Typography>

        <form onSubmit={handleLogin}>
          {/* Email Field */}
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            value={formData.email}
            onChange={handleInputChange('email')}
            error={!!errors.email}
            helperText={errors.email}
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon sx={{ color: '#5A57EB' }} />
                </InputAdornment>
              ),
              sx: { borderRadius: 3 }
            }}
          />

          {/* Password Field */}
          <TextField
            fullWidth
            label="Password"
            type={formData.showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleInputChange('password')}
            error={!!errors.password}
            helperText={errors.password}
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon sx={{ color: '#5A57EB' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      showPassword: !prev.showPassword
                    }))}
                    edge="end"
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
            type="submit"
            sx={{
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
            Sign In
          </Button>
        </form>

        <Box sx={{
          textAlign: 'center',
          mt: 3,
          color: '#6B7280'
        }}>
          <Typography variant="body2">
            New user? {' '}
            <Button
              onClick={() => navigate('/signup')}
              sx={{
                color: '#EE4B82',
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': { background: 'none' }
              }}
            >
              Create Account
            </Button>
          </Typography>
        </Box>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
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
