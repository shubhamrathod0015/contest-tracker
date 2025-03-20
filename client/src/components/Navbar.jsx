import React, { useContext } from "react";
import { AppBar, Toolbar, Typography, Button, IconButton } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { mode, toggleTheme } = useContext(ThemeContext);
  const { logout } = useContext(AuthContext);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Contest Tracker
        </Typography>

        <Button color="inherit" component={Link} to="/
        ">
          Home
        </Button>
        <Button color="inherit" component={Link} to="/contests/past">
          Past Contests
        </Button>
        <Button color="inherit" onClick={() => navigate("/bookmarks")}>
          My Bookmarks
        </Button>


        {/* Theme Toggle */}
        <IconButton color="inherit" onClick={toggleTheme} sx={{ ml: 2 }}>
          {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
        </IconButton>

        {/* Auth Buttons */}
        {token ? (
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/login">Login</Button>
            <Button color="inherit" component={Link} to="/signup">Signup</Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}
