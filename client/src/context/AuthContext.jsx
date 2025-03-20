import { createContext, useState, useEffect } from "react";
import axios from "axios";
import API from "../services/api";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user from localStorage on app start
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, []);



  const login = async (email, password) => {
    try { 
      const res = await API.post("/auth/login", { email, password });
      // console.log("User after login:", res);

      if (!res.data || !res.data.user || !res.data.accessToken) {
        throw new Error("Invalid login response from server.");
      }

      // Set user & store token
      setUser(res.data.user);

      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.accessToken);

      // Set Authorization header for future requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.accessToken}`;

    } catch (error) {
      console.error("Login failed:", error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || "Login failed. Please try again.");
    }
  };

  const signup = async (name, email, password) => {
    try {
      const res = await API.post("/auth/signup", { name, email, password });
  
      if (!res.data || !res.data.user || !res.data.accessToken) {
        throw new Error("Invalid signup response from server.");
      }
  
      // Set user & store token
      setUser(res.data.user);
  
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.accessToken);
  
      // Set Authorization header for future requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.accessToken}`;
  
    } catch (error) {
      console.error("Signup failed:", error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || "Signup failed. Please try again.");
    }
  };
  

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    // console.log("logout",user)
    // Remove token from axios headers
    delete axios.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider value={{ user,signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
