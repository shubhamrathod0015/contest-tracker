import React, { useContext, useState } from "react";
import { 
  AppBar, Toolbar, Typography, Button, IconButton, 
  Menu, MenuItem, useMediaQuery, Box
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { AuthContext } from "../context/AuthContext";
import MenuIcon from "@mui/icons-material/Menu";
import CodeIcon from "@mui/icons-material/Code";
import { styled } from "@mui/material/styles";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { mode, toggleTheme } = useContext(ThemeContext);
  const { logout } = useContext(AuthContext);
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = async () => {
    await logout();
    handleMenuClose();
    navigate("/");
  };

  const BrandButton = styled(Button)(({ theme }) => ({
    color: "white",
    textTransform: "none",
    fontSize: "1.25rem",
    fontWeight: 700,
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.08)",
    },
  }));

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Past Contests", path: "/contests/past" },
    { label: "Bookmarks", path: "/bookmarks" },
  ];

  return (
    <AppBar 
      position="sticky"
      sx={{ 
        background: mode === "light" 
          ? "linear-gradient(135deg, #6D28D9 0%, #4C1D95 100%)" 
          : "#1E1B4B",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        py: 1
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Left Side - Brand */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <CodeIcon sx={{ fontSize: 32 }} />
          <BrandButton
            component={Link}
            to="/"
            startIcon={null}
            disableRipple
          >
            CodeTrack
          </BrandButton>
        </Box>

        {/* Right Side - Navigation */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {!isMobile ? (
            <>
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  component={Link}
                  to={item.path}
                  sx={{
                    color: "white",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      transform: "translateY(-1px)",
                    },
                    transition: "all 0.2s ease",
                    borderRadius: "8px",
                    px: 2,
                    py: 1
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </>
          ) : (
            <IconButton
              color="inherit"
              onClick={handleMenuOpen}
              sx={{ ml: "auto" }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Theme Toggle */}
          <IconButton 
            color="inherit" 
            onClick={toggleTheme} 
            sx={{ 
              ml: 2,
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)"
              }
            }}
          >
            {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>

          {/* Auth Buttons - Desktop */}
          {!isMobile && (
            <Box sx={{ display: "flex", gap: 1, ml: 2 }}>
              {token ? (
                <Button
                  variant="outlined"
                  onClick={handleLogout}
                  sx={{
                    color: "white",
                    borderColor: "white",
                    "&:hover": {
                      backgroundColor: "#EC4899",
                      borderColor: "#EC4899"
                    }
                  }}
                >
                  Logout
                </Button>
              ) : (
                <>
                  <Button
                    component={Link}
                    to="/login"
                    variant="outlined"
                    sx={{
                      color: "white",
                      borderColor: "white",
                      "&:hover": {
                        backgroundColor: "#4F46E5"
                      }
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    component={Link}
                    to="/signup"
                    variant="contained"
                    sx={{
                      background: "#EC4899",
                      "&:hover": {
                        background: "#DB2777"
                      }
                    }}
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </Box>
          )}
        </Box>

        {/* Mobile Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              background: mode === "light" ? "#F5F3FF" : "#1E1B4B",
              minWidth: 200
            }
          }}
        >
          {navItems.map((item) => (
            <MenuItem
              key={item.label}
              component={Link}
              to={item.path}
              onClick={handleMenuClose}
              sx={{
                color: mode === "light" ? "#4C1D95" : "white",
                "&:hover": {
                  backgroundColor: mode === "light" ? "#EDE9FE" : "#312E81"
                }
              }}
            >
              {item.label}
            </MenuItem>
          ))}
          
          {/* Mobile Auth Buttons */}
          {token ? (
            <MenuItem
              onClick={handleLogout}
              sx={{
                color: "#EC4899",
                "&:hover": {
                  backgroundColor: mode === "light" ? "#FCE7F3" : "#4C1D95"
                }
              }}
            >
              Logout
            </MenuItem>
          ) : (
            <>
              <MenuItem
                component={Link}
                to="/login"
                onClick={handleMenuClose}
                sx={{
                  color: mode === "light" ? "#4C1D95" : "white",
                  "&:hover": {
                    backgroundColor: mode === "light" ? "#EDE9FE" : "#312E81"
                  }
                }}
              >
                Login
              </MenuItem>
              <MenuItem
                component={Link}
                to="/signup"
                onClick={handleMenuClose}
                sx={{
                  color: "#EC4899",
                  "&:hover": {
                    backgroundColor: mode === "light" ? "#FCE7F3" : "#4C1D95"
                  }
                }}
              >
                Sign Up
              </MenuItem>
            </>
          )}
        </Menu>
      </Toolbar>
    </AppBar>
  );
}