import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);


  // Function to decode JWT token safely
  const decodeToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return { id: payload.userId, email: payload.email };
    } catch (error) {
      console.error("Invalid token:", error);
      return null;
    }
  };

  // Load user from token
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        const decodedUser = decodeToken(token);
        if (decodedUser) {
          setUser(decodedUser);
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        } else {
          logout();
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  // Login function
  const login = async (email, password) => {
    try {
      const res = await axios.post("https://tle-tracker.onrender.com/api/auth/login", {
        email,
        password,
      });

      const { token, user } = res.data;
      
    

      // Save token to local storage
      localStorage.setItem("token", token);
      setToken(token);
      setUser(user);

      // Set axios default headers
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  // Register function
  const register = async (username, email, password) => {
    try {
      const res = await axios.post("https://tle-tracker.onrender.com/api/auth/register", {
        username,
        email,
        password,
      });

      const { token, user } = res.data;

      // Save token to local storage
      localStorage.setItem("token", token);
      setToken(token);
      setUser(user);

      // Set axios default headers
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
